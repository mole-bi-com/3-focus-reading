/**
 * 3-focus-reading - 메인 애플리케이션
 */

import ReadingGuide from './reading-guide.js';

class ReadingTabletApp {
    constructor() {
        this.formatter = new TextFormatter();
        this.readingGuide = new ReadingGuide();
        this.currentTheme = 'light';
        this.autoSaveKey = 'reading-tablet-autosave';

        this.initElements();
        this.initEventListeners();
        this.loadAutoSave();
        this.loadTheme();
    }

    initElements() {
        // Input/Output
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.inputCount = document.getElementById('inputCount');
        this.outputCount = document.getElementById('outputCount');

        // Buttons
        this.formatBtn = document.getElementById('formatBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.fileInput = document.getElementById('fileInput');
        this.themeToggle = document.getElementById('themeToggle');
        this.fontSize = document.getElementById('fontSize');
        this.guideToggle = document.getElementById('guideToggle');
    }

    initEventListeners() {
        // Format button
        this.formatBtn.addEventListener('click', () => this.formatText());

        // Clear button
        this.clearBtn.addEventListener('click', () => this.clearAll());

        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadText());

        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Font size
        this.fontSize.addEventListener('change', (e) => this.changeFontSize(e.target.value));

        // Guide toggle
        this.guideToggle.addEventListener('click', () => this.toggleGuide());

        // Input change - auto save
        this.inputText.addEventListener('input', () => {
            this.updateCharCount();
            this.autoSave();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Format
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.formatText();
            }

            // Ctrl/Cmd + D: Download
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.downloadText();
            }
        });
    }

    formatText() {
        const inputValue = this.inputText.value;

        if (!inputValue.trim()) {
            this.showMessage('포맷팅할 텍스트를 입력해주세요', 'warning');
            return;
        }

        // 포맷팅 실행
        const formatted = this.formatter.format(inputValue);
        const html = this.formatter.toHTML(formatted);

        // 결과 출력
        this.outputText.innerHTML = html;

        // 통계 업데이트
        this.updateOutputCount(formatted);

        // 성공 메시지
        const stats = this.formatter.getStats(formatted);
        this.showMessage(
            `포맷팅 완료: ${stats.paragraphs}개 단락, ${stats.sentences}개 문장`,
            'success'
        );

        // 출력 영역으로 스크롤
        this.outputText.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    clearAll() {
        if (this.inputText.value.trim() && !confirm('모든 내용을 지우시겠습니까?')) {
            return;
        }

        this.inputText.value = '';
        this.outputText.innerHTML = '<div class="placeholder">포맷팅 버튼을 눌러 결과를 확인하세요</div>';
        this.updateCharCount();
        this.updateOutputCount('');
        localStorage.removeItem(this.autoSaveKey);
        this.showMessage('모든 내용이 지워졌습니다', 'info');
    }

    async copyToClipboard() {
        const text = this.outputText.innerText;

        if (!text || text.includes('포맷팅 버튼을 눌러')) {
            this.showMessage('복사할 내용이 없습니다', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showMessage('클립보드에 복사되었습니다', 'success');
        } catch (err) {
            this.showMessage('복사 실패: ' + err.message, 'error');
        }
    }

    downloadText() {
        const text = this.outputText.innerText;

        if (!text || text.includes('포맷팅 버튼을 눌러')) {
            this.showMessage('다운로드할 내용이 없습니다', 'warning');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `formatted-text-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('파일이 다운로드되었습니다', 'success');
    }

    handleFileUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            this.inputText.value = e.target.result;
            this.updateCharCount();
            this.autoSave();
            this.showMessage(`파일 "${file.name}"을 불러왔습니다`, 'success');
        };

        reader.onerror = () => {
            this.showMessage('파일 읽기 실패', 'error');
        };

        reader.readAsText(file, 'UTF-8');
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', this.currentTheme);
        this.themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('reading-tablet-theme', this.currentTheme);
    }

    changeFontSize(size) {
        document.body.setAttribute('data-font-size', size);
        localStorage.setItem('reading-tablet-font-size', size);
    }

    toggleGuide() {
        if (!this.readingGuide.isActive) {
            try {
                this.readingGuide.start();
                this.guideToggle.textContent = '📖 가이드 종료';
                this.guideToggle.classList.add('active');
                this.showMessage('가이드 모드 시작 (← → 키로 문장 이동, F: 포커스 모드, ESC: 종료)', 'success');
            } catch (error) {
                console.error('가이드 모드 시작 실패:', error);
                this.showMessage(error.message, 'error');
            }
        } else {
            this.readingGuide.stop();
            this.guideToggle.textContent = '📖 가이드 모드';
            this.guideToggle.classList.remove('active');
            this.showMessage('가이드 모드 종료', 'info');
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('reading-tablet-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.body.setAttribute('data-theme', this.currentTheme);
            this.themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }

        const savedFontSize = localStorage.getItem('reading-tablet-font-size');
        if (savedFontSize) {
            this.fontSize.value = savedFontSize;
            document.body.setAttribute('data-font-size', savedFontSize);
        }
    }

    autoSave() {
        localStorage.setItem(this.autoSaveKey, this.inputText.value);
    }

    loadAutoSave() {
        const saved = localStorage.getItem(this.autoSaveKey);
        if (saved) {
            this.inputText.value = saved;
            this.updateCharCount();
        }
    }

    updateCharCount() {
        const count = this.inputText.value.length;
        this.inputCount.textContent = `${count.toLocaleString()}자`;
    }

    updateOutputCount(text) {
        const count = text.length;
        this.outputCount.textContent = `${count.toLocaleString()}자`;
    }

    showMessage(message, type = 'info') {
        // 간단한 토스트 메시지
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 애니메이션
        setTimeout(() => toast.classList.add('show'), 10);

        // 3초 후 제거
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ReadingTabletApp();
});
