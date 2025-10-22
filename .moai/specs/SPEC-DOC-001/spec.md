---
id: DOC-001
version: 0.0.1
status: draft
created: 2025-10-22
updated: 2025-10-22
author: @seungwoolee
priority: high
category: docs
labels:
  - documentation
  - readme
  - 3-focus-reading
  - user-guide
scope:
  packages:
    - docs
  files:
    - README.md
    - docs/features/3-focus-reading.md
---

# @SPEC:DOC-001: README 재작성 (3문장 집중 읽기 중심)

## HISTORY

### v0.0.1 (2025-10-22)
- **INITIAL**: README.md를 3문장 집중 읽기 기능 중심으로 재작성
- **AUTHOR**: @seungwoolee
- **SCOPE**: 프로젝트 핵심 가치를 명확히 전달하는 문서 구조 재설계
- **CONTEXT**: 기존 README가 범용적 설명 중심이라 3문장 슬라이딩 윈도우 기능의 차별성이 부각되지 않음

---

## Environment (환경)

### 시스템 환경
- **플랫폼**: Markdown 문서 (GitHub, GitLab, 로컬 편집기)
- **대상 독자**: 개발자, 사용자, 기여자
- **문서 위치**: 프로젝트 루트 디렉토리 (README.md)

### 전제 조건
- README.md 파일이 존재함
- Git 저장소에 문서가 추적됨
- Markdown 렌더링 환경 (GitHub, VS Code 등)

---

## Assumptions (가정)

### 기술적 가정
1. 독자가 Markdown 문법을 이해함
2. GitHub에서 렌더링 시 이미지/GIF가 정상 표시됨
3. 목차(TOC) 자동 생성 지원 환경

### 비즈니스 가정
1. 사용자가 README를 통해 프로젝트를 처음 접함
2. 핵심 기능을 먼저 보여줄수록 사용자 흥미도가 높아짐
3. 간결하고 직관적인 설명이 프로젝트 이해도를 높임

### 사용자 가정
1. 사용자가 "3문장 집중 읽기"의 개념을 처음 접함
2. 사용자가 시각적 예시(스크린샷, GIF)를 선호함
3. 사용자가 빠른 시작 가이드를 원함

---

## Requirements (요구사항)

### Ubiquitous Requirements (기본 요구사항)

1. README는 프로젝트 핵심 기능을 명확히 설명해야 한다
2. README는 3문장 집중 읽기 기능을 최우선으로 강조해야 한다
3. README는 사용자가 5분 이내에 프로젝트를 이해할 수 있어야 한다
4. README는 설치 및 사용 방법을 단계별로 제공해야 한다

### Event-driven Requirements (이벤트 기반)

1. **WHEN** 사용자가 README를 열면, 첫 화면에 "3문장 집중 읽기" 설명이 보여야 한다
2. **WHEN** 사용자가 스크롤하면, 핵심 기능 3가지가 시각적으로 제시되어야 한다
3. **WHEN** 사용자가 "빠른 시작" 섹션을 클릭하면, 3단계 이내의 가이드가 보여야 한다
4. **WHEN** 사용자가 데모를 확인하면, GIF 또는 라이브 데모 링크가 제공되어야 한다

### State-driven Requirements (상태 기반)

1. **WHILE** 프로젝트가 개발 중일 때, README는 최신 기능을 반영해야 한다
2. **WHILE** 새 기능이 추가될 때, README의 "주요 기능" 섹션이 업데이트되어야 한다

### Optional Features (선택적 기능)

1. **WHERE** 시각적 설명이 필요하면, 스크린샷 또는 GIF를 추가할 수 있다
2. **WHERE** 상세 설명이 필요하면, `docs/` 디렉토리로 링크할 수 있다
3. **WHERE** 다국어 지원이 필요하면, 영문/한글 README를 분리할 수 있다

### Constraints (제약사항)

1. **IF** 이미지를 추가하면, 파일 크기는 500KB 이하여야 한다
2. **IF** 외부 링크를 사용하면, HTTPS 프로토콜을 사용해야 한다
3. README 길이는 스크롤 3회 이내 (약 500줄 이하)여야 한다
4. 모든 코드 예시는 실제 동작하는 코드여야 한다

---

## Core Features (핵심 기능)

### 1. 프로젝트 소개 섹션 재작성

**현재 문제**:
- 범용적 설명 ("텍스트 가독성 개선 도구")
- 핵심 차별점이 명확하지 않음

**개선 후 구조**:
```markdown
# 3-focus-reading

> **3문장 슬라이딩 윈도우 기반 집중 읽기 도구**
>
> 현재 읽는 3문장만 노란색 하이라이트로 강조하여 집중도를 높입니다.

![3-focus-reading Demo](docs/assets/demo.gif)

## ✨ 핵심 기능

1. **3문장 슬라이딩 윈도우** - 이전 1문장, 현재 1문장, 다음 1문장만 하이라이트
2. **좌우 화살표 탐색** - ← → 키로 문장 간 이동
3. **포커스 모드** - F키로 현재 문장 외 텍스트 블러 처리
```

