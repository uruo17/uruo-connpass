// スプレッドシートの情報取得
function getSpreadSheets_(name) {
  const sheetName = properties.getProperty(name);

  return sheetName; 
}

// ヘッダーのKeyword列データを取得
function getKeywords_(sheet) {
  const lastColumn = sheet.getLastColumn();
  const header = sheet.getRange(1, 1, 1, lastColumn).getValues();
  const key = 'Keywords';
  const row = header.flat().indexOf(key);
  const lastRow = sheet.getLastRow();
  const values = sheet.getRange(2, row+1, lastRow-1).getValues().flat();
  
  return values;
}

// 入力先シートのヘッダー作成
function setSheetHeader_(sheet) {
  sheet.clear();
  let checkFilter = sheet.getFilter();
  if (!(checkFilter == null)) {
    checkFilter.remove();
  }
  const header = [['TITLE', 'URL', 'STARTED_AT', 'ACCEPTED / LIMIT', 'LABEL']];  
  const headerRange = sheet.getRange(1, 1, 1, header[0].length);
  headerRange
    .setValues(header)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBackground('#ffa07a')
    .setFontColor('#ffffff');

  return;
}

// 明日を起点に3日間の日付を生成
function setTimeRange_() {
  const list = [];
  let date = new Date();
  for (let i = 1; i <= 3; i++) {
    date.setDate(date.getDate() + 1);
    let day = Utilities.formatDate(date, "Asia/Tokyo", "yyyyMMdd");
    list.push(day);
  }

  return list;
}

// API処理
function getDataList_(values, days) {
  const delayTime = 5000;
  let uri = 'https://connpass.com/api/v1/event/';
  const results = [];
  const lastValue = values.slice(-1)[0];

  for (const value of values) {
    console.log(`KEYWORD: ${value}`);
    let response = UrlFetchApp.fetch(encodeURI(uri + `?ymd=${days.join(',')}&keyword=${value}`));
    
    // レスポンスの処理
    response = JSON.parse(response.getContentText());
    const resultCount = response['results_returned'];

    // 検索結果がない場合は次のループ処理へ
    if (resultCount === 0) {
      continue;
    }
    
    // イベントデータを取得
    let events = response['events'];
    const location = 'オンライン';

    for (const event of events) {
      if (!(event['place'] === location || event['address'] === location)) {
        continue;
      }
      const data = [];
      data.push(event['title']);
      data.push(event['event_url']);
      data.push(Utilities.formatDate(new Date(event['started_at']), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm (EEE)'));
      if (event['limit'] == null) {
        data.push(`${event['accepted']} / (No Limit)`);
      } else {
        data.push(`${event['accepted']} / ${event['limit']}`);
      }
      data.push(value);
      results.push(data);
    }

    // 次の検索キーワードがある場合、sleep
    if (!(value === lastValue)) {
      Utilities.sleep(delayTime);
    }
  }

  return results;
}

// データをシートに入力
function setValuesToSheet_(sheet, values)  {
  const lastColumn = values[0].length;
  const lastRow = values.length;
  sheet.getRange(2, 1, lastRow, lastColumn).setValues(values)
  sheet.getRange(1, 1, lastRow + 1, lastColumn).createFilter();
  sheet.autoResizeColumns(1, lastColumn);
  for (i = 1; i <= lastColumn; i++) {
    let columnWidth = sheet.getColumnWidth(i);
    sheet.setColumnWidth(i, columnWidth + 30);
  }

  return;
}

// スクリプトプロパティから情報取得
const properties = PropertiesService.getScriptProperties();
const sheetId = properties.getProperty('SPREAD_SHEET_ID');
const ss = SpreadsheetApp.openById(sheetId);

// メイン関数
function getDataFromConnpass() {  
  let sheetName = getSpreadSheets_('KEYWORDS_LIST');
  let sheet = ss.getSheetByName(sheetName);
  const keywords = getKeywords_(sheet);
  
  sheetName = getSpreadSheets_('CONNPASS_SHEET');
  sheet = ss.getSheetByName(sheetName);
  setSheetHeader_(sheet);

  const days = setTimeRange_();
  const resultList = getDataList_(keywords, days);

  setValuesToSheet_(sheet, resultList);
  return;
}
