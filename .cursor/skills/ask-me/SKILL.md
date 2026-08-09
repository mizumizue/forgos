---
name: ask-me
description: このリポのモード・パイプライン・モード外スキルの案内。どれを起動すべきか迷ったときに使う。
disable-model-invocation: true
---

# スキル案内（ForgOS）

モードとスキルをすべて覚えなくてよい。ここで経路を選ぶ。

このスキルは**ルーター**である: 到達先の名前とタイミングを示すだけ。ユーザー起動スキルを代理実行はできない — 案内後、ユーザーが該当名を入力する（またはモデル起動スキルならエージェントが続く）。

作業開始前の共通前提: [CONTEXT.md](../../../CONTEXT.md) と [specs/L1/constitution.md](../../../specs/L1/constitution.md)。索引の正本は [AGENTS.md](../../../AGENTS.md)。

## メインフロー: 機能 PRD → 実装 → 点検

成果物が流れる経路。機能を inbox から製品へ載せるとき。

1. **`/draft`** — 機能 PRD を `specs/inbox/<feature-slug>/spec.md` に書く。L2/L3 に PRD を丸ごと置かない。
2. **`/promote`** — Audit 後、inbox を L2/L3（glossary / actors / decisions / usecases）へ取り込む。人間ゲート。独立モードではない。
3. **`/map`** — 仕様から PBI／Epic を `pbl/` に載せる（hub）。マップは規範 ID 対応表必須（ADR 0009）。
4. **`/cut`** — PBI から issue を `issues/backlog/` に切る。
5. **`/implement`** — stable 以上の決め事に紐づけて実装。内部で **`/tdd`**（赤→緑）。
6. **`/audit`** — specs ↔ 実装の Gap / Conform / Baseline。範囲に `quality/` の `status: active` があれば続けて **`/assure`**。

```text
/draft → /promote → /map → /cut → /implement → /audit（→ /assure）
```

## 合流点（モード）

メインフローに乗る前の作業姿勢。開始時はここから選ぶことが多い。

| やりたいこと | 起動 | メモ |
|--------------|------|------|
| あいまい → sandbox で触って学ぶ | `/spike` | 仕様は後。正は一時的に sandbox |
| 実装せず仕様・PBI・ADR だけ | `/specify` | `specified` までで止めてよい |
| 安定仕様に従い実装 | `/implement` | TDD は `/tdd` |
| 仕様どおりか・やりすぎていないか | `/audit` | 品質実現は `/assure` |
| FW（L1・スキル・骨組み）を直す | `/steward` | L1 は提案→人間承認 |

## モード外スキル

公式5モードではないが、メインフローから到達する。

| 起動 | いつ |
|------|------|
| `/tdd` | Implement 中のテストファースト手順 |
| `/assure` | Coverage（L2/L3→保証）と Discovery（specs 外）の証拠・実行 |
| `/promote` | inbox → L2/L3（上記メインフロー） |
| `/draft` `/map` `/cut` | パイプライン各段 |
| `/bootstrap-product` | default example でプロダクト用に仕立てる（破壊的・一度きり） |

## 置き場の早見

| 正本 | パス |
|------|------|
| 仕様 | `specs/`（inbox / L2 / L3） |
| 品質保証 | `quality/`（合格条件の読み場: `<layer>/catalog.md`。点検は `/assure`） |
| hub | `pbl/`（説明: `pbl/README.md`） |
| issue | `issues/` |
| 実装 | `product/`（探索は `sandbox/`） |
| 参考実装 | `examples/`（Bootstrap 前） |
| 経緯（任意） | `adr/`（必須ではない。推奨→ユーザー確認） |

## 使わない／旧名

- `explore` / `build` / `spec-only` / `maintain-fw` / `verify` / `to-pbl` / `extract` — 旧名または別名残骸。正は Spike / Implement / Specify / Steward / Audit / map・draft・promote 系

## 迷ったら

1. 要件が曖昧 → `/spike`
2. 仕様だけ固めたい → `/specify` または `/draft`
3. 実装する → `/implement`（`/tdd`）
4. 仕様と実装の点検 → `/audit`
5. 仕様の保証 Coverage／品質実現 → `/assure`
6. example からプロダクト化 → `/bootstrap-product`
7. FW 自体 → `/steward`
8. どれか不明 → このスキルの表をユーザーに見せ、一文で目的を聞き直す
