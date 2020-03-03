export { isInsensitiveEqual, InsensitiveInclude };

function isInsensitiveEqual(str1, str2) {
  return str1.localeCompare(str2, { sensitivity: "base" }) === 0;
}

function InsensitiveInclude(str1, str2) {
  return str1.toLowerCase().includes(str2.toLowerCase());
}
