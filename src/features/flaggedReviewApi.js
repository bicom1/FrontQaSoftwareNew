import { baseUrl, getToken } from "./config";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const getFlaggedReviewsApi = (queue = "agent_admin", params = {}) => {
  const qs = new URLSearchParams({ queue });
  if (params.startDate) qs.set("startDate", params.startDate);
  if (params.endDate) qs.set("endDate", params.endDate);
  return fetch(`${baseUrl}/api/flagged-reviews?${qs.toString()}`, {
    headers: authHeaders(),
  }).then((r) => r.json());
};

export const forwardFlaggedToQcApi = (formId) =>
  fetch(`${baseUrl}/api/flagged-reviews/${formId}/forward`, {
    method: "POST",
    headers: authHeaders(),
  }).then((r) => r.json());

export const resolveFlaggedReviewApi = (formId, decision, note = "") =>
  fetch(`${baseUrl}/api/flagged-reviews/${formId}/decision`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ decision, note }),
  }).then((r) => r.json());
