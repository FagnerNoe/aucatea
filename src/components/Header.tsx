
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Moon, Sun } from 'lucide-react';

export function Header() {
    const { signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                            <img src='/upcar-logo.png' className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-[Poppins] font-bold text-gray-900 dark:text-white">
                                UpCar
                            </h1>
                            <p className="text-xs font-[Poppins] text-gray-600 dark:text-gray-400">
                                Agendamento de Corridas
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Sun className="w-5 h-5 text-gray-300" />
                            )}
                        </button>

                        <button

                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                            <LogOut
                                onClick={signOut}
                                className="w-4 h-4" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
