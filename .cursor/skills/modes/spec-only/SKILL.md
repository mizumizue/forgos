---
name: spec-only
description: 実装せず仕様・PBI・ADR だけを記録する。Spec-only モード、仕様先行、specified 完了を求めたときに使う。
---

# Spec-only

コードを書かず、決め事・用語・アクター（必要なら PBI/ADR）を残す。

## ステップ

1. **レイヤと種別を決める。** L2 横断か L3 ドメインか、glossary / actors / decisions かを選ぶ。完了条件: 書き込みパスが決まっている。
2. **テンプレで書く。** `docs/templates/spec.md`（ADR/PBI も同様）。成熟度を明示する。完了条件: front matter に maturity がある。
3. **矛盾を列挙する。** 既存決め事との衝突を書き、未解決なら草案のまま止める。完了条件: 衝突が本文またはメモに載っている。
4. **PBI を更新する（任意）。** 仕様のみ完了なら状態を `specified` にする。実装 `done` と混同しない。完了条件: 状態が正しい、または PBI 不要と明示。

## リファレンス

- `docs/spec-model.md`
- Extract が必要なら `specs/L1/extract-gate.md`
