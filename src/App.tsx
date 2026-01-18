import { Auth } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AuthCallback from './components/AuthCallback';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import { supabase } from './service/supabase';





function App() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Evento de Auth:", event);
      console.log("Sessão atual:", session);

      if (event === "SIGNED_IN" && session) {
        console.log("Usuário logado com sucesso! Redirecionando...");
        navigate("/dashboard");
      }
    });
  }, []);
  return (

    <Routes>
      {/* Tela de login */}
      <Route path="/login" element={<Auth />} />

      {/* Tela principal após login */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Rota de callback para confirmar email */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Rota padrão → redireciona para login */}
      <Route path="/" element={<Auth />} />
    </Routes>



  );
}


export default App;
