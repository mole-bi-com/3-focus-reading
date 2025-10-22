---
id: PROGRESS-001
version: 0.0.1
status: draft
created: 2025-10-22
updated: 2025-10-22
author: @seungwoolee
priority: high

category: feature
labels:
  - progress
  - motivation
  - animation
  - ux

depends_on:
  - GUIDE-001

scope:
  packages:
    - js/
    - css/
  files:
    - progress-tracker.js
    - milestone-animator.js
    - toast-system.js
    - progress-bar.css
    - fireworks.css
---

# @SPEC:PROGRESS-001: 읽기 진행도 기반 동기부여 시스템

## HISTORY

### v0.0.1 (2025-10-22)
- **INITIAL**: 읽기 진행도 추적 및 마일스톤 기반 폭죽 애니메이션 시스템 명세 작성
- **AUTHOR**: @seungwoolee
- **REASON**: 사용자가 긴 텍스트를 끝까지 읽도록 동기부여하는 시스템 필요

---

## Overview

GUIDE-001 시스템 기반으로 읽기 진행도를 실시간 추적하고, 5% 단위 마일스톤(20개) 달성 시 화려한 무지개 폭죽 애니메이션으로 사용자에게 성취감을 제공하는 동기부여 시스템.

**핵심 가치**:
- 긴 텍스트 읽기 완독률 향상
- 시각적 피드백을 통한 성취감 제공
- 읽기 흐름을 방해하지 않는 비침투적 UX

---

## Environment

### Dependencies
- **GUIDE-001**: `currentIndex`, `totalSentences` 제공
- **Vanilla JavaScript**: ES6+ (Class, async/await)
- **Canvas API**: 파티클 애니메이션 렌더링
- **LocalStorage**: 마일스톤 달성 기록 영구 저장
- **CSS3**: 진행 바 UI, 토스트 메시지 스타일

### Assumptions
1. GUIDE-001의 `currentIndex`는 실시간으로 업데이트된다
2. 브라우저는 Canvas 2D Context를 지원한다
3. LocalStorage는 10KB 이상 사용 가능하다
4. 사용자는 읽기 중 애니메이션을 방해받지 않는다

### External Interfaces
```javascript
// GUIDE-001 제공 API
interface ReadingGuideContext {
  currentIndex: number;      // 현재 문장 인덱스 (0-based)
  totalSentences: number;    // 전체 문장 수
  onIndexChange: (callback) => void;  // 인덱스 변경 이벤트
}
```

---

## Requirements (EARS)

### Ubiquitous Requirements (기본 요구사항)

1. 시스템은 전체 읽기 진행도를 퍼센트로 계산해야 한다
   - 공식: `(currentIndex / totalSentences) * 100`
   - 소수점 첫째 자리까지 표시 (예: 45.5%)

2. 시스템은 5% 단위 마일스톤 20개를 제공해야 한다
   - 체크포인트: 5%, 10%, 15%, ..., 95%, 100%
   - 모든 마일스톤은 동일한 수준의 폭죽 효과 제공

3. 시스템은 마일스톤 달성 시 화려한 무지개 폭죽 효과를 표시해야 한다
   - 무지개 컬러: 빨강, 주황, 노랑, 초록, 파랑, 보라
   - 다양한 파티클 스타일: 원, 별, 스파클
   - Canvas API 기반 물리 시뮬레이션 (중력, 페이드아웃)

4. 시스템은 진행 바 UI를 제공해야 한다
   - 위치: 화면 상단 고정
   - 구성: 진행 바 + 퍼센트 표시 + 마일스톤 아이콘
   - 다음 마일스톤까지 거리 표시

### Event-driven Requirements (이벤트 기반)

1. **WHEN** 사용자가 5% 마일스톤을 달성하면, 시스템은 화려한 폭죽 애니메이션을 표시해야 한다
   - 애니메이션 시간: 3초 (0.5초 발사 + 2초 낙하 + 0.5초 소멸)
   - 파티클 수: 100~200개
   - 화면 중앙 상단에서 발사

2. **WHEN** 사용자가 100% 달성하면, 시스템은 "완독 축하!" 메시지를 표시해야 한다
   - 폭죽 애니메이션: 일반 마일스톤과 동일
   - 토스트 메시지: "🎉 완독 축하합니다!"

