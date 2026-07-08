import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getTeamLeadReviewsApi = async (params = {}) => {
  const res = await axios.get(`${baseUrl}/api/team-lead-reviews`, {
    headers: authHeaders(),
    params,
  });
  return res.data;
};

export const getTeamLeadReviewCountApi = async () => {
  const res = await axios.get(`${baseUrl}/api/team-lead-reviews/count`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getTeamLeadReviewApi = async (evaluationId) => {
  const res = await axios.get(
    `${baseUrl}/api/team-lead-reviews/${evaluationId}`,
    { headers: authHeaders() }
  );
  return res.data;
};

export const askTeamLeadQuestionApi = async (evaluationId, question) => {
  const res = await axios.post(
    `${baseUrl}/api/team-lead-reviews/${evaluationId}/questions`,
    { question },
    { headers: authHeaders() }
  );
  return res.data;
};

export const answerTeamLeadQuestionApi = async (
  evaluationId,
  threadId,
  answer
) => {
  const res = await axios.post(
    `${baseUrl}/api/team-lead-reviews/${evaluationId}/threads/${threadId}/answer`,
    { answer },
    { headers: authHeaders() }
  );
  return res.data;
};

export const resolveTeamLeadReviewApi = async (evaluationId) => {
  const res = await axios.patch(
    `${baseUrl}/api/team-lead-reviews/${evaluationId}/resolve`,
    {},
    { headers: authHeaders() }
  );
  return res.data;
};
