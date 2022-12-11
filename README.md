# data_collector
メイン処理

# utilities
共通機能

# connpass_list_collector
connpass APIを利用して、connpassから希望のキーワードを含む勉強会を取得する

# doorkeeper_list_collector
Doorkeeper APIを利用して、Doorkeeperから希望のキーワードを含む勉強会を取得する

## 補足事項

|Property|Description|
|ACCESS_TOKEN|Doorkeeper APIのアクセストークン|
|CONNPASS_SHEET|connpassの取得結果を書き込むシート名|
|CONNPASS_URL|connpass APIのURL|
|DOORKEEPER_SHEET|Doorkeeperの取得結果を書き込むシート名|
|DOORKEEPER_URL|Doorkeeper APIのURL|
|KEYWORDS_LIST|検索キーワードを入力してあるシート名|
|SPREAD_SHEET_ID|スプレッドシートのID(/spreadsheets/d/xxxxx/edit)のxxxxx|
- 関連記事
  - https://uruo.hatenablog.com/entry/2022/12/06/064412
