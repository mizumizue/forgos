---
name: specify
description: 実装せず仕様・PBI（必要なら ADR）を記録する。Specify モード、仕様先行、specified 完了を求めたときに使う。
---

# Specify

コードを書かず、決め事・用語・アクター・ユースケース（必要なら PBI）を残す。ADR は必須ではない（重要なら推奨し、作成はユーザー確認後）。

## ステップ

1. **レイヤと種別を決める。** L2 横断か L3 ドメインか、glossary / actors / decisions / usecases かを選ぶ。完了条件: 書き込みパスが決まっている。
2. **テンプレで書く。** 仕様は `.cursor/skills/pipeline/promote/templates/spec.md`（ユースケースは同フォルダの `usecase.md`）。PBI は `.cursor/skills/pipeline/map/templates/pbi.md`。成熟度を明示する。ユースケースは `actors`（1つ以上）も必須。完了条件: front matter に maturity がある。
3. **矛盾を列挙する。** 既存決め事との衝突を書き、未解決なら草案のまま止める。完了条件: 衝突が本文またはメモに載っている。
4. **PBI を更新する（任意）。** 仕様のみ完了なら状態を `specified` にする。実装 `done` と混同しない。完了条件: 状態が正しい、または PBI 不要と明示。
5. **ADR を提案する（任意）。** 代替案の却下理由を残す価値がある判断なら ADR を推奨し、作成するかユーザーに確認する。承認なしに新規作成しない。完了条件: 推奨しない／見送り／作成のいずれかが明示。

## セッション完了

仕様記録と成熟度があり、必要なら PBI が `specified`。

## リファレンス

- `specs/README.md`
- 仕様テンプレ: `.cursor/skills/pipeline/promote/templates/`
- ADR（任意）: `.cursor/skills/modes/steward/templates/adr.md` — 方針は `CONTEXT.md` の ADR
- PBI テンプレ: `.cursor/skills/pipeline/map/templates/pbi.md`
- モード索引: `AGENTS.md`
- 機能 PRD を取り込むなら `/promote`（`specs/L1/promote-gate.md`）