3. **WHEN** 사용자가 "애니메이션 OFF" 설정 시, 시스템은 텍스트 알림만 표시해야 한다
   - 폭죽 애니메이션 비활성화
   - 토스트 메시지만 표시
   - 진행 바는 정상 작동

4. **WHEN** 사용자가 이전에 달성한 마일스톤을 재방문하면, 시스템은 폭죽을 다시 표시하지 않아야 한다
   - LocalStorage 기록 확인
   - 중복 축하 방지 로직

5. **WHEN** 사용자가 `prefers-reduced-motion` 설정을 활성화하면, 시스템은 애니메이션을 자동으로 비활성화해야 한다
   - CSS Media Query 감지
   - 텍스트 알림만 표시

### State-driven Requirements (상태 기반)

1. **WHILE** 폭죽 애니메이션 재생 중일 때, 시스템은 읽기 진행을 차단하지 않아야 한다
   - 오버레이 형태 (z-index 최상위)
   - 클릭 이벤트 무시 (`pointer-events: none`)
   - 백그라운드 읽기 허용

2. **WHILE** 진행 바가 표시되는 동안, 시스템은 현재 진행도와 다음 마일스톤까지 거리를 표시해야 한다
   - 예: "45.5% (다음 50%까지 5문장)"
   - 실시간 업데이트

3. **WHILE** 가이드 모드가 비활성화된 상태일 때, 시스템은 진행도 추적을 일시 정지해야 한다
   - GUIDE-001의 활성화 상태 확인
   - 진행 바 숨김
   - LocalStorage 업데이트 중단

### Optional Features (선택적 기능)

1. **WHERE** 사용자가 배지 수집 모드 활성화 시, 시스템은 획득한 배지 목록을 표시할 수 있다
   - **Phase 2**: 달성 마일스톤별 배지 아이콘 표시
   - 예: 🥉 Bronze (25%), 🥈 Silver (50%), 🥇 Gold (75%), 👑 Master (100%)

2. **WHERE** 사용자가 소리 활성화 시, 시스템은 마일스톤 달성음을 재생할 수 있다
   - **Phase 2**: Web Audio API 기반 효과음
   - 사용자 설정으로 ON/OFF 가능

### Constraints (제약사항)

1. **IF** 애니메이션이 60fps 미만이면, 시스템은 단순화된 효과로 전환해야 한다
   - 파티클 수 50% 감소
   - 복잡한 물리 시뮬레이션 생략

2. 폭죽 애니메이션은 3초 이내에 완료되어야 한다
   - 발사: 0.5초
   - 낙하: 2초
   - 소멸: 0.5초

3. LocalStorage 사용량은 10KB를 초과하지 않아야 한다
   - 데이터 구조 최적화
   - 필요 시 오래된 기록 정리

4. 애니메이션은 사용자 읽기를 방해하지 않아야 한다
   - 오버레이 형태
   - `pointer-events: none`
   - 자동 소멸 (3초)

5. 마일스톤 달성 체크는 0.1초 이내에 완료되어야 한다
   - 효율적인 퍼센트 계산
   - 중복 체크 최소화

6. `prefers-reduced-motion` 설정 시 애니메이션을 자동으로 비활성화해야 한다
   - CSS Media Query 감지
   - JavaScript에서 체크

---

## Specifications

### 1. 진행도 계산 엔진 (ProgressTracker)

```javascript
// @CODE:PROGRESS-001:DOMAIN
class ProgressTracker {
  constructor(readingGuide) {
    this.readingGuide = readingGuide;
    this.currentProgress = 0;
    this.achievedMilestones = new Set();
    this.milestones = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                        55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

    this.loadState();
    this.readingGuide.onIndexChange(this.onIndexChange.bind(this));
  }

  calculateProgress() {
    const { currentIndex, totalSentences } = this.readingGuide;
    return Math.round((currentIndex / totalSentences) * 1000) / 10; // 소수점 첫째 자리
  }

  checkMilestone(progress) {
    const milestone = this.milestones.find(m =>
      progress >= m && !this.achievedMilestones.has(m)
    );

    if (milestone) {
      this.achievedMilestones.add(milestone);
      this.saveState();
      return milestone;
    }
    return null;
  }

  onIndexChange() {
    this.currentProgress = this.calculateProgress();
    const milestone = this.checkMilestone(this.currentProgress);

    if (milestone) {
      this.triggerMilestoneEvent(milestone);
    }

    this.updateProgressBar();
  }

  loadState() {
    const saved = localStorage.getItem('progress-milestones');
    if (saved) {
      const data = JSON.parse(saved);
      this.achievedMilestones = new Set(data.achievedMilestones || []);
    }
  }

  saveState() {
    localStorage.setItem('progress-milestones', JSON.stringify({
      achievedMilestones: Array.from(this.achievedMilestones),
      currentProgress: this.currentProgress,
      lastUpdated: Date.now()
    }));
  }
}
```

