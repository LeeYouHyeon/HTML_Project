// 전역 네임스페이스 오염(Global namespace pollution) 발생 
  // main.js 에서 선언한 아래의 변수를 pList.js 에서 또 선언하면 Err 발생
  // const authorKey = "da5b83d91e3f40e0b76a7dc5eb9196bf";
  // let startDate = "20230601";
  // let endDate = "20250430";

// const { json } = require("express");

// 전역 변수 선언
  // pList 의 export : colorSet; 

let currentPage = 1;
let rowsElem = 15;
let localValue = 0;
let currentGenre = 'all';

const genreIndex = {
  'all': 0,
  'AAAA': 1,
  'GGGA': 2,
  'CCCA': 3,
  'CCCC': 4,
  'CCCD': 5,
  'BBBC': 6,
  'BBBE': 7,
  'EEEB': 8,
  'EEEA': 9
};

function createURL(genre = 'all') {
  let answer = `https://www.kopis.or.kr/openApi/restful/pblprfr?`;
  answer += `service=${authorKey}`;
  answer += `&stdate=${startDate}`;
  answer += `&eddate=${endDate}`;
  answer += `&cpage=${currentPage}`;
  answer += `&rows=${rowsElem}`;
  answer += `&signgucode=${localValue}`;

  if (genre != 'all') {
    answer += `&shcate=${genre}`;
  }

  return answer;
}

 // document Elem
const infoList = document.getElementById('infoList');
const moreInfo = document.getElementById('moreInfo');

// pList.html -------------------------------------------------------------------------------------------
  // 문서에 API 정보 뿌리기
document.addEventListener('DOMContentLoaded', () => {
  // 로컬 스토리지의 지역 코드 확인, console.log(localStorage.getItem('localValue'));

  // 로컬 스토리지에서 지역 코드 가져오기 
  localValue = localStorage.getItem('localValue');

  // 로컬 스토리지에 지역 코드가 저장되어 있지 않는 경우 출력 
  if(!localValue){ console.err('지역 코드 미저장..!'); return; }

  // 특정 지역 코드의 공연정보를 가져오는 url 생성 
  fetch(createURL()).then(res => res.text())
    // { if(res.ok) throw new Error(`${res.status} ${res.statusText}`)
    // { return res.text(); })
  .then(xmlString => {
    // XML → JSON 변환 
    const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml');
    const jsonResult = xmlToJson(xmlDoc); // 확인, console.log(jsonResult);
    const performances = jsonResult.dbs.db; // 확인, console.log(performances);
    
    // info Spread 
    for(let i = 0; i < 15; i++){ printElem(performances, i); }

    // 공연 정보 API 에서 공연 ID 만 추출 
    const performIdMap = performances.map(item => item.mt20id["#text"]);  // "#text" 노드 내용
    // 확인, console.log(performIdMap);

    // 로컬 스토리지에 공연 ID 여러 개를 저장 (키 : "performId", 값: 실제 ID 문자열)
      // 하나의 키에 여러 값을 저장
    localStorage.setItem('performId', JSON.stringify(performIdMap)); // 확인, console.log(localStorage.getItem('performId'));
    
    // 상세 사항 페이지로 이동하는 이벤트 리스너
    detailPageList();
  })
  .catch(err => console.error(`API 호출 오류 :`, err));

})

// 더보기 초기 설정 - 더보기 버튼 클릭 시 새로운 공연 정보 목록 15개 출력
moreInfo.onclick = () => plusMoreInfo('');

// 장르를 눌렀을 때, 새 쿼리 생성
 // genre 인 모든 요소를 찾아서 NodeList (배열과 유사한 리스트) 로 반환
 // 반환된 리스트의 각 요소를 순회하며 콜백 함수에 요소 하나씩 (e) 넘겨줌
 // e (각 .genre 요소) 에 클릭 이벤트 리스너를 붙임
const genres = document.querySelectorAll('.genre');

if(genres.length){
  genres.forEach(e => {
    e.addEventListener('click', key => {
      let id = key.target.id;
      if (key.target.classList.contains('p')) {
        id = key.target.classList[1];
      }
      // 해당 장르의 API 정보 불러오기 (초기화면 설정)
      fetchPage(id);
      // 클릭 이벤트 변경
      moreInfo.onclick = () => plusMoreInfo();

      // if (key.target.id != 'all') {
      //   fetchUrl += `&shcate=${key.target.id}`;
      // }

      // // 해당 장르의 API 정보 불러오기 (초기화면 설정)
      // fetchPage(fetchUrl, key.target.id);
      // // 클릭 이벤트 변경
      // moreInfo.onclick = () => plusMoreInfo(url);
    });
  });
} 

