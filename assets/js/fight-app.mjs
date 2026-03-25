import {
  DEFAULT_BOT_LOADOUT,
  DEFAULT_PLAYER_LOADOUT,
  describeQueue,
  dxdy,
  effectCells,
  firstPlacementThatHits,
  getArmorHp,
  getLevelSetup,
  getSkill,
  inBounds,
  loadoutFromParams,
  parseParams,
  placementFromOrigin,
  posKey,
  preferredRotations,
  samePos,
  skillIconUrl,
} from './common.mjs';

const MOVE_KEYS = {
  w: 'up',
  arrowup: 'up',
  s: 'down',
  arrowdown: 'down',
  a: 'left',
  arrowleft: 'left',
  d: 'right',
  arrowright: 'right',
};

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function createState(options) {
  return {
    pageType: options.pageType,
    round: 1,
    queue: [],
    locked: false,
    target: null,
    resolving: false,
    status: 'Planeje ate 3 slots.',
    flashes: [],
    marks: [],
    bump: '',
    modal: null,
    player: { x: 6, y: 4, hp: options.playerHp, maxHp: options.playerHp },
    bot: { x: 11, y: 4, hp: options.botHp, maxHp: options.botHp },
    playerLoadout: options.playerLoadout,
    botLoadout: options.botLoadout,
    botPlan: [],
    campaign: options.campaign,
  };
}

function plannedPlayerPos(state) {
  const pos = { x: state.player.x, y: state.player.y };
  for (const action of state.queue) {
    if (action.type !== 'move') continue;
    const delta = dxdy(action.dir);
    pos.x += delta.x;
    pos.y += delta.y;
  }
  return pos;
}

function currentMoveLimit(state, skillId = null) {
  if (skillId !== null && getSkill(skillId).classId === 1) return 3;
  const queuedAttack = state.queue.find((action) => action.type === 'attack');
  if (queuedAttack && getSkill(queuedAttack.skillId).classId === 1) return 3;
  return 2;
}

function queueMove(state, dir) {
  if (state.locked || state.resolving || state.queue.some((action) => action.type === 'attack')) return false;
  const currentMoves = state.queue.filter((action) => action.type === 'move').length;
  if (currentMoves >= currentMoveLimit(state)) return false;
  const pos = plannedPlayerPos(state);
  const delta = dxdy(dir);
  const next = { x: pos.x + delta.x, y: pos.y + delta.y };
  if (!inBounds(next.x, next.y) || samePos(next, state.bot)) return false;
  state.queue.push({ type: 'move', dir });
  state.status = `Move ${dir} adicionado.`;
  return true;
}

function defaultTarget(state, skillId) {
  const actorPos = plannedPlayerPos(state);
  const skill = getSkill(skillId);
  const hit = firstPlacementThatHits(skill, actorPos, state.bot, preferredRotations(actorPos, state.bot));
  if (hit) return { skillId, rot: hit.rotation, origin: hit.origin };
  return { skillId, rot: 0, origin: { x: actorPos.x, y: actorPos.y } };
}

function openTarget(state, index) {
  if (state.locked || state.resolving) return;
  const skillId = state.playerLoadout[index];
  state.target = defaultTarget(state, skillId);
  state.status = `Mira aberta para ${getSkill(skillId).name}.`;
}

function moveTarget(state, dir) {
  if (!state.target) return false;
  const skill = getSkill(state.target.skillId);
  const delta = dxdy(dir);
  const nextOrigin = { x: state.target.origin.x + delta.x, y: state.target.origin.y + delta.y };
  const placement = placementFromOrigin(skill, plannedPlayerPos(state), state.target.rot, nextOrigin);
  if (!placement) return false;
  state.target.origin = nextOrigin;
  return true;
}

function rotateTarget(state, delta) {
  if (!state.target) return false;
  const nextRot = (state.target.rot + delta + 4) % 4;
  const skill = getSkill(state.target.skillId);
  const placement = placementFromOrigin(skill, plannedPlayerPos(state), nextRot, state.target.origin);
  if (!placement) return false;
  state.target.rot = nextRot;
  return true;
}

function confirmTarget(state) {
  if (!state.target || state.locked || state.queue.some((action) => action.type === 'attack')) return false;
  state.queue.push({
    type: 'attack',
    skillId: state.target.skillId,
    rot: state.target.rot,
    origin: { ...state.target.origin },
  });
  state.status = `${getSkill(state.target.skillId).name} confirmada.`;
  state.target = null;
  return true;
}

