import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthCallback from './components/AuthCallback';




function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Tela de login */}
            <Route path="/login" element={<Auth />} />

            {/* Tela principal após login */}
            <Route path="/dashboard" element={<Dashboard />} />

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
