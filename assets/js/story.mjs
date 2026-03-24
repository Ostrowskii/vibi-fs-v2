import {
  ARMOR_CATALOG,
  SHOP_LABELS,
  SKILL_BY_ID,
  SKILLS,
  campaignFightHref,
  campaignStateFromLocation,
  levelInfo,
  playerMaxHpFromArmor,
  previewPath,
  qs,
  skillCardMarkup,
  syncCampaignParams,
  loadoutToArray,
  loadoutFromArray,
} from './common.mjs';

const root = qs('#app');
const state = campaignStateFromLocation();
let modal = null;

function ownedSet() {
  return new Set(state.items);
}

function currentLevel() {
  return levelInfo(state.level);
}

function openModal(next) {
  modal = next;
  render();
}

function closeModal() {
  modal = null;
  render();
}

function persist() {
  syncCampaignParams(state);
}

function buySkill(skillId) {
  const skill = SKILL_BY_ID.get(skillId);
  if (!skill) return;
  if (ownedSet().has(skillId)) {
    openModal({type: 'warning', title: 'Skill ja comprada', body: 'Essa skill ja esta no inventario da campanha.'});
    return;
  }
  if (state.gold < skill.price) {
    openModal({type: 'warning', title: 'Gold insuficiente', body: `Voce precisa de ${skill.price}g para comprar ${skill.label}.`});
    return;
  }
  state.gold -= skill.price;
  state.items = [...state.items, skillId];
  persist();
  openModal({type: 'notice', title: 'Compra concluida', body: `${skill.label} foi adicionada ao inventario.`});
}

function buyArmor(key) {
  const armor = ARMOR_CATALOG.find((entry) => entry.key === key);
  if (!armor) return;
  if (state.armor[key]) {
    openModal({type: 'warning', title: 'Armadura ja equipada', body: `${armor.label} ja faz parte do seu kit.`});
    return;
  }
  if (state.gold < armor.price) {
    openModal({type: 'warning', title: 'Gold insuficiente', body: `Voce precisa de ${armor.price}g para comprar ${armor.label}.`});
    return;
  }
  state.gold -= armor.price;
  state.armor[key] = 1;
  persist();
  openModal({type: 'notice', title: 'Armadura adquirida', body: `${armor.label} agora reforca seu HP maximo.`});
}

function equipSkill(skillId) {
  const values = loadoutToArray(state.loadout);
  const currentIndex = values.findIndex((value) => value === skillId);
  if (currentIndex >= 0) {
    openModal({type: 'warning', title: 'Skill ja equipada', body: 'Essa skill ja esta em um dos tres slots ativos.'});
    return;
  }
  const emptyIndex = values.findIndex((value) => value === 0);
  if (emptyIndex < 0) {
    openModal({type: 'warning', title: 'Sem slot livre', body: 'Desequipe uma das skills atuais antes de equipar outra.'});
    return;
  }
  values[emptyIndex] = skillId;
  state.loadout = loadoutFromArray(values);
  persist();
  closeModal();
}

function unequipSlot(index) {
  const values = loadoutToArray(state.loadout);
  values[index] = 0;
  state.loadout = loadoutFromArray(values);
  persist();
  render();
}

function openShop(shopKey) {
  const skillCards = SKILLS.filter((skill) => skill.shop === shopKey)
    .map((skill) => `
      <div class="shop-entry">
        ${skillCardMarkup(skill, {compact: true, actionLabel: ownedSet().has(skill.id) ? 'Owned' : `Buy ${skill.price}g`})}
        <button class="button button--small ${ownedSet().has(skill.id) ? 'button--ghost' : 'button--primary'}" type="button" data-buy-skill="${skill.id}">${ownedSet().has(skill.id) ? 'Owned' : 'Comprar'}</button>
      </div>
    `).join('');

  const armorCards = shopKey === 'blacksmith'
    ? `
      <div class="shop-subtitle">Armaduras</div>
      ${ARMOR_CATALOG.map((armor) => `
        <div class="shop-entry shop-entry--armor">
          <div>
            <div class="shop-entry__title">${armor.label}</div>
            <p>${armor.description}</p>
            <small>+${armor.hp} HP</small>
          </div>
          <button class="button button--small ${state.armor[armor.key] ? 'button--ghost' : 'button--primary'}" type="button" data-buy-armor="${armor.key}">${state.armor[armor.key] ? 'Equipada' : `Comprar ${armor.price}g`}</button>
        </div>
      `).join('')}
    `
    : '';

  openModal({
    type: 'shop',
    title: SHOP_LABELS[shopKey],
    body: `<div class="shop-grid">${skillCards}${armorCards}</div>`,
  });
}