function unlockOrUndo(state) {
  if (state.target) {
    state.target = null;
    state.status = 'Mira cancelada.';
    return;
  }
  if (state.locked) {
    state.locked = false;
    state.status = 'Planejamento reaberto.';
    return;
  }
  state.queue.pop();
  state.status = 'Ultima acao removida.';
}

function lockPlanning(state) {
  if (!state.queue.length || state.target) return false;
  state.locked = true;
  state.status = 'Planejamento travado. Enter ou Ready resolve a rodada.';
  return true;
}

function previewData(state) {
  const trail = [];
  let cursor = { x: state.player.x, y: state.player.y };
  for (const action of state.queue) {
    if (action.type !== 'move') continue;
    const delta = dxdy(action.dir);
    cursor = { x: cursor.x + delta.x, y: cursor.y + delta.y };
    trail.push({ x: cursor.x, y: cursor.y, step: trail.length + 1 });
  }
  const actorPos = plannedPlayerPos(state);
  const placement = state.target
    ? placementFromOrigin(getSkill(state.target.skillId), actorPos, state.target.rot, state.target.origin)
    : null;
  return { trail, actorPos, placement };
}

function rangeScore(className, botPos, playerPos) {
  const dx = Math.abs(botPos.x - playerPos.x);
  const dy = Math.abs(botPos.y - playerPos.y);
  if (className === 'melee') return dx + dy;
  if (className === 'mage') return Math.min(Math.abs(dx - 6), Math.abs(dx - 7)) * 2 + dy;
  return Math.min(Math.abs(dx - 8), Math.abs(dx - 9), Math.abs(dx - 10)) * 2 + dy;
}

function planBot(state) {
  const dirs = ['up', 'down', 'left', 'right'];
  const sequences = [[]];
  dirs.forEach((dir) => sequences.push([dir]));
  dirs.forEach((first) => dirs.forEach((second) => sequences.push([first, second])));
  const candidates = [];
  for (const sequence of sequences) {
    let pos = { x: state.bot.x, y: state.bot.y };
    let valid = true;
    for (const dir of sequence) {
      const delta = dxdy(dir);
      const next = { x: pos.x + delta.x, y: pos.y + delta.y };
      if (!inBounds(next.x, next.y) || samePos(next, state.player)) {
        valid = false;
        break;
      }
      pos = next;
    }
    if (valid) candidates.push({ sequence, pos });
  }

  const priorities = state.bot.hp >= state.player.hp ? ['melee', 'mage', 'ranged'] : ['ranged', 'mage', 'melee'];
  for (const className of priorities) {
    const skills = state.botLoadout.map(getSkill).filter((skill) => skill.className === className);
    for (const candidate of candidates.sort((a, b) => a.sequence.length - b.sequence.length || rangeScore(className, a.pos, state.player) - rangeScore(className, b.pos, state.player))) {
      for (const skill of skills) {
        const placement = firstPlacementThatHits(skill, candidate.pos, state.player, preferredRotations(candidate.pos, state.player));
        if (placement) {
          return [
            ...candidate.sequence.map((dir) => ({ type: 'move', dir })),
            { type: 'attack', skillId: skill.id, rot: placement.rotation, origin: placement.origin },
          ];
        }
      }
    }
  }
  return [];
}

