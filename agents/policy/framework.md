# ForgOS — 常時ルール（正本）

ツール固有の自動適用は `.cursor/rules/framework.mdc`（Cursor adapter）。手順の正本は `agents/`。

1. 作業開始時はモードを明示する（Spike / Specify / Implement / Audit / Steward）。
2. `specs/L1/` は編集しない。変更は Steward で提案のみ。
3. `product/` は L2/L3 に紐づける（draft 可）。`done` は stable 以上。`sandbox/` は Source の試し場。向きは **仕様 → 実装**。決め事は What のみ（How・手順は書かない。憲法 §2.8）。
4. **L2/L3 からソース（`product/` 実装・`sandbox/` パス）も Source パスも参照しない**（L1 憲法 §2.5）。関連コードは hub（PBI）/ issue 側。
5. 秘密情報をログ・コミット・仕様・出力に出さない。
6. Implement では TDD。単体が緑になるまで完了と言わない。定常の第一ページは **対象決め事＋PBI 対応表**（無ければ決め事＋欠落明示）。`quality/` は第一ページにしない。
7. map → `pbl/`。issue は原則 PBI から cut。公開先正本は `agents/pipeline/map/issue-tracker.md`。spec-source → `specs/source/`（仮仕様。L2/L3 に PRD 丸ごと禁止）。promote で L2/L3 取り込み（Audit 必須）後 **Source を削除**。Cursor では起動名 `/map` `/cut` `/spec-source` `/promote`。
8. ユーザー向け説明では **「継ぎ目」「シーム」を使わない**。公開インターフェース／アプリケーション境界／テスト境界／API など、平易またはシステム開発で一般的な語を使う。
9. **文書の置き場:** `docs/` にガイド・エージェント向け説明を新規追加しない。置くなら原則その領域の README（例: `pbl/README.md`、`quality/README.md`）。**エージェント向け手順の正本は `agents/`**。ツール固有の起動・常時ガードは adapter（`.cursor/skills/`・`.cursor/rules/`、`CLAUDE.md` 等）。
10. **経緯記録（`adr/`）は必須ではない。** 判断の重要度に応じて作成を推奨し、取り込むかはユーザー確認後。承認なしに新規作成しない。
11. **機械ゲート**は不変条件のみ（`python -m tools.check`、正本 `tools/check/`）。Promote・成熟度昇降・最終 `done` の Approve は自動化しない。
