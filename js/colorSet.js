// 백그라운드 컬러 결정 메소드 
function colorSet(genrenm) {
  let bgc = '';
  let bdColor = '';
  let txtColor = '';

  switch (genrenm) {
    case '연극':
      // elem.style.setProperty(속성명, 값, [우선순위]); 
      bgc = '#fff9f4'; // 배경색
      bdColor = '#de8383'; // 테두리색
      txtColor = '#de8383'; // 글씨색
      break;

    case '뮤지컬':
      bgc = '#f4faff'; // 배경색
      bdColor = '#83b4de'; // 테두리색
      txtColor = '#257dd7'; // 글씨색
      break;

    case '서양음악(클래식)':
      bgc = '#f4faff'; // 배경색
      bdColor = '#a391d2'; // 테두리색
      txtColor = '#a391d2'; // 글씨색
      break;

    case '한국음악(국악)':
      bgc = '#ffffe4'; // 배경색
      bdColor = '#868608'; // 테두리색
      txtColor = '#868608'; // 글씨색
      break;

    case '대중음악':
      bgc = '#f6f8f8'; // 배경색
      bdColor = '#2c2a2a'; // 테두리색
      txtColor = '#2c2a2a'; // 글씨색
      break;

    case '무용':
      bgc = '#f3fdfd'; // 배경색
      bdColor = '#e7eeee'; // 테두리색
      txtColor = '#449496'; // 글씨색
      break;

    case '대중무용':
      bgc = '#fff9f4'; // 배경색
      bdColor = '#1f4362'; // 테두리색
      txtColor = '#1f4362'; // 글씨색
      break;

    case '서커스/마술':
      bgc = '#fcf3fb'; // 배경색
      bdColor = '#c27fbb'; // 테두리색
      txtColor = '#c27fbb'; // 글씨색
      break;

    case '복합':
      bgc = '#f2f2f2'; // 배경색
      bdColor = '#636363'; // 테두리색
      txtColor = '#636363'; // 글씨색
      break;
  }

  return { bgc, bdColor, txtColor };
}