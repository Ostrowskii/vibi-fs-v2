import { SKILLS, SKILL_MAP } from '../data/skills.mjs';

export { SKILLS, SKILL_MAP };

export const BOARD_W = 18;
export const BOARD_H = 9;
export const CLASS_META = {
  0: { key: 'melee', label: 'Melee' },
  1: { key: 'ranged', label: 'Ranged' },
  2: { key: 'mage', label: 'Mage' },
};

export const ARMORS = {
  ab: { id: 'ab', name: 'Ash Buckler Mail', hp: 50, price: 0 },
  al: { id: 'al', name: 'Amber Lamellar', hp: 58, price: 42 },
  ac: { id: 'ac', name: 'Citadel Coat', hp: 66, price: 64 },
  ah: { id: 'ah', name: 'Herald Harness', hp: 74, price: 88 },
};

export const SHOP_META = {
  tower: { key: 'tower', title: "Wizard's Tower", copy: 'Elemental zigzags and halo bursts.' },
  bowyer: { key: 'bowyer', title: "The Bowyer's Workshop", copy: 'Long lanes, mirrored corners, and volleys.' },
  forge: { key: 'forge', title: "The Blacksmith's Forge", copy: 'Close-range impact tools, hooks, and armor.' },
};

export const DEFAULT_PLAYER_LOADOUT = [0, 8, 10];
export const DEFAULT_BOT_LOADOUT = [1, 6, 11];

export function parseParams(search = window.location.search) {
  return new URLSearchParams(search);
}

export function skillIconUrl(skill) {
  return new URL(`../skills/${encodeURIComponent(skill.name)}.svg`, import.meta.url).href;
}

export function classLabel(classId) {
  return CLASS_META[classId]?.label ?? 'Unknown';
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function readInt(params, key, fallback) {
  const value = Number.parseInt(params.get(key) ?? '', 10);
  return Number.isFinite(value) ? value : fallback;
}

export function readList(params, key) {
  const raw = params.get(key);
  if (!raw) return [];
  return raw
    .split(',')
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value));
}

export function writeList(values) {
  return values.filter((value) => Number.isFinite(value)).join(',');
}

export function loadoutFromParams(params, prefix, fallback) {
  return Array.from({ length: 3 }, (_, index) => {
    const value = Number.parseInt(params.get(`${prefix}${index + 1}`) ?? '', 10);
    return Number.isFinite(value) && SKILL_MAP.has(value) ? value : fallback[index];
  });
}

export function writeLoadout(params, prefix, loadout) {
  loadout.forEach((skillId, index) => {
    params.set(`${prefix}${index + 1}`, String(skillId));
  });
}

export function getSkill(skillId) {
  return SKILL_MAP.get(Number(skillId)) ?? SKILLS[0];
}

export function getArmorHp(armorId) {
  return ARMORS[armorId]?.hp ?? ARMORS.ab.hp;
}

export function encodeStoryState(state) {
  const params = new URLSearchParams();
  params.set('screen', state.screen);
  params.set('level', String(state.level));
  params.set('gold', String(state.gold));
  params.set('armor', state.armor);
  if (state.inventory.length) params.set('inv', writeList(state.inventory));
  if (state.loadout.length) params.set('eq', writeList(state.loadout));
  return params.toString();
}

export function parseStoryState(params) {
  const inventory = readList(params, 'inv');
  const loadout = readList(params, 'eq');
  return {
    screen: params.get('screen') || 'city',
    level: clamp(readInt(params, 'level', 1), 1, 12),
    gold: Math.max(0, readInt(params, 'gold', 48)),
    armor: ARMORS[params.get('armor')] ? params.get('armor') : 'ab',
    inventory: Array.from(new Set(inventory.length ? inventory : DEFAULT_PLAYER_LOADOUT)),
    loadout: Array.from(new Set(loadout.length ? loadout : DEFAULT_PLAYER_LOADOUT)).slice(0, 3),
  };
}

export function getLevelSetup(level) {
  const templates = [
    [1, 5, 10],
    [0, 6, 11],
    [2, 5, 12],
    [4, 8, 13],
    [1, 7, 10],
    [3, 8, 12],
    [2, 6, 14],
    [4, 9, 13],
    [0, 7, 14],
    [2, 9, 12],
    [4, 8, 14],
    [4, 9, 13],
  ];
  return {
    level,
    reward: 16 + (level * 6),
    botHp: 48 + (level * 6),
    loadout: templates[level - 1],
    cta: [4, 8, 12].includes(level) ? 'Rodada eliminatoria' : 'Duel',
    district: level <= 4 ? 'Lower wards' : level <= 8 ? 'Guild ridge' : 'Crown ascent',
  };
}

