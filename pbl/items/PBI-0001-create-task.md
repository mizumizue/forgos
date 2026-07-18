---
id: PBI-0001
title: Member が Task を作成・一覧できる
type: feature
status: review
epic: EPIC-0001
---

# PBI-0001: Member が Task を作成・一覧できる

## 価値

最小の縦スライスで Build / TDD / Verify のデモを可能にする。

## 受入条件

- [x] 空タイトルでは作成できない
- [x] 有効タイトルで作成でき、一覧に現れる

## 参照決め事

- `specs/L3/tasks/decisions/task-creation.md`（stable）

## 関連仕様

- `specs/L3/tasks/glossary/terms.md`
- `specs/L3/tasks/actors/members.md`

## 関連コード / PR

- `examples/taskboard/`

## メモ

examples 同梱のデモ PBI。単体テスト緑。Verify デモ: `docs/examples-verify-demo.md`。人間の仕様意図レビュー待ち。
