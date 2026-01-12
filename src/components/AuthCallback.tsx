import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {

        const handleCallback = async () => {
            // troca o código da URL por sessão
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

            if (error) {
                console.error("Erro ao confirmar:", error.message);
                navigate("/login"); // volta pro login se falhar
                return;
            }

            // não precisa checar data.session aqui
            // o AuthProvider vai atualizar user automaticamente
            navigate("/dashboard");

        };

        handleCallback();
    }, [navigate]);

    return <p>Processando autenticação...</p>;
}