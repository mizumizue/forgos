# Promote 点検 — 20260810-shop-reservation

**人間ゲート代行: 点検ログで可**

通常 Promote の人間 Approve を、本ループでは本点検ログで代行する。

## 固定

- Source（取り込み前）: `specs/source/shop-reservation/spec.md`
- Feature: 小規模店舗の予約管理（正式プロダクトのデモ版）
- 書き込み先: `specs/L3/reservations/`（アプリ関心ドメイン）
- 提案成熟度: `draft`（初回取り込み）
- スコープ整合: `quality/fw-validation/runs/20260810-shop-reservation/scope.md`
- 手順正本: `agents/pipeline/promote/playbook.md`（`.cursor/skills/` に promote スキルなし。playbook で実行可能のためフォールバック不要）

## Audit（取り込み前要約）

範囲: 当該 Source ＋ 既存 L2/L3（`tasks` 例示ドメインは無関係）＋ product 実装なし。

### Gap
- [x] 製品実装（`product/`）は未着手 — 取り込みブロッカーではない（Source → L3 の What 結晶化のみ）。次: Implement 前に map/cut。
- [x] 既存 `specs/L3/reservations/` は無し — 新規ドメインとしてテンプレから作成。

### Conform
- [x] 該当なし（実装無し）。オーバーレイ（table stakes / demo-grade / genre look）は丸ごと決め事化しない方針を維持。

### Baseline（L1 E1–E12）
- [x] 実装変更なしのため対象外（該当なし）。

### Assure
- 対象なし（製品 L2/L3 は本取り込みで新規。`quality` active 保証なし）

### 次アクション
- 取り込み可（ブロッカーゼロ）。成熟度は draft。

## Promote ゲート（`specs/L1/promote-gate.md` 完了条件 7 項）

| # | 項目 | 合否 | 根拠パス |
|---|------|------|----------|
| 1 | 用語 | OK | `specs/L3/reservations/glossary/terms.md`（骨格7概念を定義） |
| 2 | アクター | OK | `specs/L3/reservations/actors/members.md`（店舗スタッフ／顧客） |
| 3 | ユースケース | OK | `specs/L3/reservations/usecases/*.md`（主要画面 UC 6本、actors 明示） |
| 4 | 決め事（What のみ） | OK | `specs/L3/reservations/decisions/reservation-rules.md` / `out-of-scope.md`（How・内部構造・手順なし） |
| 5 | 成熟度 | OK | 全ファイル `maturity: draft` |
| 6 | トレーサビリティ | OK | Source リンクなし。sandbox／実装パスなし。PBI 未作成（後工程 map） |
| 7 | 矛盾チェック | OK | 既存 L3 `tasks` と関心分離。横断 L2 との衝突なし。対象外は `out-of-scope.md` |

## ドメイン骨格トレーサビリティ

| # | 概念 | 辿り先 |
|---|------|--------|
| 1 | 予約 | 用語 `terms.md`／決め事 D3・D4・D9 |
| 2 | 予約枠（スロット） | 用語／決め事 D1・D2／UC `view-slots.md` |
| 3 | 提供リソース | 用語／決め事 D3 |
| 4 | 顧客 | 用語／アクター／決め事 D4 |
| 5 | 予約ステータス（WF） | 用語／決め事 D5／UC `track-reservation-status.md` |
| 6 | 空き確認〜予約確定（WF） | 用語／決め事 D6／UC `check-availability.md`・`apply-reservation.md`・`shop-confirm-reservation.md` |
| 7 | 営業時間・休業 | 用語／決め事 D1／UC `manage-business-hours.md` |

スコープ外（決済・外部同期・複数店舗・待合最適化等）→ `decisions/out-of-scope.md`（対象外）。

## オーバーレイ扱い

- `table stakes` / `demo-grade` / `genre look` は検証オーバーレイのため **丸ごと決め事化していない**。
- 必要な What（骨格規則・主要 UC・対象外境界）のみ結晶化した。

## 取り込み可否判定

**可** — ゲート 7 項すべて OK。人間ゲート代行: 点検ログで可。

## Source 削除

取り込み完了直後に `specs/source/shop-reservation/` を削除する（本ファイル作成と同時に実施）。
