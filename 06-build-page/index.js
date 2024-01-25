import { promises as fs } from 'fs';
import path from 'path';

async function mergeStylesAsync(stylesFolderPath, stylesDistPath) {
  try {
    const stylesArray = await fs.readdir(stylesFolderPath);
    const stylesContent = await Promise.all(
      stylesArray.map(async (cssFile) => {
        const filePath = path.join(stylesFolderPath, cssFile);
        return await fs.readFile(filePath, 'utf-8');
      })
    );
    await fs.writeFile(stylesDistPath, stylesContent.join('\n'));
    console.log('Styles successfully merged into style.css');
  } catch (error) {
    throw new Error(`Error merging styles: ${error.message}`);
  }
}

async function buildPage() {
  try {
    const distDir = path.join('./06-build-page', 'project-dist');
    await fs.mkdir(distDir, { recursive: true });

    const scriptDirRelative = '06-build-page';
    const scriptDir = path.resolve(process.cwd(), scriptDirRelative);
    const templatePath = path.resolve(scriptDir, 'template.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    const tags = templateContent.match(/\{\{(.+?)\}\}/g);

    let modifiedContent = templateContent;
    if (tags) {
      for (const tag of tags) {
        const componentName = tag.slice(2, -2);
        const componentPath = path.join(scriptDir, 'components', `${componentName}.html`);
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        modifiedContent = modifiedContent.replace(tag, componentContent);
      }
    }

    const indexPath = path.join(distDir, 'index.html');
    await fs.writeFile(indexPath, modifiedContent);
    console.log('index.html successfully created');

    const stylesFolderPath = path.join(scriptDir, 'styles');
    const stylesDistPath = path.join(distDir, 'style.css');
    await mergeStylesAsync(stylesFolderPath, stylesDistPath);

    const assetsDirRelative = '06-build-page/assets';
    const assetsDir = path.join(process.cwd(), assetsDirRelative);
    const assetsExist = await fs.access(assetsDir).then(() => true).catch(() => false);

    if (assetsExist) {
      const copyDirectoryScriptPath = path.join(scriptDir, '..', '04-copy-directory', 'index.js');
      const { default: copyDirectory } = await import(copyDirectoryScriptPath);
      await copyDirectory(assetsDirRelative, path.join(distDir, 'assets'));
      console.log('Assets successfully copied');
    } else {
      console.error(`Error! Directory "${assetsDirRelative}" does not exist at path: ${assetsDir}`);
    }
  } catch (error) {
    console.error('Error building the page:', error);
  }
}

buildPage();
