const fe = require('fs-extra');
const { resolve } = require('path');

const root = resolve(process.cwd(), 'build/app.content');
const htmlDir = resolve(root, 'src/app/pages');
const htmlFiles = fe.readdirSync(htmlDir);
if (htmlFiles && htmlFiles.length) {
  for (const file of htmlFiles) {
    fe.copyFileSync(resolve(htmlDir, file), resolve(root, file));
  }
}
fe.rmSync(resolve(root, 'src'), { recursive: true });
