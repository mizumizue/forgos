---
adr: 0005
status: superseded
date: 2026-07-19
superseded_by: 0011
---

# L1 工学最低ラインを 0.2.0 に拡充する（E6–E11）

## 文脈

L1 の実務制約が薄く、アプリ実装・インフラ構築で Agent が踏みやすい穴（入力・認可・エラー秘匿・環境・コンソール変更・破壊的変更）を Verify しにくかった。

## 決定

1. `engineering-baseline.md` に E6–E11 を追加し、L1 を **0.2.0** とする。
2. 詳細は L2 draft（`application-engineering.md` / `infrastructure-engineering.md`）に委任する。
3. Verify スキルに E1–E11 の Baseline チェックを明示する。
4. 観測の L1 追加や L2 の中身の充実は後続とする。

## 代替案

- すべて L1 に詳細まで書く → 最低ラインが肥大しスタック仮定が混入しやすいため不採用
- すべて L2 のみ → 歯が弱く、今回の「実務制約を足したい」に不足のため不採用

## 却下理由

上記。

## 決め事への反映

- L1: `specs/L1/engineering-baseline.md`（E6–E11）、`VERSION` 0.2.0
- L2 draft: `specs/L2/decisions/application-engineering.md`, `infrastructure-engineering.md`

## Superseded

L1 **0.7.2**（[ADR 0011](./0011-reverse-import-l1-0.7.2.md)）が工学最低ラインとモード名（Audit 等）の正本。本 ADR の 0.2.0 拡充内容は後継 L1 に吸収済み。
