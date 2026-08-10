---
id: PBI-0002
title: 小規模店舗の予約管理（デモ版）主要画面 UC
type: feature
status: review
epic:
---

# PBI-0002: 小規模店舗の予約管理（デモ版）主要画面 UC

## 価値

店舗スタッフと顧客が、営業時間／枠の把握から空き確認・申込・店舗確定・ステータス追跡までを画面操作だけで完遂できる（正式プロダクトのデモ版）。

## 受入条件

- [x] （AC-1）営業時間・休業を確認／設定でき、休業日には受付可能な予約枠が出ない
- [x] （AC-2）日付・提供リソース単位で予約枠と定員を画面で把握できる
- [x] （AC-3）日時・人数・提供リソースで空き可否が分かり、空きが無い場合は申込へ進めない
- [x] （AC-4）最小の顧客情報（氏名・連絡先）で申し込め、予約は受付状態で作成される
- [x] （AC-5）店舗スタッフが受付中の申込を確定／却下／保留でき、申込時点では確定扱いにならない
- [x] （AC-6）予約一覧・詳細で日時・人数・顧客・割当リソース・予約ステータスを確認できる
- [x] （AC-7）受付 → 確定 → 来店／完了／キャンセルへ遷移でき、キャンセル後は当該枠の空きが復帰する

## マップ

### 対応表（必須）

規範アンカー: `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。状態: `covered` | `partial` | `gap`。

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| reservation-rules#D1 営業時間・休業が枠の前提 | `product/packages/domain` / `product/apps/web` | `issues/completed/shop-reservation-01-hours-and-slots.md` | covered |
| reservation-rules#D2 予約枠と定員 | `product/packages/domain` / `product/apps/web` | `issues/completed/shop-reservation-01-hours-and-slots.md` / `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| reservation-rules#D3 提供リソースへの割当 | `product/packages/domain` / `product/apps/web` | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| reservation-rules#D4 顧客情報の最小要件 | `product/packages/domain` / `product/apps/web` | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| reservation-rules#D5 予約ステータス | `product/packages/domain` / `product/apps/web` | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| reservation-rules#D6 空き確認から店舗確定まで | `product/packages/domain` / `product/apps/web` | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| reservation-rules#D7 キャンセルと枠の復帰 | `product/packages/domain` / `product/apps/web` | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| reservation-rules#D8 公開インターフェース（受入境界） | `product/packages/domain`（createReservationShop） | `issues/completed/shop-reservation-01-hours-and-slots.md` / `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| reservation-rules#D9 一覧・詳細で追えること | `product/apps/web` | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| out-of-scope（決済・外部同期・複数店舗・待合最適化等） | —（意図的対象外） | — | gap |
| usecases/manage-business-hours | `product/apps/web` 営業時間・休業パネル | `issues/completed/shop-reservation-01-hours-and-slots.md` | covered |
| usecases/view-slots | `product/apps/web` 日次ボード | `issues/completed/shop-reservation-01-hours-and-slots.md` | covered |
| usecases/check-availability | `product/apps/web` 空き確認 | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| usecases/apply-reservation | `product/apps/web` 申込 | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| usecases/shop-confirm-reservation | `product/apps/web` 確定／却下／保留 | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| usecases/track-reservation-status | `product/apps/web` 一覧・詳細・遷移 | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| AC-1 営業時間・休業と休業日の枠なし | domain + web | `issues/completed/shop-reservation-01-hours-and-slots.md` | covered |
| AC-2 枠・定員の把握 | domain + web | `issues/completed/shop-reservation-01-hours-and-slots.md` | covered |
| AC-3 空き確認 | domain + web | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| AC-4 申込・受付 | domain + web | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| AC-5 店舗確定／却下／保留 | domain + web | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| AC-6 一覧・詳細 | domain + web | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |
| AC-7 ステータス遷移と枠復帰 | domain + web | `issues/completed/shop-reservation-02-booking-lifecycle.md` | covered |

### 補助一覧

関連仕様パス（表から辿れる範囲を重複なく）:

- `specs/L3/reservations/decisions/reservation-rules.md`
- `specs/L3/reservations/decisions/out-of-scope.md`
- `specs/L3/reservations/usecases/manage-business-hours.md`
- `specs/L3/reservations/usecases/view-slots.md`
- `specs/L3/reservations/usecases/check-availability.md`
- `specs/L3/reservations/usecases/apply-reservation.md`
- `specs/L3/reservations/usecases/shop-confirm-reservation.md`
- `specs/L3/reservations/usecases/track-reservation-status.md`
- `specs/L3/reservations/glossary/terms.md`
- `specs/L3/reservations/actors/members.md`

関連コード / PR:

- `product/packages/domain`（公開境界・単体）
- `product/apps/web`（画面デモ）

関連 issue:

- `issues/completed/shop-reservation-01-hours-and-slots.md`
- `issues/completed/shop-reservation-02-booking-lifecycle.md`

## メモ

- hub ドメイン: `reservations`。公開境界メモ: 主＝申込〜店舗確定＋ステータス遷移／副＝枠の空き判定。
- 成熟度 draft のため PBI `done` にはしない（Implement 完了・デモ版）。
- genre look（Spike Source 由来）: 日次ボード、リソース軸空き、状態ラベル、枠起点申込、店舗確定操作。
- Epic は単一 PBI のため未作成。
- Audit（20260810）: 重大なし → `review`。指摘は `quality/fw-validation/runs/20260810-shop-reservation/audit-findings.md`。
