const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
// Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.prod.ts';
// Load node modules
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/environments/.env'
  });
// `environment.ts` file structure
  const envConfigFile = `export const environment = {
  SUPABASE_URL: '${process.env.SUPABASE_URL}',
  SUPABASE_API: '${process.env.SUPABASE_API}',
  production: true,
};
`;
console.log('The file `environment.ts` will be written with the following content:');
fs.readFile('.env', 'utf8', (err:any, data:any)=>console.log(data, "OJOJOJO"))
  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
  });
};

setEnv();