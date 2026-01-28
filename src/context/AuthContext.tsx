import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../service/supabase";

interface AuthContextType {
    user: any; // Você pode substituir 'any' pelo seu tipo de Usuário (ex: User | null)
    session: any; // Você pode substituir 'any' pelo seu tipo de Sessão
    loading: boolean;
    signOut: () => Promise<void>;
}

// 2. Crie o contexto com o tipo definido
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);


    // Função única para buscar perfil completo
    const getFullUser = async (baseUser: any) => {
        if (!baseUser) return null;
        try {
            const { data } = await supabase
                .from("clientes")
                .select("full_name")
                .eq("id", baseUser.id)
                .single();
            return data ? { ...baseUser, full_name: data.full_name } : baseUser;
        } catch (e) {
            return baseUser;
        }
    };

    useEffect(() => {
        let mounted = true;

        // 1. Inicialização única
        const initialize = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (mounted) {
                if (session?.user) {
                    const completeUser = await getFullUser(session.user);
                    setUser(completeUser);
                    setSession(session);
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        };

        initialize();

        // 2. Listener de eventos (Lida com login, logout e refresh de token)
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("⚡ Auth Event:", event);

            if (mounted) {
                if (session?.user) {
                    const completeUser = await getFullUser(session.user);
                    setUser(completeUser);
                    setSession(session);
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        });

        // 3. Listener de visibilidade (Resolve o problema de "parar de carregar" ao voltar)
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                // Apenas verifica se a sessão ainda é válida, o onAuthStateChange fará o resto
                const { data: { session } } = await supabase.auth.getSession();
                if (!session && user) {
                    // Se a sessão caiu enquanto estava fora
                    setUser(null);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            listener?.subscription.unsubscribe();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []); // Apenas um useEffect resolve tudo

    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
}