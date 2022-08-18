import React, { useEffect } from 'react';
import blockStyle from '../Block';
import { FaqEntry } from './faqSegment/FaqEntry';
import { FaqSection } from "./faqSegment/FaqSection";
import "./FaqBlock.css";
import '../Block.css'

const fade = (percentage) => ({
  transform: 'translateY(' + 50*percentage +'px)',
  opacity: percentage,
  // 'transition-property': 'transform, opacity',
  // 'transition-duration': '1s',
  // 'transition-timing-function': 'linear'
}
);

function FaqBlock({ height, id }) {
  const generalFaqs = () => {
    return (
      <>
        <FaqEntry
          question={"Where and when is Career++ happening?"}
          answer={"January 20th, location TBD"}
        />
        <FaqEntry
          question={"Where can I ask additional questions?"}
          answer={"Please reach out to us at external@compeclub.com!"}
        />
        <FaqEntry
          question={"What’s the plan in case this event cannot be in-person?"}
          answer={"While we are hoping to host an in-person event, we are prepared to transition to online if required by COVID policies."}
        />
      </>
    );
  }

  const studentFaqs = () => {
    return (
      <>
        <FaqEntry
          question={"Is there any cost for students?"}
          answer={"No, this is free for students to attend!"}
        />
        <FaqEntry
          question={"What should I do now to prepare for this event?"}
          answer={"We have a list of resources here: Resources Link and Engineering Employee Center Resource Vault. You can also attend Stacey’s presentation (POTENTIALLY)."}
        />
        <FaqEntry
          question={"Who can attend?"}
          answer={"You don’t need to be studying Computer Engineering, Electrical Engineering or Computer Science to attend. While these fields are the target audience, any undergraduate students looking for a software or hardware tech internship (or potentially new grad position) are welcome to attend. We highly encourage first year students interested in tech to also attend!!"}
        />
        <FaqEntry
          question={"What should I wear / How formal is this?"}
          answer={"We recommend business casual, aim for something you would wear at a tech interview"}
        />
        <FaqEntry
          question={"How to start a conversation? / What to ask them?"}
          answer={"Asking about the application and interview process or what makes that company different. Also, please research the list of companies that will be attending (will be updated periodically). That way you can think of specific questions and demonstrate that you took the time to learn more about them."}
        />
        <FaqEntry
          question={"Should I bring a physical copy of my resume?"}
          answer={"Most companies prefer students apply online to the job postings that they are interested in "}
        />
        <FaqEntry
          question={"What companies are attending?"}
          answer={"Please check the website for more details about the companies."}
        />
        <FaqEntry
          question={"Had a great career fair experience, what should you do next?"}
          answer={"Ask if you can connect with the recruiter on LinkedIn with a personal message. Visit the company website and peruse their job opportunities."}
        />
        <FaqEntry
          question={"What time should we be there?"}
          answer={"Between 10 AM to 5 PM, excluding a lunch break from 12 PM - 1 PM"}
        />
        <FaqEntry
          question={"Will there be food at this event?"}
          answer={"No, there will be no food served to the students at this event"}
        />
      </>
    );
  }

  const companiesFaqs = () => {
    return(
      <>
        <FaqEntry
          question={"How do I register and by when?"}
          answer={"You can register by filling in the registration form here:"}
        />
        <FaqEntry
          question={"Cancellation Policy?"}
          answer={`Grace Period: full refund will be granted if written notification of cancellation is received via email within 48-hours of registration. Cancellations received after 5:00 PM (MT) on December 16th 2022 are ineligible for grace period. \n
            Cancellations made outside of the 48-hour grace period but before 5:00 PM (MT) on December 16th, 2022 will be charged a $100 cancellation fee to cover administration and processing costs. \n
            Cancellations made after 5:00 PM (MT) on December 16th,2022 will be charged the full fee.`}
        />
        <FaqEntry
          question={"How early should I show up to set up my booth?"}
          answer={"Please plan to be there by 9:30 AM so that we can open the doors to students at 10 AM."}
        />
        <FaqEntry
          question={"For when are students looking for a position?"}
          answer={"Most students will be looking for a Summer 2023 position (given when this event takes place) starting in May or June, however some students may be seeking a Fall 2023 internship or new grad position starting around September."}
        />
      </>
    );
  }

  return (
    <div style={blockStyle(height)} className="block">
      <div className="faq-block" id={"faq-block" + id}>
        <h1 className="heading faq-heading">FAQs</h1>
        <div className="faq-panels" id="faq-grid">
          <FaqSection
            heading={"General"}
            questions={generalFaqs()}
           />
          <FaqSection
            heading={"Students"}
            questions={studentFaqs()}
          />
          <FaqSection
            heading={"Companies"}
            questions={companiesFaqs()}
          />
           
        </div>
      </div>
    </div>
  );
}

export default FaqBlock;