function boardMarkup(state) {
  const preview = previewData(state);
  const trailMap = new Map(preview.trail.map((entry) => [posKey(entry.x, entry.y), entry.step]));
  const previewMap = new Map();
  const anchorMap = new Set();
  const invalidMap = new Set();
  if (preview.placement) {
    const hit = effectCells(preview.placement, preview.actorPos).some((cell) => cell.x === state.bot.x && cell.y === state.bot.y);
    for (const cell of preview.placement.cells) {
      if (!inBounds(cell.x, cell.y)) continue;
      const key = posKey(cell.x, cell.y);
      if (cell.tokens.includes('P')) anchorMap.add(key);
      else previewMap.set(key, cell.tokens);
      if (!hit) invalidMap.add(key);
    }
  }
  const flashSet = new Set(state.flashes);
  const markMap = new Map(state.marks.map((mark) => [posKey(mark.x, mark.y), mark.kind]));
  const ghostKey = !state.locked ? posKey(preview.actorPos.x, preview.actorPos.y) : '';
  const cells = [];
  for (let y = 0; y < 9; y += 1) {
    for (let x = 0; x < 18; x += 1) {
      const key = posKey(x, y);
      const classes = ['board-cell'];
      if (trailMap.has(key) && !state.locked) classes.push('board-cell--trail');
      if (ghostKey === key && !samePos(preview.actorPos, state.player) && !state.locked) classes.push('board-cell--ghost');
      if (previewMap.has(key)) classes.push('board-cell--preview');
      if (anchorMap.has(key)) classes.push('board-cell--anchor');
      if (invalidMap.has(key)) classes.push('board-cell--invalid');
      if (markMap.get(key) === 'ice') classes.push('board-cell--ice-mark');
      if (markMap.get(key) === 'fire') classes.push('board-cell--fire-mark');
      if (flashSet.has(key)) classes.push('board-cell--flash');
      const content = [];
      if (trailMap.has(key) && !state.locked) content.push(`<span class="trail-step">${trailMap.get(key)}</span>`);
      if (state.player.hp > 0 && state.player.x === x && state.player.y === y) {
        content.push(`<span class="tile-actor tile-actor--player ${state.bump === 'player' ? 'tile-actor--bump' : ''}">P</span>`);
      }
      if (state.bot.hp > 0 && state.bot.x === x && state.bot.y === y) {
        content.push(`<span class="tile-actor tile-actor--bot ${state.bump === 'bot' ? 'tile-actor--bump' : ''}">${state.bot.hp}</span>`);
      }
      cells.push(`<div class="${classes.join(' ')}">${content.join('')}</div>`);
    }
  }
  return cells.join('');
}

function resultModal(state, won) {
  if (state.pageType === 'city-duel') {
    const params = new URLSearchParams();
    params.set('screen', won && state.campaign.level >= 12 ? 'victory' : won ? 'city' : 'game_over');
    params.set('level', String(won ? Math.min(12, state.campaign.level + 1) : state.campaign.level));
    params.set('gold', String((state.campaign.gold || 0) + (won ? state.campaign.reward : 0)));
    params.set('armor', state.campaign.armor);
    params.set('inv', state.campaign.inventory.join(','));
    params.set('eq', state.campaign.loadout.join(','));
    return {
      title: won ? 'Vitoria' : 'Derrota',
      copy: won ? 'A rodada terminou a seu favor. Volte para a cidade para receber a recompensa.' : 'Seu fighter caiu. Volte para reorganizar a campanha.',
      href: `../story/?${params.toString()}`,
      label: 'Voltar para story',
    };
  }
  return {
    title: won ? 'Vitoria' : 'Derrota',
    copy: won ? 'O bot caiu antes do proximo slot.' : 'Seu fighter caiu antes do fim da rodada.',
    href: '../play/',
    label: 'Voltar ao lobby',
  };
}

async function flash(state, cells, render) {
  state.flashes = cells.map((cell) => posKey(cell.x, cell.y));
  render();
  await wait(220);
  state.flashes = [];
}

async function bump(state, actor, render) {
  state.bump = actor;
  render();
  await wait(180);
  state.bump = '';
}

function pullTarget(attacker, target) {
  const dx = attacker.x - target.x;
  const dy = attacker.y - target.y;
  const step = Math.abs(dx) >= Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
  const next = { x: target.x + step.x, y: target.y + step.y };
  if (!inBounds(next.x, next.y) || samePos(next, attacker)) return;
  target.x = next.x;
  target.y = next.y;
}

async function resolveAction(state, actorKey, action, render) {
  const actor = state[actorKey];
  const target = actorKey === 'player' ? state.bot : state.player;
  if (!action || actor.hp <= 0) return;
  if (action.type === 'move') {
    const delta = dxdy(action.dir);
    const next = { x: actor.x + delta.x, y: actor.y + delta.y };
    if (!inBounds(next.x, next.y) || samePos(next, target)) {
      await bump(state, actorKey, render);
      state.status = `${actorKey === 'player' ? 'Player' : 'Bot'} bateu em um bloqueio.`;
      render();
      return;
    }
    actor.x = next.x;
    actor.y = next.y;
    state.status = `${actorKey === 'player' ? 'Player' : 'Bot'} moveu para ${action.dir}.`;
    render();
    await wait(150);
    return;
  }

  const skill = getSkill(action.skillId);
  const placement = placementFromOrigin(skill, { x: actor.x, y: actor.y }, action.rot, action.origin);
  if (!placement) return;
  const visible = effectCells(placement, actor).filter((cell) => inBounds(cell.x, cell.y));
  await flash(state, visible, render);
  for (const cell of visible) {
    if (cell.x !== target.x || cell.y !== target.y || target.hp <= 0) continue;
    if (cell.tokens.includes('H')) pullTarget(actor, target);
    if (cell.tokens.includes('I')) state.marks.push({ x: cell.x, y: cell.y, kind: 'ice', expiresRound: state.round });
    if (cell.tokens.includes('F')) state.marks.push({ x: cell.x, y: cell.y, kind: 'fire', expiresRound: state.round });
    if (cell.tokens.some((token) => ['A', 'D', 'I', 'F'].includes(token))) {
      target.hp = Math.max(0, target.hp - Math.max(skill.damage, 10));
    }
  }
  state.status = `${actorKey === 'player' ? 'Player' : 'Bot'} usou ${skill.name}.`;
  render();
}

