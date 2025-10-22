---
id: BRAND-001
version: 0.1.0
status: completed
created: 2025-10-22
updated: 2025-10-22
author: @seungwoolee
priority: medium
category: refactor
labels:
  - branding
  - naming
  - consistency
scope:
  packages:
    - root
  files:
    - package.json
    - index.html
    - README.md
    - .moai/project/product.md
    - .moai/project/structure.md
---

# @SPEC:BRAND-001: 브랜딩 리팩토링

## HISTORY

### v0.1.0 (2025-10-22)
- **IMPLEMENTATION COMPLETED**: TDD 구현 완료 (version: 0.0.1 → 0.1.0, status: draft → completed)
- **AUTHOR**: @seungwoolee
- **CHANGES**:
  - 브랜딩 일괄 변경: "Reading Tablet" → "3-focus-reading"
  - 변경 파일 8개: index.html, README.md, CLAUDE.md, js/app.js, css/style.css, .moai/project/{product,structure,tech}.md
  - 아이콘 변경: 📖 → 🎯 (집중 의미 강화)
  - 서브타이틀: "텍스트 가독성 개선" → "3문장 슬라이딩 윈도우 기반 집중 읽기"
- **TAG CHAIN**: @SPEC:BRAND-001 → @CODE:BRAND-001 (8개 파일)
- **VERIFICATION**: rg 검증 통과 (모든 "Reading Tablet" → "3-focus-reading" 변환 완료)

### v0.0.1 (2025-10-22)
- **INITIAL**: "Reading Tablet" → "3-focus-reading" 일괄 변경 명세 작성
- **AUTHOR**: @seungwoolee
- **SCOPE**: 프로젝트 전반의 브랜드명 일관성 확보
- **CONTEXT**: 3문장 집중 읽기 기능이 프로젝트의 핵심 정체성이므로, 이를 명확히 반영하는 이름으로 변경

---

## Environment (환경)

### 시스템 환경
- **플랫폼**: 웹 애플리케이션 (HTML5, CSS3, JavaScript ES6+)
- **프로젝트 구조**: Personal 모드, Git 버전 관리
- **디렉토리 구조**: `.moai/` 중심 MoAI-ADK 프로젝트

### 전제 조건
- Git 저장소가 초기화되어 있음
- package.json이 존재함
- .moai/project/ 디렉토리에 프로젝트 문서가 있음

---

## Assumptions (가정)

### 기술적 가정
1. 모든 파일이 UTF-8 인코딩을 사용함
2. Git 작업은 사용자가 수동으로 수행함 (Personal 모드)
3. 파일 수정 후 즉시 변경사항을 확인 가능함

### 비즈니스 가정
1. "3-focus-reading"이 프로젝트의 핵심 가치를 더 명확히 전달함
2. 기존 "Reading Tablet" 이름이 범용적이고 차별성이 부족함
3. 브랜드명 변경이 사용자 경험에 긍정적 영향을 줌

### 사용자 가정
1. 사용자가 "3문장 집중 읽기" 기능을 핵심으로 인식함
2. 브랜드명이 기능을 직관적으로 설명할수록 이해도가 높아짐

---

## Requirements (요구사항)

### Ubiquitous Requirements (기본 요구사항)

1. 시스템은 모든 문서에서 일관된 브랜드명을 사용해야 한다
2. 시스템은 변경 이력을 추적할 수 있어야 한다
3. 시스템은 HTML 메타데이터를 새 브랜드명으로 업데이트해야 한다

### Event-driven Requirements (이벤트 기반)

1. **WHEN** package.json을 읽으면, `name` 필드는 "3-focus-reading"이어야 한다
2. **WHEN** index.html을 열면, `<title>` 태그는 "3-focus-reading"을 포함해야 한다
3. **WHEN** README.md를 확인하면, 프로젝트명이 "3-focus-reading"이어야 한다
4. **WHEN** .moai/project/product.md를 읽으면, 프로젝트명이 "3-focus-reading"이어야 한다

