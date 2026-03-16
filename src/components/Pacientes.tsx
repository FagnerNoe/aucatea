import { PenLineIcon, Plus, Printer, Search, TextSearchIcon, Trash, UserPlus, UserRoundX, } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PacienteModal } from "./PacienteModal";
import { usePacientes } from "../hooks/usePacientes";
import PacienteDetalhesModal from "./PacienteDetalhesModal";
import { supabase } from "../service/supabase";
import { useStyle } from "../context/StyleContext";


export function Pacientes() {
    const [openModal, setOpenModal] = useState(false);
    const [openModalDetalhes, setOpenModalDetalhes] = useState(false);
    const [showModalExclusao, setShowModalExclusao] = useState(false);


    const [showInactive, setShowInactive] = useState(true);
    const { pacientes, fetchPacientes } = usePacientes();
    const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
    const [busca, setBuscar] = useState("")
    const [pacientesBusca, setPacientesBusca] = useState<any[]>([]);
    const formRef = useRef<HTMLDivElement>(null);
    const { cores } = useStyle();


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

    const handleToggle = async () => {
        const novoValor = !showInactive;
        await fetchPacientes(novoValor);
        setShowInactive(novoValor);
    };

    const confirmarExclusao = (id: any) => {
        setSelectedPaciente(id);
        setShowModalExclusao(true);
    };


    const deletarPaciente = async () => {
        if (!selectedPaciente) return;

        const { data, error } = await supabase
            .from('pacientes')
            .delete()
            .eq('id', selectedPaciente)
            .select();

        if (error) {
            console.error(error);
        } else {
            console.log("Paciente excluído:", data);

            fetchPacientes(false)
        }

        // 2. Listar arquivos da pasta no Storage
        const { data: files, error: listError } = await supabase
            .storage
            .from('pacientes_fotos') // nome do bucket
            .list(`${selectedPaciente}/`);

        if (listError) {
            console.error("Erro ao listar arquivos:", listError);
            return;
        }

        if (files.length > 0) {
            // 3. Montar lista de paths
            const paths = files.map(file => `${selectedPaciente}/${file.name}`);

            // 4. Remover todos os arquivos
            const { error: removeError } = await supabase
                .storage
                .from('pacientes_fotos')
                .remove(paths);

            if (removeError) {
                console.error("Erro ao excluir arquivos:", removeError);
            } else {
                console.log("Arquivos da pasta excluídos com sucesso");
            }
        }

        setShowModalExclusao(false);
        setSelectedPaciente(null)

    }



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
        <div className="bg-white w-full">
            <header className="flex flex-col justify-end items-center md:items-start  h-25 mt-20 sm:mt-0 bg-white">
                <h2 className=" text-xl font-bold font-[Poppins]">Pacientes</h2>
                <div className="flex gap-2 justify-between flex-col md:flex-row md:gap-8">
                    <div className="flex items-center justify-center gap-2 flex-wrap ">
                        {/* Botão abre modal */}
                        <button
                            onClick={() => {
                                setSelectedPaciente(null); // 👈 limpa paciente
                                setOpenModal(true);
                            }}
                            className={`flex items-center px-10 py-4 sm:p-3 md:p-3  text-sm md:text-sm shadow-md shadow-lime-700 cursor-pointer ${cores.gradientAdd} hover:scale-107 text-white font-[Poppins] rounded-full`}
                        >
                            <Plus className="w-5 h-5 mr-1" />
                            Novo Paciente
                        </button>

                        {/* Campo de busca */}
                        <div className="relative w-full sm:w-xs md:w-xs  lg:w-sm xl-w ">
                            <input
                                type="text"
                                placeholder="Buscar Paciente..."
                                value={busca}
                                onChange={(e) => {
                                    setBuscar(e.target.value);
                                    setSelectedPaciente(null)
                                }}
                                className="border border-gray-400 w-full px-10 py-2 rounded-full  focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div
                            onClick={handleToggle}
                            className="flex items-center gap-2 font-[Poppins] text-sm shadow-md border border-gray-100 rounded-full cursor-pointer px-3 py-2">
                            <div
                                className="w-10 h-5 sm:w-11 sm:h-6   flex items-center rounded-full border border-gray-700 cursor-pointer transition-colors duration-300" >
                                <span
                                    className={`w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5  rounded-full shadow-md transform transition-transform duration-300 
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
                            className="flex items-center gap-x-2 rounded-full shadow-md border border-gray-100 px-3 py-1 sm:p-2 md:p-2 cursor-pointer"
                        >
                            <Printer className="text-gray-700 w-5 sm:w-6 md:w-6" />
                            <p className="text-sm font-[Poppins]">Formulario</p>

                        </div>

                    </div>


                </div>
            </header>

            {/* Tabela */}
            <section className="flex-1 overflow-y-auto  mt-10 max-h-[70vh] ">
                <table className="w-full  h-full border-collapse border border-gray-100  shadow rounded-lg ">
                    <thead className="sticky -top-px bg-gray-100 ">
                        <tr className="bg-gray-200 text-left rounded-lg">
                            <th className="p-2 w-sm sm:w-md font-[Poppins]">Nome</th>
                            <th className="hidden sm:table-cell md:table-cell xl:table-cell md:px-12 md:py-2 font-[Poppins]  sm:w-xl ">Endereço</th>
                            <th className="px-4 py-2 text-center font-[Poppins]  ">Ações</th>
                        </tr>
                    </thead>
                    <tbody >
                        {pacientes.sort((a, b) => a.nome.localeCompare(b.nome)).filter((paciente) =>
                            busca.length > 0
                                ? paciente.nome.toLocaleLowerCase().includes(busca.toLocaleLowerCase())
                                : true).map((paciente) => (
                                    <tr
                                        key={paciente.id}
                                        className={`${!showInactive ? "bg-gray-200 border-b border-b-white text-gray-400" : "bg-white border-b border-b-gray-300 hover:bg-red-50"}`}
                                    >
                                        <td className="p-2 max-w-50 sm:max-w-sm md:max-w-md font-[Poppins] text-xs sm:text-sm md:text-sm xl:text-sm truncate ">{paciente.nome}</td>
                                        <td className="hidden sm:table-cell md:table-cell xl:table-cell px-12 py-2 font-[Poppins] text-sm">{paciente.endereco}, {paciente.numero_casa}</td>
                                        <td className="px-2 py-2">
                                            <div className="flex gap-2">
                                                <button
                                                    title="Detalhes"
                                                    onClick={() => {
                                                        setSelectedPaciente(paciente);
                                                        setOpenModalDetalhes(true)
                                                    }}
                                                    className="px-2 cursor-pointer text-sm border border-yellow-500 hover:bg-yellow-400 text-yellow-500 hover:text-gray-600 rounded">
                                                    <TextSearchIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    title="Editar"
                                                    onClick={() => {
                                                        setSelectedPaciente(paciente); //paciente da linha
                                                        setOpenModal(true)
                                                    }}
                                                    className="px-2  cursor-pointer text-sm border border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-white rounded">
                                                    <PenLineIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    title={!showInactive ? "Reativar" : "Inativar"}
                                                    onClick={() => {
                                                        !showInactive ? reativarPaciente(paciente.id) : inativarPaciente(paciente.id)
                                                    }
                                                    }
                                                    className={`px-2 py-1 ${!showInactive ? "border border-green-500 bg-green-500 hover:bg-green-300 text-white" : "border border-gray-500 hover:bg-gray-500 hover:text-white"} cursor-pointer text-sm  text-gray-500 rounded`}>
                                                    {!showInactive ?
                                                        <UserPlus className="w-4 h-4" /> :
                                                        <UserRoundX className="w-4 h-4" />
                                                    }
                                                </button>
                                                {!showInactive && (
                                                    <button
                                                        title="Excluir"
                                                        onClick={() => confirmarExclusao(paciente.id)}
                                                        className="bg-red-500 hover:bg-red-400 px-2 cursor-pointer text-sm text-white rounded"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {showModalExclusao && (
                                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                        <div className="bg-white rounded-lg shadow-lg w-80 max-h-180 overflow-y-auto p-6 relative">
                                                            <p className="text-gray-800 font-[Poppins] text-sm text-center">Tem certeza que deseja excluir este paciente permanentemente?</p>
                                                            <div className="mt-5 flex items-center justify-between">

                                                                <button onClick={() => setShowModalExclusao(false)}
                                                                    className="bg-gray-700 px-5 py-2 rounded-lg cursor-pointer shadow-2xl text-white "
                                                                >Não</button>
                                                                <button onClick={deletarPaciente}
                                                                    className="bg-red-500 rounded-lg text-white px-5 py-2 cursor-pointer shadow-xl">Sim</button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </section>

            {/* Modal */}
            <PacienteModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedPaciente(null)
                }}
                paciente={selectedPaciente}
                onSaved={() => {
                    fetchPacientes(showInactive ? true : false);
                    setSelectedPaciente(null);
                }}
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