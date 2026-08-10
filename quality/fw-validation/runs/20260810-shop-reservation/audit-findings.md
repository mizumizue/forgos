# Audit 指摘リスト — 20260810-shop-reservation

**モード:** Audit（工程6）  
**範囲:** `specs/L3/reservations/`（decisions / usecases / out-of-scope）↔ `product/packages/domain` + `product/apps/web`。PBI-0002 / issues completed 01・02。scope: 本 run の `scope.md`。  
**重大判定（ループ・オーバーレイ）:** 重大 **0** 件（画面操作面・genre look・WF/状態いずれも UI／振る舞いに存在する）

## Gap

### 重大

- （なし）

オーバーレイ候補の確認結果:

| 候補 | 判定 | 根拠 |
|------|------|------|
| scope が画面必須なのに操作面が無い | **非該当** | `App.tsx` に営業時間・日次ボード・空き確認・申込・店舗確定／却下／保留・一覧詳細・来店／完了／キャンセルの操作面あり（scope UC1–7） |
| genre look 要素が UI に無い | **非該当** | 日次ボード、リソース軸（提供リソース選択＋残定員）、状態ラベル、枠起点申込、店舗確定操作が UI にある |
| 採用ドメイン骨格の WF／状態が無い | **非該当** | domain で受付→確定→来店／完了／キャンセル＋却下／保留。空き確認〜店舗確定の経路が UI から呼べる。単体で枠復帰を検証 |

### 軽微

- [ ] **G1（軽微）** 空きなしでも申込ボタンが活性のまま  
  - 仕様: `usecases/check-availability.md` / AC-3「空きが無い場合は申込へ進めない」  
  - 実装: `product/apps/web/src/App.tsx`（申込 submit は常時可）。拒否は `applyReservation`／事前 `checkAvailability`（`reservationShop.ts`）  
  - 次アクション候補: 実装修正（空き確認成功まで disable） / 無視（ドメイン拒否で受入は満たす）

- [ ] **G2（軽微）** 状態に応じた店舗操作ボタンの無効化がない  
  - 仕様: `usecases/shop-confirm-reservation.md`「操作不能な状態には確定操作を適用しない」  
  - 実装: UI は常時表示、domain `shopDecide` / `transitionStatus` が `INVALID_STATE`  
  - 次アクション候補: 実装修正（状態連動 disable） / 無視（ドメインが正）

- [ ] **G3（軽微）** `partySize <= 0` を拒否しない  
  - 仕様: D2／空き確認 UC（人数を前提）  
  - 実装: `checkAvailability` / `applyReservation` は正の人数を必須にしていない  
  - 次アクション候補: 実装修正 / 仕様で 1 以上を明示 / 無視（デモ入力前提）

## Conform

### 重大

- （なし）

### 軽微

- [ ] **C1（軽微・対象外の守り）** out-of-scope（決済・外部同期・複数店舗・待合最適化等）の実装は見当たらない → **適合**（指摘なし、確認記録）
- [ ] **C2（軽微）** genre look 文言（「カレンダー俯瞰」等）は L3 未記載のオーバーレイ表現。実体は view-slots／D9 の画面表現に収まる  
  - 次アクション候補: 無視 / Specify で表現語を足す（任意）

拡大解釈によるスコープ外機能の追加は確認されず。

## Baseline（L1 E1–E12）

- [x] E1 秘密: 問題なし（デモ顧客はプレースホルダ入力）
- [x] E2 紐づけ: `product/` は L3 reservations／PBI-0002 に対応
- [x] E3 追跡: hub（PBI 対応表）経由。仕様から実装パス直書きなし
- [ ] **E4（記録）** Implement 引き継ぎで `pnpm test` 7 passed。本 Audit セッションでは PATH に node/pnpm がなく再実行未実施（テストソース `reservationShop.test.ts` は D1–D7/D9 をカバー）
- [x] E5 L1 不可侵: 本工程で L1 未編集
- [ ] **E6（軽微）** 顧客氏名・連絡先は検証。人数・時刻フォーマットは最小 → デモ範囲で許容可
- [ ] **E7（軽微）** 店舗スタッフ／顧客の認可分離なし（単一デモ画面）→ デモ前提なら無視可
- [x] E8 失敗表現: `ok: false` + 理由コード
- [x] E9–E11: 当該差分で該当薄い
- [ ] **E12（軽微）** `App.tsx` に UC が集約。公開入り口は `createReservationShop` に寄っておりデモ範囲では許容。肥大化したら画面分割を検討

## Assure

範囲: L3 reservations ＋ `quality/unit` / `quality/integration`（既定）。

### 台帳

- active: 0（Discovery: 0） / draft: 0 / retired: 0（両 catalog とも「保証なし」）

### Catalog

- [x] 索引あり（内容は空＝保証なし）
- [ ] **A1（軽微）** reservations の Coverage 用 active が未登録

### Coverage

- [ ] D1–D9 / UC6 本とも `quality/**` active の `related_specs` 未カバー（実装単体テストは存在するが catalog 未載）

### Evidence / Run / Orphan

- Evidence: catalog active 0 のため「対象なし」（実装側 Vitest は PBI／issue 経由で参照可）
- Run: 本セッション未再実行（上記 E4）
- Orphan: catalog 空のため該当なし

### Promote 候補（Specify 直書き）

- 対象なし（Discovery active なし）。genre look を L3 に昇格するかは任意・ユーザー判断

### Assure 次アクション

- 保証追加（unit catalog に D1–D7/D9・主要 UC を載せ、`reservationShop.test.ts` を証拠に） / 無視（draft デモ・工程7前は任意）

## 次アクション（全体）

1. **重大なし → Implement 巻き戻し不要。** Verifier **(A)** 候補。
2. 軽微 G1–G3 / E6–E7 / E12 はデモ完了判定では無視可。必要なら別ラウンドで UI disable／人数バリデーション。
3. Assure A1 は `/assure` 本実施または工程後の catalog 整備でよい（本 Audit の重大にはしない）。
4. PBI-0002: Audit 結果を反映し `review` へ（draft のため `done` は引き続き不可）。

## 重大サマリ

| 区分 | 件数 |
|------|------|
| 重大 Gap | 0 |
| 重大 Conform | 0 |
| 軽微 Gap | 3（G1–G3） |
| 軽微 Conform | 1 記録＋適合確認（C2） |
| Baseline 軽微 | E4 再実行未／E6・E7・E12 |
| Assure | Coverage 欠落（active 0）＝軽微扱い |
