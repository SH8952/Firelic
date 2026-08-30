#!/bin/bash
# firelic 원클릭 git 커밋 + push 스크립트
# 더블클릭하면 터미널이 열리고, 변경사항을 커밋한 뒤 GitHub로 push하고,
# 완료 메시지를 보여준 뒤 3초 후 이 터미널 창이 자동으로 닫힙니다.

REPO="$HOME/Desktop/애드센스 제휴 마케팅/firelic"

close_after() {
  local seconds="$1"
  echo ""
  echo "${seconds}초 후 이 창이 닫힙니다..."
  sleep "$seconds"
  THIS_TTY=$(tty)
  osascript <<APPLESCRIPT
tell application "Terminal"
    repeat with w in windows
        try
            if tty of (selected tab of w) is "$THIS_TTY" then close w
        end try
    end repeat
end tell
delay 0.3
try
    tell application "System Events" to keystroke return
end try
APPLESCRIPT
}

if [ ! -d "$REPO/.git" ]; then
  echo "저장소를 찾을 수 없습니다: $REPO"
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi

cd "$REPO" || { echo "오류: 저장소 폴더로 이동할 수 없습니다."; read -p "Enter..."; exit 1; }
[ -f .git/index.lock ] && rm -f .git/index.lock

echo "=== firelic 변경사항 확인 중 ==="
git status --short
echo ""

git add -A

if git diff --cached --quiet; then
  echo "커밋할 새 변경사항은 없습니다. 기존 커밋을 push만 진행합니다."
else
  echo "-- git commit --"
  TIMESTAMP=$(TZ=Asia/Seoul date +"%Y-%m-%d %H:%M KST")
  if ! git commit -m "chore: 로컬 변경사항 저장 (원클릭 push, ${TIMESTAMP})"; then
    echo "오류: 커밋 실패."
    close_after 5
    exit 1
  fi
fi

echo ""
echo "-- git push --"
if git push origin main; then
  echo ""
  echo "✅ 완료: 커밋 및 push가 정상적으로 반영되었습니다."
  echo "Vercel이 자동으로 새 배포를 시작합니다 (https://firelic.vercel.app)."
  close_after 3
else
  echo ""
  echo "❌ push 실패. 네트워크 상태나 GitHub 로그인 상태를 확인해 주세요."
  echo "커밋 자체는 로컬에 남아 있으니, 문제를 해결한 뒤 이 스크립트를 다시 실행하시면 됩니다."
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi
