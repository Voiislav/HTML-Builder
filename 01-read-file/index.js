import fs from 'fs';
import path from 'path';

const filePath = path.join('./01-read-file', 'text.txt');

const readStream = fs.createReadStream(filePath);

readStream.pipe(process.stdout);
