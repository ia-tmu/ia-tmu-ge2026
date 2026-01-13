/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("child_process");

function getBuildInfo() {
  let gitBranch = "unknown";
  let gitSha = "unknown";
  try {
    gitBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    gitSha = execSync("git rev-parse --short HEAD").toString().trim();
  } catch (_e) {
    // ignore error
  }

  const buildTime = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    buildTime,
    git: {
      branch: gitBranch,
      sha: gitSha,
    },
  };
}

module.exports = { getBuildInfo };
