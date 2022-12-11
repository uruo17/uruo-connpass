// for connpass API
function getDataListFromConnpass_(values, days) {
  let uri = properties.getProperty('CONNPASS_URL');
  const results = [];
  const lastValue = values.slice(-1)[0];

  for (const value of values) {
    let page = 1;
    let counter = 0;
    let nextPage = true;

    while(nextPage) {
      let response = UrlFetchApp.fetch(encodeURI(uri + `?ymd=${days.join(',')}&keyword=${value}&start=${page}&order=1`));
      
      // Response parsing
      response = JSON.parse(response.getContentText());
      const resultCount = response['results_returned'];
      counter += resultCount;
      page += resultCount;

      // If there are no search results, go to the next keyword
      if (resultCount === 0) {
        break;
      }
      
      // Get event data
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
        if (event['limit'] === null) {
          data.push(`${event['accepted']} / (No Limit)`);
        } else {
          data.push(`${event['accepted']} / ${event['limit']}`);
        }
        data.push(value);
        results.push(data);
      }

      // Check to see if there is a next page
      if (!(counter < response['results_available'])) {
        nextPage = false;
        continue;
      }
      
      // Sleep between requests (when the next page is available)
      Utilities.sleep(delayTime);
    }

    // Sleep between requests (when the next search keyword is available)
    if (!(value === lastValue)) {
      Utilities.sleep(delayTime);
    }
  }
  return results;
}

