import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const testing = process.env.REACT_APP_TEST;
console.log(testing);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
