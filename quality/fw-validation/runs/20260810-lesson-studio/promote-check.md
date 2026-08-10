# Promote check — 20260810-lesson-studio

## 人間ゲート代行（hands-off）

ForgOS 実証ループ（`forgos-validation-loop-workflow`）の **hands-off** により、本 run では人間承認カードへのユーザー返信を待たず、作業者がゲートを代行する。

- **代行承認:** 案 A（L3 `lesson-studio` 新規・What のみ・成熟度 `draft`）
- **承認範囲:** glossary／actors／decisions／usecases への取り込み。L2 横断は対象外
- **成熟度:** 初回取り込みのためすべて `draft`
- **書き込み後:** Source `specs/source/lesson-studio-scheduling/` を削除

## Source 固定

| 項目 | 値 |
|------|-----|
| Source | `specs/source/lesson-studio-scheduling/spec.md`（取り込み後削除） |
| Feature | 小規模ピアノ教室 — 授業枠・出席・振替管理（lesson-studio-scheduling） |
| 書き込み先 | L3 `specs/L3/lesson-studio/`（新規） |

## Audit（取り込み前）

範囲: 当該 Source ＋ 既存 L3（`tasks` は別ドメイン）＋ 関連 sandbox／実装。

### Gap

- [x] 既存 L3 `lesson-studio` なし。衝突する既存決め事なし
- [x] `product/`／`sandbox/` に本テーマ実装なし → 実装との Gap なし

### Conform

- [x] 取り込み対象を Source の What（actors／骨格／usability／スコープ外／公開境界）に限定
- [x] design call 見た目 How（座席リング色・パレット・週ストリップ描画）は L2/L3 に上げない

### Baseline（L1 E1–E12）

- [x] 対象コード変更なし → Baseline 指摘なし

### Assure

- 対象なし（製品実装・quality active 保証なし）

### ブロッカー

- 未解決ブロッカー: **ゼロ**

## Promote ゲート（L1 完了条件 7 項）

| # | 条件 | 状態 |
|---|------|------|
| 1 | 用語 | **OK** — `glossary/terms.md`（C1–C8 概念を定義） |
| 2 | アクター | **OK** — `actors/members.md`（講師／保護者／受講生、actor-split） |
| 3 | ユースケース | **OK** — 5 UC、actors 明示 |
| 4 | 決め事（What のみ） | **OK** — `scheduling-rules.md`／`actor-surfaces.md`／`out-of-scope.md`。How・見た目なし |
| 5 | 成熟度 | **OK** — すべて `draft` |
| 6 | トレーサビリティ | **OK** — Source リンクなし。PBI 未作成（工程8 map）。sandbox／実装パスなし |
| 7 | 矛盾チェック | **OK** — 既存 L3 `tasks` と無関係。横断 L2 衝突なし |

## 分解対応（要約）

| Source 節 | L3 種別 | パス |
|-----------|---------|------|
| sector brief／業態・table stakes | glossary + decisions | `glossary/terms.md`, `decisions/scheduling-rules.md` |
| actors／actor-split | actors + decisions | `actors/members.md`, `decisions/actor-surfaces.md` |
| domain skeleton（C1–C8） | glossary + decisions | terms + scheduling-rules |
| usability what（5件） | decisions + usecases | D3–D11 および各 UC |
| demo-seeded 具体値 | **上げない** | issue／Implement（シードデータとして） |
| スコープ外 | decisions | `out-of-scope.md` |
| design call／genre look | **上げない** | issue／Implement へ（P4） |

## 書き込んだ L3 パス

- `specs/L3/lesson-studio/glossary/terms.md`
- `specs/L3/lesson-studio/actors/members.md`
- `specs/L3/lesson-studio/decisions/scheduling-rules.md`
- `specs/L3/lesson-studio/decisions/actor-surfaces.md`
- `specs/L3/lesson-studio/decisions/out-of-scope.md`
- `specs/L3/lesson-studio/usecases/view-my-enrollment.md`
- `specs/L3/lesson-studio/usecases/report-absence.md`
- `specs/L3/lesson-studio/usecases/request-makeup.md`
- `specs/L3/lesson-studio/usecases/confirm-lesson-attendance.md`
- `specs/L3/lesson-studio/usecases/process-makeup-queue.md`

L2: なし（技術横断の新規決め事なし）。

## Source 削除

- `specs/source/lesson-studio-scheduling/` — **削除済み**

## DEMO-UX Promote P0–P4

| ID | 判定 | 根拠 |
|----|------|------|
| P0 | **Yes** | 業態・actors・顧客属性の採用が glossary／actors／決め事／UC に辿れる（1人講師・定員制グループ・保護者＋本人申込） |
| P1 | **Yes** | usability what（5件）→ D3–D11 および report／request／confirm／process UC |
| P2 | **Yes** | `actors/members.md` と `decisions/actor-surfaces.md` に主表面分担（S1/S2 講師、S3 保護者・受講生）が残る |
| P3 | **Yes** | 採用 usability は決め事・UCへ。見送り（決済・配信・個別振替枠等）は `out-of-scope.md` |
| P4 | **Yes** | design call の見た目 How（座席リング・ウォームパレット・週ストリップ描画）は L2/L3 に上げていない。**工程8 issue および工程9 Implement で design call を辿り実行する** |

## ドメイン骨格の辿り

| 概念／WF | 辿れる先 |
|----------|----------|
| WeeklyClassSlot（C1） | glossary + D1 + confirm UC |
| EnrollmentAssignment（C2） | glossary + D2 + view UC |
| LessonOccurrence（C3） | glossary + D12 + confirm/report UC |
| AbsenceNotice（C4） / WF-1 | glossary + D3–D5 + report UC |
| MakeupRequest（C5） / WF-2 | glossary + D6–D8, D13 + request/process UC |
| RuntimeDurationRule（C6） | glossary + D10 + confirm UC |
| MakeupPolicyBundle（C7） | glossary + D4, D6 + process UC |
| LevelBand（C8） | glossary + D6 + request UC |
| WF-3 各回実施記録 | D9–D10, D12 + confirm UC |
| 見送り（TuitionLedger 等） | `out-of-scope.md` |

## Verifier 自己点検

| # | 条件 | 判定 |
|---|------|------|
| 1 | promote-check に自動点検 | **Yes**（本ファイル） |
| 2 | L2/L3 取り込み | **Yes**（L3 `lesson-studio`） |
| 3 | Source 削除 | **Yes** |
| 4 | ドメイン骨格辿れる | **Yes**（上表） |
| 5 | DEMO-UX P0–P4 すべて Yes | **Yes** |

## 工程8 引き継ぎ

- 入力: `specs/L3/lesson-studio/**`（draft）
- map／cut 時に載せるべき辿り: sector（1人講師・定員制グループ）、actor-split、surface≤3、demo-seeded（MakeupPolicyBundle・WeeklyClassSlot シード）、**design call（見た目 How・本 check P4）**
- 本工程では map／cut／implement しない

## 機械ゲート

- 確認コマンド: `python -m tools.check --promoted lesson-studio-scheduling`

## 総合判定

**取り込み可 → 反映済み。Source 削除済み。**
