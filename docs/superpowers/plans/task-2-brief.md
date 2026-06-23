# Task 2: 固定UI语言为中文

## 任务描述

修改 `src/i18n/config.js`，将默认语言固定为 `zh-CN`。

## 文件修改

- Modify: `src/i18n/config.js:100-111`

## 接口说明

- Consumes: i18next, localStorage
- Produces: 固定的语言配置

## 详细步骤

### Step 1: 修改语言检测函数

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

### Step 2: 修改 i18n 初始化配置

找到 i18n.init 配置（第 117 行），修改 lng 配置：

```javascript
// 修改前
lng: getSavedLanguage(),

// 修改后 - 直接固定语言
lng: 'zh-CN',
```

### Step 3: 禁用语言检测器

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

### Step 4: 测试语言固定

刷新页面，验证：
1. UI 是否显示为中文
2. 语言切换功能是否被禁用（可选）

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问应用，检查语言是否为中文
```

### Step 5: 提交代码

```bash
git add src/i18n/config.js
git commit -m "feat: 固定UI语言为中文 (zh-CN)"
```

## 全局约束

- UI语言固定为 `zh-CN`
- 禁用语言检测器
- 保留语言资源文件（不删除其他语言的翻译）