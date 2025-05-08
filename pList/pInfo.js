// 전역 변수 선언
let [from, to] = [ '', '' ];
let fromDate = ''; let toDate = '';


// 초기에 로드되는 페이지  
document.addEventListener('DOMContentLoaded',() => {
  const apiUrl = localStorage.getItem('targetPageId'); // 확인, 
  console.log(apiUrl);

  fetch(apiUrl).then(res => res.text())
  .then(xmlString => {
    const xmlDoc = new DOMParser().parseFromString(xmlString,'text/xml');
    const jsonResult = xmlToJson(xmlDoc);
    const jsonArr = jsonResult.dbs.db; // 확인,
    console.log(jsonArr);

    detailPagePrint(jsonArr);
    shareLink();
  })
})


// detailPagePrint() - 상세 페이지 출력 메서드
function detailPagePrint(jsonArr){
  // HTML 요소
  const h3 = document.getElementById('h3');
  const badge = document.getElementById('badge');  
  const tu = document.querySelectorAll('.tu')[0];
  const info_fcltynm = document.getElementById('info_fcltynm');
  const info_prfpdFromTo = document.getElementById('info_prfpdFromTo');
  const info_prfruntime = document.getElementById('info_prfruntime');
  const info_prfage = document.getElementById('info_prfage');
  const info_pcseguidance = document.getElementById('info_pcseguidance');
  const info_prfcast = document.getElementById('info_prfcast');

  // 확인, console.log(jsonArr.genrenm["#text"]);

  h3.innerHTML += `${jsonArr.prfnm["#text"]}`;
  badge.innerHTML += `${jsonArr.genrenm["#text"]}`;

  let { bgc, bdColor, txtColor } = colorSet(jsonArr.genrenm["#text"]);

  badge.style.backgroundColor = bgc; 
  badge.style.borderColor = bdColor;
  badge.style.color = txtColor;

  tu.innerHTML += `<img id = "img" src = ${jsonArr.poster["#text"]}>`;

  info_fcltynm.innerHTML += jsonArr.fcltynm["#text"];
  info_prfpdFromTo.innerHTML += `${jsonArr.prfpdfrom["#text"]} ~ ${jsonArr.prfpdto["#text"]}`;
  info_prfruntime.innerHTML += jsonArr.prfruntime["#text"];
  info_prfage.innerHTML += jsonArr.prfage["#text"];
  info_pcseguidance.innerHTML += jsonArr.pcseguidance["#text"];

  if(jsonArr.prfcast["#text"] == null){
    info_prfcast.innerHTML += '';
  } else{ info_prfcast.innerHTML += jsonArr.prfcast["#text"]; }
   

  // 달력에 표시하기 위한 전역 변수 설정
  let periodText = info_prfpdFromTo.textContent;
  const parts = periodText.split('~').map(s => s.trim());
  from = parts[0] || '';
  to   = parts[1] || '';
    // Date 객체로 변환 (YYYY.MM.DD → YYYY-MM-DD)
  fromDate = new Date(from.replace(/\./g,'-'));
  toDate   = new Date(to.replace(/\./g,'-'));
  
  
  // 공연기간(fromDate~toDate) 내의 날짜 문자열 목록 만들기
  const perfDates = new Set();
  {
    const cur = new Date(fromDate);
    while (cur <= toDate) {
      // “2025-05-31” 식으로 포맷
      perfDates.add($.datepicker.formatDate("yy-mm-dd", cur));
      cur.setDate(cur.getDate() + 1);
    }
  }

  $("#calendar").datepicker("option", {
    minDate: fromDate,
    maxDate: toDate,

    beforeShowDay(date) {
      const dstr = $.datepicker.formatDate("yy-mm-dd", date);
      const isPerf = perfDates.has(dstr);
      // true - 클릭 가능 여부, 
      return [ true, isPerf ? "perf-date" : "", "" ];
    }
    // beforeShowDay(date) {
    //   const inRange = date >= fromDate && date <= toDate;

    //   // true 는 선택 가능 여부, 해당 기간이면 td 에 클래스 부여
    //   return [ true, inRange ? "in-range" : "", "" ];
    // }
    
  });

}

// initMap() - 지도에 공연장 위치를 찍는 메서드
function initMap(lat, lng) {
  // 지도 기본 설정 (서울 중심)
  const center = { lat, lng }; // 서울 좌표
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: center,
  });
  
  // 마커 추가
  const marker = new google.maps.Marker({
    position: center,
    map: map,
    title: "공연장",
  });
} 

function shareLink(){
  const copyBtn = document.getElementById('copyLink');

  copyBtn.addEventListener('click', async (e) => {
    e.preventDefault();  // <a> 기본 동작 막기

    try {
      // 현재 URL 가져오기
      const url = window.location.href;

      // 클립보드에 쓰기
      await navigator.clipboard.writeText(url);

      // 사용자에게 복사 완료 알림
      alert('URL이 복사되었습니다');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('복사에 실패했습니다. 수동으로 복사해 주세요.');
    }
  });
}


function colorSet(genrenm){
  let bgc = '';
  let bdColor = '';
  let txtColor = '';

  switch(genrenm){
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

// 
function xmlToJson(xml) {
  // node 타입별 처리
  let obj = {};

  // ELEMENT_NODE
  if (xml.nodeType === 1) { 
    // 속성 처리
    if (xml.attributes.length > 0) {
      // obj라는 JS 객체 안에 @attributes라는 키를 만들고 
      // XML 요소의 속성 (Attribute) 목록을 담는 용도로 @attributes 사용 
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // TEXT_NODE
    obj = xml.nodeValue.trim();
  }

  // 자식 노드가 있으면 재귀
  if (xml.hasChildNodes()) {
    for(let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      const childJson = xmlToJson(item);
      // 공백 텍스트 노드 건너뛰기
      if (childJson === "") continue;  

      if (obj[nodeName] === undefined) {
        obj[nodeName] = childJson;
      } else {
        // 이미 같은 이름의 노드가 있으면 배열로 변환
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(childJson);
      }
    }
  }
  return obj;
}


// Jquery DatePicker 
$(function() {
  // 기본 로케일을 한국어로 변경
  $.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    prevText: '이전 달',
    nextText: '다음 달',
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    showMonthAfterYear: true,
    yearSuffix: '년'
  });

  $("#calendar").datepicker({
    inline: true,             // 페이지에 인라인으로 표시
    showOtherMonths: true,    // 이달 외 달도 회색으로 표시
    selectOtherMonths: true,  // 이달 외 달도 선택 가능
    firstDay: 1,              // 일요일을 주 시작일로
  });
});