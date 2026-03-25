#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    ROOT / 'play' / 'index.html',
    ROOT / 'fight' / 'index.html',
    ROOT / 'city-duel' / 'index.html',
    ROOT / 'game-test' / 'index.html',
]
REQUIRED = [
    '../assets/styles.css',
    'type="module"',
]


def validate_page(path: Path) -> list[str]:
    source = path.read_text() if path.exists() else ''
    return [token for token in REQUIRED if token not in source]


def main() -> None:
    parser = argparse.ArgumentParser(description='Validate the rebuilt runtime pages.')
    parser.add_argument('--strict', action='store_true', help='Exit with status 1 if a marker is missing.')
    args = parser.parse_args()
    failed = False
    for path in PAGES:
        missing = validate_page(path)
        if missing:
            failed = True
            print(f'{path}: missing {", ".join(missing)}')
        else:
            print(f'{path}: ok')
    if args.strict and failed:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
