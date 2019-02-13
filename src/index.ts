const getTestSites = () => {
  const sheet = getSpreadSheet('test sites');
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  const makeFormat = name => {
    return value => {
      return {
        name,
        url: value[1],
        label: value[2]
      }
    };
  }
  return values.reduce((prev, current) => {
    const name = current[0] ? current[0] : prev[prev.length - 1].name
    const format = makeFormat(name);
    const result = format(current);
    prev.push(result);
    return prev;
  }, []);
}

const runTest = () => {
  const scoreSheet = getSpreadSheet('scores');
  const API_KEY = getPSIAPIKey();
  const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm')

  getTestSites().forEach(site => {
    const response = fetchAPI(API_KEY, site.url);
    const metrics = extractMetrics(response);
    if (!metrics) {
      return;
    }
    const rowValues = [
      date,
      site.url,
      site.name
      site.label,
      metrics.accessibility,
      metrics['best-practices'],
      metrics.performance,
      metrics.pwa,
      metrics.seo,
      metrics.fcp,
      metrics.tti
    ];
    scoreSheet.insertRowAfter(scoreSheet.getLastRow());
    const range = scoreSheet.getRange(scoreSheet.getLastRow() + 1, 1, 1, rowValues.length);
    range.setValues([rowValues])
  });
}


function main() {
  runTest();
  // if (result.hasBudgetAlert) {
  //   sendAlert();
  // }
}
