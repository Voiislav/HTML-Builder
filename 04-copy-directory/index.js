import fs from 'fs/promises';
import path from 'path';

async function copyDir(source, destination) {
  let files;

  try {
    await fs.mkdir(destination, { recursive: true });

    files = await fs.readdir(source);

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

  try {
    const destinationFiles = await fs.readdir(destination);

    for (const destFile of destinationFiles) {
      const sourceFile = path.join(source, destFile);

      if (!files.includes(destFile)) {
        const destFilePath = path.join(destination, destFile);

        try {
          const sourceFileStats = await fs.stat(sourceFile);
          if (!sourceFileStats.isDirectory()) {
            await fs.unlink(destFilePath);
          }
        } catch (error) {
          await fs.unlink(destFilePath);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning destination:', error);
  }
}

const sourceFolder = './04-copy-directory/files';
const destinationFolder = './04-copy-directory/files-copy';

copyDir(sourceFolder, destinationFolder);

export default copyDir;