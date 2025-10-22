// @CODE:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md | TEST: tests/progress/milestone-animator.test.js
// Phase 3: MilestoneAnimator 클래스 - Canvas 기반 폭죽 애니메이션
//
// TDD 이력:
// - RED: tests/progress/milestone-animator.test.js 작성 (150개 파티클, 6그룹, 60fps)
// - GREEN: Canvas 애니메이션 렌더링 루프 구현
// - REFACTOR: 배치 렌더링 최적화, TDD 주석 추가

import { Particle } from './particle.js';

// 애니메이션 상수
const ANIMATION_DURATION = 3000; // 3초
const GROUP_COUNT = 6; // 6개 그룹
const PARTICLES_PER_GROUP = 25; // 그룹당 25개
const GROUP_DELAY = 500 / GROUP_COUNT; // 83.33ms 간격
const TOAST_DURATION = 2000; // 토스트 2초 표시
const TOAST_FADE_DURATION = 500; // 페이드아웃 0.5초

// 무지개 7색
const RAINBOW_COLORS = [
  '#FF0000', // 빨강
  '#FF7F00', // 주황
  '#FFFF00', // 노랑
  '#00FF00', // 초록
  '#0000FF', // 파랑
  '#4B0082', // 남색
  '#9400D3', // 보라
];

/**
 * MilestoneAnimator 클래스
 *
 * 마일스톤 달성 시 Canvas 기반 무지개 폭죽 애니메이션을 표시합니다.
 * 6개 그룹 × 25개 파티클 = 150개의 파티클을 시간차로 발사하여
 * 화려한 폭죽 효과를 구현합니다.
 *
 * @class MilestoneAnimator
 * @property {HTMLCanvasElement} canvas - Canvas 요소
 * @property {CanvasRenderingContext2D} ctx - Canvas 2D 컨텍스트
 * @property {Particle[]} particles - 활성화된 파티클 배열
 * @property {Object[]} particleGroups - 파티클 그룹 (발사 대기)
 * @property {boolean} isAnimating - 애니메이션 진행 여부
 * @property {boolean} animationEnabled - 애니메이션 활성화 여부
 * @property {number} animationStartTime - 애니메이션 시작 시간
 * @property {number} animationId - requestAnimationFrame ID
 */
export class MilestoneAnimator {
  /**
   * MilestoneAnimator 생성자
   *
   * @param {HTMLCanvasElement} canvas - Canvas 요소
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleGroups = [];
    this.isAnimating = false;
    this.animationEnabled = true;
    this.animationStartTime = 0;
    this.animationId = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.checkReducedMotion();
  }

  /**
   * prefers-reduced-motion 설정 확인
   *
   * 사용자가 애니메이션 감소 설정을 활성화한 경우
   * 폭죽 애니메이션을 비활성화합니다.
   */
  checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      this.animationEnabled = false;
    }
  }

  /**
   * 마일스톤 달성 축하
   *
   * @param {number} milestone - 달성한 마일스톤 (5, 10, ..., 100)
   */
  celebrate(milestone) {
    // 애니메이션 비활성화 시 토스트만 표시
    if (!this.animationEnabled) {
      const message =
        milestone === 100 ? '🎉 완독 축하합니다!' : `${milestone}% 달성!`;
      this.showToast(message);
      return;
    }

    // 폭죽 애니메이션 + 토스트
    this.createFireworks();
    const message =
      milestone === 100 ? '🎉 완독 축하합니다!' : `${milestone}% 달성!`;
    this.showToast(message);
    this.startAnimation();
  }

  /**
   * 폭죽 파티클 그룹 생성
   *
   * 6개 그룹 × 25개 파티클 = 150개
   * 각 그룹은 83.33ms 간격으로 발사됩니다.
   */
  createFireworks() {
    this.particleGroups = [];

    const centerX = this.canvas.width / 2;
    const startY = this.canvas.height; // 화면 하단에서 발사

    for (let groupIndex = 0; groupIndex < GROUP_COUNT; groupIndex++) {
      const particles = [];

      for (let i = 0; i < PARTICLES_PER_GROUP; i++) {
        const color =
          RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
        const particle = new Particle(centerX, startY, color, 'circle');
        particles.push(particle);
      }

      this.particleGroups.push({
        particles,
        delay: groupIndex * GROUP_DELAY,
        launched: false,
      });
    }
  }

  /**
   * 애니메이션 시작
   *
   * requestAnimationFrame을 사용하여 60fps 렌더링 루프를 시작합니다.
   */
  startAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.animationStartTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - this.animationStartTime;

      // 3초 경과 시 애니메이션 종료
      if (elapsed >= ANIMATION_DURATION) {
        this.stop();
        return;
      }

      // 그룹별 발사 타이밍 체크
      this.launchGroups(elapsed);

      // 파티클 업데이트 및 렌더링
      this.update();
      this.render();

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * 시간에 따라 파티클 그룹 발사
   *
   * @param {number} elapsed - 애니메이션 시작 후 경과 시간 (ms)
   */
  launchGroups(elapsed) {
    this.particleGroups.forEach((group) => {
      if (!group.launched && elapsed >= group.delay) {
        this.particles.push(...group.particles);
        group.launched = true;
      }
    });
  }

  /**
   * 파티클 상태 업데이트
   *
   * 모든 파티클의 물리 시뮬레이션을 업데이트하고,
   * 소멸한 파티클을 제거합니다.
   */
  update() {
    // 소멸하지 않은 파티클만 유지
    this.particles = this.particles.filter((p) => !p.isDead());

    // 모든 파티클 업데이트
    this.particles.forEach((p) => p.update());
  }

  /**
   * 파티클 렌더링
   *
   * Canvas에 모든 파티클을 그립니다.
   */
  render() {
    // Canvas 지우기
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 모든 파티클 그리기
    this.particles.forEach((p) => {
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

  /**
   * 별 모양 그리기
   *
   * @param {number} cx - 중심 X 좌표
   * @param {number} cy - 중심 Y 좌표
   * @param {number} spikes - 뾰족한 각 개수
   * @param {number} outerRadius - 외곽 반지름
   * @param {number} innerRadius - 내곽 반지름
   */
  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
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

  /**
   * 스파클 모양 그리기
   *
   * @param {number} x - 중심 X 좌표
   * @param {number} y - 중심 Y 좌표
   * @param {number} size - 크기
   */
  drawSparkle(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x, y + size);
    this.ctx.moveTo(x - size, y);
    this.ctx.lineTo(x + size, y);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  /**
   * 애니메이션 중지
   *
   * 진행 중인 애니메이션을 즉시 중단하고 리소스를 정리합니다.
   */
  stop() {
    this.isAnimating = false;
    this.particles = [];
    this.particleGroups = [];

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Canvas 지우기
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Canvas 크기 조정
   *
   * 브라우저 창 크기에 맞춰 Canvas 크기를 조정합니다.
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * 토스트 메시지 표시
   *
   * 화면 상단에 토스트 메시지를 2초간 표시합니다.
   *
   * @param {string} message - 표시할 메시지
   */
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), TOAST_FADE_DURATION);
    }, TOAST_DURATION);
  }
}
