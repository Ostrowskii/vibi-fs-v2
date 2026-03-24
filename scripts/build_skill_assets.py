#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "src" / "shared" / "fight" / "_.bend"
SKILLS_DIR = ROOT / "assets" / "skills"
DATA_DIR = ROOT / "assets" / "data"
PUBLIC_BG = ROOT / "assets" / "background" / "background-para-substituir.png"
SOURCE_BG = ROOT / "buildfight" / "assets" / "background" / "background-para-substituir.png"

TOKEN_BITS = {
    "A": 1,
    "D": 1,
    "H": 2,
    "I": 4,
    "F": 8,
    "P": 16,
}

COLORS = {
    "empty": ("#f8efd7", None),
    "anchor": ("#58d8e8", None),
    "attack": ("#ddb151", None),
    "hook": ("#2f7d32", None),
    "ice": ("#70aee4", None),
    "fire": ("#df8d39", None),
    "attack_hook": ("#d94933", "#2f7d32"),
    "attack_ice": ("#d94933", "#70aee4"),
    "attack_fire": ("#d94933", "#df8d39"),
}


def extract_catalog() -> list[dict[str, object]]:
    source = CATALOG_PATH.read_text()
    match = re.search(
        r'def skill_catalog_json\(\) -> String:\n\s+"""\n(.*?)\n\s+"""',
        source,
        re.DOTALL,
    )
    if not match:
        raise RuntimeError("Could not find skill catalog JSON block")
    raw = match.group(1)
    data = json.loads(raw)
    if not isinstance(data, list):
        raise RuntimeError("Skill catalog must be a list")
    return data


def mask_for_token(token: str) -> int:
    mask = 0
    for char in token:
        mask |= TOKEN_BITS.get(char, 0)
    return mask


def cell_style(mask: int) -> tuple[str, str | None]:
    has_attack = bool(mask & 1)
    has_hook = bool(mask & 2)
    has_ice = bool(mask & 4)
    has_fire = bool(mask & 8)
    has_player = bool(mask & 16)
    if has_player:
        return COLORS["anchor"]
    if has_attack and has_hook:
        return COLORS["attack_hook"]
    if has_attack and has_ice:
        return COLORS["attack_ice"]
    if has_attack and has_fire:
        return COLORS["attack_fire"]
    if has_attack:
        return COLORS["attack"]
    if has_hook:
        return COLORS["hook"]
    if has_ice:
        return COLORS["ice"]
    if has_fire:
        return COLORS["fire"]
    return COLORS["empty"]


def build_svg(skill: dict[str, object]) -> str:
    shape = skill["shape"]
    if not isinstance(shape, list) or not shape:
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"></svg>\n'

    height = len(shape)
    width = max(len(row) for row in shape)
    occupied: list[tuple[int, int, str]] = []
    for y, row in enumerate(shape):
        for x, token in enumerate(row):
            token = str(token)
            if token:
                occupied.append((x, y, token))

    canvas = 64
    padding = 4
    gap = 2
    max_dim = max(width, height)
    cell = max(4, (canvas - padding * 2 - gap * (max_dim - 1)) // max_dim)
    real_w = width * cell + gap * (width - 1)
    real_h = height * cell + gap * (height - 1)
    offset_x = (canvas - real_w) // 2
    offset_y = (canvas - real_h) // 2

    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="{}">'.format(skill["label"]),
        f"<title>{skill['label']}</title>",
    ]
    for x, y, token in occupied:
        fill, stroke = cell_style(mask_for_token(token))
        px = offset_x + x * (cell + gap)
        py = offset_y + y * (cell + gap)
        attrs = [
            f'x="{px}"',
            f'y="{py}"',
            f'width="{cell}"',
            f'height="{cell}"',
            f'fill="{fill}"',
            'rx="4"',
            'ry="4"',
        ]
        if stroke:
            attrs.append(f'stroke="{stroke}"')
            attrs.append('stroke-width="2"')
        parts.append(f"<rect {' '.join(attrs)} />")
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def enrich_skill(skill: dict[str, object]) -> dict[str, object]:
    shape = skill["shape"]
    width = max(len(row) for row in shape)
    height = len(shape)
    cells = []
    anchors = []
    attack_cells = []
    occupied = []
    for y, row in enumerate(shape):
        for x, token in enumerate(row):
            token = str(token)
            if not token:
                continue
            cell = {"x": x, "y": y, "token": token, "mask": mask_for_token(token)}
            cells.append(cell)
            occupied.append({"x": x, "y": y})
            if "P" in token:
                anchors.append({"x": x, "y": y})
            if any(ch in token for ch in ("A", "D", "H", "I", "F")):
                attack_cells.append({"x": x, "y": y, "token": token})
    class_label = {0: "Melee", 1: "Ranged", 2: "Mage"}[int(skill["classId"])]
    return {
        **skill,
        "label": str(skill["label"]),
        "width": width,
        "height": height,
        "classLabel": class_label,
        "cells": cells,
        "anchors": anchors,
        "occupied": occupied,
        "attackCells": attack_cells,
    }


def write_catalog(skills: list[dict[str, object]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    payload = [enrich_skill(skill) for skill in skills]
    module = "export const SKILLS = " + json.dumps(payload, indent=2, ensure_ascii=False) + ";\n"
    module += "export const SKILL_BY_ID = new Map(SKILLS.map((skill) => [skill.id, skill]));\n"
    module += "export const STARTER_SKILLS = [1, 7, 12];\n"
    (DATA_DIR / "skills.mjs").write_text(module)
    (DATA_DIR / "skills.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")


def write_svgs(skills: list[dict[str, object]]) -> None:
    SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    for skill in skills:
        svg = build_svg(skill)
        (SKILLS_DIR / f"{skill['slug']}.svg").write_text(svg)


def sync_background() -> None:
    if SOURCE_BG.exists() and not PUBLIC_BG.exists():
        PUBLIC_BG.parent.mkdir(parents=True, exist_ok=True)
        PUBLIC_BG.write_bytes(SOURCE_BG.read_bytes())


def main() -> None:
    skills = extract_catalog()
    write_catalog(skills)
    write_svgs(skills)
    sync_background()


if __name__ == "__main__":
    main()
