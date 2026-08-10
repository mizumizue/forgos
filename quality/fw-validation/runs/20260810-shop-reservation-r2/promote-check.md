# Promote check — 20260810-shop-reservation-r2

## 人間ゲート代行（hands-off）

ForgOS 実証ループ（`forgos-validation-loop-workflow`）の **hands-off** により、本 run では人間承認カードへのユーザー返信を待たず、作業者がゲートを代行する。

- **代行承認:** 案 A（L3 `reservations` 新規・What のみ・成熟度 `draft`）
- **承認範囲:** glossary／actors／decisions／usecases への取り込み。L2 横断は対象外（業務決め事のみ）
- **成熟度:** 初回取り込みのためすべて `draft`（stable／confirmed への上げは行わない）
- **書き込み後:** Source `specs/source/solo-salon-reservation/` を削除済み

## Source 固定

| 項目 | 値 |
|------|-----|
| Source | `specs/source/solo-salon-reservation/spec.md`（取り込み後削除） |
| Feature | 個人美容室予約（solo-salon-reservation） |
| 書き込み先 | L3 `specs/L3/reservations/`（新規。本ブランチに既存 `reservations` なし） |

## Audit（取り込み前）

範囲: 当該 Source ＋ 既存対象 L2/L3 ＋ 関連 sandbox／実装。

### Gap

- [x] 既存 L3 `reservations` なし（main 起点ブランチ）。衝突する既存決め事なし
- [x] `product/`／`sandbox/` に本テーマ実装なし → 実装との Gap なし

### Conform

- [x] 取り込み対象を Source の What（actors／骨格／usability／スコープ外／予約単位）に限定。design call 見た目 How・demo-seeded ピクセル・モジュール配置は上げない

### Baseline（L1 E1–E12）

- [x] 対象コード変更なし → Baseline 指摘なし

### Assure

- 対象なし（製品実装・quality active 保証なし）

### ブロッカー

- 未解決ブロッカー: **ゼロ**（代行により先送り取り込み可）

## Promote ゲート（L1 完了条件 7 項）

| # | 条件 | 状態 |
|---|------|------|
| 1 | 用語 | **OK** — `glossary/terms.md` |
| 2 | アクター | **OK** — `actors/members.md`（来店客／店主、actor-split） |
| 3 | ユースケース | **OK** — 6 UC、actors 明示 |
| 4 | 決め事（What のみ） | **OK** — `reservation-rules.md`／`out-of-scope.md`。How・見た目なし |
| 5 | 成熟度 | **OK** — すべて `draft` |
| 6 | トレーサビリティ | **OK** — Source リンクなし。PBI 未作成（工程4）。sandbox／実装パスなし |
| 7 | 矛盾チェック | **OK** — 既存 L3 衝突なし。`tasks` ドメインと無関係 |

## 分解対応（要約）

| Source 節 | L3 種別 | パス |
|-----------|---------|------|
| sector brief／業態・予約単位 | glossary + decisions | `glossary/terms.md`, `decisions/reservation-rules.md` D1 |
| actors／actor-split | actors | `actors/members.md` |
| ドメイン骨格 | glossary + decisions | terms + reservation-rules |
| usability what | decisions + usecases | D2–D8 および各 UC |
| スコープ外 | decisions | `out-of-scope.md` |
| 公開インターフェース（What） | decisions | D9 |
| design call／genre look | **上げない** | issue／Implement へ（下記 P4） |
| demo-seeded 具体値の見た目 | **上げない** | issue／Implement |

## 書き込んだ L3 パス

- `specs/L3/reservations/glossary/terms.md`
- `specs/L3/reservations/actors/members.md`
- `specs/L3/reservations/decisions/reservation-rules.md`
- `specs/L3/reservations/decisions/out-of-scope.md`
- `specs/L3/reservations/usecases/check-availability.md`
- `specs/L3/reservations/usecases/view-slots.md`
- `specs/L3/reservations/usecases/apply-reservation.md`
- `specs/L3/reservations/usecases/shop-confirm-reservation.md`
- `specs/L3/reservations/usecases/track-reservation-status.md`
- `specs/L3/reservations/usecases/manage-business-hours.md`

L2: なし（技術横断の新規決め事なし）。

## Source 削除

- `specs/source/solo-salon-reservation/` — **削除済み**（親ディレクトリが空なら除去）

## DEMO-UX Promote P0–P4

| ID | 判定 | 根拠 |
|----|------|------|
| P0 | **Yes** | 業態・actors・顧客属性の採用が glossary／actors／決め事／UC に辿れる（1人美容室・所要時間ブロック・来店客／店主） |
| P1 | **Yes** | usability what → D2–D8 および apply／check／shop-confirm／track／manage UC |
| P2 | **Yes** | `actors/members.md` に主表面分担（申込面／本日台帳／店設定）が残る |
| P3 | **Yes** | 採用 usability は決め事・UCへ。見送り（配信・決済・指名等）は `out-of-scope.md` |
| P4 | **Yes** | design call の見た目 How（カード表現・台帳の塊描画・色・店名ヒーロー級配置）は L2/L3 に上げていない。**工程4の issue および工程5 Implement で design call を辿り実行する** |

## ドメイン骨格の辿り

| 概念／WF | 辿れる先 |
|----------|----------|
| 施術メニュー（所要） | glossary + D1/D4 + manage UC |
| 営業／定休／休憩 | glossary + D3 + manage UC |
| 空き枠 | glossary + D2 + check/view UC |
| 予約・顧客 | glossary + apply UC |
| 状態（申請→確定→完了／キャンセル） | glossary + D5 + track／shop-confirm UC |
| 申込〜店主確定 WF | apply + shop-confirm UC |

## Verifier 自己点検

| # | 条件 | 判定 |
|---|------|------|
| 1 | promote-check に自動点検 | **Yes**（本ファイル） |
| 2 | L2/L3 取り込み | **Yes**（L3 `reservations`） |
| 3 | Source 削除 | **Yes** |
| 4 | ドメイン骨格辿れる | **Yes**（上表） |
| 5 | DEMO-UX P0–P4 すべて Yes | **Yes** |

## 工程4 引き継ぎ

- 入力: `specs/L3/reservations/**`（draft）
- map／cut 時に載せるべき辿り: sector（1人美容室・所要時間ブロック）、actor-split、surface≤3、demo-seeded（メニュー所要の初期種）、**design call（見た目 How・本 check P4）**
- 本工程では map／cut／implement しない
