import { CameraIcon, ChevronDownIcon, ChevronUpIcon, Edit, Eye, PaperclipIcon, PenLineIcon, Plus, Search, TextSearchIcon, Trash, UserIcon, X, XCircleIcon } from "lucide-react";
import { useState } from "react";

export function Pacientes() {
    const [openModal, setOpenModal] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState<Record<string, any>>({});
    const [editingItem, setEditingItem] = useState<Record<string, any> | null>(null);
    const [open, setOpen] = useState(false);
    const [selecionados, setSelecionados] = useState<number[]>([]);

    const pacientes = [
        { id: 1, nome: "Ana Maria Braga ", endereco: "Rua das Flores, 908" },
        { id: 2, nome: "Bruno Jose Antonio", endereco: "Av. Paulista, 1890" },
    ];


    const opcoes = [
        { id: "psicologo", label: "Psicólogo" },
        { id: "terapia", label: "Terapia" },
        { id: "fonoaudiologia", label: "Fonoaudiologia" },
        { id: "outros", label: "Outros" },
    ];

    const toggleSelecionado = (id: any) => {
        setSelecionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };


    const handleSubmit = (data: Record<string, any>) => {
        console.log("Novo paciente:", data);
        setOpenModal(false); // fecha modal após salvar
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setLoading(false);
            };
            reader.readAsDataURL(file);

            setNewItem((prev) => ({
                ...prev,
                imageFile: file
            }));
        }
        setEditingItem((prev) => (prev ? { ...prev, imageFile: file ?? undefined } : null));


    };


    const handleRemoveImage = () => {
        setPreview(null);
        setNewItem((prev) => ({
            ...prev,
            image_url: undefined
        }));


    };


    return (
        <div className="bg-white">
            <header className="flex flex-col justify-between items-start mb-15">
                <h2 className="text-xl font-bold font-[Poppins]">Pacientes</h2>
                <div className="flex gap-6 justify-between ">
                    {/* Botão abre modal */}
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center px-3 py-1 shadow-md cursor-pointer bg-linear-to-l from-lime-400 to-green-500 text-white rounded-xl"
                    >
                        <Plus className="w-5 h-5 mr-1" />
                        Novo Paciente
                    </button>

                    {/* Campo de busca */}
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Buscar Paciente..."
                            className="border border-gray-400 pl-10 pr-3 py-2 rounded-full w-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                    {pacientes.map((p) => (
                        <tr
                            key={p.id}
                            className="bg-white border-b border-b-gray-300 hover:bg-red-50"
                        >
                            <td className="px-4 py-2 font-[Poppins] text-sm">{p.nome}</td>
                            <td className="px-4 py-2 font-[Poppins] text-sm">{p.endereco}</td>
                            <td className="px-4 py-2">
                                <div className="flex gap-2">
                                    <button className="px-2  cursor-pointer text-sm bg-linear-to-r from-yellow-400 to-yellow-500 text-white rounded">
                                        <TextSearchIcon className="w-4 h-4" />
                                    </button>
                                    <button className="px-2  cursor-pointer text-sm bg-linear-to-r from-sky-400 to-blue-400 text-white rounded">
                                        <PenLineIcon className="w-4 h-4" />
                                    </button>
                                    <button className="px-2 py-1 cursor-pointer text-sm bg-red-500 text-white rounded">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {openModal && (
                <div className=" fixed  inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-9/12 h-5/6 rounded-lg shadow-lg overflow-y-auto p-6 relative">
                        {/* Botão fechar */}
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-7 right-7 text-gray-600 hover:text-red-500 text-xl"
                        >
                            <X className="h-8 w-8 border-2 rounded-lg text-white hover:text-red-500" />
                        </button>

                        <h3 className="text-2xl text-gray-800 font-bold mb-6 shadow-sm px-2 py-1 rounded-lg bg-green-500">Novo Paciente</h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const data = Object.fromEntries(
                                    new FormData(e.currentTarget).entries()
                                );
                                handleSubmit(data);
                            }}
                            className="flex flex-col gap-3"
                        >
                            <div className="flex ">
                                <div className="flex flex-col items-center p-2 bg-white                                
                                 rounded shadow-md max-w-md h-[32%] mr-6 mt-6">
                                    {/* Quadrado com ícone ou preview */}
                                    <div className="relative w-36 h-35 flex items-center justify-center border border-gray-300 rounded bg-gray-100">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Pré-visualização"
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <UserIcon className="h-16 w-16 text-gray-400" /> // Ícone de usuário
                                        )}

                                        {preview && (
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                            >
                                                <XCircleIcon className="h-6 w-6" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Botão abaixo do quadrado */}
                                    <label
                                        htmlFor="imageInput"
                                        className="mt-4 text-xs flex items-center gap-2 bg-sky-500 text-white px-2 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                                    >
                                        <CameraIcon className="h-5 w-5" />
                                        Escolher imagem
                                    </label>

                                    <input
                                        type="file"
                                        id="imageInput"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                </div>

                                <div className="w-3xl flex flex-col gap-3 ">
                                    <div className="flex justify-between space-x-4">
                                        <div className="w-full">
                                            <label htmlFor="nome" className="text-gray-700 font-semibold ">
                                                Nome
                                            </label>
                                            <input
                                                type="text"
                                                id="nome"
                                                name="nome"
                                                className=" w-full border border-gray-400 text-black p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <label htmlFor="dataNascimento" className="text-gray-700 font-semibold">
                                                Data de Nascimento
                                            </label>
                                            <input
                                                type="date"
                                                id="dataNascimento"
                                                name="dataNascimento"
                                                className=" border border-gray-400 p-2 text-black rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label
                                            htmlFor="endereco"
                                            className="text-gray-700 font-semibold"> Endereço </label>
                                        <input
                                            type="text"
                                            name="endereco"
                                            className="w-full border border-gray-400 p-2 text-black rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between space-x-4">
                                        <div className="w-full">
                                            <label
                                                htmlFor="bairro"
                                                className="text-gray-700 font-semibold"> Bairro / Distrito </label>
                                            <input
                                                type="text"
                                                name="bairro"
                                                className="w-full border border-gray-400  p-2 text-black rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            />
                                        </div>
                                        <div >
                                            <label htmlFor="cep" className="text-gray-700 font-semibold"> CEP </label>
                                            <input
                                                type="text"
                                                name="cep"
                                                placeholder="CEP"
                                                className=" border border-gray-400  p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                            />
                                        </div>
                                    </div>



                                </div>

                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <div className=" w-full ">
                                    <label
                                        htmlFor="mae"
                                        className="text-gray-700 font-semibold ">Nome da Mãe
                                    </label>
                                    <input
                                        type="text"
                                        name="mae"
                                        className="w-full border border-gray-400 p-2 text-black rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    />

                                </div>
                                <div >
                                    <label htmlFor="telefoneMae" className="text-gray-700 font-semibold">Celular</label>
                                    <input
                                        type="text"
                                        name="telefoneMae"
                                        placeholder="Telefone"
                                        className=" border border-gray-400 p-2 text-black rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    />

                                </div>

                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <div className=" w-full">
                                    <label
                                        htmlFor="pai"
                                        className="text-gray-700 font-semibold ">Nome do Pai
                                    </label>
                                    <input
                                        type="text"
                                        name="pai"
                                        className="w-full border border-gray-400 p-2 text-black rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    />

                                </div>
                                <div >
                                    <label htmlFor="telefonePai" className="text-gray-700 font-semibold">Celular</label>
                                    <input
                                        type="text"
                                        name="telefonePai"
                                        placeholder="Telefone"
                                        className="border border-gray-400 p-2 text-black rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    />

                                </div>

                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <div>
                                    <label
                                        htmlFor="convenio"
                                        className="font-semibold text-gray-700"
                                    >
                                        Convênio Médico
                                    </label>
                                    <select
                                        id="convenio"
                                        name="convenio"
                                        className="w-full border border-gray-400 p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="sus">SUS</option>
                                        <option value="unimed">Unimed</option>
                                        <option value="amil">Amil</option>
                                        <option value="bradesco">Bradesco Saúde</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>

                                <div className="w-full ">
                                    <label className="font-semibold text-gray-700">Tratamentos</label>
                                    <div className="relative ">
                                        {/* Botão que abre o dropdown */}
                                        <button
                                            type="button"
                                            onClick={() => setOpen(!open)}
                                            className="w-full flex items-center justify-between border border-gray-400 p-2 h-10 rounded-sm text-left  focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        >
                                            <span>
                                                {selecionados.length > 0
                                                    ? opcoes
                                                        .filter((o) => selecionados.includes(o.id as any))
                                                        .map((o) => o.label)
                                                        .join(", ")
                                                    : "Selecione os tratamentos"}
                                            </span>
                                            {open ? (
                                                <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                            )}


                                        </button>

                                        {/* Dropdown com checkboxes */}
                                        {open && (
                                            <div className="absolute mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg z-10">
                                                {opcoes.map((opcao) => (
                                                    <label
                                                        key={opcao.id}
                                                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selecionados.includes(opcao.id as any)}
                                                            onChange={() => toggleSelecionado(opcao.id as any)}
                                                            className="mr-2"
                                                        />
                                                        {opcao.label}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>




                            </div>



                            {/* Uploads */}
                            <div className="flex flex-col items-center p-2 bg-white rounded shadow-md max-w-md mx-auto h-lg">
                                <label
                                    htmlFor="imageInput"
                                    className="flex items-center gap-2 bg-linear-to-r shadow-md from-sky-500 to-blue-600 text-white px-4 rounded hover:bg-white transition cursor-pointer"
                                >
                                    <PaperclipIcon className="h-4 w-4" />
                                    Anexar Laudo
                                </label>

                                <input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden" />

                                {preview && (
                                    <div className="relative mt-4">
                                        <img
                                            src={preview}
                                            alt="Pré-visualização"
                                            className="max-w-full rounded border" />
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-white text-red-700 rounded-full p-1 hover:bg-red-700"
                                        >
                                            <XCircleIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                )}
                            </div>



                            {/* Botão salvar */}
                            <div className="col-span-2 flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="px-5 py-1 bg-linear-to-r from-green-600 to-emerald-600 font-[Poppins] shadow-md text-white rounded cursor-pointer"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }
        </div >
    );
}