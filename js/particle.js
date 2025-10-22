// @CODE:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md | TEST: tests/progress/particle.test.js
// Phase 2: Particle 클래스 - 폭죽 파티클 물리 시뮬레이션
//
// TDD 이력:
// - RED: tests/progress/particle.test.js 작성 (26개 테스트 케이스)
// - GREEN: 물리 시뮬레이션 구현 (중력, 속도, 생명력)
// - REFACTOR: 상수 추출, 부동소수점 정밀도 처리

// 물리 시뮬레이션 상수
const GRAVITY = 0.2; // 중력 가속도 (px/frame²)
const LIFE_DECREMENT = 1 / 180; // 생명력 감소율 (3초 = 180프레임 @ 60fps)
const LIFE_EPSILON = 0.001; // 부동소수점 허용 오차

// 초기 속도 범위 (px/frame)
const VX_RANGE = 12; // -6 ~ +6
const VY_MIN = -8; // 최소 초기 속도 (위로 발사)
const VY_RANGE = 4; // -8 ~ -4 범위

/**
 * Particle 클래스
 *
 * 폭죽 애니메이션의 개별 파티클을 표현하며,
 * 물리 법칙(중력, 속도, 생명력)을 적용하여 자연스러운 낙하 효과를 구현합니다.
 *
 * @class Particle
 * @property {number} x - X 좌표 (px)
 * @property {number} y - Y 좌표 (px)
 * @property {number} vx - X축 속도 (px/frame)
 * @property {number} vy - Y축 속도 (px/frame)
 * @property {number} gravity - 중력 가속도 (px/frame²)
 * @property {string} color - CSS 색상 문자열
 * @property {string} type - 파티클 타입 ('circle', 'star', 'sparkle')
 * @property {number} life - 생명력 (0.0 ~ 1.0)
 */
export class Particle {
  /**
   * Particle 생성자
   *
   * @param {number} x - 초기 X 좌표 (폭죽 발사 지점)
   * @param {number} y - 초기 Y 좌표 (폭죽 발사 지점)
   * @param {string} color - CSS 색상 문자열 (무지개 7색 지원)
   * @param {string} type - 파티클 타입 ('circle', 'star', 'sparkle')
   */
  constructor(x, y, color, type) {
    // 위치 초기화
    this.x = x;
    this.y = y;

    // 속도 초기화 (랜덤)
    // vx: -6 ~ +6 (좌우로 퍼지는 효과)
    this.vx = (Math.random() - 0.5) * VX_RANGE;

    // vy: -8 ~ -4 (위로 발사, 음수 = 상승)
    // Math.random() * 4 = 0 ~ 4
    // 0 ~ 4 + (-8) = -8 ~ -4
    this.vy = Math.random() * VY_RANGE + VY_MIN;

    // 중력 가속도 (아래로 당기는 힘)
    this.gravity = GRAVITY;

    // 스타일
    this.color = color;
    this.type = type;

    // 생명력 (1.0 = 완전 불투명, 0.0 = 완전 투명/소멸)
    this.life = 1.0;
  }

  /**
   * 파티클 상태 업데이트
   *
   * 매 프레임마다 호출되며, 다음을 수행합니다:
   * 1. 위치 업데이트 (x += vx, y += vy)
   * 2. 중력 적용 (vy += gravity)
   * 3. 생명력 감소 (life -= 1/180)
   *
   * 물리 법칙:
   * - vx는 일정 (공기 저항 무시)
   * - vy는 중력에 의해 매 프레임 증가 (아래로 가속)
   * - 생명력은 180프레임(3초) 후 0이 됨
   */
  update() {
    // 위치 업데이트
    this.x += this.vx;
    this.y += this.vy;

    // 중력 적용 (아래 방향으로 가속)
    this.vy += this.gravity;

    // 생명력 감소 (3초 = 180프레임 @ 60fps)
    this.life -= LIFE_DECREMENT;
  }

  /**
   * 파티클 소멸 여부 확인
   *
   * 부동소수점 정밀도 문제로 인해 epsilon(0.001) 이하를 사실상 0으로 간주합니다.
   *
   * @returns {boolean} 생명력이 epsilon 이하면 true
   */
  isDead() {
    return this.life < LIFE_EPSILON;
  }
}
