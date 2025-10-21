/**
 * 텍스트 포매터 - 가독성 개선을 위한 스마트 포맷팅
 */

class TextFormatter {
    constructor() {
        // 타임스탬프 패턴: (00:00), (00:51), (01:22) 등
        this.timestampPattern = /\((\d{1,2}:\d{2})\)/g;

        // 한국어 문장 종결 패턴
        this.sentenceEndPattern = /([.!?])\s+/g;

        // 연속된 공백 제거
        this.multipleSpacePattern = /\s{2,}/g;
    }

    /**
     * 메인 포맷팅 함수
     * @param {string} text - 원본 텍스트
     * @returns {string} - 포맷팅된 텍스트
     */
    format(text) {
        if (!text || text.trim().length === 0) {
            return '';
        }

        let formatted = text;

        // 1. 타임스탬프 기준으로 단락 분리
        formatted = this.formatTimestamps(formatted);

        // 2. 문장 간격 조정
        formatted = this.formatSentences(formatted);

        // 3. 연속된 공백 정리
        formatted = this.cleanWhitespace(formatted);

        // 4. 단락 구분 개선
        formatted = this.improveParagraphs(formatted);

        return formatted.trim();
    }

    /**
     * 타임스탬프를 기준으로 단락 분리
     */
    formatTimestamps(text) {
        // 타임스탬프 앞에 두 줄 띄우기 (첫 번째 제외)
        let isFirst = true;
        return text.replace(this.timestampPattern, (match) => {
            if (isFirst) {
                isFirst = false;
                return match;
            }
            return '\n\n' + match;
        });
    }

    /**
     * 문장 종결 후 적절한 간격 추가
     */
    formatSentences(text) {
        // 문장 끝 후 공백이 있으면 적절한 간격 유지
        return text.replace(this.sentenceEndPattern, '$1 ');
    }

    /**
     * 연속된 공백 정리
     */
    cleanWhitespace(text) {
        // 여러 개의 공백을 하나로
        return text.replace(this.multipleSpacePattern, ' ');
    }

    /**
     * 단락 구분 개선
     */
    improveParagraphs(text) {
        // 너무 긴 단락을 적절히 분리
        const lines = text.split('\n');
        const improved = [];

        for (let line of lines) {
            line = line.trim();
            if (line.length === 0) continue;

            // 타임스탬프가 있는 라인은 그대로 유지
            if (this.timestampPattern.test(line)) {
                improved.push(line);
                continue;
            }

            // 긴 문장들을 문장 단위로 분리 (선택적)
            const sentences = this.splitSentences(line);

            // 3문장 이상이면 중간에 빈 줄 추가
            if (sentences.length >= 3) {
                const mid = Math.floor(sentences.length / 2);
                sentences.splice(mid, 0, '');
            }

            improved.push(sentences.join(' '));
        }

        return improved.join('\n\n');
    }

    /**
     * 문장 단위로 분리
     */
    splitSentences(text) {
        const sentences = [];
        let current = '';

        for (let i = 0; i < text.length; i++) {
            current += text[i];

            // 문장 종결 문자 확인
            if (/[.!?]/.test(text[i])) {
                // 다음 문자가 공백이거나 끝이면 문장 완료
                if (i === text.length - 1 || /\s/.test(text[i + 1])) {
                    sentences.push(current.trim());
                    current = '';
                }
            }
        }

        // 남은 텍스트 추가
        if (current.trim()) {
            sentences.push(current.trim());
        }

        return sentences;
    }

    /**
     * HTML로 변환 (출력용)
     */
    toHTML(text) {
        if (!text) return '';

        const paragraphs = text.split('\n\n');
        let html = '';

        for (let para of paragraphs) {
            if (!para.trim()) continue;

            // 타임스탬프 하이라이트
            const highlighted = para.replace(
                this.timestampPattern,
                '<span class="timestamp">$&</span>'
            );

            html += `<p>${highlighted}</p>`;
        }

        return html;
    }

    /**
     * 통계 정보 계산
     */
    getStats(text) {
        const chars = text.length;
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n\n/).filter(p => p.trim().length > 0).length;

        return { chars, words, sentences, paragraphs };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextFormatter;
}
