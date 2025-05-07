// 인증키 : da5b83d91e3f40e0b76a7dc5eb9196bf  
const authorKey = "da5b83d91e3f40e0b76a7dc5eb9196bf";
let startDate = "20250501";
let endDate = "20250531";


// mainPage.html -------------------------------------------------------------------------------------------
const ls = document.getElementById('localSelect');
const startBtn = document.getElementById('startBtn');

// main Page 에서 주소 선택
 // 주소 선택 시 value 를 Local storage 에 저장  
if(startBtn){
  startBtn.addEventListener('click',() => {
    let ls_value = ls.value;
    if (ls_value == '' && localStorage.getItem('user') == 'admin') {
      ls_value = '11';
    }
    if(!ls_value) {
      alert('지역을 선택하세요 !');
      return;
    }
  
    // 문자열로 저장됨 
    localStorage.setItem('localValue',ls_value);
    
    // console.log(localStorage.getItem('localValue'));
  
    location.href = "http://127.0.0.1:5500/html/pList.html";
  })
}
// mainPage.html fin -------------------------------------------------------------------------------------------


// // pInfo.html -------------------------------------------------------------------------------------------
//   // 장르를 눌렀을 때, 새 쿼리 생성 
//   document.querySelectorAll('.genre').forEach(e => {
//     e.addEventListener('click', key => {
//       console.log(key.target.id);
//     });
//   });

//   // 로컬 스토리지에 저장된 공연 ID 를 이용해 공연 상세 조회 API 호출


// // pInfo.html fin -------------------------------------------------------------------------------------------
