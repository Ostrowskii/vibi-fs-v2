import {
  SKILL_BY_ID,
  armorStateFromParams,
  buildCSV,
  campaignReturnHref,
  loadoutFromParams,
  loadoutToArray,
  normalizeLoadout,
  parseU32,
  playerMaxHpFromArmor,
  previewPath,
  qs,
  queueLabel,
  starterInventoryFromParams,
} from './common.mjs';

const BOARD_W = 18;
const BOARD_H = 9;
const FLASH_MS = 240;
const STEP_MS = 260;
const DIRS = [
  {name: 'up', label: 'Up', dx: 0, dy: -1},
  {name: 'down', label: 'Down', dx: 0, dy: 1},
  {name: 'left', label: 'Left', dx: -1, dy: 0},
  {name: 'right', label: 'Right', dx: 1, dy: 0},
];

const rotationCache = new Map();
const params = new URLSearchParams(window.location.search);
const campaign = (params.get('campaign') || '') === '1' || document.body.dataset.fightPage === 'city-duel';
const level = parseU32(params, 'level', 1);
const reward = parseU32(params, 'reward', 0);
const gold = parseU32(params, 'gold', 0);
const armor = armorStateFromParams(params);
const items = starterInventoryFromParams(params);
const playerLoadout = normalizeLoadout(loadoutFromParams(params, 'p', [1, 7, 12]), [1, 7, 12]);
const botLoadout = normalizeLoadout(loadoutFromParams(params, 'b', [6, 9, 14]), [6, 9, 14]);
const playerMax = campaign ? parseU32(params, 'php', playerMaxHpFromArmor(armor)) : 50;
const botMax = campaign ? parseU32(params, 'bhp', 50) : 50;
const root = qs('#app');

const state = {
  campaign,
  level,
  reward,
  gold,
  items,
  armor,
  playerLoadout,
  botLoadout,
  player: {x: 6, y: 4, hp: playerMax, maxHp: playerMax, burn: 0, ice: 0},
  bot: {x: 11, y: 4, hp: botMax, maxHp: botMax, burn: 0, ice: 0},
  round: 1,
  phase: 'planning',
  status: 'Planejamento aberto',
  queue: [],
  botQueue: [],
  targetMode: null,
  selectedSkillSlot: 0,
  activeSlot: -1,
  flashTiles: [],
  bumpActor: null,
  modal: null,
};

function clonePos(pos) {
  return {x: pos.x, y: pos.y};
}

function inside(x, y) {
  return x >= 0 && x < BOARD_W && y >= 0 && y < BOARD_H;
}

function keyOf(x, y) {
  return `${x},${y}`;
}

function actorForKey(actorKey) {
  return actorKey === 'player' ? state.player : state.bot;
}

function otherForKey(actorKey) {
  return actorKey === 'player' ? state.bot : state.player;
}

function moveLimitFor(actor) {
  return Math.max(0, 2 - (actor.ice > 0 ? 1 : 0));
}

function currentReturnHref() {
  if (!campaign) {
    return {href: '../play/', label: 'Voltar lobby'};
  }
  const params = new URLSearchParams();
  params.set('screen', 'city');
  params.set('level', String(state.level));
  params.set('gold', String(state.gold));
  params.set('ps1', String(state.playerLoadout.s1));
  params.set('ps2', String(state.playerLoadout.s2));
  params.set('ps3', String(state.playerLoadout.s3));
  params.set('items', buildCSV(state.items));
  for (const key of ['ab', 'al', 'ac', 'ah']) {
    params.set(key, state.armor[key] ? '1' : '0');
  }
  return {href: `../story/?${params.toString()}`, label: 'Voltar city'};
}

function moveLabel(dir) {
  return DIRS[dir]?.label || 'Move';
}

function lexicographicBetter(a, b) {
  if (!b) return true;
  for (let index = 0; index < a.length; index += 1) {
    if ((a[index] ?? 0) < (b[index] ?? 0)) return true;
    if ((a[index] ?? 0) > (b[index] ?? 0)) return false;
  }
  return false;
}

