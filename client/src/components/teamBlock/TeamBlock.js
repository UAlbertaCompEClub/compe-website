import React, { useEffect } from "react";
import navLinker from "../pageState/observer/navLinker";
import team from "../../data/team.json";
import TeamMemberCard from "./TeamMemberCard";
import "./TeamBlock.css";

const id = "team";

// Groups with nobody in them (e.g. juniors before the Special AGM) aren't shown.
const groups = [
  ["senior", "Senior executives"],
  ["junior", "Junior executives"],
]
  .map(([key, label]) => ({
    key,
    label,
    members: team.filter((member) => member.group === key),
  }))
  .filter((group) => group.members.length > 0);

const TeamBlock = React.forwardRef((props, ref) => {
  useEffect(
    () => navLinker(ref.current, props.setBlock, id),
    [ref, props.setBlock]
  );

  return (
    <section className="block" id={id} ref={ref} aria-labelledby="team-title">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">Our Team</p>
          <h2 id="team-title">The people running the club</h2>
          <p className="lede">
            Have a concern, an event idea or feedback? Reach out to any of us on
            Discord.
          </p>
        </header>

        {groups.map((group) => (
          <div key={group.key} className="team-group">
            <h3 className="subhead">{group.label}</h3>
            <ul className="team-grid">
              {group.members.map((member) => (
                <TeamMemberCard
                  key={`${member.name}-${member.role}`}
                  teamMember={member}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

export default TeamBlock;
