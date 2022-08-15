import { useState } from "react";
import "../FaqBlock.css";

function FaqEntry({ question, answer }) {
  const [answerVisible, setAnswerVisible] = useState(false)
  const toggleAnswerVisible = () => {
    answerVisible ? setAnswerVisible(false) : setAnswerVisible(true)
  }

  const AnswerReturn = ({ answer }) => {
    return (
      <div className="faq-answer-container">
        <p className="text-faq faq-answer">A: {answer}</p>
      </div>
    );
  }

  return (
    <div className="faq-container">
      <div className="faq-question-container">
        <a onClick={toggleAnswerVisible}>
          <b className="text-faq faq-question">Q: {question}</b>
        </a>
        {answerVisible && <AnswerReturn answer={answer} />}
      </div>
    </div>
  );
}

export {
  FaqEntry
};