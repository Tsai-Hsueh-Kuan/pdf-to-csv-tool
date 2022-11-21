const pdfsFolder = './pdfs/';
const csvFile = [[
  '分類',
  'Description',
  'Expense Category/ 會計科目代碼',
  'Payee',
  'Amount (NTD$) 含稅',
  'Amount (NTD$) 未稅',
  'Invoice Date',
  'Undertaker',
  '單據編號',
  'BPM單號',
  '備註',
]];
const expenseNumbers = [
  60290300, 60149900, 60290400, 60150300, 60260000, 60200300, 60310000,
  60171100, 60120000, 60130200, 60130300, 60130400, 60130500, 60150300, 60190100, 60190200,
  60200300, 60260000, 60290300, 60310000, 60350000, 60550000, 60560600, 60889900,
];
const twoLetterList = [
  ,
];

module.exports = {
  pdfsFolder,
  csvFile,
  expenseNumbers,
  twoLetterList,
};
