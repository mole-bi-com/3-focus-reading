---
id: UI-001
version: 0.1.0
status: completed
created: 2025-10-22
updated: 2025-10-22
author: @seungwoolee
priority: high
category: feature
labels:
  - ui
  - layout
  - 3-focus-reading
  - compact-design
scope:
  packages:
    - ui
  files:
    - css/style.css
    - index.html
---

# @SPEC:UI-001: UI 컴팩트화 (3문장 윈도우 최적화)

## HISTORY

### v0.1.0 (2025-10-22)
- **IMPLEMENTATION COMPLETED**: UI 컴팩트화 완료 (version: 0.0.1 → 0.1.0, status: draft → completed)
- **AUTHOR**: @seungwoolee
- **CHANGES**:
  - 레이아웃 비율 변경: 50:50 → 30:70 (입력 축소, 출력 확대)
  - 출력창 센터 정렬: max-width 600px (3문장 최적 너비)
  - 여백 최적화: padding/margin 축소, line-height 1.8 → 1.6
  - 포커스 모드 강화: 입력창 숨김, 출력창 700px 센터 정렬
  - 반응형 디자인: 데스크톱(30/70), 태블릿(35/65), 모바일(세로 스택)
- **TAG CHAIN**: @SPEC:UI-001 → @CODE:UI-001 (css/style.css)
- **COMPATIBILITY**: 기존 JavaScript 코드 100% 호환 (CSS만 수정)

### v0.0.1 (2025-10-22)
- **INITIAL**: 3문장 슬라이딩 윈도우에 최적화된 컴팩트 레이아웃 명세 작성
- **AUTHOR**: @seungwoolee
- **SCOPE**: 출력창 레이아웃 재설계, 3문장 전용 컨테이너 추가
- **CONTEXT**: 현재 레이아웃이 전체 텍스트 표시에 최적화되어 있어, 3문장 집중 읽기 시 불필요한 여백과 넓은 화면이 집중을 방해함

---

## Environment (환경)

### 시스템 환경
- **플랫폼**: 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 버전)
- **화면 크기**: 데스크톱 (1024px 이상), 태블릿 (768px~1023px), 모바일 (767px 이하)
- **CSS 프레임워크**: Vanilla CSS (CSS3 Features)

### 전제 조건
- index.html이 존재함
- css/style.css가 존재함
- 3문장 슬라이딩 윈도우 기능이 구현되어 있음 (SPEC-GUIDE-001)

---

## Assumptions (가정)

### 기술적 가정
1. 브라우저가 CSS Grid, Flexbox를 지원함
2. 브라우저가 CSS Variables를 지원함
3. 반응형 디자인 적용 가능

### 비즈니스 가정
1. 사용자가 3문장 윈도우에 집중하길 원함
2. 좁은 레이아웃이 집중도를 높임
3. 불필요한 여백 제거가 사용자 경험을 개선함

### 사용자 가정
1. 사용자가 한 번에 3문장만 읽기를 원함
2. 사용자가 왼쪽 입력창을 자주 사용하지 않음 (입력 후 읽기만)
3. 사용자가 깔끔한 UI를 선호함

---

## Requirements (요구사항)

### Ubiquitous Requirements (기본 요구사항)

1. 시스템은 3문장 윈도우에 최적화된 레이아웃을 제공해야 한다
2. 시스템은 출력창 너비를 축소하여 집중도를 높여야 한다
3. 시스템은 불필요한 여백을 제거하여 화면을 효율적으로 사용해야 한다
4. 시스템은 반응형 디자인을 제공해야 한다

### Event-driven Requirements (이벤트 기반)

1. **WHEN** 사용자가 포맷팅 버튼을 클릭하면, 출력창이 3문장 윈도우 모드로 전환되어야 한다
2. **WHEN** 사용자가 화면 크기를 조절하면, 레이아웃이 자동으로 반응해야 한다
3. **WHEN** 사용자가 포커스 모드를 활성화하면, 출력창이 화면 중앙에 정렬되어야 한다
4. **WHEN** 사용자가 입력창을 축소하면, 출력창 너비가 자동으로 확장되어야 한다

### State-driven Requirements (상태 기반)

1. **WHILE** 3문장 윈도우 모드가 활성화된 상태일 때, 출력창 너비는 40% 이하여야 한다
2. **WHILE** 포커스 모드가 활성화된 상태일 때, 출력창만 표시되어야 한다
3. **WHILE** 모바일 화면일 때, 입력창과 출력창이 세로로 배치되어야 한다

### Optional Features (선택적 기능)

1. **WHERE** 사용자가 레이아웃을 커스터마이징하면, 설정을 LocalStorage에 저장할 수 있다
2. **WHERE** 사용자가 다크 모드를 활성화하면, 컬러 스킴이 변경될 수 있다
3. **WHERE** 사용자가 폰트 크기를 조절하면, 출력창 너비가 자동으로 조정될 수 있다

### Constraints (제약사항)

