/** Derive invite bucket counts from the invites list API response */
export const computeInviteStats = (invites) => {
  const list = Array.isArray(invites) ? invites : [];
  const pending = list.filter(
    (i) => (i.status || "pending") === "pending"
  ).length;
  const accepted = list.filter((i) => i.status === "accepted").length;
  const expired = list.filter((i) => i.status === "expired").length;
  return {
    total: list.length,
    pending,
    accepted,
    expired,
    /** Pending tab: everything not yet accepted */
    awaiting: list.filter((i) => (i.status || "pending") !== "accepted").length,
  };
};
