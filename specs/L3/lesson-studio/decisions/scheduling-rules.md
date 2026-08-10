---
layer: L3
domain: lesson-studio
kind: decisions
maturity: draft
---

# 授業枠・出席・振替の決め事

## D1. 週次クラス枠

WeeklyClassSlot は曜日・開始時刻・LevelBand・CapacityTier の組で識別する。開講／休止は講師のみが変更できる。

## D2. 在籍割当

EnrollmentAssignment は受講生を WeeklyClassSlot に紐づける。在籍状態は active／paused／withdrawn。入会時の枠割当は講師が行う。

## D3. 欠席連絡（1回1連絡）

1 LessonOccurrence につき 1 AbsenceNotice のみ受理する。重複申告は却下する。

## D4. 欠席連絡の期限判定

MakeupPolicyBundle の AbsenceNoticeDeadline（例: レッスン前日 18:00）前の申告は自動受理し absence_confirmed とする。期限超過は pending_teacher_review とし、講師の受理／却下を要する。

## D5. 欠席連絡の振替資格

absence_confirmed かつ教室規約上振替対象の欠席は makeup_eligible とする。ContactChannel は申告記録として保持する（配信は行わない）。

## D6. 振替申請のガード

MakeupRequest は次をすべて満たすときのみ受理する（講師 override 除く）:

- 振替元が makeup_eligible の欠席である
- 振替先の LevelBand が振替元と一致する
- 振替先 LessonOccurrence の在籍数が CapacityTier 上限未満である
- 申請月の確定振替数が MakeupQuotaPerMonth 未満である
- 元欠席から MakeupValidityDays 以内である
- ReMakeupAllowed=false のとき、当該欠席に対する再振替は不可

条件不足は rejected とし、理由を申請者に返す。

## D7. 振替確定

振替の最終確定は講師のみが行う。確定後、振替元回は欠席消化、振替先回に受講生が合流し、双方の画面に新日時が反映される。

## D8. 講師 override

期限超過・回数超過・レベル不一致の特例承認は講師のみが行える。理由の記録を必須とする。

## D9. 出欠正本

各 LessonOccurrence の出欠最終確定は講師のみが行う。確定後は編集をロックする。

## D10. 実施時間の導出

出欠確定時、出席人数に RuntimeDurationRule を適用し actualMinutes を導出する（例: 1名→20分、2名→45分、3名→60分）。確定前は期待値を提示し、確定後に記録する。

## D11. プライバシー

保護者／受講生面は自世帯（または本人）の枠・出欠・振替状態のみ閲覧できる。他受講生の氏名・出欠は表示しない。空き席数の共有は可。

## D12. 各回の状態

LessonOccurrence は scheduled → held → recorded、または scheduled → cancelled_no_show（全員欠席）、scheduled → cancelled_by_studio（講師休講）へ遷移する。

## D13. 振替申請の状態

MakeupRequest は submitted → approved／rejected → completed（振替先実施後）または forfeited（振替先欠席かつ再振替不可）へ遷移する。

## 関連

- 用語: `glossary/terms.md`
- アクター: `actors/members.md`
- 対象外: `decisions/out-of-scope.md`
- ユースケース: `usecases/report-absence.md`, `usecases/request-makeup.md`, `usecases/confirm-lesson-attendance.md`, `usecases/process-makeup-queue.md`
