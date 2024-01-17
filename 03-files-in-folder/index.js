import fs from 'fs/promises';
import path from 'path';

async function displayFileInfo(folderPath) {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      if (file.isFile() && file.name.includes('.')) {
        const fileStats = await fs.stat(filePath);

        const fileName = path.basename(file.name, path.extname(file.name));
        const fileExtension = path.extname(file.name).slice(1);

        const fileSizeInKB = (fileStats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSizeInKB}kb`);
      } else if (file.isDirectory()) {
        console.error(`${file.name} is a directory.`);
      }
    }
  } catch (error) {
    console.error('Error reading folder:', error);
  }
}

const folderPath = './03-files-in-folder/secret-folder';

displayFileInfo(folderPath);