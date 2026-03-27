import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const events = [
    { title: 'Meeting', start: new Date() }
]

export function Agenda() {
    return (
        <div className='h-full bg-white'>
            <h1 className='text-center font-[Poppins] bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-emerald-300 text-xl font-bold'>Agenda</h1>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={events}
                eventContent={renderEventContent}
            />
        </div>
    )
}

// a custom render function
function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}