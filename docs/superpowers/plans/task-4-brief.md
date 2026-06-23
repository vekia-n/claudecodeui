# Task 4: 移除 Report Issue 和 Join Community 菜单

## 任务描述

修改 `src/components/sidebar/view/subcomponents/SidebarFooter.tsx`，移除 Report Issue 和 Join Community 菜单项。

## 文件修改

- Modify: `src/components/sidebar/view/subcomponents/SidebarFooter.tsx:92-170`

## 接口说明

- Consumes: React 组件, i18next 翻译函数
- Produces: 简化的侧边栏底部菜单

## 详细步骤

### Step 1: 移除桌面端 Report Issue 菜单

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

### Step 2: 移除桌面端 Join Community 菜单

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

### Step 3: 移除移动端 Report Issue 菜单

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

### Step 4: 移除移动端 Join Community 菜单

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

### Step 5: 清理未使用的变量和导入

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

### Step 6: 测试菜单移除

验证侧边栏底部只显示设置菜单：

```bash
npm run dev

# 在浏览器中检查：
# 1. 桌面端：侧边栏底部是否只有设置按钮
# 2. 移动端：侧边栏底部是否只有设置按钮
```

### Step 7: 提交代码

```bash
git add src/components/sidebar/view/subcomponents/SidebarFooter.tsx
git commit -m "feat: 移除 Report Issue 和 Join Community 菜单"
```

## 全局约束

- 移除 Report Issue 和 Join Community 菜单
- 保留设置菜单
- 桌面端和移动端都要移除
- 清理未使用的代码