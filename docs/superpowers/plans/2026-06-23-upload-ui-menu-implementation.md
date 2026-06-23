# 功能迭代实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复文件上传功能、固定UI为中文亮色、移除指定菜单项

**Architecture:** 直接修改现有代码，包括后端上传逻辑、前端i18n配置和侧边栏组件

**Tech Stack:** Node.js, Express, React, i18next, Tailwind CSS

## Global Constraints

- 上传目录固定为 `~/upload/{projectId}/`
- UI语言固定为 `zh-CN`
- 默认主题为亮色模式
- 移除 Report Issue 和 Join Community 菜单

---

### Task 1: 修复文件上传功能 - 后端修改

**Files:**
- Modify: `server/index.js:886-1051`

**Interfaces:**
- Consumes: multer 中间件, fsPromises, path, os 模块
- Produces: 修复后的文件上传API，返回正确的文件路径和大小

- [ ] **Step 1: 修改上传目录配置**

打开 `server/index.js` 文件，找到 `uploadFilesHandler` 函数（第 886 行）。

修改 multer 的 destination 配置：

```javascript
// 修改前（第 892-894 行）
destination: (req, file, cb) => {
    cb(null, os.tmpdir());
},

// 修改后
destination: async (req, file, cb) => {
    try {
        const { projectId } = req.params;
        const uploadDir = path.join(os.homedir(), 'upload', projectId);
        await fsPromises.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    } catch (error) {
        cb(error);
    }
},
```

- [ ] **Step 2: 修改文件名生成逻辑**

修改 filename 配置，保留原始文件名：

```javascript
// 修改前（第 895-901 行）
filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `upload-${uniqueSuffix}`);
}

// 修改后
filename: (req, file, cb) => {
    // 保留原始文件名，添加时间戳前缀避免冲突
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
}
```

- [ ] **Step 3: 修改文件移动逻辑**

找到文件移动逻辑（第 1016-1018 行），确保文件正确复制：

```javascript
// 修改前
await fsPromises.copyFile(file.path, destPath);
await fsPromises.unlink(file.path);

// 修改后 - 添加错误处理和验证
try {
    await fsPromises.copyFile(file.path, destPath);
    await fsPromises.unlink(file.path);
    
    // 验证文件是否成功复制
    const stats = await fsPromises.stat(destPath);
    if (stats.size === 0 && file.size > 0) {
        throw new Error('File copied but size is 0');
    }
} catch (copyError) {
    console.error('Error copying file:', copyError);
    // 清理失败的文件
    await fsPromises.unlink(destPath).catch(() => {});
    throw copyError;
}
```

- [ ] **Step 4: 修改返回的文件路径**

修改上传成功后的响应（第 1020-1025 行），返回相对于 upload 目录的路径：

```javascript
// 修改前
uploadedFiles.push({
    name: fileName,
    path: destPath,
    size: file.size,
    mimeType: file.mimetype
});

// 修改后
uploadedFiles.push({
    name: fileName,
    path: path.join('upload', projectId, path.basename(destPath)),
    fullPath: destPath,
    size: file.size,
    mimeType: file.mimetype
});
```

- [ ] **Step 5: 测试文件上传**

启动服务器并测试文件上传：

```bash
# 启动服务器
npm run dev

# 使用 curl 测试上传（替换 PROJECT_ID 为实际项目ID）
curl -X POST \
  http://localhost:3000/api/projects/PROJECT_ID/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/test.txt"

# 检查文件是否保存到正确位置
ls -la ~/upload/PROJECT_ID/
```

- [ ] **Step 6: 提交代码**

```bash
git add server/index.js
git commit -m "fix: 修复文件上传功能，固定上传目录到 ~/upload/{projectId}/"
```

---

### Task 2: 固定UI语言为中文

**Files:**
- Modify: `src/i18n/config.js:100-111`

**Interfaces:**
- Consumes: i18next, localStorage
- Produces: 固定的语言配置

- [ ] **Step 1: 修改语言检测函数**

打开 `src/i18n/config.js` 文件，找到 `getSavedLanguage` 函数（第 100 行）：

