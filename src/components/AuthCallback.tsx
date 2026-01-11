import { useEffect } from "react";
import { supabase } from "./../service/supabase";

export default function AuthCallback() {
    useEffect(() => {
        const handleCallback = async () => {
            // Finaliza a confirmação de e-mail trocando o código pelo token de sessão
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

            if (error) {
                console.error("Erro ao confirmar email:", error.message);
            } else {
                // Agora o email_confirmed_at foi atualizado em auth.users
                // Redireciona para a tela de login
                window.location.href = "/login";
            }
        };

        handleCallback();
    }, []);

    return (
        <><p>Email Confirmado com sucesso!</p>
            <div>Redirecionando para a tela de login...</div></>
    );

}