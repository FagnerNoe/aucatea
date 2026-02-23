import { PenLineIcon, Plus, Search, TextSearchIcon, Trash, } from "lucide-react";
import { useEffect, useState } from "react";
import { MembroModal } from "./MembroModal";


import { supabase } from "../service/supabase";
import { useStyle } from "../context/StyleContext";
import { useMembros } from "../hooks/useMembros";
import MembroDetalhesModal from "./MembroDetalhesModal";


export function Membros() {
    const [openModalMembro, setOpenModalMembro] = useState(false);
    const [openModalDetalhes, setOpenModalDetalhes] = useState(false);
    const [showModalExclusao, setShowModalExclusao] = useState(false);
    const { membros, fetchMembros } = useMembros();
    const [selectedMembro, setSelectedMembro] = useState<any>(null);
    const [busca, setBuscar] = useState("")
    const [pacientesBusca, setPacientesBusca] = useState<any[]>([]);
    const { cores } = useStyle();


    useEffect(() => {
        const buscarMembro = async () => {
            if (busca.length === 0) {
                setPacientesBusca([]);
                return;
            }
            const { data, error } = await supabase
                .from('membros')
                .select('*')
                .ilike('nome', `%${busca}%`);
            if (!error && data) {
                setPacientesBusca(data);

            }
        };

        buscarMembro();
        console.log(pacientesBusca)

    }, [busca]);



    const confirmarExclusao = (id: any) => {
        setSelectedMembro(id);
        setShowModalExclusao(true);
    };


    const deletarMembro = async () => {
        if (!selectedMembro) return;

        const { data, error } = await supabase
            .from('membros')
            .delete()
            .eq('id', selectedMembro)
            .select();

        if (error) {
            console.error(error);
        } else {
            console.log("Membro excluído:", data);
            fetchMembros()
        }


        const { data: files, error: listError } = await supabase
            .storage
            .from('membros') // nome do bucket
            .list(`${selectedMembro}/`);

        if (listError) {
            console.error("Erro ao listar arquivos:", listError);
            return;
        }

        if (files.length > 0) {
            // 3. Montar lista de paths
            const paths = files.map(file => `${selectedMembro}/${file.name}`);

            // 4. Remover todos os arquivos
            const { error: removeError } = await supabase
                .storage
                .from('membros')
                .remove(paths);

            if (removeError) {
                console.error("Erro ao excluir arquivos:", removeError);
            } else {
                console.log("Arquivos da pasta excluídos com sucesso");
            }
        }

        setShowModalExclusao(false);
        setSelectedMembro(null)

    }


    return (
        <div className="bg-white w-full">
            <header className="flex flex-col justify-between items-center md:items-start mb-4 sm:mb-8 md:mb-20">
                <h2 className=" text-xl font-bold font-[Poppins]">Membros</h2>
                <div className="flex gap-2 justify-between flex-col md:flex-row md:gap-8">
                    <div className="flex items-center justify-center gap-2 flex-wrap ">
                        {/* Botão abre modal */}
                        <button
                            onClick={() => {
                                setSelectedMembro(null); // 👈 limpa membro
                                setOpenModalMembro(true);
                            }}
                            className={`flex items-center px-10 py-4 sm:p-3 md:p-3  text-sm md:text-sm shadow-md shadow-purple-700 cursor-pointer ${cores.gradientAddMembro} hover:scale-107 text-white font-[Poppins] rounded-full`}
                        >
                            <Plus className="w-5 h-5 mr-1" />
                            Membro
                        </button>

                        {/* Campo de busca */}
                        <div className="relative w-full sm:w-xs md:w-xs  lg:w-sm xl-w ">
                            <input
                                type="text"
                                placeholder="Buscar Membro..."
                                value={busca}
                                onChange={(e) => {
                                    setBuscar(e.target.value);
                                    setSelectedMembro(null)
                                }}
                                className="border border-gray-400 w-full px-10 py-2 rounded-full  focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                    </div>





                </div>
            </header>

            {/* Tabela */}
            <table className="w-full border-collapse border border-gray-100 rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 w-sm  font-[Poppins]">Nome</th>
                        <th className="hidden sm:table-cell w-xs p-2  font-[Poppins] ">Responsabilidade</th>
                        <th className="hidden sm:table-cell w-xs p-2 font-[Poppins] ">Telefone</th>
                        <th className="p-2 font-[Poppins] text-center">Ações</th>

                    </tr>
                </thead>
                <tbody>
                    {membros.filter((membro: any) =>
                        busca.length > 0
                            ? membro.nome.toLocaleLowerCase().includes(busca.toLocaleLowerCase())
                            : true).map((membro: any) => (
                                <tr
                                    key={membro.id}
                                    className="bg-white border-b border-b-gray-300 hover:bg-red-50"
                                >
                                    <td className="p-2 max-w-50 sm:max-w-sm md:max-w-md font-[Poppins] text-xs sm:text-sm md:text-sm xl:text-sm truncate">{membro.nome}</td>
                                    <td className="hidden sm:table-cell p-2 max-w-50 sm:max-w-sm md:max-w-md font-[Poppins] text-xs sm:text-sm md:text-sm xl:text-sm ">{membro.responsabilidade}</td>
                                    <td className="hidden  sm:table-cell  p-2 max-w-50 sm:max-w-sm md:max-w-md font-[Poppins] text-xs sm:text-sm md:text-sm xl:text-sm ">{membro.telefone}</td>
                                    <td className="px-2 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                title="Detalhes"
                                                onClick={() => {
                                                    setSelectedMembro(membro);
                                                    setOpenModalDetalhes(true)
                                                }}
                                                className="px-2 py-1   cursor-pointer text-sm bg-linear-to-r from-yellow-300 to-yellow-400 text-white rounded">
                                                <TextSearchIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                title="Editar"
                                                onClick={() => {
                                                    setSelectedMembro(membro); //membro da linha
                                                    setOpenModalMembro(true)
                                                }}
                                                className="px-2 cursor-pointer text-sm bg-linear-to-r from-sky-500 to-blue-500 text-white rounded">
                                                <PenLineIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                title="Deletar"
                                                onClick={() => confirmarExclusao(membro.id)}
                                                className="px-2 cursor-pointer text-sm bg-red-500 text-white rounded"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>


                                            {showModalExclusao && (
                                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                    <div className="bg-white rounded-lg shadow-lg w-80 max-h-180 overflow-y-auto p-6 relative">
                                                        <p className="text-gray-800 font-[Poppins] text-sm text-center">Tem certeza que deseja excluir este membro permanentemente?</p>
                                                        <div className="mt-5 flex items-center justify-between">

                                                            <button onClick={() => setShowModalExclusao(false)}
                                                                className="bg-gray-700 px-5 py-2 rounded-lg cursor-pointer shadow-2xl text-white "
                                                            >Não</button>
                                                            <button onClick={deletarMembro}
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

            {/* Modal */}
            <MembroModal
                isOpen={openModalMembro}
                onClose={() => {
                    setOpenModalMembro(false);
                    setSelectedMembro(null)
                }}
                membro={selectedMembro}
                onSaved={() => {
                    fetchMembros();
                    setSelectedMembro(null);
                }}
            />
            <MembroDetalhesModal
                membro={selectedMembro}
                isOpen={openModalDetalhes}
                onClose={() => setOpenModalDetalhes(false)}
                onEdit={(membro) => {
                    setSelectedMembro(membro);
                    setOpenModalMembro(true);
                }}

            />

        </div >
    );
}