function rotatePoint(x, y, width, height, rotation) {
  switch (rotation % 4) {
    case 1:
      return {x: height - 1 - y, y: x};
    case 2:
      return {x: width - 1 - x, y: height - 1 - y};
    case 3:
      return {x: y, y: width - 1 - x};
    default:
      return {x, y};
  }
}

function rotatedSkill(skillId, rotation) {
  const cacheKey = `${skillId}:${rotation % 4}`;
  if (rotationCache.has(cacheKey)) return rotationCache.get(cacheKey);
  const skill = SKILL_BY_ID.get(skillId);
  const next = {
    skill,
    rotation: rotation % 4,
    width: rotation % 2 === 0 ? skill.width : skill.height,
    height: rotation % 2 === 0 ? skill.height : skill.width,
    cells: skill.cells.map((cell) => ({...rotatePoint(cell.x, cell.y, skill.width, skill.height, rotation), token: cell.token, mask: cell.mask})),
  };
  next.anchors = next.cells.filter((cell) => cell.token.includes('P'));
  next.occupied = next.cells.map((cell) => ({x: cell.x, y: cell.y}));
  rotationCache.set(cacheKey, next);
  return next;
}

function defaultOrigin(skillId, actor, rotation) {
  const rotated = rotatedSkill(skillId, rotation);
  const anchor = rotated.anchors[0] || rotated.occupied[0] || {x: 0, y: 0};
  return {x: actor.x - anchor.x, y: actor.y - anchor.y};
}

function buildPlacement(skillId, actor, rotation, origin) {
  const rotated = rotatedSkill(skillId, rotation);
  const anchorCells = rotated.anchors.length ? rotated.anchors : rotated.occupied;
  let anchorMatched = false;
  let inBounds = true;
  const cells = rotated.cells.map((cell) => {
    const worldX = origin.x + cell.x;
    const worldY = origin.y + cell.y;
    if (!inside(worldX, worldY)) inBounds = false;
    if (worldX === actor.x && worldY === actor.y && anchorCells.some((anchor) => anchor.x === cell.x && anchor.y === cell.y)) {
      anchorMatched = true;
    }
    return {...cell, worldX, worldY};
  });
  const effectCells = cells.filter((cell) => !(cell.worldX === actor.x && cell.worldY === actor.y));
  return {
    skillId,
    rotation,
    origin,
    valid: inBounds && anchorMatched,
    inBounds,
    anchorMatched,
    cells,
    effectCells,
  };
}

function placementHitsTarget(placement, target) {
  return placement.effectCells.some((cell) => cell.worldX === target.x && cell.worldY === target.y && /[ADHIF]/.test(cell.token));
}

function enumerateAnchoredPlacements(skillId, actor) {
  const placements = [];
  const seen = new Set();
  for (let rotation = 0; rotation < 4; rotation += 1) {
    const rotated = rotatedSkill(skillId, rotation);
    const anchors = rotated.anchors.length ? rotated.anchors : rotated.occupied;
    for (const anchor of anchors) {
      const origin = {x: actor.x - anchor.x, y: actor.y - anchor.y};
      const signature = `${rotation}:${origin.x},${origin.y}`;
      if (seen.has(signature)) continue;
      seen.add(signature);
      const placement = buildPlacement(skillId, actor, rotation, origin);
      if (placement.inBounds) placements.push(placement);
    }
  }
  return placements;
}

function dominantAxis(actor, target) {
  const dx = target.x - actor.x;
  const dy = target.y - actor.y;
  if (Math.abs(Math.abs(dx) - Math.abs(dy)) <= 2) return 'diagonal';
  return Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
}

function placementScore(placement, actor, target) {
  const axis = dominantAxis(actor, target);
  const dx = Math.sign(target.x - actor.x);
  const dy = Math.sign(target.y - actor.y);
  let best = [99, 99, 99, 99];
  for (const cell of placement.effectCells) {
    const relX = cell.worldX - actor.x;
    const relY = cell.worldY - actor.y;
    const hit = cell.worldX === target.x && cell.worldY === target.y ? 0 : 1;
    let axisPenalty = 2;
    if (axis === 'horizontal') {
      axisPenalty = (Math.sign(relX) === dx && Math.abs(relX) >= Math.abs(relY)) ? 0 : 2;
    } else if (axis === 'vertical') {
      axisPenalty = (Math.sign(relY) === dy && Math.abs(relY) >= Math.abs(relX)) ? 0 : 2;
    } else {
      axisPenalty = (Math.sign(relX) === dx && Math.sign(relY) === dy) ? 0 : 2;
    }
    const nearest = Math.abs(cell.worldX - target.x) + Math.abs(cell.worldY - target.y);
    const score = [hit, axisPenalty, nearest, placement.rotation];
    if (lexicographicBetter(score, best)) best = score;
  }
  return best;
}

