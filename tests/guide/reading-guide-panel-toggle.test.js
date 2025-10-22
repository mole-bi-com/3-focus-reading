/**
 * @TEST:GUIDE-001-v0.0.2 | SPEC: .moai/specs/SPEC-GUIDE-001/spec.md
 *
 * 원본 패널 토글 기능 테스트
 *
 * 테스트 케이스:
 * 1. start() 호출 시 body에 .guide-active 클래스 추가
 * 2. stop() 호출 시 .guide-active 클래스 제거
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ReadingGuide from '../../js/reading-guide.js';

describe('GUIDE-001-v0.0.2: 원본 패널 토글', () => {
    let guide;

    beforeEach(() => {
        // HTML 설정
        document.body.innerHTML = `
            <div id="outputText">
                <p>첫 번째 문장입니다. 두 번째 문장입니다. 세 번째 문장입니다.</p>
                <p>네 번째 문장입니다. 다섯 번째 문장입니다.</p>
            </div>
        `;

        // ReadingGuide 인스턴스 생성
        guide = new ReadingGuide({ debug: false });
    });

    afterEach(() => {
        // 정리
        if (guide.isActive) {
            guide.stop();
        }
        guide = null;
        document.body.innerHTML = '';
    });

    it('start() 호출 시 body에 .guide-active 클래스가 추가되어야 함', () => {
        // Given: 가이드가 비활성 상태
        expect(document.body.classList.contains('guide-active')).toBe(false);

        // When: 가이드 시작
        guide.start();

        // Then: body에 .guide-active 클래스 추가
        expect(document.body.classList.contains('guide-active')).toBe(true);
    });

    it('stop() 호출 시 .guide-active 클래스가 제거되어야 함', () => {
        // Given: 가이드가 활성 상태
        guide.start();
        expect(document.body.classList.contains('guide-active')).toBe(true);

        // When: 가이드 중지
        guide.stop();

        // Then: body에서 .guide-active 클래스 제거
        expect(document.body.classList.contains('guide-active')).toBe(false);
    });

    it('start() → stop() → start() 반복 시 클래스가 올바르게 토글되어야 함', () => {
        // 첫 번째 사이클
        guide.start();
        expect(document.body.classList.contains('guide-active')).toBe(true);

        guide.stop();
        expect(document.body.classList.contains('guide-active')).toBe(false);

        // 두 번째 사이클
        guide.start();
        expect(document.body.classList.contains('guide-active')).toBe(true);

        guide.stop();
        expect(document.body.classList.contains('guide-active')).toBe(false);
    });
});
