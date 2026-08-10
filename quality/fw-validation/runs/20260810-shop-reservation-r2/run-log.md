# 実証ログ — 20260810-shop-reservation-r2

**工程:** 7完了（工程8は未実施・引き継ぎのみ）  
**実行手段:** `loop-eng` 型 `EO`  
**作業ブランチ:** `validation/20260810-shop-reservation-r2`

## テーマ

小規模店舗の予約管理を正式プロダクトのデモ版として検証する。業態は **1人運営の個人美容室**（施術メニュー所要時間ブロックが予約単位）。

## 通った工程（1–6）とゲート結果要約

| 工程 | 結果 | 要約 |
|------|------|------|
| 1 スコープ固定 | 通過 | `scope.md`。sector brief〜design call（S0–S7）・actor-split・surface≤3・demo-seeded。スコープ外明示 |
| 2 Spike / Source | 通過（成果は後工程参照） | Source `solo-salon-reservation` を作成し Promote で取り込み後削除（`promote-check.md`） |
| 3 Promote | 通過 | L3 `specs/L3/reservations/` へ What 取り込み（draft）。ゲート7項 OK。人間ゲートは点検ログ代行。DEMO-UX P0–P4 Yes |
| 4 map / cut | 通過 | PBI-0002（solo-salon）。issue 01（営業・メニュー・枠）／02（申込・台帳）→ Implement 後 `issues/completed/` |
| 5 Implement | 通過 | `product/packages/domain`＋`product/apps/web`。単体 10→修復後 11 passed。DEMO-UX I1–I5 Yes。汎用店舗残留なし |
| 6 Audit | 通過 **(B)** | 重大1（G1 定休設定 UI）→ Implement 戻し修復＋`adr/0005-...`。軽微4（G2/G3/B1/B2）。詳細は `audit-findings.md` |

参照: `gate-log.md` / `promote-check.md` / `audit-findings.md` / `scope.md`

## 詰まり

- **詰まり（重大・工程内）:** Audit G1 — 決め事 D3／manage-business-hours／AC-5 の「定休設定」がドメインにはあるが店設定面から呼べず、仕様乖離の重大 Gap。Stop 内の戻しラウンド1で修復し Verifier (B)。
- **詰まり（工程停止級）:** なし。工程1–6はいずれも通過（6 は戻し修復後）。

## 所見

- 正規パイプライン（Source → L3 → pbl/issues → product → Audit）を個人美容室デモで一通り通せた。画面3表面（申込／本日台帳／店設定）で主要 UC を完遂。
- **前回 r1（`20260810-shop-reservation`）との差:** 業態を個人美容室に固定し、scope の sector brief／actor-split／design call を強化。slug は `solo-salon-reservation`。r1 は Audit (A)・重大0、本 r2 は (B)・重大1修復。
- **所見（アプリ軽微・backlog 非掲載）:** G2（来店客の状態追跡は自申込セッションのみ）、G3（メニューは所要分のみ編集）、B1（認証なしタブ到達）、B2（`App.tsx` 同居）。デモ主要パスで受入可として無視可。
- **所見（Assure）:** Audit は `/assure` 未実行（誘導のみ）。draft デモの catalog Coverage は既存 backlog（BL-20260810-02）の範疇。
- **所見（FW）:** 「通常利用＝画面」なのに設定項目の一部が UI 未到達のまま Implement 通過し、Audit で戻った。検証ループの Implement 側チェック強化候補 → backlog 追記。

## 改善事項の扱い

方針: **FW／パイプライン改善のみ backlog 追記。アプリ固有の軽微は run-log 所見に留める。**

- backlog 追記: **1件** → `quality/fw-validation/backlog.md`  
  - BL-20260810-03 — 画面必須デモで「決め事の設定項目が画面から到達可能か」を Implement で漏らさない
- アプリ軽微（G2/G3/B1/B2）: **改善なし（backlog 非掲載）** — 所見のみ

## 主要成果パス（アプリ経路・run ブランチ上）

| 領域 | パス |
|------|------|
| 仕様 L3 | `specs/L3/reservations/` |
| hub | `pbl/items/PBI-0002-solo-salon-reservation.md`（status: review） |
| issues | `issues/completed/solo-salon-reservation-01-hours-menus-and-slots.md`、`...-02-booking-and-ledger.md` |
| 実装 | `product/packages/domain/`、`product/apps/web/` |
| ADR | `adr/0005-audit-closed-weekday-settings-repair.md` |
| 検証メタ | `quality/fw-validation/runs/20260810-shop-reservation-r2/` |

## 工程8 引き継ぎ（未実施・本工程では触らない）

- 作業ブランチ: `validation/20260810-shop-reservation-r2`
- 想定手順（ログのみ main・validation push）:
  1. 作業ブランチを remote へ push（force 禁止）
  2. `main` へは **`quality/fw-validation/` のみ** 反映（アプリ経路 `specs/` / `pbl/` / `issues/` / `product/` / `adr/` は混ぜない）
  3. `git push origin main`（force 禁止）
- worktree で `main` 占有時は BL-20260810-01 どおり tip 同期／別 worktree を使う

## Verifier 自己点検（工程7）

1. `run-log.md` にテーマ・通った工程・詰まり・所見がある: **Yes**
2. 改善事項があれば `backlog.md` 追記、無ければ「改善なし」明記: **Yes**（改善あり → backlog 1件追記。アプリ軽微は「改善なし（backlog 非掲載）」）
