# 초록 멜로디 — Netlify 배포용 환경 노래 만들기 웹앱

학생이 환경 보호 가사를 입력하고 음악 장르와 보컬 스타일을 선택하면 AI 음악 생성 API로 노래를 만드는 한국어 웹앱입니다.

## 먼저 알아둘 점
- 웹앱 화면은 바로 배포할 수 있지만, 실제 노래 생성에는 **ElevenLabs Music API 키**와 해당 API 사용 권한/사용량이 필요합니다. Music API는 유료 구독자에게 제공된다고 안내되어 있습니다.
- API 키를 HTML이나 브라우저 코드에 넣지 않습니다. Netlify 환경변수 `ELEVENLABS_API_KEY`에 보관합니다.
- AI가 가사를 정확히 모두 부르거나 모든 장르에서 원하는 결과를 내는 것을 보장할 수는 없습니다. 생성 결과를 확인해 주세요.

## Netlify에 배포하기 (초보자용)

### 방법 A — GitHub로 배포 (추천)
1. GitHub에 새 저장소를 만듭니다.
2. 이 압축 파일의 내용을 저장소에 올립니다. `index.html`, `netlify.toml`, `netlify/functions/generate-song.mjs`, `README.md`가 저장소 최상위/해당 폴더에 있어야 합니다.
3. [Netlify](https://app.netlify.com/)에 로그인하고 **Add new site → Import an existing project**를 선택합니다.
4. GitHub 저장소를 연결합니다. Build command는 비워 두고, Publish directory는 `.` 으로 둡니다.
5. 사이트를 배포합니다.
6. Netlify 사이트 대시보드에서 **Site configuration → Environment variables** (또는 **Project configuration → Environment variables**)로 이동합니다.
7. `ELEVENLABS_API_KEY` 이름으로 환경변수를 만들고 ElevenLabs 대시보드에서 발급한 API 키를 값으로 입력합니다. 키를 코드나 공개 저장소에 올리지 마세요.
8. 환경변수를 저장한 뒤 **Deploys → Trigger deploy → Clear cache and deploy site**로 다시 배포합니다.
9. 사이트 URL을 열어 가사를 입력하고 노래를 생성해 봅니다.

### 방법 B — Netlify Drop
정적 화면은 Netlify Drop으로 올릴 수 있지만, 서버리스 함수와 환경변수까지 포함한 전체 앱을 안정적으로 배포하려면 GitHub 연결 방식(A)을 권장합니다.

## 음악 API 참고
- ElevenLabs Music 문서: https://elevenlabs.io/docs/overview/capabilities/music
- Music API Quickstart: https://elevenlabs.io/docs/eleven-api/guides/cookbooks/music
- API 키: https://elevenlabs.io/app/settings/api-keys

## 교실 활용 팁
- 학생 이름, 얼굴 정보, 연락처 등 개인정보를 가사에 넣지 않습니다.
- 생성한 음악의 사용 조건은 API 제공자의 계정/요금제별 이용 약관을 확인합니다.
- 가사를 수정한 뒤 장르를 바꾸어 비교하고, 어떤 음악이 환경 보호 메시지를 가장 잘 전달하는지 이야기해 보세요.
