# Spec Depth — 小規模ピアノ教室（受講生・授業枠・振替管理）

**Run:** `20260810-lesson-studio`  
**STATE_DIR:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**入力:** `sector-brief.md`（調査日 2026-08-10）  
**feature-slug:** `lesson-studio-scheduling`

---

## システム狙い（参照）

ForgOS 正規パイプライン実証のため、**1人講師・定員制グループレッスン**の小規模ピアノ教室で、受講生の在籍・定期授業枠・出席／欠席・振替を **Web 画面**（講師面／保護者・受講生面の actor-split）から demo-grade で完遂できる土台を固定する（`scope.md` §システム狙い・§スコープ内）。

**sector-brief との対応:** 業態は brief の「個人経営・1講師・定員制集合個人レッスン型」、主オペは OP-1（出欠・欠席連絡）・OP-2（振替手配）・OP-4（定員連動の実施時間）を中核とする。OP-3（月謝回収）は brief 通例 T1 として参照するが、`scope.md` §スコープ外のため本システムでは **在籍維持の状態表示のみ**（決済・請求は持たない）。

---

## D2 — 役割と権限

### 役一覧（≥2）

| 役 | 主ジョブ（1文） |
|----|----------------|
| **講師（オーナー）** | 定期クラス枠の編成・定員設定・各回の出欠正本更新・振替可否の最終確定・休講日の宣言を行う。 |
| **保護者（代理申立者）** | 幼児〜小学生受講生の欠席連絡・振替希望の申出・在籍状態（休会・退会）の申請を期限内に行う。 |
| **受講生（本人申立者）** | 中高生・大人受講者として、自分名義の欠席連絡と振替希望を期限内に行う（教室設定で保護者代理と排他）。 |

事務スタッフは brief どおり **ロールなし**（講師兼務）。システム上は講師アカウントのみが管理操作を持つ。

### 権限差（見える／できる／できない）

| 操作・情報 | 講師 | 保護者 | 受講生（本人） |
|------------|------|--------|----------------|
| **見える** | 全クラス枠・全受講生の在籍・全回の出欠・振替申請キュー・休講カレンダー | 自世帯の受講生の在籍枠・自世帯の出欠履歴・自世帯の振替申請状態・公開された空き振替候補 | 本人の在籍枠・本人の出欠履歴・本人の振替申請状態・公開された空き振替候補 |
| **できる** | クラス／定員／レベル帯の CRUD、在籍割当、出欠の確定・訂正、振替の承認／却下／手動割当、休講日設定、振替ルール閾値の設定 | 期限内の欠席連絡、振替希望（候補日選択または希望日申告）、休会・退会申請 | 同上（本人紐づけアカウントのみ） |
| **できない** | 規約外の無制限振替（システムは回数・期限ガードを講師 override なしでは通さない） | 他世帯の出欠閲覧、定員超過枠への自己割当、規約外当日キャンセルの振替申請、クラス編成の変更 | 他受講生の情報閲覧、任意曜日の新規枠確保、講師スケジュールの直接編集 |

**override:** 振替期限超過・同レベル不一致・定員超過は原則 **却下**。講師のみ「特例承認」で通過可能（brief §ロール／権限の現場実態に合わせる）。

---

## D3 — 可変境界（当該システム向け命名）

外部ラベル（「設定」「マスタ」等）だけでなく、**レッスンスタジオ枠管理**の語彙で固定する。

