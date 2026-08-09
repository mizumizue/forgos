---
name: specify
description: 実装せず L2/L3 に仕様・PBI を記録する。Specify モード、仕様先行、specified 完了を求めたときに使う。
---

# Specify

コードを書かず、**L2/L3** に決め事・用語・アクター・ユースケース（必要なら PBI）を残す。Source を経由しない入口（`/spec-source` はフロー側・PRD 用）。経緯（`adr/`）は必須ではない（重要なら推奨し、作成はユーザー確認後）。

## ステップ

1. **レイヤと種別を決める。** L2 横断か L3 ドメインか、glossary / actors / decisions / usecases かを選ぶ。完了条件: 書き込みパスが決まっている。
2. **テンプレで書く。** 仕様は `.cursor/skills/pipeline/promote/templates/spec.md`（ユースケースは同フォルダの `usecase.md`）。PBI は `.cursor/skills/pipeline/map/templates/pbi.md`。決め事は What（ドメイン規則・受入境界・契約・Why）に留め、How・内部構造・手順は書かない（憲法 §2.7）。成熟度を明示する。ユースケースは `actors`（1つ以上）も必須。完了条件: front matter に maturity があり、書く／書かないに反する条がない。
3. **矛盾を列挙する。** 既存決め事との衝突を書き、未解決なら草案のまま止める。confirmed と競合する場合は仕様を変えずユーザーに検討を求める（L1 §4）。完了条件: 衝突が本文またはメモに載っている。
4. **PBI を更新する（任意）。** 仕様のみ完了なら状態を `specified` にする。実装 `done` と混同しない。完了条件: 状態が正しい、または PBI 不要と明示。
5. **経緯記録を提案する（任意）。** 代替案の却下理由を残す価値がある判断なら `adr/` への記録を推奨し、作成するかユーザーに確認する。承認なしに新規作成しない。完了条件: 推奨しない／見送り／作成のいずれかが明示。

## セッション完了

仕様記録と成熟度があり、必要なら PBI が `specified`。L2/L3 に書いたら `product/` 実装は成熟度 draft でも可（`done` は stable 以上）。

## リファレンス

- `specs/README.md`
- 仕様テンプレ: `.cursor/skills/pipeline/promote/templates/`
- 経緯テンプレ（任意）: `.cursor/skills/modes/steward/templates/adr.md`
- PBI テンプレ: `.cursor/skills/pipeline/map/templates/pbi.md`
- モード索引: `AGENTS.md`
- 機能 PRD を取り込むなら `/promote`（`specs/L1/promote-gate.md`）
- 粗い Source から試すなら `/spike`（＋ `/spec-source`）
