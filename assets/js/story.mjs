import {
  ARMORS,
  SHOP_META,
  encodeStoryState,
  getArmorHp,
  getLevelSetup,
  getShopArmors,
  getShopSkills,
  getSkill,
  parseParams,
  parseStoryState,
  skillIconUrl,
} from './common.mjs';

function duelHref(state) {
  const setup = getLevelSetup(state.level);
  const params = new URLSearchParams();
  params.set('campaign', '1');
  params.set('level', String(state.level));
  params.set('gold', String(state.gold));
  params.set('reward', String(setup.reward));
  params.set('php', String(getArmorHp(state.armor)));
  params.set('bhp', String(setup.botHp));
  params.set('armor', state.armor);
  params.set('inv', state.inventory.join(','));
  params.set('eq', state.loadout.join(','));
  state.loadout.forEach((skillId, index) => params.set(`ps${index + 1}`, String(skillId)));
  setup.loadout.forEach((skillId, index) => params.set(`bs${index + 1}`, String(skillId)));
  return `../city-duel/?${params.toString()}`;
}

function updateUrl(state) {
  window.history.replaceState(null, '', `${window.location.pathname}?${encodeStoryState(state)}`);
}

function render(app, state) {
  const setup = getLevelSetup(state.level);
  if (state.screen !== 'city') {
    app.innerHTML = `
      <div class="page-shell story-shell story-shell--end">
        <section class="card end-card">
          <p class="eyebrow">Story</p>
          <h1>${state.screen === 'victory' ? 'Campanha concluida' : 'Game over'}</h1>
          <p>${state.screen === 'victory' ? 'Os 12 levels foram vencidos.' : 'A campanha falhou nesta rodada.'}</p>
          <div class="modal-actions">
            <a class="button button--primary" href="./?${encodeStoryState({ ...state, screen: 'city' })}">Voltar para cidade</a>
            <a class="button button--ghost" href="../play/">Ir para lobby</a>
          </div>
        </section>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="page-shell story-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Story</p>
          <h1>Cidade da campanha</h1>
          <p class="lede">Lojas, inventario, armaduras e 12 levels vivem na URL.</p>
        </div>
        <a class="button button--ghost" href="../">Voltar</a>
      </header>
      <main class="story-grid">
        <section class="card city-card">
          <div class="city-backdrop">
            <div class="city-lines city-lines--v"></div>
            <div class="city-lines city-lines--h"></div>
            <button class="city-node city-node--tower" data-role="shop" data-shop="tower" type="button">${SHOP_META.tower.title}</button>
            <button class="city-node city-node--bowyer" data-role="shop" data-shop="bowyer" type="button">${SHOP_META.bowyer.title}</button>
            <button class="city-node city-node--forge" data-role="shop" data-shop="forge" type="button">${SHOP_META.forge.title}</button>
            <button class="city-node city-node--armory" data-role="shop" data-shop="armory" type="button">Armaduras</button>
          </div>
        </section>
        <aside class="card inventory-card">
          <div class="inventory-head"><div><p class="eyebrow">Campaign</p><h2>Level ${state.level}</h2></div><span class="pill">${state.gold} gold</span></div>
          <div class="inventory-stats">
            <div class="stat-card"><small>Armor</small><strong>${ARMORS[state.armor].name}</strong></div>
            <div class="stat-card"><small>Player HP</small><strong>${getArmorHp(state.armor)}</strong></div>
            <div class="stat-card"><small>Reward</small><strong>${setup.reward}</strong></div>
          </div>
          <div class="loadout-stack">
            <h3>Loadout equipavel</h3>
            ${Array.from({ length: 3 }, (_, index) => {
              const skillId = state.loadout[index];
              return `<button class="slot-chip ${skillId !== undefined ? 'slot-chip--filled' : ''}" data-role="unequip" data-slot="${index}" type="button"><span>${index + 1}</span><strong>${skillId === undefined ? 'Slot vazio' : getSkill(skillId).name}</strong></button>`;
            }).join('')}
          </div>
          <div class="inventory-list">
            <h3>Inventario</h3>
            ${state.inventory.map((skillId) => {
              const skill = getSkill(skillId);
              return `<button class="inventory-item" data-role="equip" data-skill-id="${skill.id}" type="button"><img src="${skillIconUrl(skill)}" alt="${skill.name}" /><div><strong>${skill.name}</strong><span>${skill.summary}</span></div></button>`;
            }).join('')}
          </div>
          <div class="duel-card"><p>Distrito atual: <strong>${setup.district}</strong></p><a class="button button--primary" href="${duelHref(state)}">${setup.cta}</a></div>
        </aside>
      </main>
      <div id="story-modal-root"></div>
    </div>
  `;

  const modalRoot = app.querySelector('#story-modal-root');
  const openModal = (title, body) => {
    modalRoot.innerHTML = `<div class="modal-backdrop"><div class="modal-card modal-card--story"><p class="eyebrow">Modal</p><h2>${title}</h2>${body}<div class="modal-actions"><button class="button button--ghost" data-role="close-modal" type="button">Fechar</button></div></div></div>`;
    modalRoot.querySelector('[data-role="close-modal"]').addEventListener('click', () => {
      modalRoot.innerHTML = '';
    });
  };

  app.querySelectorAll('[data-role="shop"]').forEach((button) => {
    button.addEventListener('click', () => {
      const shop = button.dataset.shop;
      if (shop === 'armory') {
        openModal('Armaduras', `<div class="shop-list">${getShopArmors().map((armor) => `<button class="shop-item" data-role="buy-armor" data-armor-id="${armor.id}" type="button"><div><strong>${armor.name}</strong><span>${armor.hp} HP</span></div><em>${armor.price} gold</em></button>`).join('')}</div>`);
        modalRoot.querySelectorAll('[data-role="buy-armor"]').forEach((item) => {
          item.addEventListener('click', () => {
            const armor = ARMORS[item.dataset.armorId];
            if (state.gold < armor.price) return openModal('Aviso', '<p>Gold insuficiente.</p>');
            state.gold -= armor.price;
            state.armor = armor.id;
            updateUrl(state);
            render(app, state);
            openModal('Armadura equipada', `<p>${armor.name} agora define o HP total.</p>`);
          });
        });
        return;
      }
      openModal(SHOP_META[shop].title, `<p>${SHOP_META[shop].copy}</p><div class="shop-list">${getShopSkills(shop).map((skill) => `<button class="shop-item" data-role="buy-skill" data-skill-id="${skill.id}" type="button"><img src="${skillIconUrl(skill)}" alt="${skill.name}" /><div><strong>${skill.name}</strong><span>${skill.summary}</span></div><em>${skill.price} gold</em></button>`).join('')}</div>`);
      modalRoot.querySelectorAll('[data-role="buy-skill"]').forEach((item) => {
        item.addEventListener('click', () => {
          const skill = getSkill(Number(item.dataset.skillId));
          if (state.inventory.includes(skill.id)) return openModal('Aviso', '<p>Essa skill ja esta no inventario.</p>');
          if (state.gold < skill.price) return openModal('Aviso', '<p>Gold insuficiente.</p>');
          state.gold -= skill.price;
          state.inventory.push(skill.id);
          updateUrl(state);
          render(app, state);
          openModal('Compra concluida', `<p>${skill.name} entrou no inventario.</p>`);
        });
      });
    });
  });

  app.querySelectorAll('[data-role="equip"]').forEach((button) => {
    button.addEventListener('click', () => {
      const skillId = Number(button.dataset.skillId);
      const empty = state.loadout.findIndex((value) => value === undefined);
      if (empty >= 0) {
        state.loadout[empty] = skillId;
        updateUrl(state);
        render(app, state);
        openModal('Skill equipada', `<p>${getSkill(skillId).name} foi para o slot ${empty + 1}.</p>`);
        return;
      }
      openModal('Sem slot livre', `<div class="slot-choice-row">${state.loadout.map((value, index) => `<button class="slot-chip slot-chip--filled" data-role="replace-slot" data-slot="${index}" type="button"><span>${index + 1}</span><strong>${getSkill(value).name}</strong></button>`).join('')}</div>`);
      modalRoot.querySelectorAll('[data-role="replace-slot"]').forEach((item) => {
        item.addEventListener('click', () => {
          state.loadout[Number(item.dataset.slot)] = skillId;
          updateUrl(state);
          render(app, state);
          openModal('Skill equipada', `<p>${getSkill(skillId).name} entrou no slot ${Number(item.dataset.slot) + 1}.</p>`);
        });
      });
    });
  });

  app.querySelectorAll('[data-role="unequip"]').forEach((button) => {
    button.addEventListener('click', () => {
      const slot = Number(button.dataset.slot);
      if (state.loadout[slot] === undefined) return;
      state.loadout.splice(slot, 1);
      updateUrl(state);
      render(app, state);
    });
  });
}

const app = document.querySelector('[data-page="story"]');
if (app) render(app, parseStoryState(parseParams()));
