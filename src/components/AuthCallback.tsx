import { useEffect } from "react";
import { supabase } from "../service/supabase";

export default function AuthCallback() {
    useEffect(() => {
        const handleCallback = async () => {
            // Primeiro tenta recuperar sessão (OAuth já cria automaticamente)
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Erro ao recuperar sessão:", error.message);
            } else if (data?.session) {
                // Usuário autenticado (Google, GitHub etc.)
                window.location.href = "/dashboard";
                return;
            }

            // Se não houver sessão, tenta fluxo de e-mail/senha
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (exchangeError) {
                console.error("Erro ao confirmar email:", exchangeError.message);
            } else {
                window.location.href = "/dashboard";
            }
        };

        handleCallback();
    }, []);

    return <p>Processando autenticação...</p>;
}