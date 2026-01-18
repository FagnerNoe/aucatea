import { useState } from 'react';
import { Header } from './Header';
import { BookRideForm } from './FormCorrida';
import { RidesList } from './ListaCorridas';
import { Plus, List, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
    const [activeTab, setActiveTab] = useState<'book' | 'list'>('book');
    const [refreshKey, setRefreshKey] = useState(0);
    const { user } = useAuth();

    const handleBookingSuccess = () => {
        setRefreshKey(prev => prev + 1);
        setActiveTab('list');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
            <Header />

            <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user ? (
                    <>
                        <div className="flex items-center justify-end mb-6">
                            <p className='text-gray-600 dark:text-gray-400'>Olá, <span className='font-[Poppins] font-medium dark:text-white'>{user?.full_name?.split(' ')[0]}
                            </span></p>
                            <div className='bg-amber-500 rounded-full w-10 h-10 ml-2 p-2'><User className="w-6 h-6 text-white" /></div>
                        </div>
                    </>
                ) : (<h2></h2>)}

                <div className="mb-6">
                    <h2 className='bg-clip-text bg-linear-to-r from-yellow-400 to-yellow-700 text-transparent  font-[Poppins] mb-5 text-center'>Pronto para sua próxima corrida?</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('book')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'book'
                                ? 'bg-linear-to-r from-yellow-500 to-yellow-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Plus className="w-5 h-5" />
                            Nova Corrida
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'list'
                                ? 'bg-linear-to-r from-yellow-500 to-yellow-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <List className="w-5 h-5" />
                            Minhas Corridas
                        </button>
                    </div>
                </div>

                <div className="animate-fadeIn">
                    {activeTab === 'book' ? (
                        <div>
                            <h2 className="text-2xl font-[Poppins] font-bold text-gray-900 dark:text-white mb-6">
                                Agendar Nova Corrida
                            </h2>
                            <BookRideForm onSuccess={handleBookingSuccess} />
                        </div>
                    ) : (
                        <div key={refreshKey}>
                            <RidesList />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
