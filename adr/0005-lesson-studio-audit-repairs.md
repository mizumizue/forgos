---
adr: 0005
status: accepted
date: 2026-08-10
---

# lesson-studio Audit 修復 — actor-split と講師 override

## 文脈

`validation/20260810-lesson-studio` の工程10 Audit で、L3 `scheduling-rules` D4/D8 と `actor-surfaces` D4 に対し product 実装に重大 Gap があった。

1. **actor-split:** シードの本人申立者（中村涼）向け S3 表面が UI に無く、保護者世帯のみだった。
2. **期限後欠席（D4）:** `pending_teacher_review` は domain で生成されるが、講師の受理／却下フローが画面から到達不能だった。
3. **講師 override（D8）:** `approveMakeup` の `overrideReason` 引数はあるが S2 から操作できなかった。

## 決定

1. **actor-nav を3役に拡張:** 講師 / 保護者（鈴木家）/ 受講生（中村涼）。世帯 ID で `listParentEnrollments` を共有し、本人申立者も S3 を完遂できる。
2. **`reviewLateAbsence` を domain に追加:** 理由必須で `pending_teacher_review` を `absence_confirmed`（受理）または却下（欠席記録削除）する。S2 に「期限後欠席」ブロックを置く。
3. **S2 に override UI を追加:** 振替カードと期限後欠席の双方で理由入力＋確認ダイアログ。`overrideReason` を `approveMakeup` / `reviewLateAbsence` に渡す。
4. **表示:** `absence_pending_review` ステータスと S2 の連絡チャネルラベルを追加。S3 期限後は「講師に相談」外部リンクを表示。

## 影響

- `product/packages/domain/src/lessonStudio.ts` — `reviewLateAbsence`, `listPendingLateAbsences`, セッション表示拡張
- `product/apps/web/src/App.tsx` — 3役ナビ、S2 override／期限後欠席 UI
- 単体テスト追加（late absence review）

## 見送り（軽微 Gap として Audit に残す）

- 全員欠席時の「休講扱い」提案 UI（domain は `cancelled_no_show` を記録）
- S2 処理済み振替カードの一覧表示（キューは submitted のみ）
- 講師による振替先チップの再選択（申請時の希望枠確定で足りると判断）
