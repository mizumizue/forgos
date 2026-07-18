---
name: maintain-fw
description: L1・スターター骨組み・モードスキルなど FW 自体をメンテする。Maintain-FW モード、憲法改定、配布物更新を求めたときに使う。
disable-model-invocation: true
---

# Maintain-FW

FW 本体の変更。L1 の直接改変は人間承認後のみ。

## ステップ

1. **変更対象を分類する。** L1 / docs / skills / template / examples / 配布。完了条件: 対象パス一覧がある。
2. **L1 変更なら提案から入る。** 差分案を示し、承認前に `specs/L1/` を書き換えてコミットしない。完了条件: 承認状態が明示されている（未承認ならここで止める）。
3. **版を上げる。** L1 変更時は `specs/L1/VERSION` と各 L1 ファイルの version を揃える。完了条件: VERSION と front matter が一致。
4. **整合を取る。** `AGENTS.md` / `CONTEXT.md` / `docs/*` / モードスキルを同期する。完了条件: 案内と実体が矛盾していない。
5. **記録する。** ADR または Maintain 用 PBI（chore）に変更理由を残す。完了条件: 経緯が git 履歴以外にも残っている。

## リファレンス

- L1: `specs/L1/`
- モード: `docs/modes.md`