### State-driven Requirements (상태 기반)

1. **WHILE** Git 추적 대상 파일일 때, 모든 변경사항은 커밋되어야 한다
2. **WHILE** 문서 작성 중일 때, 브랜드명은 일관되게 "3-focus-reading"을 사용해야 한다

### Optional Features (선택적 기능)

1. **WHERE** 영문 표기가 필요하면, "3-focus-reading" (소문자, 하이픈)을 사용할 수 있다
2. **WHERE** 한글 표기가 필요하면, "3문장 집중 읽기"를 사용할 수 있다
3. **WHERE** 간략한 표기가 필요하면, "3FR"을 사용할 수 있다

### Constraints (제약사항)

1. **IF** package.json의 `name` 필드가 변경되면, npm 패키지명 규칙을 준수해야 한다 (소문자, 하이픈, 숫자만 허용)
2. **IF** HTML 태그 내부라면, 특수문자를 이스케이프해야 한다
3. 모든 변경은 UTF-8 인코딩을 유지해야 한다
4. Git 커밋 메시지는 "브랜딩 리팩토링: Reading Tablet → 3-focus-reading" 형식을 따라야 한다

---

## Core Features (핵심 기능)

### 1. package.json 브랜드명 변경

**변경 대상**:
```json
{
  "name": "reading-tablet"  // 변경 전
}
```

**변경 후**:
```json
{
  "name": "3-focus-reading"  // 변경 후
}
```

**관련 필드**:
- `name`: "3-focus-reading"
- `description`: "3문장 슬라이딩 윈도우 기반 집중 읽기 도구"

### 2. index.html 메타데이터 변경

**변경 대상**:
```html
<title>Reading Tablet</title>
```

**변경 후**:
```html
<title>3-focus-reading</title>
```

**추가 변경 필드**:
- `<meta name="description">`: 3문장 집중 읽기 설명 추가
- `<meta property="og:title">`: 소셜 미디어 공유 시 표시될 제목

### 3. README.md 프로젝트명 변경

