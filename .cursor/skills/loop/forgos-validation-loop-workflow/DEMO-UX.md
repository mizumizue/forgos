# Demo UX ルーブリック（実証ループ・開示参照）

ForgOS 本体には書かない。検証オーバーレイの **調査分析／仕様深度／デザイン／デモ操作** の正本。  
指揮者と作業者は該当工程の Verifier でここを Yes/No する。

**Leading words:** **sector brief** · **spec depth** · **actor-split** · **demo-seeded** · **surface budget** · **attention stack** · **design call**

深さの専用スキル（工程2–4）:

| 工程 | スキル | 成果 | ゲート |
|------|--------|------|--------|
| 2 | `sector-research-loop` | `sector-brief.md` | V1–V6 |
| 3 | `spec-depth-loop` | `spec-depth.md` | D1–D6 |
| 4 | `mock-design-loop` | `design-call.md` | C1–C9（画面遷移含む） |

スキル側ルーブリックが正。ここは統合・後工程用の要約と Scope／Source／Implement／Audit の Yes/No。

## ねらい

テーマ語の連想や汎用 CRUD では仕様が甘い。業務アプリでは調査→仕様深度→design call を先に行い、その帰結として scope／Source／実装を進める。  
人間に確認せず **AI が調べて決める**。薄い作文はゲート不合格。

## sector brief（工程2）

業務・業界・顧客対応・社内オペなどがテーマに含まれる（または業務アプリと読める）とき必須。非業務と明示できるテーマだけ「非該当＋理由」で免除（その場合も工程2で免除理由を `sector-brief.md` または gate-log に残す）。

### 調査のやり方（甘さを止める）

- 公開情報・業界通例・典型オペを **当たる**（Web 検索可）。事実と推測を **分けて書く**
- 業種・提供形態・規模を **当該システム向けに1つに絞る**。「サービス業」「一般的な業務」止まりは No
- 推測だけで「この領域では必ず〜」と断定したら不合格。根拠または「通例としての仮説」ラベルが必要
- actors・骨格・design call・demo-seeded は **sector brief の帰結**として書く

### brief に最低限そろえる欄（欠けると No）

| 欄 | 合格の目安 |
|----|------------|
| **領域／形態** | 何のシステムか具体。抽象カテゴリ単独は不可 |
| **利用者属性** | 誰が主に使い、何を重視するか ≥2 |
| **現場／業務オペ** | 一日の流れ・ボトルネック ≥2 |
| **差別化しない通例** | 当たり前なこと ≥3（table stakes の種） |
| **スコープに落とす帰結** | actors・主ジョブ・骨格候補への対応表 |

作文チェック: 抽象語だけで固有オペに触れなければ再起草。詳細合否はスキル V1–V6。

## spec depth（工程3）

`spec-depth.md` が D1–D6 を満たすこと。要点:

- 役 ≥2・権限差の表
- 可変境界を **当該システム向けに命名**（外部ラベルの決め打ち禁止）
- 主WFの決定項目・状態遷移 ≥2
- 概念 ≥5・採用／見送り

## design call（工程4）

`design-call.md` が C1–C9 を満たすこと。要点:

- 主表面ごとの attention／情報主従
- 通例 UI 参照 ≥2・見た目要素 ≥3
- actor-split 反映・汎用スキン禁止
- **主要ジョブの画面遷移列**（分岐・戻る含む）

L2/L3 には usability／行為の **What のみ**。見た目 How は design-call／issue／Implement。

## Scope（工程5・統合）

`scope.md` に次がすべて載っていること。中身は工程2–4から統合し、矛盾させない。

| ID | 条件 |
|----|------|
| S0 | **sector brief** が工程2成果として辿れる（または非業務で非該当＋理由）。薄い一般論のみなら No |
| S1 | **利用者（actors）** が2役以上。各役の主ジョブ1文。brief／depth の帰結であること |
| S2 | **actor-split:** 役ごとに主表面が別 |
| S3 | **surface budget:** 主要ハッピーパスは **表面 ≤3** |
| S4 | **demo-seeded:** 当該システムに即した事前選択肢／初期選択の方針が具体 |
| S5 | **attention stack:** 各主表面の視線優先1行以上（主タスクが先頭） |
| S6 | **品質 What 候補** ≥3（行為・結果の What。ピクセル How 禁止） |
| S7 | **design call** が工程4成果として辿れる（方針要約で可）。遷移方針が1行以上。汎用「クリーンな管理画面」だけは No |

ドメイン骨格は S0／spec-depth と整合する概念 ≥5・WF/状態 ≥2。

## Source（工程6 Spike）

| ID | 条件 |
|----|------|
| U0 | `## sector brief` — 工程2を深化または引用。事実／仮説を分離 |
| U1 | `## actors` — brief／depth と整合 |
| U2 | `## surface map` — 主表面 ≤3、主要 UC の完結場所、**遷移の要約** |
| U3 | `## demo-seeded` — システム固有の初期データ／選択肢 |
| U4 | `## attention stack` |
| U5 | `## usability what` ≥3。オペに根ざす。入力属性羅列のみ不可 |
| U6 | `## design call`／genre look — 工程4と整合。要素 ≥3＋attention。**未決禁止**。遷移列が辿れる |

table stakes／domain skeleton も brief／depth から採る。連想だけの骨格は再起草。

## Promote（工程7）

| ID | 条件 |
|----|------|
| P0 | 領域・actors に関わる採用事項が glossary／actors／決め事／UC のいずれかに辿れる |
| P1 | usability what → 決め事／UC |
| P2 | actors と主表面分担が残る |
| P3 | 採用 usability が決め事／UC／対象外へ辿れる |
| P4 | design call の見た目 How は L2/L3 に上げない。issue／Implement へ辿れる旨を promote-check に1行 |

## Implement（工程9）

| ID | 条件 |
|----|------|
| I1 | actor-split |
| I2 | demo-seeded（当該システムの典型値が選択肢に出る） |
| I3 | surface budget ≤3 |
| I4 | attention stack（主タスクが先頭） |
| I5 | design call 実行（汎用スキン逃げは No）。対応 ≥3 を完了報告 |
| I6 | 単体緑・主要 UC・ドメイン条件は工程表どおり |
| I7 | 主要ジョブの操作パスが `design-call.md` の遷移列と整合（勝手な省略は No） |

## Audit（工程10）— 重大 Gap 候補

- sector brief／spec-depth／design-call が無い／一般論のみなのに業務テーマを通している
- actors・文言・選択肢が brief／depth の帰結と不一致
- actor-split 破れ、demo-seeded 欠落、surface >3 必須、attention 逆転
- 権限差・可変境界が depth にあるのに実装／画面に無い
- usability what／design call／**画面遷移**無視
- どの領域にも見える汎用フォームだけで、brief の通例 ≥3 が UI に無い

軽微: ブランド最終仕上げ（demo-grade 内で領域として認識できれば軽微）
