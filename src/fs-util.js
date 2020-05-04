import fs from 'fs';
import path from 'path';

async function createBaseDirs(filePath) {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export {
  createBaseDirs
}