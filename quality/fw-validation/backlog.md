# FW 検証バックログ

ForgOS 実証ループから拾った、フレームワーク／パイプライン改善候補。アプリ固有の修正は各 run の `run-log.md` 所見を参照。

## 未着手

### BL-20260810-01 — Assure catalog が空のまま Audit 通過できる

- **由来:** `runs/20260810-shop-reservation`（工程6 Audit A1 / Coverage）
- **事象:** Implement で単体テストはあるが、`quality/unit`・`quality/integration` の catalog active が 0 のまま工程6を通過できる。Coverage 欠落は軽微扱いのみ。
- **候補:** 検証ループ上で Assure／catalog 載せをどの工程で必須または推奨にするか（工程5後・工程6・任意のまま）を playbook／ゲート定義で明確化する。

### BL-20260810-02 — Cursor adapter に promote スキルが無い

- **由来:** `runs/20260810-shop-reservation`（工程3 Promote / `gate-log.md`・`promote-check.md`）
- **事象:** `.cursor/skills/` に promote がなく、`agents/pipeline/promote/playbook.md` 直実行で通過した。正本はあるが adapter 誘導が欠ける。
- **候補:** Cursor 向け promote スキル（正本への薄い誘導）を追加するか、スキル無しを正式な導線として文書化する。
