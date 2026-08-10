# 02 — 予約申込・本日台帳確定・状態追跡

**Feature:** solo-salon-reservation

**PBI:** `pbl/items/PBI-0002-solo-salon-reservation.md`（PBI-0002）

**作るもの:** 来店客が予約申込面で空き枠へ申し込み（申請）、店主が本日台帳面で時間順に把握して確定し、双方が同一予約の状態（申請／確定／完了／キャンセル）を追える。キャンセル後は当該時間塊が再び空き枠になる。デモ用に状態差の見える予約シードがある。

**Blocked by:** `issues/completed/solo-salon-reservation-01-hours-menus-and-slots.md`（枠生成・メニュー／営業前提）

**Status:** completed

**Triage:** done

## 受け入れ基準

- [x] 来店客がメニュー・空き枠・顧客最小情報で申し込み、予約が申請状態になる（D5 / apply-reservation）
- [x] 申込面でキャンセルポリシー文面を確認できる（D8）。配信・課金は作らない
- [x] 店主が本日台帳で当日予約を時間順に把握し、申請中を確定できる（D6 / shop-confirm-reservation）
- [x] 来店客と店主が同一予約の状態（申請／確定／完了／キャンセル）を追える（D5 / track-reservation-status）
- [x] キャンセル後、当該時間塊が再び空き枠として申込可能になる（D7）
- [x] demo-seeded の既存予約（確定済み／申請中など状態差）が台帳・追跡で見える（下記）

## 規範アンカー

- `specs/L3/reservations/decisions/reservation-rules.md` — D5, D6, D7, D8, D9（副: 状態遷移）
- `specs/L3/reservations/usecases/apply-reservation.md`
- `specs/L3/reservations/usecases/shop-confirm-reservation.md`
- `specs/L3/reservations/usecases/track-reservation-status.md`
- `specs/L3/reservations/actors/members.md`
- `specs/L3/reservations/decisions/out-of-scope.md`（配信・決済等は対象外）

## 辿り（scope / promote-check）— Implement 必読

正本パス:

- `quality/fw-validation/runs/20260810-shop-reservation-r2/scope.md`
- `quality/fw-validation/runs/20260810-shop-reservation-r2/promote-check.md`（DEMO-UX P4）

### sector

- 業態: **1人運営の個人美容室**。予約単位はメニュー所要の時間塊
- 主ジョブ: 来店客＝画面申込／店主＝台帳での確定・見通し（電話受付 UI は作らない）
- キャンセルで枠が戻ることが現場の急所

### actor-split

| 役 | 本票の主表面 | やること | やらないこと |
|----|--------------|----------|--------------|
| 来店客 | 予約申込面（申込〜状態起点） | 枠選択→申込、自予約の状態確認 | 他客台帳・営業編集・確定権限 |
| 店主 | 本日台帳面 | 申込の確定、状態確認、当日並び把握 | 来店客申込フローへの埋め込み |

店設定面の編集は 01。本票は設定結果を前提に申込・台帳・状態を動かす。

### surface budget

主要表面 **3** のうち本票は **予約申込面（申込完遂）** と **本日台帳面**。表面を増やさない。

### demo-seeded

- 既存予約シード: 当日または直近に「確定済みカット」「申請中カラー」など **状態差が見える** 予約を事前投入
- メニューラベルは 01 の種（カット60／カット＋カラー120／カット＋パーマ150）を継続。席A／太郎だけにしない

### design call（見た目 How・決め事化しない）

- 店主面は汎用行テーブル管理画面ではなく、**当日の時間ブロック台帳**（長い施術は長い塊）。次の来店が視線の先頭
- 本日台帳の attention: ①今日の時間順予約（次の来店）→ ②申請中の確定操作 → ③状態。設定や分析を先頭に置かない
- 申込面の attention: ①メニュー → ②空き枠 → ③申込確定。顧客マスタ項目を先頭に置かない
- 色・店名ヒーロー級は 01 と同じ方針（清潔感。紫グラデ／クリーム＋テラコッタ／新聞調回避）

## Comments

- 2026-08-10: 工程4 map／cut（hands-off）。分解承認は実証ループ代行。
- 2026-08-10: 工程5 Implement。申込・本日台帳・状態遷移。単体緑。
