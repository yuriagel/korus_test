const daysMap = {
  "0":"Воскресенье",
  "1":"Понедельник",
  "2":"Вторник",
  "3":"Среда",
  "4":"Четверг",
  "5":"Пятница",
  "6":"Суббота"
};

const monthsMap = {
  "0":"Янв",
  "1":"Фев",
  "2":"Мар",
  "3":"Апр",
  "4":"Ма",
  "5":"Июнь",
  "6":"Июль",
  "7":"Авг",
  "8":"Сент",
  "9":"Окт",
  "10":"Ноя",
  "11":"Дек"
};

function convertTemp (kelvin) {
  return parseInt(((kelvin - 273.15)), 10)
}

function getDate (unixTimestmap) {
  let date = new Date(unixTimestmap * 1000);
  let day = daysMap[date.getDay()];
  let month = monthsMap[date.getMonth()] + ' ' + date.getDate();
  return day + ', ' + month;
}

module.exports = {
  convertTemp: convertTemp,
  getDate: getDate
};