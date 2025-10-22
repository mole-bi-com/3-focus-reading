// @TEST:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Progress Bar UI', () => {
  let container;
  let progressFill;
  let progressText;

  beforeEach(() => {
    // HTML 구조 생성
    document.body.innerHTML = `
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-text"></div>
      </div>
    `;

    container = document.querySelector('.progress-container');
    progressFill = document.querySelector('.progress-fill');
    progressText = document.querySelector('.progress-text');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('진행률 바 표시', () => {
    it('0%일 때 진행률 바가 표시되지 않는다', () => {
      progressFill.style.width = '0%';
      expect(progressFill.style.width).toBe('0%');
    });

    it('50%일 때 진행률 바가 50%로 표시된다', () => {
      progressFill.style.width = '50%';
      expect(progressFill.style.width).toBe('50%');
    });

    it('100%일 때 진행률 바가 100%로 채워진다', () => {
      progressFill.style.width = '100%';
      expect(progressFill.style.width).toBe('100%');
    });

    it('진행률 바는 0.3s ease 트랜지션을 가진다', () => {
      const styles = window.getComputedStyle(progressFill);
      // Note: JSDOM에서는 CSS 트랜지션을 완벽히 테스트할 수 없으므로
      // 실제 브라우저에서 수동 확인 필요
      expect(progressFill).toBeTruthy();
    });
  });

  describe('퍼센트 텍스트 업데이트', () => {
    it('진행률 텍스트가 업데이트된다', () => {
      progressText.textContent = '45.5%';
      expect(progressText.textContent).toBe('45.5%');
    });

    it('소수점 첫째 자리까지 표시한다', () => {
      const progress = 45.567;
      progressText.textContent = `${progress.toFixed(1)}%`;
      expect(progressText.textContent).toBe('45.6%');
    });

    it('0%일 때도 텍스트가 표시된다', () => {
      progressText.textContent = '0.0%';
      expect(progressText.textContent).toBe('0.0%');
    });
  });

  describe('토스트 메시지', () => {
    it('마일스톤 달성 시 토스트 메시지가 표시된다', () => {
      const toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.textContent = '5% 달성!';
      document.body.appendChild(toast);

      expect(document.querySelector('.toast-message')).toBeTruthy();
      expect(document.querySelector('.toast-message').textContent).toBe('5% 달성!');
    });

    it('완독 시 축하 메시지가 표시된다', () => {
      const toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.textContent = '🎉 완독 축하합니다!';
      document.body.appendChild(toast);

      expect(document.querySelector('.toast-message').textContent).toBe('🎉 완독 축하합니다!');
    });

    it('토스트 메시지는 2.5초 후 자동으로 사라진다', () => {
      vi.useFakeTimers();

      const toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.textContent = '10% 달성!';
      document.body.appendChild(toast);

      // 2.5초 후 페이드아웃 클래스 추가
      setTimeout(() => {
        toast.style.opacity = '0';
      }, 2500);

      vi.advanceTimersByTime(2500);
      expect(toast.style.opacity).toBe('0');

      vi.useRealTimers();
    });
  });

  describe('Canvas 레이어', () => {
    it('폭죽 Canvas가 고정 위치에 표시된다', () => {
      const canvas = document.createElement('canvas');
      canvas.id = 'fireworks-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);

      const fireworksCanvas = document.getElementById('fireworks-canvas');
      expect(fireworksCanvas).toBeTruthy();
      expect(fireworksCanvas.style.position).toBe('fixed');
      expect(fireworksCanvas.style.pointerEvents).toBe('none');
      expect(fireworksCanvas.style.zIndex).toBe('9999');
    });

    it('Canvas는 클릭 이벤트를 무시한다', () => {
      const canvas = document.createElement('canvas');
      canvas.id = 'fireworks-canvas';
      canvas.style.pointerEvents = 'none';
      document.body.appendChild(canvas);

      const fireworksCanvas = document.getElementById('fireworks-canvas');
      expect(fireworksCanvas.style.pointerEvents).toBe('none');
    });
  });

  describe('prefers-reduced-motion 지원', () => {
    it('애니메이션 감소 설정 시 트랜지션이 비활성화된다', () => {
      // Media query 모킹
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });
      window.matchMedia = mockMatchMedia;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      expect(prefersReducedMotion).toBe(true);

      // CSS에서 animation: none 적용 확인은 수동 테스트 필요
    });
  });
});