**변경 대상**:
- 제목 (# Reading Tablet)
- 소개 문구
- 사용 예시

**변경 후**:
```markdown
# 3-focus-reading

3문장 슬라이딩 윈도우 기반 집중 읽기 도구
```

### 4. .moai/project/ 문서 변경

**변경 대상**:
- `product.md`: 프로젝트명, 핵심 가치
- `structure.md`: 프로젝트 이름 참조 부분

**변경 후**:
- 모든 "Reading Tablet" → "3-focus-reading"
- 한글 표기: "3문장 집중 읽기"

---

## Technical Specifications (기술 명세)

### 변경 대상 파일 목록

```
reading tablet/
├── package.json           # name 필드
├── index.html             # <title>, <meta> 태그
├── README.md              # 프로젝트명, 설명
└── .moai/
    └── project/
        ├── product.md     # 프로젝트명, 가치 제안
        └── structure.md   # 프로젝트 참조
```

### 변경 검증 방법

```bash
# 변경 전 확인
rg "Reading Tablet" --type-add 'md:*.md' --type-add 'json:*.json' -t md -t json -t html

# 변경 후 검증
rg "3-focus-reading" --type-add 'md:*.md' --type-add 'json:*.json' -t md -t json -t html

# 누락 확인
rg "Reading Tablet" .
```

### 롤백 계획

**변경 전 백업**:
```bash
git checkout -b backup/brand-refactor
```

**롤백 방법**:
```bash
git checkout backup/brand-refactor -- package.json index.html README.md .moai/
```

---

## Testing Strategy (테스트 전략)

### 단위 테스트

1. package.json `name` 필드 검증
   ```javascript
   import pkg from '../package.json';
   assert.strictEqual(pkg.name, '3-focus-reading');
   ```

2. index.html `<title>` 검증
   ```javascript
   const html = fs.readFileSync('index.html', 'utf-8');
   assert(html.includes('<title>3-focus-reading</title>'));
   ```

### 통합 테스트

1. 모든 파일에서 "Reading Tablet" 문자열이 없는지 확인
2. Git diff로 변경사항 확인
3. 브라우저에서 index.html 로드 시 제목 확인

### 수동 검증

- [ ] package.json 파일을 열어 `name` 필드 확인
- [ ] index.html을 브라우저에서 열어 탭 제목 확인
- [ ] README.md를 GitHub에서 확인
- [ ] .moai/project/product.md 내용 확인

---

## Traceability (@TAG)

### TAG 체인

- **SPEC**: `@SPEC:BRAND-001`
- **TEST**: `tests/brand/brand-consistency.test.js`
- **CODE**:
  - `package.json` - npm 패키지명
  - `index.html` - HTML 메타데이터
  - `README.md` - 프로젝트 문서
  - `.moai/project/product.md` - 제품 명세
  - `.moai/project/structure.md` - 구조 문서
- **DOC**: `docs/branding.md` (선택)

### 관련 파일

```
reading tablet/
├── package.json                    # @CODE:BRAND-001
├── index.html                      # @CODE:BRAND-001
├── README.md                       # @CODE:BRAND-001
├── .moai/
│   ├── project/
│   │   ├── product.md             # @CODE:BRAND-001
│   │   └── structure.md           # @CODE:BRAND-001
│   └── specs/
│       └── SPEC-BRAND-001/
│           └── spec.md            # @SPEC:BRAND-001 (현재 문서)
└── tests/
    └── brand/
        └── brand-consistency.test.js  # @TEST:BRAND-001
```

---

## Dependencies (의존성)

### 내부 의존성
- **없음** (독립적 리팩토링)

### 외부 의존성
- **없음** (파일 시스템 작업만)

### 선후 관계
- **선행 조건**: Git 저장소 초기화, package.json 존재
- **후행 작업**: 다른 SPEC 작업 (SPEC-DOC-001, SPEC-UI-001)

---

## Migration Plan (마이그레이션 계획)

### 1단계: 백업
```bash
git add .
git commit -m "백업: 브랜딩 리팩토링 전 상태"
git tag backup/before-brand-refactor
```

### 2단계: 파일별 변경
1. `package.json`: `name` 필드 변경
2. `index.html`: `<title>` 및 `<meta>` 변경
3. `README.md`: 프로젝트명 변경
4. `.moai/project/product.md`: 브랜드명 변경
5. `.moai/project/structure.md`: 참조 업데이트

### 3단계: 검증
```bash
rg "Reading Tablet" .  # 남은 참조 확인
rg "3-focus-reading" . # 변경 확인
```

### 4단계: 커밋
```bash
git add .
git commit -m "♻️ REFACTOR: 브랜딩 리팩토링 (Reading Tablet → 3-focus-reading)

@TAG:BRAND-001-REFACTOR"
```

---

## References (참고 자료)

### 네이밍 규칙
1. npm 패키지 네이밍 가이드라인
2. HTML5 메타데이터 표준
3. 프로젝트 브랜딩 Best Practices

### 유사 사례
1. React → React.js 브랜드 변경
2. Vue.js → Vue 심플화 사례

---

## Glossary (용어집)

| 용어 | 정의 |
|-----|------|
| **브랜딩 리팩토링** | 코드 구조는 유지하면서 프로젝트명/브랜드명만 변경하는 작업 |
| **3-focus-reading** | 3문장 슬라이딩 윈도우 기반 집중 읽기 (영문 표기) |
| **3문장 집중 읽기** | 프로젝트의 한글 브랜드명 |
| **슬라이딩 윈도우** | 현재 읽는 3문장을 하이라이트하며 이동하는 기능 |

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

**다음 단계**: `/alfred:2-build BRAND-001`로 TDD 구현 시작