function findBestAttackAction(actor, target, loadout, preferredClasses) {
  const skillIds = loadoutToArray(loadout).filter(Boolean);
  let bestHit = null;
  let bestAny = null;
  let classOffset = 0;
  for (const classId of preferredClasses) {
    const classSkills = skillIds.filter((skillId) => SKILL_BY_ID.get(skillId)?.classId === classId);
    for (const skillId of classSkills) {
      for (const placement of enumerateAnchoredPlacements(skillId, actor)) {
        if (!placement.valid) continue;
        const score = placementScore(placement, actor, target);
        const candidate = {skillId, placement, score: [classOffset, ...score]};
        if (placementHitsTarget(placement, target)) {
          if (!bestHit || lexicographicBetter(candidate.score, bestHit.score)) bestHit = candidate;
        }
        if (!bestAny || lexicographicBetter(candidate.score, bestAny.score)) bestAny = candidate;
      }
    }
    classOffset += 1;
  }
  const chosen = bestHit || bestAny;
  if (!chosen) return null;
  return {
    kind: 'attack',
    skillId: chosen.skillId,
    rotation: chosen.placement.rotation,
    origin: chosen.placement.origin,
    hits: placementHitsTarget(chosen.placement, target),
  };
}

function rangeBandScore(classId, actor, target, hasHit, movesUsed) {
  const dx = Math.abs(actor.x - target.x);
  const dy = Math.abs(actor.y - target.y);
  if (classId === 0) {
    return [hasHit ? 0 : 1, Math.max(dx, dy), movesUsed];
  }
  const [min, max] = classId === 1 ? [8, 10] : [6, 7];
  const horiz = [dx >= min && dx <= max ? 0 : 1, dx < min ? min - dx : dx > max ? dx - max : 0, dy];
  const vert = [dy >= min && dy <= max ? 0 : 1, dy < min ? min - dy : dy > max ? dy - max : 0, dx + 1];
  const picked = lexicographicBetter(horiz, vert) ? horiz : vert;
  return [picked[0], hasHit ? 0 : 1, picked[1], picked[2], movesUsed];
}

function tryMovePos(pos, dirIndex, blocker) {
  const dir = DIRS[dirIndex];
  const next = {x: pos.x + dir.dx, y: pos.y + dir.dy};
  if (!inside(next.x, next.y)) return clonePos(pos);
  if (blocker && blocker.hp > 0 && blocker.x === next.x && blocker.y === next.y) return clonePos(pos);
  return next;
}

function buildBotQueue() {
  const preferred = state.bot.hp >= state.player.hp ? [0, 2, 1] : [1, 2, 0];
  let best = null;
  const consider = (moves) => {
    let pos = clonePos(state.bot);
    for (const dir of moves) {
      const next = tryMovePos(pos, dir, state.player);
      if (next.x === pos.x && next.y === pos.y) return;
      pos = next;
    }
    const attack = findBestAttackAction(pos, state.player, state.botLoadout, preferred);
    const classId = attack ? SKILL_BY_ID.get(attack.skillId).classId : preferred[0];
    const score = rangeBandScore(classId, pos, state.player, Boolean(attack?.hits), moves.length);
    const candidate = {moves, attack, score};
    if (!best || lexicographicBetter(candidate.score, best.score)) best = candidate;
  };
  consider([]);
  for (let a = 0; a < 4; a += 1) {
    consider([a]);
    for (let b = 0; b < 4; b += 1) {
      consider([a, b]);
    }
  }
  const queue = [];
  for (const dir of (best?.moves || [])) {
    queue.push({kind: 'move', dir, dirLabel: moveLabel(dir)});
  }
  if (best?.attack) queue.push({...best.attack});
  while (queue.length < 3) queue.push(null);
  return queue.slice(0, 3);
}

