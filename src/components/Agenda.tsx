


import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";
import { Search } from "lucide-react";
import { useEventos } from "../hooks/useEventos";


export function Agenda() {
    const { events } = useEventos();
    const handleDateClick = (info: { dateStr: string; }) => {
        alert("Você clicou em: " + info.dateStr);
        console.log(events)
    };





    return (
        <div className="bg-white w-full ">
            <header className="bg-white text-center">
                <h1 className="text-xl font-bold font-['Poppins'] bg-clip-text bg-linear-to-r from-sky-500 to-blue-500 text-transparent mb-8" >Agenda</h1>
            </header>
            <div className="flex flex-col-reverse sm:flex-row md:flex-row lg:flex-row">
                <div className="w-full p-2">
                    <div className="flex gap-x-5">
                        <button className="bg-linear-to-r from-sky-400 to-blue-500 rounded-full px-4 shadow-md font-[Poppins] text-white cursor-pointer"> +Agendar</button>
                        <div className="relative w-full sm:w-xs md:w-xs  lg:w-sm xl-w ">
                            <input
                                type="text"
                                placeholder="Buscar uma Data ou Paciente..."


                                className="border border-gray-400 w-full px-10 py-2 rounded-full outline-blue-400 "
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>


                    </div>
                    <div className="w-full flex flex-col mt-4 p-2 space-y-2 bg-white rounded border border-sky-300 h-110 overflow-y-auto">
                        {events.map((evento, index) => {
                            const hora = new Date(evento.data_do_evento).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit"
                            });
                            return (

                                <div key={index} className=" w-full border border-blue-300 flex  items-center gap-x-2 px-2 py-1  rounded text-black/54 font-[Poppins]">
                                    <p className="bg-lime-100 px-3 rounded-lg font-bold text-lime-600">{hora}</p>
                                    <p className="w-full text-sm text-ellipsis truncate">{evento.nome_paciente}</p>
                                    <span className="text-sm w-full bg-amber-50 px-1 rounded-full text-center">{evento.titulo} </span>
                                </div>

                            )
                        })}
                    </div>
                </div>

                <div className="w-full mt-2">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        dateClick={handleDateClick}
                        height={500}
                        locale={ptLocale}
                        headerToolbar={{
                            left: "prev,next",
                            center: "title",
                            right: "dayGridMonth,dayGridWeek"
                        }}


                        events={events}
                    />
                </div>
            </div>
        </div>
    );
}



