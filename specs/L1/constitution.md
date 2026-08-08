---
layer: L1
maturity: confirmed
version: 0.7.2
editable_by_agent: false
---

# L1 憲法（メタ原則）

Agent は本ディレクトリを **Steward フロー経由以外で編集しない**。変更は人間承認後に版を上げる。

## 1. プロダクトの形

1. 本リポジトリは **リポジトリ規約** と **AI 工程 OS（Cursor 第一）** を一体にしたスターターである。
2. コア規約は特定アプリスタックに依存しない。参考実装は `examples/` に置く。
3. プロダクト実装は **`product/`** 配下に置く。リポジトリルートは工程・知識用とする。内部のディレクトリ構成（`apps` / `infra` 等）は必須ではない。
4. 探索コードは `product/sandbox/`（または draft 明示の sandbox）に置く。L3 はアプリ関心ドメインのみとし、技術領域名では切らない。横断の技術・工学規範は L2 に置く。

## 2. 正本の順位

1. **Spike** 中: 仮の正は sandbox 実装。仕様は後でよい。
2. **Promote 後〜定常**: **決め事（仕様）> ADR > コード**。PBI は要求・進捗・リンクのハブであり正本にしない。
3. **アウトプット方向**: 定常では **仕様 → 実装** のみ。実装から仕様を正として逆流させない（Spike の仮の正は Promote までの例外）。
4. **`specs/` はソースを参照しない**: `specs/` 配下の文書は、実装ソース（`product/` 配下の通常実装・sandbox を含む）へのパス・ファイル名リンクを置かない。規範の根拠を実装ファイルにしない。許可するのは他仕様・ADR・`specs/inbox`（Source）・`issues` / `pbl`（ハブ）。実装↔仕様のトレースは issue / PBI / ADR / inbox 側に置き、L2/L3 の規範本文は下を向かない。
5. **Specify**: 仕様（＋必要なら ADR/PBI）のみで完了してよい。
6. ADR は意思決定の経緯（代替案・却下理由）。規範の正本ではない。規範は決め事に書く。

## 3. 仕様レイヤ

| レイヤ | 内容 | Agent 編集 |
|--------|------|------------|
| L1 | FW 絶対原則＋工学最低ライン | 不可（Steward のみ） |
| L2 | プロダクト横断仕様 | 成熟度ルールに従う |
| L3 | アプリ関心ドメイン別 | 成熟度ルールに従う |
| inbox | 機能 PRD（Source）。Promote 前 | `/draft` で作成。L2/L3 に丸ごと置かない |

各レイヤ／ドメイン（L2/L3）は **用語 / アクター / ユースケース / 決め事** の 4 種に分ける。

## 4. 成熟度

| 成熟度 | Agent の仕様編集 | 実装 |
|--------|------------------|------|
| draft | 可（提案・抽出） | 探索のみ（通常 feature に紐づけない） |
| stable | 可（差分明示） | 通常開発可（Implement の前提） |
| confirmed | 原則不可（変更提案→人間承認、必要なら降格） | 確定仕様に従う実装可 |

実装ルール:

- 探索コードは仕様未紐づけ、または draft 明示の **sandbox**
- 通常 feature 実装は **stable 以上** の決め事にのみ紐づける

## 5. Promote ゲート

仕様昇格は **人間との対話による抽出** がゲートである。自動昇格しない。詳細は [promote-gate.md](./promote-gate.md)。

## 6. 作業モード（公式 5）

Spike / Specify / Implement / Audit / Steward。Promote（`/promote`）は独立モードにしない。詳細は `AGENTS.md` および `.cursor/skills/modes/`（Implement の TDD は `.cursor/skills/engineering/tdd/`）。

## 7. Implement と TDD

1. Implement モードでは **TDD 必須**（red → green → refactor）。
2. テストなき Implement 完了を認めない。
3. インフラ変更がある場合は、クラシック TDD ではなく先出し検証（policy / plan / 契約テスト等）を用いる。インフラ自体は必須ではない。

## 8. 人間レビュー

人間はコードレビューしない。レビュー対象は **仕様意図** と **既存仕様との整合**。

## 9. PBI

1. 単位はユーザー価値の一塊。大きいテーマは任意で薄い Epic。
2. `done` 条件と `specified`（仕様のみ完了）を混同しない。定義は `pbl/README.md`。
3. 必須リンク: 受入条件 or 参照決め事、関連仕様パス、状態。**関連コード/PR は PBI・issue 側に載せる**（`specs/` の L2/L3 本文には載せない。§2.4）。

## 10. 結合以降

結合〜UAT〜リリースは高速ループの外。保証の置き場は `quality/README.md`。hub への追記は `pbl/README.md`。強く誘導しない。ガイド用の `docs/` 文書は増やさない。