function plannedPath() {
  let pos = clonePos(state.player);
  const path = [];
  for (const action of state.queue) {
    if (!action || action.kind !== 'move') continue;
    const next = tryMovePos(pos, action.dir, state.bot);
    if (next.x !== pos.x || next.y !== pos.y) {
      pos = next;
      path.push({...pos, step: path.length + 1});
    }
  }
  return {pos, path};
}

function startTarget(slotIndex) {
  const skillId = loadoutToArray(state.playerLoadout)[slotIndex];
  if (!skillId || state.phase !== 'planning') return;
  state.selectedSkillSlot = slotIndex;
  const actor = plannedPath().pos;
  state.targetMode = {
    skillId,
    rotation: 0,
    origin: defaultOrigin(skillId, actor, 0),
  };
  state.status = `Mirando ${SKILL_BY_ID.get(skillId)?.label || 'skill'}`;
  render();
}

function queueMove(dirIndex) {
  if (state.phase !== 'planning') return;
  if (state.targetMode) {
    state.targetMode.origin = {
      x: state.targetMode.origin.x + DIRS[dirIndex].dx,
      y: state.targetMode.origin.y + DIRS[dirIndex].dy,
    };
    render();
    return;
  }
  const moveCount = state.queue.filter((entry) => entry?.kind === 'move').length;
  const hasAttack = state.queue.some((entry) => entry?.kind === 'attack');
  if (hasAttack || state.queue.length >= 3 || moveCount >= moveLimitFor(state.player)) return;
  state.queue.push({kind: 'move', dir: dirIndex, dirLabel: moveLabel(dirIndex)});
  state.status = `Fila montada com ${state.queue.length} acao(oes)`;
  render();
}

function rotateTarget(delta) {
  if (!state.targetMode) return;
  const actor = plannedPath().pos;
  const rotation = (state.targetMode.rotation + delta + 4) % 4;
  state.targetMode.rotation = rotation;
  state.targetMode.origin = defaultOrigin(state.targetMode.skillId, actor, rotation);
  render();
}

function confirmTarget() {
  if (!state.targetMode || state.phase !== 'planning') return;
  if (state.queue.length >= 3 || state.queue.some((entry) => entry?.kind === 'attack')) return;
  const actor = plannedPath().pos;
  const placement = buildPlacement(state.targetMode.skillId, actor, state.targetMode.rotation, state.targetMode.origin);
  if (!placement.valid) {
    state.status = 'Preview invalido: encaixe a ancora do actor e mantenha a shape dentro do tabuleiro.';
    render();
    return;
  }
  state.queue.push({kind: 'attack', skillId: state.targetMode.skillId, rotation: state.targetMode.rotation, origin: {...state.targetMode.origin}});
  state.targetMode = null;
  state.status = 'Ataque confirmado para o round';
  render();
}

function undoLast() {
  if (state.targetMode) {
    state.targetMode = null;
    state.status = 'Mira cancelada';
    render();
    return;
  }
  if (state.phase !== 'planning') return;
  state.queue.pop();
  state.status = 'Ultima decisao desfeita';
  render();
}

function setFlash(cells) {
  state.flashTiles = cells.map((cell) => keyOf(cell.worldX, cell.worldY));
}

function clearFlash() {
  state.flashTiles = [];
}

function setBump(actorKey) {
  state.bumpActor = actorKey;
}

function clearBump() {
  state.bumpActor = null;
}

function applyHook(target, actor, pull) {
  for (let step = 0; step < pull; step += 1) {
    const dx = actor.x - target.x;
    const dy = actor.y - target.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) <= 1) return;
    const horizontalFirst = Math.abs(dx) >= Math.abs(dy);
    const options = horizontalFirst
      ? [{dx: Math.sign(dx), dy: 0}, {dx: 0, dy: Math.sign(dy)}]
      : [{dx: 0, dy: Math.sign(dy)}, {dx: Math.sign(dx), dy: 0}];
    const next = options.map((option) => ({x: target.x + option.dx, y: target.y + option.dy}))
      .find((pos) => inside(pos.x, pos.y) && !(pos.x === actor.x && pos.y === actor.y));
    if (!next) return;
    target.x = next.x;
    target.y = next.y;
  }
}

