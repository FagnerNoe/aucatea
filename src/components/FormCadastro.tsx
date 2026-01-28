import { useState } from "react";

export default function TabelaPacientes() {
    const [pacientes, setPacientes] = useState([
        { id: 1, nome: "João Silva", idade: 32 },
        { id: 2, nome: "Maria Oliveira", idade: 45 },
        { id: 3, nome: "Carlos Souza", idade: 28 },
    ]);

    const editarPaciente = (id: any) => {
        alert(`Editar paciente com ID: ${id}`);
        // aqui você pode abrir um modal ou redirecionar para tela de edição
    };

    const excluirPaciente = (id: any) => {
        if (confirm("Deseja realmente excluir este paciente?")) {
            setPacientes(pacientes.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Lista de Pacientes</h2>
            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Nome</th>
                        <th className="px-4 py-2 border">Idade</th>
                        <th className="px-4 py-2 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((paciente) => (
                        <tr key={paciente.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{paciente.id}</td>
                            <td className="px-4 py-2 border">{paciente.nome}</td>
                            <td className="px-4 py-2 border">{paciente.idade}</td>
                            <td className="px-4 py-2 border space-x-2">
                                <button
                                    onClick={() => editarPaciente(paciente.id)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => excluirPaciente(paciente.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}