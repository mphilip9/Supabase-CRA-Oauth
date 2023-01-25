const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const test = process.env.REACT_APP_PASSWORD_REDIRECT;
console.log(test);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
