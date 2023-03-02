const date = new Date();



//fetch the scraped data
var raceInfo = {};
async function setScraperData() {
    await(fetch("http://localhost:8080")
        .then((response) => response.json())
        .then((data) => {raceInfo = data})
        .catch((e) => console.log(e)));
    raceInfo.races.map((race, i) => {
        console.log(race); //race is a string containing race info
    });
}
setScraperData();

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
            day += `<div class="today">${i}</div>`;
        else day += `<div>${i}</div>`;
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

//Set previous and next month buttons
document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    load();
});
document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    load();
});