1. **IF** 출력창 너비가 300px 미만이면, 자동으로 300px로 조정해야 한다
2. **IF** 화면 너비가 768px 미만이면, 입력창과 출력창이 세로로 배치되어야 한다
3. 여백(padding, margin)은 최소화하되, 가독성을 해치지 않아야 한다
4. 모든 변경은 기존 JavaScript 코드와 호환되어야 한다

---

## Core Features (핵심 기능)

### 1. 출력창 너비 축소 (50% → 40%)

**현재 상태**:
```css
.output-container {
  width: 50%;
  padding: 20px;
}
```

**변경 후**:
```css
.output-container {
  width: 40%;
  max-width: 600px;  /* 최대 너비 제한 */
  min-width: 300px;  /* 최소 너비 보장 */
  padding: 12px;     /* 여백 축소 */
  margin: 0 auto;    /* 중앙 정렬 */
}
```

**변경 이유**:
- 3문장 윈도우는 좁은 영역에서 읽기 집중도가 높음
- 40% 너비가 3문장 표시에 최적 (약 600px)
- 좌우 여백 확보로 시각적 집중 유도

### 2. 불필요한 여백 제거

**변경 대상**:
```css
/* 현재 */
.container {
  padding: 40px;
  margin: 20px;
}

.output-text p {
  margin: 16px 0;
  line-height: 1.8;
}
```

**변경 후**:
```css
/* 컴팩트 레이아웃 */
.container {
  padding: 16px;  /* 40px → 16px */
  margin: 0;      /* 20px → 0 */
}

.output-text p {
  margin: 8px 0;  /* 16px → 8px */
  line-height: 1.6; /* 1.8 → 1.6 */
}
```

**변경 이유**:
- 불필요한 공간 제거로 화면 효율성 증대
- 3문장 윈도우가 화면 내에 모두 표시되도록 함

### 3. 3문장 전용 컨테이너 추가

**새로운 CSS 클래스**:
```css
.three-sentence-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.three-sentence-window {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
```

**HTML 구조**:
```html
<div class="output-container">
  <div class="three-sentence-container">
    <div class="three-sentence-window" id="outputText">
      <!-- 3문장 하이라이트 영역 -->
    </div>
  </div>
</div>
```

### 4. 반응형 레이아웃

**데스크톱 (1024px 이상)**:
```css
@media (min-width: 1024px) {
  .input-container {
    width: 35%;
  }
  .output-container {
    width: 40%;
  }
  .controls-container {
    width: 25%;
  }
}
```

**태블릿 (768px ~ 1023px)**:
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .input-container {
    width: 45%;
  }
  .output-container {
    width: 55%;
  }
  .controls-container {
    width: 100%;
    order: 3;
  }
}
```

**모바일 (767px 이하)**:
```css
@media (max-width: 767px) {
  .input-container,
  .output-container,
  .controls-container {
    width: 100%;
    display: block;
  }

  .three-sentence-container {
    max-width: 100%;
    padding: 8px;
  }
}
```

---

## UI/UX Specifications (UI/UX 명세)

### 레이아웃 구조

**변경 전 (50/50 레이아웃)**:
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │                      │  │                      │      │
│  │   입력창 (50%)       │  │   출력창 (50%)       │      │
│  │                      │  │                      │      │
│  └──────────────────────┘  └──────────────────────┘      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**변경 후 (35/40 레이아웃, 25% 여백)**:
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌──────────┐  ┌──────────────────┐  ┌──────────┐        │
│  │ 입력창   │  │   출력창 (40%)   │  │ 컨트롤   │        │
│  │ (35%)    │  │  max-width:600px │  │ (25%)    │        │
│  │          │  │   3문장 윈도우    │  │          │        │
│  └──────────┘  └──────────────────┘  └──────────┘        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 컬러 스킴

**하이라이트 색상** (기존 유지):
- 현재 문장: `background: #ffeb3b` (노란색)
- 이전 문장: `opacity: 0.5` (회색)
- 다음 문장: `opacity: 1.0` (보통)

**컨테이너 색상** (새로 추가):
- 배경: `#ffffff` (흰색)
- 테두리: `#e0e0e0` (연한 회색)
- 그림자: `0 2px 8px rgba(0, 0, 0, 0.1)` (부드러운 그림자)

### 타이포그래피

**폰트 크기**:
- 제목: `18px` (기존 20px → 축소)
- 본문: `16px` (유지)
- 캡션: `14px` (유지)

**줄 간격**:
- 본문: `line-height: 1.6` (기존 1.8 → 축소)
- 제목: `line-height: 1.4` (유지)

---

## Technical Specifications (기술 명세)

### CSS Grid 레이아웃

```css
.main-container {
  display: grid;
  grid-template-columns: 35% 40% 25%;
  gap: 16px;
  padding: 16px;
  min-height: 100vh;
}

@media (max-width: 767px) {
  .main-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
}
```

### CSS Variables

