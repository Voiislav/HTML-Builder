import fs from 'fs/promises';
import path from 'path';

async function copyDir(source, destination) {
  try {
    await fs.mkdir(destination, { recursive: true });

    const files = await fs.readdir(source);

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      const stats = await fs.stat(sourcePath);

      if (stats.isDirectory()) {
        await copyDir(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }

    console.log('Success!');
  } catch (error) {
    console.error('Error!', error);
  }
}

const sourceFolder = './04-copy-directory/files';
const destinationFolder = './04-copy-directory/files-copy';

copyDir(sourceFolder, destinationFolder);