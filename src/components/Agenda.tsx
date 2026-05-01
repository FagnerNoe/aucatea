


import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export function Agenda() {
    const handleDateClick = (info: { dateStr: string; }) => {
        alert("Você clicou em: " + info.dateStr);
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            events={[
                { title: "Consulta João", date: "2026-05-05" },
                { title: "Consulta Maria", date: "2026-05-07" }
            ]}
        />
    );
}



