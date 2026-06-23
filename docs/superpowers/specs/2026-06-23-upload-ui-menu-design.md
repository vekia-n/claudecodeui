# 功能迭代设计文档

## 概述

本次迭代包含三个主要功能改进：
1. 修复文件上传功能，将上传目录固定到 ~/upload/
2. 固定 UI 为中文，亮色配色
3. 移除 Report Issue 和 Join Community 菜单

## 1. 文件上传功能修复

### 问题描述

当前文件上传功能存在以下问题：
- 上传的文件显示为乱码
- 文件大小显示为 0b
- 上传目录不固定，使用系统临时目录

### 解决方案

修改 `server/index.js` 中的 `uploadFilesHandler` 函数：

**目录结构：**
```
~/upload/
├── {projectId1}/
│   ├── file1.pdf
│   ├── file2.doc
│   └── ...
├── {projectId2}/
│   └── ...
└── ...
```

**主要修改点：**

1. **修改上传目录**：将 `os.tmpdir()` 改为 `~/upload/{projectId}/`
2. **确保目录存在**：在保存文件前创建目录
3. **正确写入文件内容**：使用 `fsPromises.copyFile` 确保文件内容完整
4. **返回完整路径**：返回文件的完整路径供前端显示

**代码修改位置：**
- 文件：`server/index.js`
- 函数：`uploadFilesHandler`（第 886-1051 行）

**关键代码变更：**
```javascript
// 修改前
destination: (req, file, cb) => {
    cb(null, os.tmpdir());
},

// 修改后
destination: async (req, file, cb) => {
    const { projectId } = req.params;
    const uploadDir = path.join(os.homedir(), 'upload', projectId);
    await fsPromises.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
},
```

## 2. UI 语言和配色固定

### 需求描述

- 固定 UI 语言为中文（zh-CN）
- 默认使用亮色主题
- 允许用户在设置中切换主题

### 解决方案

修改 `src/i18n/config.js` 文件：

**主要修改点：**

1. **固定默认语言**：将 `getSavedLanguage()` 函数的返回值固定为 `'zh-CN'`
2. **禁用语言检测**：在 i18n 配置中禁用 `LanguageDetector`，直接使用固定语言
3. **设置默认主题**：在 localStorage 中设置默认主题为亮色模式

**代码修改位置：**
- 文件：`src/i18n/config.js`
- 函数：`getSavedLanguage`（第 100-111 行）
- 配置：`i18n.init`（第 117-246 行）

**关键代码变更：**
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

**主题设置：**
在应用初始化时，检查 localStorage 中是否有主题偏好，如果没有则设置为亮色模式：
```javascript
// 在 src/main.jsx 或 src/App.tsx 中添加
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light');
  document.documentElement.classList.remove('dark');
}
```

## 3. 移除指定菜单项

### 需求描述

移除侧边栏底部的以下菜单项：
- Report Issue（报告问题）
- Join Community（加入社区）

### 解决方案

修改 `src/components/sidebar/view/subcomponents/SidebarFooter.tsx` 文件：

**主要修改点：**

1. **移除桌面端菜单项**：删除第 92-115 行的 Report Issue 和 Discord 链接
2. **移除移动端菜单项**：删除第 142-170 行的移动端 Report Issue 和 Discord 链接
3. **保留设置菜单**：保留 Settings 菜单项

**代码修改位置：**
- 文件：`src/components/sidebar/view/subcomponents/SidebarFooter.tsx`
- 桌面端菜单：第 92-115 行
- 移动端菜单：第 142-170 行

**关键代码变更：**

删除以下代码块：
```jsx
{/* Desktop Report Issue */}
<div className="hidden px-2 pt-1.5 md:block">
  <a href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer" ...>
    <Bug className="h-3.5 w-3.5" />
    <span className="text-sm">{t('actions.reportIssue')}</span>
  </a>
</div>

{/* Desktop Discord */}
<div className="hidden px-2 md:block">
  <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" ...>
    <DiscordIcon className="h-3.5 w-3.5" />
    <span className="text-sm">{t('actions.joinCommunity')}</span>
  </a>
</div>
```

同时删除对应的移动端代码块。

## 实施顺序

1. **第一步**：修复文件上传功能（后端修改）
2. **第二步**：固定 UI 语言和配色（前端配置修改）
3. **第三步**：移除指定菜单项（前端组件修改）

## 测试验证

### 文件上传测试

1. 上传任意文件，检查是否保存到 `~/upload/{projectId}/` 目录
2. 验证文件内容是否完整，大小是否正确
3. 检查前端显示是否正常，无乱码

### UI 测试

1. 刷新页面，验证语言是否固定为中文
2. 验证默认主题是否为亮色模式
3. 在设置中切换主题，验证切换功能是否正常

### 菜单测试

1. 检查侧边栏底部是否只剩设置菜单
2. 验证桌面端和移动端显示一致

## 风险评估

- **低风险**：移除菜单项是纯前端修改，不影响核心功能
- **中风险**：修改上传目录可能影响现有已上传文件的访问
- **低风险**：固定语言和主题是配置修改，易于回滚

## 回滚方案

如果出现问题，可以通过以下方式回滚：

1. 文件上传：恢复 `server/index.js` 中的原始上传目录配置
2. UI 配置：恢复 `src/i18n/config.js` 中的语言检测逻辑
3. 菜单项：恢复 `SidebarFooter.tsx` 中删除的代码块