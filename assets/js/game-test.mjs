import { DEFAULT_BOT_LOADOUT, DEFAULT_PLAYER_LOADOUT, SKILLS } from './common.mjs';
import { mountFightApp } from './fight-app.mjs';

const app = document.querySelector('[data-page="game-test-root"]');
if (app) {
  const state = { player: DEFAULT_PLAYER_LOADOUT.slice(), bot: DEFAULT_BOT_LOADOUT.slice(), php: 58, bhp: 62 };
  const render = () => {
    app.innerHTML = `
      <div class="page-shell game-test-shell">
        <header class="topbar"><div><p class="eyebrow">Game Test</p><h1>Sandbox tecnico</h1><p class="lede">Monte os query params e rode o mesmo board abaixo.</p></div><a class="button button--ghost" href="../">Voltar</a></header>
        <section class="card sandbox-card">
          <div class="sandbox-form">
            <div class="sandbox-col"><h2>Player</h2>${state.player.map((value, index) => `<label>Slot ${index + 1}<select data-role="player" data-index="${index}">${SKILLS.map((skill) => `<option value="${skill.id}" ${skill.id === value ? 'selected' : ''}>${skill.name}</option>`).join('')}</select></label>`).join('')}</div>
            <div class="sandbox-col"><h2>Bot</h2>${state.bot.map((value, index) => `<label>Slot ${index + 1}<select data-role="bot" data-index="${index}">${SKILLS.map((skill) => `<option value="${skill.id}" ${skill.id === value ? 'selected' : ''}>${skill.name}</option>`).join('')}</select></label>`).join('')}</div>
            <div class="sandbox-col"><h2>HP</h2><label>Player HP <input data-role="php" type="number" min="1" value="${state.php}" /></label><label>Bot HP <input data-role="bhp" type="number" min="1" value="${state.bhp}" /></label><a class="button button--primary" id="sandbox-link" href="#">Abrir em /fight/</a></div>
          </div>
          <div class="sandbox-query"><code id="sandbox-query"></code></div>
        </section>
        <section id="sandbox-fight" class="sandbox-fight" data-page="game-test"></section>
      </div>
    `;
    const params = new URLSearchParams();
    state.player.forEach((skillId, index) => params.set(`ps${index + 1}`, String(skillId)));
    state.bot.forEach((skillId, index) => params.set(`bs${index + 1}`, String(skillId)));
    params.set('php', String(state.php));
    params.set('bhp', String(state.bhp));
    app.querySelector('#sandbox-query').textContent = `?${params.toString()}`;
    app.querySelector('#sandbox-link').href = `../fight/?${params.toString()}`;
    mountFightApp(app.querySelector('#sandbox-fight'), { pageType: 'game-test', params });
    app.querySelectorAll('[data-role="player"]').forEach((select) => select.addEventListener('change', () => {
      state.player[Number(select.dataset.index)] = Number(select.value);
      render();
    }));
    app.querySelectorAll('[data-role="bot"]').forEach((select) => select.addEventListener('change', () => {
      state.bot[Number(select.dataset.index)] = Number(select.value);
      render();
    }));
    app.querySelector('[data-role="php"]').addEventListener('input', (event) => {
      state.php = Math.max(1, Number(event.target.value) || 1);
      render();
    });
    app.querySelector('[data-role="bhp"]').addEventListener('input', (event) => {
      state.bhp = Math.max(1, Number(event.target.value) || 1);
      render();
    });
  };
  render();
}
