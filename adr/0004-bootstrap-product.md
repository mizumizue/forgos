---
adr: 0004
status: accepted
date: 2026-07-19
---

# `/bootstrap-product` でリポジトリをプロダクト用に仕立てる

## 文脈

技術スタックに拘りがない利用者が、ForgOS スターターからすぐ実装を始められる道が欲しい。空の `product/` スケルトン埋めではなく、default example の構成でリポジトリ自体をプロダクト化する。

## 決定

1. 公式5モードの外に、ユーザー起動専用スキル `/bootstrap-product` を置く。
2. default example（現行 `examples/taskboard`）を `product/` へ展開する。
3. セットアップ時に `examples/` とデモ L3/PBI/Epic 等を削除する。
4. README はプロダクト入口に差し替える。工程 OS（L1・モード）は残す。
5. モデル起動はしない（破壊的のため）。

## 代替案

- Build/Explore に内包 → モードの完了条件が濁るため不採用
- examples を開発入口のまま残す → product 地図と矛盾するため不採用
- スキル内にスタック定義を複製 → examples との二重管理になるため不採用

## 却下理由

上記。

## 決め事への反映

L1 のモード定義は変更しない（スタンドアロン）。手順の正本は `.cursor/skills/bootstrap-product/`。
