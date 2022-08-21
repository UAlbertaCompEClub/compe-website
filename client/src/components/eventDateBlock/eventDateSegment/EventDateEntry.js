import "../EventDateBlock.css";
import { EventDateDesc, EventDateTime } from "./EventDateComponents";

function EventDateEntry({text, month, day, time}) {
  return (
    <div className="eventdate-content">
      <EventDateDesc
        text = {text}
        />
      <EventDateTime
        month={month}
        day={day}
        time={time}
      />
    </div>
  );
}
export {
  EventDateEntry
};