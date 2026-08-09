from __future__ import annotations

from collections.abc import Sequence
from pathlib import Path

from ..models import Failure


def check_promote_aftermath(
    root: Path,
    promoted_slugs: Sequence[str],
) -> list[Failure]:
    failures: list[Failure] = []
    for slug in promoted_slugs:
        if not slug or "/" in slug or "\\" in slug or slug in {".", ".."}:
            failures.append(
                Failure(
                    code="PROMOTE_SOURCE_LEFTOVER",
                    message=f"invalid promoted slug: {slug!r}",
                )
            )
            continue
        source_dir = root / "specs" / "source" / slug
        if source_dir.exists():
            rel = source_dir.relative_to(root).as_posix()
            failures.append(
                Failure(
                    code="PROMOTE_SOURCE_LEFTOVER",
                    path=rel,
                    message=(
                        f"claimed promoted {slug!r} but `{rel}/` still exists "
                        "(delete Source immediately after Promote)"
                    ),
                )
            )
    return failures
