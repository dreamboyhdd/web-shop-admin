export const FormatMoney = (num) => {
  if (num === null || num === "" || typeof num === "undefined") return "0";
  /* num = '0';
    if (num === '') return num; */
  let val;
  if (typeof num === "string") {
    val = num.replaceAll(",", "");
    if (isNaN(parseInt(val))) {
      return "";
    }
  } else {
    val = num;
  }
  return parseInt(val)
    .toFixed(0)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    .replace(".", ",");
};
