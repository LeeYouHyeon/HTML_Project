// 전역 변수 선언
let intro = document.getElementsByClassName('contents')[0];
let place = document.getElementsByClassName('contents')[1];
let jrr, placeJSON; // 콘솔 확인용(실제 기능에는 영향 없음)

let [from, to] = [ '', '' ];
let fromDate = ''; let toDate = '';

// 문서 이동 시 로드되는 페이지  
document.addEventListener('DOMContentLoaded',() => {
  const apiUrl = localStorage.getItem('targetPageId'); // 확인

  fetch(apiUrl).then(res => res.text())
  .then(xmlString => {
    const xmlDoc = new DOMParser().parseFromString(xmlString,'text/xml');
    const jsonResult = xmlToJson(xmlDoc);
    const jsonArr = jsonResult.dbs.db; // 확인,
    jrr = jsonArr;

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

  h3.innerHTML += `${jsonArr.prfnm["#text"]}`;
  badge.innerHTML += `${jsonArr.genrenm["#text"]}`;

  let { bgc, bdColor, txtColor } = colorSet(jsonArr.genrenm["#text"]);

  badge.style.backgroundColor = bgc; 
  badge.style.borderColor = bdColor;
  badge.style.color = txtColor;

  tu.innerHTML += `<img id = "img" src = ${jsonArr.poster["#text"]}>`;

  function ifUndef(str) {
    return str == undefined ? '' : str;
  }

  info_fcltynm.innerHTML += ifUndef(jsonArr.fcltynm["#text"]);
  info_prfpdFromTo.innerHTML += `${ifUndef(jsonArr.prfpdfrom["#text"])} ~ ${ifUndef(jsonArr.prfpdto["#text"])}`;
  info_prfruntime.innerHTML += ifUndef(jsonArr.prfruntime["#text"]);
  info_prfage.innerHTML += ifUndef(jsonArr.prfage["#text"]);
  info_pcseguidance.innerHTML += ifUndef(jsonArr.pcseguidance["#text"])
  info_prfcast.innerHTML = ifUndef(jsonArr.prfcast["#text"]);

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
    overflow: 'visible',

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
  document.getElementById('calendar').style.overflow = 'visible';

  const contents = document.querySelectorAll('.contents');
  // 소개 부분 채우기
  const imgs = jrr.styurls.styurl;
  if (Array.isArray(imgs)) {
    for (const styImg of imgs) {
      contents[0].innerHTML += `<img src="${styImg['#text']}" width="1200">`;
    }
  } else {
    contents[0].innerHTML = `<img src="${imgs['#text']}" width="1200">`;
  }
  
  // 지도 채우기
  // 공연장 이름
  document.querySelector('.name').innerHTML = jsonArr.fcltynm["#text"];
  // 공연장 상세 : API 불러오기
  fetch(`http://www.kopis.or.kr/openApi/restful/prfplc/${jsonArr.mt10id['#text']}?service=17beea38263f4378901270b9bcdc9ce6`).then(res => res.text()).then(xmlString => {
    const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml');
    const jsonResult = xmlToJson(xmlDoc);
    const jsonArr = jsonResult.dbs.db;
    placeJSON = jsonArr;
  
    const fields = document.querySelectorAll('.field');
    fields[0].innerHTML = jsonArr.fcltychartr["#text"];
    fields[1].innerHTML = jsonArr.adres["#text"];

    // 공연장 홈페이지는 없을 수 있음
    fields[2].innerHTML = (jsonArr.relateurl['#text']) ? `<a href="${jsonArr.relateurl["#text"]}">${jsonArr.relateurl["#text"]}</a>` : '없음';

    // 지도 채우기 : 구글 API
    (g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
      key: 'AIzaSyBkJGI8EZC8aQOwPy3I0NpcGcU28qxJdd8',
      v: "weekly",
      // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
      // Add other bootstrap parameters as needed, using camel case.
    });
    let map;

    async function initMap() {
      // The location of Uluru
      const position = { lat: Number(jsonArr.la['#text']), lng: Number(jsonArr.lo['#text']) };
      // Request needed libraries.
      //@ts-ignore
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      map = new Map(document.getElementById("map"), {
        zoom: 17,
        center: position,
        mapId: "DEMO_MAP_ID",
      });

      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: jsonArr.fcltynm['#text'],
      });
    }

    initMap();
  });
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

// Section 3에 선택 효과 부여 : Section 4에 표시되는 내용이 바뀜
const category = document.querySelectorAll('.category');
category.forEach((val, idx) => {
  val.addEventListener('click', () => {
    const choice = document.querySelectorAll('.contents');

    category[idx].classList.add('current');
    choice[idx].classList.remove('invisible');
    choice[1 - idx].classList.add('invisible');
    category[1 - idx].classList.remove('current');
  })
});

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