### 2. 마일스톤 애니메이터 (MilestoneAnimator)

```javascript
// @CODE:PROGRESS-001:UI
class MilestoneAnimator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isAnimating = false;
    this.animationEnabled = true;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.checkReducedMotion();
  }

  checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.animationEnabled = false;
    }
  }

  celebrate(milestone) {
    if (!this.animationEnabled) {
      this.showToast(`${milestone}% 달성!`);
      return;
    }

    this.createFireworks();
    this.showToast(milestone === 100 ? '🎉 완독 축하합니다!' : `${milestone}% 달성!`);
    this.startAnimation();
  }

  createFireworks() {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'];
    const types = ['circle', 'star', 'sparkle'];
    const centerX = this.canvas.width / 2;
    const startY = 100;

    for (let i = 0; i < 150; i++) {
      this.particles.push(new Particle(
        centerX,
        startY,
        colors[Math.floor(Math.random() * colors.length)],
        types[Math.floor(Math.random() * types.length)]
      ));
    }
  }

  startAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed > 3000) {
        this.isAnimating = false;
        this.particles = [];
        this.clearCanvas();
        return;
      }

      this.clearCanvas();
      this.updateParticles();
      this.drawParticles();

      requestAnimationFrame(animate);
    };

    animate();
  }

  updateParticles() {
    this.particles = this.particles.filter(p => p.life > 0);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= 0.01;
    });
  }

  drawParticles() {
    this.particles.forEach(p => {
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;

      if (p.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        this.drawStar(p.x, p.y, 5, 3, 5);
      } else if (p.type === 'sparkle') {
        this.drawSparkle(p.x, p.y, 4);
      }
    });

    this.ctx.globalAlpha = 1;
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }

    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawSparkle(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x, y + size);
    this.ctx.moveTo(x - size, y);
    this.ctx.lineTo(x + size, y);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }
}
```

### 3. 파티클 클래스

```javascript
// @CODE:PROGRESS-001:DOMAIN
class Particle {
  constructor(x, y, color, type) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6; // -3 ~ 3
    this.vy = Math.random() * -4 - 4;    // -8 ~ -4
    this.color = color;
    this.type = type; // 'circle', 'star', 'sparkle'
    this.life = 1.0;
    this.gravity = 0.2;
  }
}
```

### 4. LocalStorage 데이터 모델

```javascript
{
  "progress-milestones": {
    "achievedMilestones": [5, 10, 15, 20],  // 달성한 마일스톤 배열
    "currentProgress": 23.5,                 // 현재 진행도 (%)
    "lastUpdated": 1698765432000             // 마지막 업데이트 타임스탬프
  }
}
```

### 5. 진행 바 UI (HTML/CSS)

```html
<!-- @CODE:PROGRESS-001:UI -->
<div class="progress-container">
  <div class="progress-bar">
    <div class="progress-fill" style="width: 45.5%"></div>
  </div>
  <div class="progress-info">
    <span class="progress-percent">45.5%</span>
    <span class="progress-next">다음 50%까지 5문장</span>
  </div>
</div>
```

```css
/* @CODE:PROGRESS-001:UI */
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

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: #555;
}

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

.toast-message.fade-out {
  animation: fadeOut 0.5s ease;
}

@keyframes slideDown {
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

@keyframes fadeOut {
  to { opacity: 0; }
}

/* prefers-reduced-motion 지원 */
@media (prefers-reduced-motion: reduce) {
  .progress-fill {
    transition: none;
  }

  .toast-message {
    animation: none;
  }
}
```

---

