import { PenLineIcon, Plus, Printer, Search, TextSearchIcon, UserPlus, UserRoundX, } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PacienteModal } from "./PacienteModal";
import { usePacientes } from "../hooks/usePacientes";
import PacienteDetalhesModal from "./PacienteDetalhesModal";
import { supabase } from "../service/supabase";


export function Pacientes() {
    const [openModal, setOpenModal] = useState(false);
    const [openModalDetalhes, setOpenModalDetalhes] = useState(false);
    const [showInactive, setShowInactive] = useState(true);
    const { pacientes, fetchPacientes } = usePacientes();
    const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
    const [busca, setBuscar] = useState("")
    const [pacientesBusca, setPacientesBusca] = useState<any[]>([]);
    const formRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const buscarPaciente = async () => {
            if (busca.length === 0) {
                setPacientesBusca([]);
                return;
            }
            const { data, error } = await supabase
                .from('pacientes')
                .select('*')
                .ilike('nome', `%${busca}%`);
            if (!error && data) {
                setPacientesBusca(data);

            }
        };

        buscarPaciente();
        console.log(pacientesBusca)

    }, [busca]);

    const handleToggle = () => {
        const novoValor = !showInactive;
        setShowInactive(novoValor);
        fetchPacientes(novoValor);
    };


    const inativarPaciente = async (id: any) => {
        const { error } = await supabase
            .from('pacientes')
            .update({ ativo: false })
            .eq('id', id)

        if (error) {
            console.error(error)
        } else {
            fetchPacientes(true)// recarrega lista de ativos
        }
    }

    const reativarPaciente = async (id: any) => {
        const { error } = await supabase
            .from('pacientes')
            .update({ ativo: true })
            .eq('id', id);

        if (error) {
            console.error(error)
        } else {
            fetchPacientes(false)
        }
    }

    const handlePrint = () => {
        const win = window.open("/FormularioAucatea.html", "", "width=900,height=700");
        win?.document.close();
        win?.onload
        win?.print();

    };





    return (
        <div className="bg-white">
            <header className="flex flex-col justify-between items-start mb-15">
                <h2 className="text-xl font-bold font-[Poppins]">Pacientes</h2>
                <div className="flex gap-6 justify-between ">
                    {/* Botão abre modal */}
                    <button
                        onClick={() => {
                            setSelectedPaciente(null); // 👈 limpa paciente
                            setOpenModal(true);
                        }}
                        className="flex items-center  px-3 py-1 shadow-md shadow-lime-700 cursor-pointer bg-linear-to-l from-emerald-600 to-green-500 hover:scale-107 text-white font-[Poppins] rounded-full"
                    >
                        <Plus className=" w-5 h-5 mr-1" />
                        Novo Paciente
                    </button>

                    {/* Campo de busca */}
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Buscar Paciente..."
                            value={busca}
                            onChange={(e) => {
                                setBuscar(e.target.value);
                                setSelectedPaciente(null)
                            }}
                            className="border border-gray-400 pl-10 pr-3 py-2 rounded-full w-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div
                        onClick={handleToggle}
                        className="flex items-center gap-2 font-[Poppins] text-sm shadow-md rounded-full cursor-pointer px-3">
                        <div
                            className="w-11 h-6  flex items-center rounded-full border border-gray-700 cursor-pointer transition-colors duration-300" >
                            <span
                                className={`w-5 h-5  rounded-full shadow-md transform transition-transform duration-300 
                          ${showInactive ? 'translate-x-0.5 bg-gray-600' : 'translate-x-5 bg-emerald-400'}`}
                            />
                        </div>
                        Inativos
                    </div>

                    {/* Botão para imprimir o formulário */}

                    <div ref={formRef} style={{ display: "none" }} >

                    </div>

                    {/* Botão que dispara a impressão */}
                    <div
                        onClick={handlePrint}
                        className="flex items-center gap-x-2 rounded-full shadow-md border border-gray-100 px-2 cursor-pointer"
                    >
                        <Printer className="text-gray-700" />
                        <p className="text-sm font-[Poppins]">Imprimir Formulario</p>

                    </div>


                </div>
            </header>

            {/* Tabela */}
            <table className="w-full border-collapse border border-gray-100 rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2 font-[Poppins] w-sm">Nome</th>
                        <th className="px-4 py-2 font-[Poppins] w-xl">Endereço</th>
                        <th className="px-4 py-2 font-[Poppins] ">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.filter((paciente) =>
                        busca.length > 0
                            ? paciente.nome.toLocaleLowerCase().includes(busca.toLocaleLowerCase())
                            : true).map((paciente) => (
                                <tr
                                    key={paciente.id}
                                    className={`${!showInactive ? "bg-gray-200 border-b border-b-white text-gray-400" : "bg-white border-b border-b-gray-300 hover:bg-red-50"}`}
                                >
                                    <td className="px-4 py-2 font-[Poppins] text-sm">{paciente.nome}</td>
                                    <td className="px-4 py-2 font-[Poppins] text-sm">{paciente.endereco}, {paciente.numero_casa}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                title="Detalhes"
                                                onClick={() => {
                                                    setSelectedPaciente(paciente);
                                                    setOpenModalDetalhes(true)
                                                }}
                                                className="px-2  cursor-pointer text-sm bg-linear-to-r from-yellow-300 to-yellow-400 text-white rounded">
                                                <TextSearchIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                title="Editar"
                                                onClick={() => {
                                                    setSelectedPaciente(paciente); //paciente da linha
                                                    setOpenModal(true)
                                                }}
                                                className="px-2  cursor-pointer text-sm bg-linear-to-r from-sky-500 to-blue-500 text-white rounded">
                                                <PenLineIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                title={!showInactive ? "Reativar" : "Inativar"}
                                                onClick={() => {
                                                    !showInactive ? reativarPaciente(paciente.id) : inativarPaciente(paciente.id)
                                                }
                                                }
                                                className={`px-2 py-1 ${!showInactive ? "bg-green-500" : "bg-red-500"} cursor-pointer text-sm  text-white rounded`}>
                                                {!showInactive ?
                                                    <UserPlus className="w-4 h-4" /> :
                                                    <UserRoundX className="w-4 h-4" />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                </tbody>
            </table>

            {/* Modal */}
            <PacienteModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                paciente={selectedPaciente}
                onSaved={fetchPacientes}
            />
            <PacienteDetalhesModal
                paciente={selectedPaciente}
                isOpen={openModalDetalhes}
                onClose={() => setOpenModalDetalhes(false)}
                onEdit={(paciente) => {
                    setSelectedPaciente(paciente);
                    setOpenModal(true);
                }}

            />

        </div >
    );
}