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
        // Recupera sessão inicial
        supabase.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user ?? null);
            setLoading(false);
        });

        // Escuta mudanças de autenticação
        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription?.subscription.unsubscribe();
    }, []);

    // Função de logout
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from("clientes")
                .select("full_name") // ajuste para o campo real
                .eq("id", user.id) // supondo que você tenha esse relacionamento
                .single();

            if (error) {
                console.error("Erro ao buscar cliente:", error.message);
                return;
            }

            if (data) {
                setUser({
                    ...user,
                    fullName: data.full_name
                });
            }
        };

        fetchUserData();
    }, [user]);


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
