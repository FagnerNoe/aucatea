import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey,{
    auth: {
        persistSession:true,
        storage: sessionStorage, // faz com que sessao seja apagada automaticamente  ao fechar a aba ou navegador 
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
});