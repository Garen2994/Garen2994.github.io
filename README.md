# garenhou · 暗黑实验艺术风格个人站

纯 HTML + CSS + 原生 JS，零依赖、零构建。占位素材（噪点"视频"、印章、书法字、磁带）
均由 canvas / SVG 在浏览器内实时生成，离线可用。移动优先（375 x 812 设计基准）。

## 本地预览

任选一种：

```powershell
npx -y http-server . -p 8777
# 或
python -m http.server 8777
```

然后打开 http://127.0.0.1:8777/ ，建议用 Chrome DevTools 切到移动视图（375 x 812）。

## 页面结构

| 页面            | 说明                                                     |
| --------------- | -------------------------------------------------------- |
| `index.html`    | 欢迎页：夜视绿噪点"视频" + 印章，轻触任意处进入          |
| `subindex.html` | 目录页：书法大字 + 噪点小窗拼贴，纵向滚动，点击进入      |
| `feed.html`     | 自由散漫：雪花噪点时间轴 + 代码手稿 / 终端帧 / 墨迹热力图 |
| `music.html`    | 废带回收：VHS 盒 + 磁带书脊，点击弹出播放器占位          |
| `articles.html` | 故纸堆：旧博客文章档案架，点开档案卡浮层                 |
| `message.html`  | 留个话：钉纸条留言墙，已接自建后端                       |

## 留言墙后端

`message.html` 顶部的 `const API` 指向留言服务：

- 留空 `""` = 本地模式（预置纸条 + localStorage），纯前端可用
- 当前指向 `https://api.garenhou.com:8443`（自建 Spring Boot + SQLite 服务）

表单里有一个隐藏的 `website` 蜜罐字段，机器人填了会被后端静默丢弃。

## 素材替换指南

### 1. 视频

所有 `<canvas data-noise ...>` 都是"视频占位"。替换成真素材时，把 canvas 换成：

```html
<video src="assets/videos/xxx.mp4" autoplay muted loop playsinline></video>
```

尺寸样式不用改（容器已定好）。建议压到 5MB 以内，H.264 编码保证移动端兼容。

### 2. 书法字

现在用的是 SVG `<text>` + 毛边滤镜（feTurbulence + feDisplacementMap）+ 手书字体
（Google Fonts 的 Zhi Mang Xing，加载失败时回退到本机楷体）。
想要真手写效果时，把整个 `<svg class="brush">` 换成透明底 PNG：

```html
<img class="brush" src="assets/images/calligraphy-xxx.png" alt="" />
```

### 3. 印章

`.seal` SVG 里的字改成自己的即可；或换成扫描的真印章 PNG。

### 4. Feed 照片

`.ph` 占位块换成 `<img>` 或 `<video>`，删掉里面的 `.ph-label` 即可，
`.grain-c` 噪点覆盖层可以留着增加胶片感。

### 5. 磁带标签

`music.html` 里每个 `.vhs` / `.spine` 的 `data-title` 是播放器显示的名字，
`.vtitle` / `.stitle` 是架子上显示的标签，直接改文字。

### 6. 文章链接

`articles.html` 里 `docs` 数组的 `link` 字段现在是 `"#"` 占位，
博客正文有落脚点后改成真实 URL 即可。

## 关键文件

```
assets/css/common.css   全局：配色变量、字体栈、进入动画
assets/css/pages.css    各页面样式（按页分段注释）
assets/js/common.js     噪点引擎 startNoise() / 颗粒 paintGrain() / 字体预载 / 进入动画
assets/js/feed.js       Feed 页 glitch 横条 / 终端打字动画 / 墨迹热力图
```

## 后续方向

- 用 regl / three.js 加 WebGL 粒子效果
- 接入真实的音频播放（Web Audio 或 `<audio>`）
- git 墨迹热力图接真实 `git log` 数据
