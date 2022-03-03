const path = require('path');
const fs = require('fs-extra');
const dir = `${path.join(__dirname, '../build/output')}`;
fs.removeSync(dir);
