import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

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
                navigate("/login");
                return;
            }

            // O AuthProvider vai atualizar user automaticamente
            navigate("/dashboard");

        }

        handleCallback();
    }, [navigate]);

    return <p>Processando autenticação...</p>;
}