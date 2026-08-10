# 個人向け家計簿（デモ版）

L3 `specs/L3/kakeibo/` に紐づく画面付きデモ。ドメイン台帳はインメモリ。単体は Vitest。

## セットアップ

```bash
cd product/apps/kakeibo
npm install
npm test
npm run dev
```

## 画面操作パス（UC1→UC4）

1. **口座** → 名称を入力して登録（空は拒否）
2. **カテゴリ** → 名称と向き（収入／支出）を登録
3. **取引** → 下書き登録 → **確定**（必要なら **取消**）。一覧で状態・収支の視覚差を確認
4. **月次予算** → 対象月の金額を保存
5. **月次サマリー** → 対象月の切替と予算消化状態（余裕／逼迫／超過／未設定）＋進捗バー

## 紐づけ

- 決め事: `specs/L3/kakeibo/decisions/`
- PBI: PBI-0002〜0005
- issue: `issues/*/personal-kakeibo-0*.md`
