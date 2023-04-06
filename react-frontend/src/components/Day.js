import calendarStore from "../stores/calendarStore";

export default function Day({day}) {
    const dayDate = new Date(day);
    const currDate = new Date(calendarStore(state => state.currDate))
    return(
        {currDate && currDate.getMonth() == }
    )
}
