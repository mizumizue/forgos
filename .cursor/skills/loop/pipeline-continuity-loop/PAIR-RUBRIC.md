# 工程間連続性ルーブリック（Pair Rubric）

ForgOS 本体には書かない。`pipeline-continuity-loop` の **工程間** Yes/No 正本。  
単一工程の内部品質（V1–V6、S0–S8、U0–U7 等）は各工程スキル／`DEMO-UX.md` が担当。**ここは隣接工程の抜け落ちのみ**。

参照: 実証ループの DEMO-UX は [`forgos-validation-loop-workflow/DEMO-UX.md`](../../forgos-validation-loop-workflow/DEMO-UX.md)。

## ねらい

- **黙って落とす**（上流で採用・`implement` と読めるのに下流に痕跡なし）を **工程境界で検出**する
- 見送りは **`deferred` ＋ 見送り根拠パス**、または上流の **明示見送り＋理由** が下流に辿れるときのみ合格
- 一般論の「だいたい合ってる」は No。ID・行・ファイル名で機械的に辿る

## 用語

| 語 | 意味 |
|----|------|
| **上流義務** | 下流へ運ぶべき採用事項・`implement` 行・visibility 行・UC・ジャーニー等 |
| **痕跡** | 下流成果物での ID 一致、見出し、ファイル、AC 行、reachability 行等の **明示参照** |
| **黙落** | 上流義務に対し、許可された見送り記録も下流痕跡もない状態 |
| **ペア** | 連続する2工程（例: 5→6） |

## 共通ルール（全ペア）

| ID | Yes の条件 |
|----|------------|
| **X0** | ペアの上流・下流成果物が **両方存在**（下流未着手なら本ペアは `skip` と記録。黙落カウントに含めない） |
| **X1** | 上流義務を **抽出表**に列挙した（推測で省略しない） |
| **X2** | 抽出表の **各行**について、下流に痕跡がある、または **許可見送り**（`deferred`＋根拠パス、上流明示見送りが下流に引用） |
| **X3** | 黙落行が **0 件** |
| **X4** | 下流にだけ現れる **新規義務**（上流に無い `implement`／UC／画面）がある場合、上流への **逆流矛盾**を確認し、意図的なら下流に「追加理由」1行。意図なしは No |
| **X5** | 件数契約（下表の「件数」行）が満たされている |

**不合格:** X3 が No、または件数契約違反。

## ペア別 — 上流義務の抽出と下流痕跡

`RUN = quality/fw-validation/runs/<run-id>/`。feature-slug は `RUN/scope.md` または起動指示。

### 1→2（初期 scope → sector brief）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| `RUN/scope.md`（工程1版）のテーマ1文 | `sector-brief.md` 冒頭または §領域 | 1 |
| システム狙い1文以上 | brief §帰結または調査目的 | ≥1 |
| 通常利用形態（画面等） | brief が業務アプリと読める具体業態 | 1 |

Verifier ID: **P12**

### 2→3（sector brief → spec depth）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| brief **採用** 行（V5） | `spec-depth.md` 概念・WF・決め事候補の **採用** | 採用件数一致 |
| brief **見送り** 行 | depth **見送り** または後続 `scope.md` §スコープ外（本ペア時は depth 優先） | 見送り件数一致 |
| brief table stakes **採用** ≥1 | depth の WF／状態または概念 | ≥1 |
| brief ロール／権限の記述 | depth D1 役 ≥2 | ≥2 |

Verifier ID: **P23**

### 3→4（spec depth → design call）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| depth **採用** 概念（C 行） | design-call の表面・ラベル・ジャーニー内操作 | 採用概念 ≥5 のうち **採用** 全件 |
| depth 主 WF・状態 ≥2 | design-call **ジャーニー ID**（J*） | WF 数一致 |
| depth D3 **採用** 可変境界 | design-call または後続 scope manifest D で `implement`／`deferred` 予定の記述 | 採用行全件 |
| depth 役 ≥2 | design-call actor-split（表面分担） | 役数一致 |

Verifier ID: **P34**

### 4→5（design call → 統合 scope）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| design-call **ジャーニー ID 全件** | `scope.md` manifest **B** のジャーニー ID 列、または visibility／§design call 遷移 | 全件 |
| design-call 主表面（≤3） | `scope.md` S2 actor-split・S3 surface budget | 表面数一致 |
| design-call attention 各表面 | `scope.md` S5 表 | 表面数一致 |
| design-call genre look 要素 ≥3 | `scope.md` S7 要約 | ≥3 |
| design-call の起動時見せ項目 | `scope.md` §demo-seeded visibility 行、または manifest 紐づけ | 起動時項目全件 |

