const date = new Date();

console.log(date);

function addRace(race) {
    let month = document.querySelector("div.month h1").innerText;
    let year = document.querySelector("div.month p").innerText;
    splitRace = race.split(" ");
    const raceMonth = splitRace[0];
    const raceYear = splitRace[2];

    if (raceMonth === month.substr(0, 3) && raceYear === year) {
        const raceDay = splitRace[1];
        const name = race.slice(12);
        const boxes = document.querySelectorAll("div.grid div:not(.last-month, .next-month)");
        let calDay;
        for(let i = 0; i < boxes.length; i++) {
            if (parseInt(boxes[i].innerText) < 10)
                calDay = "0" + boxes[i].innerText;
            else
                calDay = boxes[i].innerText;
            if(raceDay.localeCompare(calDay) === 0) {
                boxes[i].innerHTML += `<div class="race">${name}</div>`;
            }
        }
    }
}

//fetch the scraped data
let raceInfo = {};
async function setScraperData(type) {
    await(fetch(`http://localhost:8080/${type}`)
        .then((response) => response.json())
        .then((data) => raceInfo = data)
        .catch((e) => console.log(e)));
    raceInfo.races.map((race, i) => {
        addRace(race);
    });
}

const months = [
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
];

const load = () => {
    //set the current month and year of the calendar
    document.querySelector(".month h1").innerHTML = months[date.getMonth()];
    document.querySelector(".month p").innerHTML = date.getFullYear();

    //set days to add each day of the month to
    let day = "";

    //keep track of squares to adjust size of calendar
    let squares = 0;

    //Store html grid container
    const grid = document.querySelector(".grid");

    //Store various important days (first day of the month, last month's first date that appears, last day of the month)
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastMonthStart = new Date(date.getFullYear(), date.getMonth(), 0).getDate() - (firstDay - 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    //Store a reference date for today
    const refDate = new Date();

    //Add last month's days that appear on calendar
    for(let i = 0; i < firstDay; i++) {
        day += `<div class="last-month">${lastMonthStart + i}</div>`;
        squares++;
    }

    //Add the days that appear for the current month to the calendar
    for(let i = 1; i <= lastDay.getDate(); i++){
        if(i === date.getDate() && date.getMonth() === refDate.getMonth() && date.getFullYear() === refDate.getFullYear())
            day += `<div class="today"><div>${i}</div></div>`;
        else day += `<div><div class="date">${i}</div></div>`;
        squares++;
    }

    //Add the days that appear for next month to the calendar
    for(let i = lastDay.getDay() + 1; i < 7; i++) {
        day += `<div class="next-month">${i - lastDay.getDay()}</div>`;
        squares++;
    }

    //Set the number of rows for the calendar
    if (squares > 35)
        grid.className = "grid sixrows";
    else
        grid.className = "grid fiverows";

    //Set html for the calendar's grid
    grid.innerHTML = day;
}
load();


function check(type) {
    if(document.querySelector(`.${type} i`).innerText === "check_box")
        return true;
    else return false;
}

//Set previous and next month buttons
//Previous
document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    if (check("f1")) setScraperData("f1");
    if (check("gt3")) setScraperData("gt3");
    if (check("wrc")) setScraperData("wrc");
    load();
});
//Next
document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    if (check("f1")) setScraperData("f1");
    if (check("gt3")) setScraperData("gt3");
    if (check("wrc")) setScraperData("wrc");
    load();
});

//Toggle buttons
//F1
document.querySelector(".f1 i").addEventListener("click", ()=> {
    if(check("f1")) {
        document.querySelector(".f1 i").innerText = "check_box_outline_blank";
        load();
        if (check("gt3")) setScraperData("gt3");
        if (check("wrc")) setScraperData("wrc");
    }
    else {
        document.querySelector(".f1 i").innerText = "check_box";
        setScraperData("f1");
    }
});
//GT3
document.querySelector(".gt3 i").addEventListener("click", ()=> {
    if(check("gt3")) {
        document.querySelector(".gt3 i").innerText = "check_box_outline_blank";
        load(); //ideally we would just remove all f1 divs and not check
        if (check("f1")) setScraperData("f1");
        if (check("wrc")) setScraperData("wrc");
    }
    else {
        document.querySelector(".gt3 i").innerText = "check_box";
        setScraperData("gt3");
    }
});
//WRC
document.querySelector(".wrc i").addEventListener("click", ()=> {
    if(check("wrc")) {
        document.querySelector(".wrc i").innerText = "check_box_outline_blank";
        load(); //ideally we would just remove all f1 divs and not check
        if (check("f1")) setScraperData("f1");
        if (check("gt3")) setScraperData("gt3");
    }
    else {
        document.querySelector(".wrc i").innerText = "check_box";
        setScraperData("wrc");
    }
});
