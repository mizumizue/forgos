---
layer: L3
domain: lesson-studio
kind: usecases
maturity: draft
actors:
  - 保護者（代理申立者）
  - 受講生（本人申立者）
---

# 期限内の欠席連絡

## 概要

保護者または受講生が、対象 LessonOccurrence に対し期限内に AbsenceNotice を提出する（WF-1）。

## 事前条件

- 対象回が「予定」状態である
- 同一回に未提出の AbsenceNotice がない

## 事後条件

- 期限内: 対象回が「欠席連絡済」となり、makeup_eligible となる（規約上振替対象の場合）
- 期限超過: pending_teacher_review となり、講師の受理待ちとなる
- 講師 S1 当該枠に欠席が反映される

## 基本フロー

1. アクターが S3 で「欠席を連絡する」を選択する（予定状態かつ期限内のみ活性）
2. 欠席連絡シートで回次・理由（任意）・ContactChannel を入力する
3. アクターが送信する
4. システムが期限を判定し、absence_confirmed または pending_teacher_review とする
5. S3 に戻り、ステータスが「欠席連絡済」に更新される

## 代替・例外フロー

- 期限超過検出時: エラー文言と講師相談導線を表示し、S3 に戻る
- 既に欠席連絡済の場合: CTA は非活性とし「振替を希望する」へ誘導する

## 関連

- 決め事: `decisions/scheduling-rules.md` D3–D5
- 用語: `glossary/terms.md`（AbsenceNotice, ContactChannel）
- ユースケース: `usecases/request-makeup.md`
