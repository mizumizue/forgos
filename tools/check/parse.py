from __future__ import annotations

import re
from pathlib import Path

_FRONT_MATTER = re.compile(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", re.DOTALL)

MATURITIES = frozenset({"draft", "stable", "confirmed"})


def parse_front_matter(text: str) -> dict[str, str] | None:
    match = _FRONT_MATTER.match(text)
    if not match:
        return None
    data: dict[str, str] = {}
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        data[key.strip()] = value.strip().strip("\"'")
    return data


def decision_markdown_paths(root: Path) -> list[Path]:
    paths: list[Path] = []
    for layer in ("L2", "L3"):
        base = root / "specs" / layer
        if not base.is_dir():
            continue
        for path in sorted(base.rglob("*.md")):
            if "decisions" not in path.parts:
                continue
            paths.append(path)
    return paths