Verifier ID: **P45**

### 5→6（統合 scope → Source）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| manifest **`implement` 行全件**（A/B/C/D） | Source `## implementation manifest` または UC／骨格／WF 節で **同一 ID** または UC 名一致 | implement 行数一致 |
| manifest **`deferred` 行全件** | Source スコープ外／見送り節に **根拠パス引用** | deferred 行数一致 |
| §demo-seeded visibility **全行** | Source `## demo-seeded` または manifest／visibility 参照 | visibility 行数一致 |
| `scope.md` S1 役全件 | Source `## actors` | 役数一致 |
| S6 品質 What ≥3 | Source `## usability what` | ≥3 |
| S0–S8 の **採用** 要約（brief／depth／design 参照） | Source U0–U7 各節 | DEMO-UX Source 表と同趣旨 |

Verifier ID: **P56**（実証ループで落ちやすい境界。**厳格**）

### 6→7（Source → L2/L3 Promote）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| Source manifest **`implement` の B 行**（UC） | `specs/L3/<domain>/usecases/*.md` **1 UC 1 ファイル** | B の implement 行数一致 |
| Source **採用** 概念・WF | glossary／decisions／actors のいずれか | 採用概念・WF 全件 |
| Source `## actors` | L3 `actors/` または decisions | 役全件 |
| Source `## usability what` 各条 | decisions または UC 本文 | 全件 |
| Source **見送り** | L3 `out-of-scope` または decisions 見送り | 見送り全件 |
| design call How | L2/L3 に **上げていない**（`RUN/promote-check.md` P4 行） | How 混入 0 |

Verifier ID: **P67**（実証ループで落ちやすい境界。**厳格**）

### 7→8（L2/L3 → map／cut）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| `scope.md` manifest **`implement` 行全件** | PBI 受入条件または issue AC が **束ねて** カバー（M1） | 全件 |
| manifest **A** 全 actor | PBI／issue AC に demo-seeded 主表面到達（M4） | 全件 |
| manifest **C・D** の implement | issue AC または PBI AC（M5） | 全件 |
| L3 `usecases/*.md`（implement 対象） | issue ≥1 または PBI AC 明示（M2） | UC 数一致 |
| visibility **全行** | PBI／issue AC に cold start（M7） | 全行 |

Verifier ID: **P78**

### 8→9（map／cut → Implement）

| 抽出（上流） | 下流痕跡 | 件数 |
|--------------|----------|------|
| manifest **`implement` 行全件** | `RUN/implement-reachability.md` **1 行 1 ID**（I9/I10） | 行数一致 |
| visibility **全行** | `RUN/demo-seeded-check.md` **1 行 1 V-ID**（I12） | 行数一致 |
| issue `Manifest:` 列の ID | reachability または product 内到達 | 全 ID |
| PBI 証拠 tier `ui`（M6） | reachability の UI 手順列 | implement 行全件 |

Verifier ID: **P89**

### 9→10（Implement → Audit）— 参照のみ

Audit スキルが manifest 未到達を **重大** とする。本スキルは **P89 まで**を主対象。工程10は Audit ゲートに委譲。

## 出力表テンプレ（`continuity-check.md`）

```markdown
# Continuity check — <run-id>

- STATE_DIR: …
- チェック日: …
- モード: all | pair <N>→<M>

## サマリ
| ペア | 状態 | 上流義務数 | 黙落 | 許可見送り | 逆流追加 |
|------|------|------------|------|------------|----------|
| P12 | pass/skip/fail | … | … | … | … |
…

## 黙落詳細（fail 時必須）
| ペア | 上流 ID／要約 | 期待下流 | 実際 |

## ペア別抽出表（pass でも upstream 件数を記録）
### P56 …
| 上流 ID | 種別 | 下流痕跡 | 判定 carried/deferred_ok/silent_drop |
```

## 指揮者への接続（実証ループ）

`forgos-validation-loop-workflow` では、下流成果物が出た **直後**に本スキルを **1 ペアまたは all** で起動する。

| タイミング | 推奨ペア | 失敗時の戻し先 |
|------------|----------|----------------|
| 工程3完了後 | P23 | 工程2 |
| 工程4完了後 | P34 | 工程3 |
| 工程5完了後 | P45 | 工程4 |
| **工程6完了後** | **P56** | **工程5** |
| **工程7完了後** | **P67** | **工程6** |
| 工程8完了後 | P78 | 工程5 |
| 工程9完了後 | P89 | 工程8 または 9 |

P56・P67 は落ちやすいため **必須**。他ペアは `mode=all` で工程9前に一括再実行可。
