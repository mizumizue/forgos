---
layer: L1
maturity: confirmed
version: 0.7.2
editable_by_agent: false
---

# Promote ゲート

Spike / Implement 内で、`product/sandbox/` や対話から仕様へ昇格するときの人間ゲート。自動昇格しない。Source は `specs/inbox/<feature-slug>/spec.md`。

## 完了条件

人間が次をすべて承認したときのみ、関連仕様を draft → stable（または confirmed）へ進められる。

1. **用語**: 曖昧語がユビキタス言語として定義されている
2. **アクター**: 誰が何をするかが矛盾なく書かれている
3. **ユースケース**: 利用者導線が書かれ、対象アクター（1つ以上）が明示されている
4. **決め事**: 守る規範がテスト可能な粒度で書かれている
5. **成熟度**: draft / stable / confirmed が明示されている
6. **トレーサビリティ**: 関連 PBI・（あれば）ADR・Source（`specs/inbox/`）へのリンクがある。sandbox / 実装パスは L2/L3 に書かない（学習メモは inbox 補足または issue に残す）
7. **矛盾チェック**: 既存 L2/L3 決め事との衝突が列挙され、解消方針が決まっている

## Agent の役割

- 草案提示、矛盾・抜けの列挙、昇格候補の差分提示
- 成熟度の変更は人間が決定するまで反映しない（提案に留める）

## 人間の役割

- 抽出対話の主導、成熟度決定、昇格の最終承認
