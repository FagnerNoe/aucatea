import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../service/supabase";

interface AuthContextType {
    user: any;       // ou o tipo correto do usuário do Supabase
    loading: boolean;
    signOut: () => Promise<void>;

}


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => { mounted = false; subscription.unsubscribe(); };
    }, []);


    const getFullUser = async (baseUser: any) => {
        if (!baseUser) return null;

        const { data } = await supabase
            .from("clientes")
            .select("full_name")
            .eq("id", baseUser.id)
            .single();

        return data ? { ...baseUser, full_name: data.full_name } : baseUser;
    };



    useEffect(() => {
        // 1. Monitora mudanças de autenticação (mais confiável que getSession inicial sozinho)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth Event:", event);

            if (session?.user) {
                // Só libera o loading após tentar buscar o perfil completo
                const completeUser = await getFullUser(session.user);
                setUser(completeUser);
            } else {
                setUser(null);
            }

            setLoading(false); // Só desativa o loading aqui
        });

        return () => subscription.unsubscribe();
    }, []);

    // Função de logout
    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
    };




    return (
        <AuthContext.Provider value={{ user, loading, signOut }} >
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
