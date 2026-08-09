---
layer: L3
domain: tasks
kind: decisions
maturity: stable
---

# タスク作成の決め事

## D1. タイトル必須

Task を作成するとき、タイトルは空であってはならない。前後空白のみも空とみなす。

## D2. タイトル長

タイトルは 1〜100 文字（トリム後）とする。

## D3. 作成 API

`POST /tasks` は有効なタイトルで 201 と Task（id, title）を返す。不正なら 400。

## D4. 一覧 API

`GET /tasks` は作成済み Task の配列を 200 で返す。