```javascript
// 修改前
const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem('userLanguage');
    if (saved && languages.some(lang => lang.value === saved)) {
      return saved;
    }
    return 'en';
  } catch {
    return 'en';
  }
};

// 修改后
const getSavedLanguage = () => {
  return 'zh-CN';
};
```

- [ ] **Step 2: 修改 i18n 初始化配置**

找到 i18n.init 配置（第 117 行），修改 lng 配置：

```javascript
// 修改前
lng: getSavedLanguage(),

// 修改后 - 直接固定语言
lng: 'zh-CN',
```

- [ ] **Step 3: 禁用语言检测器**

在 i18n 配置中，注释掉或移除 LanguageDetector 的使用：

```javascript
// 修改前（第 114-115 行）
i18n
  .use(LanguageDetector)
  .use(initReactI18next)

// 修改后
i18n
  // .use(LanguageDetector) // 禁用语言检测，使用固定语言
  .use(initReactI18next)
```

- [ ] **Step 4: 测试语言固定**

刷新页面，验证：
1. UI 是否显示为中文
2. 语言切换功能是否被禁用（可选）

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问应用，检查语言是否为中文
```

- [ ] **Step 5: 提交代码**

```bash
git add src/i18n/config.js
git commit -m "feat: 固定UI语言为中文 (zh-CN)"
```

---

### Task 3: 设置默认亮色主题

**Files:**
- Modify: `src/main.jsx` 或 `src/App.tsx`

**Interfaces:**
- Consumes: localStorage, document.documentElement
- Produces: 默认亮色主题配置

- [ ] **Step 1: 添加主题初始化代码**

打开 `src/main.jsx` 文件，在应用初始化时添加主题设置：

```javascript
// 在文件开头添加
// 设置默认主题为亮色模式
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  } else if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}
```

- [ ] **Step 2: 验证主题设置**

检查项目中是否有主题切换逻辑，确保与现有代码兼容：

```bash
# 搜索主题相关代码
grep -r "dark" src/ --include="*.tsx" --include="*.ts" | head -20
grep -r "theme" src/ --include="*.tsx" --include="*.ts" | head -20
```

- [ ] **Step 3: 测试默认主题**

刷新页面，验证：
1. 默认是否为亮色主题
2. 刷新后是否保持亮色主题

```bash
npm run dev
```

- [ ] **Step 4: 提交代码**

```bash
git add src/main.jsx
git commit -m "feat: 设置默认主题为亮色模式"
```

---

### Task 4: 移除 Report Issue 和 Join Community 菜单

**Files:**
- Modify: `src/components/sidebar/view/subcomponents/SidebarFooter.tsx:92-170`

**Interfaces:**
- Consumes: React 组件, i18next 翻译函数
- Produces: 简化的侧边栏底部菜单

- [ ] **Step 1: 移除桌面端 Report Issue 菜单**

打开 `src/components/sidebar/view/subcomponents/SidebarFooter.tsx` 文件。

删除桌面端 Report Issue 代码块（第 92-102 行）：

```jsx
// 删除以下代码
{/* Desktop Report Issue */}
<div className="hidden px-2 pt-1.5 md:block">
  <a
    href={GITHUB_ISSUES_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
  >
    <Bug className="h-3.5 w-3.5" />
    <span className="text-sm">{t('actions.reportIssue')}</span>
  </a>
</div>
```

- [ ] **Step 2: 移除桌面端 Join Community 菜单**

删除桌面端 Discord 链接代码块（第 104-115 行）：

```jsx
// 删除以下代码
{/* Desktop Discord */}
<div className="hidden px-2 md:block">
  <a
    href={DISCORD_INVITE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
  >
    <DiscordIcon className="h-3.5 w-3.5" />
    <span className="text-sm">{t('actions.joinCommunity')}</span>
  </a>
</div>
```

- [ ] **Step 3: 移除移动端 Report Issue 菜单**

删除移动端 Report Issue 代码块（第 142-155 行）：

```jsx
// 删除以下代码
{/* Mobile Report Issue */}
<div className="px-3 pt-3 md:hidden">
  <a
    href={GITHUB_ISSUES_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-10 w-full items-center gap-3 rounded-xl bg-muted/40 px-3.5 transition-all hover:bg-muted/60 active:scale-[0.98]"
  >
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/80">
      <Bug className="h-4 w-4 text-muted-foreground" />
    </div>
    <span className="text-sm font-medium text-foreground">{t('actions.reportIssue')}</span>
  </a>
</div>
```

- [ ] **Step 4: 移除移动端 Join Community 菜单**

删除移动端 Discord 链接代码块（第 157-170 行）：

```jsx
// 删除以下代码
{/* Mobile Discord */}
<div className="px-3 pt-2 md:hidden">
  <a
    href={DISCORD_INVITE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-10 w-full items-center gap-3 rounded-xl bg-muted/40 px-3.5 transition-all hover:bg-muted/60 active:scale-[0.98]"
  >
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/80">
      <DiscordIcon className="h-4 w-4 text-muted-foreground" />
    </div>
    <span className="text-sm font-medium text-foreground">{t('actions.joinCommunity')}</span>
  </a>
</div>
```

- [ ] **Step 5: 清理未使用的变量和导入**

检查文件顶部，移除不再使用的常量和导入：

```javascript
// 可以移除的常量
const GITHUB_ISSUES_URL = 'https://github.com/siteboon/claudecodeui/issues/new';
const DISCORD_INVITE_URL = 'https://discord.gg/buxwujPNRE';

// 可以移除的导入
import { Settings, ArrowUpCircle, Bug } from 'lucide-react';
// 改为
import { Settings, ArrowUpCircle } from 'lucide-react';
```

- [ ] **Step 6: 测试菜单移除**

验证侧边栏底部只显示设置菜单：

```bash
npm run dev

# 在浏览器中检查：
# 1. 桌面端：侧边栏底部是否只有设置按钮
# 2. 移动端：侧边栏底部是否只有设置按钮
```

- [ ] **Step 7: 提交代码**

```bash
git add src/components/sidebar/view/subcomponents/SidebarFooter.tsx
git commit -m "feat: 移除 Report Issue 和 Join Community 菜单"
```

---

### Task 5: 整体测试和验证

**Files:**
- 无新增文件

**Interfaces:**
- Consumes: 所有修改的文件
- Produces: 完整的功能验证

- [ ] **Step 1: 启动应用并测试文件上传**

```bash
# 启动开发服务器
npm run dev

# 测试文件上传功能
# 1. 在聊天界面上传任意文件
# 2. 检查文件是否保存到 ~/upload/{projectId}/ 目录
# 3. 验证文件大小和内容是否正确
# 4. 检查前端显示是否正常
```

- [ ] **Step 2: 测试 UI 语言和主题**

```bash
# 在浏览器中验证
# 1. 刷新页面，检查语言是否为中文
# 2. 检查默认主题是否为亮色
# 3. 在设置中切换主题，验证切换功能正常
```

- [ ] **Step 3: 测试菜单移除**

```bash
# 在浏览器中验证
# 1. 检查侧边栏底部是否只有设置菜单
# 2. 验证桌面端和移动端显示一致
# 3. 点击设置按钮，验证设置功能正常
```

- [ ] **Step 4: 提交最终代码**

```bash
git add .
git commit -m "feat: 完成功能迭代 - 修复上传、固定中文亮色、移除菜单"
```

---

## 回滚方案

如果出现问题，按以下顺序回滚：

1. **回滚文件上传功能：**
```bash
git revert HEAD~1  # 回滚 Task 1 的提交
```

2. **回滚 UI 语言配置：**
```bash
git revert HEAD~1  # 回滚 Task 2 的提交
```

3. **回滚主题设置：**
```bash
git revert HEAD~1  # 回滚 Task 3 的提交
```

4. **回滚菜单移除：**
```bash
git revert HEAD~1  # 回滚 Task 4 的提交
```

## 注意事项

1. **备份现有文件**：在修改前备份 `server/index.js` 和 `src/i18n/config.js`
2. **测试环境**：先在开发环境测试，确认无误后再部署到生产环境
3. **用户通知**：如果影响现有用户，提前通知用户变更内容
4. **监控日志**：部署后监控服务器日志，确保文件上传功能正常