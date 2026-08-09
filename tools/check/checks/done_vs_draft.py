from __future__ import annotations

import re
from pathlib import Path

from ..models import Failure
from ..parse import parse_front_matter

_SPEC_DECISION = re.compile(
    r"(?:`|\()?(?P<path>specs/L[23]/[^`)\s]+/decisions/[^`)\s]+\.md)"
)


def check_done_vs_draft(root: Path) -> list[Failure]:
    failures: list[Failure] = []
    items = root / "pbl" / "items"
    if not items.is_dir():
        return failures

    for pbi_path in sorted(items.glob("*.md")):
        text = pbi_path.read_text(encoding="utf-8")
        fm = parse_front_matter(text) or {}
        if fm.get("status") != "done":
            continue
        pbi_rel = pbi_path.relative_to(root).as_posix()
        linked = {m.group("path") for m in _SPEC_DECISION.finditer(text)}
        for spec_rel in sorted(linked):
            decision_path = root / Path(*spec_rel.split("/"))
            if not decision_path.is_file():
                failures.append(
                    Failure(
                        code="DONE_DRAFT_DECISION",
                        path=pbi_rel,
                        message=(
                            f"{pbi_rel}: status is done but linked decision "
                            f"`{spec_rel}` is missing"
                        ),
                    )
                )
                continue
            decision_fm = parse_front_matter(decision_path.read_text(encoding="utf-8")) or {}
            maturity = decision_fm.get("maturity")
            if maturity == "draft":
                failures.append(
                    Failure(
                        code="DONE_DRAFT_DECISION",
                        path=pbi_rel,
                        message=(
                            f"{pbi_rel}: status is done but linked decision "
                            f"`{spec_rel}` has maturity draft (L1 §4 requires stable+)"
                        ),
                    )
                )
    return failures
