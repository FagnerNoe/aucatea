import jsPDF from "jspdf";
import { CameraIcon, ChevronDownIcon, ChevronUpIcon, PaperclipIcon, UserIcon, X, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import { useAuth } from "../context/AuthContext";
import type { Paciente } from "../types/database.types";






type PacienteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    paciente?: Paciente | null;
    onSaved: () => void; // callback para atualizar a lista de pacientes
}


export function PacienteModal({ isOpen, onClose, paciente, onSaved }: PacienteModalProps) {
    const isEditing = !!paciente
    const [preview, setPreview] = useState<string | null>(null);
    const [previewLaudo, setPreviewLaudo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { user } = useAuth();


    const escolas = [
        "A Confirmar...",
        "E.E Rachid Jabur",
        "E.E Antônio Fontana",
        "E.E Prof.ª Clotilde de Castro Barreira(Grupão)",
        "E.E José dos Santos Almeida",
        "E.E Dr. José Augusto de Carvalho",
        "E.E Prof. Luiz Pires Barbosa(Etec)",
        "EMEI Valter Aparecido Franciscatti",
        "EMEI Leonilda Pereira de Almeida(Parque Santa Cruz)",
        "EMEI João e Maria(Jardim Alvorada)",
        "EM Prof.ª Olga Breve Alves (Cohab Nosso Teto)",
        "EM João Leão de Carvalho",
        "EM Helena Pupim Albanez",
        "EM Jardim São Francisco",
        "EM Casa da Criança Nossa Senhora das Dores",
        "Creche Menino Jesus(Vila Assunta)",
        "Colégio Santa Clara",
        "Colégio Santos Anjos(Sistema Objetivo)",
        "Primeiros Passos Escola de Educação Infantil",
        "Maria Pagote Conte Escola de Educação Especial APAE",
        "Outros"
    ];

    const convenios = [
        "SUS",
        "Unimed",
        "Cartão de Todos",
        "IAMSP",
        "Amil",
        "Bradesco Saúde",
        "SulAmérica",
        "Notredame Intermédica",
        "Hapvida",
        "Outros"
    ];

    const opcoesTratamentos = [
        { id: "Psicologo", label: "Psicólogo" },
        { id: "Terapeuta Ocupacional", label: "Terapeuta Ocupacional" },
        { id: "Fonoaudiologia", label: "Fonoaudiologia" },
        { id: "Musicoterapeuta", label: "Musicoterapeuta" },
        { id: "Psicopedagogo", label: "Psicopedagogo" },
        { id: "Equoterapia", label: "Equoterapia" },
        { id: "outros", label: "Outros" },
    ];




    useEffect(() => {
        if (paciente) {
            console.log(paciente)
            setFormData({
                nome: paciente.nome || "",
                endereco: paciente.endereco || "",
                numeroCasa: paciente.numero_casa || "",
                complemento: paciente.complemento_endereco || "",
                mae: paciente.nome_mae || "",
                pai: paciente.nome_pai || "",
                email: paciente.email_principal || "",
                telefoneMae: paciente.telefone_mae || "",
                telefonePai: paciente.telefone_pai || "",
                escola: paciente.escola || "",
                escola_externa: paciente.escola_externa || '',
                laudo: paciente.laudo || [],
                convenio: paciente.convenio || convenios[0],
                tratamentos: paciente.tratamentos || [],
                dataNascimento: paciente.data_nascimento || "",
                bairro: paciente.bairro || "",
                cep: paciente.cep || "",

            });

            setPreview(paciente.foto_paciente || null);
            setPreviewLaudo(paciente.laudo_url || null);
            setSelecionados(paciente.tratamentos || []);

        } else {
            setFormData({
                nome: "",
                endereco: "",
                numeroCasa: "",
                complemento: "",
                mae: "",
                pai: "",
                email: "",
                telefoneMae: "",
                telefonePai: "",
                escola: "",
                escola_externa: "",
                convenio: convenios[0],
                laudo: [],
                dataNascimento: "",
                tratamentos: [],
                bairro: "",
                cep: "",
            });

            setPreview(null);
            setPreviewLaudo(null);
            setSelecionados([]);
        }
    }, [paciente, isOpen]);

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

    const convertImageToPDF = async (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgData = e.target?.result as string;
                const pdf = new jsPDF();
                pdf.addImage(imgData, "JPEG", 10, 10, 180, 160);

                const pdfBlob = pdf.output("blob");
                const pdfFile = new File([pdfBlob], file.name.replace(/\.\w+$/, ".pdf"), {
                    type: "application/pdf",
                });
                setFormData((prev) => ({ ...prev, laudoFile: pdfFile }));
                resolve(pdfFile);
            };
            reader.readAsDataURL(file);


        });
    };


    const toggleSelecionado = (id: string) => {
        setSelecionados((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
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
            let laudoUrl: string | undefined;

            const { data: files, error } = await supabase.storage
                .from("pacientes_fotos")
                .list(); // lista objetos/pastas no bucket

            if (error) throw error;

            const existentes = files.map(f => f.name); // nomes já existentes            
            const slug = paciente?.slug ?? gerarSlugPaciente(formData.nome, existentes);


            // Se tiver foto, faz upload para o bucket "pacientes"
            if (formData.imageFile) {
                const filePath = `${slug}/foto-${Date.now()}.webp`;

                const { data, error } = await supabase.storage
                    .from("pacientes_fotos")
                    .upload(filePath, formData.imageFile, { upsert: true });

                if (error) throw error;
                if (!data) throw new Error("Upload não retornou caminho");
                fotoUrl = supabase.storage
                    .from("pacientes_fotos")
                    .getPublicUrl(filePath).data.publicUrl;
            }


            if (formData.laudoFile) {
                const filePath = `${slug}/laudo-${Date.now()}.pdf`;
                const { data, error } = await supabase.storage
                    .from("pacientes_fotos")
                    .upload(filePath, formData.laudoFile, { upsert: true });

                if (error) throw error;
                if (!data) throw new Error("Upload não retornou caminho");
                console.log(formData.laudoFile instanceof File);
                laudoUrl = supabase.storage
                    .from("pacientes_fotos")
                    .getPublicUrl(filePath).data.publicUrl;
            }

            // Se for edição de paciente existente
            if (paciente) {
                const updateData: any = {
                    nome: formData.nome,
                    data_nascimento: formData.dataNascimento,
                    endereco: formData.endereco,
                    numero_casa: formData.numeroCasa,
                    complemento_endereco: formData.complemento,
                    bairro: formData.bairro,
                    cep: formData.cep,
                    email_principal: formData.email,
                    nome_mae: formData.mae,
                    nome_pai: formData.pai,
                    atualizado_por_id: user.id,
                    telefone_mae: formData.telefoneMae,
                    telefone_pai: formData.telefonePai,
                    escola: formData.escola,
                    escola_externa: formData.escola_externa,
                    convenio: formData.convenio || convenios[0],
                    laudo: formData.laudo,
                    tratamentos: selecionados,
                    data_atualizacao: new Date().toISOString(),
                };
                if (fotoUrl) updateData.foto_paciente = fotoUrl;
                if (laudoUrl) updateData.laudo_url = laudoUrl;


                const { error } = await supabase
                    .from("pacientes")
                    .update(
                        updateData)
                    .eq("id", paciente.id)
                    .select();


                if (error) throw error;
            } else {
                // Novo paciente
                const { error } = await supabase
                    .from("pacientes")
                    .insert({
                        nome: formData.nome,
                        slug,
                        data_nascimento: formData.dataNascimento,
                        endereco: formData.endereco,
                        numero_casa: formData.numeroCasa,
                        complemento_endereco: formData.complemento,
                        bairro: formData.bairro,
                        cep: formData.cep,
                        nome_mae: formData.mae,
                        nome_pai: formData.pai,
                        foto_paciente: fotoUrl,
                        laudo_url: laudoUrl,
                        cadastrado_por_id: user.id,
                        telefone_mae: formData.telefoneMae,
                        telefone_pai: formData.telefonePai,
                        email_principal: formData.email,
                        escola: formData.escola,
                        escola_externa: formData.escola_externa,
                        convenio: formData.convenio || convenios[0],
                        laudo: formData.laudo,
                        tratamentos: selecionados,
                        data_criacao: new Date(),


                    });

                if (error) throw error;
            }


            { isEditing ? alert("Paciente Editado com Sucesso!") : alert("Paciente salvo com sucesso!") };
            setLoading(false);

            onClose(); // fecha modal
            console.log("atualizado em:", paciente?.data_atualizacao)
            onSaved();
        } catch (err) {
            console.error(err);
            { isEditing ? alert("Erro ao Editar Paciente") : alert("Erro ao Salvar Paciente") }
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


    const handleRemoveImage = (e: any) => {
        e.preventDefault();
        setPreview(null);
        setFormData((prev) => ({
            ...prev,
            imageFile: undefined
        }));
    };

    const handleImageLaudoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Converte a imagem para PDF
            const pdfFile = await convertImageToPDF(file);

            // Preview do laudo (mostra a imagem original antes da conversão)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLaudo(reader.result as string);
                setLoading(false);
            };
            reader.readAsDataURL(file);

            setFormData((prev) => ({ ...prev, laudoFile: pdfFile }));
        }
    };

    const handleRemoveLaudoImage = () => {
        setPreviewLaudo(null);
        setFormData((prev) => ({
            ...prev,
            laudoFile: undefined
        }));
    }


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

                    <h3 className={`text-md sm:text-2xl text-white font-bold mb-6 shadow-sm px-4 py-1 rounded
                    ${isEditing ? 'bg-linear-to-l from-blue-500 to-indigo-500' : 'bg-linear-to-l from-green-500 to-emerald-500'
                        }`}>
                        {isEditing ? "Editar Paciente" : "Novo Paciente"}</h3>

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
                                 rounded shadow-md mx-auto w-60   h-65 sm:mr-6 sm:mt-12 border ${isEditing ? 'border-blue-500' : 'border-green-400'}`}>
                                {/* Quadrado com ícone ou preview */}
                                <div className="relative w-full h-full  border border-gray-300 rounded bg-gray-100">

                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="w-full h-52 object-cover rounded" />
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 z-20 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg transition-transform hover:scale-110 border border-white/20"
                                                title="Remover Foto"
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                            </button></>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <UserIcon className="h-12 w-12" />
                                            <span className="text-sm mt-2">Foto do Paciente</span>
                                        </div>
                                    )}

                                    {/* Botão de Remover: Sempre visível se houver imagem carregada */}




                                </div>



                                {/* Botão abaixo do quadrado */}
                                <label
                                    htmlFor="imageInput"
                                    className={`mt-2 text-xs flex items-center gap-2 ${isEditing ? 'bg-blue-500' : 'bg-green-500'} text-white px-2 py-1 rounded hover:bg-gray-400 transition cursor-pointer`}
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
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="dataNascimento" className="text-md font-semibold">
                                            Data de Nascimento
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            id="dataNascimento"
                                            name="dataNascimento"
                                            value={formData.dataNascimento || ""}
                                            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                                            className=" border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>
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
                                            type="number"
                                            name="numeroCasa"
                                            required
                                            value={formData.numeroCasa || ""}
                                            onChange={(e) => setFormData({ ...formData, numeroCasa: e.target.value })}
                                            placeholder="Num"
                                            className=" border border-gray-300   text-gray-700 font-[Poppins] p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        />
                                    </div>

                                </div>

                                <div className="flex items-start flex-col sm:flex-row gap-2 justify-between">
                                    <div className="w-full">
                                        <label
                                            htmlFor="bairro"
                                            className="text-md font-semibold"> Bairro / Distrito </label>
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
                                <div >
                                    <label htmlFor="complemento" className="text-md font-semibold"> Complemento / Referência </label>
                                    <input
                                        type="text"
                                        name="complemento"
                                        value={formData.complemento || ""}
                                        onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}

                                        className="w-full border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-row items-center justify-between gap-2">
                            <div className=" w-full ">
                                <label
                                    htmlFor="mae"
                                    className="text-md font-semibold ">Nome da Mãe
                                </label>
                                <input
                                    type="text"
                                    name="mae"
                                    required
                                    value={formData.mae || ""}
                                    onChange={(e) => setFormData({ ...formData, mae: e.target.value })}
                                    className="w-full border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                />

                            </div>
                            <div >
                                <label htmlFor="telefoneMae" className="text-md font-semibold">Celular da Mãe</label>
                                <input
                                    type="text"
                                    name="telefoneMae"
                                    required
                                    maxLength={14}
                                    value={formData.telefoneMae || ""}
                                    onChange={(e) => setFormData({ ...formData, telefoneMae: formatarTelefone(e.target.value) })}
                                    placeholder="(xx)xxxx-xxxx"
                                    className=" border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                />

                            </div>

                        </div>
                        <div className="flex flex-col sm:flex-row md:flex-row items-center justify-between gap-2">
                            <div className=" w-full">
                                <label
                                    htmlFor="pai"
                                    className="text-md font-semibold ">Nome do Pai
                                </label>
                                <input
                                    type="text"
                                    name="pai"
                                    value={formData.pai || ""}
                                    onChange={(e) => setFormData({ ...formData, pai: e.target.value })}
                                    className="w-full border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                />

                            </div>
                            <div >
                                <label htmlFor="telefonePai" className="text-md font-semibold">Celular do Pai</label>
                                <input
                                    type="text"
                                    name="telefonePai"
                                    maxLength={14}
                                    value={formData.telefonePai || ""}
                                    onChange={(e) => setFormData({ ...formData, telefonePai: formatarTelefone(e.target.value) })}
                                    placeholder="(xx)xxxx-xxxx"
                                    className="border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                />

                            </div>

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
                        <div >
                            <label htmlFor="escola" className="text-md font-semibold"> Instituição de Ensino </label>
                            <select
                                id="escola"
                                name="escola"
                                required
                                value={formData.escola || ""}
                                onChange={(e) => setFormData({ ...formData, escola: e.target.value })}
                                className="w-full border border-gray-300  text-gray-700 font-[Poppins] p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            >

                                {escolas.map((escola, index) => (
                                    <option
                                        key={index} value={escola}>
                                        {escola}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div >
                            <label htmlFor="escola_externa" className="text-sm sm:text-md font-semibold"> Instituição de Ensino (Fora de Cândido Mota)</label>
                            <input
                                type="text"
                                name="escola_externa"
                                value={formData.escola_externa || ""}
                                onChange={(e) => setFormData({ ...formData, escola_externa: e.target.value })}
                                className="w-full border border-gray-300 p-2 text-gray-700 font-[Poppins] rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                        </div>

                        <div className="flex items-center justify-start space-x-4">
                            <div>
                                <label
                                    htmlFor="laudo"
                                    className="font-semibold text-md"
                                >
                                    Laudo
                                </label>
                                <input
                                    type="text"
                                    name="laudo"
                                    value={formData.laudo.join(", ")} // mostra valores separados
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            laudo: e.target.value.split(",").map(v => v.trim()).filter(Boolean)
                                        })
                                    }
                                    className="w-full border border-gray-300 p-2 rounded-lg"
                                />

                            </div>


                            <div>
                                <label
                                    htmlFor="convenio"
                                    className="font-semibold text-md"
                                >
                                    Convênio Médico
                                </label>
                                <select
                                    id="convenio"
                                    name="convenio"
                                    required
                                    value={formData.convenio}
                                    onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
                                    className="w-full border border-gray-300  text-gray-700 font-[Poppins] p-2 rounded-lg col-span-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                >

                                    {convenios.map((convenio, index) => (
                                        <option key={index} value={convenio}>
                                            {convenio}
                                        </option>
                                    ))}
                                </select>
                            </div>



                        </div>

                        <div className="w-full ">
                            <label className="font-semibold text-md">Tratamentos</label>
                            <div className="relative ">
                                {/* Botão que abre o dropdown */}
                                <button
                                    type="button"
                                    onClick={() => setOpen(!open)}
                                    className="w-full flex items-center  text-gray-700 font-[Poppins] justify-between border border-gray-300 p-2 h-10 rounded-sm text-left  focus:outline-none focus:ring-1 focus:ring-purple-400"
                                >
                                    <span className="w-full truncate">
                                        {selecionados.length > 0
                                            ?
                                            opcoesTratamentos
                                                .filter((o) => selecionados.includes(o.id))
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
                                        {opcoesTratamentos.map((opcao) => (
                                            <label
                                                key={opcao.id}
                                                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selecionados.includes(opcao.id)}
                                                    onChange={() => toggleSelecionado(opcao.id)}
                                                    className="mr-2"
                                                />
                                                {opcao.label}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>







                        {/* Uploads */}
                        <div className="flex flex-col items-center p-2 bg-white rounded shadow-md max-w-md mx-auto h-lg">
                            <label
                                htmlFor="imageLaudoInput"
                                className="flex items-center gap-2 bg-linear-to-r shadow-md from-sky-500 to-blue-600 text-white px-4 rounded hover:bg-white transition cursor-pointer"
                            >
                                <PaperclipIcon className="h-4 w-4" />
                                {isEditing ? "Alterar Anexo do Laudo" : "Anexar Laudo"}
                            </label>

                            <input
                                type="file"
                                id="imageLaudoInput"
                                accept="image/*"
                                onChange={handleImageLaudoChange}
                                className="hidden" />

                            {previewLaudo && (
                                <div className="relative mt-4">
                                    {isEditing ? (
                                        // Edição: mostrar ícone + link
                                        <div className="flex flex-col items-center space-x-2">
                                            <iframe
                                                src={previewLaudo}
                                                title="laudo"
                                                className="w-full object-fill"
                                            />

                                        </div>
                                    ) : (
                                        // Adição: mostrar preview real
                                        previewLaudo.endsWith(".pdf") ? (
                                            <iframe
                                                src={previewLaudo}
                                                title="Pré-visualização do laudo"
                                                className="w-full h-64 border rounded"
                                            />
                                        ) : (
                                            <img
                                                src={previewLaudo}
                                                alt="Pré-visualização"
                                                className="max-w-full rounded border"
                                            />
                                        )
                                    )}

                                    <button
                                        onClick={handleRemoveLaudoImage}
                                        className="absolute top-2 right-2 bg-white text-red-700 rounded-full p-1 hover:bg-red-700"
                                    >
                                        <XCircleIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            )}

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


                        {/* Botão salvar */}

                    </form>
                </div >
            </div >
        )
    }
}
