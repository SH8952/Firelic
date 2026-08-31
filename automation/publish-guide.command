#!/bin/bash
# FIRE Calculator(firelic) 가이드 자동 발행 스크립트 (영구 설치형)
# ExifLens/FlyDroneMap의 publish-guide.command와 동일한 설계.
# 콘텐츠는 개별 .mdx 파일(guide-<slug>-<locale>.mdx)로 전달되며,
# content/guides/<locale>/<slug>.mdx 로 그대로 복사해 반영합니다.

REPO="$HOME/Desktop/애드센스 제휴 마케팅/firelic"
SCRIPT_NAME="publish-guide.command"
SCRIPT_PATH="$REPO/automation/$SCRIPT_NAME"

if [ ! -d "$REPO/.git" ]; then
  echo "저장소를 찾을 수 없습니다: $REPO"
  echo "이 스크립트는 firelic 저장소가 있는 맥에서만 동작합니다."
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CURRENT_PATH="$SCRIPT_DIR/$(basename "$0")"

# --- 1. 최초 실행/업데이트: 저장소 안에 스스로 설치 ---
if [ "$CURRENT_PATH" != "$SCRIPT_PATH" ]; then
  echo "=== 발행 스크립트를 저장소에 설치(갱신)합니다 ==="
  mkdir -p "$REPO/automation"
  cp "$CURRENT_PATH" "$SCRIPT_PATH"
  chmod +x "$SCRIPT_PATH"
  xattr -d com.apple.quarantine "$SCRIPT_PATH" 2>/dev/null
  xattr -cr "$SCRIPT_PATH" 2>/dev/null

  cd "$REPO"
  [ -f .git/index.lock ] && rm -f .git/index.lock
  [ -f .git/HEAD.lock ] && rm -f .git/HEAD.lock
  git add "automation/$SCRIPT_NAME"
  if ! git diff --cached --quiet; then
    git commit -m "chore: 가이드 자동 발행 스크립트 설치/업데이트 (mdx 개별 파일 방식으로 전환)"
    git push origin main
  fi
  echo "설치 완료: $SCRIPT_PATH"
  echo ""
fi

# --- 2. 발행할 콘텐츠가 있는지 확인 (스크립트와 같은 폴더에서 탐색) ---
cd "$SCRIPT_DIR"
EN_FILE=$(ls guide-*-en.mdx 2>/dev/null | head -n1)

if [ -z "$EN_FILE" ]; then
  if [ "$CURRENT_PATH" != "$SCRIPT_PATH" ]; then
    echo "오늘은 발행할 콘텐츠 파일이 없어 설치만 진행했습니다."
  else
    echo "발행할 콘텐츠 파일(guide-*-en.mdx 등)을 찾을 수 없습니다."
    echo "오늘 전달받은 파일들을 이 폴더에 넣은 뒤 다시 실행해 주세요:"
    echo "  $SCRIPT_DIR"
  fi
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 0
fi

SLUG="${EN_FILE#guide-}"
SLUG="${SLUG%-en.mdx}"

