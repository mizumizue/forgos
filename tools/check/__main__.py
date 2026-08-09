from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .runner import run_checks


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m tools.check",
        description=(
            "ForgOS minimal mechanical gates. "
            "Fails on invariant breaks; does not approve Promote or maturity."
        ),
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="repository root (default: cwd)",
    )
    parser.add_argument(
        "--promoted",
        action="append",
        default=[],
        metavar="SLUG",
        help=(
            "feature slug claimed promoted; fails if specs/source/<slug>/ remains "
            "(repeatable)"
        ),
    )
    args = parser.parse_args(argv)
    result = run_checks(args.root, promoted_slugs=args.promoted)
    for failure in result.failures:
        print(failure.message, file=sys.stderr)
    if result.ok:
        print("ok: mechanical gates passed")
        return 0
    print(f"fail: {len(result.failures)} finding(s)", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
