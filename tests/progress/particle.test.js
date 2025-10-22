// @TEST:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md
// Phase 2: Particle 클래스 단위 테스트

import { describe, it, expect, beforeEach } from 'vitest';
import { Particle } from '../../js/particle.js';

describe('Particle 클래스', () => {
  describe('생성자 파라미터 검증', () => {
    it('초기 위치(x, y)를 올바르게 설정한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');

      expect(particle.x).toBe(100);
      expect(particle.y).toBe(200);
    });

    it('색상을 올바르게 설정한다', () => {
      const particle = new Particle(100, 200, '#FF0000', 'circle');

      expect(particle.color).toBe('#FF0000');
    });

    it('파티클 타입을 올바르게 설정한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');

      expect(particle.type).toBe('circle');
    });

    it('초기 생명력을 1.0으로 설정한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');

      expect(particle.life).toBe(1.0);
    });

    it('중력 가속도를 0.2로 설정한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');

      expect(particle.gravity).toBe(0.2);
    });
  });

  describe('물리 시뮬레이션 (초기 속도)', () => {
    it('vx는 -6 ~ +6 범위 내에 있어야 한다', () => {
      // 100번 생성하여 모든 경우가 범위 내에 있는지 확인
      for (let i = 0; i < 100; i++) {
        const particle = new Particle(100, 200, 'red', 'circle');

        expect(particle.vx).toBeGreaterThanOrEqual(-6);
        expect(particle.vx).toBeLessThanOrEqual(6);
      }
    });

    it('vy는 -8 ~ -4 범위 내에 있어야 한다 (위로 발사)', () => {
      // 100번 생성하여 모든 경우가 범위 내에 있는지 확인
      for (let i = 0; i < 100; i++) {
        const particle = new Particle(100, 200, 'red', 'circle');

        expect(particle.vy).toBeGreaterThanOrEqual(-8);
        expect(particle.vy).toBeLessThanOrEqual(-4);
      }
    });
  });

  describe('update() 메서드', () => {
    let particle;

    beforeEach(() => {
      particle = new Particle(100, 200, 'red', 'circle');
      // 초기 속도 고정 (랜덤 제거)
      particle.vx = 3;
      particle.vy = -6;
    });

    it('x 위치를 vx만큼 이동시킨다', () => {
      const initialX = particle.x;

      particle.update();

      expect(particle.x).toBe(initialX + 3);
    });

    it('y 위치를 vy만큼 이동시킨다', () => {
      const initialY = particle.y;

      particle.update();

      expect(particle.y).toBe(initialY - 6); // vy가 -6이므로 위로 이동
    });

    it('vy에 중력(0.2)을 적용한다', () => {
      const initialVy = particle.vy;

      particle.update();

      expect(particle.vy).toBe(initialVy + 0.2);
    });

    it('생명력을 1/180씩 감소시킨다 (3초 = 180프레임)', () => {
      const initialLife = particle.life;
      const lifeDecrement = 1 / 180;

      particle.update();

      expect(particle.life).toBeCloseTo(initialLife - lifeDecrement, 5);
    });

    it('여러 프레임 업데이트 후 생명력이 0 이하가 된다', () => {
      // 180프레임 = 3초 (60fps 기준)
      for (let i = 0; i < 180; i++) {
        particle.update();
      }

      // 부동소수점 정밀도 허용 (epsilon 사용)
      expect(particle.life).toBeLessThan(0.001); // 실질적으로 0
    });
  });

  describe('isDead() 메서드', () => {
    it('생명력이 0보다 크면 false를 반환한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');

      expect(particle.isDead()).toBe(false);
    });

    it('생명력이 0이면 true를 반환한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');
      particle.life = 0;

      expect(particle.isDead()).toBe(true);
    });

    it('생명력이 음수면 true를 반환한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');
      particle.life = -0.1;

      expect(particle.isDead()).toBe(true);
    });
  });

  describe('무지개 색상 지원', () => {
    const rainbowColors = [
      { name: 'red', value: '#FF0000' },
      { name: 'orange', value: '#FF7F00' },
      { name: 'yellow', value: '#FFFF00' },
      { name: 'green', value: '#00FF00' },
      { name: 'cyan', value: '#00FFFF' },
      { name: 'blue', value: '#0000FF' },
      { name: 'purple', value: '#8B00FF' },
    ];

    rainbowColors.forEach(({ name, value }) => {
      it(`${name} 색상(${value})을 올바르게 저장한다`, () => {
        const particle = new Particle(100, 200, value, 'circle');

        expect(particle.color).toBe(value);
      });
    });
  });

  describe('파티클 타입 지원', () => {
    const types = ['circle', 'star', 'sparkle'];

    types.forEach((type) => {
      it(`${type} 타입을 올바르게 저장한다`, () => {
        const particle = new Particle(100, 200, 'red', type);

        expect(particle.type).toBe(type);
      });
    });
  });

  describe('물리 시뮬레이션 통합 테스트', () => {
    it('발사 → 상승 → 하강 → 소멸 사이클을 시뮬레이션한다', () => {
      const particle = new Particle(100, 200, 'red', 'circle');
      particle.vx = 3;
      particle.vy = -6; // 위로 발사

      // 초기 상태 확인
      expect(particle.y).toBe(200);
      expect(particle.isDead()).toBe(false);

      // 180프레임 업데이트 (3초)
      for (let i = 0; i < 180; i++) {
        particle.update();
      }

      // 최종 상태: 생명력 0 이하 (부동소수점 허용)
      expect(particle.life).toBeLessThan(0.001);
      expect(particle.isDead()).toBe(true);
    });
  });
});
