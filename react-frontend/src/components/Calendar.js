import calendarStore from '../stores/calendarStore';

export default function Calendar() {
    const store = calendarStore();
    const currDate = new Date(calendarStore((state) => state.currDate));

    //Store various important days (first day of the month, last month's first date that appears, last day of the month)
    const firstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1).getDay();
    const lastMonthStart = new Date(currDate.getFullYear(), currDate.getMonth(), 0).getDate() - (firstDay - 1);
    const lastDay = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0);

    const grid = [];
    const refDate = new Date();
    let squares = 0;

    for(let i = 0; i < firstDay; i++) {
        grid.push(<div className="last-month" key={0 - i}>{lastMonthStart + i}</div>);
        squares++;
    }
    for(let i = 1; i <= lastDay.getDate(); i++){
        if(i === currDate.getDate() && currDate.getMonth() === refDate.getMonth() && currDate.getFullYear() === refDate.getFullYear())
            grid.push(<div className="today" key={i}><div>{i}</div></div>);
        else grid.push(<div><div className="date" key={i}>{i}</div></div>);
        squares++;
    }
    for(let i = lastDay.getDay() + 1; i < 7; i++) {
        grid.push(<div className="next-month" key={lastDay + i}>{i - lastDay.getDay()}</div>);
        squares++;
    }

    return(
        <div className="calendar">
            <div className="header">
                <i className="material-icons prev" onClick={() => {store.setCurrMonth(currDate.getMonth() - 1)}}>arrow_left</i>
                <div className="month">
                    <h1>{store.months[currDate.getMonth()]}</h1>
                    <p>{currDate.getFullYear()}</p>
                </div>
                <i className="material-icons next" onClick={() => {store.setCurrMonth(currDate.getMonth() + 1)}}>arrow_right</i>
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

            {squares && squares > 35 &&
                <div className="grid sixrows">
                {grid.map((square) => {return square;})}
                </div>
            }
            {squares && squares <= 35 &&
                <div className="grid fiverows">
                {grid.map((square) => {return square;})}
                </div>
            }

        </div>
    );
}
