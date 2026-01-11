import { useEffect, useState } from 'react';
import { supabase } from '../service/supabase';
import { useAuth } from '../context/AuthContext';
import type { Database } from '../types/database.types';
import { MapPin, Calendar, Clock, Trash2, CheckCircle, XCircle } from 'lucide-react';

type Ride = Database['public']['Tables']['rides']['Row'];

export function RidesList() {
    const { user } = useAuth();
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRides = async () => {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('rides')
            .select('*')
            .eq('user_id', user.id)
            .order('scheduled_time', { ascending: false });

        if (!error && data) {
            setRides(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRides();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja cancelar esta corrida?')) return;

        const { error } = await supabase
            .from('rides')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchRides();
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            in_progress: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
            cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800',
        };

        const labels = {
            pending: 'Pendente',
            confirmed: 'Confirmada',
            in_progress: 'Em Andamento',
            completed: 'Concluída',
            cancelled: 'Cancelada',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (rides.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma corrida agendada
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Agende sua primeira corrida usando o formulário acima
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Minhas Corridas
            </h2>

            {rides.map((ride) => (
                <div
                    key={ride.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {ride.passenger_name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {ride.passenger_phone}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(ride.status)}
                            {ride.status === 'pending' && (
                                <button
                                    onClick={() => handleDelete(ride.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Cancelar corrida"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Partida</p>
                                <p className="text-gray-900 dark:text-white">{ride.pickup_address}</p>
                                {ride.pickup_details && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{ride.pickup_details}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Destino</p>
                                <p className="text-gray-900 dark:text-white">{ride.destination_address}</p>
                                {ride.destination_details && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{ride.destination_details}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(ride.scheduled_time)}
                            </p>
                        </div>

                        {ride.notes && (
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{ride.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
