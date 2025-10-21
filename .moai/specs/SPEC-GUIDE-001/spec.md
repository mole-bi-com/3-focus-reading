---
id: GUIDE-001
version: 0.0.1
status: draft
created: 2025-10-21
updated: 2025-10-21
author: @seungwoolee
priority: high
category: feature
labels:
  - reading-guide
  - karaoke-style
  - focus-mode
  - ux-enhancement
---

# @SPEC:GUIDE-001: 노래방 스타일 읽기 가이드 모드

## HISTORY

### v0.0.1 (2025-10-21)
- **INITIAL**: 노래방 스타일 읽기 가이드 모드 명세 최초 작성
- **AUTHOR**: @seungwoolee
- **SCOPE**: Progressive Line Highlighting, Focus Mode, Auto-Scroll 기능
- **CONTEXT**: 사용자가 텍스트를 읽을 때 노래방 가사처럼 가이드를 제공하여 집중도를 높이는 기능 요청
- **RESEARCH**:
  - Line Focus (Microsoft Immersive Reader) 기술 조사
  - RSVP (Rapid Serial Visual Presentation) 기술 분석
  - Karaoke-style highlighting 사례 연구
  - 읽기 집중도 향상 이론 검토

---

## Environment (환경)

### 시스템 환경
- **플랫폼**: 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 버전)
- **기반 프로젝트**: Reading Tablet (텍스트 가독성 개선 도구)
- **실행 환경**: 클라이언트 사이드 (JavaScript, HTML5, CSS3)

### 전제 조건
- Reading Tablet의 텍스트 포맷팅 기능이 정상 작동해야 함
- 출력 텍스트가 `<p>` 태그로 구조화되어 있어야 함
- LocalStorage API 사용 가능 환경

---

## Assumptions (가정)

### 기술적 가정
1. 사용자의 브라우저가 Web Animations API를 지원함
2. 사용자의 브라우저가 Intersection Observer API를 지원함
3. JavaScript가 활성화되어 있음
4. LocalStorage 용량 제한 내에서 설정 저장 가능 (최대 5MB)

### 사용자 가정
1. 사용자가 일정한 속도로 텍스트를 읽기를 원함
2. 사용자가 시각적 가이드를 통해 집중도를 높이고자 함
3. 사용자가 키보드 단축키를 사용할 수 있음 (선택사항)

### 비즈니스 가정
1. 가독성 향상 기능이 사용자 만족도를 높일 것임
2. ADHD, 난독증 사용자에게도 도움이 될 것임
3. 기존 포맷팅 기능과 독립적으로 동작 가능

---

## Requirements (요구사항)

### Ubiquitous Requirements (기본 요구사항)

1. 시스템은 읽기 가이드 모드를 제공해야 한다
2. 시스템은 읽기 속도 조절 기능을 제공해야 한다 (50~500 WPM 범위)
3. 시스템은 하이라이트 스타일 커스터마이징 기능을 제공해야 한다
4. 시스템은 사용자 설정을 로컬에 저장해야 한다

### Event-driven Requirements (이벤트 기반)

1. **WHEN** 사용자가 "가이드 모드" 버튼을 클릭하면, 시스템은 첫 번째 단락을 하이라이트해야 한다
2. **WHEN** 사용자가 "자동 진행" 버튼을 클릭하면, 시스템은 설정된 WPM에 따라 하이라이트를 자동으로 이동해야 한다
3. **WHEN** 사용자가 스페이스바를 누르면, 시스템은 자동 진행을 일시정지/재개해야 한다
4. **WHEN** 사용자가 위/아래 화살표를 누르면, 시스템은 이전/다음 단락으로 하이라이트를 이동해야 한다
5. **WHEN** 사용자가 +/- 키를 누르면, 시스템은 읽기 속도를 10 WPM씩 증가/감소해야 한다
6. **WHEN** 사용자가 가이드 모드를 종료하면, 시스템은 현재 읽던 위치를 저장해야 한다

### State-driven Requirements (상태 기반)

1. **WHILE** 자동 진행 모드가 활성화된 상태일 때, 시스템은 설정된 WPM에 따라 하이라이트를 이동해야 한다
2. **WHILE** 포커스 모드가 활성화된 상태일 때, 시스템은 현재 단락 외의 텍스트를 블러 처리해야 한다
3. **WHILE** 가이드 모드가 활성화된 상태일 때, 시스템은 진행 상황을 퍼센트로 표시해야 한다
4. **WHILE** 하이라이트가 이동 중일 때, 시스템은 부드러운 애니메이션을 적용해야 한다 (60fps 유지)

