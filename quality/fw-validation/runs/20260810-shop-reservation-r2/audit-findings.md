# Audit 指摘リスト — 20260810-shop-reservation-r2

**モード:** Audit（初回指摘 → 重大ありのため Implement 戻し 1 ラウンド）  
**範囲:** PBI-0002・`specs/L3/reservations/**`・`product/packages/domain`・`product/apps/web`・completed issues 01/02・`scope.md`／`promote-check.md`・DEMO-UX Audit 節  
**範囲一文:** 個人美容室予約デモ（申込／本日台帳／店設定）の L3 決め事と実装の Gap／Conform／Baseline／DEMO-UX 重大候補を洗う。

## Gap

- [x] **[重大] G1 — 定休を画面で設定できない（D3 / manage-business-hours / AC-5）**  
  - 仕様: `specs/L3/reservations/decisions/reservation-rules.md` D3「店主は営業時間・定休・休憩ブロックを設定できる」／`usecases/manage-business-hours.md` 基本フロー2／issue 01・PBI AC-5  
  - 実装（初回）: `product/apps/web/src/App.tsx` `SettingsSurface` は開店・閉店・休憩のみ。定休はヒント文言のみで、`updateBusinessHours(..., { closedWeekdays })` を UI から呼べない  
  - ドメインは `closedWeekdays` を枠生成に反映済み（`soloSalon.ts` `listAvailableSlots`）  
  - **次アクション:** 実装修正（戻し修復で対応済み → 下記「戻し修復」）  
  - DEMO-UX: 仕様乖離（重大候補）

- [ ] **[軽微] G2 — 来店客の状態追跡はセッション内の自申込のみ**  
  - 仕様: D5 / `track-reservation-status`「来店客と店主が同一予約の状態を追える」  
  - 実装: `BookingSurface` の `trackedId` は申込直後のみ。シード予約や ID 照会 UI はない（店主台帳では全件可視）  
  - **次アクション:** 無視（デモ主要パスは申込後追跡で足りる）／必要なら実装修正で照会を足す

- [ ] **[軽微] G3 — 店設定のメニューは所要分のみ編集可（名称・追加削除なし）**  
  - 仕様: D4「施術メニューとその所要時間を設定できる」  
  - 実装: 所要分の更新のみ（demo-seeded の3種は固定）  
  - **次アクション:** 無視（AC-5／demo-seeded の所要反映は満たす）／仕様変更で「所要の更新」に狭める

## Conform

- [ ] **[該当なし・明示] C1 — 拡大解釈なし**  
  - 完了遷移・客側キャンセルは D5 / track UC の範囲内  
  - 決済・配信・指名・カルテ等のスコープ外機能は UI／ドメインに追加していない（`out-of-scope.md`）  
  - **次アクション:** 無視

## Baseline（L1 E1–E12）

- [ ] **[軽微] B1 — E7 認可はデモ単一シェル**  
  - 主表面は3つに分離（actor-split の責務同居はなし）が、認証なしタブで全表面に到達可能  
  - 本デモは通常利用を画面完遂とするが、認可主体分離は未実装  
  - **次アクション:** 無視（demo-grade・認証スコープ外）／将来は実装修正

- [ ] **[該当なし] E1–E6, E8–E11** — 範囲内で秘密露出・沈黙失敗・環境混在等の違反なし（失敗は `ok: false`＋error 区分）

- [ ] **[軽微] B2 — E12 構造衛生**  
  - `App.tsx` に3表面同居。demo-grade では許容。入り口過多ではないが、表面分割ファイル化の余地あり  
  - **次アクション:** 無視

## DEMO-UX Audit（重大候補チェック）

| 候補 | 判定 | 根拠 |
|------|------|------|
| sector 不一致 | **なし** | メニュー所要・1 chair・美容室文言／シード（アトリエ霧・カット等） |
| actor-split 破れ | **なし（表面単位）** | 申込／台帳／店設定で主ジョブ非同居。タブ同居は B1 軽微 |
| demo-seeded 欠落 | **なし** | カット60／カラー120／パーマ150、火〜土10–19、昼休、確定＋申請シード |
| surface >3 | **なし** | 3表面のみ |
| attention 逆転 | **なし** | 申込=メニュー→枠→申込／台帳=時間塊→確定／設定=営業→メニュー |
| design call 無視 | **なし** | 店名ヒーロー・メニューカード・時間ブロック台帳・清潔感パレット |
| 汎用スキン | **なし** | 業態固有のメニューカード＋台帳塊 |
| 仕様乖離 | **あり→修復** | G1 定休設定 UI（重大） |

## Assure

- 製品仕様 L3 `reservations`（draft）あり。本セッションは Audit 指摘＋戻し修復を優先。`/assure`（Coverage＋実現）は工程7前に任意。本 Audit では **誘導のみ**（対象あり・未実行）。

## 戻し修復（ラウンド 1／1）

| 項目 | 内容 |
|------|------|
| 対象 | G1 定休設定 UI |
| 変更 | `SettingsSurface` に定休（曜日）トグルを追加し `updateBusinessHours` の `closedWeekdays` を保存。ドメイン単体に定休変更→枠ゼロの回帰を追加 |
| ADR | `adr/0005-audit-closed-weekday-settings-repair.md` |
| 再点検 | G1 解消。重大 Gap 残ゼロ → Verifier **(B)** |

## 次アクション（工程7）

- 重大なし（修復後）。軽微 G2/G3/B1/B2 は無視可
- PBI-0002 を audit 結果反映（review 相当メモ）
- Assure は任意。実証ログへ本指摘パスを引き継ぐ

## Verifier

**(B)** 戻し修正済み＋ADR
