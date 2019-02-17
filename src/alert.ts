const sendEmail = sheet => {
  const emails = sheet.getRange(2, 2, 1).getValue();
  MailApp.sendEmail(emails, 'PSI Perf Budget Alert', '');
};

const sendToSlack = sheet => {
  const url = sheet.getRange(3, 2, 1).getValue();
  const payload = {
    text : 'aaaa'
  };
  const options = {
    method: 'post',
    payload: payload
  };

  UrlFetchApp.fetch(url, options);
};

function sendAlert() {
  const sheet = getSpreadSheet('settings');
  sendEmail(sheet);
  sendToSlack(sheet);
}
