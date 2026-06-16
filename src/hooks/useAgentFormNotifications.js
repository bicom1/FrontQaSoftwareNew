import { useCallback, useEffect, useState } from "react";
import { fetchAgentFormData } from "../utils/agentSubmissions";

const READ_KEY_PREFIX = "agent_form_notifications_read_";
const POLL_MS = 45000;

const timeAgo = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString();
};

const getReadSet = (userKey) => {
  try {
    const raw = localStorage.getItem(`${READ_KEY_PREFIX}${userKey}`);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
};

const saveReadSet = (userKey, set) => {
  localStorage.setItem(
    `${READ_KEY_PREFIX}${userKey}`,
    JSON.stringify([...set])
  );
};

const formToNotification = (form, type, readSet) => {
  const id = `${type}-${form._id}`;
  const isEval = type === "evaluation";
  const lead = form.leadID ?? "-";
  const rating = form.rating != null ? ` · Score ${form.rating}` : "";
  const severity = form.escSeverity ? ` · ${form.escSeverity}` : "";

  return {
    id,
    formType: type,
    formId: form._id,
    leadID: lead,
    text: isEval
      ? `Evaluation recorded for Lead #${lead}${rating}`
      : `Escalation submitted for Lead #${lead}${severity}`,
    time: timeAgo(form.createdAt),
    createdAt: form.createdAt,
    read: readSet.has(id),
  };
};

export const useAgentFormNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userKey, setUserKey] = useState("");

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const name = decoded.name || "";
      const email = decoded.email || "";
      const key = email || name || "agent";
      setUserKey(key);

      const readSet = getReadSet(key);
      const { evaluations, escalations } = await fetchAgentFormData({
        name,
        email,
      });

      const items = [
        ...evaluations.map((f) => formToNotification(f, "evaluation", readSet)),
        ...escalations.map((f) => formToNotification(f, "escalation", readSet)),
      ]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 25);

      setNotifications(items);
    } catch (err) {
      console.error("Failed to load form notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(() => {
    if (!userKey) return;
    const readSet = getReadSet(userKey);
    notifications.forEach((n) => readSet.add(n.id));
    saveReadSet(userKey, readSet);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [notifications, userKey]);

  const markAsRead = useCallback(
    (id) => {
      if (!userKey) return;
      const readSet = getReadSet(userKey);
      readSet.add(id);
      saveReadSet(userKey, readSet);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    },
    [userKey]
  );

  return {
    notifications,
    loading,
    markAllAsRead,
    markAsRead,
    refresh: fetchNotifications,
  };
};

export default useAgentFormNotifications;
