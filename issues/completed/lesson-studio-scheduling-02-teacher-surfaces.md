# 02 — 講師レッスン帳・振替キュー

**Feature:** lesson-studio-scheduling

**PBI:** PBI-0002（`pbl/items/PBI-0002-lesson-studio-scheduling.md`）

**Manifest:** A-teacher, B-uc-confirm-attendance, B-uc-process-makeup, C-late-absence, C-makeup-reject, C-override-makeup, C-all-absent, D-runtime-duration

**作るもの:** 講師が S1 週ストリップで座席リング・人数連動実施時間バッジを操作し出欠確定（WF-3）でき、S2 振替キューで申請を残時間昇順に処理・確定できる。S1 に振替確定ボタンは置かない。

**参照:** sector-brief OP-1/OP-4、actor-split S1/S2、demo-seeded（座席リング・20/45/60分）、design-call G1–G5・J3/J4、attention stack S1/S2

**Blocked by:** lesson-studio-scheduling-01-parent-enrollment

**Status:** completed

**Triage:** ready-for-agent

- [x] S1 週ストリップに今日の縦帯・座席リング・実施時間バッジ（G1–G3）が表示される（Manifest: A-teacher, B-uc-confirm-attendance, D-runtime-duration）
- [x] 座席トグルで人数連動時間が更新され「レッスンを確定」で WF-3 がロックされる（design-call J3）（Manifest: B-uc-confirm-attendance, C-all-absent, D-runtime-duration）
- [x] S2 で期限切れ間近バッジ付き申請を残時間昇順表示し、同レベル空き枠チップで確定できる（design-call J2/J4）（Manifest: B-uc-process-makeup, C-makeup-reject, C-override-makeup）
- [x] S2 で期限後欠席の override 受理／却下ができる（Manifest: C-late-absence）
- [x] ウォームスタジオパレット・規約インラインラベル（G4–G5）が適用される
- [x] cold start でヘッダ「講師」タブが選べ、タップで S1 レッスン帳に入れる（V-a-teacher）（Manifest: A-teacher）
- [x] cold start で S1 週ストリップの今日列が木目縦帯ハイライトされ、現在時刻に近いクラス枠が最上段に見える（V-s1-today-band）（Manifest: A-teacher, B-uc-confirm-attendance）
- [x] cold start で火曜 16:00「初級A・火曜」（`BEGINNER_A`・`DUO_45`）枠カードが週ストリップに固定表示される（V-s1-slot-tue）（Manifest: B-uc-confirm-attendance）
- [x] cold start で木曜 17:00「初級A・木曜」（`BEGINNER_A`・`TRIO_60`）枠カードが週ストリップに見える（V-s1-slot-thu）（Manifest: B-uc-confirm-attendance）
- [x] cold start で土曜 10:00「3級準備・土曜」（`GRADE3_PREP`・`TRIO_60`）枠カードが週ストリップに見える（V-s1-slot-sat）（Manifest: B-uc-confirm-attendance）
- [x] cold start で各枠カード内に定員 2〜3 の座席リングで出席／欠席／未確定が色分け表示される（V-s1-seat-ring）（Manifest: B-uc-confirm-attendance）
- [x] cold start で欠席連絡済の生徒座席が欠席色で S1 当該枠に反映されている（V-s1-absence-seat）（Manifest: B-uc-report-absence, B-uc-confirm-attendance）
- [x] cold start で座席人数に連動し実施時間バッジ（1名20分／2名45分／3名60分）が枠カード右下に見える（V-s1-duration-badge）（Manifest: D-runtime-duration, B-uc-confirm-attendance）
- [x] cold start で振替申請がある枠カードに「振替 1 件」リンクが見え S2 該当カードへアンカーできる（V-s1-makeup-link）（Manifest: B-uc-process-makeup）
- [x] cold start で振替確定済み生徒は当該枠で空席扱い＋outbound 表示になる（V-s1-outbound-seat）（Manifest: B-uc-process-makeup, B-uc-confirm-attendance）
- [x] cold start で S2 振替キュー先頭に申請中カード 1 件が残時間昇順で見え、期限切れ間近バッジが付く（V-s2-pending-card）（Manifest: B-uc-process-makeup）
- [x] cold start で S2 に処理済カード 1 件が見え、確定済み振替の結果が読み取れる（V-s2-processed-card）（Manifest: B-uc-process-makeup）
- [x] cold start で申請カード展開時に同レベル・定員空きの振替先枠チップ列が見える（V-s2-level-chips）（Manifest: B-uc-process-makeup）
- [x] cold start で申請カードに「前日18:00まで」「月1回」「再振替不可」の規約インラインラベルが見える（V-s2-policy-labels）（Manifest: B-uc-process-makeup, B-uc-request-makeup）
- [x] cold start で S2 に期限後欠席ブロック（`pending_teacher_review`）が見え、override 受理／却下ができる（V-s2-late-absence）（Manifest: C-late-absence, B-uc-process-makeup）
- [x] cold start で申請カード最下部に講師のみの「override 受理」入口が確認ダイアログ付きで見える（V-s2-override-entry）（Manifest: C-override-makeup）
- [x] cold start で申請カードに「却下」操作が見え、却下後は保護者 S3 が「振替不可」になる（V-s2-reject-entry）（Manifest: C-makeup-reject）
- [x] ドメイン単体テストが緑

## Comments

- 2026-08-10: Implement 完了。`product/apps/web` S1/S2、`product/packages/domain` WF-3。
