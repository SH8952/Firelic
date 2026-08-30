#!/usr/bin/env node
/**
 * Runs `next dev` and, once the dev server reports it's ready, opens the
 * app in Google Chrome automatically (macOS/Windows/Linux).
 *
 * On macOS, this script also watches the opened Chrome tab and, once that
 * tab (or its window) is closed, both stops the dev server AND closes the
 * Terminal window/tab this script is running in — so nothing is left
 * behind, not even the Terminal window. This is best-effort: it polls
 * Chrome's tab list via AppleScript every few seconds, so there can be a
 * short delay, and closing the Terminal window requires Terminal.app
 * automation permission (same permission prompt as the Chrome polling).
 * Manually stopping the server with Ctrl+C does NOT close the Terminal
 * window — only the Chrome-tab-close trigger does.
 *
 * Used by `npm run dev`. If you don't want the browser to open, use
 * `npm run dev:plain` instead.
 */
import { spawn, execFile, execFileSync } from "node:child_process";

const URL_REGEX = /(https?:\/\/localhost:\d+)/;
const FALLBACK_URL = "http://localhost:3000";
const FALLBACK_DELAY_MS = 8000;
const TAB_POLL_INTERVAL_MS = 4000;

const child = spawn("next", ["dev"], {
  stdio: ["inherit", "pipe", "inherit"],
  shell: process.platform === "win32",
});

let opened = false;

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);

  if (!opened) {
    const match = text.match(URL_REGEX);
    if (match) {
      opened = true;
      openInChrome(match[1]);
    }
  }
});

const fallbackTimer = setTimeout(() => {
  if (!opened) {
    opened = true;
    openInChrome(FALLBACK_URL);
  }
}, FALLBACK_DELAY_MS);

function openInChrome(url) {
  clearTimeout(fallbackTimer);

  let cmd;
  switch (process.platform) {
    case "darwin":
      cmd = `open -a "Google Chrome" "${url}"`;
      break;
    case "win32":
      cmd = `start chrome "${url}"`;
      break;
    default:
      cmd = `google-chrome "${url}" || xdg-open "${url}"`;
      break;
  }

  execFile("/bin/sh", ["-c", cmd], (err) => {
    if (err) {
      console.warn(
        `\n⚠ Couldn't auto-open Chrome (is it installed?). Open manually: ${url}\n`,
      );
      return;
    }
    if (process.platform === "darwin") {
      watchChromeTab(url);
    }
  });
}

/**
 * Polls Chrome's open tabs for one whose URL still matches our dev server
 * host:port. Once we've confirmed the tab was open at least once, and it
 * later disappears (tab/window closed, or Chrome quit entirely), we shut
 * the dev server down. macOS-only (uses AppleScript / System Events).
 */
function watchChromeTab(url) {
  const portMatch = url.match(/:(\d+)/);
  const needle = portMatch ? `localhost:${portMatch[1]}` : "localhost";
  let sawTab = false;

  const timer = setInterval(() => {
    const script = [
      "-e", 'tell application "System Events"',
      "-e", 'set chromeRunning to (exists process "Google Chrome")',
      "-e", "end tell",
      "-e", "if not chromeRunning then",
      "-e", 'return "closed"',
      "-e", "end if",
      "-e", 'tell application "Google Chrome"',
      "-e", "set tabFound to false",
      "-e", "repeat with w in windows",
      "-e", "repeat with t in tabs of w",
      "-e", `if URL of t contains "${needle}" then set tabFound to true`,
      "-e", "end repeat",
      "-e", "end repeat",
      "-e", "if tabFound then",
      "-e", 'return "open"',
      "-e", "else",
      "-e", 'return "closed"',
      "-e", "end if",
      "-e", "end tell",
    ];

    execFile("osascript", script, (err, stdout) => {
      if (err) return; // ignore transient AppleScript errors, try again next tick
      const state = (stdout || "").trim();
      if (state === "open") {
        sawTab = true;
      } else if (sawTab && state === "closed") {
        console.log("\n🛑 Chrome tab/window closed — shutting down dev server and closing this Terminal window.\n");
        clearInterval(timer);
        shutdown({ closeTerminal: true });
      }
    });
  }, TAB_POLL_INTERVAL_MS);

  child.on("exit", () => clearInterval(timer));
}

function shutdown({ closeTerminal = false } = {}) {
  child.kill("SIGTERM");
  if (closeTerminal && process.platform === "darwin") {
    closeTerminalWindow();
  }
  process.exit(0);
}

/**
 * Best-effort: asks Terminal.app to close the window/tab this process is
 * attached to, so closing the Chrome tab leaves no dangling Terminal
 * window behind (in addition to stopping the dev server itself). Silently
 * does nothing if this isn't running inside Terminal.app (e.g. iTerm,
 * VS Code's integrated terminal) or if Terminal automation permission
 * hasn't been granted — the dev server has already stopped either way.
 */
function closeTerminalWindow() {
  let ttyPath;
  try {
    ttyPath = execFileSync("tty", { stdio: ["inherit", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return; // not attached to a tty (e.g. output piped elsewhere)
  }
  if (!ttyPath) return;

  execFile(
    "osascript",
    [
      "-e", "delay 0.8",
      "-e", `tell application "Terminal" to close (every window whose tty is "${ttyPath}")`,
    ],
    () => {
      // Ignore errors — Terminal may not be the host app, or automation
      // permission may not be granted.
    },
  );
}

process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
