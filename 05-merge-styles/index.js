import fs from 'fs/promises';
import path from 'path';

async function mergeStyles() {
  try {
    const stylesFolderPath = './05-merge-styles/styles';
    const projectDistPath = './05-merge-styles/project-dist';
    const bundleFilePath = path.join(projectDistPath, 'bundle.css');

    await fs.mkdir(projectDistPath, { recursive: true });

    const files = await fs.readdir(stylesFolderPath);

    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const stylesArray = [];

    for (const cssFile of cssFiles) {
      const filePath = path.join(stylesFolderPath, cssFile);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      stylesArray.push(fileContent);
    }

    await fs.writeFile(bundleFilePath, stylesArray.join('\n'));

    console.log('Styles successfully merged into bundle.css');
  } catch (error) {
    console.error('Error merging styles:', error);
  }
}

mergeStyles();
