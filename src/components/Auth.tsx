import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { supabase } from '../service/supabase';
import { useNavigate } from 'react-router-dom';

export function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useAuth();




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Redireciona para dashboard sem recarregar a página
                navigate('/dashboard');

            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                alert('Verifique seu e-mail para confirmar a conta.');

                // Redireciona para login
                navigate('/login');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro');
        } finally {
            setLoading(false);
        }
    };

    async function signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/auth/callback",
            },
        });

        if (error) {
            console.error("Erro ao logar com Google:", error.message);
        }
    }


    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-yellow-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-40 h-35 rounded-full mb-4">
                            {isLogin ? <img src='upcar-logo.png' className="w-36 h-30 text-white" /> : <UserPlus className="w-15 h-15 text-yellow-600 border-3 rounded-full px-2" />}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {isLogin ? 'Bem-vindo!' : 'Criar Conta'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isLogin ? 'Entre para agendar suas corridas' : 'Cadastre-se para começar'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        placeholder="Seu nome completo"
                                        required={!isLogin}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        placeholder="(11) 99999-9999"
                                        required={!isLogin}
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-yellow-400 to-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-yellow-600 dark:text-yellow-400 hover:underline text-sm"
                        >
                            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                        </button>


                        <button onClick={signInWithGoogle}
                            className='bg-white  border-amber-400 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 mt-4 w-full flex items-center justify-center gap-2 border  dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-colors'>
                            Entrar com Google
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
