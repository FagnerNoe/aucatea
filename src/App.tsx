import { Auth } from './components/Login';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './service/supabase';
import Painel from './components/Painel';





function App() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Evento de Auth:", event);
      console.log("Sessão atual:", session);

      if (event === "SIGNED_IN" && session) {
        console.log("Usuário logado com sucesso! Redirecionando...");
        navigate("/painel");
      }
    });
  }, []);
  return (

    <Routes>
      {/* Tela de login */}
      <Route path="/login" element={<Auth />} />

      {/* Tela principal após login */}
      <Route path="/painel" element={<Painel />} />


    </Routes>



  );
}


export default App;
