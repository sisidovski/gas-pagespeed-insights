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

function sendAlert(messages) {
  const sheet = getSpreadSheet('settings');
  const formatted = messages.join("\n");
  sendEmail(sheet, formatted);
  sendToSlack(sheet, formatted);
}
