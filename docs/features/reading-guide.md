# Reading Guide - 노래방 스타일 읽기 가이드 모드

> @DOC:GUIDE-001 | SPEC: .moai/specs/SPEC-GUIDE-001/spec.md | CODE: js/reading-guide.js | TEST: tests/guide/reading-guide.test.js

## 개요

Reading Guide는 텍스트를 읽을 때 노래방 자막처럼 현재 읽고 있는 단락을 강조하여 가독성을 높이는 기능입니다. WPM (Words Per Minute) 기반 자동 진행, 포커스 모드, 키보드 단축키를 지원합니다.

## 주요 기능

### 1. 단락 하이라이트

- **read-past**: 이미 읽은 단락 (회색, 투명도 40%)
- **read-current**: 현재 읽고 있는 단락 (강조 색상, 크기 확대)
- **read-future**: 아직 읽지 않은 단락 (기본 색상, 투명도 60%)

### 2. WPM 기반 자동 진행

- **WPM 범위**: 50~500 (기본값 200)
- **자동 계산**: 단락의 단어 수를 기준으로 읽는 시간 자동 계산
- **공식**: `delay = (wordCount / WPM) * 60 * 1000` (ms)

### 3. 포커스 모드

- 현재 읽고 있는 단락 외 모든 단락에 블러 효과 적용
- 집중도 향상 및 눈의 피로 감소

### 4. LocalStorage 저장

- WPM 설정 자동 저장
- 현재 단락 위치 저장
- 페이지 새로고침 시 이전 상태 복원

### 5. 키보드 단축키

| 키          | 동작                |
| ----------- | ------------------- |
| Space       | 자동 진행 토글      |
| →/↓         | 다음 단락           |
| ←/↑         | 이전 단락           |
| Escape      | 가이드 모드 종료    |

## 사용 방법

### 1. 기본 사용

```javascript
// ReadingGuide 인스턴스 생성
const guide = new ReadingGuide();

// 가이드 시작
guide.start();

// 다음/이전 단락 이동
guide.next();
guide.prev();

// 가이드 종료
guide.stop();
```

### 2. WPM 설정

```javascript
// WPM 설정 (50~500 범위)
guide.setWpm(300);

// 잘못된 WPM 설정 시 에러 발생
guide.setWpm(600); // Error: WPM must be between 50 and 500
```

### 3. 자동 진행

```javascript
// 자동 진행 활성화
guide.enableAutoProgress();

// 자동 진행 비활성화
guide.disableAutoProgress();
```

### 4. 포커스 모드

```javascript
// 포커스 모드 활성화
guide.enableFocusMode();

// 포커스 모드 비활성화
guide.disableFocusMode();
```

### 5. LocalStorage 저장/로드

```javascript
// 상태 저장 (자동)
guide.setWpm(250); // 자동으로 LocalStorage에 저장됨
guide.next();       // 현재 위치도 자동 저장

// 상태 로드
guide.loadState(); // 이전 WPM 및 위치 복원
```

## HTML 구조

```html
<!-- 포맷팅된 텍스트 출력 영역 -->
<div id="outputText">
  <p>첫 번째 단락입니다.</p>
  <p>두 번째 단락입니다.</p>
  <p>세 번째 단락입니다.</p>
</div>

<!-- 가이드 컨트롤 패널 -->
<div class="guide-controls">
  <button id="guideToggle">📖 가이드 시작</button>
  <button id="guidePrev">◀</button>
  <button id="guideNext">▶</button>
  <button id="guideFocus">🎯 포커스</button>
  <input type="range" id="guideWpm" min="50" max="500" value="200">
  <span id="guideWpmValue">200</span>
</div>
```

## CSS 클래스

### 단락 상태 클래스

```css
/* 읽은 단락 */
.read-past {
    opacity: 0.4;
    color: var(--text-secondary);
}

/* 현재 단락 */
.read-current {
    background: linear-gradient(120deg, var(--accent-color) 0%, var(--accent-hover) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    transform: scale(1.02);
}

/* 미래 단락 */
.read-future {
    opacity: 0.6;
}
```

### 포커스 모드 클래스

```css
/* 포커스 모드 활성화 */
#outputText.guide-focus p {
    filter: blur(3px);
}

#outputText.guide-focus p.read-current {
    filter: blur(0);
}
```

## 이벤트 흐름

```
사용자가 "가이드 시작" 버튼 클릭
    ↓
ReadingGuide.start() 호출
    ↓
outputText에서 모든 <p> 태그 수집
    ↓
currentIndex = 0, 첫 단락에 .read-current 추가
    ↓
키보드 이벤트 핸들러 등록
    ↓
사용자가 스페이스바 입력
    ↓
enableAutoProgress() 호출
    ↓
현재 단락의 단어 수 계산
    ↓
WPM 기반 delay 계산
    ↓
setTimeout으로 다음 단락 예약
    ↓
(반복)
```

## 테스트 커버리지

- **총 테스트 케이스**: 16개
- **테스트 커버리지**: 100%
- **테스트 카테고리**:
  - 초기화: 3개
  - 단락 하이라이트: 3개
  - 자동 진행: 2개
  - 포커스 모드: 2개
  - LocalStorage: 3개
  - 키보드 이벤트: 3개

## 성능 최적화

### 1. 메모리 관리

- 이벤트 핸들러 등록/해제 (stop 시 자동 정리)
- 타이머 정리 (disableAutoProgress 시 clearTimeout)

### 2. DOM 조작 최소화

- 단락 목록 캐싱 (start 시 한 번만 수집)
- 클래스 추가/제거만 사용 (DOM 재구성 없음)

### 3. 접근성

- prefers-reduced-motion 지원 (애니메이션 비활성화)
- ARIA 레이블 지원 (스크린 리더 호환)
- 키보드 접근성 100%

## 제약사항

- **파일 크기**: 265 LOC (제약: ≤300 LOC) ✅
- **함수 크기**: 최대 40 LOC (제약: ≤50 LOC) ✅
- **WPM 범위**: 50~500 (하드코딩된 제약)
- **지원 브라우저**: ES6 모듈, CSS Grid 지원 브라우저

## 향후 개선 사항

- [ ] 단어 단위 하이라이트 (현재는 단락 단위)
- [ ] 사용자 정의 컬러 스킴
- [ ] 읽기 진행률 프로그레스 바
- [ ] 북마크 기능
- [ ] 다국어 지원 (현재는 한국어/영어만)

## 라이선스

MIT License

## 작성자

- **SPEC**: .moai/specs/SPEC-GUIDE-001/spec.md
- **구현**: js/reading-guide.js
- **테스트**: tests/guide/reading-guide.test.js
- **날짜**: 2025-10-21