// fetchPage() - 장르별 초기화면 페이지 불러오기 
function fetchPage(keyTargetId) {
  // 현재 탐색중인 장르는 여러 번 부르지 않음
  if (keyTargetId == currentGenre) return;

  currentPage = 1;
  fetch(createURL(keyTargetId)).then(res => res.text())
    .then(xmlString => {
      // XML → JSON
      const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml');
      const jsonResult = xmlToJson(xmlDoc);
      const jsonArr = jsonResult.dbs.db;

      // '데이터가 없습니다.' 경고문
      const noData = document.querySelector('.noData');
      noData.classList.add('invisible');

      // 화면에 공연 목록과 더보기 버튼 출력
      // 1) 목록이 15개가 안 되면 더보기 버튼을 없앰
      // 2) 해당하는 공연이 없을 경우 데이터가 없다는 문구를 표시
      moreInfo.style.display = 'flex';
      infoList.innerHTML = '';
      for (let i = 0; i < rowsElem; i++) {
        try {
          printElem(jsonArr, i);
        } catch (error) {
          moreInfo.style.display = 'none';

          if (i == 0) {
            noData.classList.remove('invisible');
          }
          break;
        }
      }

      detailPageList();
    }).catch(console.log);

  // 클릭한 장르 강조 CSS 
  genres[genreIndex[currentGenre]].classList.remove('current');
  genres[genreIndex[keyTargetId]].classList.add('current');
  currentGenre = keyTargetId;
} 

// detailPageList() - 이미지 클릭 시 상세 페이지로 이동하는 메서드 
function detailPageList(){
  // <img> 에 Event Listener 달기 
  document.querySelectorAll('.detailPage').forEach(img => {

  img.addEventListener('click', event => {
      // href 로 바로 이동하는 것을 지연시킴 
      event.preventDefault();

      // 링크의 URL을 읽어올 때 사용
      // e.currentTarget.dataset.url 로도 사용 가능
      const apiUrl = event.target.dataset.url;

      localStorage.setItem('targetPageId',apiUrl);

      // 'http://127.0.0.1:5500/Project/html/pInfo.html';
      window.location.href = 'http://127.0.0.1:5500/html/pInfo.html';
      // link.href = 'http://127.0.0.1:5500/Project/html/pInfo.html';
      // event.setAttribute('href','http://127.0.0.1:5500/Project/html/pInfo.html');
    })
  }) 
}

// plusMoreInfo() - 더보기 정보 출력 메서드 (더보기 버튼)  
function plusMoreInfo(){
  currentPage++;

  // 공연 목록 조회 API 호출
  fetch(createURL(currentGenre)).then(res => res.text()) // text() 괄호 생략 X
  .then(xmlString => {
    const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml');

    const jsonResult = xmlToJson(xmlDoc);
    const jsonArr = jsonResult.dbs.db;

    moreInfo.style.display = 'flex';
    for (let i = 0; i < rowsElem; i++) {
      try {
        printElem(jsonArr, i);
      } catch (error) {
        moreInfo.style.display = 'none';
        break;
      }
    }
    detailPageList();
  })
  .catch(err => console.error(err));
}

// 출력 형태 지정 메서드
 // <li></li> 안의 <div> 를 display : table; 혹은 display : grid; 사용 
 function printElem(performances, idx){
  if (!performances[idx]) {
    throw new Error();
  }
  
  let item = performances[idx];
  let category = item.genrenm["#text"]; 
  let tmp = '';

  // categoryBadge 백그라운드 컬러 결정
   // 객체 구조 분해 할당 (Object Destructuring)
  let { bgc, bdColor, txtColor } = colorSet(category);

  tmp += `<li><div class = listInDiv>`;
  // imgDiv (img) 
  tmp += `<div class = "imgDiv hoverable">`;
    // 공연 상세 페이지 이동 링크 첨부
  tmp += `<a class="detailPage">`;
       // 이미지 경로
  tmp += `<img src = ${item.poster["#text"]} data-url="https://www.kopis.or.kr/openApi/restful/pblprfr/${item.mt20id["#text"]}?service=${authorKey}" height ="142">`;
  tmp += `</a>`;

  tmp += `</div>`; // img fin

  // explanationDiv (ex)
  tmp += `<div class = "explanationDiv">`;
    // 공연 장르명
  tmp += `<p class = "categoryBadge" style = "background-color:${bgc}; color:${txtColor}; border-color:${bdColor};">
        ${category}</p>`;
    // 공연명
  tmp += `<h4>${item.prfnm["#text"]}</h4>`;
    // 기간
  tmp += `<ul><li>기간 : ${item.prfpdfrom["#text"]}`;
  tmp += `~ ${item.prfpdto["#text"]}</li>`;
    // 장소
  tmp += `<li>장소 : ${item.fcltynm["#text"]}</li>`;

  tmp += `</ul>`;
  tmp += `</div>`; // ex fin
  tmp += `</div></li>`; // fin;
  
  infoList.innerHTML += tmp;
}


// 백그라운드 컬러 결정 메소드 
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

// pList.html fin -------------------------------------------------------------------------------------------