TITLE=$(python3 -c "
import json
try:
    q = json.load(open('new-queue.json', encoding='utf-8'))
    topics = q['topics'] if isinstance(q, dict) and 'topics' in q else q
    for item in topics:
        if item.get('slug') == '$SLUG':
            print(item.get('titleKo', ''))
            break
except Exception:
    pass
" 2>/dev/null)
TITLE="${TITLE:-$SLUG}"

echo "=== FIRE Calculator 가이드 자동 발행: $TITLE ==="

for loc in en ja ko es; do
  if [ ! -f "guide-${SLUG}-${loc}.mdx" ]; then
    echo "누락됨: guide-${SLUG}-${loc}.mdx"
    echo "4개 언어(en/ja/ko/es) 파일이 모두 있어야 발행할 수 있습니다."
    read -p "Enter를 누르면 창이 닫힙니다..."
    exit 1
  fi
done

# --- 3. 작업 전 백업 (always-backup-before-work 규칙) ---
BACKUP_DIR="$REPO/_backups/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$REPO/_backups"
echo "백업 생성 중: $BACKUP_DIR"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude '_backups' --exclude '_to_delete' "$REPO/" "$BACKUP_DIR/"
else
  cp -r "$REPO" "$BACKUP_DIR"
fi

# --- 4. 콘텐츠 반영 ---
mkdir -p "$REPO/content/guides/en" "$REPO/content/guides/ja" "$REPO/content/guides/ko" "$REPO/content/guides/es"
cp "guide-${SLUG}-en.mdx" "$REPO/content/guides/en/${SLUG}.mdx"
cp "guide-${SLUG}-ja.mdx" "$REPO/content/guides/ja/${SLUG}.mdx"
cp "guide-${SLUG}-ko.mdx" "$REPO/content/guides/ko/${SLUG}.mdx"
cp "guide-${SLUG}-es.mdx" "$REPO/content/guides/es/${SLUG}.mdx"
cp "new-queue.json" "$REPO/automation/guide-topics-queue.json"

python3 -c "
import pathlib
repo = pathlib.Path('$REPO')
changelog = repo / 'CHANGELOG.md'
snippet_path = pathlib.Path('$SCRIPT_DIR/changelog-snippet.txt')
if snippet_path.exists() and changelog.exists():
    snippet = snippet_path.read_text(encoding='utf-8')
    content = changelog.read_text(encoding='utf-8')
    anchor = '# 개발 이력 (Development History)\n\n'
    if anchor in content and snippet.strip() not in content:
        content = content.replace(anchor, anchor + snippet + '\n', 1)
        changelog.write_text(content, encoding='utf-8')
        print('CHANGELOG.md 갱신 완료')
    else:
        print('CHANGELOG.md 갱신 건너뜀 (앵커 불일치 또는 이미 반영됨)')
"

# --- 5. (선택) 빌드 검증 — Node/npm이 있으면 실행, 없으면 건너뜀 ---
cd "$REPO"
if command -v npm >/dev/null 2>&1 && [ -d node_modules ]; then
  echo ""
  echo "-- 로컬 빌드 검증 (npx tsc --noEmit) --"
  if ! npx tsc --noEmit; then
    echo "경고: 타입 검사에서 오류가 발견되었습니다. 그래도 계속 진행하시겠습니까? (클라우드 쪽에서는 이미 검증을 거쳤습니다)"
    read -p "계속하려면 Enter, 중단하려면 Ctrl+C: "
  fi
fi

# --- 6. git add / commit / push ---
cd "$REPO"
[ -f .git/index.lock ] && rm -f .git/index.lock
[ -f .git/HEAD.lock ] && rm -f .git/HEAD.lock

git add "content/guides/en/${SLUG}.mdx" "content/guides/ja/${SLUG}.mdx" "content/guides/ko/${SLUG}.mdx" "content/guides/es/${SLUG}.mdx" automation/guide-topics-queue.json CHANGELOG.md

if git diff --cached --quiet; then
  echo ""
  echo "오류: git에 새로 반영할 변경사항이 없습니다."
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi

echo ""
echo "-- git commit --"
if ! git commit -m "feat: 가이드 아티클 추가 - ${TITLE} (자동 발행)"; then
  echo "오류: 커밋 실패. 콘텐츠 파일은 삭제하지 않았습니다."
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi

echo ""
echo "-- git push --"
if ! git push origin main; then
  echo "오류: push 실패(네트워크 등). 커밋 자체는 로컬에 남아 있습니다."
  echo "저장소 폴더에서 'git push origin main'을 직접 실행해 재시도해 주세요."
  read -p "Enter를 누르면 창이 닫힙니다..."
  exit 1
fi

# --- 7. 성공 시에만 정리 ---
rm -f "$SCRIPT_DIR/guide-${SLUG}-en.mdx" "$SCRIPT_DIR/guide-${SLUG}-ja.mdx" "$SCRIPT_DIR/guide-${SLUG}-ko.mdx" "$SCRIPT_DIR/guide-${SLUG}-es.mdx" "$SCRIPT_DIR/new-queue.json" "$SCRIPT_DIR/changelog-snippet.txt"

echo ""
echo "발행 완료 (커밋+push 확인됨): $TITLE"
echo "백업 위치: $BACKUP_DIR"
echo "5초 후 이 창이 닫힙니다."
sleep 5
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