async function resolveRound(state, render) {
  if (state.resolving || !state.queue.length) return;
  state.resolving = true;
  state.target = null;
  state.locked = true;
  state.botPlan = planBot(state);
  render();
  for (let index = 0; index < 3; index += 1) {
    await resolveAction(state, 'bot', state.botPlan[index], render);
    if (state.player.hp <= 0 || state.bot.hp <= 0) break;
    await resolveAction(state, 'player', state.queue[index], render);
    if (state.player.hp <= 0 || state.bot.hp <= 0) break;
  }
  if (state.bot.hp <= 0) {
    state.modal = resultModal(state, true);
  } else if (state.player.hp <= 0) {
    state.modal = resultModal(state, false);
  } else {
    state.round += 1;
    state.queue = [];
    state.botPlan = [];
    state.locked = false;
    state.status = 'Nova rodada pronta para planejamento.';
    state.marks = state.marks.filter((mark) => mark.expiresRound >= state.round);
  }
  state.resolving = false;
  render();
}

function campaignData(params, loadout) {
  if (params.get('campaign') !== '1') return null;
  return {
    level: Number.parseInt(params.get('level') || '1', 10) || 1,
    gold: Number.parseInt(params.get('gold') || '0', 10) || 0,
    reward: Number.parseInt(params.get('reward') || '0', 10) || 0,
    armor: params.get('armor') || 'ab',
    inventory: (params.get('inv') || '').split(',').map((value) => Number.parseInt(value, 10)).filter(Number.isFinite),
    loadout,
  };
}

