import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export function PublicRoute({ children }: { children: JSX.Element }) {
    const { session, loadingSession } = useAuth();

    if (loadingSession) {
        return <div>
            <div className="flex items-center justify-center h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-red-500 animate-bounce h-40 w-40"></div>
            </div>
        </div>; // evita piscar
    }

    if (session) {
        return <Navigate to="/painel" replace />;
    }

    return children;
}