function inventoryMarkup() {
  return state.items.map((skillId) => {
    const skill = SKILL_BY_ID.get(skillId);
    if (!skill) return '';
    const equipped = loadoutToArray(state.loadout).includes(skillId);
    return `
      <div class="inventory-entry" data-owned-skill="${skill.id}">
        ${skillCardMarkup(skill, {compact: true, equipped, actionLabel: equipped ? 'Equipada' : 'Equipar'})}
      </div>
    `;
  }).join('');
}

function modalMarkup() {
  if (!modal) return '';
  const body = modal.type === 'inventory'
    ? `
      <div class="inventory-modal">
        ${skillCardMarkup(modal.skill, {subtitle: modal.skill.description})}
        <div class="modal-actions modal-actions--stack">
          <button class="button button--primary" type="button" data-equip-skill="${modal.skill.id}">Equipar</button>
          <button class="button button--ghost" type="button" data-close-modal>Fechar</button>
        </div>
      </div>
    `
    : `
      <div class="modal-copy">${modal.body}</div>
      <div class="modal-actions">
        <button class="button button--primary" type="button" data-close-modal>Fechar</button>
      </div>
    `;
  return `
    <div class="modal-backdrop" data-close-modal>
      <div class="modal-card" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div>
            <div class="page-header__eyebrow">Campanha</div>
            <h2 class="modal-title">${modal.title}</h2>
          </div>
          <button class="button button--ghost button--small" type="button" data-close-modal>Fechar</button>
        </div>
        ${modal.body && modal.type === 'shop' ? modal.body : body}
      </div>
    </div>
  `;
}

function cityScreenMarkup() {
  const info = currentLevel();
  const hp = playerMaxHpFromArmor(state.armor);
  const duelLabel = info.gate ? 'Rodada eliminatoria' : 'Duel';
  return `
    <div class="page-shell page-shell--wide story-shell">
      <header class="page-header page-header--inline">
        <div>
          <div class="page-header__eyebrow">Vibi Fight</div>
          <h1 class="page-header__title">Cidade da campanha</h1>
          <p class="page-header__copy">Compre skills, equipe o loadout e avance pelos 12 levels com estado todo preso na URL.</p>
        </div>
        <a class="button button--ghost" href="../">Voltar</a>
      </header>

      <section class="story-map panel">
        <div class="story-map__frame">
          <div class="story-map__cross story-map__cross--vertical"></div>
          <div class="story-map__cross story-map__cross--horizontal"></div>
          <button class="story-node story-node--wizard" type="button" data-shop="wizard">Wizard's Tower</button>
          <button class="story-node story-node--bowyer" type="button" data-shop="bowyer">The Bowyer's Workshop</button>
          <button class="story-node story-node--forge" type="button" data-shop="blacksmith">The Blacksmith's Forge</button>
          <a class="story-node story-node--duel" href="${campaignFightHref(state)}">${duelLabel}</a>
        </div>
      </section>

      <section class="story-panels">
        <article class="panel story-status">
          <div class="panel__eyebrow">Status</div>
          <h2 class="panel__title">Level ${info.level} · ${info.title}</h2>
          <div class="stats-grid">
            <div><span>Gold</span><strong>${state.gold}g</strong></div>
            <div><span>HP total</span><strong>${hp}</strong></div>
            <div><span>Reward</span><strong>${info.reward}g</strong></div>
            <div><span>Bot HP</span><strong>${info.botHp}</strong></div>
          </div>
          <p class="panel__copy">${info.gate ? 'Level de gate: se perder, a rota da campanha vai para game over.' : 'Round normal: vença para voltar para a cidade com mais gold.'}</p>
        </article>

        <article class="panel inventory-panel">
          <div class="panel__eyebrow">Inventario</div>
          <h2 class="panel__title">Loadout ativo</h2>
          <div class="story-loadout">
            ${loadoutToArray(state.loadout).map((skillId, index) => {
              const skill = SKILL_BY_ID.get(skillId);
              return `
                <div class="story-loadout__slot">
                  <span>Slot ${index + 1}</span>
                  <strong>${skill ? skill.label : 'Vazio'}</strong>
                  ${skill ? `<button class="button button--ghost button--small" type="button" data-unequip-slot="${index}">Desequipar</button>` : ''}
                </div>
              `;
            }).join('')}
          </div>
          <div class="inventory-grid">${inventoryMarkup()}</div>
        </article>
      </section>
    </div>
  `;
}

