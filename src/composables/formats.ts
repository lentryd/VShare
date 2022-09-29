const postfixes = ["B", "KB", "MB", "GB"];

function round(number: number) {
  return Math.round(number);
}

export function formatSize(size: number) {
  let index = 0;
  while (size > 1000) {
    index += 1;
    size = round((size / 1024) * 100) / 100;
  }
  return size + postfixes[index];
}

const month = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function num2str(num: number) {
  return num < 10 ? "0" + num : num.toString();
}

export function formatDate(date: Date) {
  const now = new Date();
  return (
    num2str(date.getDate()) +
    " " +
    month[date.getMonth()] +
    (now.getFullYear() == date.getFullYear() ? "" : date.getFullYear())
  );
}
