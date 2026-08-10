---
layer: L3
domain: lesson-studio
kind: glossary
maturity: draft
---

# レッスンスタジオ用語

| 用語 | 定義 |
|------|------|
| WeeklyClassSlot（週次クラス枠） | 曜日・開始時刻・LevelBand・CapacityTier で識別される定期授業枠。在籍割当・振替候補・各回実施の母集団 |
| EnrollmentAssignment（在籍割当） | 受講生と WeeklyClassSlot の紐づけ。在籍状態は active／paused／withdrawn |
| LessonOccurrence（各回実施） | 特定日の1回分の授業。出欠・振替の状態遷移単位 |
| AbsenceNotice（欠席連絡） | 特定 LessonOccurrence に対する欠席申告。ContactChannel とタイムスタンプを持つ |
| MakeupRequest（振替申請） | 欠席確定後、同 LevelBand・定員空きの別 LessonOccurrence への合流申請 |
| RuntimeDurationRule（実施時間ルール） | 出席人数から実施分（分）を導出する教室規則（例: 1名→20、2名→45、3名→60） |
| MakeupPolicyBundle（振替規約束） | AbsenceNoticeDeadline・MakeupQuotaPerMonth・MakeupValidityDays・ReMakeupAllowed の束 |
| LevelBand（同レベル帯） | 振替先検索のフィルタ。異なる帯への振替は原則不可（講師 override 除く） |
| CapacityTier（定員段） | 枠の定員上限と基準時間（例: DUO_45＝2名・45分、TRIO_60＝3名・60分） |
| ContactChannel（連絡経路） | 欠席連絡時の申告チャネル（WEB_FORM／LINE／PHONE）。配信機能は持たない |

## 関連

- 決め事: `decisions/scheduling-rules.md`, `decisions/actor-surfaces.md`, `decisions/out-of-scope.md`
- アクター: `actors/members.md`
