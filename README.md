

### 测试页 http://localhost:3000/generate

### 生成 http://localhost:3000/generateAction

### 单张图片测试页 http://localhost:3000/generateSingle

### 生成单图片文件并返回图片  http://localhost:3000/generateActionSingle

### 删除文件测试页 http://localhost:3000/delete

### 删除 http://localhost:3000/deleteAction

### 获取图片 http://localhost:3000/image/get/t2019-6-11-11-13-uuidf94db3b0-ccc8-4946-b18a-886decdd7c0f-v100-s400x700.png
### 获取后删除 http://localhost:3000/image/getanddelete/t2019-6-11-11-13-uuidf94db3b0-ccc8-4946-b18a-886decdd7c0f-v100-s400x700.png
### 图片列表 http://localhost:3000/image/list/t2019-6-11-11-13-uuidf94db3b0-ccc8-4946-b18a-886decdd7c0f-v100-s400x700.png
### 删除图片 http://localhost:3000/image/delete/t2019-6-11-11-13-uuidf94db3b0-ccc8-4946-b18a-886decdd7c0f-v100-s400x700.png



http://192.168.1.108:3000/delete



安装node

添加环境变量

https://www.cnblogs.com/toward-the-sun/p/8030238.html

npm install cnpm -g 安装npm镜像
npm install hotnode -g 开发时代替node命令，在代码改变时自动重启
npm install pm2 -g 布署代码时使用


cnpm install 安装项目依赖

安装字体

linux 系统下
管理员
在 /usr/share/fonts/  下新建 smartMark 文本夹

把字体放入其中

## 开发时启动项目
项目目录下运行
npm run start


## 使用pm2 启动项目
项目目录下动行
npm run pm2

pm2 list
pm2 start 0
pm2 stop 0
pm2 delete 0
pm2 monit
