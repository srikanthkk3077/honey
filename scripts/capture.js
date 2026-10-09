import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

if (!fs.existsSync('scratch')) {
  fs.mkdirSync('scratch', { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outPath = path.resolve('scratch', 'hero_test.png');

console.log('Capturing to:', outPath);
execSync(`"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=4000 --window-size=1440,820 "--screenshot=${outPath}" http://localhost:5173/`, { stdio: 'inherit' });

console.log('Exists:', fs.existsSync(outPath));
