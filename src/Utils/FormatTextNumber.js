export const FormatTextNumber = (number) => {
  const ones = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const teens = ['mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];
  const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
  const groups = ['', 'ngàn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function convertChunk(chunk) {
    let result = '';
    const hundred = Math.floor(chunk / 100);
    const remainder = chunk % 100;

    if (hundred > 0) {
      result += ones[hundred] + ' trăm';
    }

    if (remainder > 0) {
      if (remainder < 10) {
        result += ' ' + ones[remainder];
      } else if (remainder < 20) {
        result += ' ' + teens[remainder - 10];
      } else {
        const ten = Math.floor(remainder / 10);
        const one = remainder % 10;
        result += ' ' + tens[ten];
        if (one > 0) {
          result += ' ' + ones[one];
        }
      }
    }

    return result;
  }

  if (number === 0) return capitalizeFirstLetter(ones[0]);

  let result = '';
  let chunkIndex = 0;

  while (number > 0) {
    const chunk = number % 1000;
    if (chunk !== 0) {
      result = convertChunk(chunk) + ' ' + groups[chunkIndex] + ' ' + result;
    }
    number = Math.floor(number / 1000);
    chunkIndex++;
  }

  return capitalizeFirstLetter(result.trim());
};
