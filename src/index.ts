const getTestSites = () => {
  const sheet = getSpreadSheet('test sites');
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  const makeFormat = name => {
    return value => {
      const budget = {
        fcp: value[3] || null,
        'Speed Index': value[4] || null,
        tti: value[5] || null
      }
      return {
        name,
        url: value[1],
        label: value[2],
        budget
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

const makeAlertMessage = (site, metrics, proceededMetric) => {
  const head = `${site.name}<${site.label}>`;
  const message = `${proceededMetric} proceeded the budget (${site.budget[proceededMetric]}). Now ${proceededMetric} is ${metrics[proceededMetric]}.`
  return `${head}: ${message}`;
}

const runTest = () => {
  const API_KEY = getPSIAPIKey();
  const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm')


  return getTestSites()
    .map(site => {
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
      const scoreSheet = getSpreadSheet('scores');
      scoreSheet.insertRowAfter(scoreSheet.getLastRow());
      const range = scoreSheet.getRange(scoreSheet.getLastRow() + 1, 1, 1, rowValues.length);
      range.setValues([rowValues])
      Utilities.sleep(500);
      return {
        site,
        metrics
      };
    })
    .reduce((prev, current) => {
      const {site, metrics} = current;
      const budget = site.budget;
      if (budget.fcp && budget.fcp < metrics.fcp) {
        prev.push(makeAlertMessage(site, metrics, 'fcp'))
      }
      if (budget.tti && budget.tti < metrics.tti) {
        prev.push(makeAlertMessage(site, metrics, 'tti'))
      }
      return prev;
    }, []);
}


function main() {
  const alerts = runTest();
  if (alerts.length > 0) {
    sendAlert(alerts);
  }
}
