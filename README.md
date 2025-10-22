# 🎯 3-focus-reading

3문장 슬라이딩 윈도우 기반 집중 읽기 도구

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 프로젝트 개요

3-focus-reading은 **3문장 슬라이딩 윈도우 방식**으로 텍스트 집중도를 높이는 웹 애플리케이션입니다.

특히 다음과 같은 상황에서 유용합니다:
- YouTube 자막/트랜스크립트 정리
- 연속된 텍스트의 단락 구분
- 타임스탬프 기준 내용 분리
- 긴 문장의 가독성 개선

## ✨ 주요 기능

### 📝 스마트 포맷팅
- **타임스탬프 감지**: `(00:00)` 형식의 타임스탬프를 자동으로 감지하여 단락 분리
- **문장 구분**: 문장 종결 기호를 인식하여 적절한 간격 추가
- **공백 정리**: 불필요한 연속 공백 제거
- **단락 최적화**: 긴 단락을 읽기 편한 크기로 자동 분할

### 🎨 사용자 맞춤 설정
- **다크 모드**: 눈의 피로를 줄이는 다크 테마 지원
- **폰트 크기 조절**: 4단계 폰트 크기 선택 (작게/보통/크게/매우 크게)
- **자동 저장**: 작성 중인 내용 자동 저장 (LocalStorage)

### 💾 파일 관리
- **파일 불러오기**: `.txt`, `.md` 파일 업로드 지원
- **결과 저장**: 포맷팅된 텍스트를 파일로 다운로드
- **클립보드 복사**: 원클릭으로 결과 복사

### ⌨️ 키보드 단축키
- `Ctrl/Cmd + Enter`: 텍스트 포맷팅
- `Ctrl/Cmd + D`: 결과 다운로드

## 🚀 시작하기

### 설치

이 프로젝트는 **별도의 설치가 필요 없습니다**. HTML 파일을 브라우저에서 바로 실행할 수 있습니다.

```bash
# 저장소 클론
git clone https://github.com/yourusername/reading-tablet.git

# 디렉토리 이동
cd reading-tablet

# index.html을 브라우저로 열기
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### 사용 방법

1. **텍스트 입력**
   - 좌측 입력창에 텍스트를 붙여넣거나
   - "📁 파일 불러오기" 버튼으로 파일 업로드

2. **포맷팅 실행**
   - "✨ 포맷팅" 버튼 클릭 또는 `Ctrl/Cmd + Enter`

3. **결과 확인**
   - 우측 출력창에서 포맷팅된 결과 확인
   - 타임스탬프가 하이라이트되어 표시됨

4. **결과 활용**
   - "📋 복사" 버튼으로 클립보드에 복사
   - "💾 저장" 버튼으로 파일 다운로드

## 📂 프로젝트 구조

```
reading-tablet/
├── index.html          # 메인 HTML 파일
├── css/
│   └── style.css      # 스타일시트
├── js/
│   ├── formatter.js   # 텍스트 포맷팅 로직
│   └── app.js         # 메인 애플리케이션 로직
└── README.md          # 프로젝트 문서
```

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: CSS Variables, Grid, Flexbox
- **Vanilla JavaScript**: ES6+ 문법, 클래스 기반 구조
- **LocalStorage API**: 자동 저장 및 설정 관리

## 🎨 디자인 특징

### 타이포그래피
- 한글 최적화 폰트 스택 사용
- 가독성을 위한 1.8 줄간격
- 60-80자 최적 줄 길이

### 반응형 디자인
- 데스크톱, 태블릿, 모바일 모두 지원
- 터치 친화적 인터페이스

### 접근성
- ARIA 레이블 지원
- 키보드 네비게이션
- 고대비 모드 지원

## 📊 포맷팅 로직

### 1. 타임스탬프 감지
```
입력: (00:00) 첫 번째 문장입니다. (00:20) 두 번째 문장입니다.
출력:
(00:00) 첫 번째 문장입니다.

(00:20) 두 번째 문장입니다.
```

### 2. 문장 간격 조정
```
입력: 문장1입니다.문장2입니다.
출력: 문장1입니다. 문장2입니다.
```

### 3. 연속 공백 제거
```
입력: 여러    개의     공백
출력: 여러 개의 공백
```

## 🌟 예시

### Before (원본)
```
(393) 생명과학을 위한 클로드 소개 - YouTube https://www.youtube.com/watch?v=sHImlfVM9r4 트랜스크립트: (00:00) - 결국 문제를 해결하기 위해 많은 사람들이 방법으로 연구실에서 의학연서 3개월이 걸렸습니다. 저는 Claude에게 이 문제를 제기했습니다. "이봐요, 이렇게 하면 이 문제를 풀 수 있을까요?"라고 물었죠. 그랬더니 1분 만에 클리우드는 단 한 번의 답변으로 답을 내놓았습니다. - 안녕하세요, 저는 조나 클라입니다...
```

### After (포맷팅 결과)
```
(00:00) 결국 문제를 해결하기 위해 많은 사람들이 방법으로 연구실에서 의학연서 3개월이 걸렸습니다. 저는 Claude에게 이 문제를 제기했습니다. "이봐요, 이렇게 하면 이 문제를 풀 수 있을까요?"라고 물었죠. 그랬더니 1분 만에 클리우드는 단 한 번의 답변으로 답을 내놓았습니다.

안녕하세요, 저는 조나 클라입니다...
```

## 🔧 개발자 가이드

### 포맷팅 규칙 커스터마이징

`js/formatter.js` 파일에서 포맷팅 로직을 수정할 수 있습니다:

```javascript
class TextFormatter {
    constructor() {
        // 타임스탬프 패턴 수정
        this.timestampPattern = /\((\d{1,2}:\d{2})\)/g;

        // 문장 종결 패턴 수정
        this.sentenceEndPattern = /([.!?])\s+/g;
    }
}
```

### 스타일 커스터마이징

`css/style.css`의 CSS 변수를 수정하여 디자인 변경:

```css
:root {
    --accent-color: #4361ee;  /* 메인 색상 */
    --font-base: 16px;        /* 기본 폰트 크기 */
    --line-height-reading: 1.8; /* 줄간격 */
}
```

## 📱 브라우저 지원

- ✅ Chrome/Edge (최신 버전)
- ✅ Firefox (최신 버전)
- ✅ Safari (최신 버전)
- ✅ 모바일 브라우저 (iOS Safari, Chrome Mobile)

## 🤝 기여하기

버그 리포트, 기능 제안, Pull Request 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 👨‍💻 제작자

**3-focus-reading Team**

## 🙏 감사의 말

이 프로젝트는 가독성이 떨어지는 텍스트로 고민하는 모든 분들을 위해 만들어졌습니다.

---

**Made with ❤️ for better reading experience**
