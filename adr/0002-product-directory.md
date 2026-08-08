---
adr: 0002
status: superseded
date: 2026-07-19
superseded_by: 0011
---

# プロダクト実装を `product/` 配下に隔離する

## 文脈

スターターのルートに `apps/` / `infra/` / `sandbox/` があると、リポジトリの第一印象が「普通のアプリ雛形」になり、工程 OS（specs / pbl / .cursor）が主役に見えにくい。ソースをルートに置きたくない、という設計修正要求があった。

## 決定

1. ルートは工程・知識専用とする。
2. プロダクト実装は `product/{apps,infra,sandbox}` にフラット配置する。
3. `examples/` と `input/` はルートのまま。`examples/` 内部の `{apps,infra}` は自己完結モノレポの慣例形とし、テンプレの `product/` とは意図的に別形とする。
4. テンプレ `product/` の中身は空＋README（infra は最小スタブ）のままとする。

## 代替案

- ルートに `apps/` / `infra/` を残す（業界慣例）→ 工程 OS スターターとしての地図が弱いため不採用
- `src/` や `code/` を親名にする → 単一パッケージ連想や意味の弱さのため不採用
- examples も `product/` ミラーにする → 教材の自己完結性とコストのため不採用

## 却下理由

上記。

## 決め事への反映

`specs/L1/constitution.md` / `engineering-baseline.md`（L1 0.1.1）

## Superseded

L1 0.7.2（[ADR 0011](./0011-reverse-import-l1-0.7.2.md)）により、`product/` 配下配置は維持しつつ **内部の `apps` / `infra` 必須と `input/` は撤廃**。正は L1 憲法 §1.3–1.4 と §10（Source は `specs/inbox/`）。