### Optional Features (선택적 기능)

1. **WHERE** 사용자가 하이라이트 색상을 변경하면, 시스템은 선택한 색상을 적용할 수 있다
2. **WHERE** 사용자가 "바운싱 볼" 모드를 선택하면, 시스템은 현재 단어 위에 애니메이션 인디케이터를 표시할 수 있다
3. **WHERE** 사용자가 읽던 위치 저장을 요청하면, 시스템은 다음 방문 시 해당 위치로 자동 이동할 수 있다
4. **WHERE** 사용자가 음성 안내를 활성화하면, 시스템은 현재 단락을 읽어줄 수 있다 (Web Speech API)

### Constraints (제약사항)

1. **IF** WPM이 50 미만이거나 500 초과이면, 시스템은 기본값(200 WPM)으로 조정해야 한다
2. **IF** 출력 텍스트가 비어있으면, 시스템은 가이드 모드 활성화를 차단하고 경고 메시지를 표시해야 한다
3. **IF** 브라우저가 Intersection Observer API를 지원하지 않으면, 시스템은 폴백 메커니즘을 사용해야 한다
4. 하이라이트 애니메이션은 60fps를 유지해야 한다
5. 포커스 모드의 블러 강도는 `filter: blur(2px)`, `opacity: 0.3` 범위 내에서 조절되어야 한다
6. 키보드 단축키는 입력 필드(input, textarea)에서는 동작하지 않아야 한다
7. 자동 저장 데이터는 5KB를 초과하지 않아야 한다 (LocalStorage 제한 고려)

---

## Core Features (핵심 기능)

### 1. Progressive Line Highlighting (점진적 단락 강조)

**기능 설명**:
- 현재 읽어야 할 단락을 시각적으로 강조
- 이미 읽은 단락, 현재 단락, 읽을 단락을 3단계로 구분

**시각적 표현**:
```
[흐림 - opacity: 0.5] 이미 읽은 텍스트
[강조 - background: highlight color] 지금 읽어야 할 텍스트 ⬅️ 현재 위치
[보통 - opacity: 1.0] 앞으로 읽을 텍스트
```

**구현 요소**:
- CSS 클래스: `.read-past`, `.read-current`, `.read-future`
- 애니메이션: `transition: all 0.3s ease`
- 하이라이트 색상: CSS Variable로 커스터마이징 가능

### 2. Focus Mode (포커스 모드)

**기능 설명**:
- 현재 읽는 단락만 선명하게 표시
- 나머지 텍스트는 블러 및 반투명 처리

**시각적 표현**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[블러 처리] 읽지 않을 부분
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[선명 100%] 현재 읽는 단락만 표시
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[블러 처리] 읽지 않을 부분
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**구현 요소**:
- CSS: `filter: blur(2px)`, `opacity: 0.3`
- 토글 버튼: ON/OFF 상태 표시
- 사용자 설정 저장: LocalStorage

### 3. Auto-Scroll (자동 진행)

**기능 설명**:
- 설정된 읽기 속도(WPM)에 따라 자동으로 다음 단락으로 이동
- 일시정지/재개 기능
- 실시간 속도 조절

**구현 요소**:
- WPM 범위: 50~500 (기본값: 200)
- 타이머: `setInterval` 또는 `requestAnimationFrame`
- 키보드 제어: 스페이스바(일시정지), +/-(속도 조절)
- 진행 상황 표시: "45% 완료 (15/33 단락)"

---

## UI/UX Specifications (UI/UX 명세)

### 가이드 컨트롤 패널

**위치**: 출력창 상단 또는 하단 (사용자 설정 가능)

**구성 요소**:
1. **가이드 모드 토글**: ON/OFF 버튼
2. **자동 진행 버튼**: ▶️ 재생 / ⏸️ 일시정지
3. **속도 조절 슬라이더**: 50~500 WPM (10 WPM 단위)
4. **포커스 모드 토글**: 눈 아이콘 (👁️)
5. **진행 상황 바**: 현재 위치 / 전체 (퍼센트)
6. **설정 버튼**: ⚙️ (하이라이트 색상, 블러 강도 등)

**예시 레이아웃**:
```
┌──────────────────────────────────────────────────┐
│ 🎯 가이드 모드: [ON]                               │
│ ▶️ 자동 진행 | 🔄 200 WPM | 👁️ 포커스            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 진행: ████████░░░░░░░░░░░░░░░░░ 45% (15/33)      │
└──────────────────────────────────────────────────┘
```

### 키보드 단축키

