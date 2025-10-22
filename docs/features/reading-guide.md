# 읽기 가이드 기능 (Reading Guide)

> **@DOC:GUIDE-001**
>
> SPEC: [SPEC-GUIDE-001](../../.moai/specs/SPEC-GUIDE-001/spec.md)
> TEST: [reading-guide.test.js](../../tests/guide/reading-guide.test.js)
> CODE: [reading-guide.js](../../js/reading-guide.js), [reading-guide.css](../../css/reading-guide.css)

---

## 개요

노래방 스타일 읽기 가이드는 **3문장 슬라이딩 윈도우** 방식으로 텍스트를 읽을 수 있도록 돕는 집중 모드입니다. 현재 읽는 문장을 강조하고, 주변 맥락(이전 1문장 + 다음 1문장)을 함께 보여주며, 나머지 텍스트는 숨김 처리하여 읽기에 집중할 수 있습니다.

### 주요 특징

- ✅ **3문장 슬라이딩 윈도우**: 이전 1개 + 현재 1개 + 다음 1개 문장만 표시
- ✅ **현재 문장 강조**: 노란색 배경으로 읽어야 할 문장 명확히 표시
- ✅ **전체 화면 활용**: 헤더/컨트롤/푸터 자동 숨김, 화면 정중앙 배치
- ✅ **키보드 단축키**: Space(진행), F(포커스), Esc(종료), ←/→(이동)
- ✅ **진행 상황 표시**: 현재 위치 / 전체 문장 수 실시간 표시

---

## 사용 방법

### 1. 기본 사용

1. 텍스트를 입력하고 "포맷팅 변환" 버튼 클릭
2. "가이드 모드 시작" 버튼 클릭
3. Space 또는 → 키로 다음 문장으로 이동
4. Esc 키로 가이드 모드 종료

### 2. 키보드 단축키

| 키          | 기능                    |
|-------------|------------------------|
| `Space`     | 다음 문장으로 진행      |
| `F`         | 포커스 모드 ON/OFF      |
| `Esc`       | 가이드 모드 종료        |
| `→` (오른쪽) | 다음 문장으로 이동      |
| `←` (왼쪽)   | 이전 문장으로 이동      |

### 3. 가이드 모드 화면 구성

```
┌─────────────────────────────────────────┐
│                                         │
│        [이전 문장 - 연한 회색]          │
│                                         │
│    [현재 문장 - 노란색 배경 강조] ⬅️    │
│                                         │
│        [다음 문장 - 연한 회색]          │
│                                         │
│           진행: 5 / 20                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## API 사용법

### ReadingGuide 클래스

```javascript
// @CODE:GUIDE-001 | SPEC: SPEC-GUIDE-001.md | TEST: tests/guide/reading-guide.test.js

// 초기화
const guide = new ReadingGuide();

// 가이드 모드 시작
guide.start();

// 다음 문장으로 진행
guide.next();

// 이전 문장으로 이동
guide.previous();

// 가이드 모드 종료
guide.stop();