```css
:root {
  --output-width: 40%;
  --output-max-width: 600px;
  --output-min-width: 300px;
  --container-padding: 16px;
  --paragraph-margin: 8px;
  --line-height: 1.6;
}

.output-container {
  width: var(--output-width);
  max-width: var(--output-max-width);
  min-width: var(--output-min-width);
}
```

### 애니메이션

```css
.output-container {
  transition: width 0.3s ease, max-width 0.3s ease;
}

.three-sentence-window {
  scroll-behavior: smooth;
  transition: background 0.2s ease;
}
```

---

## Testing Strategy (테스트 전략)

### 시각적 테스트

1. **레이아웃 검증**
   - [ ] 출력창 너비가 40%인지 확인
   - [ ] 최대 너비가 600px를 초과하지 않는지 확인
   - [ ] 최소 너비가 300px 미만이지 않는지 확인

2. **반응형 테스트**
   - [ ] 1024px 이상: 3단 레이아웃
   - [ ] 768px ~ 1023px: 2단 레이아웃
   - [ ] 767px 이하: 1단 레이아웃

3. **3문장 윈도우 표시**
   - [ ] 3문장이 컨테이너 내에 모두 표시됨
   - [ ] 하이라이트가 정상 작동함
   - [ ] 스크롤이 부드럽게 동작함

### 브라우저 호환성

| 브라우저 | 최소 버전 | 테스트 항목 |
|---------|----------|----------|
| Chrome | 90+ | CSS Grid, Variables, Flexbox |
| Firefox | 88+ | 반응형 레이아웃, 애니메이션 |
| Safari | 14+ | CSS Variables, 3문장 윈도우 |
| Edge | 90+ | 전체 기능 |

### 성능 테스트

1. **렌더링 성능**
   - 레이아웃 변경 시 60fps 유지
   - 리플로우/리페인트 최소화

2. **반응형 전환 속도**
   - 화면 크기 변경 시 300ms 이내 레이아웃 전환

---

## Traceability (@TAG)

### TAG 체인

- **SPEC**: `@SPEC:UI-001`
- **TEST**: `tests/ui/layout.test.js`
- **CODE**:
  - `css/style.css` - 메인 스타일시트
  - `index.html` - HTML 구조
- **DOC**: `docs/ui/layout-guide.md`

### 관련 파일

```
reading tablet/
├── css/
│   └── style.css                 # @CODE:UI-001
├── index.html                    # @CODE:UI-001
├── .moai/
│   └── specs/
│       └── SPEC-UI-001/
│           └── spec.md          # @SPEC:UI-001 (현재 문서)
├── tests/
│   └── ui/
│       └── layout.test.js       # @TEST:UI-001
└── docs/
    └── ui/
        └── layout-guide.md      # @DOC:UI-001
```

---

## Dependencies (의존성)

### 내부 의존성
- **SPEC-GUIDE-001**: 3문장 슬라이딩 윈도우 기능 (구현 완료)
- **SPEC-BRAND-001**: 브랜드명 확정 (진행 중)

### 외부 의존성
- **없음** (Vanilla CSS 구현)

---

## Migration Plan (마이그레이션 계획)

### 1단계: 기존 CSS 백업
```bash
cp css/style.css css/style.backup.css
```

### 2단계: CSS 수정
1. 출력창 너비 변경 (50% → 40%)
2. 여백 축소 (padding, margin)
3. 3문장 컨테이너 추가
4. 반응형 미디어 쿼리 추가

### 3단계: HTML 구조 수정
1. `.three-sentence-container` 추가
2. `.three-sentence-window` 추가
3. 기존 요소에 클래스 추가

### 4단계: 검증
```bash
# CSS 검증
stylelint css/style.css

# 브라우저 테스트
open index.html
```

### 5단계: 커밋
```bash
git add css/style.css index.html
git commit -m "✨ FEATURE: UI 컴팩트화 (3문장 윈도우 최적화)

@TAG:UI-001-FEATURE"
```

---

## References (참고 자료)

### 디자인 참고
1. Medium Reader View - 좁은 레이아웃의 가독성
2. Instapaper - 집중 읽기 레이아웃
3. Apple Books - 3단 레이아웃 사례

### CSS 기술 문서
1. CSS Grid Layout - MDN
2. CSS Flexbox - MDN
3. CSS Media Queries - MDN

---

## Glossary (용어집)

| 용어 | 정의 |
|-----|------|
| **컴팩트 레이아웃** | 불필요한 여백을 제거하고 집중도를 높인 레이아웃 |
| **3문장 윈도우** | 현재 읽는 3문장만 하이라이트하는 영역 |
| **반응형 디자인** | 화면 크기에 따라 자동으로 레이아웃을 조정하는 디자인 |

---

## Approval (승인)

### 작성자
- **이름**: @seungwoolee
- **날짜**: 2025-10-22
- **버전**: v0.0.1

### 검토자
- **이름**: [TBD]
- **날짜**: [TBD]
- **상태**: Draft

---

**다음 단계**: `/alfred:2-build UI-001`로 TDD 구현 시작
