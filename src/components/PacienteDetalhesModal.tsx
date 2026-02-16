

// Adjust the import path based on your project structure

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
    if (!isOpen || !paciente) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-150 max-h-180 overflow-y-auto p-6 relative">
                {/* Header */}
                <h2 className="text-2xl font-bold mb-6 border-b pb-2 font-[Poppins] text-pink-600">
                    Detalhes do Paciente
                </h2>

                {/* Foto */}
                {paciente.foto_paciente && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={paciente.foto_paciente}
                            alt="Foto do paciente"
                            className="w-32 h-32 rounded-lg shadow-md border border-pink-600"
                        />
                    </div>
                )}

                {/* Grid de informações */}
                <div className="grid grid-cols-2 gap-6 text-sm font-[Poppins]">
                    <div>
                        <p><span className="font-semibold text-pink-600">Nome:</span> {paciente.nome}</p>
                        <p><span className="font-semibold text-pink-600">Data de Nascimento:</span> {paciente.data_nascimento}</p>
                        <p><span className="font-semibold text-pink-600">Email:</span> {paciente.email_principal}</p>
                    </div>



                    <div>
                        <p><span className="font-semibold text-pink-600">Endereço:</span> {paciente.endereco}, {paciente.numero_casa}</p>
                        {paciente.complemento_endereco && (
                            <p><span className="font-semibold text-pink-600">Complemento:</span> {paciente.complemento_endereco}</p>
                        )}
                        <p><span className="font-semibold text-pink-600">Bairro:</span> {paciente.bairro}</p>
                        <p><span className="font-semibold text-pink-600">CEP:</span> {paciente.cep}</p>
                    </div>

                    <div>
                        <p><span className="font-semibold text-pink-600">Mãe:</span> {paciente.nome_mae}</p>
                        <p><span className="font-semibold text-pink-600">Telefone Mãe:</span> {paciente.telefone_mae}</p>
                        <p><span className="font-semibold text-pink-600">Pai:</span> {paciente.nome_pai}</p>
                        <p><span className="font-semibold text-pink-600">Telefone Pai:</span> {paciente.telefone_pai}</p>
                    </div>

                    <div>

                        <p><span className="font-semibold text-pink-600">Laudo:</span> {paciente.laudo?.join(",")}</p>
                        <p><span className="font-semibold text-pink-600">Convênio:</span> {paciente.convenio}</p>
                        <p><span className="font-semibold text-pink-600">Tratamentos:</span> {paciente.tratamentos?.join(", ")}</p>
                        {paciente.laudo_url && (
                            <a
                                href={paciente.laudo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline mt-2 block"
                            >
                                Ver Laudo
                            </a>
                        )}
                    </div>

                </div>


                {/* Footer com ações */}
                <div className="flex justify-end gap-x-3 mt-8 border-t pt-4">
                    <button
                        onClick={() => {
                            onEdit(paciente);
                            onClose();
                        }}
                        className="px-4 py-2 bpink-600 text-white bg-blue-500 rounded shadow hover:bg-blue-700"
                    >
                        Editar
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 pypink-600 text-white bg-gray-600 rounded shadow hover:bg-yellow-400"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>

    );
}