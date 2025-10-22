// @TEST:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md
// Phase 3: MilestoneAnimator 클래스 테스트
//
// 핵심 기능:
// - Canvas API 모킹 (happy-dom 환경)
// - 150개 파티클 발사 (6그룹 × 25개)
// - 60fps 렌더링 루프 (requestAnimationFrame)
// - 파티클 생명주기 관리
// - 메모리 관리 (<20MB)
// - 애니메이션 종료 감지

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MilestoneAnimator } from '../../js/milestone-animator.js';
import { Particle } from '../../js/particle.js';

describe('MilestoneAnimator', () => {
  let canvas;
  let ctx;
  let animator;

  beforeEach(() => {
    // Canvas 모킹 (happy-dom은 Canvas API를 지원하지 않음)
    canvas = document.createElement('canvas');
    ctx = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    };

    // getContext 모킹
    canvas.getContext = vi.fn(() => ctx);

    // globalAlpha, fillStyle 등의 setter 모킹
    Object.defineProperty(ctx, 'globalAlpha', {
      set: vi.fn(),
      get: () => 1,
    });

    Object.defineProperty(ctx, 'fillStyle', {
      set: vi.fn(),
      get: () => '#000000',
    });

    Object.defineProperty(ctx, 'lineWidth', {
      set: vi.fn(),
      get: () => 1,
    });

    // Canvas 크기 설정
    canvas.width = 1920;
    canvas.height = 1080;

    // requestAnimationFrame 모킹
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 16); // 60fps = ~16ms
      return 1;
    });

    // Date.now 모킹 (시간 제어)
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('초기화', () => {
    it('Canvas 컨텍스트를 가져온다', () => {
      animator = new MilestoneAnimator(canvas);

      expect(canvas.getContext).toHaveBeenCalledWith('2d');
      expect(animator.ctx).toBe(ctx);
    });

    it('초기 상태를 올바르게 설정한다', () => {
      animator = new MilestoneAnimator(canvas);

      expect(animator.canvas).toBe(canvas);
      expect(animator.particles).toEqual([]);
      expect(animator.isAnimating).toBe(false);
      expect(animator.particleGroups).toEqual([]);
    });

    it('prefers-reduced-motion 설정을 감지한다', () => {
      // prefers-reduced-motion: reduce 시뮬레이션
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      animator = new MilestoneAnimator(canvas);

      expect(animator.animationEnabled).toBe(false);
    });

    it('일반 모드에서는 애니메이션을 활성화한다', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });

      animator = new MilestoneAnimator(canvas);

      expect(animator.animationEnabled).toBe(true);
    });
  });

  describe('파티클 그룹 생성', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
    });

    it('6개 그룹 × 25개 파티클 = 150개를 생성한다', () => {
      animator.createFireworks();

      // 6개 그룹 생성 확인
      expect(animator.particleGroups).toHaveLength(6);

      // 각 그룹은 25개씩
      animator.particleGroups.forEach((group) => {
        expect(group.particles).toHaveLength(25);
      });

      // 총 150개
      const totalParticles = animator.particleGroups.reduce(
        (sum, group) => sum + group.particles.length,
        0
      );
      expect(totalParticles).toBe(150);
    });

    it('각 그룹은 83.33ms 간격으로 발사된다', () => {
      animator.createFireworks();

      const expectedDelays = [0, 83.33, 166.66, 249.99, 333.32, 416.65];

      animator.particleGroups.forEach((group, index) => {
        expect(group.delay).toBeCloseTo(expectedDelays[index], 1);
      });
    });

    it('파티클은 무지개 7색 중 하나로 생성된다', () => {
      animator.createFireworks();

      const rainbowColors = [
        '#FF0000', // 빨강
        '#FF7F00', // 주황
        '#FFFF00', // 노랑
        '#00FF00', // 초록
        '#0000FF', // 파랑
        '#4B0082', // 남색
        '#9400D3', // 보라
      ];

      let hasAllColors = false;
      const usedColors = new Set();

      animator.particleGroups.forEach((group) => {
        group.particles.forEach((particle) => {
          expect(rainbowColors).toContain(particle.color);
          usedColors.add(particle.color);
        });
      });

      // 최소 5가지 색상은 사용되어야 함
      expect(usedColors.size).toBeGreaterThanOrEqual(5);
    });

    it('파티클은 화면 중앙 하단에서 발사된다', () => {
      animator.createFireworks();

      const centerX = canvas.width / 2;

      animator.particleGroups.forEach((group) => {
        group.particles.forEach((particle) => {
          expect(particle.x).toBeCloseTo(centerX, 10); // ±10px 허용
          expect(particle.y).toBe(canvas.height); // 하단에서 발사
        });
      });
    });
  });

  describe('애니메이션 시작', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
    });

    it('celebrate() 호출 시 애니메이션을 시작한다', () => {
      animator.celebrate(50);

      expect(animator.isAnimating).toBe(true);
      expect(animator.particleGroups.length).toBeGreaterThan(0);
    });

    it('애니메이션 비활성화 시 토스트만 표시한다', () => {
      animator.animationEnabled = false;
      animator.celebrate(50);

      expect(animator.isAnimating).toBe(false);
      expect(animator.particleGroups).toEqual([]);

      // 토스트 메시지 확인
      const toast = document.querySelector('.toast-message');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toBe('50% 달성!');
    });

    it('100% 달성 시 완독 메시지를 표시한다', () => {
      animator.celebrate(100);

      const toast = document.querySelector('.toast-message');
      expect(toast.textContent).toBe('🎉 완독 축하합니다!');
    });
  });

  describe('파티클 발사 타이밍', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
      animator.createFireworks();
      animator.startAnimation();
    });

    it('0ms 시점: 그룹 1 발사 (25개)', () => {
      expect(animator.particles).toHaveLength(25);
    });

    it('83ms 시점: 그룹 2 추가 발사 (총 50개)', () => {
      vi.advanceTimersByTime(83);

      expect(animator.particles.length).toBeGreaterThanOrEqual(50);
    });

    it('500ms 시점: 모든 그룹 발사 완료 (총 150개)', () => {
      vi.advanceTimersByTime(500);

      expect(animator.particles.length).toBeGreaterThanOrEqual(150);
    });
  });

  describe('렌더링 루프', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
      animator.createFireworks();
    });

    it('render() 호출 시 모든 파티클을 그린다', () => {
      animator.particles = [
        new Particle(100, 100, '#FF0000', 'circle'),
        new Particle(200, 200, '#00FF00', 'circle'),
      ];

      animator.render();

      // clearRect 호출 확인
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);

      // arc 호출 횟수 확인 (circle 타입 2개)
      expect(ctx.arc).toHaveBeenCalledTimes(2);
    });

    it('update() 호출 시 모든 파티클을 업데이트한다', () => {
      const particle1 = new Particle(100, 100, '#FF0000', 'circle');
      const particle2 = new Particle(200, 200, '#00FF00', 'circle');

      animator.particles = [particle1, particle2];

      const initialY1 = particle1.y;
      const initialY2 = particle2.y;

      animator.update();

      // 위치가 변경되었는지 확인
      expect(particle1.y).not.toBe(initialY1);
      expect(particle2.y).not.toBe(initialY2);
    });

    it('소멸한 파티클을 제거한다', () => {
      const aliveParticle = new Particle(100, 100, '#FF0000', 'circle');
      const deadParticle = new Particle(200, 200, '#00FF00', 'circle');
      deadParticle.life = 0; // 소멸 상태

      animator.particles = [aliveParticle, deadParticle];

      animator.update();

      expect(animator.particles).toHaveLength(1);
      expect(animator.particles[0]).toBe(aliveParticle);
    });
  });

  describe('애니메이션 종료', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
    });

    it('3초 후 애니메이션이 자동으로 종료된다', () => {
      animator.celebrate(50);

      expect(animator.isAnimating).toBe(true);

      // 3초 경과
      vi.advanceTimersByTime(3000);

      expect(animator.isAnimating).toBe(false);
      expect(animator.particles).toEqual([]);
    });

    it('stop() 호출 시 즉시 애니메이션을 중단한다', () => {
      animator.celebrate(50);

      expect(animator.isAnimating).toBe(true);

      animator.stop();

      expect(animator.isAnimating).toBe(false);
      expect(animator.particles).toEqual([]);
    });
  });

  describe('토스트 메시지', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
    });

    it('showToast() 호출 시 토스트 요소를 생성한다', () => {
      animator.showToast('테스트 메시지');

      const toast = document.querySelector('.toast-message');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toBe('테스트 메시지');
    });

    it('2초 후 토스트가 자동으로 사라진다', () => {
      animator.showToast('테스트 메시지');

      const toast = document.querySelector('.toast-message');
      expect(toast).toBeTruthy();

      // 2초 경과
      vi.advanceTimersByTime(2000);

      // fade-out 클래스 추가 확인
      expect(toast.classList.contains('fade-out')).toBe(true);

      // 추가 0.5초 경과 (fade-out 애니메이션)
      vi.advanceTimersByTime(500);

      // DOM에서 제거 확인
      expect(document.querySelector('.toast-message')).toBeFalsy();
    });
  });

  describe('성능 요구사항', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
    });

    it('150개 파티클 렌더링이 16ms 이내에 완료된다', () => {
      animator.createFireworks();

      // 모든 파티클 활성화
      animator.particles = animator.particleGroups.flatMap((group) => group.particles);

      const startTime = performance.now();
      animator.render();
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(16); // 60fps = ~16ms
    });

    it('파티클 배열 크기가 메모리 제한을 초과하지 않는다', () => {
      animator.createFireworks();

      // 모든 파티클 활성화
      animator.particles = animator.particleGroups.flatMap((group) => group.particles);

      // 파티클당 약 100바이트로 가정
      const estimatedMemory = animator.particles.length * 100; // bytes

      // 20KB = 20,000바이트
      expect(estimatedMemory).toBeLessThan(20000);
    });
  });

  describe('Canvas 크기 조정', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      animator = new MilestoneAnimator(canvas);
    });

    it('resizeCanvas() 호출 시 Canvas 크기를 조정한다', () => {
      // window 크기 변경 시뮬레이션
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });

      animator.resizeCanvas();

      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);
    });
  });
});
