// @CODE:PROGRESS-001:DOMAIN | SPEC: SPEC-PROGRESS-001.md | TEST: tests/progress/progress-tracker.test.js

/**
 * ProgressTracker - 읽기 진행도 추적 및 마일스톤 관리 클래스
 *
 * TDD 이력:
 * - RED: tests/progress/progress-tracker.test.js 작성 (22개 테스트)
 * - GREEN: 진행도 계산, 마일스톤 감지, LocalStorage 연동 구현
 * - REFACTOR: 코드 주석 개선, 상수 분리
 *
 * 역할:
 * - 현재 읽기 진행도 계산 (0~100%, 소수점 첫째 자리)
 * - 5% 단위 마일스톤 감지 (20개: 5%, 10%, ..., 100%)
 * - LocalStorage 상태 저장/복원
 * - ReadingGuide 인덱스 변경 콜백 연동
 *
 * 제약사항:
 * - 마일스톤 체크 시간: 0.1초 이내
 * - LocalStorage 사용량: 10KB 이내
 */
export class ProgressTracker {
    // 상수 정의
    static MILESTONE_INTERVAL = 5; // 마일스톤 간격 (%)
    static STORAGE_KEY = 'progress-milestones'; // LocalStorage 키
    constructor(readingGuide) {
        this.readingGuide = readingGuide;
        this.currentProgress = 0;
        this.achievedMilestones = new Set();
        this.milestones = [
            5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
            55, 60, 65, 70, 75, 80, 85, 90, 95, 100
        ];

        this.loadState();

        // ReadingGuide의 콜백 등록
        this.readingGuide.setOnIndexChange(this.onIndexChange.bind(this));

        // 초기 진행 바 업데이트
        if (this.readingGuide.isActive && this.readingGuide.sentences.length > 0) {
            this.currentProgress = this.calculateProgress(
                this.readingGuide.currentIndex,
                this.readingGuide.sentences.length
            );
            this.updateProgressBar();
        }
    }

    /**
     * 현재 진행도를 퍼센트로 계산
     * @param {number} currentIndex - 현재 문장 인덱스
     * @param {number} totalSentences - 전체 문장 수
     * @returns {number} 진행도 (0~100, 소수점 첫째 자리)
     */
    calculateProgress(currentIndex, totalSentences) {
        if (totalSentences === 0) return 0;
        return Math.round((currentIndex / totalSentences) * 1000) / 10;
    }

    /**
     * 마일스톤 달성 여부 확인
     * @param {number} progress - 현재 진행도 (%)
     * @returns {number|null} 달성한 마일스톤 또는 null
     */
    checkMilestone(progress) {
        // 가장 가까운 마일스톤을 찾기 위해 역순으로 탐색
        const milestone = this.milestones
            .slice()
            .reverse()
            .find(m => progress >= m && !this.achievedMilestones.has(m));

        if (milestone) {
            this.achievedMilestones.add(milestone);
            this.saveState();
            return milestone;
        }
        return null;
    }

    /**
     * ReadingGuide 인덱스 변경 이벤트 핸들러
     * @param {number} currentIndex - 현재 문장 인덱스
     * @param {number} totalSentences - 전체 문장 수
     */
    onIndexChange(currentIndex, totalSentences) {
        this.currentProgress = this.calculateProgress(currentIndex, totalSentences);
        const milestone = this.checkMilestone(this.currentProgress);

        if (milestone) {
            this.triggerMilestoneEvent(milestone);
        }

        this.updateProgressBar();
    }

    /**
     * 마일스톤 달성 이벤트 트리거
     * @param {number} milestone - 달성한 마일스톤
     */
    triggerMilestoneEvent(milestone) {
        // window와 document 양쪽에 이벤트 트리거 (호환성)
        const event = new CustomEvent('milestone-achieved', {
            detail: { milestone, progress: this.currentProgress }
        });
        window.dispatchEvent(event);
        document.dispatchEvent(event);
    }

    /**
     * 진행 바 UI 업데이트
     */
    updateProgressBar() {
        // DOM 요소 가져오기
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressFill && progressText) {
            // 진행 바 너비 업데이트
            progressFill.style.width = `${this.currentProgress}%`;

            // 퍼센트 텍스트 업데이트
            progressText.textContent = `${this.currentProgress.toFixed(1)}%`;
        }

        // 이벤트 발생 (다른 컴포넌트가 사용할 수 있도록)
        const event = new CustomEvent('progress-updated', {
            detail: { progress: this.currentProgress }
        });
        window.dispatchEvent(event);
    }

    /**
     * LocalStorage에서 상태 로드
     *
     * 실패 시 빈 Set으로 초기화하여 안전성 보장
     */
    loadState() {
        const saved = localStorage.getItem(ProgressTracker.STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.achievedMilestones = new Set(data.achievedMilestones || []);
            } catch (e) {
                // 파싱 실패 시 초기화
                console.warn('Failed to load progress state:', e);
                this.achievedMilestones = new Set();
            }
        }
    }

    /**
     * LocalStorage에 상태 저장
     *
     * 데이터 구조:
     * - achievedMilestones: 달성한 마일스톤 배열
     * - currentProgress: 현재 진행도 (%)
     * - lastUpdated: 마지막 업데이트 타임스탬프
     */
    saveState() {
        const data = {
            achievedMilestones: Array.from(this.achievedMilestones),
            currentProgress: this.currentProgress,
            lastUpdated: Date.now()
        };
        try {
            localStorage.setItem(ProgressTracker.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            // 저장 실패 시 경고 (10KB 초과 등)
            console.error('Failed to save progress state:', e);
        }
    }
}
