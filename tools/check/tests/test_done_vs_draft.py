from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.check import run_checks


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


class DoneVsDraftTests(unittest.TestCase):
    def test_fails_when_done_pbi_links_draft_decision(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            decision = root / "specs" / "L3" / "tasks" / "decisions" / "task-creation.md"
            _write(
                decision,
                "---\nlayer: L3\nkind: decisions\nmaturity: draft\n---\n\n# Task\n",
            )
            _write(
                root / "pbl" / "items" / "PBI-0001.md",
                "---\nid: PBI-0001\nstatus: done\n---\n\n"
                "## マップ\n\n"
                "- `specs/L3/tasks/decisions/task-creation.md`\n",
            )
            result = run_checks(root)
            self.assertFalse(result.ok)
            self.assertTrue(any(f.code == "DONE_DRAFT_DECISION" for f in result.failures))

    def test_passes_when_done_pbi_links_stable_decision(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _write(
                root / "specs" / "L3" / "tasks" / "decisions" / "task-creation.md",
                "---\nlayer: L3\nkind: decisions\nmaturity: stable\n---\n\n# Task\n",
            )
            _write(
                root / "pbl" / "items" / "PBI-0001.md",
                "---\nid: PBI-0001\nstatus: done\n---\n\n"
                "- `specs/L3/tasks/decisions/task-creation.md`\n",
            )
            result = run_checks(root)
            self.assertTrue(result.ok, result.failures)


if __name__ == "__main__":
    unittest.main()
