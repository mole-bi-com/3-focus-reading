# 📋 구현 계획서 - SPEC-GUIDE-001

> **노래방 스타일 읽기 가이드 모드**
>
> 버전: v0.0.1 | 작성일: 2025-10-21 | 작성자: @seungwoolee

---

## 🎯 구현 목표

사용자가 텍스트를 읽을 때 노래방 가사처럼 가이드를 제공하여 집중도를 높이는 기능을 개발합니다.

### 핵심 가치
- ✅ **집중도 향상**: 현재 읽어야 할 부분을 명확히 표시
- ✅ **속도 조절**: 개인별 최적 읽기 속도 설정
- ✅ **접근성**: ADHD, 난독증 사용자 지원
- ✅ **사용자 경험**: 직관적이고 부드러운 인터랙션

---

## 📊 구현 범위

### Phase 1: 핵심 기능 구현 (4~6시간)

#### 1.1 Progressive Line Highlighting (2시간)
- [ ] 단락 상태 관리 클래스 구현 (`ParagraphState`)
- [ ] 현재/과거/미래 단락 스타일 적용
- [ ] CSS 클래스 정의 (`.read-past`, `.read-current`, `.read-future`)
- [ ] 단락 간 전환 애니메이션 (transition)

#### 1.2 UI 컨트롤 패널 (1.5시간)
- [ ] 가이드 모드 토글 버튼
- [ ] 자동 진행 버튼 (재생/일시정지)
- [ ] WPM 슬라이더 (50~500 범위)
- [ ] 진행 상황 표시 바
- [ ] 반응형 디자인 (모바일 대응)

#### 1.3 Auto-Scroll 기능 (1.5시간)
- [ ] WPM 기반 타이머 로직
- [ ] 자동 단락 이동 함수
- [ ] 일시정지/재개 기능
- [ ] 속도 조절 (+/- 10 WPM)

#### 1.4 키보드 단축키 (1시간)
- [ ] `G`: 가이드 모드 ON/OFF
- [ ] `Space`: 일시정지/재개
- [ ] `↑/↓`: 단락 이동
- [ ] `+/-`: 속도 조절
- [ ] `F`: 포커스 모드 ON/OFF
- [ ] `Esc`: 가이드 모드 종료

### Phase 2: 고급 기능 구현 (2~3시간)

#### 2.1 Focus Mode (1시간)
- [ ] 현재 단락 외 블러 처리
- [ ] 블러 강도 조절 (0~5px)
- [ ] 포커스 모드 토글 UI
- [ ] CSS 필터 최적화

#### 2.2 설정 저장 및 복원 (1시간)
- [ ] LocalStorage 스키마 정의
- [ ] 설정 저장 함수
- [ ] 설정 로드 함수
- [ ] 읽던 위치 자동 복원
- [ ] 오류 처리 (용량 초과 등)

#### 2.3 성능 최적화 (1시간)
- [ ] Intersection Observer 적용
- [ ] `requestAnimationFrame` 최적화
- [ ] 메모리 누수 방지
- [ ] 60fps 애니메이션 보장

### Phase 3: 테스트 및 품질 검증 (2~3시간)

#### 3.1 단위 테스트 (1시간)
- [ ] `ReadingGuide` 클래스 테스트
- [ ] WPM 범위 검증 테스트
- [ ] 단락 상태 전환 테스트
- [ ] LocalStorage 저장/로드 테스트

#### 3.2 통합 테스트 (1시간)
- [ ] 가이드 모드 활성화 플로우
- [ ] 자동 진행 기능 테스트
- [ ] 포커스 모드 동작 확인
- [ ] 설정 복원 테스트

#### 3.3 성능 테스트 (0.5시간)
- [ ] Chrome DevTools Performance 프로파일링
- [ ] 1000개 단락 스트레스 테스트
- [ ] 메모리 사용량 측정

#### 3.4 접근성 테스트 (0.5시간)
- [ ] 키보드 네비게이션 확인
- [ ] ARIA 레이블 검증
- [ ] 스크린 리더 테스트
- [ ] 고대비 모드 확인

### Phase 4: 문서화 (1~2시간)

#### 4.1 사용자 문서 (1시간)
- [ ] README 업데이트 (기능 소개)
- [ ] 사용 가이드 작성
- [ ] 키보드 단축키 목록
- [ ] FAQ 작성

#### 4.2 개발자 문서 (1시간)
- [ ] API 문서 작성
- [ ] 코드 주석 추가
- [ ] 아키텍처 다이어그램
- [ ] 트러블슈팅 가이드

---

## 🏗️ 아키텍처 설계

### 클래스 구조

