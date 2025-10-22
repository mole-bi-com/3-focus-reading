// @TEST:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ReadingGuide from '../../js/reading-guide.js';
import { ProgressTracker } from '../../js/progress-tracker.js';

describe('GUIDE-001 통합 테스트', () => {
  let readingGuide;
  let progressTracker;
  let mockOutputText;

  beforeEach(() => {
    // DOM 설정
    document.body.innerHTML = `
      <div id="outputText">
        <p>첫 번째 문장. 두 번째 문장. 세 번째 문장.</p>
        <p>네 번째 문장. 다섯 번째 문장.</p>
      </div>
      <div class="progress-container" style="display: none;">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-text"></div>
      </div>
    `;

    mockOutputText = document.getElementById('outputText');
    readingGuide = new ReadingGuide();
  });

  afterEach(() => {
    if (readingGuide.isActive) {
      readingGuide.stop();
    }
    document.body.innerHTML = '';
    localStorage.clear();
  });

  describe('ReadingGuide에 onIndexChange 콜백 추가', () => {
    it('ReadingGuide에 onIndexChange 함수가 존재한다', () => {
      expect(typeof readingGuide.setOnIndexChange).toBe('function');
    });

    it('인덱스 변경 시 콜백이 호출된다', () => {
      const callback = vi.fn();
      readingGuide.setOnIndexChange(callback);
      readingGuide.start();

      // 다음 문장으로 이동
      readingGuide.next();

      expect(callback).toHaveBeenCalledWith(1, 5); // currentIndex=1, totalSentences=5
    });

    it('이전 문장으로 이동 시에도 콜백이 호출된다', () => {
      const callback = vi.fn();
      readingGuide.setOnIndexChange(callback);
      readingGuide.start();

      // 다음으로 이동 후 이전으로
      readingGuide.next();
      readingGuide.next();
      callback.mockClear();

      readingGuide.prev();

      expect(callback).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('ProgressTracker 자동 업데이트', () => {
    it('ProgressTracker가 ReadingGuide의 인덱스 변경을 감지한다', () => {
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      // 현재 진행도는 0% (currentIndex=0)
      expect(progressTracker.currentProgress).toBe(0);

      // 다음 문장으로 이동
      readingGuide.next();

      // 진행도 업데이트 확인 (1/5 = 20%)
      expect(progressTracker.currentProgress).toBe(20);
    });

    it('진행률 바 UI가 실시간으로 업데이트된다', () => {
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      const progressFill = document.querySelector('.progress-fill');
      const progressText = document.querySelector('.progress-text');

      // 초기 상태
      expect(progressFill.style.width).toBe('0%');
      expect(progressText.textContent).toBe('0.0%');

      // 2번째 문장으로 이동 (40%)
      readingGuide.next();
      readingGuide.next();

      // UI 업데이트 확인
      progressTracker.updateProgressBar();
      expect(progressFill.style.width).toBe('40%');
      expect(progressText.textContent).toBe('40.0%');
    });
  });

  describe('마일스톤 감지 및 애니메이션 트리거', () => {
    it('5% 마일스톤 달성 시 이벤트가 발생한다', () => {
      // 총 100개 문장 시뮬레이션
      document.body.innerHTML = `
        <div id="outputText">
          ${Array.from({ length: 100 }, (_, i) => `<p>문장 ${i + 1}.</p>`).join('')}
        </div>
        <div class="progress-container" style="display: none;">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-text"></div>
        </div>
      `;

      readingGuide = new ReadingGuide();
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      const milestoneListener = vi.fn();
      document.addEventListener('milestone-achieved', milestoneListener);

      // 5번째 문장으로 이동 (5% 달성)
      for (let i = 0; i < 5; i++) {
        readingGuide.next();
      }

      expect(milestoneListener).toHaveBeenCalled();
      expect(milestoneListener.mock.calls[0][0].detail.milestone).toBe(5);
    });

    it('중복 마일스톤은 트리거되지 않는다', () => {
      // 총 100개 문장 시뮬레이션
      document.body.innerHTML = `
        <div id="outputText">
          ${Array.from({ length: 100 }, (_, i) => `<p>문장 ${i + 1}.</p>`).join('')}
        </div>
      `;

      readingGuide = new ReadingGuide();
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      // 5% 마일스톤 달성
      for (let i = 0; i < 5; i++) {
        readingGuide.next();
      }

      const milestoneListener = vi.fn();
      document.addEventListener('milestone-achieved', milestoneListener);

      // 이전 문장으로 돌아갔다가 다시 5% 지점 통과
      readingGuide.prev();
      readingGuide.next();

      expect(milestoneListener).not.toHaveBeenCalled();
    });
  });

  describe('E2E 통합 시나리오', () => {
    it('ReadingGuide 시작 → 읽기 진행 → 마일스톤 달성 → 완독까지 전체 플로우', () => {
      // 총 20개 문장 (5% = 1문장)
      document.body.innerHTML = `
        <div id="outputText">
          ${Array.from({ length: 20 }, (_, i) => `<p>문장 ${i + 1}.</p>`).join('')}
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-text"></div>
        </div>
      `;

      readingGuide = new ReadingGuide();
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      const milestones = [];
      document.addEventListener('milestone-achieved', (e) => {
        milestones.push(e.detail.milestone);
      });

      // 모든 문장 읽기 (currentIndex: 0 → 19)
      for (let i = 0; i < 20; i++) {
        readingGuide.next();
      }

      // 19개 마일스톤 달성 확인 (5%, 10%, ..., 95%)
      // Note: currentIndex=0에서 시작하므로 20번 next() 호출 시 currentIndex=19 (95% 달성)
      expect(milestones.length).toBe(19);
      expect(milestones).toContain(5);
      expect(milestones).toContain(50);
      expect(milestones).toContain(95);

      // 진행률 95% 확인 (19/20 = 95%)
      expect(progressTracker.currentProgress).toBe(95);

      // 진행률 바 UI 95% 확인
      progressTracker.updateProgressBar();
      const progressFill = document.querySelector('.progress-fill');
      expect(progressFill.style.width).toBe('95%');
    });

    it('가이드 비활성화 시 진행도 추적이 중단된다', () => {
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      // 가이드 중지
      readingGuide.stop();

      const initialProgress = progressTracker.currentProgress;

      // 가이드가 비활성화된 상태에서 인덱스 변경 시도
      readingGuide.currentIndex = 5;

      // 진행도는 변경되지 않아야 함
      expect(progressTracker.currentProgress).toBe(initialProgress);
    });
  });

  describe('LocalStorage 통합', () => {
    it('달성한 마일스톤이 LocalStorage에 저장된다', () => {
      // 총 20개 문장
      document.body.innerHTML = `
        <div id="outputText">
          ${Array.from({ length: 20 }, (_, i) => `<p>문장 ${i + 1}.</p>`).join('')}
        </div>
      `;

      readingGuide = new ReadingGuide();
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      // 5% 마일스톤 달성 (1문장)
      readingGuide.next();

      // LocalStorage 확인
      const saved = JSON.parse(localStorage.getItem('progress-milestones'));
      expect(saved.achievedMilestones).toContain(5);
    });

    it('새로고침 후에도 달성한 마일스톤이 유지된다', () => {
      // 총 20개 문장
      document.body.innerHTML = `
        <div id="outputText">
          ${Array.from({ length: 20 }, (_, i) => `<p>문장 ${i + 1}.</p>`).join('')}
        </div>
      `;

      readingGuide = new ReadingGuide();
      readingGuide.start();
      progressTracker = new ProgressTracker(readingGuide);

      // 10% 마일스톤 달성 (2문장)
      readingGuide.next();
      readingGuide.next();

      // 새로운 ProgressTracker 인스턴스 생성 (새로고침 시뮬레이션)
      const newProgressTracker = new ProgressTracker(readingGuide);

      // 이전 마일스톤 유지 확인
      expect(newProgressTracker.achievedMilestones.has(5)).toBe(true);
      expect(newProgressTracker.achievedMilestones.has(10)).toBe(true);
    });
  });
});
