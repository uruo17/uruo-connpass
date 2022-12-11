// Get script property
const properties = PropertiesService.getScriptProperties();

// Get spreadsheet information
const sheetId = properties.getProperty('SPREAD_SHEET_ID');
const ss = SpreadsheetApp.openById(sheetId);

// Sleep(ms)
const delayTime = 5000;

// Main Process
function getWebinarData() {
  const keywordsSheet = properties.getProperty('KEYWORDS_LIST');
  const kSheet = ss.getSheetByName(keywordsSheet);
  const keywords = getKeywords_(kSheet);

  // for connpass
  let platform = 'connpass';
  let sheet = setTargetSheet_(platform);
  setSheetHeader_(sheet);
  const days = setTimeRange_(platform);
  const cResults = getDataListFromConnpass_(keywords, days);
  if (cResults.length) {
    setValuesToSheet_(sheet, cResults);
  }

  // for Doorkeeper
  platform = 'doorkeeper';
  sheet = setTargetSheet_(platform);
  setSheetHeader_(sheet);
  const [start, end] = setTimeRange_(platform);
  const dResults = getDataListFromDoorkeeper_(keywords, start, end);
  if (dResults.length) {
    setValuesToSheet_(sheet, dResults);
  }

  return;
}
