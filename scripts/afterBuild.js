const fe = require('fs-extra');
const { resolve } = require('path');

// 将html入口文件迁移至顶层目录
const root = resolve(process.cwd(), 'build/app.content');
const htmlDir = resolve(root, 'src/app/pages');
const htmlFileName = fe.readdirSync(htmlDir);
if (htmlFileName && htmlFileName.length) {
  for (const fileName of htmlFileName) {
    fe.copyFileSync(resolve(htmlDir, fileName, 'index.html'), resolve(root, `${fileName}.html`));
  }
}
fe.rmSync(resolve(root, 'src'), { recursive: true });
