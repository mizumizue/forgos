# 01 — 店設定・メニュー所要・空き枠提示

**Feature:** solo-salon-reservation

**PBI:** `pbl/items/PBI-0002-solo-salon-reservation.md`（PBI-0002）

**作るもの:** 店主が店設定面で営業時間・定休・休憩と施術メニュー（所要時間）を整え、来店客が予約申込面でメニューを選ぶとその所要に合う空き枠だけを確認できる。デモ開始時からメニュー所要の初期種と営業前提が選べる。

**Blocked by:** なし

**Status:** completed

**Triage:** done

## 受け入れ基準

- [x] 店主が営業時間・定休・休憩ブロックを設定でき、ブロック区間は空き枠に出ない（D3 / manage-business-hours）
- [x] 店主が施術メニューと所要時間を設定でき、以降の空き枠長に反映される（D4）
- [x] 来店客がメニューを選ぶと、その所要に収まる連続空きのみが提示される（D1, D2 / check-availability / view-slots）
- [x] 営業時間外・定休・休憩・既存の申請／確定予約と重なる区間は提示されない
- [x] demo-seeded の初期メニュー・営業前提が最初から選択／前提として効いている（下記）

## 規範アンカー

- `specs/L3/reservations/decisions/reservation-rules.md` — D1, D2, D3, D4, D9（主: 枠生成）
- `specs/L3/reservations/usecases/manage-business-hours.md`
- `specs/L3/reservations/usecases/check-availability.md`
- `specs/L3/reservations/usecases/view-slots.md`
- `specs/L3/reservations/actors/members.md`
- `specs/L3/reservations/glossary/terms.md`

## 辿り（scope / promote-check）— Implement 必読

正本パス:

- `quality/fw-validation/runs/20260810-shop-reservation-r2/scope.md`
- `quality/fw-validation/runs/20260810-shop-reservation-r2/promote-check.md`（DEMO-UX P4: 見た目 How は L3 非上げ）

### sector

- 業種: 美容業（ヘアサロン）。業態: **1人運営の個人美容室**（チェア1・スタイリスト＝店主のみ）
- 予約単位: 席在庫ではなく **施術メニューの所要時間ブロック**（店主カレンダー上の連続時間）
- 顧客: 新規（枠長が分かる申込）／常連（メニュー差の枠長既知・再予約の速さ）
- オペ急所: 施術中は電話不可 → 画面申込＋台帳確定。キャンセル遅延で枠が埋まらない。受けたくない時間のブロック

### actor-split

| 役 | 本票の主表面 | やること | やらないこと |
|----|--------------|----------|--------------|
| 来店客 | 予約申込面（枠確認まで） | メニュー→空き枠の確認 | 台帳操作・店設定・確定 |
| 店主 | 店設定面 | 営業時間・休業／休憩、メニュー所要 | 来店客申込フローへの埋め込み |

### surface budget

主要ハッピーパス表面は **3**（≤3）。本票はうち **予約申込面（枠提示）** と **店設定面**。追加の管理ダッシュボード／顧客マスタ一覧は必須としない。

### demo-seeded

- 施術メニュー初期種: カット（60分）／カット＋カラー（120分）／カット＋パーマ（150分）※典型仮説値。ラベルに **メニュー名＋所要分**
- 営業初期値: 火〜土 10:00–19:00、定休・例として週1休、昼休憩 13:00–14:00 をブロック
- 汎用の「太郎」「席A」だけにしない

### design call（見た目 How・決め事化しない）

個人美容室の「受付台帳＋メニューカード」を主従にする。

- 来店客（申込面）: 施術メニューがカード／リストとして先に見え、選ぶと所要分が明示され、その長さの空き枠が時間帯として続く
- 店設定面: 今日以降に効く営業時間／休憩ブロック → メニュー所要の順（帳票・テーマ設定を先頭に置かない）
- 色: サロンの清潔感（明るい壁面＋落ち着いたインク色＋控えめなアクセント）。紫グラデ／クリーム地＋テラコッタ定番／新聞調には寄せない
- ブランド: 架空の個人店名をヒーロー級に出し、ツール名だけの業務画面にしない

### attention stack（本票表面）

- 予約申込面: ①メニュー（所要つき）→ ②空き枠の時間帯（③申込は 02）
- 店設定面: ①営業時間／休憩 → ②メニュー所要

## Comments

- 2026-08-10: 工程4 map／cut（hands-off）。分解承認は実証ループ代行。
- 2026-08-10: 工程5 Implement。`product/packages/domain`＋`product/apps/web`（店設定／申込枠）。単体緑。
