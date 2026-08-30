#!/usr/bin/env node
/**
 * Runs `next dev` and, once the dev server reports it's ready, opens the
 * app in Google Chrome automatically (macOS/Windows/Linux).
 *
 * On macOS, this script also watches the opened Chrome tab and shuts the
 * dev server down automatically once that tab (or its window) is closed,
 * so you don't end up with an orphaned server running in the background.
 * This is best-effort: it polls Chrome's tab list via AppleScript every
 * few seconds, so there can be a short delay after closing the tab.
 *
 * Used by `npm run dev`. If you don't want the browser to open, use
 * `npm run dev:plain` instead.
 */
import { spawn, execFile } from "node:child_process";

const URL_REGEX = /(https?:\/\/localhost:\d+)/;
const FALLBACK_URL = "http://localhost:3000/en";
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
      openInChrome(`${match[1]}/en`);
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
        console.log("\n🛑 Chrome tab/window closed — shutting down dev server.\n");
        clearInterval(timer);
        shutdown();
      }
    });
  }, TAB_POLL_INTERVAL_MS);

  child.on("exit", () => clearInterval(timer));
}

function shutdown() {
  child.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
