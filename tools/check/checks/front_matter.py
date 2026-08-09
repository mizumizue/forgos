from __future__ import annotations

from pathlib import Path

from ..models import Failure
from ..parse import MATURITIES, decision_markdown_paths, parse_front_matter


def check_front_matter(root: Path) -> list[Failure]:
    failures: list[Failure] = []
    for path in decision_markdown_paths(root):
        rel = path.relative_to(root).as_posix()
        text = path.read_text(encoding="utf-8")
        fm = parse_front_matter(text)
        if fm is None:
            failures.append(
                Failure(
                    code="DECISION_FRONT_MATTER",
                    path=rel,
                    message=f"{rel}: decision markdown requires YAML front matter",
                )
            )
            continue
        maturity = fm.get("maturity")
        if maturity is None:
            failures.append(
                Failure(
                    code="DECISION_FRONT_MATTER",
                    path=rel,
                    message=(
                        f"{rel}: front matter must include maturity "
                        f"in {{{', '.join(sorted(MATURITIES))}}}"
                    ),
                )
            )
        elif maturity not in MATURITIES:
            allowed = ", ".join(sorted(MATURITIES))
            failures.append(
                Failure(
                    code="DECISION_FRONT_MATTER",
                    path=rel,
                    message=(
                        f"{rel}: maturity must be one of {{{allowed}}} "
                        f"(got {maturity!r})"
                    ),
                )
            )
    return failures
