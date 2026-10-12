import roles from "../data/roles.json";
import { formatRange, todayIso } from "../components/eventBlock/eventDates";

// A role is open until the end of its closing day. No closing date means open until it's filled.
export function isOpen(role, today = todayIso()) {
  return !role.closes || role.closes >= today;
}

export function findRole(roleId) {
  return roles.find((role) => role.id === roleId) ?? null;
}

export function closingLabel(role) {
  if (!role.closes) return "Open until filled";
  return isOpen(role) ? `Applications close ${formatRange(role.closes)}` : "Applications closed";
}

export function openingsLabel(role) {
  if (!role.openings) return null;
  return role.openings === 1 ? "1 spot" : `${role.openings} spots`;
}

export default roles;
