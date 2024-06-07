export function formatNumber(number, decimals = 0) {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  });
}

export function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
