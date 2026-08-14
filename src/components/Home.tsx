import { MessageCircleIcon } from "lucide-react";
import { useStyle } from "../context/StyleContext";
import { useAniversariante } from "../hooks/useAniversariante";




export function Home() {
    const { cores } = useStyle();
    const { doMes, doDia, loading } = useAniversariante();
    const mesAtual = new Date().toLocaleString('default', { month: 'long' });

    /*
    const eventos = [
        { nome: "Reunião de Equipe", data: "02/03/2026" },
        { nome: "Palestra sobre Autismo", data: "15/03/2026" },
        { nome: "Campanha de Doação", data: "28/03/2026" }
    ];
    */

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div >
            <header className={`h-full mt-10 md:mt-5`}>
                <h1 className={`font-['Style_Script',cursive] text-4xl bg-clip-text text-center ${cores.gradientBlue} text-transparent`}>
                    Associação Candidomotense de Apoio a Pessoas com Transtorno do Espectro Autista
                </h1>
                <p className="font-[Poppins] text-gray-500 text-sm text-center">
                    Bem Vindo ao Sistema de Cadastros Aucatea !
                </p>

            </header>

            <div className="w-full border border-gray-100 rounded mt-5  h-full flex flex-col items-center justify-center gap-4 bg-white  ">
                {doDia.length > 0 && (
                    <div className="border border-gray-300 p-2 rounded flex flex-col items-center justify-center ">
                        <h2 className="bg-linear-to-r from-blue-500 to-sky-500 px-4 mb-2 rounded text-white/90 animate-pulse">Nosso Parabéns hoje é para: </h2>
                        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                            {doDia.map((aniversariante, index) => {
                                const idade = Math.floor((new Date().getTime() - new Date(aniversariante.data_nascimento + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24 * 365.25));
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
                                            <span className="text-xs text-gray-600 font-medium ">
                                                <span className="font-bold bg-sky-500 rounded-lg px-1 text-white">
                                                    {idade}</span> {idade < 2 ? "ano" : "anos"}
                                            </span>
                                            <a
                                                href={`https://wa.me/55${aniversariante.telefone}?text=${encodeURIComponent("Olá quero mais informações")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircleIcon className="absolute bottom-2 right-2 w-5 h-5 text-green-600 hover:fill-green-300 cursor-pointer" />
                                            </a>
                                        </div>
                                    </div>
                                )
                            }
                            )}


                        </div>
                    </div>
                )}
                {doDia.length === 0 && (
                    <div className="w-full md:h-20 p-2 bg-white rounded   overflow-y-auto">
                        <p className="text-gray-700 font-[Poppins] text-center"></p>
                    </div>
                )}
                <section className=" w-full p-2 flex flex-col md:flex-row items-start justify-center gap-10  ">
                    <div className="w-full border border-gray-300 p-2 bg-white rounded   overflow-y-auto">
                        <div className=" flex items-center justify-between bg-linear-to-r from-blue-500 to-sky-400 px-2 py-2 rounded  ">
                            <h2 className="text-white/90 font-[Poppins]"><span className="bg-white/30 px-3 font-bold text-white rounded-full">{doMes.length}</span>Aniversariantes do Mês </h2>
                            <span className="bg-white/30 px-3 font-bold text-white rounded-full">{mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1)}</span>
                        </div>
                        {doMes.map((aniversariante, index) => {
                            const idade = Math.floor((new Date().getTime() - new Date(aniversariante.data_nascimento + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24 * 365.25));
                            const ehDoDia = doDia.some(d => d.id === aniversariante.id);

                            return (
                                <div key={index} className="flex items-center justify-between  border-b border-gray-300 mt-2">
                                    <div className={`flex items-center justify-between w-full mb-1 ${ehDoDia ? "bg-green-100 rounded" : ""}`} >
                                        <span className="text-[0.8rem] text-gray-700 font-[Poppins] font-medium ml-1 truncate pr-1">{aniversariante.nome}</span>
                                        <div className="flex flex-col-reverse sm:flex-row max-w-20 sm:max-w-40 gap-x-2 justify-between">
                                            <span className="text-[0.8rem] text-gray-600  border border-sky-500 px-2 rounded ">
                                                <span className="font-bold">
                                                    {new Date(aniversariante.data_nascimento + "T00:00:00").getDate().toString().padStart(2, "0")}
                                                </span>
                                                /{(new Date(aniversariante.data_nascimento + "T00:00:00").getMonth() + 1).toString().padStart(2, "0")}
                                                /{new Date(aniversariante.data_nascimento + "T00:00:00").getFullYear()}

                                            </span>
                                            <p className="bg-linear-to-r from-sky-300  to-sky-500 text-gray-200 rounded-t-md sm:rounded-lg w-17 text-center text-xs md:text-sm m-auto">
                                                <span className="font-bold text-white font-[Poppins]">
                                                    {idade}</span> {idade < 2 ? "ano" : "anos"}</p>
                                        </div>
                                    </div>
                                </div>

                            )
                        })}
                    </div>


                </section>
            </div >
        </div >

    );
}

