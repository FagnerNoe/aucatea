import { Auth } from './components/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicRoute } from './components/PublicRoute';
import Painel from './components/Painel';
import { PrivateRoute } from './components/PrivateRoute';
import { Membros } from './components/Membros';
import { Pacientes } from './components/Pacientes';
import { Agenda } from './components/Agenda';
import { Home } from './components/Home';
import { Doacoes } from './components/Doacoes';
import { Relatorios } from './components/Relatorios';






function App() {



  return (

    <Routes>
      {/* Redireciona raiz para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Tela de login */}
      <Route path="/login" element={<PublicRoute><Auth /></PublicRoute>} />

      {/* Painel protegido */}
      <Route
        path="/painel"
        element={
          <PrivateRoute>
            <Painel />
          </PrivateRoute>
        }
      >
        {/* Rotas filhas dentro do painel */}
        <Route index element={<Home />} /> {/* /painel */}
        <Route path="membros" element={<Membros />} />
        <Route path="pacientes" element={<Pacientes />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="doacoes" element={<Doacoes />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>

      {/* Fallback global: qualquer rota inválida → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>




  );
}


export default App;
