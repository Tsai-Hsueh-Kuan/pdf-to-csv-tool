const fs = require('fs');
const pdfParse = require('pdf-parse');
const stringify = require('csv-stringify/lib/sync');
const {
  pdfsFolder, csvFile, expenseNumbers, twoLetterList,
} = require('./constant');

function writeCsv(data, path) {
  const d = stringify(data);
  fs.writeFileSync(path, d, {
    encoding: 'utf8',
    flag: 'a+',
  });
}

const promisePdfParse = [];

async function getPDF(file) {
  const readFileSync = fs.readFileSync(file);
  try {
    promisePdfParse.push(pdfParse(readFileSync).then((e) => e.text.replace(/\r\n|\n/g, '')));
    return promisePdfParse;
  } catch (error) {
    throw new Error(error);
  }
}

fs.readdir(pdfsFolder, async (err, files) => {
  files.forEach(async (file) => {
    getPDF(`./pdfs/${file}`);
  });
  const pdfParseText = await Promise.all(promisePdfParse);
  pdfParseText.forEach((e) => {
    const itemsString = e.substring(e.indexOf('申請摘要', e.indexOf('憑證號碼')) + 4, e.indexOf('總未礅', e.indexOf('憑證號碼')));
    let checkExpenseNumber;
    expenseNumbers.forEach((expenseNumber) => {
      if (itemsString.indexOf(expenseNumber) !== -1) {
        checkExpenseNumber = expenseNumber;
      }
    });
    const issuerString = e.substring(e.indexOf('Issuer') + 6, e.indexOf('Issuer') + 9);
    let undertaker = issuerString;
    twoLetterList.forEach((name) => {
      if (issuerString.indexOf(name) !== -1) {
        undertaker = issuerString.substring(0, 2);
      }
    });

    csvFile.push([
      '',
      e.substring(e.indexOf('申請事由', e.indexOf('供應廠商')) + 5, e.indexOf('序號', e.indexOf('申請事由'))) || 'NA',
      checkExpenseNumber || 'NA',
      e.substring(e.indexOf('供應廠商', e.indexOf('表單代號')) + 5, e.indexOf('統一編號', e.indexOf('供應廠商'))) || 'NA',
      e.substring(e.indexOf('總金額', e.indexOf('總未礅')) + 4, e.indexOf('代扣礅款', e.indexOf('總金額'))) || 'NA',
      e.substring(e.indexOf('總未礅', e.indexOf('憑證號碼')) + 4, e.indexOf('總礅額', e.indexOf('總未礅'))) || 'NA',
      e.substring(e.indexOf('憑證日期', e.indexOf('申請事由')) + 5, e.indexOf('憑證號碼', e.indexOf('憑證日期'))) || 'NA',
      undertaker || 'NA',
      e.substring(e.indexOf('憑證號碼', e.indexOf('憑證日期')) + 5, e.indexOf('統一編號', e.indexOf('憑證號碼'))) || 'NA',
      e.substring(e.indexOf('表單代號：') + 5, e.indexOf('填單日期', e.indexOf('表單代號'))) || 'NA',
      '',
    ]);
  });
  writeCsv(csvFile, './result.csv');
});
