# Task 3: 设置默认亮色主题

## 任务描述

修改 `src/main.jsx`，设置默认主题为亮色模式。

## 文件修改

- Modify: `src/main.jsx`

## 接口说明

- Consumes: localStorage, document.documentElement
- Produces: 默认亮色主题配置

## 详细步骤

### Step 1: 添加主题初始化代码

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

### Step 2: 验证主题设置

检查项目中是否有主题切换逻辑，确保与现有代码兼容：

```bash
# 搜索主题相关代码
grep -r "dark" src/ --include="*.tsx" --include="*.ts" | head -20
grep -r "theme" src/ --include="*.tsx" --include="*.ts" | head -20
```

### Step 3: 测试默认主题

刷新页面，验证：
1. 默认是否为亮色主题
2. 刷新后是否保持亮色主题

```bash
npm run dev
```

### Step 4: 提交代码

```bash
git add src/main.jsx
git commit -m "feat: 设置默认主题为亮色模式"
```

## 全局约束

- 默认主题为亮色模式
- 允许用户在设置中切换主题
- 与现有主题切换逻辑兼容