## Acceptance Criteria

### AC-1: 첫 마일스톤 달성
```
GIVEN 사용자가 총 100문장 텍스트를 읽기 시작하고
WHEN 5번째 문장을 완료하면 (5% 달성)
THEN 화려한 무지개 폭죽 애니메이션이 3초간 표시되고
AND "5% 달성!" 토스트 메시지가 2초간 나타나고
AND 진행 바가 5%로 업데이트되고
AND LocalStorage에 마일스톤 달성이 기록된다
```

**검증 방법**:
```javascript
// @TEST:PROGRESS-001
describe('첫 마일스톤 달성', () => {
  it('5% 달성 시 폭죽 애니메이션과 토스트를 표시한다', async () => {
    const tracker = new ProgressTracker(mockReadingGuide);
    const animator = new MilestoneAnimator(mockCanvas);

    // 5번째 문장 완료
    mockReadingGuide.currentIndex = 5;
    tracker.onIndexChange();

    // 검증
    expect(animator.isAnimating).toBe(true);
    expect(document.querySelector('.toast-message').textContent).toBe('5% 달성!');
    expect(localStorage.getItem('progress-milestones')).toContain('[5]');
  });
});
```

### AC-2: 중복 달성 방지
```
GIVEN 사용자가 이미 10% 마일스톤을 달성했고
WHEN 이전 문장으로 돌아갔다가 다시 10% 지점을 지나가면
THEN 폭죽 애니메이션이 다시 표시되지 않고
AND 진행 바만 업데이트된다
```

**검증 방법**:
```javascript
// @TEST:PROGRESS-001
describe('중복 달성 방지', () => {
  it('이미 달성한 마일스톤은 다시 표시하지 않는다', () => {
    const tracker = new ProgressTracker(mockReadingGuide);
    tracker.achievedMilestones.add(10);

    // 10% 지점 재방문
    mockReadingGuide.currentIndex = 10;
    const milestone = tracker.checkMilestone(10);

    expect(milestone).toBeNull();
  });
});
```

### AC-3: 애니메이션 OFF 모드
```
GIVEN 사용자가 애니메이션 OFF 설정을 활성화하고
WHEN 마일스톤을 달성하면
THEN 폭죽 애니메이션 없이 텍스트 알림만 표시되고
AND 진행 바는 정상적으로 업데이트된다
```

**검증 방법**:
```javascript
// @TEST:PROGRESS-001
describe('애니메이션 OFF 모드', () => {
  it('애니메이션 비활성화 시 토스트만 표시한다', () => {
    const animator = new MilestoneAnimator(mockCanvas);
    animator.animationEnabled = false;

    animator.celebrate(15);

    expect(animator.isAnimating).toBe(false);
    expect(document.querySelector('.toast-message')).toBeTruthy();
  });
});
```

### AC-4: 완독 달성
```
GIVEN 사용자가 99%까지 읽고
WHEN 마지막 문장을 완료하면 (100% 달성)
THEN 대형 무지개 폭죽 애니메이션이 표시되고
AND "🎉 완독 축하합니다!" 메시지가 나타나고
AND 진행 바가 100%로 채워진다
```

**검증 방법**:
```javascript
// @TEST:PROGRESS-001
describe('완독 달성', () => {
  it('100% 달성 시 완독 메시지를 표시한다', () => {
    const animator = new MilestoneAnimator(mockCanvas);

    animator.celebrate(100);

    expect(document.querySelector('.toast-message').textContent).toBe('🎉 완독 축하합니다!');
  });
});
```

### AC-5: 성능 검증
```
GIVEN 폭죽 애니메이션이 재생 중이고
WHEN Chrome DevTools Performance로 측정하면
THEN 평균 프레임레이트가 60fps 이상이고
AND 애니메이션이 3초 이내에 완료된다
```

**검증 방법**:
- Chrome DevTools > Performance 탭
- 폭죽 애니메이션 트리거
- FPS 그래프 확인 (≥60fps)
- 총 애니메이션 시간 측정 (≤3초)

---

## Testing Strategy

### 단위 테스트 (Vitest)

**`progress-tracker.test.js`**:
- 진행도 계산 정확도 테스트
- 마일스톤 감지 로직 테스트
- LocalStorage 저장/로드 테스트
- 중복 달성 방지 로직 테스트

