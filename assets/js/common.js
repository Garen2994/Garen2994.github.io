/* 占位素材引擎：所有"视频"都是 canvas 噪点动画，之后可整体替换成 <video> */

/**
 * 在 canvas 上播放颗粒噪点动画。
 * opts.tint: [r,g,b] 基础色调
 * opts.glow: true 时叠加一个缓慢漂移的光斑（模拟夜视人脸光）
 * opts.vignette: 0~1 暗角强度
 * opts.fps: 帧率
 */
function startNoise(canvas, opts = {}) {
  const tint = opts.tint || [190, 190, 190];
  const glow = opts.glow || false;
  const vignette = opts.vignette ?? 0.55;
  const fps = opts.fps || 14;
  const W = 96;
  const H = Math.round(W * (canvas.clientHeight / Math.max(canvas.clientWidth, 1))) || 96;

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(W, H);
  let t = 0;

  function frame() {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = Math.random();
      d[i] = tint[0] * n;
      d[i + 1] = tint[1] * n;
      d[i + 2] = tint[2] * n;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    if (glow) {
      const gx = W / 2 + Math.sin(t / 90) * W * 0.18;
      const gy = H / 2 + Math.cos(t / 130) * H * 0.14;
      const g = ctx.createRadialGradient(gx, gy, 2, gx, gy, W * 0.45);
      g.addColorStop(0, `rgba(${tint[0]},${tint[1] + 40},${tint[2]},0.85)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    if (vignette > 0) {
      const v = ctx.createRadialGradient(W / 2, H / 2, W * 0.18, W / 2, H / 2, W * 0.72);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, `rgba(0,0,0,${vignette})`);
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
    }
    t++;
  }

  frame();
  return setInterval(frame, 1000 / fps);
}

/* 静态细颗粒（用于木纹、照片上的胶片感覆盖层） */
function paintGrain(canvas, alpha = 28) {
  const W = 128;
  const H = 128;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = n;
    d[i + 3] = alpha;
  }
  ctx.putImageData(img, 0, 0);
}

/* 滚动进入动画 */
function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  // SVG <text> 不触发 Google Fonts 按需子集下载，手动预载所有 SVG 里用到的字
  if (document.fonts && document.fonts.load) {
    const svgGlyphs = "梦自由散漫废带回收留个话故纸堆";
    for (const f of ["Long Cang", "Zhi Mang Xing"]) {
      document.fonts.load(`80px "${f}"`, svgGlyphs);
    }
  }

  document.querySelectorAll("canvas[data-noise]").forEach((c) => {
    const tint = (c.dataset.tint || "190,190,190").split(",").map(Number);
    startNoise(c, {
      tint,
      glow: c.dataset.glow === "1",
      vignette: c.dataset.vignette ? Number(c.dataset.vignette) : undefined,
    });
  });
  document.querySelectorAll("canvas[data-grain]").forEach((c) => {
    paintGrain(c, Number(c.dataset.grain) || 28);
  });
  initReveal();
});
