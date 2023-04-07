import { create } from "zustand";

const calendarStore = create((set) => ({
    currDate: new Date(),

    gridSquares: 0,

    firstDay: null,

    grid: [],

    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],

    setCurrMonth: (month) => {
        const date = new Date(calendarStore.getState().currDate);
        set({
            currDate: date.setMonth(month)
        });
    },

    fetchGrid: () => {
        try {

            const elementsToRemove = document.querySelectorAll('.race');

            elementsToRemove.forEach(element => {
                element.remove();
            });



            const currDate = new Date(calendarStore.getState().currDate);

            //Store various important days (first day of the month, last month's first date that appears, last day of the month)
            const firstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1).getDay();
            const lastMonthStart = new Date(currDate.getFullYear(), currDate.getMonth(), 0).getDate() - (firstDay - 1);
            const lastDay = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0);

            const refDate = new Date();
            let squares = 0;
            const grid = [];

            for(let i = 0; i < firstDay; i++) {
                grid.push(<div className="last-month" key={0 - i}>{lastMonthStart + i}</div>);
                squares++;
            }
            for(let i = 1; i <= lastDay.getDate(); i++){
                if(i === currDate.getDate() && currDate.getMonth() === refDate.getMonth() && currDate.getFullYear() === refDate.getFullYear())
                    grid.push(<div className="today" key={i}>{i}</div>);
                else grid.push(<div className="date" key={i}>{i}</div>);
                squares++;
            }
            for(let i = lastDay.getDay() + 1; i < 7; i++) {
                grid.push(<div className="next-month" key={32 + i}>{i - lastDay.getDay()}</div>);
                squares++;
            }

            set({
                gridSquares: squares,
                grid
            });
        } catch(err) {
            console.log(err);
        }
   }
}))

export default calendarStore;
