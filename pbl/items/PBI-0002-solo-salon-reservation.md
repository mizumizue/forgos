---
id: PBI-0002
title: 個人美容室でメニュー所要の空き枠申込と店主台帳確定ができる
type: feature
status: review
epic:
---

# PBI-0002: 個人美容室でメニュー所要の空き枠申込と店主台帳確定ができる

## 価値

1人運営の個人美容室において、来店客が施術メニューの所要時間に合う空き枠へ申し込み、店主が本日台帳で確定・状態確認し、営業時間／メニュー所要を整えられるデモ版の主要パスを通す。

## 受入条件

- [x] （AC-1）来店客が施術メニューを選ぶと、その所要に合う空き枠だけが提示される
- [x] （AC-2）来店客が空き枠へ申し込むと予約が申請状態になり、キャンセルポリシー文面を確認できる
- [x] （AC-3）店主が本日台帳で当日予約を時間順に把握し、申請中を確定できる
- [x] （AC-4）来店客と店主が同一予約の状態（申請／確定／完了／キャンセル）を追える。キャンセル後は当該時間塊が再申込可能になる
- [x] （AC-5）店主が営業時間・定休・休憩とメニュー所要を設定でき、以降の空き枠に反映される
- [x] （AC-6）デモ開始時にメニュー所要の初期種と状態差の見える予約シードがあり、主要3表面（申込／台帳／店設定）で完遂できる

## マップ

### 対応表（必須）

規範アンカー: `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。状態: `covered` | `partial` | `gap`。

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| reservation-rules#D1 予約単位＝メニュー所要の連続時間 | `product/packages/domain/src/soloSalon.ts`（listAvailableSlots） | `issues/completed/solo-salon-reservation-01-hours-menus-and-slots.md` | covered |
| reservation-rules#D2 メニュー所要に合う空き枠のみ提示 | 同上＋単体 | 01 | covered |
| reservation-rules#D3 営業・定休・休憩が枠前提 | listAvailableSlots / updateBusinessHours | 01 | covered |
| reservation-rules#D4 施術メニュー所要の設定 | updateMenus＋店設定面 | 01 | covered |
| reservation-rules#D5 予約状態（申請→確定→完了／キャンセル） | apply/confirm/complete/cancel | 02 | covered |
| reservation-rules#D6 本日台帳で時間順把握・申請確定 | listTodayLedger＋LedgerSurface | 02 | covered |
| reservation-rules#D7 キャンセル後の枠戻り | cancelReservation＋単体 | 02 | covered |
| reservation-rules#D8 キャンセルポリシー提示 | BookingSurface policy | 02 | covered |
| reservation-rules#D9 公開IF（枠生成・状態遷移） | domain 公開 export＋単体緑 | 01・02 | covered |
| usecases/manage-business-hours | SettingsSurface | 01 | covered |
| usecases/check-availability | listAvailableSlots | 01 | covered |
| usecases/view-slots | BookingSurface slots | 01 | covered |
| usecases/apply-reservation | applyReservation＋BookingSurface | 02 | covered |
| usecases/shop-confirm-reservation | confirmReservation＋LedgerSurface | 02 | covered |
| usecases/track-reservation-status | 申込面 track＋台帳状態 | 02 | covered |
| AC-1 メニュー所要に合う枠のみ | 単体＋申込面 | 01 | covered |
| AC-2 申込→申請＋ポリシー確認 | 申込面 | 02 | covered |
| AC-3 本日台帳で確定 | 台帳面 | 02 | covered |
| AC-4 状態追跡・キャンセル戻し | 単体＋画面 | 02 | covered |
| AC-5 店設定が枠に反映 | 店設定面＋単体 | 01 | covered |
| AC-6 demo-seeded＋3表面完遂 | createDemoSalonState＋3 surface | 01・02 | covered |

### 補助一覧

関連仕様パス（表から辿れる範囲を重複なく）:

- `specs/L3/reservations/decisions/reservation-rules.md`
- `specs/L3/reservations/decisions/out-of-scope.md`
- `specs/L3/reservations/glossary/terms.md`
- `specs/L3/reservations/actors/members.md`
- `specs/L3/reservations/usecases/manage-business-hours.md`
- `specs/L3/reservations/usecases/check-availability.md`
- `specs/L3/reservations/usecases/view-slots.md`
- `specs/L3/reservations/usecases/apply-reservation.md`
- `specs/L3/reservations/usecases/shop-confirm-reservation.md`
- `specs/L3/reservations/usecases/track-reservation-status.md`

関連コード / PR:

- `product/packages/domain/`（公開 IF・単体）
- `product/apps/web/`（申込／本日台帳／店設定）

関連 issue:

- `issues/completed/solo-salon-reservation-01-hours-menus-and-slots.md`
- `issues/completed/solo-salon-reservation-02-booking-and-ledger.md`

検証メタ（hub 外・辿り用）:

- `quality/fw-validation/runs/20260810-shop-reservation-r2/scope.md`（sector／actor-split／surface／demo-seeded／design call）
- `quality/fw-validation/runs/20260810-shop-reservation-r2/promote-check.md`（P4: design call は L3 非上げ・issue／Implement へ）

## メモ

- feature-slug: `solo-salon-reservation`
- L3 成熟度は `draft`（`done` 宣言はしない）。Epic は単一価値のため未作成。
- オーバーレイ（design call 見た目 How・demo-seeded 具体値）は決め事化せず issue／Implement に残す（promote-check P4）。
- hands-off: cut／Implement の人間承認は実証ループ代行。
- Audit（2026-08-10）: 重大 G1（定休設定 UI）を Implement 戻しで修復。ADR `adr/0005-audit-closed-weekday-settings-repair.md`。指摘正本 `quality/fw-validation/runs/20260810-shop-reservation-r2/audit-findings.md`。Verifier (B)。status → review。
