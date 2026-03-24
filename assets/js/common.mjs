import {SKILLS, SKILL_BY_ID, STARTER_SKILLS} from '../data/skills.mjs';

export {SKILLS, SKILL_BY_ID, STARTER_SKILLS};

export const CLASS_FILTERS = [
  {key: 'all', label: 'All'},
  {key: 'ranged', label: 'Ranged'},
  {key: 'mage', label: 'Mage'},
  {key: 'melee', label: 'Melee'},
];

export const SHOP_LABELS = {
  wizard: "Wizard's Tower",
  bowyer: "The Bowyer's Workshop",
  blacksmith: "The Blacksmith's Forge",
};

export const ARMOR_CATALOG = [
  {key: 'ab', label: 'Bronze Buckler', hp: 8, price: 90, shop: 'blacksmith', description: 'Escudo de bronze para rounds mais seguros.'},
  {key: 'al', label: 'Leather Lamellar', hp: 10, price: 110, shop: 'blacksmith', description: 'Couro reforcado para campanha longa.'},
  {key: 'ac', label: 'Chain Coat', hp: 12, price: 140, shop: 'blacksmith', description: 'Malha pesada para gates de eliminacao.'},
  {key: 'ah', label: 'Hunter Hood', hp: 6, price: 80, shop: 'blacksmith', description: 'Capuz leve para rounds de pressao e mira.'},
];

export const CAMPAIGN_LEVELS = [
  {level: 1, title: 'Bramble Guard', gate: false, reward: 36, botHp: 42, botLoadout: {s1: 1, s2: 0, s3: 0}, armorHint: 'Bronze'},
  {level: 2, title: 'River Archer', gate: false, reward: 44, botHp: 46, botLoadout: {s1: 7, s2: 0, s3: 0}, armorHint: 'Leather'},
  {level: 3, title: 'Cold Lantern', gate: false, reward: 52, botHp: 48, botLoadout: {s1: 12, s2: 0, s3: 0}, armorHint: 'Leather'},
  {level: 4, title: 'First Gate', gate: true, reward: 82, botHp: 58, botLoadout: {s1: 5, s2: 7, s3: 12}, armorHint: 'Chain'},
  {level: 5, title: 'Forge Marauder', gate: false, reward: 58, botHp: 56, botLoadout: {s1: 6, s2: 2, s3: 3}, armorHint: 'Chain'},
  {level: 6, title: 'High Perch', gate: false, reward: 66, botHp: 60, botLoadout: {s1: 8, s2: 10, s3: 7}, armorHint: 'Hunter'},
  {level: 7, title: 'Ash Scholar', gate: false, reward: 74, botHp: 66, botLoadout: {s1: 13, s2: 14, s3: 12}, armorHint: 'Chain'},
  {level: 8, title: 'Second Gate', gate: true, reward: 98, botHp: 74, botLoadout: {s1: 5, s2: 9, s3: 15}, armorHint: 'Chain'},
  {level: 9, title: 'Bridge Warden', gate: false, reward: 84, botHp: 76, botLoadout: {s1: 6, s2: 11, s3: 16}, armorHint: 'Hunter'},
  {level: 10, title: 'Canyon Volley', gate: false, reward: 92, botHp: 80, botLoadout: {s1: 18, s2: 9, s3: 8}, armorHint: 'Hunter'},
  {level: 11, title: 'Halo Adept', gate: false, reward: 108, botHp: 84, botLoadout: {s1: 17, s2: 15, s3: 14}, armorHint: 'Chain'},
  {level: 12, title: 'Final Gate', gate: true, reward: 150, botHp: 92, botLoadout: {s1: 5, s2: 18, s3: 17}, armorHint: 'Full kit'},
];

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function parseU32(params, key, fallback = 0) {
  const raw = params.get(key);
  if (!raw) return fallback >>> 0;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 0) return fallback >>> 0;
  return value >>> 0;
}

export function parseCSVNumbers(raw) {
  return (raw || '')
    .split(',')
    .map((chunk) => Number.parseInt(chunk, 10))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => value >>> 0);
}

export function uniqueNumbers(values) {
  return [...new Set(values.map((value) => value >>> 0))];
}

export function buildCSV(values) {
  return uniqueNumbers(values).join(',');
}

export function loadoutFromParams(params, prefix = 'p', fallback = STARTER_SKILLS) {
  const s1 = parseU32(params, `${prefix}s1`, fallback[0] || 0);
  const s2 = parseU32(params, `${prefix}s2`, fallback[1] || 0);
  const s3 = parseU32(params, `${prefix}s3`, fallback[2] || 0);
  return {s1, s2, s3};
}

export function loadoutToArray(loadout) {
  return [loadout.s1 >>> 0, loadout.s2 >>> 0, loadout.s3 >>> 0];
}

export function loadoutCount(loadout) {
  return loadoutToArray(loadout).filter(Boolean).length;
}

export function loadoutFromArray(values) {
  const next = [...values, 0, 0, 0];
  return {s1: next[0] >>> 0, s2: next[1] >>> 0, s3: next[2] >>> 0};
}

export function normalizeLoadout(loadout, fallback = STARTER_SKILLS) {
  const values = loadoutToArray(loadout).map((value, idx) => {
    if (value && SKILL_BY_ID.has(value)) return value;
    return fallback[idx] && SKILL_BY_ID.has(fallback[idx]) ? fallback[idx] : 0;
  });
  return loadoutFromArray(values);
}

export function classMatchesFilter(skill, filterKey) {
  if (filterKey === 'all') return true;
  return skill.classKey === filterKey;
}

export function previewPath(skill) {
  return `../assets/skills/${skill.slug}.svg`;
}