function endScreenMarkup(kind) {
  const title = kind === 'victory' ? 'Campanha concluida' : 'Game over';
  const copy = kind === 'victory'
    ? 'Voce passou pelos 12 levels e fechou a campanha com o loadout montado na cidade.'
    : 'A rodada eliminatoria derrubou voce. Reinicie a campanha ou volte para a cidade e reorganize seu kit.';
  return `
    <div class="page-shell end-shell">
      <div class="panel end-panel">
        <div class="page-header__eyebrow">Story</div>
        <h1 class="page-header__title">${title}</h1>
        <p class="page-header__copy">${copy}</p>
        <div class="modal-actions">
          <a class="button button--primary" href="../story/?screen=city&level=1&gold=0&ps1=1&ps2=7&ps3=12&items=1,7,12&ab=0&al=0&ac=0&ah=0">Reiniciar campanha</a>
          <a class="button button--ghost" href="../">Voltar menu</a>
        </div>
      </div>
    </div>
  `;
}

function attachEvents() {
  for (const button of root.querySelectorAll('[data-shop]')) {
    button.addEventListener('click', () => openShop(button.getAttribute('data-shop')));
  }
  for (const button of root.querySelectorAll('[data-buy-skill]')) {
    button.addEventListener('click', () => buySkill(Number.parseInt(button.getAttribute('data-buy-skill') || '0', 10)));
  }
  for (const button of root.querySelectorAll('[data-buy-armor]')) {
    button.addEventListener('click', () => buyArmor(button.getAttribute('data-buy-armor')));
  }
  for (const entry of root.querySelectorAll('[data-owned-skill]')) {
    entry.addEventListener('click', () => {
      const skill = SKILL_BY_ID.get(Number.parseInt(entry.getAttribute('data-owned-skill') || '0', 10));
      if (skill) openModal({type: 'inventory', title: skill.label, skill});
    });
  }
  for (const button of root.querySelectorAll('[data-unequip-slot]')) {
    button.addEventListener('click', () => unequipSlot(Number.parseInt(button.getAttribute('data-unequip-slot') || '0', 10)));
  }
  for (const button of root.querySelectorAll('[data-close-modal]')) {
    button.addEventListener('click', closeModal);
  }
  const backdrop = root.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeModal();
    });
  }
  for (const button of root.querySelectorAll('[data-equip-skill]')) {
    button.addEventListener('click', () => equipSkill(Number.parseInt(button.getAttribute('data-equip-skill') || '0', 10)));
  }
}

function render() {
  root.innerHTML = `${state.screen === 'city' ? cityScreenMarkup() : endScreenMarkup(state.screen)}${modalMarkup()}`;
  attachEvents();
}

render();
