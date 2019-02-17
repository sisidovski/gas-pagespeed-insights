const sendEmail = (sheet, message) => {
  const emails = sheet.getRange(2, 2, 1).getValue();
  MailApp.sendEmail(emails, 'PSI Perf Budget Alert', message);
};

const sendToSlack = (sheet, message) => {
  const url = sheet.getRange(3, 2, 1).getValue();
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: `{"text": "${message}"}`
  });
};

const createMessage = () => {
  return 'foobarbaz';
};

function sendAlert() {
  const sheet = getSpreadSheet('settings');
  const message = createMessage();
  sendEmail(sheet, message);
  sendToSlack(sheet, message);
}