function applyTokenEffects(token, skill, actor, target) {
  for (const char of token) {
    if (char === 'A' || char === 'D') {
      target.hp = Math.max(0, target.hp - (skill.damage || 10));
    } else if (char === 'H') {
      applyHook(target, actor, skill.hookPull || 1);
    } else if (char === 'I') {
      target.ice = 2;
      target.burn = 0;
    } else if (char === 'F') {
      target.burn = 2;
      target.ice = 0;
    }
  }
}

function checkWinner() {
  if (state.player.hp <= 0 && state.bot.hp <= 0) return 'draw';
  if (state.player.hp <= 0) return 'bot';
  if (state.bot.hp <= 0) return 'player';
  return null;
}

function resultPayload(result) {
  const nextGold = result === 'player' ? state.gold + state.reward : state.gold;
  const payload = {
    level: state.level,
    gold: nextGold,
    loadout: state.playerLoadout,
    items: state.items,
    armor: state.armor,
  };
  if (!campaign) {
    return {href: '../play/', label: 'Voltar lobby'};
  }
  return {
    href: campaignReturnHref(result === 'draw' ? 'bot' : result, payload),
    label: result === 'player' ? (state.level >= 12 ? 'Tela final' : 'Voltar city') : 'Game over',
  };
}

function openResult(result) {
  const nav = resultPayload(result);
  const title = result === 'player' ? 'Vitoria' : result === 'bot' ? 'Derrota' : 'Empate';
  const copy = result === 'player'
    ? (campaign ? `Voce venceu o level ${state.level} e volta com ${state.reward}g extras.` : 'A arena casual foi concluida com sucesso.')
    : result === 'bot'
      ? 'O bot fechou a luta antes de voce. Revise o deslocamento e o timing.'
      : 'Os dois atores cairam no mesmo round.';
  state.modal = {title, copy, href: nav.href, label: nav.label};
  state.phase = 'result';
  state.status = 'Partida encerrada';
}

async function executeMove(actorKey, action) {
  const actor = actorForKey(actorKey);
  const blocker = otherForKey(actorKey);
  const next = tryMovePos(actor, action.dir, blocker);
  if (next.x === actor.x && next.y === actor.y) {
    setBump(actorKey);
    render();
    await new Promise((resolve) => setTimeout(resolve, 140));
    clearBump();
    return;
  }
  actor.x = next.x;
  actor.y = next.y;
}

async function executeAttack(actorKey, action) {
  const actor = actorForKey(actorKey);
  const target = otherForKey(actorKey);
  const skill = SKILL_BY_ID.get(action.skillId);
  const placement = buildPlacement(action.skillId, actor, action.rotation, action.origin);
  setFlash(placement.effectCells);
  render();
  for (const cell of placement.effectCells) {
    if (cell.worldX === target.x && cell.worldY === target.y) {
      applyTokenEffects(cell.token, skill, actor, target);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 160));
  clearFlash();
}

async function executeAction(actorKey, action) {
  const actor = actorForKey(actorKey);
  if (!action || actor.hp <= 0) return;
  if (action.kind === 'move') {
    await executeMove(actorKey, action);
  } else if (action.kind === 'attack') {
    await executeAttack(actorKey, action);
  }
}

function applyRoundStatuses() {
  for (const actor of [state.player, state.bot]) {
    if (actor.burn > 0 && actor.hp > 0) {
      actor.hp = Math.max(0, actor.hp - 4);
      actor.burn -= 1;
    }
    if (actor.ice > 0) actor.ice -= 1;
  }
}