export function armorStateFromParams(params) {
  const state = {};
  for (const armor of ARMOR_CATALOG) {
    state[armor.key] = parseU32(params, armor.key, 0) === 1 ? 1 : 0;
  }
  return state;
}

export function playerMaxHpFromArmor(armorState) {
  return 50 + ARMOR_CATALOG.reduce((sum, armor) => sum + (armorState[armor.key] ? armor.hp : 0), 0);
}

export function levelInfo(level) {
  return CAMPAIGN_LEVELS.find((entry) => entry.level === clamp(level, 1, 12)) || CAMPAIGN_LEVELS[0];
}

export function starterInventoryFromParams(params) {
  const raw = params.get('items');
  if (!raw) return [...STARTER_SKILLS];
  const values = uniqueNumbers(parseCSVNumbers(raw)).filter((value) => SKILL_BY_ID.has(value));
  for (const starter of STARTER_SKILLS) {
    if (!values.includes(starter)) values.unshift(starter);
  }
  return uniqueNumbers(values);
}

export function setUrlFromParams(params) {
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', next);
}

export function campaignStateFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const level = clamp(parseU32(params, 'level', 1), 1, 12);
  const loadout = normalizeLoadout(loadoutFromParams(params, 'p', STARTER_SKILLS), STARTER_SKILLS);
  return {
    screen: params.get('screen') || 'city',
    level,
    gold: parseU32(params, 'gold', 0),
    items: starterInventoryFromParams(params),
    loadout,
    armor: armorStateFromParams(params),
  };
}

export function syncCampaignParams(state) {
  const params = new URLSearchParams();
  params.set('screen', state.screen);
  params.set('level', String(clamp(state.level, 1, 12)));
  params.set('gold', String(state.gold >>> 0));
  params.set('ps1', String(state.loadout.s1 >>> 0));
  params.set('ps2', String(state.loadout.s2 >>> 0));
  params.set('ps3', String(state.loadout.s3 >>> 0));
  params.set('items', buildCSV(state.items));
  for (const armor of ARMOR_CATALOG) {
    params.set(armor.key, state.armor[armor.key] ? '1' : '0');
  }
  setUrlFromParams(params);
}

export function campaignFightHref(state, overrides = {}) {
  const level = clamp(overrides.level ?? state.level, 1, 12);
  const info = levelInfo(level);
  const playerHp = overrides.playerHp ?? playerMaxHpFromArmor(state.armor);
  const gold = overrides.gold ?? state.gold;
  const params = new URLSearchParams();
  params.set('campaign', '1');
  params.set('level', String(level));
  params.set('gold', String(gold >>> 0));
  params.set('reward', String(info.reward));
  params.set('php', String(playerHp >>> 0));
  params.set('bhp', String(info.botHp >>> 0));
  params.set('ps1', String(state.loadout.s1 >>> 0));
  params.set('ps2', String(state.loadout.s2 >>> 0));
  params.set('ps3', String(state.loadout.s3 >>> 0));
  params.set('bs1', String(info.botLoadout.s1 >>> 0));
  params.set('bs2', String(info.botLoadout.s2 >>> 0));
  params.set('bs3', String(info.botLoadout.s3 >>> 0));
  params.set('items', buildCSV(state.items));
  for (const armor of ARMOR_CATALOG) {
    params.set(armor.key, state.armor[armor.key] ? '1' : '0');
  }
  return `../city-duel/?${params.toString()}`;
}

export function campaignReturnHref(result, payload) {
  const params = new URLSearchParams();
  const level = clamp(payload.level, 1, 12);
  if (result === 'player' && level >= 12) {
    params.set('screen', 'victory');
  } else if (result === 'player') {
    params.set('screen', 'city');
    params.set('level', String(level + 1));
  } else {
    params.set('screen', 'game_over');
    params.set('level', String(level));
  }
  params.set('gold', String(payload.gold >>> 0));
  params.set('ps1', String(payload.loadout.s1 >>> 0));
  params.set('ps2', String(payload.loadout.s2 >>> 0));
  params.set('ps3', String(payload.loadout.s3 >>> 0));
  params.set('items', buildCSV(payload.items));
  for (const armor of ARMOR_CATALOG) {
    params.set(armor.key, payload.armor[armor.key] ? '1' : '0');
  }
  return `../story/?${params.toString()}`;
}

export function skillCardMarkup(skill, options = {}) {
  const {actionLabel = '', selected = false, equipped = false, compact = false, subtitle = ''} = options;
  const flags = ['skill-card', compact ? 'skill-card--compact' : '', selected ? 'is-selected' : '', equipped ? 'is-equipped' : '']
    .filter(Boolean)
    .join(' ');
  return `
    <article class="${flags}" data-skill-id="${skill.id}">
      <div class="skill-card__preview"><img src="${previewPath(skill)}" alt="${skill.label}" loading="lazy"></div>
      <div class="skill-card__body">
        <div class="skill-card__topline">
          <span class="skill-card__label">${skill.label}</span>
          <span class="skill-card__badge">${skill.classLabel}</span>
        </div>
        <p class="skill-card__copy">${subtitle || skill.description}</p>
        <div class="skill-card__meta">
          <span>Rank ${skill.rank}</span>
          <span>${skill.price}g</span>
          ${actionLabel ? `<span>${actionLabel}</span>` : ''}
        </div>
      </div>
    </article>
  `;
}

export function queueLabel(action) {
  if (!action) return 'Wait';
  if (action.kind === 'move') return `Move ${action.dirLabel}`;
  return SKILL_BY_ID.get(action.skillId)?.label || 'Skill';
}
