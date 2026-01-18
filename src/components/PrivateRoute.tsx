import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    // Enquanto estiver checando a sessão, NÃO MOSTRA NADA ou mostra um Spinner
    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    // Se parou de carregar e NÃO tem usuário, redireciona.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // SÓ chega aqui se loading = false E user existe.
    return children;
}