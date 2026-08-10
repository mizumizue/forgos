---
layer: L3
domain: lesson-studio
kind: usecases
maturity: draft
actors:
  - 講師（オーナー）
---

# 振替申請の処理

## 概要

講師が S2 振替キューで MakeupRequest を承認・却下・override し、同レベル空き枠への振替を確定する（WF-2 確定側）。

## 事前条件

- MakeupRequest が submitted または pending_teacher_confirm である
- 講師がログイン済みである

## 事後条件

- 承認: MakeupRequest が approved となり、振替元・先の双方画面に新日時が反映される
- 却下: rejected となり、申請者 S3 が「振替不可」となる
- override: 理由記録のうえ特例承認とする

## 基本フロー

1. 講師が S2 で申請カード（残時間昇順）を開く
2. 同レベル空き枠チップから振替先を選択する
3. 確認ダイアログで再振替不可等の規約を再表示する
4. 講師が確定する
5. カードが処理済みとなり、申請者 S3 に「振替確定」が反映される

## 代替・例外フロー

- 空きなし・規約外: 却下し理由を選択する
- override 受理: 期限後・回数超過時、理由必須で特例承認する
- S1 からのショートカット: 該当カードへスクロールする。処理後「レッスン帳で確認」で振替先週へ遷移できる

## 関連

- 決め事: `decisions/scheduling-rules.md` D6–D8, D13
- 決め事: `decisions/actor-surfaces.md` D3, D5
- 用語: `glossary/terms.md`（MakeupRequest, MakeupPolicyBundle）
- ユースケース: `usecases/request-makeup.md`
