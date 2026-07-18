# PBL / PBI

PBI は正本ではない。要求・進捗・リンクのハブ。

## 単位

- 1 PBI = ユーザー価値の一塊
- 大きいテーマは任意で薄い Epic（`pbl/epics/`）

## タイプ

| タイプ | 意味 |
|--------|------|
| `feature` | 機能 |
| `nfr` | 非機能 |
| `issue` | 課題・不具合・改善負債 |
| `chore` | FW/リポメンテ・仕様整理 |

## 状態

```text
idea → exploring → ready → doing → verify → review → done
```

仕様のみ完了は **`specified`**（実装 `done` と混同しない）。

## `done` 条件

1. 安定以上の関連決め事を満たす実装がある
2. 単体テストが緑
3. Verify（少なくとも Conform＝拡大解釈チェック）を 1 回通す
4. 人間が仕様意図レビュー済み

## 必須リンク

- 受入条件 **または** 参照決め事
- 関連仕様パス
- 関連コード / PR
- 状態

テンプレ: `docs/templates/pbi.md` / `docs/templates/epic.md`