**`milestone-animator.test.js`**:
- 폭죽 애니메이션 생성 테스트
- 파티클 업데이트 로직 테스트
- 애니메이션 OFF 모드 테스트
- `prefers-reduced-motion` 감지 테스트

**`toast-system.test.js`**:
- 토스트 메시지 표시 테스트
- 자동 소멸 테스트 (2초)
- 페이드아웃 애니메이션 테스트

### 통합 테스트

1. **GUIDE-001 연동 테스트**:
   ```javascript
   describe('GUIDE-001 통합', () => {
     it('currentIndex 업데이트 시 진행도가 갱신된다', () => {
       const readingGuide = new ReadingGuide();
       const tracker = new ProgressTracker(readingGuide);

       readingGuide.moveToNext(); // currentIndex++

       expect(tracker.currentProgress).toBeGreaterThan(0);
     });
   });
   ```

2. **마일스톤 달성 시 폭죽 + 토스트 표시 확인**
3. **진행 바 실시간 업데이트 확인**

### 성능 테스트

1. **60fps 유지 확인**:
   - Chrome DevTools Performance 프로파일링
   - FPS 그래프 분석

2. **200개 파티클 동시 렌더링 테스트**:
   - 메모리 사용량 모니터링 (<20MB)
   - CPU 사용률 측정

3. **메모리 누수 테스트**:
   - 장시간 사용 시뮬레이션 (1시간)
   - Heap Snapshot 비교

### 접근성 테스트

1. **`prefers-reduced-motion` 자동 감지 확인**:
   ```javascript
   describe('접근성', () => {
     it('prefers-reduced-motion 시 애니메이션을 비활성화한다', () => {
       window.matchMedia = jest.fn().mockReturnValue({ matches: true });
       const animator = new MilestoneAnimator(mockCanvas);

       expect(animator.animationEnabled).toBe(false);
     });
   });
   ```

2. **스크린 리더 ARIA 레이블 읽기 테스트**
3. **키보드 네비게이션 테스트**

---

## Implementation Notes

### 성능 최적화
1. `requestAnimationFrame`으로 60fps 보장
2. 파티클 수 동적 조절 (성능 저하 시 50% 감소)
3. Canvas 외부 파티클 제거 (화면 밖 렌더링 방지)

### 접근성 고려사항
1. `prefers-reduced-motion` 자동 감지 및 대응
2. ARIA 레이블: "진행도: 45.5%, 다음 마일스톤까지 2문장"
3. 키보드 네비게이션 지원 (Tab으로 설정 접근)

### 브라우저 호환성
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 보안 고려사항
- LocalStorage XSS 방지: 데이터 검증
- Canvas 오염 방지: 외부 이미지 사용 금지

---

## File Structure

```
reading-tablet/
├── js/
│   ├── progress-tracker.js      # @CODE:PROGRESS-001:DOMAIN
│   ├── milestone-animator.js    # @CODE:PROGRESS-001:UI
│   └── toast-system.js          # @CODE:PROGRESS-001:UI
├── css/
│   ├── progress-bar.css         # @CODE:PROGRESS-001:UI
│   └── fireworks.css            # @CODE:PROGRESS-001:UI
├── tests/
│   └── progress/
│       ├── progress-tracker.test.js  # @TEST:PROGRESS-001
│       ├── milestone-animator.test.js # @TEST:PROGRESS-001
│       └── toast-system.test.js      # @TEST:PROGRESS-001
└── docs/
    └── features/
        └── progress-motivation.md    # @DOC:PROGRESS-001
```

---

## Next Steps

1. **TDD 구현**: `/alfred:2-build PROGRESS-001`
   - RED: 마일스톤 감지 테스트 작성
   - GREEN: `ProgressTracker` 클래스 구현
   - REFACTOR: 성능 최적화

2. **문서 동기화**: `/alfred:3-sync`
   - Living Document 생성
   - TAG 체인 검증

3. **수동 통합 테스트**:
   - GUIDE-001과 함께 실제 텍스트로 테스트
   - 다양한 마일스톤 달성 시나리오 확인

---

## References

- **GUIDE-001**: 읽기 가이드 시스템 명세
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **LocalStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **prefers-reduced-motion**: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
