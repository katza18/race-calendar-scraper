import calendarStore from '../stores/calendarStore';
import {useEffect} from 'react';
import racesStore from '../stores/racesStore';
import React from 'react';

export default function Calendar() {
    const {fetchRaces, loadRaces} = racesStore();
    const {fetchGrid} = calendarStore();
    useEffect(() => {
        fetchGrid();
        fetchRaces();
        loadRaces();
    }, []);

    const store = calendarStore();
    const currDate = new Date(calendarStore((state) => state.currDate));
    const gridSquares = calendarStore((state) => state.gridSquares);
    const grid = calendarStore((state) => state.grid);

    return(
        <div className="calendar">
            <div className="header">
                <i className="material-icons prev" onClick={async() => {await store.setCurrMonth(currDate.getMonth() - 1); await fetchGrid(); loadRaces()}}>arrow_left</i>
                <div className="month">
                    <h1>{store.months[currDate.getMonth()]}</h1>
                    <p>{currDate.getFullYear()}</p>
                </div>
                <i className="material-icons next" onClick={async() => {await store.setCurrMonth(currDate.getMonth() + 1); await fetchGrid(); loadRaces()}}>arrow_right</i>
            </div>

            <div className="days">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            {gridSquares > 35 ?
                <div className="grid sixrows">
                {grid.map((square) => {return square;})}
                </div>
                : <div className="grid fiverows">
                {grid.map((square) => {return square;})}
                </div>
            }
        </div>
    );
}
