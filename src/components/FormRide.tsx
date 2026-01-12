import { useState } from 'react';
import { supabase } from '../service/supabase';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, FileText } from 'lucide-react';

interface BookRideFormProps {
    onSuccess: () => void;
}

export function BookRideForm({ onSuccess }: BookRideFormProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        passengerName: '',
        passengerPhone: '',
        pickupAddress: '',
        pickupDetails: '',
        destinationAddress: '',
        destinationDetails: '',
        scheduledTime: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!user) throw new Error('Usuário não autenticado');

            const { error: insertError } = await supabase
                .from('corridas')
                .insert({
                    user_id: user.id,
                    passenger_name: formData.passengerName,
                    passenger_phone: formData.passengerPhone,
                    pickup_address: formData.pickupAddress,
                    pickup_details: formData.pickupDetails,
                    destination_address: formData.destinationAddress,
                    destination_details: formData.destinationDetails,
                    scheduled_time: formData.scheduledTime,
                    notes: formData.notes,
                    status: 'pending',
                });

            if (insertError) throw insertError;

            setFormData({
                passengerName: '',
                passengerPhone: '',
                pickupAddress: '',
                pickupDetails: '',
                destinationAddress: '',
                destinationDetails: '',
                scheduledTime: '',
                notes: '',
            });

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao agendar corrida');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">



            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-lg  font-[Poppins] font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5  text-yellow-600" />
                    Local de Partida
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Endereço de Partida
                        </label>
                        <input
                            type="text"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Rua, número, bairro, cidade"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Complemento (opcional)
                        </label>
                        <input
                            type="text"
                            name="pickupDetails"
                            value={formData.pickupDetails}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Apartamento, bloco, ponto de referência"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-[Poppins] font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5  text-yellow-600" />
                    Destino
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Endereço de Destino
                        </label>
                        <input
                            type="text"
                            name="destinationAddress"
                            value={formData.destinationAddress}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Rua, número, bairro, cidade"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Complemento (opcional)
                        </label>
                        <input
                            type="text"
                            name="destinationDetails"
                            value={formData.destinationDetails}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Apartamento, bloco, ponto de referência"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-[Poppins] font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                    Agendamento
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data e Hora
                        </label>
                        <input
                            type="datetime-local"
                            name="scheduledTime"
                            value={formData.scheduledTime}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Observações (opcional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                            placeholder="Alguma informação adicional sobre a corrida..."
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
                {loading ? 'Agendando...' : 'Agendar Corrida'}
            </button>
        </form>
    );
}
