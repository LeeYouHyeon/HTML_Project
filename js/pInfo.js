// 전역 변수 선언
let intro = document.getElementsByClassName('contents')[0];
let place = document.getElementsByClassName('contents')[1];
let jrr, placeJSON;

// 문서 이동 시 로드되는 페이지  
document.addEventListener('DOMContentLoaded',() => {
  const apiUrl = localStorage.getItem('targetPageId'); // 확인, 
  console.log(apiUrl);

  fetch(apiUrl).then(res => res.text())
  .then(xmlString => {
    const xmlDoc = new DOMParser().parseFromString(xmlString,'text/xml');
    const jsonResult = xmlToJson(xmlDoc);
    const jsonArr = jsonResult.dbs.db; // 확인,
    jrr = jsonArr;

    detailPagePrint(jsonArr);
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

  console.log(jsonArr.genrenm["#text"]);

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


  const contents = document.querySelectorAll('.contents');
  // 소개 부분 채우기
  for (const styImg of jrr.styurls.styurl) {
    contents[0].innerHTML += `<img src="${styImg['#text']}" width="1000">`;
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
    fields[2].innerHTML = `<a href="${jsonArr.relateurl["#text"]}">${jsonArr.relateurl["#text"]}</a>`;
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