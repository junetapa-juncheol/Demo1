# Fonts Directory

이 디렉토리는 웹사이트에서 사용하는 로컬 폰트 파일들을 저장합니다.

## 포함된 폰트

### 1. Orbitron
- **용도**: 제목, 로고, 디스플레이 텍스트
- **스타일**: 미래적, 과학적, 기술적
- **파일**:
  - `orbitron-regular.woff2` (400 weight)
  - `orbitron-bold.woff2` (700 weight)
  - `orbitron-black.woff2` (900 weight)

### 2. Noto Sans KR
- **용도**: 한국어 텍스트, 본문
- **스타일**: 읽기 쉬운 산세리프
- **파일**:
  - `noto-sans-kr-light.woff2` (100, 300 weight)
  - `noto-sans-kr-regular.woff2` (400, 500 weight)
  - `noto-sans-kr-bold.woff2` (700, 900 weight)

### 3. Space Grotesk
- **용도**: 영어 헤딩, 인터페이스 요소
- **스타일**: 모던 산세리프
- **파일**:
  - `space-grotesk-light.woff2` (300 weight)
  - `space-grotesk-regular.woff2` (400, 500 weight)
  - `space-grotesk-bold.woff2` (600, 700 weight)

## 사용법

### CSS에서 사용
```css
/* fonts.css에 정의된 폰트 사용 */
.title {
    font-family: 'Orbitron', monospace;
}

.body-text {
    font-family: 'Noto Sans KR', sans-serif;
}

.heading {
    font-family: 'Space Grotesk', sans-serif;
}
```

### JavaScript에서 사용
```javascript
// FontLoader 유틸리티 사용
const fontLoader = new FontLoader();
await fontLoader.loadFont('Orbitron', '700');
```

## 성능 최적화

### 1. 폰트 프리로딩
중요한 폰트는 HTML에서 preload로 로드합니다:
```html
<link rel="preload" href="fonts/orbitron-regular.woff2" as="font" type="font/woff2" crossorigin>
```

### 2. 폰트 디스플레이 최적화
- `font-display: swap` 사용으로 빠른 텍스트 렌더링
- 모바일에서는 `font-display: optional` 사용

### 3. 폰트 로딩 상태 관리
- 폰트 로딩 중: `font-loading` 클래스
- 폰트 로딩 완료: `font-loaded` 클래스
- 폰트 로딩 실패: `font-fallback` 클래스

## 브라우저 호환성

### 지원 형식
- **WOFF2**: 모든 모던 브라우저 지원
- **WOFF**: 레거시 브라우저 지원 (필요시 추가)
- **TTF/OTF**: 매우 오래된 브라우저 지원 (필요시 추가)

### 폴백 폰트
각 폰트에 대해 시스템 폰트 폴백이 정의되어 있습니다:
- Orbitron → Courier New, monospace
- Noto Sans KR → Malgun Gothic, 맑은 고딕, sans-serif
- Space Grotesk → Helvetica Neue, Arial, sans-serif

## 라이선스

모든 폰트는 Google Fonts에서 제공하는 오픈소스 라이선스를 따릅니다:
- **Orbitron**: SIL Open Font License 1.1
- **Noto Sans KR**: SIL Open Font License 1.1
- **Space Grotesk**: SIL Open Font License 1.1

## 파일 크기 최적화

### 현재 파일 크기
- Orbitron Regular: 6.2KB
- Noto Sans KR: 1.6KB (서브셋)
- Space Grotesk: 1.6KB

### 최적화 방법
1. **서브셋팅**: 필요한 문자만 포함
2. **압축**: WOFF2 형식 사용
3. **지연 로딩**: 중요하지 않은 폰트는 필요시에만 로드

## 개발 가이드

### 새 폰트 추가
1. 폰트 파일을 `fonts/` 디렉토리에 추가
2. `fonts.css`에 @font-face 규칙 추가
3. `fontLoader.js`에 폰트 매핑 추가
4. 필요시 preload 태그 추가

### 폰트 테스트
```javascript
// 개발자 도구에서 폰트 로딩 상태 확인
console.log(window.fontLoader.getFontLoadingStatus());

// 특정 폰트 로딩 여부 확인
console.log(window.fontLoader.isFontLoaded('Orbitron'));
```

## 문제 해결

### 폰트가 로드되지 않는 경우
1. 네트워크 탭에서 폰트 파일 요청 상태 확인
2. CORS 설정 확인 (crossorigin 속성)
3. 파일 경로 확인
4. 폰트 형식 지원 여부 확인

### 성능 문제
1. 폰트 파일 크기 확인
2. 불필요한 폰트 weight 제거
3. 폰트 서브셋 적용
4. 지연 로딩 적용

## 모니터링

### 성능 지표
- 폰트 로딩 시간
- CLS (Cumulative Layout Shift) 점수
- 폰트 로딩 성공률

### 로깅
FontLoader는 자동으로 폰트 로딩 상태를 콘솔에 출력합니다:
```
Font loaded: Orbitron 400 normal
Font loaded: Noto Sans KR 400 normal
Font loaded: Space Grotesk 400 normal
All fonts loaded successfully
```