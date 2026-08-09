---
adr: 0003
status: accepted
date: 2026-08-09
---

# 運転第一ページの固定と Source の一時化、Implement↔Specify 円

評価シリーズで指摘された「正本レーンの並立」と「仕様取り込み後の二重根拠」を、レーン統合ではなく運転規則と取り込み完了条件で直す。What/How（ADR-0002）・入口分離（ADR-0001）は維持する。

## 文脈

- 決め事・PBI 対応表・quality・issue は役割分離として筋が良いが、運転時に「いま何を開くか」が分散していた。
- Source を取り込み後も残しトレースすると、L2/L3 と並立する仮仕様が残りやすい。
- 学習の結晶化は Assure Discovery → Specify があったが、Implement 中にユーザーが仕様変更を求める円が制度上あいまいだった。

## 決定

1. **レーンは減らさない。** 正本単一化は文書種の統合ではなく、**定常の運転第一ページ**の固定で行う。
2. 定常（Implement / Audit、必要なら map・cut）の第一ページは **対象決め事＋PBI 対応表**。無ければ決め事＋欠落明示。`quality/` は第一ページに入れない。`/ask-me` は分岐迷子専用。
3. **Source は Promote 前の仮仕様。** ゲート承認と L2/L3 書き込み完了の直後に削除する。Source への由来トレース（パス・リンク）は hub／L2/L3 に残さない。`sandbox/` は連動しない。
4. **結晶化・更新の正規経路:** (a) Assure Discovery → Specify 直書き (b) Implement 中のユーザー明示による Specify（Implement ↔ Specify）。いずれも Source／`/promote` ではない。初回 Source → L2/L3 のみ Promote。
5. Agent はユーザー明示なしに Implement 中へ L2/L3 を書き換えない。

## 代替案

| 案 | 却下理由 |
|----|----------|
| レーン統合（決め事・quality・hub を一枚化） | 分離の筋を捨てる代償が大きい。別ラウンド |
| Source をアーカイブ／印付きで残す | 並立正本が残り、今回の目的と逆 |
| Implement 中も Source→Promote で更新 | 仮仕様の往復が増え、削除方針と摩擦する |
| Agent がギャップを見たら自動で決め事を直す | 実装を正とした逆流に近づく |

## 決め事への反映

規範の正本は L1 0.8.5（憲法 §2・§3・§5・§7、Promote ゲート、工学 E2/E3）。案内同期は `CONTEXT.md` / `AGENTS.md` / README、skills（Implement・Specify・Assure・Promote）、rules。製品ドメイン決め事は変更しない。