```
ReadingGuideApp
├── ReadingGuide (메인 클래스)
│   ├── state: GuideState
│   ├── paragraphs: ParagraphState[]
│   ├── settings: GuideSettings
│   └── timer: AutoScrollTimer
├── GuideController (UI 컨트롤)
│   ├── buttons
│   ├── sliders
│   └── progressBar
└── FocusMode (포커스 기능)
    ├── blurIntensity
    └── applyBlur()
```

### 파일 구조

```
reading-tablet/
├── index.html                    # 가이드 버튼 추가
├── js/
│   ├── reading-guide.js          # @CODE:GUIDE-001 - 메인 로직
│   ├── guide-controller.js       # @CODE:GUIDE-001 - UI 컨트롤
│   ├── focus-mode.js             # @CODE:GUIDE-001 - 포커스 기능
│   └── app.js                    # 통합 (기존 파일 수정)
├── css/
│   └── reading-guide.css         # @CODE:GUIDE-001 - 스타일
└── tests/
    └── guide/
        ├── reading-guide.test.js  # @TEST:GUIDE-001
        ├── guide-controller.test.js
        └── focus-mode.test.js
```

---

## 🔧 기술 스택 세부사항

### JavaScript APIs

#### 1. Intersection Observer API
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 현재 보이는 단락 감지
    }
  });
}, {
  threshold: 0.5
});
```

**사용 이유**: 현재 뷰포트에 있는 단락을 효율적으로 감지

#### 2. Web Animations API
```javascript
paragraph.animate([
  { backgroundColor: 'transparent' },
  { backgroundColor: 'var(--highlight-color)' }
], {
  duration: 300,
  easing: 'ease-in-out',
  fill: 'forwards'
});
```

**사용 이유**: 60fps 부드러운 애니메이션 보장

#### 3. LocalStorage API
```javascript
const settings = {
  wpm: 200,
  focusMode: false,
  lastPosition: 5
};
localStorage.setItem('reading-guide-settings', JSON.stringify(settings));
```

**사용 이유**: 사용자 설정 및 진행 상황 영구 저장

### CSS 기법

#### 1. CSS Variables (테마 일관성)
```css
:root {
  --guide-highlight-color: #4361ee;
  --guide-blur-intensity: 2px;
  --guide-animation-duration: 0.3s;
}
```

#### 2. Transitions (부드러운 전환)
```css
.text-area.output p {
  transition: background-color 0.3s ease,
              opacity 0.3s ease,
              filter 0.3s ease;
}
```

#### 3. Filters (포커스 모드)
```css
.read-past,
.read-future {
  filter: blur(var(--guide-blur-intensity));
  opacity: 0.3;
}
```

---

## 📈 성능 목표

| 항목 | 목표 | 측정 방법 |
|-----|------|----------|
| 애니메이션 FPS | ≥60 | Chrome DevTools Performance |
| 응답 시간 | <100ms | Performance.now() |
| 메모리 사용 | <10MB | Chrome DevTools Memory |
| 초기 로딩 | <200ms | DOMContentLoaded 이벤트 |
| LocalStorage 용량 | <5KB | 저장 데이터 크기 측정 |

---

## 🧪 테스트 시나리오

### 시나리오 1: 가이드 모드 활성화
**Given**: 포맷팅된 텍스트가 출력창에 표시됨
**When**: "가이드 모드" 버튼 클릭
**Then**:
- 첫 번째 단락에 하이라이트 적용
- 가이드 컨트롤 패널 표시
- 진행 상황 "0% (1/N)"로 초기화

### 시나리오 2: 자동 진행
**Given**: 가이드 모드 활성화, WPM = 200
**When**: "자동 진행" 버튼 클릭
**Then**:
- 200 WPM 속도로 자동 이동
- 진행 상황 실시간 업데이트
- 마지막 단락 도달 시 자동 정지

### 시나리오 3: 포커스 모드
**Given**: 가이드 모드 활성화
**When**: "포커스 모드" 토글 ON
**Then**:
- 현재 단락만 선명 (opacity: 1.0)
- 나머지 단락 블러 (blur: 2px, opacity: 0.3)

### 시나리오 4: 설정 저장 및 복원
**Given**: 가이드 모드 사용 중 (WPM=250, 5번째 단락)
**When**: 페이지 새로고침
**Then**:
- WPM = 250으로 복원
- 5번째 단락으로 자동 이동
- 포커스 모드 상태 유지

---

## 🚀 TDD 구현 순서

### RED Phase (테스트 작성)

#### Step 1: 기본 구조 테스트
```javascript
describe('ReadingGuide', () => {
  it('should initialize with default settings', () => {
    const guide = new ReadingGuide();
    expect(guide.settings.wpm).toBe(200);
    expect(guide.enabled).toBe(false);
  });
});
```

#### Step 2: WPM 검증 테스트
```javascript
it('should constrain WPM to valid range', () => {
  const guide = new ReadingGuide();
  guide.setWPM(1000); // 초과
  expect(guide.settings.wpm).toBe(200); // 기본값으로 리셋
});
```

#### Step 3: 단락 상태 전환 테스트
```javascript
it('should transition paragraph states correctly', () => {
  const guide = new ReadingGuide();
  guide.enable();
  expect(paragraphs[0].status).toBe('current');
  guide.nextParagraph();
  expect(paragraphs[0].status).toBe('past');
  expect(paragraphs[1].status).toBe('current');
});
```

### GREEN Phase (최소 구현)

```javascript
class ReadingGuide {
  constructor() {
    this.settings = { wpm: 200, focusMode: false };
    this.enabled = false;
    this.paragraphs = [];
  }

