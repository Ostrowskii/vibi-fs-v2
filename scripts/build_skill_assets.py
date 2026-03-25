#!/usr/bin/env python3

from __future__ import annotations

import json
from pathlib import Path

from generate_skill_svgs import build_svg, parse_catalog

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src' / 'shared' / 'fight' / '_.bend'
DATA_DIR = ROOT / 'assets' / 'data'
SVG_DIR = ROOT / 'assets' / 'skills'


def main() -> None:
    skills = parse_catalog(SRC.read_text())
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / 'skills.json').write_text(json.dumps(skills, indent=2) + '\n')
    module_text = 'export const SKILLS = ' + json.dumps(skills, indent=2) + ';\n'
    module_text += 'export const SKILL_MAP = new Map(SKILLS.map((skill) => [skill.id, skill]));\n'
    module_text += 'export const CLASS_GROUPS = {\n'
    module_text += "  melee: SKILLS.filter((skill) => skill.className === 'melee'),\n"
    module_text += "  ranged: SKILLS.filter((skill) => skill.className === 'ranged'),\n"
    module_text += "  mage: SKILLS.filter((skill) => skill.className === 'mage'),\n"
    module_text += '};\n'
    (DATA_DIR / 'skills.mjs').write_text(module_text)
    for skill in skills:
        (SVG_DIR / f"{skill['name']}.svg").write_text(build_svg(skill))


if __name__ == '__main__':
    main()
