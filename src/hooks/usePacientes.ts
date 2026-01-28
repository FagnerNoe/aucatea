import { useCallback, useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import { useAuth } from "../context/AuthContext";

export function useRides(refreshKey: number) {
    const { user, loading: authLoading } = useAuth();
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRides = useCallback(async (forcedUserId?: string) => {
        // Usa o ID passado ou o ID do contexto
        const idToUse = forcedUserId || user?.id;
        
        if (!idToUse) {
            console.log("⚠️ Sem ID de usuário para buscar corridas");
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('corridas')
                .select('*')
                .eq('user_id', idToUse)
                .order('data_criacao', { ascending: false });

            if (error) throw error;

            // Só atualiza se houver dados, para não limpar a tela com erro
            if (data) setRides(data);
            
        } catch (err) {
            console.error("Erro na busca:", err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        // Se o AuthContext confirmou o usuário, busca os dados
        if (user?.id) {
            fetchRides();
        }

        const handleFocus = () => {
            if (document.visibilityState === 'visible') {
                // Ao voltar para a aba, pedimos a sessão direto ao Supabase
                // ignorando o estado possivelmente atrasado do Contexto
                supabase.auth.getSession().then(({ data }) => {
                    if (data.session?.user) {
                        fetchRides(data.session.user.id);
                    }
                });
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user?.id, refreshKey, fetchRides]);

    return { rides, loading: loading || authLoading };
}