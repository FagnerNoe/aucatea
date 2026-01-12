import { useEffect } from "react";
import { supabase } from "../service/supabase";

export default function AuthCallback() {



    useEffect(() => {

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const codeVerifier = localStorage.getItem('supabase.auth.code_verifier');

        if (!code || !codeVerifier) {
            throw new Error('auth code and code verifier are required')
        }
        console.log("Code:", url.searchParams.get("code"));
        console.log("Code Verifier:", localStorage.getItem("supabase.auth.code_verifier"));


        const handleCallback = async () => {

            // Tenta trocar código por sessão (fluxo de e-mail/senha)
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

            if (error) {
                console.error("Erro ao confirmar:", error.message);
            }

            // Depois verifica se a sessão existe (OAuth ou e-mail confirmado)
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
                window.location.href = "/dashboard";
            } else {
                console.error("Nenhuma sessão encontrada");
            }
        };

        handleCallback();
    }, []);

    return <p>Processando autenticação...</p>;
}