### 2. 주요 기능 시각화

**변경 전**:
- 텍스트 중심 설명
- 기능 나열식 구성

**변경 후**:
```markdown
## 📖 3문장 집중 읽기란?

일반적인 텍스트 뷰어:
━━━━━━━━━━━━━━━━━━━━━━
모든 텍스트가 동일한 스타일
집중할 곳을 찾기 어려움
━━━━━━━━━━━━━━━━━━━━━━

3-focus-reading:
━━━━━━━━━━━━━━━━━━━━━━
[흐림] 이전 문장
[노란색 하이라이트] 지금 읽을 문장 ⬅️
[보통] 다음 문장
[흐림] 이후 텍스트
━━━━━━━━━━━━━━━━━━━━━━
```

**기능별 설명**:
1. **슬라이딩 윈도우**
   - 이전 문장: 회색 (opacity: 0.5)
   - 현재 문장: 노란색 배경 (background: #ffeb3b)
   - 다음 문장: 보통 (opacity: 1.0)
   - 이후 텍스트: 흐림 (opacity: 0.3)

2. **좌우 화살표 탐색**
   - ← 키: 이전 문장으로 이동
   - → 키: 다음 문장으로 이동
   - 자동 스크롤: 현재 문장이 화면 중앙에 위치

3. **포커스 모드**
   - F 키: 포커스 모드 토글
   - 현재 문장만 선명, 나머지 블러 처리
   - 집중도 극대화

### 3. 빠른 시작 가이드

**3단계 이내 사용법**:
```markdown
## 🚀 빠른 시작

### 1. 파일 열기
index.html을 브라우저에서 엽니다.

### 2. 텍스트 입력
왼쪽 입력창에 텍스트를 붙여넣거나 입력합니다.

### 3. 읽기 시작
- 오른쪽 출력창에서 자동으로 3문장 하이라이트 시작
- ← → 키로 문장 탐색
- F 키로 포커스 모드 활성화
```

### 4. 데모 및 스크린샷

**추가 자료**:
```markdown
## 📸 데모

![슬라이딩 윈도우](docs/assets/sliding-window.gif)
*3문장 슬라이딩 윈도우 동작*

![포커스 모드](docs/assets/focus-mode.png)
*포커스 모드 활성화 시*

> **라이브 데모**: [https://your-demo-url.com](https://your-demo-url.com)
```

### 5. 사용 사례 추가

**대상 사용자별 시나리오**:
```markdown
## 💡 이런 분들께 추천합니다

- **집중력 향상**: ADHD, 읽기 집중 어려움
- **외국어 학습**: 문장 단위 정독 학습
- **속독 연습**: 3문장 단위 읽기 리듬 훈련
- **프로그래밍 문서**: 코드 주석, 기술 문서 읽기
```

---

## Document Structure (문서 구조)

### README.md 구조

```markdown
# 3-focus-reading
> 한 줄 소개

[데모 GIF]

## ✨ 핵심 기능
- 3문장 슬라이딩 윈도우
- 좌우 화살표 탐색
- 포커스 모드

## 📖 3문장 집중 읽기란?
[시각적 비교]

## 🚀 빠른 시작
1. 파일 열기
2. 텍스트 입력
3. 읽기 시작

## 📸 데모
[스크린샷/GIF]

## 💡 이런 분들께 추천합니다
[사용 사례]

## 🔧 기능 상세
- 슬라이딩 윈도우
- 키보드 단축키
- 포커스 모드

## 📂 프로젝트 구조
[디렉토리 트리]

## 🤝 기여 가이드
[기여 방법]

## 📄 라이선스
[라이선스 정보]
```

### docs/features/3-focus-reading.md 구조

```markdown
# 3문장 집중 읽기 상세 가이드

## 개요
[기능 설명]

## 작동 원리
[기술 상세]

## 키보드 단축키
[단축키 목록]

## 설정
[커스터마이징 옵션]

## FAQ
[자주 묻는 질문]
```

---

## Technical Specifications (기술 명세)

### Markdown 작성 규칙

1. **제목 계층**: H1(1개) → H2(섹션) → H3(하위 섹션)
2. **이미지 경로**: `docs/assets/` 디렉토리 사용
3. **코드 블록**: 언어 지정 (```javascript, ```bash)
4. **링크**: 상대 경로 우선, 외부 링크는 HTTPS

### 이미지 최적화

- **포맷**: PNG (스크린샷), GIF (애니메이션)
- **크기**: 최대 500KB (TinyPNG로 압축)
- **해상도**: 1280x720 (16:9 비율)

### 접근성

- **대체 텍스트**: 모든 이미지에 `alt` 속성
- **링크 텍스트**: "여기 클릭" 금지, 명확한 설명 사용
- **제목 구조**: 논리적 계층 유지

---

## Testing Strategy (테스트 전략)

### 수동 검증

- [ ] README.md를 GitHub에서 렌더링 확인
- [ ] 모든 이미지가 정상 로드되는지 확인
- [ ] 링크가 올바른 페이지로 이동하는지 확인
- [ ] 코드 예시가 복사 가능한지 확인

### 자동 검증

```bash
# Markdown 린트 검사
markdownlint README.md

# 링크 유효성 검사
markdown-link-check README.md

# 이미지 존재 확인
rg "!\[.*\]\((.*)\)" README.md -o -r '$1' | xargs -I {} test -f {}
```

### 사용자 테스트

1. **5분 읽기 테스트**: 신규 사용자가 5분 내에 프로젝트 이해 가능
2. **빠른 시작 테스트**: 가이드만으로 프로젝트 실행 가능
3. **시각 자료 효과**: 이미지/GIF가 이해도 향상에 도움

---

## Traceability (@TAG)

### TAG 체인

- **SPEC**: `@SPEC:DOC-001`
- **TEST**: `tests/docs/readme-validation.test.js`
- **CODE**:
  - `README.md` - 프로젝트 메인 문서
  - `docs/features/3-focus-reading.md` - 상세 가이드
- **DOC**: `docs/writing-guide.md` (문서 작성 가이드)

### 관련 파일

```
reading tablet/
├── README.md                      # @CODE:DOC-001
├── docs/
│   ├── assets/
│   │   ├── demo.gif
│   │   ├── sliding-window.gif
│   │   └── focus-mode.png
│   ├── features/
│   │   └── 3-focus-reading.md    # @CODE:DOC-001
│   └── writing-guide.md
├── .moai/
│   └── specs/
│       └── SPEC-DOC-001/
│           └── spec.md           # @SPEC:DOC-001 (현재 문서)
└── tests/
    └── docs/
        └── readme-validation.test.js  # @TEST:DOC-001
```

---

## Dependencies (의존성)

### 내부 의존성
- **SPEC-BRAND-001**: 브랜드명이 확정되어야 README 작성 가능
- **SPEC-GUIDE-001**: 3문장 슬라이딩 윈도우 기능이 구현되어 있어야 함

### 외부 의존성
- **이미지 생성 도구**: ScreenToGif, ShareX 등
- **Markdown 린터**: markdownlint

---

## Content Guidelines (콘텐츠 가이드)

### 톤앤매너

- **어조**: 친근하고 직관적
- **문체**: 간결하고 명확 (전문 용어 최소화)
- **구조**: 시각 자료 → 설명 → 예시 순서

### 금지 사항

- ❌ 과도한 마케팅 용어 ("혁명적", "최고의")
- ❌ 불필요한 기술 용어 나열
- ❌ 장황한 설명 (한 문단 5줄 이하)

### 권장 사항

- ✅ 시각 자료 우선 (1 이미지 = 1000 단어)
- ✅ 예시 중심 설명
- ✅ 사용자 관점 서술

---

## Migration Plan (마이그레이션 계획)

### 1단계: 기존 README 백업
```bash
cp README.md README.backup.md
```

### 2단계: 새 README 작성
- 프로젝트 소개 (3문장 집중 읽기 중심)
- 핵심 기능 3가지
- 빠른 시작 가이드
- 데모 자료

### 3단계: 이미지 준비
```bash
mkdir -p docs/assets
# 스크린샷/GIF 생성 및 저장
```

### 4단계: 검증
```bash
markdownlint README.md
markdown-link-check README.md
```

### 5단계: 커밋
```bash
git add README.md docs/
git commit -m "📝 DOCS: README 재작성 (3문장 집중 읽기 중심)

@TAG:DOC-001-DOCS"
```

---

## References (참고 자료)

### 우수 README 사례
1. React README - 명확한 구조, 빠른 시작 가이드
2. Vue.js README - 시각 자료 활용
3. TailwindCSS README - 사용 사례 중심

### 작성 가이드
1. "Art of README" - Noffle
2. GitHub README Best Practices
3. Awesome README Templates

---

## Glossary (용어집)

| 용어 | 정의 |
|-----|------|
| **3문장 슬라이딩 윈도우** | 현재 읽는 3문장만 하이라이트하며 이동하는 기능 |
| **포커스 모드** | 현재 문장만 선명하게, 나머지는 블러 처리하는 모드 |
| **좌우 화살표 탐색** | ← → 키로 문장 간 이동하는 기능 |

---

## Approval (승인)

### 작성자
- **이름**: @seungwoolee
- **날짜**: 2025-10-22
- **버전**: v0.0.1

### 검토자
- **이름**: [TBD]
- **날짜**: [TBD]
- **상태**: Draft

---

**다음 단계**: `/alfred:2-build DOC-001`로 TDD 구현 시작
