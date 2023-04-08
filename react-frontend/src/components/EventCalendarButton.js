import React from 'react';
import 'add-to-calendar-button';

const EventCalendarButton = ({ events }) => {
  const eventList = events.map((event) => {
    const { date, name} = event;
    return {
      startDate: date.toISOString().slice(0,10),
      startTime: "12:00",
      endTime: "13:00",
      name
    };
  });

  return (
    <add-to-calendar-button
      name="Events"
      options="'Apple','Google'"
      dates={JSON.stringify(eventList)}
      timeZone="currentBrowser"
      ></add-to-calendar-button>
  );
};

export default EventCalendarButton;
