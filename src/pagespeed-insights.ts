const CATEGORIES = [
  'accessibility',
  'best-practices',
  'performance',
  'pwa',
  'seo'
];

const getAPIURL = (key: string, url: string) => {
  var api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  var parameters = {
    url: encodeURIComponent(url),
    key: key
  };

  var query = '?';
  for (key in parameters) {
    query += '&' + key + '=' + parameters[key];
  }
  query += CATEGORIES.reduce(function(prev, category) {
    return prev + '&category=' + category;
  }, '');
  // Currently mobile only
  query += '&strategy=mobile';

  return api + query;
};

function getPSIAPIKey() {
  const sheet = getSpreadSheet('settings');
  const value = sheet.getRange(1, 2, 1).getValue();
  return value;
}

function fetchAPI(key: string, url: string) {
  var api = getAPIURL(key, url);
  Logger.log(api)
  var res = UrlFetchApp.fetch(api, { muteHttpExceptions: true });
  return JSON.parse(res.getContentText());
};

function extractMetrics(response) {
  var lhResult = response.lighthouseResult;
  // Sometimes Lighthouse test fails. Skip the test.
  if (!lhResult) {
    return null;
  }
  var categories = lhResult.categories;
  const result = CATEGORIES.reduce(function(prev, current) {
    prev[current] = categories[current].score * 100;
    return prev;
  }, {});
  var audits = lhResult.audits;
  var parse = function(value) {
    return parseFloat(value.replace(/ s/, ''));
  };
  result.fcp = parse(audits['first-contentful-paint'].displayValue);
  result.tti = parse(audits['interactive'].displayValue);

  return result;
};
