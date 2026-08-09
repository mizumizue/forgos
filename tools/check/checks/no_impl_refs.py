from __future__ import annotations

import re
from pathlib import Path

from ..models import Failure

# File-ish paths under product/ or sandbox/ (not bare directory tokens like `product/`).
_IMPL_PATH = re.compile(
    r"(?P<prefix>(?:^|[^A-Za-z0-9_-]))"
    r"(?P<path>(?:product|sandbox)/[A-Za-z0-9._-][A-Za-z0-9._/-]*)"
)


def check_no_impl_refs(root: Path) -> list[Failure]:
    failures: list[Failure] = []
    for layer in ("L2", "L3"):
        base = root / "specs" / layer
        if not base.is_dir():
            continue
        for path in sorted(base.rglob("*.md")):
            text = path.read_text(encoding="utf-8")
            rel = path.relative_to(root).as_posix()
            for match in _IMPL_PATH.finditer(text):
                impl = match.group("path").rstrip("/")
                # Bare `product/` / `sandbox/` already excluded by requiring a following segment.
                failures.append(
                    Failure(
                        code="L23_IMPL_REF",
                        path=rel,
                        message=(
                            f"{rel}: L2/L3 must not reference implementation paths "
                            f"(L1 §2.5); found `{impl}`"
                        ),
                    )
                )
    return failures
