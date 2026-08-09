from __future__ import annotations

from collections.abc import Sequence
from pathlib import Path

from .checks.done_vs_draft import check_done_vs_draft
from .checks.front_matter import check_front_matter
from .checks.no_impl_refs import check_no_impl_refs
from .checks.promote_aftermath import check_promote_aftermath
from .models import CheckResult, Failure


def run_checks(
    root: Path,
    *,
    promoted_slugs: Sequence[str] = (),
) -> CheckResult:
    root = root.resolve()
    failures: list[Failure] = []
    failures.extend(check_no_impl_refs(root))
    failures.extend(check_front_matter(root))
    failures.extend(check_done_vs_draft(root))
    failures.extend(check_promote_aftermath(root, promoted_slugs))
    return CheckResult(failures=tuple(failures))
