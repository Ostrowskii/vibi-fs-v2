# Shared skill catalog source of truth.
# The JSON block below is consumed by the SVG/data build scripts.
-- VIBI_SKILL_CATALOG_START
[
  {
    "id": 0,
    "name": "RustSlash",
    "classId": 0,
    "className": "melee",
    "rank": 1,
    "damage": 10,
    "price": 18,
    "shop": "forge",
    "summary": "Cross slash for close pressure.",
    "grid": [[".","A","."],["A","A","A"],[".","A","."]]
  },
  {
    "id": 1,
    "name": "TwinPike",
    "classId": 0,
    "className": "melee",
    "rank": 1,
    "damage": 10,
    "price": 20,
    "shop": "forge",
    "summary": "Twin lanes that punish sidesteps.",
    "grid": [["A",".","A"],["A",".","A"],[".",".","."]]
  },
  {
    "id": 2,
    "name": "CornerSweep",
    "classId": 0,
    "className": "melee",
    "rank": 2,
    "damage": 12,
    "price": 26,
    "shop": "forge",
    "summary": "L-shaped sweep for edge traps.",
    "grid": [["A","A","A"],["A",".","."],["A",".","."]]
  },
  {
    "id": 3,
    "name": "HookRail",
    "classId": 0,
    "className": "melee",
    "rank": 2,
    "damage": 0,
    "price": 28,
    "shop": "forge",
    "summary": "Pure hook line that drags the target.",
    "grid": [["H","H","H","H","H","H","H"]]
  },
  {
    "id": 4,
    "name": "ChainBreaker",
    "classId": 0,
    "className": "melee",
    "rank": 3,
    "damage": 14,
    "price": 34,
    "shop": "forge",
    "summary": "Anchored hook strike with a finishing hit.",
    "grid": [["P","H","H","H","DH"]]
  },
  {
    "id": 5,
    "name": "Pinshot",
    "classId": 1,
    "className": "ranged",
    "rank": 1,
    "damage": 10,
    "price": 20,
    "shop": "bowyer",
    "summary": "Single distant shot for lane control.",
    "grid": [
      ["P",".","P",".",".",".",".",".","."],
      ["P",".","P",".",".",".",".",".","."],
      ["P",".","P",".",".",".",".",".","D"],
      ["P",".","P",".",".",".",".",".","."],
      ["P",".","P",".",".",".",".",".","."]
    ]
  },
  {
    "id": 6,
    "name": "BroadVolley",
    "classId": 1,
    "className": "ranged",
    "rank": 2,
    "damage": 10,
    "price": 28,
    "shop": "bowyer",
    "summary": "Full vertical volley in the far lane.",
    "grid": [
      ["P",".","P",".",".",".",".",".","D"],
      ["P",".","P",".",".",".",".",".","D"],
      ["P",".","P",".",".",".",".",".","D"],
      ["P",".","P",".",".",".",".",".","D"],
      ["P",".","P",".",".",".",".",".","D"]
    ]
  },
  {
    "id": 7,
    "name": "TwinSpire",
    "classId": 1,
    "className": "ranged",
    "rank": 2,
    "damage": 11,
    "price": 30,
    "shop": "bowyer",
    "summary": "Two distant spires that cover a wider lane.",
    "grid": [
      ["P",".","P",".",".",".",".","D","D"],
      ["P",".","P",".",".",".",".","D","D"],
      ["P",".","P",".",".",".",".",".","."],
      ["P",".","P",".",".",".",".","D","D"],
      ["P",".","P",".",".",".",".","D","D"]
    ]
  },
  {
    "id": 8,
    "name": "FalconCross",
    "classId": 1,
    "className": "ranged",
    "rank": 3,
    "damage": 12,
    "price": 36,
    "shop": "bowyer",
    "summary": "Cross-shaped ranged burst.",
    "grid": [
      ["P",".","P",".",".",".",".",".","D"],
      ["P",".","P",".",".",".",".","D","D"],
      ["P",".","P",".",".",".",".","D","D"],
      ["P",".","P",".",".",".",".","D","D"],
      ["P",".","P",".",".",".",".",".","D"]
    ]
  },
  {
    "id": 9,
    "name": "MirrorCorners",
    "classId": 1,
    "className": "ranged",
    "rank": 3,
    "damage": 12,
    "price": 38,
    "shop": "bowyer",
    "summary": "Mirrored corner shots for edge pinches.",
    "grid": [
      ["P",".","P",".",".",".",".","D","."],
      ["P",".","P",".",".",".",".",".","."],
      ["P",".","P",".",".",".",".",".","."],
      ["P",".","P",".",".",".",".",".","."],
      ["P",".","P",".",".",".",".","D","."]
    ]
  },
  {
    "id": 10,
    "name": "FrostZig",
    "classId": 2,
    "className": "mage",
    "rank": 1,
    "damage": 10,
    "price": 22,
    "shop": "tower",
    "summary": "Compact frost zigzag.",
    "grid": [
      ["P",".",".",".",".","I","I"],
      [".","P",".",".",".","I","I"],
      ["P",".",".",".",".","I","."]
    ]
  },
  {
    "id": 11,
    "name": "EmberChevron",
    "classId": 2,
    "className": "mage",
    "rank": 1,
    "damage": 10,
    "price": 24,
    "shop": "tower",
    "summary": "Fire chevron that opens side lanes.",
    "grid": [
      ["P",".",".",".",".","F","."],
      [".","P",".",".",".","F","F"],
      ["P",".",".",".",".","F","."]
    ]
  },
  {
    "id": 12,
    "name": "FrostLance",
    "classId": 2,
    "className": "mage",
    "rank": 2,
    "damage": 11,
    "price": 30,
    "shop": "tower",
    "summary": "Long frost lance with direct damage.",
    "grid": [
      ["P",".",".",".",".",".","DI"],
      [".","P",".",".",".",".","DI"],
      ["P",".",".",".",".",".","DI"],
      [".","P",".",".",".",".","DI"],
      ["P",".",".",".",".",".","DI"]
    ]
  },
  {
    "id": 13,
    "name": "CinderHalo",
    "classId": 2,
    "className": "mage",
    "rank": 2,
    "damage": 12,
    "price": 32,
    "shop": "tower",
    "summary": "Burning halo with a denser center.",
    "grid": [
      ["P",".",".",".",".","DF","F"],
      [".","P",".",".",".","F","DF"],
      ["P",".",".",".",".","DF","F"]
    ]
  },
  {
    "id": 14,
    "name": "GlacierCrown",
    "classId": 2,
    "className": "mage",
    "rank": 3,
    "damage": 12,
    "price": 38,
    "shop": "tower",
    "summary": "Crown of ice shards for wider denial.",
    "grid": [
      ["P",".",".",".",".","I",".","I"],
      [".","P",".",".",".","DI","I","DI"],
      ["P",".",".",".",".","I",".","I"]
    ]
  }
]
-- VIBI_SKILL_CATALOG_END
