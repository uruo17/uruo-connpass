// Get column data for Keyword(Hearder)
function getKeywords_(sheet) {
  const lastColumn = sheet.getLastColumn();
  const header = sheet.getRange(1, 1, 1, lastColumn).getValues();
  const key = 'Keywords';
  const row = header.flat().indexOf(key);
  const lastRow = sheet.getLastRow();
  const values = sheet.getRange(2, row+1, lastRow-1).getValues().flat();  
  return values;
}

// Writing sheet setting
function setTargetSheet_(platform) {
  switch (platform) {
    case 'connpass': {
      const propertySheet = properties.getProperty('CONNPASS_SHEET');
      const sheet = ss.getSheetByName(propertySheet);
      return sheet;
    }
    case 'doorkeeper': {
      const propertySheet = properties.getProperty('DOORKEEPER_SHEET');
      const sheet = ss.getSheetByName(propertySheet);
      return sheet;
    }
  }
}

// Writing sheet header settings
function setSheetHeader_(sheet) {
  sheet.clear();
  let checkFilter = sheet.getFilter();
  if (!(checkFilter === null)) {
    checkFilter.remove();
  }
  const header = [['TITLE', 'URL', 'STARTED_AT', 'PARTICIPANTS / LIMIT', 'LABEL']];  
  const headerRange = sheet.getRange(1, 1, 1, header[0].length);
  headerRange
    .setValues(header)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBackground('#ffa07a')
    .setFontColor('#ffffff');
  return;
}

// Generate one week's worth of dates from the execution timing
function setTimeRange_(platform) {
  const term = 6;
  const date = new Date();
  switch (platform) {
    case 'connpass':
      const list = [];
      for (let i = 0; i <= term; i++) {
        let day = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyyMMdd');
        list.push(day);
        date.setDate(date.getDate() + 1);
      }
      return list;
    case 'doorkeeper':
      const start = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
      date.setDate(date.getDate() + term);
      const end = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
      return [start, end];
  }
}

// Inserting data on a sheet
function setValuesToSheet_(sheet, values)  {
  const lastColumn = values[0].length;
  const lastRow = values.length;
  sheet.getRange(2, 1, lastRow, lastColumn)
    .setValues(values)
    .sort(3);
  sheet.getRange(1, 1, lastRow + 1, lastColumn).createFilter();
  sheet.autoResizeColumns(1, lastColumn);
  for (i = 1; i <= lastColumn; i++) {
    let columnWidth = sheet.getColumnWidth(i);
    sheet.setColumnWidth(i, columnWidth + 30);
  }
  return;
}

