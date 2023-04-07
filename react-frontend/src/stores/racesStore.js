import axios from 'axios';
import {create} from 'zustand';
import calendarStore from './calendarStore';

const racesStore = create((set, get) => ({

    allRaces: null,

    fo1: false,

    gt3: false,

    wrc: false,

    setChecked: (sport, checked) => {
        if (checked) {
            set({[sport]: false});
            return false;
        }
        set({[sport]: true});
        return true;
    },

    fetchRaces: async (series) => {
        //series is an array of the race series
        const res = await axios.get("/races");
        set({
            allRaces: res.data.races
        });
        get().loadRaces();
    },

    loadRaces: () => {
        const currDate = calendarStore.getState().currDate;
        const months = calendarStore.getState().months;
        const races = get().allRaces;
        const date = new Date(currDate);
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const boxes = document.querySelectorAll("div.grid div:not(.last-month, .next-month)");

        if(races){
        races.forEach(race => {
            const splitRace = race.split(" ");
            const raceMonth = splitRace[1];
            const raceYear = splitRace[3];

            if (raceMonth.localeCompare(month.substr(0, 3)) === 0 && raceYear.localeCompare(year) === 0) {
                const raceType = splitRace[0]
                const raceDay = splitRace[2];
                const name = race.slice(12);

                console.log(raceType)
                console.log(`${get()[raceType]}`)

                if(get()[raceType]){
                    for(let i = 0; i < boxes.length; i++) {
                        if(parseInt(raceDay) === parseInt(i + 1)) {
                            boxes[i].innerHTML += `<div class="race">${name}</div>`;
                        }
                    }
                }
            }
        });
    }
    },

    checkRace: (type) => {
        if(document.querySelector(`.${type} i`).innerText === "check_box")
            return true;
        else return false;
    }
}))

export default racesStore;