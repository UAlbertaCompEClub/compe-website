import "../FaqBlock.css";
import { FaqDesc, FaqTime } from "./faqComponents";

function FaqEntry({text, month, day, time}) {
  return (
    <div className="Faq-content">
      <FaqDesc
        text = {text}
        />
      <FaqTime
        month={month}
        day={day}
        time={time}
      />
    </div>
  );
}
export {
  FaqEntry
};