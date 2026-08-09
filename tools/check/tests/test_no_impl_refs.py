from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.check import run_checks


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


class NoImplRefsTests(unittest.TestCase):
    def test_fails_when_l3_decision_references_product_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _write(
                root / "specs" / "L3" / "tasks" / "decisions" / "task.md",
                "---\nlayer: L3\nkind: decisions\nmaturity: draft\n---\n\n"
                "See `product/apps/api/src/tasks.ts`.\n",
            )
            result = run_checks(root)
            self.assertFalse(result.ok)
            codes = [f.code for f in result.failures]
            self.assertIn("L23_IMPL_REF", codes)

    def test_allows_bare_product_directory_token(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _write(
                root / "specs" / "L2" / "decisions" / "readme-like.md",
                "---\nlayer: L2\nkind: decisions\nmaturity: draft\n---\n\n"
                "実装は `product/` に置く。\n",
            )
            result = run_checks(root)
            self.assertTrue(result.ok, result.failures)


if __name__ == "__main__":
    unittest.main()
