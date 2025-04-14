import path, {dirname} from 'path';
import fsPromises from 'fs/promises';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootFolderPath = `${path.resolve(__dirname)}/../`;

/**
 * Creates a .npmrc, which is required for private npm repository, file at root of directory.
 * @returns void
 */
const createNpmRcFile = async() => {
  const envVariables = await getEnvVariables();
  if (!envVariables.APPLICATION_ENVIRONMENT_LABEL?.toLowerCase().includes('local')) {
    return;
  }
  if (!envVariables.GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN not found. If running in local dev, shared private npm packages may not work.');
    return;
  }
  await fsPromises.writeFile(`${rootFolderPath}.npmrc`, `@usepa:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${envVariables.GITHUB_TOKEN}`);
};

/**
 * Reads .env file and converts to object.
 * @returns object of .env variables.
 */
const getEnvVariables = async() => {
  const envFile = `${rootFolderPath}.env`;

  await fsPromises.access(envFile);

  const fileData = await fsPromises.readFile(envFile, {
    encoding: 'utf8',
  });

  return fileData.split('\n').filter(variable => variable.length).map(variable => variable.trim()).reduce((acc, cv) => {
    const key = cv.split('=')[0]?.substring(0).trim();
    const value = cv.split('=')[1]?.trim();
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const setupDev = async() => {
  await createNpmRcFile();
};

(async() => {
  await setupDev();
})();