| 키 | 기능 |
|----|------|
| `G` | 가이드 모드 ON/OFF |
| `Space` | 자동 진행 일시정지/재개 |
| `↑` / `↓` | 이전/다음 단락으로 이동 |
| `+` / `-` | 읽기 속도 증가/감소 (10 WPM) |
| `F` | 포커스 모드 ON/OFF |
| `R` | 처음으로 돌아가기 |
| `Esc` | 가이드 모드 종료 |

### 반응형 디자인

- **데스크톱**: 전체 기능 사용 가능
- **태블릿**: 터치 제스처 지원 (스와이프로 단락 이동)
- **모바일**: 간소화된 컨트롤 (필수 기능만 표시)

---

## Technical Specifications (기술 명세)

### 기술 스택

**핵심 기술**:
- JavaScript ES6+ (클래스 기반 구조)
- CSS3 (Variables, Transitions, Filters)
- HTML5 (Semantic Tags)

**사용 API**:
- `Intersection Observer API`: 현재 보이는 단락 감지
- `Web Animations API`: 부드러운 애니메이션
- `LocalStorage API`: 설정 및 진행 상황 저장
- `KeyboardEvent`: 단축키 처리
- *(선택)* `Web Speech API`: 음성 안내

### 성능 요구사항

1. **애니메이션 성능**: 60fps 유지 (Chrome DevTools Performance 측정)
2. **응답 시간**: 버튼 클릭 후 100ms 이내 반응
3. **메모리 사용**: 추가 메모리 사용량 < 10MB
4. **초기 로딩**: 가이드 모드 활성화 시 < 200ms

### 접근성 (Accessibility)

1. **ARIA 레이블**: 모든 버튼 및 컨트롤에 `aria-label` 적용
2. **키보드 네비게이션**: 마우스 없이 전체 기능 사용 가능
3. **스크린 리더**: 진행 상황 및 상태 변화 안내
4. **고대비 모드**: 색상 약자 및 저시력 사용자 지원
5. **Focus Indicator**: 키보드 포커스 시각적 표시

---

## Data Model (데이터 모델)

### LocalStorage 구조

```javascript
{
  "reading-guide-settings": {
    "enabled": true,              // 가이드 모드 활성화 여부
    "autoPlay": false,            // 자동 진행 활성화 여부
    "wpm": 200,                   // 읽기 속도 (Words Per Minute)
    "focusMode": false,           // 포커스 모드 활성화 여부
    "highlightColor": "#4361ee",  // 하이라이트 색상
    "blurIntensity": 2,           // 블러 강도 (px)
    "lastPosition": 5,            // 마지막 읽던 단락 인덱스
    "timestamp": 1698765432000    // 마지막 저장 시간
  }
}
```

### 단락 상태 모델

```javascript
class ParagraphState {
  index: number;        // 단락 인덱스 (0부터 시작)
  element: HTMLElement; // DOM 요소 참조
  status: 'past' | 'current' | 'future'; // 읽기 상태
  wordCount: number;    // 단어 수 (WPM 계산용)
}
```

---

## Error Handling (오류 처리)

### 오류 시나리오 및 처리 방안

| 오류 시나리오 | 처리 방안 |
|-------------|----------|
| 출력 텍스트가 비어있음 | "포맷팅된 텍스트가 없습니다" 경고 표시, 가이드 모드 비활성화 |
| 브라우저가 Intersection Observer 미지원 | `querySelector` 기반 폴백 사용, 경고 메시지 표시 |
| LocalStorage 용량 초과 | 기본 설정 사용, "설정 저장 실패" 안내 |
| 애니메이션 성능 저하 | `requestAnimationFrame` 최적화, 저성능 기기는 애니메이션 단순화 |
| 잘못된 WPM 값 입력 | 자동으로 200 WPM으로 리셋, "유효 범위: 50~500" 안내 |

### 사용자 피드백

- **성공**: 토스트 메시지 (예: "가이드 모드가 활성화되었습니다")
- **경고**: 노란색 토스트 (예: "읽기 속도가 조정되었습니다")
- **오류**: 빨간색 토스트 (예: "가이드 모드를 사용할 수 없습니다")

---

## Testing Strategy (테스트 전략)

### 단위 테스트

1. `ReadingGuide` 클래스 초기화 테스트
2. WPM 값 범위 검증 테스트 (50~500)
3. 단락 상태 전환 로직 테스트 (`past` → `current` → `future`)
4. LocalStorage 저장/로드 테스트
5. 키보드 이벤트 핸들러 테스트

### 통합 테스트

