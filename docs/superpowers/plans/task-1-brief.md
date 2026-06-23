# Task 1: 修复文件上传功能 - 后端修改

## 任务描述

修改 `server/index.js` 中的 `uploadFilesHandler` 函数，将文件保存到 `~/upload/{projectId}/` 目录下，确保文件内容正确写入，解决乱码和0b大小问题。

## 文件修改

- Modify: `server/index.js:886-1051`

## 接口说明

- Consumes: multer 中间件, fsPromises, path, os 模块
- Produces: 修复后的文件上传API，返回正确的文件路径和大小

## 详细步骤

### Step 1: 修改上传目录配置

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

### Step 2: 修改文件名生成逻辑

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

### Step 3: 修改文件移动逻辑

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

### Step 4: 修改返回的文件路径

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

### Step 5: 测试文件上传

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

### Step 6: 提交代码

```bash
git add server/index.js
git commit -m "fix: 修复文件上传功能，固定上传目录到 ~/upload/{projectId}/"
```

## 全局约束

- 上传目录固定为 `~/upload/{projectId}/`
- 文件内容必须正确写入，不能是0字节
- 返回的路径应该相对于 upload 目录