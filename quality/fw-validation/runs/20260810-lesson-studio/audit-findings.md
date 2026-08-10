# Audit Findings — run `20260810-lesson-studio`（工程10）

**モード:** Audit  
**範囲:** `specs/L3/lesson-studio/` ↔ `product/`（ブランチ `validation/20260810-lesson-studio`）  
**参照:** `scope.md`, `design-call.md`, `DEMO-UX.md` Audit 節  
**日付:** 2026-08-10

## 判定サマリ

| 項目 | 結果 |
|------|------|
| 重大 Gap | **3件検出 → 1修復ラウンドで修復済み** |
| 修復 | `product/` + ADR `adr/0005-lesson-studio-audit-repairs.md` |
| Verifier | **(B) 修復済み + ADR** |
| 単体テスト | 修復後 **14 tests passed**（`cd product && npx pnpm@9.15.0 test`） |

---

## Gap

### 重大（修復済み）

- [x] **G-M1 actor-split 破れ — 本人申立者 S3 未実装**  
  - **仕様:** `scope.md` S1 受講生（本人申立者）、`actor-surfaces.md` D4、`decisions/scheduling-rules.md` D11  
  - **実装（修復前）:** `App.tsx` は保護者（鈴木家）のみ。シードの中村涼（`household-nakamura`, `actorType: self`）に到達不能  
  - **修復:** actor-nav に「受講生（中村涼）」を追加。世帯 ID で S3 を共有  
  - **次アクション:** 実装修正（完了）

- [x] **G-M2 期限後欠席の講師受理フロー欠落（D4）**  
  - **仕様:** `scheduling-rules.md` D4 — `pending_teacher_review` は講師の受理／却下を要する  
  - **実装（修復前）:** `reportAbsence` は生成するが受理 API・S2 UI なし。保護者面は「欠席連絡済」相当で止まる  
  - **修復:** `reviewLateAbsence`, `listPendingLateAbsences`、S2「期限後欠席」ブロック、`absence_pending_review` 表示  
  - **次アクション:** 実装修正（完了）

- [x] **G-M3 講師 override UI 欠落（D8）**  
  - **仕様:** `scheduling-rules.md` D8、`design-call.md` J2 override 受理（理由必須・S2 のみ）  
  - **実装（修復前）:** `approveMakeup(_, _, overrideReason?)` はあるが画面から unreachable  
  - **修復:** S2 振替カードに「override 受理」＋理由入力ダイアログ  
  - **次アクション:** 実装修正（完了）

### 軽微（修復見送り — demo-grade 内で許容）

- [ ] **G-m1 全員欠席時の「休講扱い」提案 UI**  
  - **仕様:** `usecases/confirm-lesson-attendance.md` 代替フロー  
  - **実装:** `confirmLesson` は `cancelled_no_show` を記録するが UI 提案なし  
  - **次アクション:** 無視（demo-grade。domain 挙動は一致）

- [ ] **G-m2 S2 処理済み振替カードの一覧**  
  - **仕様:** `scope.md` demo-seeded「処理済1件」  
  - **実装:** `listMakeupQueue` は `submitted` のみ。シードの `req-ryo-done`（approved）はキュー非表示  
  - **次アクション:** 無視（主要 UC 完遂に非必須）

- [ ] **G-m3 講師による振替先チップ再選択**  
  - **仕様:** design-call attention「同レベル空き枠チップ列（タップで確定）」  
  - **実装:** 保護者が S3 で希望枠選択 → 講師 S2 はその枠を確定（チップは参照表示）  
  - **次アクション:** 無視（`request-makeup.md` と `process-makeup-queue.md` の申請→確定フローと整合）

- [ ] **G-m4 規約折りたたみ（S3 従情報）**  
  - **仕様:** design-call S3 attention 従 — 規約全文は折りたたみ  
  - **実装:** ヘッダの `POLICY_TAGS` とシート内タグのみ。折りたたみ UI なし  
  - **次アクション:** 無視（判断材料は表示済み）

### 仕様にあるが実装にない（該当なし・主要 UC 充足）

- 月謝・決済・LINE 配信 — `out-of-scope.md` どおり見送り ✓
- S1 振替確定ボタン — `actor-surfaces.md` D5 どおり S2 集約 ✓

### 実装にあるが仕様にない（過剰）

- なし（Conform 参照）

---

## Conform

- [ ] **C-1 デモ固定時刻 `DEMO_NOW`** — 画面操作は `2026-08-11T10:00` 固定。仕様の「期限内 CTA」検証は可能だが本番時計非連動。demo-grade の範囲内と判断  
  - **次アクション:** 無視（検証 run 用途）

- [ ] **C-2 クライアント内 actor 切替** — 認証なしのタブ切替。E7 本番相当は未実装だが L3 に認証要件なし  
  - **次アクション:** 無視（demo-grade）

---

## Baseline（L1 E1–E12）

- [x] **E1 秘密情報** — 該当なし（プレースホルダ電話番号のみ）
- [x] **E2 紐づけ** — `product/` は L3 lesson-studio に沿う
- [x] **E3 Audit 可能性** — 本ファイルで Gap 追跡可能
- [x] **E4 テスト** — 単体テストあり（修復後実行）
- [x] **E5 L1 不可侵** — L1 未編集
- [x] **E6 入力検証** — domain でガード（重複欠席・振替条件等）
- [ ] **E7 認可** — クライアント actor 切替のみ。サーバ認可なし（demo 許容。本番前に要検討）
- [x] **E8 失敗表現** — `ok: false` + error コード
- [x] **E9–E11** — 該当なし／問題なし
- [ ] **E12 構造衛生** — `App.tsx` が UI 全体を単一ファイルに集約（約 900 行）。振る舞いは明確だが将来分割候補  
  - **次アクション:** 無視（demo-grade。修復ラウンドでは触らない）

---

## Assure

**対象あり** — 工程11 または別セッションで `/assure` を推奨。

| 種別 | 候補 |
|------|------|
| Coverage | `scope.md` S6 品質 What 5件 → `quality/` カタログ未整備 |
| 実現 | WF-1〜3 の domain テストはある。E2E／画面テストは未整備 |

**Assure 要約:** L3 draft + `quality/` active なし。Coverage 登録と実現点検は次工程。

---

## DEMO-UX Audit 重大候補チェック

| 候補 | 判定 |
|------|------|
| brief／design 一般論のみ | No — ピアノ教室固有シード・genre look あり |
| actor-split 破れ | **Was Yes → 修復** |
| demo-seeded 欠落 | No — 初級A火曜／3級準備土曜等あり |
| surface >3 | No — S1/S2/S3 |
| attention 逆転 | No — 週ストリップ・座席リング・期限バッジ優先 |
| 権限差（override）欠落 | **Was Yes → 修復** |
| 画面遷移無視 | **部分 Yes（期限後欠席）→ 修復** |
| 汎用フォームのみ | No — レッスン帳・座席リング・振替キュー |

---

## 次アクション（セッション）

1. ~~重大 Gap 修復（1ラウンド）~~ — **完了**
2. 工程11 `run-log.md` へ Audit 結果を反映
3. `/assure` で S6 品質 What → `quality/` Coverage 候補
4. 軽微 G-m1〜m4 は backlog 任意

---

## 修復ファイル

- `product/packages/domain/src/lessonStudio.ts`
- `product/packages/domain/src/lessonStudio.test.ts`
- `product/packages/domain/src/types.ts`
- `product/apps/web/src/App.tsx`
- `product/apps/web/src/styles.css`
- `adr/0005-lesson-studio-audit-repairs.md`
