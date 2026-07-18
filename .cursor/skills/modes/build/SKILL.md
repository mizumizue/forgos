---
name: build
description: 安定以上の仕様に従い TDD で実装する。Build モード、feature 実装、単体テスト必須の開発を求めたときに使う。
---

# Build

**stable 以上** の決め事に紐づけて実装する。TDD 必須。人間は仕様意図レビュー；コードレビュー前提にしない。

## ステップ

1. **紐づけを確認する。** 対象 PBI と、参照する stable/confirmed 決め事パスを列挙する。draft のみなら Build を止め Explore か Extract を提案する。完了条件: 安定以上の決め事パスが1つ以上ある。
2. **シームを合意する。** 公開境界を書き出し、未合意ならユーザーに確認する。完了条件: テストするシームが合意済み。
3. **`/tdd` で垂直スライスする。** red → green を1サイクルずつ。テストなき完了を宣言しない。完了条件: 関連単体が緑。
4. **リンクを更新する。** PBI の関連コード/PR・状態（doing → verify 等）を更新する。完了条件: PBI が実装を指している。
5. **Verify を提案する。** Conform（拡大解釈）少なくとも1回を勧める。完了条件: 次アクションが Verify または review と明示されている。

## リファレンス

- TDD: `/tdd`
- PBI done 条件: `docs/pbl.md`
- 工学最低ライン: `specs/L1/engineering-baseline.md`
