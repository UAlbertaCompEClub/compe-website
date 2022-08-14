import "../EventDateBlock.css";

function EventDateDesc({text}) {
  return (
    <div className="eventdate-desc-container">
      <h1>{text}</h1>
    </div>
  );
}

function EventDateTime({month, day, time}) {
  var parseDate = (day) => {
    var dateRegex = /(\d{1,2})(\w{1,2})/;
    var matched = day.match(dateRegex);
    if (matched.length>1) {
      return(
        <>
          <div className="eventdate-date-day">
            <h1 className="text-date">{matched[1]}</h1>
            <h2 className="text-date">{matched[2]}</h2>
          </div>
        </>
      )
    }
  }

  return (
    <div className="eventdate-date-container">
      <h3 className="text-date eventdate-date-month">{month}</h3>
      {parseDate(day)}
      <h4 className="text-date eventdate-date-time">{time}</h4>
    </div>
  );
}

export {
  EventDateDesc,
  EventDateTime
};