async function readyRound() {
  if (state.phase !== 'planning') return;
  state.phase = 'playback';
  state.botQueue = buildBotQueue();
  state.status = 'Resolvendo round';
  render();
  for (let slot = 0; slot < 3; slot += 1) {
    state.activeSlot = slot;
    state.status = `Executando slot ${slot + 1}`;
    render();
    await executeAction('player', state.queue[slot]);
    render();
    let winner = checkWinner();
    if (winner) {
      openResult(winner);
      render();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, STEP_MS));
    await executeAction('bot', state.botQueue[slot]);
    render();
    winner = checkWinner();
    if (winner) {
      openResult(winner);
      render();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, STEP_MS));
  }
  applyRoundStatuses();
  const finalWinner = checkWinner();
  if (finalWinner) {
    openResult(finalWinner);
  } else {
    state.round += 1;
    state.queue = [];
    state.botQueue = [];
    state.activeSlot = -1;
    state.targetMode = null;
    state.phase = 'planning';
    state.status = 'Planejamento aberto';
  }
  render();
}

function resetFight() {
  window.location.href = window.location.href;
}

function targetPlacement() {
  if (!state.targetMode) return null;
  return buildPlacement(state.targetMode.skillId, plannedPath().pos, state.targetMode.rotation, state.targetMode.origin);
}

function plannedGhost() {
  const plan = plannedPath();
  return plan.pos.x === state.player.x && plan.pos.y === state.player.y ? null : plan.pos;
}

function tileMarkup(x, y) {
  const preview = targetPlacement();
  const previewCell = preview?.cells.find((cell) => cell.worldX === x && cell.worldY === y);
  const trail = plannedPath().path.find((cell) => cell.x === x && cell.y === y);
  const ghost = plannedGhost();
  const pieces = [];
  const classes = ['board-tile'];
  if (previewCell) {
    classes.push(preview.valid ? 'tile--preview' : 'tile--preview-invalid');
    if (previewCell.token.includes('P')) classes.push('tile--anchor');
    if (previewCell.token.includes('I')) classes.push('tile--ice');
    if (previewCell.token.includes('F')) classes.push('tile--fire');
    if (previewCell.token.includes('H')) classes.push('tile--hook');
  }
  if (state.flashTiles.includes(keyOf(x, y))) classes.push('tile--flash');
  if (trail) pieces.push(`<span class="tile-step">${trail.step}</span>`);
  if (ghost && ghost.x === x && ghost.y === y) pieces.push('<span class="piece piece--ghost"></span>');
  if (state.player.hp > 0 && state.player.x === x && state.player.y === y) {
    pieces.push(`<span class="piece piece--player ${state.bumpActor === 'player' ? 'piece--bump' : ''}">P</span>`);
  }
  if (state.bot.hp > 0 && state.bot.x === x && state.bot.y === y) {
    pieces.push(`<span class="piece piece--bot ${state.bumpActor === 'bot' ? 'piece--bump' : ''}"><span>BOT</span><strong>${state.bot.hp}</strong></span>`);
  }
  return `<div class="${classes.join(' ')}">${pieces.join('')}</div>`;
}

function queueMarkup(queue) {
  return new Array(3).fill(null).map((_, index) => {
    const action = queue[index] || null;
    return `<div class="queue-slot ${state.activeSlot === index ? 'is-active' : ''}"><span>Slot ${index + 1}</span><strong>${queueLabel(action)}</strong></div>`;
  }).join('');
}

function skillsBandMarkup() {
  return loadoutToArray(state.playerLoadout).map((skillId, index) => {
    const skill = SKILL_BY_ID.get(skillId);
    if (!skill) {
      return `<button class="band-skill band-skill--empty" type="button" data-skill-slot="${index}">Vazio</button>`;
    }
    return `
      <button class="band-skill ${state.selectedSkillSlot === index ? 'is-selected' : ''}" type="button" data-skill-slot="${index}">
        <img src="${previewPath(skill)}" alt="${skill.label}">
        <span>${index + 1} · ${skill.label}</span>
      </button>
    `;
  }).join('');
}

function modalMarkup() {
  if (!state.modal) return '';
  return `
    <div class="modal-backdrop">
      <div class="modal-card modal-card--narrow" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div>
            <div class="page-header__eyebrow">Resultado</div>
            <h2 class="modal-title">${state.modal.title}</h2>
          </div>
        </div>
        <div class="modal-copy">${state.modal.copy}</div>
        <div class="modal-actions">
          <a class="button button--primary" href="${state.modal.href}">${state.modal.label}</a>
          <a class="button button--ghost" href="${currentReturnHref().href}">${currentReturnHref().label}</a>
        </div>
      </div>
    </div>
  `;
}

