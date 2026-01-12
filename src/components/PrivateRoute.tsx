import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Carregando...</p>;
    }

    // se não houver usuário logado, redireciona para login
    if (!user) {
        console.log("PrivateRoute → sem usuário, redirecionando para /login");

        return <Navigate to="/login" replace />;
    }

    // se houver usuário, renderiza o conteúdo protegido
    return children;
}