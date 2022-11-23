const fs = require('fs');
const extract = require('pdf-text-extract');

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
async function main() {
  writeCsv(csvFile, './result.csv');

  fs.readdir(pdfsFolder, async (err, files) => {
    files.forEach(async (file) => {
      const pdfContent = [];
      extract(`./pdfs/${file}`, (error, pages) => {
        const e = pages[0].replace(/\r\n|\n|\s+/g, '');

        const itemsString = e.substring(e.indexOf('申請摘要', e.indexOf('憑證號碼')) + 4, e.indexOf('總未稅', e.indexOf('憑證號碼')));

        let checkExpenseNumber;
        expenseNumbers.forEach((expenseNumber) => {
          if (itemsString.indexOf(expenseNumber) !== -1) {
            checkExpenseNumber = expenseNumber;
          }
        });
        const issuerString = e.substring(e.indexOf('Issuer') + 6);
        let undertaker = issuerString;
        const chineseReg = '[\u4E00-\u9FA5]+';
        const pattern = new RegExp(chineseReg);
        if (pattern.test(issuerString[0])) {
          undertaker = issuerString.substring(0, 3);
        } else {
          for (let i = 0; i < issuerString.length; i += 1) {
            if (pattern.test(issuerString[i])) {
              undertaker = issuerString.substring(i, i + 3);
              break;
            }
          }
        }
        twoLetterList.forEach((name) => {
          if (issuerString.indexOf(name) !== -1) {
            undertaker = issuerString.substring(0, 2);
          }
        });
        pdfContent.push([
          '',
          e.substring(e.indexOf('申請事由', e.indexOf('供應廠商')) + 5, e.indexOf('序號', e.indexOf('申請事由'))) || 'NA',
          checkExpenseNumber || 'NA',
          e.substring(e.indexOf('供應廠商', e.indexOf('表單代號')) + 5, e.indexOf('統一編號', e.indexOf('供應廠商'))) || 'NA',
          e.substring(e.indexOf('總金額', e.indexOf('總未稅')) + 4, e.indexOf('代扣稅款', e.indexOf('總金額'))) || 'NA',
          e.substring(e.indexOf('總未稅') + 4, e.indexOf('總稅額')) || 'NA',
          e.substring(e.indexOf('憑證日期', e.indexOf('申請事由')) + 5, e.indexOf('憑證號碼', e.indexOf('憑證日期'))) || 'NA',
          undertaker || 'NA',
          e.substring(e.indexOf('憑證號碼', e.indexOf('憑證日期')) + 5, e.indexOf('統一編號', e.indexOf('憑證號碼'))) || 'NA',
          e.substring(e.indexOf('表單代號：') + 5, e.indexOf('填單日期', e.indexOf('表單代號'))) || 'NA',
          '',
        ]);
        writeCsv(pdfContent, './result.csv');
      });
    });
  });
}
main();