| 境界名 | 可変／固定 | 誰が変える | 変えたときの波及 | brief 根拠 |
|--------|------------|------------|------------------|------------|
| **`WeeklyClassSlot`（週次クラス枠）** — 曜日・開始時刻・`LevelBand`・`CapacityTier` の組 | 可変（開講／休止） | 講師 | 在籍割当・振替候補プール・各 `LessonOccurrence` の生成母集団が変わる | brief OP-2、予約／枠「曜日・開始時刻」「クラス（レベル帯）」 |
| **`CapacityTier`（定員段）** — `DUO_45`（2名・45分）／`TRIO_60`（3名・60分） | 可変（コース設計） | 講師 | `RuntimeDurationRule` の分岐・振替先の空き判定上限が変わる | brief OP-4、田中 2人45分／3人60分 [S2] |
| **`LevelBand`（同レベル帯）** — 例: `BEGINNER_A` / `GRADE3_PREP` | 可変（昇級・編成） | 講師 | 振替先検索のフィルタ。異なる帯への振替は不可（override 除く） | brief T2 同レベル [S1] |
| **`EnrollmentAssignment`（在籍割当）** — 受講生 × `WeeklyClassSlot` の紐づけ | 可変（入会・移籍・退会） | 講師（申請は保護者／受講生） | 固定枠の基準点。欠席連絡・振替の対象枠が決まる | brief A1、T1 固定枠月謝 |
| **`MakeupPolicyBundle`（振替規約束）** — `AbsenceNoticeDeadline`（例: 前日18:00）・`MakeupQuotaPerMonth`（例: 1）・`MakeupValidityDays`（例: 30）・`ReMakeupAllowed`（false） | 可変（教室ごと） | 講師 | 欠席連絡の自動適格判定・振替申請の却下理由が変わる | brief T2、石橋前日18時・再振替不可 [S1]、KASE 月1回 [S3] |
| **`RuntimeDurationRule`（実施時間ルール）** — 出席人数 → 実施分（例: 1名→20分、2名→45分、3名→60分） | 可変（教室運用） | 講師 | 各 `LessonOccurrence` の記録フィールド `actualMinutes` の期待値 | brief OP-4 [S2] |
| **`LessonOccurrence`（各回実施）** — 特定日の1回分 | 固定（日付・親枠は生成時確定） | システム生成＋講師が休講／振替で更新 | 出欠・振替の状態遷移の単位 | brief OP-1 |
| **`ContactChannel`（連絡経路記録）** — `LINE` / `PHONE` / `WEB_FORM` | 可変（記録方針） | 保護者／受講生が申告、講師が訂正可 | 期限違反 dispute 時の監査ログ | brief A3、KASE LINE／電話 [S3] |

**固定（本 run）:** 1講師のみ、Web UI が通常形態、グループ単独振替枠の自動生成は行わない（brief 見送り D3）。

---

## D4 — 主ワークフロー（決定項目・状態遷移）

時間・量・承認の3軸を各 WF に明示する。

### WF-1: 欠席連絡（`AbsenceNotice`）

**目的:** 定期枠の特定回に対し、期限内の欠席を記録し、振替資格の有無を確定する（brief OP-1）。

| 種別 | 内容 |
|------|------|
| **時間** | `AbsenceNoticeDeadline` 前後で「期限内／期限超過」を自動判定（例: レッスン前日 18:00） |
| **量** | 対象は **1 `LessonOccurrence` につき 1 連絡**。同一回の重複は却下 |
| **承認** | 期限内 → 自動受理。期限超過 → `pending_teacher_review`、講師が受理／却下 |

**決定項目**

1. どの `LessonOccurrence`（日付・クラス）か
2. 欠席理由区分（任意記録。感染症等は振替対象外フラグ参照 — brief 見送り D4）
3. `ContactChannel` の申告

**状態遷移**

```text
[未連絡] --(期限内申告)--> [absence_confirmed] --(振替資格あり)--> [makeup_eligible]
[未連絡] --(期限超過申告)--> [pending_teacher_review] --(講師受理)--> [absence_confirmed]
[pending_teacher_review] --(講師却下)--> [absence_rejected]
[absence_confirmed] --(振替不要／枠のみ消化)--> [closed_no_makeup]
```

### WF-2: 振替申請〜確定（`MakeupRequest`）

**目的:** 同レベル・定員空きの別 `LessonOccurrence` へ合流する振替を、申請から講師確定まで追跡する（brief OP-2、T2、T3）。

| 種別 | 内容 |
|------|------|
| **時間** | 元欠席の `MakeupValidityDays` 内のみ候補提示。超過は自動却下 |
| **量** | `MakeupQuotaPerMonth` を超える申請は自動却下（講師 override 可）。`ReMakeupAllowed=false` のとき再振替は不可 |
| **承認** | 条件充足 → `auto_approved` または `pending_teacher_confirm`（教室設定）。定員超過・レベル不一致は却下 |

**決定項目**

1. 元の `absence_confirmed`（どの欠席に対する振替か）
2. 振替先 `LessonOccurrence`（同 `LevelBand`・空きあり）
3. 特例承認の要否（期限超過・回数超過時）

**状態遷移**

```text
[makeup_eligible] --(候補選択・申請)--> [submitted]
[submitted] --(自動条件充足)--> [approved]
[submitted] --(要確認)--> [pending_teacher_confirm] --(講師承認)--> [approved]
[submitted] --(条件不足)--> [rejected]
[pending_teacher_confirm] --(講師却下)--> [rejected]
[approved] --(振替先レッスン実施)--> [completed]
[approved] --(振替先も欠席・再振替不可)--> [forfeited]
```

**分岐ガード（決定ポイント）**

- 振替先の `EnrollmentAssignment` 数 < `CapacityTier` 上限か
- 振替元・先の `LevelBand` が一致するか
- 当月の振替確定数 < `MakeupQuotaPerMonth` か
- 元欠席が `ReMakeupAllowed` 制約に違反していないか

