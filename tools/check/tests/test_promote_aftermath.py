from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.check import run_checks


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


class PromoteAftermathTests(unittest.TestCase):
    def test_fails_when_claimed_promoted_slug_still_has_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _write(
                root / "specs" / "source" / "create-task" / "spec.md",
                "# leftover\n",
            )
            result = run_checks(root, promoted_slugs=["create-task"])
            self.assertFalse(result.ok)
            self.assertTrue(
                any(f.code == "PROMOTE_SOURCE_LEFTOVER" for f in result.failures)
            )

    def test_passes_when_promoted_slug_source_removed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "specs" / "source").mkdir(parents=True)
            result = run_checks(root, promoted_slugs=["create-task"])
            self.assertTrue(result.ok, result.failures)


if __name__ == "__main__":
    unittest.main()
