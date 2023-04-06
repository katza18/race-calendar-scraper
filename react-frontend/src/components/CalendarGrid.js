import calendarStore from "../stores/calendarStore";

export default function CalendarGrid() {
    const lastMonth = [];

    return(
        {/**Last months days */}
        {lastMonth.map(day => {
            return <Day day={day} />
        })}
    )
}
