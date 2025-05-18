(() => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  const targetPath = './src/environments/environment.prod.ts';

  require('dotenv').config({
    path: 'src/environments/.env',
  });

  const envConfigFile = `export const environment = {
    SUPABASE_URL: '${process.env.SUPABASE_URL}',
    SUPABASE_API: '${process.env.SUPABASE_API}',
    production: true,
  };`;

  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    }
  });
})();