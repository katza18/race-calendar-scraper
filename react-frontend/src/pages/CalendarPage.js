import Calendar from "../components/Calendar";
import Toggler from "../components/Toggler";
import React from "react";

export default function CalendarPage() {
    return(
        <div className="calendar-page">
            <Calendar />
            <Toggler />
        </div>
    );
}
