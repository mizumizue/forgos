# 作業モード

公式モードは 5 つ。開始時は「どのスキルか」ではなく **どのモードか** を選ぶ。

| モード | 目的 | スキル |
|--------|------|--------|
| **Explore** | あいまい → プロトタイプ。sandbox。仕様は後 | `/explore` |
| **Build** | 安定以上の仕様に従い実装 ＋ TDD ＋ 単体 | `/build` |
| **Spec-only** | 実装せず仕様（と必要なら PBI/ADR）のみ | `/spec-only` |
| **Maintain-FW** | L1・スターター・配布スキル等の FW メンテ | `/maintain-fw` |
| **Verify** | 仕様↔実装乖離と拡大解釈の指摘リスト | `/verify` |

**Extract** は独立モードではない。Explore / Build 内の人間対話ゲート（`specs/L1/extract-gate.md`）。

## セッション完了の目安

| モード | 完了の目安 |
|--------|------------|
| Explore | sandbox と学習メモ／仮説の更新 |
| Build | TDD サイクルと単体緑、関連リンク更新 |
| Spec-only | 仕様記録と成熟度、必要なら PBI `specified` |
| Verify | 指摘リストと次アクション |
| Maintain-FW | L1/スキル等の変更と版の記録 |

## モード選択の早見

- 要件が曖昧で触って学びたい → Explore
- 安定仕様があり実装する → Build
- 先に仕様だけ固めたい → Spec-only
- 「仕様どおりか」「やりすぎていないか」を点検 → Verify
- この FW 自体を直す → Maintain-FW
