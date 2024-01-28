console.log(process);
export const environment = {
  production: true,
  supabaseUrl: process.env.SUPABASE_URL as string,
  supabaseApi: process.env.SUPABASE_API as string,
};