export function getShopSkills(shopKey) {
  return SKILLS.filter((skill) => skill.shop === shopKey);
}

export function getShopArmors() {
  return Object.values(ARMORS).filter((armor) => armor.price > 0);
}

export function posKey(x, y) {
  return `${x},${y}`;
}

export function samePos(left, right) {
  return !!left && !!right && left.x === right.x && left.y === right.y;
}

export function inBounds(x, y) {
  return x >= 0 && x < BOARD_W && y >= 0 && y < BOARD_H;
}

export function dxdy(dir) {
  if (dir === 'up') return { x: 0, y: -1 };
  if (dir === 'down') return { x: 0, y: 1 };
  if (dir === 'left') return { x: -1, y: 0 };
  return { x: 1, y: 0 };
}

export function chebyshev(a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function preferredRotations(actorPos, targetPos) {
  const dx = targetPos.x - actorPos.x;
  const dy = targetPos.y - actorPos.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? [0, 1, 3, 2] : [2, 1, 3, 0];
  }
  return dy >= 0 ? [1, 0, 2, 3] : [3, 0, 2, 1];
}

export function cellTokens(cell) {
  if (!cell || cell === '.') return [];
  return [...cell];
}

export function rotateGrid(grid, rotation) {
  let next = grid.map((row) => row.slice());
  for (let step = 0; step < ((rotation % 4) + 4) % 4; step += 1) {
    const height = next.length;
    const width = next[0].length;
    const rotated = Array.from({ length: width }, () => Array.from({ length: height }, () => '.'));
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        rotated[x][height - 1 - y] = next[y][x];
      }
    }
    next = rotated;
  }
  return next;
}

export function occupiedCells(skill, rotation = 0) {
  const grid = rotateGrid(skill.grid, rotation);
  const cells = [];
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[0].length; x += 1) {
      if (grid[y][x] === '.') continue;
      cells.push({ x, y, cell: grid[y][x], tokens: cellTokens(grid[y][x]) });
    }
  }
  return { grid, cells, width: grid[0].length, height: grid.length };
}

export function anchorCells(skill, rotation = 0) {
  const rotated = occupiedCells(skill, rotation);
  const anchors = rotated.cells.filter((cell) => cell.tokens.includes('P'));
  return anchors.length ? anchors : rotated.cells;
}

export function placementFromOrigin(skill, actorPos, rotation, origin) {
  const anchors = anchorCells(skill, rotation);
  const anchored = anchors.some((anchor) => actorPos.x === origin.x + anchor.x && actorPos.y === origin.y + anchor.y);
  if (!anchored) return null;
  const rotated = occupiedCells(skill, rotation);
  return {
    rotation,
    origin,
    cells: rotated.cells.map((cell) => ({
      x: origin.x + cell.x,
      y: origin.y + cell.y,
      cell: cell.cell,
      tokens: cell.tokens,
    })),
  };
}

export function allPlacementsForActor(skill, actorPos, rotation = 0) {
  return anchorCells(skill, rotation).map((anchor) => ({
    origin: { x: actorPos.x - anchor.x, y: actorPos.y - anchor.y },
    rotation,
  }));
}

export function effectCells(placement, actorPos) {
  return placement.cells.filter((cell) => !(cell.x === actorPos.x && cell.y === actorPos.y));
}

export function firstPlacementThatHits(skill, actorPos, targetPos, rotationOrder = [0, 1, 2, 3]) {
  for (const rotation of rotationOrder) {
    for (const candidate of allPlacementsForActor(skill, actorPos, rotation)) {
      const placement = placementFromOrigin(skill, actorPos, rotation, candidate.origin);
      if (!placement) continue;
      if (effectCells(placement, actorPos).some((cell) => cell.x === targetPos.x && cell.y === targetPos.y)) {
        return placement;
      }
    }
  }
  return null;
}

export function formatAction(action) {
  if (!action) return 'Wait';
  if (action.type === 'move') return `Move ${action.dir}`;
  if (action.type === 'attack') return getSkill(action.skillId).name;
  return 'Wait';
}

export function describeQueue(queue) {
  return Array.from({ length: 3 }, (_, index) => formatAction(queue[index]));
}
