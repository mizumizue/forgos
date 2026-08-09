---
id: PBI-0001
title: Member が Task を作成・一覧できる
type: feature
status: review
epic: EPIC-0001
---

# PBI-0001: Member が Task を作成・一覧できる

## 価値

最小の縦スライスで Implement / TDD / Audit のデモを可能にする。

## 受入条件

- [x] （AC-1）空タイトルでは作成できない
- [x] （AC-2）有効タイトルで作成でき、一覧に現れる

## マップ

### 対応表（必須）

規範アンカー: `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。状態: `covered` | `partial` | `gap`。

| 規範 | 証拠 | issue | 状態 |
|------|------|--------|------|
| task-creation#D1–D4（作成・一覧の決め事） | `examples/taskboard/` 配下の domain / API テスト | — | covered |
| AC-1 空タイトル拒否 | 同上 | — | covered |
| AC-2 作成・一覧 | 同上 | — | covered |

### 補助一覧

関連仕様パス:

- `specs/L3/tasks/decisions/task-creation.md`（stable）
- `specs/L3/tasks/glossary/terms.md`
- `specs/L3/tasks/actors/members.md`

関連コード / PR:

- `examples/taskboard/`

関連 issue:

- —

## メモ

examples 同梱のデモ PBI。単体テスト緑。Audit デモ: `examples/taskboard/AUDIT-DEMO.md`。人間の仕様意図レビュー待ち。
