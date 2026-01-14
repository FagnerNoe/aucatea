import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // O Supabase detecta automaticamente o 'code' na URL
                // e o 'code_verifier' no storage local.
                const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

                if (error) {
                    console.error("Erro na troca de código:", error.message);
                    navigate("/login"); // Redireciona de volta em caso de erro
                    return;
                }

                // Sucesso!
                navigate("/dashboard");
            } catch (err) {
                console.error("Erro inesperado:", err);
                navigate("/login");
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <p>Processando autenticação... Por favor, aguarde.</p>
        </div>
    );
}