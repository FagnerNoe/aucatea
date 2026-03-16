

// Adjust the import path based on your project structure

import { Printer } from "lucide-react";
import { useStyle } from "../context/StyleContext";

interface PacienteDetalhesModalProps {
    paciente: any;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (paciente: any) => void;

}

export default function PacienteDetalhesModal({
    paciente,
    isOpen,
    onClose,
    onEdit,

}: PacienteDetalhesModalProps) {
    const { cores } = useStyle();
    if (!isOpen || !paciente) return null;

    const handlePrint = () => {
        localStorage.setItem("paciente", JSON.stringify(paciente));


        const win = window.open("/FormularioAucatea.html", "", "width=900,height=700");
        win?.window.print();

    };

    return (
        <div className=" fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className=" bg-white rounded-lg shadow-lg w-90 sm:150 md:w-200 max-h-150 overflow-y-auto p-4 relative">
                {/* Header */}
                <h2 className="no-print text-2xl text-center font-bold mb-6 border-b pb-2 font-[Poppins] text-blue-500">
                    Detalhes do Paciente
                </h2>

                {/* Foto */}
                {paciente.foto_paciente && (
                    <div className="no-print flex justify-center mb-6">
                        <img
                            src={paciente.foto_paciente}
                            alt="Foto do paciente"
                            className="w-35 h-35 rounded-lg shadow-md border border-blue-500 object-cover "
                        />
                    </div>
                )}

                {/* Grid de informações */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm font-[Poppins] text-center">
                    <div >
                        <p><span className={`font-semibold ${cores.primaryText}`}>Nome:</span> {paciente.nome}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>
                            Data de Nascimento:
                        </span>{" "}
                            {new Date(paciente.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR")}
                        </p>

                    </div>



                    <div className="flex flex-col ">
                        <p><span className={`font-semibold ${cores.primaryText}`}>Endereço:</span> {paciente.endereco}, {paciente.numero_casa}</p>
                        {paciente.complemento_endereco && (
                            <p><span className={`font-semibold ${cores.primaryText}`}>Complemento:</span> {paciente.complemento_endereco}</p>
                        )}
                        <p><span className={`font-semibold ${cores.primaryText}`}>Bairro:</span> {paciente.bairro}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>CEP:</span> {paciente.cep}</p>
                    </div>

                    <div >
                        <p><span className={`font-semibold ${cores.primaryText}`}>Mãe:</span> {paciente.nome_mae}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>Telefone Mãe:</span> {paciente.telefone_mae}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>Pai:</span> {paciente.nome_pai}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>Telefone Pai:</span> {paciente.telefone_pai}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>Email:</span> {paciente.email_principal}</p>
                    </div>

                    <div>
                        {paciente.escola && (
                            <div>
                                <p className={`font-semibold ${cores.primaryText}`}>Instituição de Ensino:</p>
                                <span>{paciente.escola}</span>
                            </div>
                        )}
                        {paciente.escola_externa && (
                            <span><p className={`font-semibold ${cores.primaryText}`}>Outra Instituição:</p> {paciente.escola_externa}</span>
                        )}
                        <p><span className={`font-semibold ${cores.primaryText}`}>Laudo:</span> {paciente.laudo?.join(",")}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>Convênio:</span> {paciente.convenio}</p>
                        <p><span className={`font-semibold ${cores.primaryText}`}>Tratamentos:</span> {paciente.tratamentos?.join(", ")}</p>
                        {paciente.laudo_url && (
                            <a
                                href={`${paciente.laudo_url}#view=Fit&zoom=100`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-print text-pink-500 underline mt-2 block"
                            >
                                Ver Laudo
                            </a>
                        )}
                    </div>

                </div>

                {/* Linha para cidade, data e assinatura (apenas na impressão) */}
                <div className="hidden print:block mt-12 text-center font-[Poppins]">
                    <p className="mb-8">
                        Cândido Mota, {new Date().toLocaleDateString("pt-BR")}
                    </p>
                    <hr className="border-t-2 border-gray-700 w-1/2 mx-auto mb-2" />
                    <p className="text-sm">Assinatura do Responsável</p>
                </div>




                {/* Footer com ações */}
                <div className="flex justify-between gap-x-3 mt-8 border-t pt-4">
                    <button
                        onClick={handlePrint}
                        className=" no-print shadow-sm rounded-lg shadow-gray-400 px-2">
                        <Printer />
                    </button>
                    <div className=" flex gap-3">
                        <button
                            onClick={() => {
                                onEdit(paciente);
                                onClose();
                            }}
                            className={`no-print px-4 py-2 bblue-500 text-white ${cores.primaryBg} rounded shadow hover:bg-blue-700`}
                        >
                            Editar
                        </button>

                        <button
                            onClick={onClose}
                            className="no-print px-4 py-2 blue-500 text-white bg-gray-700 rounded shadow hover:bg-yellow-400"
                        >
                            Fechar
                        </button>

                    </div>
                </div>
            </div>
        </div>

    );
}