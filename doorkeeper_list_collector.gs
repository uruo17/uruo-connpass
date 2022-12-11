// for Doorkeeper API
function getDataListFromDoorkeeper_(values, start, end) {
  const accessToken = properties.getProperty('ACCESS_TOKEN');
  let uri = properties.getProperty('DOORKEEPER_URL');
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };
  const results = [];
  const lastValue = values.slice(-1)[0];

  for (const value of values) {
    let page = 1;
    let nextPage = true;
    
    while (nextPage) {
      const response = UrlFetchApp.fetch(encodeURI(uri + `?q=${value}&since=${start}&until=${end}&sort=starts_at&page=${page}`), headers);
      
      // Response parsing
      let events = JSON.parse(response.getContentText());
      let eventsCount = Object.keys(events).length;
      
      // If there are no search results, go to the next keyword
      if (eventsCount === 0) {
        break;
      }
      
      // Get event data
      for (const event of events) {
        if (!(event['event']['venue_name'] === null &&	event['event']['address'] === null)) {
          continue;
        }

        const data = [];
        data.push(event['event']['title']);
        data.push(event['event']['public_url']);
        data.push(Utilities.formatDate(new Date(event['event']['starts_at']), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm (EEE)'));
        if (event['event']['ticket_limit'] === null) {
          data.push(`${event['event']['participants']} / (No Limit)`);
        } else {
          data.push(`${event['event']['participants']} / ${event['event']['ticket_limit']}`);
        }
        data.push(value);
        results.push(data);
      }
      
      // Check to see if there is a next page
      if (!(eventsCount === 25)) {
        nextPage = false;
        continue;
      }
      
      // Increment page
      page++;

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

