import fs from 'fs';

function parseData(data: string): string[][] {
  return data.split('\r\n').map((d) => d.split(','));
}

function filterDuplicatedData(dataList: string[][]): Set<string> {
  console.info('>> 원본 데이터 + 헤더 길이:', dataList.length);
  const contactSet = new Set<string>();
  for (const data of dataList) {
    if (isNaN(parseInt(data[0])) || data[1].length < 1) continue;
    if (parseInt(data[0])) contactSet.add(data[1]);
  }
  return contactSet;
}
function readCsvFiles(error: Error, data: string): void {
  if (error) {
    console.error('Error reading CSV file:', error);
    return;
  }

  try {
    const results = parseData(data);
    const result = filterDuplicatedData(results);
    console.info('>> 헤더, 중복 제거 데이터 길이:', result.size);

    const savedData = Array.from(result).join(','); // Use join to create CSV string
    fs.writeFile(`tumblbug-result-${Date.now()}.csv`, savedData, (error) => {
      if (error) console.error('Error writing CSV file:', error);
    });
  } catch (error) {
    console.error('Error processing data:', error);
  }
}

fs.readFile('tumblbug-contacts-20241005.csv', 'utf-8', readCsvFiles);
