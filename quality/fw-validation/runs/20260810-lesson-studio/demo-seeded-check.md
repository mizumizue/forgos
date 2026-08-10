# Demo-seeded visibility cold start — 20260810-lesson-studio（overlay v3）

**Run:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**正本:** `scope.md` §demo-seeded visibility（26 行）  
**検証日:** 2026-08-10  
**シード:** `createDemoStudioState(new Date("2026-08-10T17:00:00"))`  
**UI:** `product/apps/web/src/App.tsx`

## Visibility cold start 証明

| V-ID | 起動直後の見え方 | 主表面 | manifest 紐づけ | 確認手順（≤5 steps） | シード根拠 |
|------|------------------|--------|-----------------|------------------------|------------|
| V-a-teacher | ヘッダ「講師」タブが選べ、S1 レッスン帳に入れる | S1 | A-teacher | ①起動 ②「講師」タブ ③S1 表示 | `App.tsx` actor-nav / 講師タブ |
| V-a-parent | 「保護者（鈴木家）」タブで S3・鈴木家のみ | S3 | A-parent, B-uc-view-enrollment | ①起動（既定）②S3 ③他世帯名なし | `household-suzuki` / 既定 actor |
| V-a-student | 「受講生（中村涼）」タブで本人枠のみ | S3 | A-student, B-uc-view-enrollment | ①受講生タブ ②S3 ③中村涼1件 | `household-nakamura` |
| V-s1-today-band | 週ストリップで今日（月）列が木目縦帯、翌日火曜枠が最寄り | S1 | A-teacher, B-uc-confirm-attendance | ①講師 S1 ②月列ハイライト ③火曜枠表示 | `demoWeekStart` + `week-col--today` |
| V-s1-slot-tue | 火曜16:00「初級A・火曜」枠カード | S1 | B-uc-confirm-attendance | ①講師 S1 ②火曜列 ③枠名確認 | `slot-tue-beginner-a` / `occ-tue-0811` |
| V-s1-slot-thu | 木曜17:00「初級A・木曜」枠カード | S1 | B-uc-confirm-attendance | ①講師 S1 ②木曜列 ③枠名確認 | `slot-thu-beginner-a` / `occ-thu-0813` |
| V-s1-slot-sat | 土曜10:00「3級準備・土曜」枠カード | S1 | B-uc-confirm-attendance | ①講師 S1 ②土曜列 ③枠名確認 | `slot-sat-grade3` / `occ-sat-0815` |
| V-s1-seat-ring | 各枠に定員2〜3の座席リング色分け | S1 | B-uc-confirm-attendance | ①S1 ②火曜枠 ③seat-rings 色 | `occ-tue-0811` seats hana/sota |
| V-s1-absence-seat | 欠席連絡済座席が欠席色 | S1 | B-uc-report-absence, B-uc-confirm-attendance | ①S1 火曜枠 ②颯太リング ③欠席色 | `occ-tue-0811` `stu-sota: absent` |
| V-s1-duration-badge | 人数連動 ♩=20/45/60 バッジ | S1 | D-runtime-duration, B-uc-confirm-attendance | ①S1 火曜枠 ②右下バッジ ③20min | `expectedMinutes` on `occ-tue-0811` |
| V-s1-makeup-link | 振替申請枠に「振替 1 件」リンク→S2 | S1 | B-uc-process-makeup | ①S1 火曜枠 ②リンク ③S2 アンカー | `req-sota-pending` on `occ-tue-0811` |
| V-s1-outbound-seat | 振替確定済み生徒が outbound 表示 | S1 | B-uc-process-makeup, B-uc-confirm-attendance | ①S1 土曜枠 ②タップ ③outbound チップ | `occ-sat-0815` `makeupOutboundStudentIds: stu-ryo` |
| V-s2-pending-card | S2 先頭に申請中カード＋期限バッジ | S2 | B-uc-process-makeup | ①講師 S2 ②先頭カード ③残りhバッジ | `req-sota-pending` `listMakeupQueue` |
| V-s2-processed-card | S2 に処理済カード1件（確定結果） | S2 | B-uc-process-makeup | ①講師 S2 ②「処理済み」 ③確定カード | `req-ryo-done` `listProcessedMakeupQueue` |
| V-s2-level-chips | 申請カード内の同レベル空き枠チップ列 | S2 | B-uc-process-makeup | ①S2 pending ②slot-chips ③木曜枠 | `availableTargetSlots` on queue item |
| V-s2-policy-labels | 「前日18:00まで」「月1回」「再振替不可」等 | S2 | B-uc-process-makeup, B-uc-request-makeup | ①S2 pending ②policy-tags ③3+ラベル | `POLICY_TAGS` on makeup card |
| V-s2-late-absence | 期限後欠席ブロック（受理／却下） | S2 | C-late-absence, B-uc-process-makeup | ①S2 ②late-absence-block ③override | `abs-hana-late-thu` pending review |
| V-s2-override-entry | 申請カード最下部「override 受理」 | S2 | C-override-makeup | ①S2 pending ②override ボタン ③ダイアログ | `MakeupQueueSurface` override flow |
| V-s2-reject-entry | 申請カード「却下」操作 | S2 | C-makeup-reject | ①S2 pending ②却下ボタン ③操作可能 | `MakeupQueueSurface` onReject |
| V-s3-parent-enrollment | 保護者 S3 に児童2名の在籍枠カード | S3 | B-uc-view-enrollment | ①保護者タブ ②2 cards ③曜日時刻名 | `stu-hana` + `stu-sota` enrollments |
| V-s3-student-enrollment | 受講生 S3 に土曜在籍枠カード | S3 | B-uc-view-enrollment | ①受講生タブ ②1 card ③3級準備土曜 | `stu-ryo` / `slot-sat-grade3` |
| V-s3-status-scheduled | 鈴木はなが「予定」＋欠席CTA活性 | S3 | B-uc-view-enrollment, B-uc-report-absence | ①保護者 S3 ②はな行「予定」 ③CTA活性 | `stu-hana` status `scheduled` |
| V-s3-status-absence-pending | 鈴木颯太が「欠席連絡済・振替申請中」 | S3 | B-uc-view-enrollment, B-uc-request-makeup | ①保護者 S3 ②颯太行 ③ステータス文言 | `stu-sota` `makeup_pending` label |
| V-s3-status-makeup-done | 中村涼が「振替確定」＋新日時 | S3 | B-uc-view-enrollment, B-uc-process-makeup | ①受講生タブ ②振替確定 ③→木曜行 | `req-ryo-done` + `makeupTargetSummary` |
| V-s3-contact-channel | 欠席シートに WEB_FORM/LINE/PHONE | S3 | D-contact-channel, B-uc-report-absence | ①欠席CTA ②シート ③select 3件 | absence sheet `ContactChannel` options |
| V-s3-privacy-empty-seat | 他生徒氏名なし・空き席数のみ | S3 | B-uc-view-enrollment | ①保護者 S3 ②カード内 ③空き席数のみ | `openSeatCount` / no other names |

## 修正メモ（v3 cold start）

| 課題 | 対応 |
|------|------|
| 鈴木はなが `absence_pending_review` で「予定」未到達 | 火曜は `scheduled`、期限後欠席は木曜 `abs-hana-late-thu` に分離 |
| 中村涼の振替確定に新日時なし | `makeupTargetSummary` + S3 表示行追加 |
| S1 outbound 非表示 | `listTeacherWeek` で outbound 在籍生を座席リストに含める |
| 規約ラベルに「月1回」欠落 | `POLICY_TAGS` に追加 |
| 欠席CTA非活性（火曜当日デモ） | `DEMO_NOW` を月曜17:00（前日18:00期限前）に固定 |
