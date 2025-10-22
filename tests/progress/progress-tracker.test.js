// @TEST:PROGRESS-001 | SPEC: SPEC-PROGRESS-001.md
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProgressTracker } from '../../js/progress-tracker.js';

describe('ProgressTracker', () => {
    let mockReadingGuide;
    let tracker;
    let originalLocalStorage;

    beforeEach(() => {
        // Mock ReadingGuide
        mockReadingGuide = {
            currentIndex: 0,
            sentences: { length: 100 }, // totalSentences 대신 sentences.length 사용
            isActive: true,
            callbacks: [],
            setOnIndexChange(callback) { // onIndexChange → setOnIndexChange
                this.callbacks.push(callback);
            },
            triggerIndexChange() {
                this.callbacks.forEach(cb => cb(this.currentIndex, this.sentences.length));
            }
        };

        // Mock localStorage
        originalLocalStorage = global.localStorage;
        global.localStorage = {
            data: {},
            getItem(key) {
                return this.data[key] || null;
            },
            setItem(key, value) {
                this.data[key] = value;
            },
            clear() {
                this.data = {};
            }
        };

        // Clear localStorage before each test
        localStorage.clear();

        tracker = new ProgressTracker(mockReadingGuide);
    });

    describe('진행률 계산', () => {
        it('0% 진행률을 정확히 계산한다', () => {
            const progress = tracker.calculateProgress(0, 100);
            expect(progress).toBe(0);
        });

        it('50% 진행률을 정확히 계산한다', () => {
            const progress = tracker.calculateProgress(50, 100);
            expect(progress).toBe(50);
        });

        it('100% 진행률을 정확히 계산한다', () => {
            const progress = tracker.calculateProgress(100, 100);
            expect(progress).toBe(100);
        });

        it('소수점 첫째 자리까지 계산한다', () => {
            const progress = tracker.calculateProgress(5, 100);
            expect(progress).toBe(5.0);
        });

        it('복잡한 진행률을 정확히 계산한다 (23/100 = 23.0%)', () => {
            const progress = tracker.calculateProgress(23, 100);
            expect(progress).toBe(23.0);
        });
    });

    describe('마일스톤 감지', () => {
        it('5% 마일스톤을 감지한다', () => {
            localStorage.clear();
            const freshTracker = new ProgressTracker(mockReadingGuide);
            const milestone = freshTracker.checkMilestone(5);
            expect(milestone).toBe(5);
        });

        it('10% 마일스톤을 감지한다', () => {
            localStorage.clear();
            const freshTracker = new ProgressTracker(mockReadingGuide);
            const milestone = freshTracker.checkMilestone(10);
            expect(milestone).toBe(10);
        });

        it('100% 마일스톤을 감지한다', () => {
            localStorage.clear();
            const freshTracker = new ProgressTracker(mockReadingGuide);
            const milestone = freshTracker.checkMilestone(100);
            expect(milestone).toBe(100);
        });

        it('마일스톤이 아닌 진행률은 가장 가까운 이전 마일스톤을 감지한다', () => {
            localStorage.clear();
            const freshTracker = new ProgressTracker(mockReadingGuide);
            const milestone = freshTracker.checkMilestone(7.5);
            expect(milestone).toBe(5); // 7.5%는 5% 마일스톤을 통과했으므로 5 반환
        });

        it('2% 진행률은 마일스톤 미달성으로 null을 반환한다', () => {
            localStorage.clear();
            const freshTracker = new ProgressTracker(mockReadingGuide);
            const milestone = freshTracker.checkMilestone(2.0);
            expect(milestone).toBeNull();
        });

        it('이미 달성한 마일스톤은 다시 감지하지 않는다', () => {
            tracker.achievedMilestones.add(5);
            const milestone = tracker.checkMilestone(5);
            expect(milestone).toBeNull();
        });

        it('5.1% 진행 시 5% 마일스톤을 감지한다', () => {
            const milestone = tracker.checkMilestone(5.1);
            expect(milestone).toBe(5);
        });

        it('9.9% 진행 시 5% 마일스톤을 감지하고 10%는 감지하지 않는다', () => {
            const milestone = tracker.checkMilestone(9.9);
            expect(milestone).toBe(5);
        });
    });

    describe('LocalStorage 저장/로드', () => {
        it('마일스톤 달성 상태를 저장한다', () => {
            tracker.achievedMilestones.add(5);
            tracker.achievedMilestones.add(10);
            tracker.currentProgress = 12.5;
            tracker.saveState();

            const saved = JSON.parse(localStorage.getItem('progress-milestones'));
            expect(saved.achievedMilestones).toEqual([5, 10]);
            expect(saved.currentProgress).toBe(12.5);
            expect(saved.lastUpdated).toBeTypeOf('number');
        });

        it('저장된 마일스톤 상태를 로드한다', () => {
            localStorage.setItem('progress-milestones', JSON.stringify({
                achievedMilestones: [5, 10, 15],
                currentProgress: 18.5,
                lastUpdated: Date.now()
            }));

            const newTracker = new ProgressTracker(mockReadingGuide);

            expect(newTracker.achievedMilestones.has(5)).toBe(true);
            expect(newTracker.achievedMilestones.has(10)).toBe(true);
            expect(newTracker.achievedMilestones.has(15)).toBe(true);
            expect(newTracker.achievedMilestones.has(20)).toBe(false);
        });

        it('저장된 상태가 없을 때 빈 Set으로 초기화한다', () => {
            const newTracker = new ProgressTracker(mockReadingGuide);
            expect(newTracker.achievedMilestones.size).toBe(0);
        });
    });

    describe('ReadingGuide 콜백 연동', () => {
        it('인덱스 변경 시 진행률을 업데이트한다', () => {
            mockReadingGuide.currentIndex = 0;
            mockReadingGuide.triggerIndexChange();

            expect(tracker.currentProgress).toBe(0);

            mockReadingGuide.currentIndex = 25;
            mockReadingGuide.triggerIndexChange();

            expect(tracker.currentProgress).toBe(25);
        });

        it('마일스톤 달성 시 이벤트를 트리거한다', () => {
            const eventSpy = vi.fn();
            tracker.triggerMilestoneEvent = eventSpy;

            mockReadingGuide.currentIndex = 5;
            mockReadingGuide.triggerIndexChange();

            expect(eventSpy).toHaveBeenCalledWith(5);
        });

        it('마일스톤 미달성 시 이벤트를 트리거하지 않는다', () => {
            const eventSpy = vi.fn();
            tracker.triggerMilestoneEvent = eventSpy;

            mockReadingGuide.currentIndex = 3;
            mockReadingGuide.triggerIndexChange();

            expect(eventSpy).not.toHaveBeenCalled();
        });
    });

    describe('마일스톤 정책', () => {
        it('20개 마일스톤을 올바르게 정의한다', () => {
            expect(tracker.milestones).toEqual([
                5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                55, 60, 65, 70, 75, 80, 85, 90, 95, 100
            ]);
        });

        it('모든 마일스톤은 5의 배수이다', () => {
            tracker.milestones.forEach(m => {
                expect(m % 5).toBe(0);
            });
        });
    });

    describe('중복 달성 방지', () => {
        it('이미 달성한 마일스톤을 재방문해도 중복 저장하지 않는다', () => {
            mockReadingGuide.currentIndex = 5;
            mockReadingGuide.triggerIndexChange();

            const firstSize = tracker.achievedMilestones.size;

            mockReadingGuide.currentIndex = 3;
            mockReadingGuide.triggerIndexChange();

            mockReadingGuide.currentIndex = 5;
            mockReadingGuide.triggerIndexChange();

            expect(tracker.achievedMilestones.size).toBe(firstSize);
        });
    });
});
