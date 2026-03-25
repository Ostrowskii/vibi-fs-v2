import { DEFAULT_BOT_LOADOUT, DEFAULT_PLAYER_LOADOUT, SKILLS, getSkill, parseParams, skillIconUrl } from './common.mjs';

const FILTERS = ['all', 'ranged', 'mage', 'melee'];

function fightHref(playerLoadout, botLoadout) {
  const params = new URLSearchParams();
  playerLoadout.forEach((skillId, index) => params.set(`ps${index + 1}`, String(skillId)));
  botLoadout.forEach((skillId, index) => params.set(`bs${index + 1}`, String(skillId)));
  return `../fight/?${params.toString()}`;
}

function renderPanel(side, title, loadout, state) {
  const filter = state[`${side}Filter`];
  const slot = state[`${side}Slot`];
  const skills = SKILLS.filter((skill) => filter === 'all' || skill.className === filter);
  return `
    <article class="card inner-card">
      <div class="panel-head"><div><p class="eyebrow">${title}</p><h2>${title === 'Player' ? 'Seu loadout' : 'Bot inimigo'}</h2></div><span class="pill">3 slots</span></div>
      <div class="slot-row">${loadout.map((skillId, index) => `<button class="slot-chip ${slot === index ? 'slot-chip--active' : ''}" data-role="slot" data-side="${side}" data-index="${index}" type="button"><span>${index + 1}</span><strong>${getSkill(skillId).name}</strong></button>`).join('')}</div>
      <div class="filter-row">${FILTERS.map((entry) => `<button class="filter-chip ${filter === entry ? 'filter-chip--active' : ''}" data-role="filter" data-side="${side}" data-filter="${entry}" type="button">${entry[0].toUpperCase()}${entry.slice(1)}</button>`).join('')}</div>
      <div class="skill-grid">${skills.map((skill) => `<button class="skill-select ${loadout.includes(skill.id) ? 'skill-select--selected' : ''}" data-role="pick" data-side="${side}" data-skill-id="${skill.id}" type="button"><img src="${skillIconUrl(skill)}" alt="${skill.name}" /><strong>${skill.name}</strong><span>${skill.className} R${skill.rank}</span></button>`).join('')}</div>
    </article>
  `;
}

function render(app, state) {
  app.innerHTML = `
    <div class="page-shell lobby-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Play</p>
          <h1>Lobby da luta</h1>
          <p class="lede">Filtre o catalogo, preencha os slots e gere o link direto para o combate com query params.</p>
        </div>
        <a class="button button--ghost" href="../">Voltar</a>
      </header>
      <main class="card lobby-card">
        <section class="lobby-grid">
          ${renderPanel('player', 'Player', state.playerLoadout, state)}
          ${renderPanel('bot', 'Bot', state.botLoadout, state)}
        </section>
        <footer class="lobby-footer">
          <p>O CTA Play monta <code>ps1/ps2/ps3/bs1/bs2/bs3</code> para o board.</p>
          <a class="button button--primary" href="${fightHref(state.playerLoadout, state.botLoadout)}">Play</a>
        </footer>
      </main>
    </div>
  `;

  app.querySelectorAll('[data-role="slot"]').forEach((button) => {
    button.addEventListener('click', () => {
      state[`${button.dataset.side}Slot`] = Number(button.dataset.index);
      render(app, state);
    });
  });
  app.querySelectorAll('[data-role="filter"]').forEach((button) => {
    button.addEventListener('click', () => {
      state[`${button.dataset.side}Filter`] = button.dataset.filter;
      render(app, state);
    });
  });
  app.querySelectorAll('[data-role="pick"]').forEach((button) => {
    button.addEventListener('click', () => {
      const side = button.dataset.side;
      const slot = state[`${side}Slot`];
      state[`${side}Loadout`][slot] = Number(button.dataset.skillId);
      render(app, state);
    });
  });
}

const app = document.querySelector('[data-page="play"]');
if (app) {
  render(app, {
    playerLoadout: DEFAULT_PLAYER_LOADOUT.slice(),
    botLoadout: DEFAULT_BOT_LOADOUT.slice(),
    playerFilter: 'all',
    botFilter: 'all',
    playerSlot: 0,
    botSlot: 0,
  });
}
