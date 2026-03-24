import {
  CLASS_FILTERS,
  SKILLS,
  SKILL_BY_ID,
  classMatchesFilter,
  loadoutFromArray,
  loadoutFromParams,
  loadoutToArray,
  normalizeLoadout,
  parseU32,
  qs,
  skillCardMarkup,
} from './common.mjs';

const params = new URLSearchParams(window.location.search);
const state = {
  playerLoadout: normalizeLoadout(loadoutFromParams(params, 'p', [1, 7, 12]), [1, 7, 12]),
  botLoadout: normalizeLoadout(loadoutFromParams(params, 'b', [6, 9, 14]), [6, 9, 14]),
  playerFilter: params.get('pf') || 'all',
  botFilter: params.get('bf') || 'all',
  playerSlot: Math.min(2, parseU32(params, 'pt', 0)),
  botSlot: Math.min(2, parseU32(params, 'bt', 0)),
};

const root = qs('#app');

function syncUrl() {
  const next = new URLSearchParams();
  const player = loadoutToArray(state.playerLoadout);
  const bot = loadoutToArray(state.botLoadout);
  next.set('ps1', String(player[0] || 0));
  next.set('ps2', String(player[1] || 0));
  next.set('ps3', String(player[2] || 0));
  next.set('bs1', String(bot[0] || 0));
  next.set('bs2', String(bot[1] || 0));
  next.set('bs3', String(bot[2] || 0));
  next.set('pf', state.playerFilter);
  next.set('bf', state.botFilter);
  next.set('pt', String(state.playerSlot));
  next.set('bt', String(state.botSlot));
  window.history.replaceState({}, '', `${window.location.pathname}?${next.toString()}`);
}

function assignSkill(side, skillId) {
  const key = side === 'player' ? 'playerLoadout' : 'botLoadout';
  const slotKey = side === 'player' ? 'playerSlot' : 'botSlot';
  const values = loadoutToArray(state[key]);
  const existingIndex = values.findIndex((value) => value === skillId);
  if (existingIndex === state[slotKey]) {
    values[state[slotKey]] = 0;
  } else {
    values[state[slotKey]] = skillId;
  }
  state[key] = loadoutFromArray(values);
  syncUrl();
  render();
}

function buildFightHref() {
  const player = loadoutToArray(state.playerLoadout);
  const bot = loadoutToArray(state.botLoadout);
  const params = new URLSearchParams();
  params.set('ps1', String(player[0] || 0));
  params.set('ps2', String(player[1] || 0));
  params.set('ps3', String(player[2] || 0));
  params.set('bs1', String(bot[0] || 0));
  params.set('bs2', String(bot[1] || 0));
  params.set('bs3', String(bot[2] || 0));
  return `../fight/?${params.toString()}`;
}

function slotMarkup(side, values, selectedSlot) {
  return values.map((skillId, index) => {
    const skill = SKILL_BY_ID.get(skillId);
    return `
      <button class="loadout-slot ${selectedSlot === index ? 'is-selected' : ''}" data-side="${side}" data-slot="${index}" type="button">
        <span class="loadout-slot__label">Slot ${index + 1}</span>
        <strong>${skill ? skill.label : 'Vazio'}</strong>
      </button>
    `;
  }).join('');
}

function sideMarkup(side) {
  const filterKey = side === 'player' ? state.playerFilter : state.botFilter;
  const selectedSlot = side === 'player' ? state.playerSlot : state.botSlot;
  const loadout = side === 'player' ? state.playerLoadout : state.botLoadout;
  const values = loadoutToArray(loadout);
  const equipped = new Set(values.filter(Boolean));
  const filtered = SKILLS.filter((skill) => classMatchesFilter(skill, filterKey));
  const copy = side === 'player'
    ? 'Monte o loadout casual com tres slots. Clique no slot ativo e depois na skill desejada.'
    : 'Escolha as ferramentas do inimigo. O bot usa estas mesmas skills no planner agressivo.';
  return `
    <section class="panel lobby-panel">
      <div class="panel__eyebrow">${side === 'player' ? 'Player' : 'Bot inimigo'}</div>
      <h2 class="panel__title">${side === 'player' ? 'Seu loadout' : 'Loadout do bot'}</h2>
      <p class="panel__copy">${copy}</p>
      <div class="loadout-slots">${slotMarkup(side, values, selectedSlot)}</div>
      <div class="filter-row">
        ${CLASS_FILTERS.map((filter) => `
          <button type="button" class="filter-chip ${(filterKey === filter.key) ? 'is-active' : ''}" data-filter-side="${side}" data-filter="${filter.key}">${filter.label}</button>
        `).join('')}
      </div>
      <div class="skill-list">
        ${filtered.map((skill) => skillCardMarkup(skill, {
          selected: values[selectedSlot] === skill.id,
          equipped: equipped.has(skill.id),
          subtitle: `Clique para ${values[selectedSlot] === skill.id ? 'remover' : 'equipar'} no slot ${selectedSlot + 1}.`,
        })).join('')}
      </div>
    </section>
  `;
}

function attachEvents() {
  for (const button of root.querySelectorAll('[data-side][data-slot]')) {
    button.addEventListener('click', () => {
      const side = button.getAttribute('data-side');
      const slot = Number.parseInt(button.getAttribute('data-slot') || '0', 10);
      if (side === 'player') state.playerSlot = slot;
      else state.botSlot = slot;
      syncUrl();
      render();
    });
  }

  for (const button of root.querySelectorAll('[data-filter-side][data-filter]')) {
    button.addEventListener('click', () => {
      const side = button.getAttribute('data-filter-side');
      const filter = button.getAttribute('data-filter') || 'all';
      if (side === 'player') state.playerFilter = filter;
      else state.botFilter = filter;
      syncUrl();
      render();
    });
  }

  for (const card of root.querySelectorAll('.skill-card')) {
    card.addEventListener('click', () => {
      const skillId = Number.parseInt(card.getAttribute('data-skill-id') || '0', 10);
      const panel = card.closest('.lobby-panel');
      assignSkill(panel?.querySelector('.panel__eyebrow')?.textContent === 'Player' ? 'player' : 'bot', skillId);
    });
  }
}

function render() {
  root.innerHTML = `
    <div class="page-shell page-shell--wide">
      <header class="page-header page-header--inline">
        <div>
          <div class="page-header__eyebrow">Play</div>
          <h1 class="page-header__title">Lobby da luta</h1>
          <p class="page-header__copy">Escolha as tres skills de cada lado, filtre por classe e entre direto no combate.</p>
        </div>
        <a class="button button--ghost" href="../">Voltar</a>
      </header>

      <main class="lobby-layout">
        ${sideMarkup('player')}
        ${sideMarkup('bot')}
      </main>

      <footer class="footer-panel">
        <div>
          <strong>Selecione ate 3 skills por lado.</strong>
          <p>O CTA abaixo leva para <code>../fight/</code> com <code>ps1/ps2/ps3/bs1/bs2/bs3</code> validos.</p>
        </div>
        <a class="button button--primary button--large" href="${buildFightHref()}">Play</a>
      </footer>
    </div>
  `;
  attachEvents();
}

render();
