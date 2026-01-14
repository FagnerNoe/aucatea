import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando sua conta...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Tenta validar o código recebido na URL
                const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

                if (error) throw error;

                // Sucesso
                setStatus('success');
                setMessage('Autenticação confirmada! Preparando seu painel...');

                // Delay para garantir que o AuthContext sincronize os dados do banco
                setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                }, 3500);

            } catch (error: any) {
                console.error("Erro no callback:", error.message);
                setStatus('error');
                setMessage(error.message || 'Não foi possível completar a autenticação.');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center transition-all">

                {/* Ícone de Carregamento (Spinner) */}
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-700 font-sans">Processando...</h2>
                    </div>
                )}

                {/* Ícone de Sucesso */}
                {status === 'success' && (
                    <div className="flex flex-col items-center animate-bounce">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 font-sans">Sucesso!</h2>
                    </div>
                )}

                {/* Ícone de Erro */}
                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 font-sans">Falha na Autenticação</h2>
                    </div>
                )}

                <p className="mt-4 text-gray-600 text-lg">
                    {message}
                </p>

                {/* Botão de Retorno (Apenas em erro) */}
                {status === 'error' && (
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors"
                    >
                        Voltar para o Login
                    </button>
                )}
            </div>
        </div>
    );
}