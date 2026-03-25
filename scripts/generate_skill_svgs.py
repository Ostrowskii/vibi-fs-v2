#!/usr/bin/env python3

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src' / 'shared' / 'fight' / '_.bend'
OUT_DIR = ROOT / 'assets' / 'skills'
CATALOG_START = '-- VIBI_SKILL_CATALOG_START'
CATALOG_END = '-- VIBI_SKILL_CATALOG_END'
COLORS = {
    'P': ('#58d8e8', None),
    'A': ('#ddb151', None),
    'D': ('#ddb151', None),
    'H': ('#2f7d32', '#18451a'),
    'I': ('#70aee4', None),
    'F': ('#d94933', None),
}


def parse_catalog(source: str) -> list[dict]:
    start = source.index(CATALOG_START) + len(CATALOG_START)
    end = source.index(CATALOG_END)
    return json.loads(source[start:end].strip())


def cell_style(cell: str) -> tuple[str, str | None]:
    if cell == '.':
        return ('#f8efd7', None)
    if 'P' in cell:
        return COLORS['P']
    if 'H' in cell and ('D' in cell or 'A' in cell):
        return ('#d94933', '#18451a')
    if 'D' in cell and 'I' in cell:
        return ('#d94933', '#70aee4')
    if 'D' in cell and 'F' in cell:
        return ('#d94933', '#df8d39')
    if 'I' in cell:
        return COLORS['I']
    if 'F' in cell:
        return COLORS['F']
    if 'H' in cell:
        return COLORS['H']
    if 'D' in cell or 'A' in cell:
        return COLORS['A']
    return ('#f8efd7', None)


def build_svg(skill: dict) -> str:
    grid = skill['grid']
    occupied = [(x, y) for y, row in enumerate(grid) for x, cell in enumerate(row) if cell != '.']
    if not occupied:
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"></svg>\n'

    min_x = min(x for x, _ in occupied)
    max_x = max(x for x, _ in occupied)
    min_y = min(y for _, y in occupied)
    max_y = max(y for _, y in occupied)
    trim_w = max_x - min_x + 1
    trim_h = max_y - min_y + 1
    canvas = 64
    padding = 4
    gap = 1
    max_dim = max(trim_w, trim_h)
    cell_size = max(2, (canvas - (padding * 2) - (gap * (max_dim - 1))) // max_dim)
    real_w = trim_w * cell_size + (trim_w - 1) * gap
    real_h = trim_h * cell_size + (trim_h - 1) * gap
    offset_x = (canvas - real_w) // 2
    offset_y = (canvas - real_h) // 2
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="%s">' % skill['name'],
        f'<title>{skill["name"]}</title>',
    ]
    for y in range(min_y, max_y + 1):
        for x in range(min_x, max_x + 1):
            cell = grid[y][x]
            if cell == '.':
                continue
            fill, stroke = cell_style(cell)
            px = offset_x + (x - min_x) * (cell_size + gap)
            py = offset_y + (y - min_y) * (cell_size + gap)
            attrs = [
                f'x="{px}"',
                f'y="{py}"',
                f'width="{cell_size}"',
                f'height="{cell_size}"',
                f'fill="{fill}"',
            ]
            if stroke:
                attrs.append(f'stroke="{stroke}"')
                attrs.append('stroke-width="2"')
            parts.append(f"<rect {' '.join(attrs)} rx=\"1\" ry=\"1\" />")
    parts.append('</svg>')
    return '\n'.join(parts) + '\n'


def main() -> None:
    skills = parse_catalog(SRC.read_text())
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for skill in skills:
        (OUT_DIR / f"{skill['name']}.svg").write_text(build_svg(skill))


if __name__ == '__main__':
    main()
