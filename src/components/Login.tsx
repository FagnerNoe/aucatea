import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useStyle } from '../context/StyleContext';

export function Auth() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, session, loadingSession } = useAuth();
    const { cores } = useStyle();



    useEffect(() => {
        if (!loadingSession && session) {
            navigate("/painel");
        }
    }, [loadingSession, session]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro');
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="h-screen  bg-linear-to-t from-white to-gray-200 flex items-center justify-start">

            <div className="absolute inset-0 h-screen  max-w-5xl bg-cover bg-center  "
                style={{ backgroundImage: "url('/aucatea_capa.jpg')" }}>
                <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/20"></div>
            </div>


            <h1 className="border-t w-[90%] py-2 absolute top-12 left-5 text-white sm:w-sm sm:left-55  lg:w-lg lg:text-4xl lg:top-60 lg:left-50
            text-2xl z-10 font-[Style_Script,cursive] text-center  fade-down">
                Associação Candidomotense de Apoio a Pessoas com Transtorno do Espectro Autista
            </h1>


            <div className="relative z-10 w-[90%] max-w-md mx-auto sm:mx-[28%] lg:mx-[60%]  ">
                <div className="bg-white rounded-2xl shadow-xl shadow-black p-6 z-50 sm:w-sm sm-150  lg:w-sm ">
                    <div className=" mb-8 flex flex-col justify-center items-center">
                        <div className="inline-flex items-center justify-center w-40 h-35  ml-5 ">
                            <img src='logo_aucatea.png' className="w-35 h-42 text-white" />
                        </div>
                        <img src='nome_aucatea.png' className='w-35 h-18 mx-auto ' />
                        <p className="text-gray-500  font-medium mt-2 text-sm font-[Poppins] ">
                            Cadastros
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700  mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300  bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700  mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 00 bg-white ext-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50  border border-red-200 0 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-[Poppins] ${cores.gradientBlue} hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? 'Carregando...' : 'Entrar'}
                        </button>
                    </form>



                </div>
            </div >
        </div >
    );
}
