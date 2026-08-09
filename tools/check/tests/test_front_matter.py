from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.check import run_checks


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


class FrontMatterTests(unittest.TestCase):
    def test_fails_when_maturity_invalid(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _write(
                root / "specs" / "L2" / "decisions" / "bad.md",
                "---\nlayer: L2\nkind: decisions\nmaturity: wip\n---\n\n# Bad\n",
            )
            result = run_checks(root)
            self.assertFalse(result.ok)
            self.assertTrue(any(f.code == "DECISION_FRONT_MATTER" for f in result.failures))

    def test_fails_when_maturity_missing(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _write(
                root / "specs" / "L3" / "tasks" / "decisions" / "no-maturity.md",
                "---\nlayer: L3\nkind: decisions\n---\n\n# No maturity\n",
            )
            result = run_checks(root)
            self.assertFalse(result.ok)
            self.assertTrue(any(f.code == "DECISION_FRONT_MATTER" for f in result.failures))


if __name__ == "__main__":
    unittest.main()
