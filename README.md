# HIS微前端子应用

## 基础组件

- 乾坤
- 若依plus微前端

## 编译参数

```bash
pnpm store prune
rm -rf node_modules
rm -rf pnpm-lock.yaml
pnpm i
# 编译
rm -rf dist && rm -f dist.tar.gz && pnpm build && tar -czf dist.tar.gz dist
```

## 升级服务器

```bash
# 部署drg测试虚拟机， 合并部署脚本：传输文件并在服务器端执行解压和替换操作
scp ./dist.tar.gz db12_drg:/var/www/ && ssh db12_drg "cd /var/www && tar -xzf dist.tar.gz && rm -rf poct-8105-his && mv dist poct-8105-his && echo '部署成功完成。'"
```
