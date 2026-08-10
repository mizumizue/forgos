---
layer: L3
domain: lesson-studio
kind: decisions
maturity: draft
---

# 対象外の決め事

本ドメイン `lesson-studio` では次を扱わない。

## 決済・請求

- 月謝・決済・請求書発行・口座振替の本実装
- TuitionLedger（月謝台帳）— 在籍状態（active／paused／withdrawn）の表示のみで代替

## 組織・拡張

- 複数講師・複数教室・チェーン横断のスケジュール統合
- SubstituteTeacherShift（代講シフト）

## コンテンツ・販売

- オンライン指導・レッスン動画配信・楽譜販売
- 発表会・コンクール・検定イベントの本格運営
- 楽器レンタル在庫・販売管理

## 通知・予約形態

- SMS／メール／LINE によるリマインド配信の本実装（ContactChannel は申告記録のみ）
- FreeBookingPass（任意曜日の都度予約）
- SoloMakeupSlot（欠席者のみの個別振替枠の自動生成）

## 見送り概念（brief 帰結）

| 概念 | 見送り理由 |
|------|------------|
| TuitionLedger | 決済スコープ外 |
| SoloMakeupSlot | グループ単独振替不可（T3） |
| SubstituteTeacherShift | 1講師前提 |
| FreeBookingPass | 週固定枠・月謝制と両立しない |

## 関連

- 決め事: `decisions/scheduling-rules.md`
- 用語: `glossary/terms.md`