function render() {
  root.innerHTML = `
    <div class="page-shell page-shell--wide fight-shell">
      <header class="page-header page-header--inline">
        <div>
          <div class="page-header__eyebrow">${campaign ? 'City Duel' : 'Fight'}</div>
          <h1 class="page-header__title">${campaign ? `Level ${state.level}` : 'Combate direto'}</h1>
          <p class="page-header__copy">Grid 18x9, fila de 3 slots, preview de skill e resolucao slot a slot com o player agindo primeiro.</p>
        </div>
        <a class="button button--ghost" href="${currentReturnHref().href}">${currentReturnHref().label}</a>
      </header>

      <main class="fight-layout">
        <section class="panel fight-board-panel">
          <div class="board-grid">
            ${Array.from({length: BOARD_H}, (_, y) => Array.from({length: BOARD_W}, (_, x) => tileMarkup(x, y)).join('')).join('')}
          </div>
          <div class="fight-band">
            <div class="band-card">
              <span>Player HP</span>
              <strong>${state.player.hp}/${state.player.maxHp}</strong>
            </div>
            <div class="band-queue">${queueMarkup(state.queue)}</div>
            <div class="band-skills">${skillsBandMarkup()}</div>
          </div>
        </section>

        <aside class="sidebar panel">
          <div class="sidebar-stat"><span>Round</span><strong>${state.round}</strong></div>
          <div class="sidebar-stat"><span>Estado</span><strong>${state.status}</strong></div>
          <div class="sidebar-stat"><span>Bots vivos</span><strong>${state.bot.hp > 0 ? '1 vivo' : '0 vivos'}</strong></div>
          <div class="controls controls--actions">
            <button class="button button--primary" type="button" data-action="ready" ${state.phase !== 'planning' ? 'disabled' : ''}>Ready</button>
            <button class="button button--ghost" type="button" data-action="reset">Reset partida</button>
            <a class="button button--ghost" href="${currentReturnHref().href}">${currentReturnHref().label}</a>
          </div>
          <div class="controls controls--help">
            <div class="control-row"><strong>1 / 2 / 3</strong><span>Seleciona skill equipada</span></div>
            <div class="control-row"><strong>WASD / Setas</strong><span>Move ou ajusta a mira</span></div>
            <div class="control-row"><strong>Q / E</strong><span>Gira a skill</span></div>
            <div class="control-row"><strong>Espaco</strong><span>Confirma a skill em mira</span></div>
            <div class="control-row"><strong>Esc</strong><span>Sai da mira ou desfaz a ultima decisao</span></div>
            <div class="control-row"><strong>Enter</strong><span>Resolve o round</span></div>
          </div>
        </aside>
      </main>
      ${modalMarkup()}
    </div>
  `;

  for (const button of root.querySelectorAll('[data-skill-slot]')) {
    button.addEventListener('click', () => startTarget(Number.parseInt(button.getAttribute('data-skill-slot') || '0', 10)));
  }
  for (const button of root.querySelectorAll('[data-action="ready"]')) {
    button.addEventListener('click', readyRound);
  }
  for (const button of root.querySelectorAll('[data-action="reset"]')) {
    button.addEventListener('click', resetFight);
  }
}

window.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || state.phase === 'result') return;
  const key = event.key.toLowerCase();
  if (key === '1' || key === '2' || key === '3') {
    startTarget(Number.parseInt(key, 10) - 1);
    return;
  }
  if (key === 'q') {
    rotateTarget(-1);
    return;
  }
  if (key === 'e') {
    rotateTarget(1);
    return;
  }
  if (key === 'enter') {
    readyRound();
    return;
  }
  if (key === 'escape') {
    undoLast();
    return;
  }
  if (key === ' ') {
    event.preventDefault();
    confirmTarget();
    return;
  }
  const dirIndex = key === 'w' || key === 'arrowup' ? 0
    : key === 's' || key === 'arrowdown' ? 1
      : key === 'a' || key === 'arrowleft' ? 2
        : key === 'd' || key === 'arrowright' ? 3
          : -1;
  if (dirIndex >= 0) {
    event.preventDefault();
    queueMove(dirIndex);
  }
});

render();
