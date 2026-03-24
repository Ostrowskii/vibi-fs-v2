import {
  ARMOR_CATALOG,
  SKILLS,
  campaignFightHref,
  campaignStateFromLocation,
  loadoutFromArray,
  qs,
  loadoutToArray,
} from './common.mjs';

const root = qs('#app');
const campaign = campaignStateFromLocation();
const state = {
  player: [campaign.loadout.s1, campaign.loadout.s2, campaign.loadout.s3],
  bot: [1, 7, 12],
  level: campaign.level,
  gold: campaign.gold,
  items: campaign.items.join(','),
  armor: {...campaign.armor},
};

function optionList(selectedId) {
  return ['<option value="0">Vazio</option>']
    .concat(SKILLS.map((skill) => `<option value="${skill.id}" ${skill.id === selectedId ? 'selected' : ''}>${skill.label}</option>`))
    .join('');
}

function render() {
  const previewState = {
    ...campaign,
    level: state.level,
    gold: state.gold,
    items: state.items.split(',').map((value) => Number.parseInt(value, 10)).filter((value) => Number.isFinite(value) && value > 0),
    loadout: loadoutFromArray(state.player),
    armor: state.armor,
  };
  const fightParams = new URLSearchParams();
  state.player.forEach((value, index) => fightParams.set(`ps${index + 1}`, String(value || 0)));
  state.bot.forEach((value, index) => fightParams.set(`bs${index + 1}`, String(value || 0)));
  root.innerHTML = `
    <div class="page-shell">
      <header class="page-header page-header--inline">
        <div>
          <div class="page-header__eyebrow">Game Test</div>
          <h1 class="page-header__title">Sandbox tecnico</h1>
          <p class="page-header__copy">Ajuste query params, monte slots e gere links diretos para fight ou city-duel.</p>
        </div>
        <a class="button button--ghost" href="../">Voltar</a>
      </header>

      <main class="sandbox-grid">
        <section class="panel">
          <div class="panel__eyebrow">Player</div>
          <h2 class="panel__title">Slots do player</h2>
          ${state.player.map((value, index) => `<label class="field"><span>Skill ${index + 1}</span><select data-scope="player" data-slot="${index}">${optionList(value)}</select></label>`).join('')}
        </section>

        <section class="panel">
          <div class="panel__eyebrow">Bot</div>
          <h2 class="panel__title">Slots do bot</h2>
          ${state.bot.map((value, index) => `<label class="field"><span>Skill ${index + 1}</span><select data-scope="bot" data-slot="${index}">${optionList(value)}</select></label>`).join('')}
        </section>

        <section class="panel">
          <div class="panel__eyebrow">Campaign</div>
          <h2 class="panel__title">Query params</h2>
          <label class="field"><span>Level</span><input data-field="level" type="number" min="1" max="12" value="${state.level}"></label>
          <label class="field"><span>Gold</span><input data-field="gold" type="number" min="0" value="${state.gold}"></label>
          <label class="field"><span>Items</span><input data-field="items" type="text" value="${state.items}"></label>
          <div class="checkbox-grid">
            ${ARMOR_CATALOG.map((armor) => `<label><input data-armor="${armor.key}" type="checkbox" ${state.armor[armor.key] ? 'checked' : ''}> ${armor.label}</label>`).join('')}
          </div>
        </section>
      </main>

      <section class="panel sandbox-links">
        <a class="button button--primary" href="../fight/?${fightParams.toString()}">Abrir /fight/</a>
        <a class="button button--primary" href="${campaignFightHref(previewState)}">Abrir /city-duel/ de campanha</a>
      </section>
    </div>
  `;

  for (const select of root.querySelectorAll('select[data-scope][data-slot]')) {
    select.addEventListener('change', () => {
      const scope = select.getAttribute('data-scope');
      const slot = Number.parseInt(select.getAttribute('data-slot') || '0', 10);
      const value = Number.parseInt(select.value, 10) || 0;
      state[scope][slot] = value;
      render();
    });
  }
  for (const input of root.querySelectorAll('[data-field]')) {
    input.addEventListener('input', () => {
      const field = input.getAttribute('data-field');
      state[field] = input.type === 'number' ? Number.parseInt(input.value || '0', 10) || 0 : input.value;
      render();
    });
  }
  for (const input of root.querySelectorAll('[data-armor]')) {
    input.addEventListener('change', () => {
      state.armor[input.getAttribute('data-armor')] = input.checked ? 1 : 0;
      render();
    });
  }
}

render();
