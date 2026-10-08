const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function TeamMemberCard({ teamMember }) {
  const { name, role, image, contactFor, email } = teamMember;

  return (
    <li className="member">
      {image ? (
        // The name is right below, so the photo itself doesn't need alt text.
        <img
          className="member__photo"
          src={image.src}
          width={image.width}
          height={image.height}
          alt=""
          loading="lazy"
        />
      ) : (
        <div className="member__photo member__photo--initials" aria-hidden="true">
          {initials(name)}
        </div>
      )}
      <h4 className="member__name">{name}</h4>
      <p className="member__role">{role}</p>
      {contactFor && <p className="member__contact">{contactFor}</p>}
      {email && (
        <a className="member__email" href={`mailto:${email}`}>
          {email}
        </a>
      )}
    </li>
  );
}