1. 가이드 모드 활성화 → 첫 단락 하이라이트 확인
2. 자동 진행 → 설정된 WPM에 따라 단락 이동 확인
3. 포커스 모드 → 블러 효과 적용 확인
4. 설정 저장 → 페이지 새로고침 후 복원 확인

### 성능 테스트

1. 1000개 단락 텍스트에서 60fps 유지 확인
2. 메모리 누수 테스트 (장시간 사용 시)
3. 애니메이션 프레임 드롭 측정

### 사용자 테스트

1. ADHD 사용자 집중도 향상 확인
2. 난독증 사용자 읽기 속도 개선 확인
3. 일반 사용자 만족도 설문

---

## Traceability (@TAG)

### TAG 체인

- **SPEC**: `@SPEC:GUIDE-001`
- **TEST**: `tests/guide/reading-guide.test.js`
- **CODE**:
  - `js/reading-guide.js` - 메인 로직
  - `css/reading-guide.css` - 스타일
- **DOC**: `docs/features/reading-guide.md`

### 관련 파일

```
reading-tablet/
├── js/
│   └── reading-guide.js       # @CODE:GUIDE-001
├── css/
│   └── reading-guide.css      # @CODE:GUIDE-001
├── tests/
│   └── guide/
│       └── reading-guide.test.js  # @TEST:GUIDE-001
├── docs/
│   └── features/
│       └── reading-guide.md   # @DOC:GUIDE-001
└── .moai/
    └── specs/
        └── SPEC-GUIDE-001/
            ├── spec.md        # @SPEC:GUIDE-001 (현재 문서)
            ├── plan.md
            └── acceptance.md
```

---

## Dependencies (의존성)

### 내부 의존성
- `formatter.js`: 텍스트 포맷팅 로직
- `app.js`: 메인 애플리케이션 로직
- `style.css`: 기본 스타일 시스템

### 외부 라이브러리
- **없음** (Vanilla JavaScript 구현)
- *(선택)* Web Speech API (브라우저 내장)

---

## Future Enhancements (향후 개선사항)

### Phase 2 기능
1. **단어 단위 하이라이트**: 단락이 아닌 단어 단위로 RSVP 스타일 적용
2. **바운싱 볼 모드**: 노래방처럼 현재 단어 위에 공이 튀는 애니메이션
3. **음성 안내**: Web Speech API를 통한 텍스트 읽어주기
4. **커스텀 테마**: 다크/라이트 모드별 하이라이트 색상 프리셋
5. **통계 대시보드**: 읽기 속도, 완료한 텍스트 양 등 통계 표시

### Phase 3 기능
1. **클라우드 동기화**: 여러 기기 간 설정 및 진행 상황 동기화
2. **AI 추천**: 사용자의 읽기 패턴 분석하여 최적 WPM 추천
3. **협업 모드**: 여러 사람이 동시에 같은 텍스트를 읽으며 진행 상황 공유

---

## References (참고 자료)

### 학술 연구
1. "Keyword Highlighting Improves Comprehension for People with Dyslexia" - ResearchGate
2. "Constrained Highlighting in a Document Reader can Improve Reading Comprehension" - CHI 2024
3. "RSVP - Rapid Serial Visual Presentation" - Wikipedia

### 기술 문서
1. Intersection Observer API - MDN Web Docs
2. Web Animations API - MDN Web Docs
3. Web Speech API - MDN Web Docs

### 유사 제품
1. Microsoft Immersive Reader - Line Focus 기능
2. Helperbird - Reading Ruler 및 Focus Mode
3. AccelaReader - RSVP 기술 적용 사례

---

## Glossary (용어집)

| 용어 | 정의 |
|-----|------|
| **WPM** | Words Per Minute - 분당 읽는 단어 수 |
| **RSVP** | Rapid Serial Visual Presentation - 빠른 순차 시각 제시 |
| **Progressive Highlighting** | 점진적 하이라이트 - 순차적으로 텍스트를 강조하는 기법 |
| **Line Focus** | 현재 읽는 줄만 강조하고 나머지는 흐리게 처리하는 기법 |
| **Karaoke-Style** | 노래방 스타일 - 진행에 따라 하이라이트가 이동하는 방식 |
| **Blur Effect** | 블러 효과 - 텍스트를 흐리게 처리하여 집중도 향상 |

---

## Approval (승인)

### 작성자
- **이름**: @seungwoolee
- **날짜**: 2025-10-21
- **버전**: v0.0.1

### 검토자
- **이름**: [TBD]
- **날짜**: [TBD]
- **상태**: Draft

---

**다음 단계**: `/alfred:2-build GUIDE-001`로 TDD 구현 시작
