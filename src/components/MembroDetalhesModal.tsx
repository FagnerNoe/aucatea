

// Adjust the import path based on your project structure
import { useStyle } from "../context/StyleContext";

interface MembroDetalhesModalProps {
    membro: any;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (membro: any) => void;

}

export default function PacienteDetalhesModal({
    membro,
    isOpen,
    onClose,
    onEdit,

}: MembroDetalhesModalProps) {
    const { cores } = useStyle();
    if (!isOpen || !membro) return null;



    return (
        <div className=" fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className=" bg-white rounded-lg shadow-lg w-90 sm:150 md:w-200 max-h-150 overflow-y-auto p-4 relative">
                {/* Header */}
                <h2 className="no-print text-2xl text-center font-bold mb-6 border-b pb-2 font-[Poppins] text-yellow-500">
                    Detalhes do Membro
                </h2>


                {/* Foto */}
                {membro.avatarUrl && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={membro.avatarUrl}
                            alt="Foto do membro"
                            className="w-32 h-32 rounded-lg shadow-md border border-yellow-500 object-cover"
                        />
                    </div>
                )}

                {/* Grid de informações */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm font-[Poppins] text-center">
                    <div>
                        <p><span className={`font-semibold ${cores.warnText}`}>Nome:</span> {membro.nome}</p>
                        <p><span className={`font-semibold ${cores.warnText}`}>Telefone:</span> {membro.telefone}</p>
                        <p><span className={`font-semibold ${cores.warnText}`}>Email:</span> {membro.email}</p>
                    </div>

                    <div className="flex flex-col ">
                        <p><span className={`font-semibold ${cores.warnText}`}>Endereço:</span> {membro.endereco}, {membro.numero_residencia}</p>
                        <p><span className={`font-semibold ${cores.warnText}`}>Bairro:</span> {membro.bairro}</p>
                        <p><span className={`font-semibold ${cores.warnText}`}>CEP:</span> {membro.cep}</p>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center  mt-5">
                    <p><span className={`font-semibold ${cores.warnText}`}>Responsabilidade:</span> {membro.responsabilidade}</p>
                    <p><span className={`font-semibold ${cores.warnText}`}>Disponibilidade:</span> {membro.disponibilidade}</p>
                </div>








                {/* Footer com ações */}
                <div className="flex justify-end gap-x-3 mt-8 border-t pt-4">

                    <div className=" flex gap-3">
                        <button
                            onClick={() => {
                                onEdit(membro);
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