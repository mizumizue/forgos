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
| manifest 参照 | `scope.md` §implementation manifest（v2 overlay） |

## Audit（取り込み前）

範囲: 当該 Source ＋ 既存 L3（`tasks` は別ドメイン）＋ manifest。

### Gap

- [x] 既存 L3 `lesson-studio` なし。衝突する既存決め事なし
- [x] manifest B の 5 UC がすべて L3 `usecases/*.md` に対応

### Conform

- [x] 取り込み対象を Source の What（actors／骨格／usability／スコープ外）に限定
- [x] design call 見た目 How は L2/L3 に上げない

### ブロッカー

- 未解決ブロッカー: **ゼロ**

## Promote ゲート（L1 完了条件 7 項）

| # | 条件 | 状態 |
|---|------|------|
| 1 | 用語 | **OK** — `glossary/terms.md` |
| 2 | アクター | **OK** — `actors/members.md` |
| 3 | ユースケース | **OK** — 5 UC |
| 4 | 決め事（What のみ） | **OK** — scheduling-rules／actor-surfaces／out-of-scope |
| 5 | 成熟度 | **OK** — すべて `draft` |
| 6 | トレーサビリティ | **OK** — manifest 参照可。PBI は工程8 |
| 7 | 矛盾チェック | **OK** — 既存 L3 `tasks` と無関係 |

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

## Source 削除

- `specs/source/lesson-studio-scheduling/` — **削除済み**

## DEMO-UX Promote P0–P5

| ID | 判定 | 根拠 |
|----|------|------|
| P0 | **Yes** | 業態・actors が glossary／actors／決め事／UC に辿れる |
| P1 | **Yes** | usability what（5件）→ D3–D11 および各 UC |
| P2 | **Yes** | actor-split（S1/S2 講師、S3 保護者・受講生）が残る |
| P3 | **Yes** | 見送りは `out-of-scope.md` |
| P4 | **Yes** | design call 見た目 How は L2/L3 に上げない。**工程8 issue および工程9 Implement で辿る** |
| P5 | **Yes** | L3 usecases 5 件 = manifest B の `implement` 行 5 件 |

## 総合判定

**取り込み可 → 反映済み。Source 削除済み。**
