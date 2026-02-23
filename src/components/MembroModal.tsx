
import { CameraIcon, UserIcon, X, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import { useAuth } from "../context/AuthContext";
import type { Membro } from "../types/database.types";



type MembroModalProps = {
    isOpen: boolean;
    onClose: () => void;
    membro?: Membro | null;
    onSaved: () => void; // callback para atualizar a lista de membros
}


export function MembroModal({ isOpen, onClose, membro, onSaved }: MembroModalProps) {
    const isEditing = !!membro
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { user } = useAuth();



    useEffect(() => {
        if (membro) {
            console.log(membro)
            setFormData({
                nome: membro.nome || "",
                telefone: membro.telefone || "",
                endereco: membro.endereco || "",
                numero_residencia: membro.numero_residencia || "",
                bairro: membro.bairro || "",
                cep: membro.cep || "",
                responsabilidade: membro.responsabilidade || "",
                disponibilidade: membro.disponibilidade || "",
                email: membro.email || "",
            });
            setPreview(membro.avatarUrl || null);

        } else {
            setFormData({
                nome: "",
                telefone: "",
                endereco: "",
                numero_residencia: "",
                bairro: "",
                cep: "",
                responsabilidade: "",
                disponibilidade: "",
                email: "",

            });
            setPreview(null);

        }
    }, [membro]);

    const formatarTelefone = (valor: string) => {
        // Remove tudo que não for número
        const numeros = valor.replace(/\D/g, '');
        // Aplica a máscara (XX)XXXX-XXXX
        if (numeros.length === 10 && numeros[2] === "3") {
            // Telefone fixo: DDD + 8 dígitos
            return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1)$2-$3");
        } else if (numeros.length === 11 && numeros[2] === "9") {
            // Celular: DDD + 9 dígitos
            return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2-$3");
        }

        // Caso ainda esteja digitando, aplica máscara parcial
        if (numeros.length <= 10) {
            return numeros
                .replace(/^(\d{2})(\d)/, "($1)$2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            return numeros
                .replace(/^(\d{2})(\d)/, "($1)$2")
                .replace(/(\d{5})(\d)/, "$1-$2");
        }

    };

    const formatarCep = (valor: string) => {
        const numeros = valor.replace(/\D/g, '');
        return numeros.replace(/(\d{5})(\d{3})$/, "$1-$2");
    }

    const convertToWebP = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                                    type: "image/webp",
                                });
                                setFormData((prev) => ({ ...prev, imageFile: webpFile }));

                                resolve(webpFile);
                            }
                        },
                        "image/webp",
                        0.8 // qualidade (0.8 = 80%)
                    );
                };
            };
            reader.readAsDataURL(file);

        });
    };






    if (!isOpen) return null;

    // Função para gerar slug único
    function gerarSlugPaciente(nome: string, existentes: string[]): string {


        // remove acentos e caracteres especiais
        const baseSlug = nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace("", "-") //espaços -> hífen
            .replace(/[^a-z0-9]/g, ""); //remove caracteres inválidos

        // garante unicidade
        let slug = baseSlug;
        let contador = 1;
        while (existentes.includes(slug)) {
            slug = `${baseSlug}-${contador}`;
            contador++;
        }

        return slug;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!user) return;

        try {
            let fotoUrl: string | undefined;


            const { data: files, error } = await supabase.storage
                .from("membros")
                .list(); // lista objetos/pastas no bucket

            if (error) throw error;

            const existentes = files.map(f => f.name); // nomes já existentes            
            const slug = membro?.slug ?? gerarSlugPaciente(formData.nome, existentes);


            // Se tiver foto, faz upload para o bucket "membros"
            if (formData.imageFile) {
                const filePath = `${slug}/foto-${Date.now()}.webp`;

                const { data, error } = await supabase.storage
                    .from("membros")
                    .upload(filePath, formData.imageFile, { upsert: true });

                if (error) throw error;
                if (!data) throw new Error("Upload não retornou caminho");
                fotoUrl = supabase.storage
                    .from("membros")
                    .getPublicUrl(filePath).data.publicUrl;
            }



            // Se for edição de membro existente
            if (membro) {
                const updateData: any = {
                    nome: formData.nome,
                    telefone: formData.telefone,
                    endereco: formData.endereco,
                    numero_residencia: formData.numero_residencia,
                    bairro: formData.bairro,
                    responsabilidade: formData.responsabilidade,
                    disponibilidade: formData.disponibilidade,
                    cep: formData.cep,
                    email: formData.email,
                };
                if (fotoUrl) updateData.avatarUrl = fotoUrl;

                const { error } = await supabase
                    .from("membros")
                    .update(
                        updateData)
                    .eq("id", membro.id)
                    .select();


                if (error) throw error;
            } else {
                // Novo membro
                const { error } = await supabase
                    .from("membros")
                    .insert({
                        nome: formData.nome,
                        slug,
                        avatarUrl: fotoUrl,
                        telefone: formData.telefone,
                        endereco: formData.endereco,
                        numero_residencia: formData.numero_residencia,
                        bairro: formData.bairro,
                        responsabilidade: formData.responsabilidade,
                        disponibilidade: formData.disponibilidade,
                        cep: formData.cep,
                        email: formData.email,
                    });

                if (error) throw error;
            }


            { isEditing ? alert("Membro Editado com Sucesso!") : alert("Membro salvo com sucesso!") };
            setLoading(false);
            onClose(); // fecha modal

            if (onSaved) onSaved();
        } catch (err) {
            console.error(err);
            { isEditing ? alert("Erro ao Editar Membro") : alert("Erro ao Salvar Membro") }
        } finally {
            setLoading(false); //Desativa o Loading Spinner
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const webpFile = await convertToWebP(file);

            // preview
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(webpFile);

            // salvar no estado

            setFormData((prev) => ({ ...prev, imageFile: webpFile }));
        }
    };


    const handleRemoveImage = () => {
        setPreview(null);
        setFormData((prev) => ({
            ...prev,
            imageFile: undefined
        }));
    };



    {
        return (
            <div className=" fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">


                <div className="bg-white w-90 h-5/6 mb-20 mt-20 sm:mt-15 md:mt-20  sm:w-9/12 sm:h-5/6 md:w-9/12 md:h-5/6  rounded-lg shadow-lg overflow-y-auto p-4 relative">
                    {/* Botão fechar */}
                    <button
                        onClick={() => onClose()}
                        className="absolute top-5 right-7 text-gray-600 hover:text-red-500 text-xl"
                    >
                        <X className="sm:h-8 sm:w-8 border-2 rounded-lg text-white hover:text-red-500" />
                    </button>

                    <h3 className={`text-md sm:text-2xl text-white font-bold mb-6 shadow-sm px-4 py-1 rounded-lg 
                    ${isEditing ? 'bg-linear-to-l from-blue-500 to-indigo-500' : 'bg-linear-to-l from-green-500 to-emerald-500'
                        }`}>
                        {isEditing ? "Editar Membro" : "Adicionar Membro"}</h3>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            Object.fromEntries(
                                new FormData(e.currentTarget).entries()
                            );
                            handleSubmit(e);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className={`flex flex-col items-center  p-2 bg-white                              
                                 rounded shadow-md mx-auto w-60 sm-w-full h-65 sm:mr-6 sm:mt-12 border ${isEditing ? 'border-blue-500' : 'border-green-400'}`}>
                                {/* Quadrado com ícone ou preview */}
                                <div className="relative w-full h-full  flex items-center justify-center border border-gray-300 rounded bg-gray-100">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Pré-visualização"
                                            className="w-full h-50 object-cover rounded"
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
                                    className={`mt-4 text-xs flex items-center gap-2 ${isEditing ? 'bg-blue-500' : 'bg-green-500'} text-white px-2 py-1 rounded hover:bg-gray-400 transition cursor-pointer`}
                                >
                                    <CameraIcon className="h-5 w-5" />
                                    {isEditing ? "Alterar Imagem" : "Adicionar Imagem"}
                                </label>

                                <input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                            </div>

                            <div className="w-full flex flex-col gap-2 sm:gap-3 mt-5">
                                <div className="flex flex-col gap-2 sm:flex-row md:flex-row xjustify-between">
                                    <div className="w-full">
                                        <label htmlFor="nome" className="text-md font-semibold">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            id="nome"
                                            required
                                            name="nome"
                                            value={formData.nome || ""}
                                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                            className=" w-full border border-gray-300 text-gray-700 font-[Poppins] p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>

                                </div>

                                <div >
                                    <label htmlFor="telefone" className="text-md font-semibold">Telefone</label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        required
                                        maxLength={14}
                                        value={formData.telefone || ""}
                                        onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                                        placeholder="(xx)xxxx-xxxx"
                                        className=" border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    />

                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row md:flex-row sm:items-center justify-between ">
                                    <div className="w-full">
                                        <label
                                            htmlFor="endereco"
                                            className="text-md font-semibold"> Endereço </label>
                                        <input
                                            type="text"
                                            name="endereco"
                                            required
                                            value={formData.endereco || ""}
                                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                            className="w-full border border-gray-300 p-2  text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>
                                    <div className=" flex w-25 flex-col sm:justify-center">
                                        <label htmlFor="numeroCasa" className="text-md font-semibold"> Número </label>
                                        <input
                                            type="text"
                                            name="numeroCasa"
                                            required
                                            value={formData.numero_residencia || ""}
                                            onChange={(e) => setFormData({ ...formData, numero_residencia: e.target.value })}
                                            placeholder="Num"
                                            className=" border border-gray-300   text-gray-700 font-[Poppins] p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>

                                </div>

                                <div className="flex items-start flex-col sm:flex-row gap-2 justify-between">
                                    <div className="w-full">
                                        <label
                                            htmlFor="bairro"
                                            className="text-md font-semibold"> Bairro </label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            required
                                            value={formData.bairro || ""}
                                            onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                                            className="w-full border border-gray-300  p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>
                                    <div className="w-50  sm:w-35 flex flex-col ">
                                        <label htmlFor="cep" className="text-md font-semibold"> CEP </label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={formData.cep || ""}
                                            maxLength={9}
                                            onChange={(e) => setFormData({ ...formData, cep: formatarCep(e.target.value) })}
                                            placeholder="CEP"
                                            className=" border border-gray-300  text-gray-700 font-[Poppins] p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>
                                </div>


                            </div>

                        </div>
                        <div >
                            <label htmlFor="responsabilidade" className="text-md font-semibold"> Responsabilidade </label>
                            <input
                                type="text"
                                name="responsabilidade"
                                value={formData.responsabilidade || ""}
                                onChange={(e) => setFormData({ ...formData, responsabilidade: e.target.value })}
                                className="w-full border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                        </div>
                        <div >
                            <label htmlFor="disponibilidade" className="text-md font-semibold"> Disponibilidade </label>
                            <input
                                type="text"
                                name="disponibilidade"
                                value={formData.disponibilidade || ""}
                                onChange={(e) => setFormData({ ...formData, disponibilidade: e.target.value })}
                                className="w-full border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                        </div>

                        <div >
                            <label htmlFor="email" className="text-md font-semibold"> E-mail </label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                        </div>


















                        {loading ? (
                            <div className="fixed inset-0 bg-white/40 bg-opacity-10 flex items-center justify-center z-50">
                                <span className="animate-spin border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full w-12 h-12"></span>
                            </div>

                        ) :
                            <div className="col-span-2 flex justify-end mt-4">
                                <button

                                    type="submit"
                                    className={`px-5 py-1 ${isEditing ? 'bg-linear-to-r from-blue-500 to-indigo-600' : 'bg-linear-to-r from-green-500 to-emerald-600'} font-[Poppins] shadow-md text-white rounded cursor-pointer`}
                                >
                                    {isEditing ? "Salvar Alterações" : "Cadastrar"}
                                </button>
                            </div>
                        }




                    </form>
                </div>
            </div>)
    }
}


