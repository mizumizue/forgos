# Agent 向けメモ

このリポジトリは **ForgOS**（AI 工程 OS スターター）である（リポジトリ規約 ＋ Cursor 第一の工程 OS）。

作業開始前に [CONTEXT.md](./CONTEXT.md) と [specs/L1/constitution.md](./specs/L1/constitution.md) を読む。

どのモード／スキルを使うか迷ったら **`/ask-me`**（`.cursor/skills/ask-me/`。ルーター。ADR 0008）。

## モードで開始する

開始時はスキル名ではなく **モード** を選ぶ。完了条件の詳細は各モード skill（Implement は `/tdd` も参照）。

| やりたいこと | モード | 起動 | セッション完了の目安 |
|--------------|--------|------|----------------------|
| あいまい探索・スパイク | Spike | `/spike` | sandbox と学習メモ／仮説の更新 |
| 安定仕様の実装（TDD） | Implement | `/implement`（TDD: `/tdd`） | TDD サイクルと単体緑、関連リンク更新 |
| 仕様だけ書く | Specify | `/specify` | 仕様記録と成熟度、必要なら PBI `specified` |
| 乖離・拡大解釈チェック | Audit | `/audit` | 指摘リストと次アクション（active 保証があれば `/assure`） |
| FW 自体のメンテ | Steward | `/steward` | L1/スキル等の変更と版の記録 |

Promote（仕様昇格）は独立モードではない。`specs/inbox` の PRD を L2/L3 へ取り込むときは `/promote`（Audit 必須・人間ゲート）。ゲート定義は `specs/L1/promote-gate.md`。

**モード外スキル:** Implement の TDD は `/tdd`。Coverage（仕様→保証）と Discovery（specs 外保証）の実現点検は `/assure`（`.cursor/skills/engineering/assure/`。ADR 0007／0010）。

スタック未決で default example からプロダクトリポへ仕立てる場合（モード外）: `/bootstrap-product`（破壊的・ユーザー起動のみ）。

### モード選択（早見）

- 要件が曖昧で触って学びたい → Spike
- 安定仕様があり実装する → Implement（TDD: `/tdd`）
- 先に仕様だけ固めたい → Specify
- 「仕様どおりか」「やりすぎていないか」を点検 → Audit
- 「仕様が保証に載っているか／保証が実現されているか」を点検 → `/assure`（モード外）
- どれを起動すべきか迷う → `/ask-me`（ルーター）
- `specs/inbox` の PRD を L2/L3 に取り込む → `/promote`（モード外・人間ゲート）
- default example でプロダクト用に仕立てる → `/bootstrap-product`
- この FW 自体を直す → Steward

### パイプライン（成果物の流れ）

```text
/draft → /promote → /map → /cut → /implement → /audit（→ /assure）
 (inbox)   (L2/L3)   (pbl)  (issues)  (product)
```

| 起動 | 正本 |
|------|------|
| `/draft` | `.cursor/skills/pipeline/draft/` → `specs/inbox/` |
| `/promote` | `.cursor/skills/pipeline/promote/` |
| `/map` | `.cursor/skills/pipeline/map/`（issue 規約: `issue-tracker.md`） |
| `/cut` | `.cursor/skills/pipeline/cut/` |
| `/assure` | `.cursor/skills/engineering/assure/` → `specs/`（Coverage）+ `quality/`（catalog／実現） |
| `/ask-me` | `.cursor/skills/ask-me/`（ルーター。モード・パイプライン案内） |

hub の説明: `pbl/README.md`

## 編集制約（要約）

- **L1 は編集しない**（Steward で提案のみ）
- 通常実装は **stable 以上** の決め事に紐づける（**仕様 → 実装**）
- **L2/L3 からソースを参照しない**（関連コードは hub＝PBI / issue。L1 憲法 §2.4）
- **issue は原則 PBI から切る**（Issue 先行可。後から PBI に対応だけ載せる）
- 探索コードは `sandbox/`（または draft 明示）
- 秘密情報をログ・コミット・仕様に出さない
- Implement 完了に単体テスト緑が必須
- **`docs/` にガイドを増やさない** — 領域 README、または rules / skills（framework ルール 9 / L1 憲法 §10）

## ディレクトリ

| パス | 役割 |
|------|------|
| `specs/` | 仕様（L1/L2/L3）と `inbox/`（機能 PRD＝Source） |
| `quality/` | 実装後に保証する挙動・品質（単体／結合／システム。機能・非機能） |
| `issues/` | 実装イシュー（`backlog` / `active` / `pending_sync` / `completed`） |
| `adr/` | 意思決定の経緯（**必須ではない**。重要なら推奨→ユーザー確認。`CONTEXT.md`） |
| `pbl/` | PBI / Epic（**hub**: `specs/` ↔ `product/`。マップ正本は対応表・ADR 0009） |
| `product/` | プロダクト実装（内部構成は任意。`apps` / `infra` 等は必須ではない） |
| `sandbox/` | 探索用コード |
| `examples/` | 参考実装（Bootstrap 前の default。コア規約はスタック非依存） |
| `docs/` | **ガイド置き場にしない**（framework ルール 9）。運用記録が必要なら人間が最小限 |

テンプレのプロダクト置き場は `product/` 配下。L3 の第一軸はアプリ関心ドメイン（例: `specs/L3/tasks/`）。技術横断は L2。`examples/` 内部のレイアウトはテンプレ地図と意図的に別形でよい。

詳細: `specs/README.md` / `quality/README.md` / `pbl/README.md`（PBI マップ＝規範 ID 対応表）。モード手順は上記および `.cursor/skills/modes/`。迷いどころは `/ask-me`。

### Domain（調査時）

- 読む: `CONTEXT.md`、関係する `adr/`、規範は `specs/**/decisions/`、導線は `specs/**/usecases/`
- 欠如しても黙って続行。先回り作成を提案しない
- 用語は `CONTEXT.md` / `specs/**/glossary/` に合わせる。ADR と矛盾する出力は明示する
