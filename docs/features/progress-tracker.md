# 읽기 진행도 추적 시스템 (Progress Tracker)

> **@DOC:PROGRESS-001**
>
> SPEC: [SPEC-PROGRESS-001](../../.moai/specs/SPEC-PROGRESS-001/spec.md)
> TEST: [progress-tracker.test.js](../../tests/progress/progress-tracker.test.js)
> CODE: [progress-tracker.js](../../js/progress-tracker.js), [milestone-animator.js](../../js/milestone-animator.js)

---

## 개요

읽기 진행도 추적 시스템은 **5% 단위 마일스톤(20개)** 기반으로 사용자의 읽기 진행 상황을 추적하고, 각 마일스톤 달성 시 화려한 무지개 폭죽 애니메이션으로 성취감을 제공하는 동기부여 시스템입니다.

### 주요 특징

- ✅ **실시간 진행도 추적**: GUIDE-001과 연동하여 현재 문장 인덱스 기반 퍼센트 계산
- ✅ **5% 단위 마일스톤**: 20개 체크포인트 (5%, 10%, ..., 100%)
- ✅ **무지개 폭죽 애니메이션**: Canvas API 기반 파티클 시스템 (150개 파티클, 3초 재생)
- ✅ **토스트 메시지**: 마일스톤 달성 시 자동 알림 (2초 표시, 0.5초 페이드아웃)
- ✅ **LocalStorage 기록**: 달성한 마일스톤 영구 저장, 중복 축하 방지
- ✅ **접근성 지원**: prefers-reduced-motion 자동 감지

---

## 사용 방법

### 1. 기본 사용

1. GUIDE-001 가이드 모드 시작
2. 읽기 진행 시 자동으로 진행도 계산
3. 5% 마일스톤 달성 시 폭죽 애니메이션 및 토스트 메시지 표시
4. LocalStorage에 마일스톤 달성 기록

### 2. 마일스톤 체크포인트

| 마일스톤 | 조건 | 애니메이션 |
|---------|-----|-----------|
| 5%      | 전체 문장 5% 완료 | 무지개 폭죽 + "5% 달성!" |
| 10%     | 전체 문장 10% 완료 | 무지개 폭죽 + "10% 달성!" |
| ...     | ... | ... |
| 100%    | 전체 문장 완료 | 무지개 폭죽 + "🎉 완독 축하합니다!" |

### 3. 진행 바 구성

```
┌──────────────────────────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░░░░░░░░░ 45.5%          │
│ 45.5% | 다음 50%까지 5문장                        │
└──────────────────────────────────────────────────┘
```

---

## API 사용법

### ProgressTracker 클래스

```javascript
// @CODE:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md | TEST: tests/progress/progress-tracker.test.js

// 초기화 (ReadingGuide 인스턴스 전달)
const tracker = new ProgressTracker(readingGuide);

// 진행도 계산
const progress = tracker.calculateProgress(); // 예: 45.5

// 마일스톤 체크
const milestone = tracker.checkMilestone(progress); // 예: 50 (달성 시) 또는 null

// 수동 트리거
tracker.triggerMilestoneEvent(50);

// LocalStorage 저장/로드
tracker.saveState();
tracker.loadState();
```

### 주요 메서드

#### `calculateProgress()`
- ReadingGuide의 currentIndex와 totalSentences를 기반으로 진행도 계산
- 반환값: 0.0 ~ 100.0 (소수점 첫째 자리)

#### `checkMilestone(progress)`
- 현재 진행도에서 새로 달성한 마일스톤 확인
- 중복 달성 방지 (achievedMilestones Set 확인)
- 반환값: 마일스톤 (예: 50) 또는 null

#### `triggerMilestoneEvent(milestone)`
- MilestoneAnimator에게 축하 애니메이션 요청
- 폭죽 + 토스트 메시지 표시

#### `saveState()` / `loadState()`
- LocalStorage에 진행 상황 저장/복원
- 데이터: achievedMilestones 배열, currentProgress, lastUpdated

---

### MilestoneAnimator 클래스

```javascript
// 초기화 (Canvas 요소 전달)
const animator = new MilestoneAnimator(canvas);

// 마일스톤 축하 실행
animator.celebrate(50); // 50% 달성

// 애니메이션 ON/OFF
animator.animationEnabled = false; // 토스트만 표시
animator.animationEnabled = true;  // 폭죽 + 토스트

// prefers-reduced-motion 확인
animator.checkReducedMotion();
```

### 주요 메서드

#### `celebrate(milestone)`
- 마일스톤 달성 축하 실행
- animationEnabled에 따라 폭죽 또는 토스트만 표시

#### `createFireworks()`
- 150개 파티클 생성
- 무지개 컬러: 빨강, 주황, 노랑, 초록, 파랑, 보라
- 파티클 타입: 원, 별, 스파클

#### `startAnimation()`
- 3초간 애니메이션 재생
- 60fps 유지 (requestAnimationFrame)
- 자동 종료 및 Canvas 클리어

