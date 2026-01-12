import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthCallback from './components/AuthCallback';

import type { ReactNode } from 'react';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}



function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Tela de login */}
            <Route path="/login" element={<Auth />} />

            {/* Tela principal após login */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* Rota de callback para confirmar email */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Rota padrão → redireciona para login */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}


export default App;