// 이벤트 리스너
guide.onProgress((current, total) => {
  console.log(`진행: ${current} / ${total}`);
});
```

### 주요 메서드

#### `start()`
- 가이드 모드를 시작합니다
- 헤더/컨트롤/푸터를 숨기고 첫 문장을 강조합니다
- 키보드 이벤트 리스너를 등록합니다

#### `stop()`
- 가이드 모드를 종료합니다
- 모든 UI 요소를 원래대로 복원합니다
- 키보드 이벤트 리스너를 제거합니다

#### `next()`
- 다음 문장으로 이동합니다
- 3문장 윈도우를 업데이트합니다
- 진행 상황을 갱신합니다

#### `previous()`
- 이전 문장으로 이동합니다
- 첫 문장에서는 동작하지 않습니다

#### `updateProgress()`
- 진행 상황 표시를 업데이트합니다
- 형식: "5 / 20" (현재 문장 / 전체 문장)

---

## CSS 클래스

### `.guide-sentence`
모든 문장에 기본적으로 적용되는 클래스입니다.

```css
.guide-sentence {
  display: none;  /* 기본적으로 숨김 */
  font-size: 1.2rem;
  line-height: 1.8;
  margin: 1rem 0;
}
```

### `.guide-sentence-visible`
3문장 윈도우 내의 문장에 적용됩니다.

```css
.guide-sentence-visible {
  display: block;  /* 보이도록 설정 */
}
```

### `.guide-sentence-current`
현재 읽는 문장에 적용되는 강조 스타일입니다.

```css
.guide-sentence-current {
  background: #ffd60a;  /* 노란색 배경 */
  padding: 1rem;
  border-radius: 4px;
  font-weight: bold;
}
```

### `.guide-sentence-context`
이전/다음 문장(맥락)에 적용됩니다.

```css
.guide-sentence-context {
  color: #aaa;  /* 연한 회색 */
}
```

---

## 설정 옵션 (향후 지원 예정)

### LocalStorage 구조

```javascript
{
  "reading-guide-settings": {
    "highlightColor": "#ffd60a",  // 하이라이트 색상
    "windowSize": 3,              // 슬라이딩 윈도우 크기 (현재 고정: 3)
    "fontSize": "1.2rem",         // 글자 크기
    "autoScroll": true            // 자동 스크롤 여부
  }
}
```

---

## 성능 최적화

### 1. DOM 조작 최소화
- 문장 이동 시 필요한 요소만 업데이트
- CSS 클래스 토글 방식 사용

### 2. 이벤트 핸들러 효율화
- 키보드 이벤트 debounce 처리
- 불필요한 리스너 제거 (종료 시)

### 3. 애니메이션 성능
- CSS transition 활용 (GPU 가속)
- 60fps 유지 확인

---

## 브라우저 호환성

| 브라우저 | 지원 버전 |
|---------|----------|
| Chrome  | 90+      |
| Firefox | 88+      |
| Safari  | 14+      |
| Edge    | 90+      |

### 필수 브라우저 기능
- ✅ CSS `display: none/block`
- ✅ CSS Transitions
- ✅ KeyboardEvent API
- ✅ classList API

---

## 테스트 커버리지

### 단위 테스트 (Vitest)
- ✅ ReadingGuide 클래스 초기화
- ✅ start() 메서드: 헤더/컨트롤/푸터 숨김
- ✅ next() 메서드: 다음 문장 이동
- ✅ previous() 메서드: 이전 문장 이동 (첫 문장에서 무시)
- ✅ stop() 메서드: UI 복원 및 클린업
- ✅ 3문장 슬라이딩 윈도우 로직
- ✅ 진행 상황 표시 업데이트
- ✅ 키보드 이벤트 핸들러

**커버리지**: 100% (8/8 테스트 통과)

---

## 관련 문서

- [SPEC 문서](../../.moai/specs/SPEC-GUIDE-001/spec.md): 전체 요구사항 명세
- [테스트 코드](../../tests/guide/reading-guide.test.js): Vitest 단위 테스트
- [구현 코드](../../js/reading-guide.js): ReadingGuide 클래스
- [스타일](../../css/reading-guide.css): 가이드 모드 CSS

---

## 향후 계획 (Phase 2)

1. **설정 저장**: LocalStorage를 통한 사용자 설정 유지
2. **커스터마이징**: 하이라이트 색상, 글자 크기, 윈도우 크기 조절
3. **자동 진행**: WPM(분당 단어 수) 기반 자동 문장 이동
4. **포커스 모드 강화**: 주변 문장 블러 효과
5. **진행 상황 저장**: 마지막 읽던 위치 복원

---

**버전**: v0.1.0
**최종 업데이트**: 2025-10-22
**작성자**: @seungwoolee