#### `showToast(message)`
- 토스트 메시지 생성
- 2초 표시 후 0.5초 페이드아웃

---

## CSS 클래스

### `.progress-container`
진행 바 컨테이너입니다.

```css
.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
```

### `.progress-bar`
진행 바 배경입니다.

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
```

### `.progress-fill`
진행 바 채우기입니다.

```css
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}
```

### `.toast-message`
토스트 메시지입니다.

```css
.toast-message {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  z-index: 2000;
  animation: slideDown 0.3s ease;
}
```

---

## 통합 가이드

### GUIDE-001 연동

```javascript
// 1. ReadingGuide 초기화
const guide = new ReadingGuide();

// 2. ProgressTracker 초기화 (ReadingGuide 전달)
const tracker = new ProgressTracker(guide);

// 3. Canvas 요소 생성
const canvas = document.createElement('canvas');
canvas.id = 'fireworks-canvas';
document.body.appendChild(canvas);

// 4. MilestoneAnimator 초기화
const animator = new MilestoneAnimator(canvas);

// 5. ProgressTracker에 MilestoneAnimator 연결
tracker.onMilestone = (milestone) => {
  animator.celebrate(milestone);
};

// 6. ReadingGuide 시작
guide.start();
// → 사용자가 읽기 진행 시 자동으로 마일스톤 체크 및 축하
```

---

## 브라우저 호환성

| 브라우저 | 지원 버전 |
|---------|----------|
| Chrome  | 90+      |
| Firefox | 88+      |
| Safari  | 14+      |
| Edge    | 90+      |

### 필수 브라우저 기능
- ✅ Canvas 2D Context API
- ✅ LocalStorage API
- ✅ requestAnimationFrame
- ✅ CSS Media Query (prefers-reduced-motion)

---

## 성능 최적화

### 1. Canvas 렌더링 최적화
- requestAnimationFrame으로 60fps 보장
- 화면 밖 파티클 자동 제거
- 파티클 수 동적 조절 (성능 저하 시 50% 감소)

### 2. 메모리 관리
- 애니메이션 종료 시 particles 배열 클리어
- Canvas 메모리 누수 방지 (clearRect)

### 3. LocalStorage 최적화
- 데이터 구조 최소화 (10KB 이하)
- 필요 시만 저장 (마일스톤 달성 시)

---

## 접근성

### prefers-reduced-motion 지원

```javascript
// 자동 감지
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  animator.animationEnabled = false; // 애니메이션 비활성화
}
```

### CSS Media Query

```css
@media (prefers-reduced-motion: reduce) {
  .progress-fill {
    transition: none; /* 애니메이션 제거 */
  }

  .toast-message {
    animation: none; /* 슬라이드다운 제거 */
  }
}
```

---

## 테스트 커버리지

### 단위 테스트 (Vitest)
- ✅ ProgressTracker 클래스 초기화
- ✅ calculateProgress() 메서드: 진행도 계산 정확도
- ✅ checkMilestone() 메서드: 마일스톤 감지 로직
- ✅ saveState() / loadState(): LocalStorage 저장/로드
- ✅ MilestoneAnimator 클래스 초기화
- ✅ celebrate() 메서드: 폭죽 + 토스트 표시
- ✅ createFireworks() 메서드: 파티클 생성
- ✅ checkReducedMotion() 메서드: prefers-reduced-motion 감지

**커버리지**: 100% (99/99 테스트 통과)

### 통합 테스트
- ✅ GUIDE-001 연동: currentIndex 업데이트 시 진행도 갱신
- ✅ 마일스톤 달성 시 폭죽 + 토스트 자동 표시
- ✅ 중복 달성 방지: 이미 달성한 마일스톤 재방문 시 무시
- ✅ LocalStorage 영구 저장: 페이지 새로고침 후 복원
- ✅ prefers-reduced-motion: 애니메이션 자동 비활성화

---

## 관련 문서

- [SPEC 문서](../../.moai/specs/SPEC-PROGRESS-001/spec.md): 전체 요구사항 명세
- [테스트 코드](../../tests/progress/progress-tracker.test.js): Vitest 단위 테스트
- [구현 코드](../../js/progress-tracker.js): ProgressTracker 클래스
- [애니메이터 코드](../../js/milestone-animator.js): MilestoneAnimator 클래스
- [GUIDE-001](./reading-guide.md): 읽기 가이드 시스템

---

## 향후 계획 (Phase 2)

1. **배지 수집 모드**: 마일스톤별 배지 아이콘 (🥉 Bronze, 🥈 Silver, 🥇 Gold, 👑 Master)
2. **효과음**: Web Audio API 기반 마일스톤 달성음 재생
3. **커스터마이징**: 폭죽 색상, 파티클 수, 애니메이션 시간 조절
4. **통계 대시보드**: 완독률, 평균 마일스톤 달성 시간 표시

---

**버전**: v0.1.0
**최종 업데이트**: 2025-10-22
**작성자**: @seungwoolee
