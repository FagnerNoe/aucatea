import { MessageCircleIcon } from "lucide-react";
import { useStyle } from "../context/StyleContext";
import { useAniversariante } from "../hooks/useAniversariante";




export function Home() {
    const { cores } = useStyle();
    const { doMes, doDia, loading } = useAniversariante();
    const mesAtual = new Date().toLocaleString('default', { month: 'long' });




    const eventos = [
        { nome: "Reunião de Equipe", data: "30/03/2026" },
        { nome: "Palestra sobre Autismo", data: "15/04/2026" },
        { nome: "Campanha de Doação", data: "20/04/2026" }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="mt-10 md:mt-5 lg:mt-0 ">
            <h1 className={`font-['Style_Script',cursive] text-4xl bg-clip-text text-center ${cores.gradientBlue} text-transparent`}>
                Associação Candidomotense de Apoio a Pessoas com Transtorno do Espectro Autista
            </h1>
            <p className="font-[Poppins] text-gray-500 text-sm text-center">
                Bem Vindo ao Sistema de Cadastros Aucatea !
            </p>

            <div className="w-full mt-10  flex flex-col items-center justify-start gap-7 bg-white  ">
                {doDia.length > 0 && (
                    <div className="border border-gray-300 p-2 rounded flex flex-col items-center justify-center ">
                        <h2 className="bg-linear-to-r from-blue-500 to-sky-500 px-4 mb-2 rounded text-white/90 animate-pulse">Nosso Parabéns hoje é para: </h2>
                        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                            {doDia.map((aniversariante, index) => {
                                return (
                                    <div key={index} className="relative flex items-center gap-2 border border-blue-300 rounded py-2 px-4 shadow-md">
                                        {aniversariante.foto_paciente ? (
                                            <img src={aniversariante.foto_paciente} alt={aniversariante.nome} className="rounded-full w-14 h-14 object-cover" />
                                        ) : (
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(aniversariante.nome)}&background=random&color=fff&size=128`} alt={aniversariante.nome} className="rounded-full w-14 h-14" />
                                        )}
                                        <div className="flex flex-col ">
                                            <span className="text-xs text-gray-700 font-[Poppins] font-bold">{aniversariante.nome}</span>
                                            <span className="text-xs text-gray-700 font-medium">{new Date(aniversariante.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                                            <MessageCircleIcon className="absolute bottom-2 right-2 w-5 h-5 text-green-600 hover:fill-green-300 cursor-pointer" />

                                        </div>
                                    </div>
                                )
                            }
                            )}


                        </div>
                    </div>
                )}
                <section className="w-full flex flex-col md:flex-row items-start justify-center gap-10  ">
                    <div className="w-full border border-gray-300 p-2 bg-white rounded h-110 md:max-h-75 overflow-y-auto">
                        <div className=" flex items-center justify-between bg-linear-to-r from-blue-500 to-sky-400 px-2 py-2 rounded  ">
                            <h2 className="text-white/90 font-[Poppins]">Aniversariantes do Mês <span className="bg-white/30 px-3 font-bold text-white rounded-full">{doMes.length}</span></h2>
                            <span className="bg-white/30 px-3 font-bold text-white rounded-full">{mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1)}</span>
                        </div>
                        {doMes.map((aniversariante, index) => {
                            const ehDoDia = doDia.some(d => d.id === aniversariante.id);

                            return (
                                <div key={index} className="flex items-center justify-between  border-b border-gray-300 mt-2">
                                    <div className={`flex items-center justify-between w-full mb-1 ${ehDoDia ? "bg-green-100 rounded" : ""}`} >
                                        <span className="text-[0.8rem] text-gray-700 font-[] font-bold ml-1 truncate pr-1">{aniversariante.nome}</span>
                                        <span className="text-[0.8rem] text-gray-600  border border-green-500 px-2 rounded ">
                                            <span className="font-bold">
                                                {new Date(aniversariante.data_nascimento + "T00:00:00").getDate().toString().padStart(2, "0")}
                                            </span>
                                            /{(new Date(aniversariante.data_nascimento + "T00:00:00").getMonth() + 1).toString().padStart(2, "0")}
                                            /{new Date(aniversariante.data_nascimento + "T00:00:00").getFullYear()}

                                        </span>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-full border border-gray-300 p-2 bg-white rounded mb-10 max-h-80 md:max-h-75 overflow-y-auto">
                        <h2 className="bg-linear-to-r from-green-500 to-sky-400 px-4 py-2 mb-2 rounded text-white/90 font-[Poppins]">Eventos</h2>
                        {eventos.map((evento, index) => {
                            return (
                                <div key={index} className="flex items-center px-4 border-b border-gray-300 mt-2">

                                    <div className="flex items-center justify-between w-full ">
                                        <span className="text-[0.8rem] text-gray-700 font-[] font-bold">{evento.nome}</span>
                                        <span className="text-sm text-gray-600 font-bold bg-gray-100 px-2 rounded-full">{evento.data}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </section>
            </div>
        </div>

    );
}

