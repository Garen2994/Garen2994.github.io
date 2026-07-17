/* Feed 页专属：随机 glitch 横条，扫过屏幕模拟坏信号 */

function glitchBand() {
  const band = document.createElement("div");
  band.style.cssText = `
    position: fixed;
    left: 0; right: 0;
    height: ${8 + Math.random() * 40}px;
    top: ${Math.random() * 100}vh;
    z-index: 2;
    pointer-events: none;
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(1px);
    transform: translateX(${Math.random() > 0.5 ? "-" : ""}4px);
  `;
  document.body.appendChild(band);
  setTimeout(() => band.remove(), 120 + Math.random() * 180);
}

setInterval(() => {
  if (Math.random() < 0.45) glitchBand();
}, 900);

/* 终端帧：逐字打出命令，循环播放 */
(function initTerm() {
  const body = document.getElementById("termBody");
  if (!body) return;

  const script = [
    "$ cd ~/blog && git log --oneline | wc -l",
    "   247",
    "$ grep -rn \"TODO\" src/ | wc -l",
    "    36",
    "$ whoami",
    "梦",
    "$ rm -rf 焦虑/",
    "rm: 焦虑/: Permission denied",
  ];

  let line = 0;
  let ch = 0;
  let out = "";

  function tick() {
    const cur = script[line];
    const isCmd = cur.startsWith("$");

    if (isCmd) {
      out += cur[ch];
      ch++;
      if (ch < cur.length) {
        render();
        setTimeout(tick, 34 + Math.random() * 60);
        return;
      }
    } else {
      out += cur;
    }

    out += "\n";
    line++;
    ch = 0;
    render();

    if (line < script.length) {
      setTimeout(tick, isCmd ? 320 : 140);
    } else {
      setTimeout(() => {
        out = "";
        line = 0;
        render();
        setTimeout(tick, 800);
      }, 4200);
    }
  }

  function render() {
    body.textContent = out;
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    body.appendChild(cursor);
  }

  render();
  setTimeout(tick, 900);
})();

/* git 墨迹热力图：26 周 x 7 天，提交越多墨越浓，原型阶段用伪随机数据 */
(function initInkmap() {
  const fig = document.getElementById("inkmap");
  if (!fig) return;

  const COLS = 26;
  const ROWS = 7;
  const STEP = 18;
  const PAD = 12;
  const W = PAD * 2 + (COLS - 1) * STEP;
  const H = PAD * 2 + (ROWS - 1) * STEP;

  let seed = 20260716;
  function rnd() {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  }

  let total = 0;
  let dots = "";

  for (let c = 0; c < COLS; c++) {
    const weekMood = rnd();
    for (let r = 0; r < ROWS; r++) {
      let v = rnd() * weekMood;
      if (r >= 5) v *= 0.45; // 周末写得少
      if (v < 0.13) continue;

      const commits = Math.ceil(v * 9);
      total += commits;
      const x = PAD + c * STEP + (rnd() - 0.5) * 3;
      const y = PAD + r * STEP + (rnd() - 0.5) * 3;
      const radius = 1.6 + v * 4.6;
      const alpha = (0.22 + v * 0.75).toFixed(2);
      const color = v > 0.88 ? "#b03a2e" : "#f2f0ea";

      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${color}" opacity="${alpha}"/>`;
      if (v > 0.6) {
        const sx = x + (rnd() - 0.5) * 11;
        const sy = y + (rnd() - 0.5) * 11;
        dots += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(0.6 + rnd()).toFixed(1)}" fill="${color}" opacity="${(v * 0.5).toFixed(2)}"/>`;
      }
    }
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.innerHTML = dots;
  fig.insertBefore(svg, fig.firstChild);

  const count = document.getElementById("inkmapCount");
  if (count) count.textContent = `${total} commits`;
})();
