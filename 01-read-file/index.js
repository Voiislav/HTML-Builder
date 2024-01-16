import fs from 'fs';
import path from 'path';

const filePath = path.join(new URL('.', import.meta.url).pathname, 'text.txt');

const readStream = fs.createReadStream(filePath);

readStream.pipe(process.stdout);
