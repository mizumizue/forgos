# ゲートログ

（工程1: 枠のみ。以降の工程で追記する。）

## 工程3 Promote

- 正本: agents/pipeline/promote/playbook.md（.cursor/skills/ に promote スキルなし。playbook 実行可のため loop-eng フォールバック不要）
- 結果: L3 reservations へ What 取り込み完了。Source specs/source/shop-reservation/ 削除済み。
- 点検: quality/fw-validation/runs/20260810-shop-reservation/promote-check.md（人間ゲート代行: 点検ログで可）

## 工程4 map / cut

- 正本: .cursor/skills/pipeline/map|cut → agents/pipeline/map/playbook.md / cut/playbook.md（スキルは正本へ誘導。playbook 実行可のため loop-eng フォールバック不要）
- map: 枝 map。PBI-0002 新規（単一価値のため Epic なし）。対応表に D1–D9・対象外・UC6・AC1–7。状態は未実装のため gap（対象外は意図的 gap）
- cut: PBI-0002 から 2 票（01 営業時間・枠／02 空き〜確定・状態）。分解は検証ループ作業指示で承認扱い
- 成果: pbl/items/PBI-0002-shop-reservation.md / issues/backlog/shop-reservation-01-hours-and-slots.md / issues/completed へ移動済み（Implement 後）

## 工程5 Implement

- 正本: `.cursor/skills/modes/implement/SKILL.md` → `agents/modes/implement.md` / TDD `agents/engineering/tdd/playbook.md`（実行可。loop-eng RGR フォールバック不要）
- 結果: `product/` に domain（Vitest 単体）＋ web（Vite/React 画面）。issue 01/02 → completed。PBI 対応表 covered。
- 単体: `cd product && pnpm test` → 7 passed
- genre look: Spike Source 残骸（agent transcript）から回収。UI に日次ボード／リソース軸／状態ラベル／枠起点申込／店舗確定を掲載。

## 工程6 Audit

- 正本: `.cursor/skills/modes/audit/SKILL.md` → `agents/modes/audit.md`（実行可。loop-eng EO フォールバック不要）
- 結果: 重大 0 / 軽微あり（UI disable・人数0・Assure catalog 空など）。オーバーレイ重大候補（操作面・genre look・WF/状態）は非該当。
- 指摘: `quality/fw-validation/runs/20260810-shop-reservation/audit-findings.md`
- Verifier: **(A)** 重大なし（Implement 巻き戻し不要）