### WF-3: 各回レッスンの実施記録（`LessonOccurrence` 運用）

**目的:** 出欠確定と定員連動の実施時間を正本化する（brief OP-1、OP-4）。

| 種別 | 内容 |
|------|------|
| **時間** | レッスン日の前後で講師が確定。休講日は講師が一括 `cancelled_by_studio` |
| **量** | 出席者数 → `RuntimeDurationRule` で `actualMinutes` を導出 |
| **承認** | 出欠の最終確定は講師のみ。保護者は閲覧のみ |

**状態遷移**

```text
[scheduled] --(出欠確定)--> [held] --(実施時間記録)--> [recorded]
[scheduled] --(全員欠席)--> [cancelled_no_show]
[scheduled] --(講師休講)--> [cancelled_by_studio]
[held] --(振替生合流)--> [held]（出席者数再計算→時間再算出）
```

---

## D5 — 概念一覧（採用／見送り）

| # | 概念 | 採用／見送り | 理由（brief 紐づけ） |
|---|------|--------------|----------------------|
| C1 | **`WeeklyClassSlot`（週次クラス枠）** | **採用** | A1 固定枠マスタ。月謝・出欠・振替の基準 |
| C2 | **`EnrollmentAssignment`（在籍割当）** | **採用** | A1。入会時講師が曜日枠を割当（brief 予約／枠） |
| C3 | **`LessonOccurrence`（各回実施）** | **採用** | OP-1 出欠記録の単位。振替元・先の両端 |
| C4 | **`AbsenceNotice`（欠席連絡）** | **採用** | A3 連絡チャネル・タイムスタンプ。OP-1 |
| C5 | **`MakeupRequest`（振替申請）** | **採用** | A2 期限・同レベル・定員・再振替不可 |
| C6 | **`RuntimeDurationRule`（定員連動実施時間）** | **採用** | A4。1名20分／2名45分／3名60分 [S2] |
| C7 | **`MakeupPolicyBundle`（振替規約束）** | **採用** | T2 期限・回数・有効期間の教室差をデータ化 |
| C8 | **`LevelBand`（同レベル帯）** | **採用** | T2 振替先フィルタ [S1] |
| C9 | **`TuitionLedger`（月謝台帳）** | **見送り** | scope 外（決済・請求本実装なし）。在籍状態のみで代替 |
| C10 | **`SoloMakeupSlot`（欠席者のみの個別振替枠）** | **見送り** | brief 見送り D3／T3 グループ単独振替不可 [S2] |
| C11 | **`SubstituteTeacherShift`（代講シフト）** | **見送り** | brief 見送り D2。1講師前提 |
| C12 | **`FreeBookingPass`（任意曜日都度予約）** | **見送り** | brief 見送り D1。週固定枠・月謝制と両立しない |

**採用 ≥1:** C1–C8 を採用（8概念）。

---

## D6 — sector-brief との辿り（調査帰結）

| spec-depth 要素 | sector-brief 参照 |
|-----------------|-------------------|
| 業態・顧客像 | §業態、§顧客属性（保護者＋幼児〜小学生／本人申込中高生・大人） |
| 権限・override | §ロール／権限、講師のみ振替可否最終判断 |
| `MakeupPolicyBundle` | T2（前日18時・月1回・有効期限）、T3（グループ単独振替不可） |
| `RuntimeDurationRule` | OP-4、田中 1名20分／2名45分 [S2] |
| WF-1 欠席連絡 | OP-1、A3 |
| WF-2 振替 | OP-2、A2、石橋・KASE 規約 [S1][S3] |
| 見送り概念 | brief §仕様候補—見送り D1–D5、scope §スコープ外 |

**一般論・単一 CRUD でない根拠:** 本稿の中心は「受講生マスタ CRUD」ではなく、**(1) 定期枠に紐づく欠席の期限判定**、**(2) 同レベル・定員・回数・再振替不可の多段ガードを持つ振替 WF**、**(3) 出席人数に連動する実施時間の記録** の3本が独立した状態機械を持つ。講師／保護者／受講生で見える情報と操作が異なり（actor-split）、`scope.md` の demo-grade 実証軸（定期枠・出席・振替）に直結する。

---

## スコープ整合メモ

| 項目 | 扱い |
|------|------|
| 月謝・決済 | `scope.md` スコープ外。`EnrollmentAssignment` の在籍状態（active／paused／withdrawn）のみ |
| LINE／SMS 配信 | スコープ外。`ContactChannel` は申告記録のみ |
| 体験レッスン | 本 depth では WF 外。入会後の `EnrollmentAssignment` 作成は講師操作で足りる（Spike で詳細化可） |
