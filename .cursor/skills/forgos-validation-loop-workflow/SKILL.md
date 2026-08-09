---
name: forgos-validation-loop-workflow
description: ForgOS パイプラインでテーマ開発を回し、FW 実証の累積ログと改善バックログを残す（人間承認なしの正式アプリ経路）。
disable-model-invocation: true
---

# ForgOS 実証ループ（validation）

適当なテーマで ForgOS の正規パイプラインを通し、**シリーズ全体の累積ログ＋改善バックログ**を育てる。  
「モック」は人間承認を外した運用名であり、成果物は ForgOS 定義の正式アプリ経路（`specs/` → `pbl/` → `issues/` → `product/` 等）に置く。完璧な UI／全機能は不要。ループが止まらない範囲で、実テーマに即した主要ユースケースを通す。

**テーマ未指定:** 起動時にテーマが無い／曖昧なら、工程1の前に指揮者がユーザーへヒアリングする（質問は1つずつ）。勝手にテーマを確定して工程に入らない。指定済みならヒアリングを省略してよい。

対象リポジトリ: ForgOS ルート（例: 作業ツリーの `forgos`）。工程スキルはリポ内 `.cursor/skills/`（`spike` / `promote` / `map` / `cut` / `implement` / `audit`）を優先する。

主エージェントは **指揮者**。実作業は工程ごとの SubAgent。  
- 指揮: [`../loop-workflow/ORCHESTRATION.md`](../loop-workflow/ORCHESTRATION.md)  
- 実行手段: [`../loop-workflow/STAGE-EXEC.md`](../loop-workflow/STAGE-EXEC.md)  
- スキル利用不可時は `STAGE-EXEC.md` に従い **loop-eng 代用**（工程表のフォールバック型）

ペルソナ既定は空（工程表は `—`）。

## 工程表

| # | 工程 | 入力 | 出力 | 実行手段 | 型 | フォールバック型 | ペルソナ | Verifier（ゲート） | Stop（上限つき） |
|---|------|------|------|----------|----|------------------|----------|--------------------|------------------|
| 1 | テーマ／スコープ固定 | ユーザー指定テーマ、または指揮者ヒアリングで得たテーマ方針。前回の `quality/fw-validation/` ログ・改善バックログ（あれば） | `quality/fw-validation/runs/<run-id>/scope.md` | `loop-eng` | `EO` | — | — | ルーブリック: (1) 当該 `scope.md` が存在する (2) テーマが1文である（ユーザー指定またはヒアリング結果に整合） (3) スコープ外（やらないこと）が1項目以上ある — すべて Yes | 再起草上限 3 |
| 2 | Spike（テーマ類推＋Source） | `scope.md` | `specs/source/<feature-slug>/spec.md`（sandbox は任意） | `skill:spike` | — | `EO` | — | `spike` 完了＝ゲート。かつ Source に (1) テーマ1文 (2) 「ユーザー要求としてありそう」な根拠が1段落以上 — 両方 Yes | Spike やり直し上限 2／Source 改稿上限 3 |
| 3 | Promote | `specs/source/<feature-slug>/` | L2/L3 決め事、Source 削除、`quality/fw-validation/runs/<run-id>/promote-check.md` | `skill:promote` | — | `EO` | — | `promote` 完了＝ゲート。かつ (1) `promote-check.md` に取り込み可否の自動点検結果がある (2) 対象が L2/L3 に取り込まれている (3) 当該 Source ディレクトリが削除されている — すべて Yes。※本ループでは人間ゲートを点検ログで代行する | 点検やり直し上限 2／取り込み上限 2 |
| 4 | map／cut | L2/L3 決め事 | `pbl/` の PBI（＋必要なら Epic）、`issues/` の issue、対応が辿れること | `skill:map`（同一作業者セッションで `skill:cut`） | — | `EO` | — | `map` 完了＝ゲート、かつ同一セッションで `cut` 完了＝ゲート。ルーブリック: (1) PBI が `pbl/` にある (2) 実装用 issue が `issues/` にある (3) PBI↔決め事または PBI↔issue の対応が文書上辿れる — すべて Yes | map 上限 2／cut 上限 2 |
| 5 | Implement | issue ＋ L2/L3 | `product/` の本実装、単体テスト緑 | `skill:implement` | — | `RGR` | — | `implement` 完了＝ゲート。かつ (1) 単体テスト実行が緑 (2) テーマの主要ユースケース1本以上が決め事どおり動く根拠が完了報告にある — 両方 Yes | 赤緑サイクル上限 8／フルテスト実行上限 2 |
| 6 | Audit | 決め事＋`product/` | 指摘リスト；重大指摘は Implement へ戻して修正し、記録を `adr/` に残す | `skill:audit` | — | `EO` | — | `audit` 完了＝ゲート。かつ次のいずれか: (A) 重大指摘なし、または (B) Implement へ巻き戻し（提案＋一言承認）後に修正済みで、当該修正の ADR が `adr/` にある | Audit 上限 2／戻し修復ラウンド上限 1（要一言承認） |
| 7 | 実証ログ | 工程 1–6 の成果とゲート結果 | `quality/fw-validation/runs/<run-id>/run-log.md`、改善があれば `quality/fw-validation/backlog.md` 追記 | `loop-eng` | `EO` | — | — | ルーブリック: (1) `run-log.md` にテーマ・通った工程・詰まり・所見がある (2) 改善事項があれば `backlog.md` に追記されている（無ければ「改善なし」と run-log に明記） — すべて Yes | 追記上限 2 |

