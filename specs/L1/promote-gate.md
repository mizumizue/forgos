---
layer: L1
maturity: confirmed
version: 0.8.4
editable_by_agent: false
---

# Promote ゲート

Sourceを L2/L3 へ取り込む人間ゲート。自動昇格しない。Spike（sandbox 試し）や対話からの昇格もここを通る。Source は `specs/source/<feature-slug>/spec.md`。Promote 後は L2/L3 に紐づく実装を `product/` に置ける（成熟度 draft でも可。`done` は stable 以上）。

## 完了条件

人間が次をすべて承認したときのみ、関連仕様を draft → stable（または confirmed）へ進められる。

1. **用語**: 曖昧語がユビキタス言語として定義されている
2. **アクター**: 誰が何をするかが矛盾なく書かれている
3. **ユースケース**: 利用者導線が書かれ、対象アクター（1つ以上）が明示されている
4. **決め事**: 守る規範がテスト可能な粒度で書かれている。What（ドメイン規則・受入境界・契約・Why）に留め、How・内部構造・作業手順は書かない（憲法 §2.7）
5. **成熟度**: draft / stable / confirmed が明示されている
6. **トレーサビリティ**: 関連 PBI・Source（`specs/source/`）へのリンクがある。sandbox / 実装パスは L2/L3 に書かない（学習メモは Source 補足または issue に残す）
7. **矛盾チェック**: 既存 L2/L3 決め事との衝突が列挙され、解消方針が決まっている

## Agent の役割

- 草案提示、矛盾・抜けの列挙、昇格候補の差分提示
- 成熟度の変更は人間が決定するまで反映しない（提案に留める）

## 人間の役割

- 抽出対話の主導、成熟度決定、昇格の最終承認
