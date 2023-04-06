import { create } from "zustand";

const calendarStore = create((set) => ({
    currDate: new Date(),

    day: "",

    squares: 0,

    firstDay: null,

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
        const currDate = new Date(calendarStore.getState().currDate)
        set({
            currDate: currDate.setMonth(month)
        });
    },

    setCurrYear: (date) => {
        set({
            currYear: date.getFullYear()
        });
    },

    setFirstDay: (date) => {
        set({
            firstDay: new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        });
    }
}))

export default calendarStore;
