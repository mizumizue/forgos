# 実証ログ — 20260810-lesson-studio

**工程:** 11（実証ログ）  
**実行手段:** `loop-eng` 型 `EO`  
**作業ブランチ:** `validation/20260810-lesson-studio`（`main` @ `6160aec` から新規）  
**feature-slug:** `lesson-studio-scheduling`

## テーマ

小規模ピアノ教室の受講生・授業枠・振替管理（1人講師・定員制グループレッスン）。講師と保護者／受講生の actor-split、定期枠・出席・振替 WF を画面で demo-grade 完遂する。

## 通った工程（1–10）とゲート結果要約

| # | 工程 | 結果 | 要約 |
|---|------|------|------|
| 1 | テーマ／ブランチ枠 | Pass | `scope.md` 初期版。画面必須・スコープ外明示。`validation/20260810-lesson-studio` 作成 |
| 2 | 業種調査 | Pass | `sector-brief.md`（Round 1、V1–V6 全 Yes）。1講師・定員制集合型に業態固定。table stakes 4件・OP 4件 |
| 3 | 仕様深度 | Pass | `spec-depth.md`（Round 1、D1–D6 全 Yes）。概念8・WF 3・役3・境界8 |
| 4 | モックデザイン | Pass | `design-call.md`（Round 1、C1–C9 全 Yes）。主表面3（S1 レッスン帳／S2 振替キュー／S3 マイ枠）。ウォームスタジオ genre look |
| 5 | スコープ統合 | Pass | `scope.md` 統合版。DEMO-UX S0–S7 全 Yes。actor-split・demo-seeded・attention stack 固定 |
| 6 | Spike（Source） | Pass | `specs/source/lesson-studio-scheduling/spec.md`（U0–U6・骨格・demo-grade）。sandbox 未作成 |
| 7 | Promote | Pass | L3 `specs/L3/lesson-studio/` 新規（draft）。`promote-check.md` で人間ゲート代行。Source 削除。P0–P4 Yes |
| 8 | map／cut | Pass | PBI-0002、issue 01（保護者 S3）／02（講師 S1/S2）。sector／actor-split／design-call 参照あり |
| 9 | Implement | Pass | `product/` pnpm monorepo（domain + web）。単体 12→修復前緑。S1/S2/S3 主要 UC。DEMO-UX I1–I7 Yes |
| 10 | Audit | Pass **(B)** | 重大 Gap 3件（actor-split 本人申立・期限後欠席受理・override UI）→ 1修復ラウンド＋`adr/0005-lesson-studio-audit-repairs.md`。修復後 14 tests passed |

参照: `gate-log.md` / `sector-brief.md` / `spec-depth.md` / `design-call.md` / `scope.md` / `promote-check.md` / `audit-findings.md`

## 詰まり

1. **Audit 重大 Gap 3件（工程内修復）** — Implement 通過後、工程10で以下を検出。Stop 内の戻しラウンド1で修復し Verifier (B)。
   - **G-M1:** 本人申立者（中村涼）の S3 未到達。保護者世帯のみ実装で actor-split 破れ。
   - **G-M2:** `pending_teacher_review`（D4 期限後欠席）の講師受理 UI 欠落。domain は生成するが S2 未到達。
   - **G-M3:** 講師 override（D8）の `approveMakeup(overrideReason)` が画面から unreachable。
2. **工程停止級の詰まり:** なし。工程2–4は各 Round 1 合格。巻き戻しは Audit 修復ラウンドのみ。

## FW 所見

- 正規パイプライン（sector brief → spec depth → design call → Source → L3 → pbl/issues → product → Audit）を **継続受講＋枠固定＋欠席対応** ドメインで一通り通せた。予約系 run とは異なる actor-split・定期枠・振替 WF の検証軸を追加できた。
- 工程2–4の深さスキル（sector-research / spec-depth / mock-design）はいずれも Round 1 合格。工程5統合で矛盾なし（月謝は在籍状態のみ、振替確定は S2 集約）。
- **Implement と Audit のすき間:** 工程9 Verifier は Pass だったが、二次 actor（本人申立）と決め事の例外フロー（期限後欠席受理・override）の画面到達は Audit まで検出されなかった。BL-20260810-03（設定項目到達）とは別軸の漏れ → backlog 1件追記。
- **Assure / Coverage:** `scope.md` S6 品質 What 5件は `quality/` カタログ未整備。既存 BL-20260810-02 の範疇。`/assure` は未実行（Audit 誘導のみ）。
- **軽微（backlog 非掲載）:** 全員欠席の休講提案 UI、S2 処理済みカード、講師の振替先再選択、S3 規約折りたたみ、`DEMO_NOW` 固定時計、認証なし actor タブ、`App.tsx` 単一ファイル集約（約900行）。demo-grade 内で許容。

## 改善事項の扱い

方針: **FW／パイプライン改善のみ backlog 追記。アプリ固有の軽微は run-log 所見に留める。**

- backlog 追記: **1件** → `quality/fw-validation/backlog.md`
  - BL-20260810-04 — actor-split 全役と決め事例外フローの Implement 到達検証
- 既存 backlog で十分な項目: BL-20260810-02（quality catalog）、BL-20260810-01（worktree）は本 run で新規発見なし
- アプリ軽微（G-m1〜m4、C-1/C-2、E7/E12）: **改善なし（backlog 非掲載）** — 所見のみ

## 主要成果パス（アプリ経路・run ブランチ上）

| 領域 | パス |
|------|------|
| 仕様 L3 | `specs/L3/lesson-studio/`（glossary / actors / decisions / usecases） |
| hub | `pbl/items/PBI-0002-lesson-studio-scheduling.md`（status: verify） |
| issues | `issues/completed/lesson-studio-scheduling-01-parent-enrollment.md`、`issues/completed/lesson-studio-scheduling-02-teacher-surfaces.md` |
| 実装 | `product/packages/domain/`、`product/apps/web/` |
| ADR | `adr/0005-lesson-studio-audit-repairs.md` |
| 検証メタ | `quality/fw-validation/runs/20260810-lesson-studio/` |

## 一行アウトカム

**小規模ピアノ教室の actor-split デモを正規パイプラインで完走し、Audit 修復1ラウンド後に主要 UC を画面完遂（Verifier B）。**

## Verifier 自己点検（工程11）

1. `run-log.md` にテーマ・工程1–10要約・詰まり・所見がある: **Yes**
2. 改善あれば backlog 追記、無ければ「改善なし」明記: **Yes**（FW 改善 1件追記。アプリ軽微は「改善なし（backlog 非掲載）」）

## 工程12 — main 反映

- **validation ブランチ:** `validation/20260810-lesson-studio` @ `21eb4ba`
- **main 反映範囲:** `quality/fw-validation/` のみ（`backlog.md` + `runs/20260810-lesson-studio/`）
- **反映手順:** `git checkout main && git checkout validation/20260810-lesson-studio -- quality/fw-validation/ && git commit`
- **remote push:** 未実施（GitHub 認証未設定）。手動: `git push -u origin validation/20260810-lesson-studio` → `git push origin main`
