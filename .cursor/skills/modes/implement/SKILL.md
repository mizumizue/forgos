---
name: implement
description: 安定仕様に従い TDD で実装する。Implement モード、機能実装、バグ修正を求めたときに使う。
---

# Implement

**stable 以上**の決め事に紐づけて実装する。アプリ／CI の「ビルド」ではない。手順の正本は TDD スキル。

## ステップ

1. **紐づけを固定する。** 対象の決め事（stable 以上）と issue／PBI を一文で書く。完了条件: 仕様パスと作業単位が明示されている。
2. **TDD を回す。** `.cursor/skills/engineering/tdd/SKILL.md` に従う（公開インターフェース確認 → red → green）。完了条件: 関連単体が緑。
3. **マップを更新する。** 関連 PBI／issue のコード・PR・状態リンクを更新する。`specs/` の L2/L3 本文に実装パスを書かない。完了条件: hub／issue から実装へ辿れる。

## セッション完了

TDD サイクルと単体緑、関連リンク更新。

## リファレンス

- TDD: `.cursor/skills/engineering/tdd/SKILL.md`
- モード索引: `AGENTS.md`
- L1 E4: `specs/L1/engineering-baseline.md`
