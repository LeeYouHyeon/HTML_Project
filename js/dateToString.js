function dateToString(date) {
  let answer = date.getFullYear().toString();
  answer += twoDigits(date.getMonth() + 1);
  answer += twoDigits(date.getDate());
  return answer;
}

function twoDigits(number) {
  return (number < 10) ? '0' + number : number.toString();
}