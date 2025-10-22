/**
 * @TEST:GUIDE-001 | SPEC: .moai/specs/SPEC-GUIDE-001/spec.md
 *
 * 노래방 스타일 읽기 가이드 모드 테스트
 *
 * 테스트 시나리오:
 * 1. ReadingGuide 클래스 초기화
 * 2. WPM 범위 검증 (50~500, 기본값 200)
 * 3. 단락 상태 전환 (past → current → future)
 * 4. LocalStorage 저장/로드
 * 5. 키보드 이벤트 핸들러
 * 6. 가이드 모드 활성화 → 첫 단락 하이라이트
 * 7. 자동 진행 → WPM에 따라 단락 이동
 * 8. 포커스 모드 → 블러 효과 적용
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// DOM 설정 헬퍼
const setupDOM = () => {
  document.body.innerHTML = `
    <div id="outputText">
      <p>첫 번째 단락입니다.</p>
      <p>두 번째 단락입니다.</p>
      <p>세 번째 단락입니다.</p>
    </div>
    <div class="guide-controls">
      <button id="guideToggle">가이드 시작</button>
      <button id="guidePrev">이전</button>
      <button id="guideNext">다음</button>
      <button id="guideFocus">포커스</button>
      <input type="range" id="guideWpm" min="50" max="500" value="200">
      <span id="guideWpmValue">200</span>
    </div>
  `;
};

// ReadingGuide 클래스를 동적으로 로드
const loadReadingGuide = async () => {
  // ES6 모듈 동적 임포트 (상대 경로)
  const module = await import('../../js/reading-guide.js');
  return module.default || module;
};

describe('ReadingGuide - 초기화', () => {
  let ReadingGuide;

  beforeEach(async () => {
    setupDOM();
    ReadingGuide = await loadReadingGuide();
  });

  it('ReadingGuide 클래스를 생성할 수 있어야 한다', () => {
    const guide = new ReadingGuide();
    expect(guide).toBeDefined();
    expect(guide).toBeInstanceOf(ReadingGuide);
  });

  it('기본 WPM은 200이어야 한다', () => {
    const guide = new ReadingGuide();
    expect(guide.wpm).toBe(200);
  });

  it('WPM 범위는 50~500 사이여야 한다', () => {
    const guide = new ReadingGuide();

    // 최소값 미만 거부
    expect(() => guide.setWpm(49)).toThrow();

    // 최대값 초과 거부
    expect(() => guide.setWpm(501)).toThrow();

    // 정상 범위 허용
    expect(() => guide.setWpm(200)).not.toThrow();
    expect(guide.wpm).toBe(200);
  });
});

describe('ReadingGuide - 단락 하이라이트', () => {
  let ReadingGuide;

  beforeEach(async () => {
    setupDOM();
    ReadingGuide = await loadReadingGuide();
  });

  it('가이드 활성화 시 첫 번째 단락이 하이라이트되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    const firstPara = document.querySelector('#outputText p');
    expect(firstPara.classList.contains('read-current')).toBe(true);
  });

  it('다음 단락으로 이동 시 상태가 업데이트되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    guide.next();
    const paras = document.querySelectorAll('#outputText p');
    expect(paras[0].classList.contains('read-past')).toBe(true);
    expect(paras[1].classList.contains('read-current')).toBe(true);
  });

  it('이전 단락으로 이동 시 상태가 업데이트되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    guide.next();
    guide.prev();
    const firstPara = document.querySelector('#outputText p');
    expect(firstPara.classList.contains('read-current')).toBe(true);
  });
});

describe('ReadingGuide - 자동 진행', () => {
  let ReadingGuide;

  beforeEach(async () => {
    setupDOM();
    ReadingGuide = await loadReadingGuide();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('자동 진행 활성화 시 WPM에 따라 단락이 자동으로 이동해야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    guide.enableAutoProgress();

    // WPM 200 기준: "첫 번째 단락입니다." = 3단어
    // (3 / 200) * 60 * 1000 = 900ms
    // 1000ms 진행하면 다음 단락으로 이동
    vi.advanceTimersByTime(1000);

    const paras = document.querySelectorAll('#outputText p');
    expect(paras[1].classList.contains('read-current')).toBe(true);
  });

  it('자동 진행 비활성화 시 타이머가 중지되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    guide.enableAutoProgress();
    guide.disableAutoProgress();

    vi.advanceTimersByTime(10000);

    const firstPara = document.querySelector('#outputText p');
    expect(firstPara.classList.contains('read-current')).toBe(true);
  });
});

describe('ReadingGuide - 포커스 모드', () => {
  let ReadingGuide;

  beforeEach(async () => {
    setupDOM();
    ReadingGuide = await loadReadingGuide();
  });

  it('포커스 모드 활성화 시 현재 단락 외 블러 처리되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    guide.enableFocusMode();

    const outputText = document.getElementById('outputText');
    expect(outputText.classList.contains('guide-focus')).toBe(true);
  });

  it('포커스 모드 비활성화 시 블러 효과가 제거되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    guide.enableFocusMode();
    guide.disableFocusMode();

    const outputText = document.getElementById('outputText');
    expect(outputText.classList.contains('guide-focus')).toBe(false);
  });
});

describe('ReadingGuide - LocalStorage', () => {
  let ReadingGuide;

  beforeEach(async () => {
    setupDOM();
    localStorage.clear();
    ReadingGuide = await loadReadingGuide();
  });

  it('WPM 설정이 LocalStorage에 저장되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.setWpm(300);

    const saved = localStorage.getItem('reading-guide-wpm');
    expect(saved).toBe('300');
  });

  it('현재 단락 위치가 LocalStorage에 저장되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();
    guide.next();
    guide.next();

    const saved = localStorage.getItem('reading-guide-position');
    expect(saved).toBe('2');
  });

  it('페이지 새로고침 시 이전 상태가 복원되어야 한다', () => {
    localStorage.setItem('reading-guide-wpm', '250');
    localStorage.setItem('reading-guide-position', '1');

    const guide = new ReadingGuide();
    guide.loadState();

    expect(guide.wpm).toBe(250);
    expect(guide.currentIndex).toBe(1);
  });
});

describe('ReadingGuide - 키보드 이벤트', () => {
  let ReadingGuide;

  beforeEach(async () => {
    setupDOM();
    ReadingGuide = await loadReadingGuide();
  });

  it('스페이스바 입력 시 자동 진행이 토글되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();

    const event = new KeyboardEvent('keydown', { key: ' ' });
    document.dispatchEvent(event);

    expect(guide.isAutoProgress).toBe(true);
  });

  it('화살표 키로 단락 이동이 가능해야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();

    // 오른쪽 화살표 → 다음 단락
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    document.dispatchEvent(rightEvent);

    const paras = document.querySelectorAll('#outputText p');
    expect(paras[1].classList.contains('read-current')).toBe(true);
  });

  it('Escape 키 입력 시 가이드 모드가 종료되어야 한다', () => {
    const guide = new ReadingGuide();
    guide.start();

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escEvent);

    expect(guide.isActive).toBe(false);
  });
});
