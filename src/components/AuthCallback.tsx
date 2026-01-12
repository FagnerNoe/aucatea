import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {

        const handleCallback = async () => {
            // troca o código da URL por sessão
            const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

            if (error) {
                console.error("Erro ao confirmar:", error.message);
                navigate("/login"); // volta pro login se falhar
                return;
            }

            // se a sessão foi criada, redireciona
            if (data?.session) {
                console.log("Sessão criada:", data.session);
                navigate("/dashboard");
            } else {
                console.error("Nenhuma sessão encontrada");
                navigate("/login");
            }
        };

        handleCallback();
    }, [navigate]);

    return <p>Processando autenticação...</p>;
}