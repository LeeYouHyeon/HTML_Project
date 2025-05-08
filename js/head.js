// 로고
document.getElementById('logo').onclick = () => {
  location.href = 'http://127.0.0.1:5500/html/mainPage.html';
}

const current = localStorage.getItem('user');
const lis = document.querySelectorAll('#headMenu li');

// 공지사항
function toNotices() {
  location.href = 'http://127.0.0.1:5500/html/notices.html';
}

// 로그인 / 유저 정보
if (current == null) {
  // 로그인
  lis[1].innerText = '로그인';
  lis[1].classList.add('hoverable');
  lis[1].onclick = () => {
    location.href = 'http://127.0.0.1:5500/html/login.html';
  };
} else {
  // 관리자 계정
  lis[1].innerText = '관리자 계정입니다. (서울)';

  document.querySelector('#headMenu>ul').innerHTML += '<li>로그아웃</li>';
  const logout = document.querySelectorAll('#headMenu li')[2];
  logout.classList.add('hoverable');
  logout.onclick = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('ls_value');
    location.reload();
  };
}