- 実行手段: `skill:<name>` または `loop-eng`  
- 型: loop-eng のとき必須。スキル時は `—`  
- フォールバック型: skill のとき必須扱い。スキルが使えないときはこの型で loop-eng 代用（`STAGE-EXEC.md`）  
- ペルソナ: 既定 `—`（空）  
- Verifier: 曖昧な「品質確認」禁止。スキル時は「skill 完了＝ゲート」＋上表の追記条件  

### シリーズ成果（複数 run）

- 累積: `quality/fw-validation/runs/*/run-log.md`  
- 改善バックログ: `quality/fw-validation/backlog.md`  
- アプリ経路の成果は各 run の正規パスに残る（削除しない。次テーマで衝突するときだけ指揮者メタで run-id／slug を分離）

## つなぎ

- 前工程の Verifier 通過まで次へ進まない  
- 引き継ぎは成果物パス＋短いメモ  
- 前提崩れ時は戻る工程を提案し、一言承認してから巻き戻す  
- スキル利用不可時はゲートログに理由を1行残し、フォールバック型で loop-eng 代用する  

## 手順（指揮者）

1. 必要なら最終成果を一文確認する（累積ログ＋改善バックログ；アプリは正式経路・主要 UC まで）  
2. **テーマ:** 起動プロンプト等にテーマが無い／曖昧なら、工程1の前にユーザーへヒアリング（1問ずつ）。テーマ方針が言えるまで工程 SubAgent を起動しない。指定済みなら省略可  
3. 工程表が未承認なら `STAGE-EXEC.md` に従い実行手段を提案し一言承認する  
4. メタのみ: `quality/fw-validation/runs/<run-id>/` など空ディレクトリとゲートログ枠を用意する（中身の実作業は書かない）  
5. 各工程: 指示書を書く（工程名、入力、出力パス、実行手段、型または skill、フォールバック型、Verifier、Stop、Leash、ペルソナ `—`）。**作業者 SubAgent のみ**に実行させる。工程1の入力にヒアリング結果または指定テーマを載せる  
6. 作業者は `skill:*` なら該当 `SKILL.md`、不可ならフォールバックの `loop-eng`＋型に従う。指揮者は成果物の中身を書かない（ヒアリングとゲート判定は指揮者のメタ）  
7. ゲート判定・次へ／戻る／停止だけを行う  
8. run 完了後、累積ログと backlog のパスを報告する。続けて次テーマへ回すかはユーザーに確認する（次 run でもテーマ未指定なら再度ヒアリング）  

## 完了基準

- [ ] 指揮者が実作業をしていない  
- [ ] 全工程（または承認された中断点）のゲートを記録した  
- [ ] 最終成果物パス（少なくとも当該 `run-log.md`、あれば `backlog.md`、主要アプリ成果のパス）を報告した  
