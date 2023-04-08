import calendarStore from "../stores/calendarStore";
import racesStore from "../stores/racesStore";
import EventCalendarButton from './EventCalendarButton';
import React from "react";

export default function Toggler() {
    const {fo1, wrc, gt3, setChecked, loadRaces} = racesStore();
    const {fetchGrid} = calendarStore();
    const events = racesStore(state => state.events);

    return(
        <div className="toggler">
            <div className="header">
                <h1>Series</h1>
            </div>

            <div className="toggler-body">
                <div className="sport f1" onClick={()=>{setChecked("fo1", fo1); fetchGrid(); loadRaces();}}>
                    <p>Formula 1</p>
                    {fo1 ? <i className="material-icons next">check_box</i> :
                    <i className="material-icons next">check_box_outline_blank</i>}
                </div>
                <div className="sport gt3" onClick={()=>{setChecked("gt3", gt3); fetchGrid(); loadRaces();}}>
                    <p>GT3 World Challenge</p>
                    {gt3 ? <i className="material-icons next">check_box</i> :
                    <i className="material-icons next">check_box_outline_blank</i>}
                </div>
                <div className="sport wrc" onClick={()=>{setChecked("wrc", wrc); fetchGrid(); loadRaces();}}>
                    <p>World Rally Championship</p>
                    {wrc ? <i className="material-icons next">check_box</i> :
                    <i className="material-icons next">check_box_outline_blank</i>}
                </div>
            </div>
            {events && <EventCalendarButton events={events}/>}
        </div>
    )
}