export function mountFightApp(root, options = {}) {
  const params = options.params ?? parseParams();
  const pageType = options.pageType ?? root.dataset.page ?? 'fight';
  const playerLoadout = loadoutFromParams(params, 'ps', DEFAULT_PLAYER_LOADOUT);
  const setup = getLevelSetup(Number.parseInt(params.get('level') || '1', 10) || 1);
  const botLoadout = loadoutFromParams(params, 'bs', setup.loadout ?? DEFAULT_BOT_LOADOUT);
  const playerHp = Math.max(1, Number.parseInt(params.get('php') || String(getArmorHp(params.get('armor') || 'ab')), 10) || getArmorHp('ab'));
  const botHp = Math.max(1, Number.parseInt(params.get('bhp') || String(setup.botHp), 10) || setup.botHp);
  const state = createState({ pageType, playerLoadout, botLoadout, playerHp, botHp, campaign: campaignData(params, playerLoadout) });

  const render = () => {
    root.innerHTML = `
      <div class="page-shell combat-shell">
        <header class="topbar topbar--combat">
          <div>
            <p class="eyebrow">${pageType === 'city-duel' ? 'City Duel' : pageType === 'game-test' ? 'Game Test' : 'Fight'}</p>
            <h1>${pageType === 'city-duel' ? 'Combate da campanha' : pageType === 'game-test' ? 'Sandbox tecnico' : 'Combate direto'}</h1>
            <p class="lede">Grid 18 x 9 com linhas continuas, preview de movimento, anchor azul e marcas elementais que somem no fim da rodada.</p>
          </div>
          <a class="button button--ghost" href="../play/">Voltar lobby</a>
        </header>
        <section class="combat-layout">
          <article class="card board-card">
            <div class="arena-frame"><div class="arena-board">${boardMarkup(state)}</div></div>
            <div class="hud-strip">
              <div class="stat-card"><small>Player HP</small><strong>${state.player.hp} / ${state.player.maxHp}</strong><span>Bot HP ${state.bot.hp} / ${state.bot.maxHp}</span></div>
              <div class="queue-strip">${describeQueue(state.queue).map((label, index) => `<div class="queue-slot"><small>Slot ${index + 1}</small><strong>${label}</strong><span>Bot: ${describeQueue(state.botPlan)[index]}</span></div>`).join('')}</div>
              <div class="skill-rack">${state.playerLoadout.map((skillId, index) => `<button class="equipped-skill" data-skill-slot="${index}" type="button"><img src="${skillIconUrl(getSkill(skillId))}" alt="${getSkill(skillId).name}" /><span>${index + 1}. ${getSkill(skillId).name}</span></button>`).join('')}</div>
            </div>
          </article>
          <aside class="card sidebar-card">
            <div class="sidebar-stack">
              <div class="stat-card"><small>Round</small><strong>${state.round}</strong></div>
              <div class="stat-card"><small>Estado</small><strong>${state.status}</strong></div>
              <div class="stat-card"><small>Bots vivos</small><strong>${state.bot.hp > 0 ? '1 bot vivo' : '0 bots vivos'}</strong></div>
            </div>
            <div class="sidebar-actions">
              <button class="button button--primary" data-role="ready" type="button">Ready</button>
              <button class="button button--ghost" data-role="reset" type="button">Reset partida</button>
              <a class="button button--ghost" href="../play/">Voltar lobby</a>
            </div>
            <ul class="controls-list">
              <li><code>1 / 2 / 3</code> seleciona skill equipada.</li>
              <li><code>WASD</code> ou setas movem o actor ou a mira.</li>
              <li><code>Q / E</code> rotacionam a skill ativa.</li>
              <li><code>Espaco</code> confirma a acao atual e fecha o planejamento.</li>
              <li><code>Esc</code> sai da mira ou desfaz a ultima decisao.</li>
              <li><code>Enter</code> resolve a rodada depois do lock.</li>
            </ul>
          </aside>
        </section>
        ${state.modal ? `<div class="modal-backdrop"><div class="modal-card"><p class="eyebrow">Resultado</p><h2>${state.modal.title}</h2><p>${state.modal.copy}</p><div class="modal-actions"><a class="button button--primary" href="${state.modal.href}">${state.modal.label}</a><button class="button button--ghost" data-role="dismiss" type="button">Fechar</button></div></div></div>` : ''}
      </div>
    `;

    root.querySelectorAll('[data-skill-slot]').forEach((button) => {
      button.addEventListener('click', () => {
        openTarget(state, Number(button.dataset.skillSlot));
        render();
      });
    });
    root.querySelector('[data-role="ready"]').addEventListener('click', async () => {
      if (state.locked) await resolveRound(state, render);
      else {
        lockPlanning(state);
        render();
      }
    });
    root.querySelector('[data-role="reset"]').addEventListener('click', () => window.location.reload());
    root.querySelector('[data-role="dismiss"]')?.addEventListener('click', () => {
      state.modal = null;
      render();
    });
  };

  const onKey = async (event) => {
    if (!root.isConnected || state.modal) return;
    const key = event.key.toLowerCase();
    if (MOVE_KEYS[key]) {
      event.preventDefault();
      if (state.target) moveTarget(state, MOVE_KEYS[key]);
      else queueMove(state, MOVE_KEYS[key]);
      render();
      return;
    }
    if (key === 'q') {
      event.preventDefault();
      rotateTarget(state, -1);
      render();
      return;
    }
    if (key === 'e') {
      event.preventDefault();
      rotateTarget(state, 1);
      render();
      return;
    }
    if (key === 'escape') {
      event.preventDefault();
      unlockOrUndo(state);
      render();
      return;
    }
    if (key === ' ') {
      event.preventDefault();
      if (state.target) confirmTarget(state);
      else lockPlanning(state);
      render();
      return;
    }
    if (key === 'enter') {
      event.preventDefault();
      if (!state.locked) {
        lockPlanning(state);
        render();
      } else {
        await resolveRound(state, render);
      }
      return;
    }
    if (['1', '2', '3'].includes(key)) {
      event.preventDefault();
      openTarget(state, Number(key) - 1);
      render();
    }
  };

  window.addEventListener('keydown', onKey);
  render();
  return state;
}

const root = document.querySelector('[data-page="fight"], [data-page="city-duel"]');
if (root) mountFightApp(root);
