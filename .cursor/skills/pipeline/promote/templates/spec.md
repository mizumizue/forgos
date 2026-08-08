---
layer: L2 # or L3
# domain: example   # L3 のとき
kind: glossary # or actors | decisions | usecases
maturity: draft # draft | stable | confirmed
---

# タイトル

## 本文

（用語定義 / アクター責務 / 決め事の条文）

ユースケース（`kind: usecases`）を書くときは本ファイルではなく **同フォルダの `usecase.md`** を使う。`actors`（1つ以上）が必須。

## 関連

（`specs/` から実装ソース・`product/` パスは参照しない。L1 憲法 §2.4）

- Source:    # `specs/inbox/<feature-slug>/spec.md`
- PBI:       # または Issue:
- ADR:
- 決め事:    # 他仕様のみ
- 用語:
