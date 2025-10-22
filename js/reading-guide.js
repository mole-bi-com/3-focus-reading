/**
 * @CODE:GUIDE-001 | SPEC: .moai/specs/SPEC-GUIDE-001/spec.md | TEST: tests/guide/reading-guide.test.js
 *
 * ReadingGuide - 노래방 스타일 읽기 가이드 모드 (문장 단위)
 *
 * 기능:
 * - 문장별 하이라이트 (past → current → future)
 * - 좌우 화살표로 문장 이동
 * - 포커스 모드 (현재 문장만 강조, 나머지 블러)
 * - LocalStorage 저장/로드
 *
 * @class ReadingGuide
 */

class ReadingGuide {
    constructor(options = {}) {
        this.wpm = options.wpm || 200;
        this.currentIndex = 0;
        this.sentences = [];
        this.isActive = false;
        this.isFocusMode = false;
        this.debug = options.debug || false;

        this.outputContainer = null;
        this.keydownHandler = null;
    }

    /**
     * 디버그 로그 출력
     */
    _log(...args) {
        if (this.debug) {
            console.log('[ReadingGuide]', ...args);
        }
    }

    /**
     * WPM 설정 (50~500 범위)
     */
    setWpm(value) {
        if (value < 50 || value > 500) {
            throw new Error('WPM must be between 50 and 500');
        }
        this.wpm = value;
        this.saveState();
    }

    /**
     * 가이드 모드 시작 - 문장 단위로 분리
     */
    start() {
        this._log('start() 메서드 시작');
        this.outputContainer = document.getElementById('outputText');
        this._log('outputContainer:', this.outputContainer);

        if (!this.outputContainer) {
            throw new Error('출력 영역을 찾을 수 없습니다');
        }

        const paragraphs = Array.from(this.outputContainer.querySelectorAll('p'));
        this._log('paragraphs 개수:', paragraphs.length);

        if (paragraphs.length === 0) {
            throw new Error('포맷팅된 텍스트가 없습니다. 먼저 "✨ 포맷팅" 버튼을 눌러주세요.');
        }

        // 모든 단락을 문장 단위로 분리
        this.sentences = [];
        this._log('문장 분리 시작');

        paragraphs.forEach((p, pIndex) => {
            const text = p.textContent;
            this._log(`단락 ${pIndex + 1} 텍스트 길이:`, text.length);

            // 문장 분리 (. ! ? 기준)
            const sentenceTexts = text.match(/[^.!?]+[.!?]+/g) || [text];
            this._log(`단락 ${pIndex + 1} 문장 개수:`, sentenceTexts.length);

            const spans = [];
            sentenceTexts.forEach((sentenceText, sIndex) => {
                sentenceText = sentenceText.trim();
                if (sentenceText) {
                    const span = document.createElement('span');
                    span.className = 'sentence';
                    span.textContent = sentenceText + ' ';
                    spans.push(span);
                    this.sentences.push(span);
                }
            });

            this._log(`단락 ${pIndex + 1} span 개수:`, spans.length);

            // 원본 단락을 span들로 대체
            p.innerHTML = '';
            spans.forEach(span => p.appendChild(span));
        });

        this._log('전체 문장 개수:', this.sentences.length);

        this.isActive = true;
        this.currentIndex = 0;
        this.updateSentenceStates();
        this.attachKeyboardEvents();

        this._log('start() 메서드 완료');
    }

    /**
     * 가이드 모드 종료
     */
    stop() {
        this.isActive = false;
        this.disableFocusMode();
        this.clearSentenceStates();
        this.detachKeyboardEvents();
    }

    /**
     * 다음 문장으로 이동
     */
    next() {
        if (this.currentIndex < this.sentences.length - 1) {
            this.currentIndex++;
            this.updateSentenceStates();
            this.scrollToCurrentSentence();
            this.saveState();
        }
    }

    /**
     * 이전 문장으로 이동
     */
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSentenceStates();
            this.scrollToCurrentSentence();
            this.saveState();
        }
    }

    /**
     * 문장 상태 업데이트 (현재 문장 ±1개만 표시, 총 3개)
     */
    updateSentenceStates() {
        this.sentences.forEach((sentence, index) => {
            sentence.classList.remove('read-past', 'read-current', 'read-future', 'hidden');

            // 현재 문장 기준 ±1 범위 계산
            const minIndex = this.currentIndex - 1;
            const maxIndex = this.currentIndex + 1;

            // 범위 밖 문장은 숨김
            if (index < minIndex || index > maxIndex) {
                sentence.classList.add('hidden');
            } else if (index < this.currentIndex) {
                sentence.classList.add('read-past');
            } else if (index === this.currentIndex) {
                sentence.classList.add('read-current');
            } else {
                sentence.classList.add('read-future');
            }
        });

        // 포커스 모드가 활성화되어 있으면 업데이트
        if (this.isFocusMode) {
            this.updateFocusMode();
        }
    }

    /**
     * 현재 문장으로 스크롤
     */
    scrollToCurrentSentence() {
        if (this.sentences[this.currentIndex]) {
            this.sentences[this.currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    /**
     * 문장 상태 초기화
     */
    clearSentenceStates() {
        this.sentences.forEach(sentence => {
            sentence.classList.remove('read-past', 'read-current', 'read-future', 'focus-blurred');
        });
    }

    /**
     * 포커스 모드 활성화 - 현재 문장만 강조
     */
    enableFocusMode() {
        this.isFocusMode = true;
        this.updateFocusMode();
    }

    /**
     * 포커스 모드 비활성화
     */
    disableFocusMode() {
        this.isFocusMode = false;
        this.sentences.forEach(sentence => {
            sentence.classList.remove('focus-blurred');
        });
    }

    /**
     * 포커스 모드 상태 업데이트
     */
    updateFocusMode() {
        this.sentences.forEach((sentence, index) => {
            if (index === this.currentIndex) {
                sentence.classList.remove('focus-blurred');
            } else {
                sentence.classList.add('focus-blurred');
            }
        });
    }

    /**
     * 키보드 이벤트 핸들러 등록
     */
    attachKeyboardEvents() {
        this.keydownHandler = (e) => {
            // 입력 필드에서는 단축키 비활성화
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                return;
            }

            // 가이드가 활성화되어 있지 않으면 무시
            if (!this.isActive) {
                return;
            }

            this._log('Key pressed:', e.key, 'Current index:', this.currentIndex);

            switch(e.key) {
                case 'ArrowRight': // 다음 문장
                    e.preventDefault();
                    this._log('Moving to next sentence');
                    this.next();
                    break;
                case 'ArrowLeft': // 이전 문장
                    e.preventDefault();
                    this._log('Moving to previous sentence');
                    this.prev();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    if (this.isFocusMode) {
                        this.disableFocusMode();
                    } else {
                        this.enableFocusMode();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.stop();
                    break;
            }
        };

        document.addEventListener('keydown', this.keydownHandler);
        this._log('Keyboard events attached');
    }

    /**
     * 키보드 이벤트 핸들러 제거
     */
    detachKeyboardEvents() {
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
    }

    /**
     * 현재 상태를 LocalStorage에 저장
     */
    saveState() {
        const state = {
            wpm: this.wpm,
            currentIndex: this.currentIndex,
            isFocusMode: this.isFocusMode,
            timestamp: Date.now()
        };
        localStorage.setItem('reading-guide-state', JSON.stringify(state));
    }

    /**
     * LocalStorage에서 상태 로드
     */
    loadState() {
        try {
            const saved = localStorage.getItem('reading-guide-state');
            if (saved) {
                const state = JSON.parse(saved);
                this.wpm = state.wpm || 200;
                this.currentIndex = state.currentIndex || 0;
                this.isFocusMode = state.isFocusMode || false;
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }
}

// Export for ES6 modules
export default ReadingGuide;
