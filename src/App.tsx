

import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthCallback from './components/AuthCallback';
import PrivateRoute from './components/PrivateRoute';





function App() {
  return (

    <BrowserRouter>

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

    </BrowserRouter>

  );
}


export default App;
