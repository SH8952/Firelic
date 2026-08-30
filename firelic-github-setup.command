#!/bin/bash
# firelic GitHub 최초 연결 스크립트 (1회만 실행)
#
# 사전 준비 (딱 1번, 이 스크립트 실행 전에 미리 하셔야 합니다):
#   1) https://github.com/new 접속
#   2) Owner: SH8952 (ExifLens/FlyDroneMap과 동일 계정)
#   3) Repository name: firelic
#   4) Public 선택
#   5) "Add a README file" 등 초기화 옵션은 전부 체크 해제(빈 저장소로 생성) — 이미 로컬에 커밋이 있어서 충돌 방지
#   6) Create repository 클릭
# 위 과정을 마친 뒤 이 스크립트를 더블클릭하세요.

REPO="$HOME/Desktop/애드센스 제휴 마케팅/firelic"
REMOTE_URL="https://github.com/SH8952/firelic.git"

if [ ! -d "$REPO/.git" ]; then
  echo "저장소를 찾을 수 없습니다: $REPO"
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi

cd "$REPO"
[ -f .git/index.lock ] && rm -f .git/index.lock

if git remote get-url origin >/dev/null 2>&1; then
  echo "origin 원격 저장소가 이미 설정되어 있습니다: $(git remote get-url origin)"
  echo "이미 연결이 끝난 것으로 보입니다. 별도 조치가 필요 없습니다."
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 0
fi

echo "=== origin을 $REMOTE_URL 로 연결합니다 ==="
git remote add origin "$REMOTE_URL"

echo ""
echo "=== main 브랜치를 push합니다 ==="
if git push -u origin main; then
  echo ""
  echo "✅ 연결 및 최초 push 완료! 이제 firelic도 GitHub에 백업/자동 발행 준비가 되었습니다."
else
  echo ""
  echo "❌ push 실패. 다음을 확인해 주세요:"
  echo "  - https://github.com/SH8952/firelic 저장소를 먼저 만드셨는지"
  echo "  - 저장소를 만들 때 README 등 초기화 파일을 추가하지 않으셨는지 (추가했다면 저장소를 지우고 빈 상태로 다시 만들어주세요)"
  echo "  - GitHub 로그인/인증이 맥 터미널에 되어 있는지 (ExifLens/FlyDroneMap을 만들 때 쓰신 것과 동일한 방식)"
  git remote remove origin 2>/dev/null
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi

read -p "Enter를 누르면 창이 닫힙니다..."