  setWPM(wpm) {
    if (wpm < 50 || wpm > 500) {
      this.settings.wpm = 200;
    } else {
      this.settings.wpm = wpm;
    }
  }

  enable() {
    this.enabled = true;
    if (this.paragraphs.length > 0) {
      this.paragraphs[0].status = 'current';
    }
  }

  nextParagraph() {
    const currentIndex = this.paragraphs.findIndex(p => p.status === 'current');
    if (currentIndex >= 0 && currentIndex < this.paragraphs.length - 1) {
      this.paragraphs[currentIndex].status = 'past';
      this.paragraphs[currentIndex + 1].status = 'current';
    }
  }
}
```

### REFACTOR Phase (품질 개선)

- 코드 중복 제거
- 성능 최적화 (`requestAnimationFrame` 적용)
- 접근성 개선 (ARIA 레이블)
- 주석 추가 (JSDoc)

---

## 📦 Git 워크플로우

### 브랜치 전략 (Personal 모드)
```bash
# 1. 브랜치 생성
git checkout -b feature/SPEC-GUIDE-001

# 2. 커밋 전략 (TDD 단계별)
git commit -m "🔴 RED: GUIDE-001 기본 구조 테스트"
git commit -m "🟢 GREEN: GUIDE-001 ReadingGuide 클래스 구현"
git commit -m "♻️ REFACTOR: GUIDE-001 성능 최적화"

# 3. 최종 병합
git checkout main
git merge feature/SPEC-GUIDE-001 --no-ff
```

---

## ⚠️ 리스크 및 대응

| 리스크 | 영향 | 확률 | 대응 방안 |
|-------|-----|-----|----------|
| 브라우저 호환성 이슈 | 중 | 중 | Polyfill 적용, 기능 감지 후 폴백 |
| 성능 저하 (대용량 텍스트) | 높음 | 중 | 가상 스크롤, Intersection Observer 최적화 |
| LocalStorage 용량 초과 | 낮음 | 낮음 | 기본 설정 사용, 압축 저장 |
| 키보드 단축키 충돌 | 중 | 낮음 | 사용자 커스터마이징 제공 |
| 접근성 미준수 | 중 | 중 | ARIA 레이블, 키보드 네비게이션 철저히 테스트 |

---

## 📅 예상 일정

### 총 예상 시간: 8~12시간

| Phase | 작업 내용 | 예상 시간 |
|-------|---------|----------|
| Phase 1 | 핵심 기능 구현 | 4~6시간 |
| Phase 2 | 고급 기능 구현 | 2~3시간 |
| Phase 3 | 테스트 및 품질 검증 | 2~3시간 |
| Phase 4 | 문서화 | 1~2시간 |

### 마일스톤

- **M1 (50%)**: Phase 1 완료 - 기본 가이드 기능 동작
- **M2 (75%)**: Phase 2 완료 - 모든 기능 구현
- **M3 (90%)**: Phase 3 완료 - 테스트 통과
- **M4 (100%)**: Phase 4 완료 - 문서화 및 배포 준비

---

## 🎓 학습 리소스

### 필수 학습 자료
1. [Intersection Observer API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
2. [Web Animations API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
3. [LocalStorage - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### 참고 사례
1. Microsoft Immersive Reader - Line Focus 기능
2. Helperbird - Reading Ruler 구현
3. AccelaReader - RSVP 기술 적용

---

## ✅ 완료 기준 (Definition of Done)

- [ ] 모든 단위 테스트 통과 (커버리지 ≥85%)
- [ ] 통합 테스트 통과
- [ ] 성능 목표 달성 (60fps, <100ms 응답)
- [ ] 접근성 검증 완료 (WCAG 2.1 AA 준수)
- [ ] 코드 리뷰 완료
- [ ] 문서화 완료 (README, API 문서)
- [ ] `@TAG` 체인 검증 (@SPEC, @TEST, @CODE 연결)
- [ ] TRUST 5원칙 준수 확인

---

**다음 단계**: `/alfred:2-build GUIDE-001`로 TDD 구현 시작

**작성자**: @seungwoolee | **날짜**: 2025-10-21 | **버전**: v0.0.1
