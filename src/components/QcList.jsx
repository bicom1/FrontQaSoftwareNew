
import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Loader2,
  Crown,
  Mail,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileSearch,
  UserCheck,
  Zap,
  Users,
  FileText,
  Archive,
  Calendar,
  Globe,
  Database,
  ArrowRight,
  Filter,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getallusersApi,
  getProfileApi,
  patchUserApi,
  deleteUserApi,
} from "../features/userApis";
import { getEvaluationsApi } from "../features/evaluationApi";
import { normalizeRole, ROLES } from "../utils/roles";
import WeeklyStatsChart from "./WeeklyStatsChart";
import { getEscalationsApi } from "../features/escalationsApi";
import { getAllMarketingAdminApi } from "../features/marketingApi";

const QcList = () => {
  const [agents, setAgents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [teamStatusFilter, setTeamStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("team");
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", role: "" });
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileRes, usersRes, evalRes, escRes, marketingRes] =
          await Promise.allSettled([
          getProfileApi(),
          getallusersApi(),
          getEvaluationsApi(),
          getEscalationsApi(),
            getAllMarketingAdminApi(),
        ]);

        // 1. Handle Profile
        if (profileRes.status === "fulfilled" && profileRes.value?.data) {
          const pData = profileRes.value.data;
          const userProfile =
            pData.user ||
            (pData.data && !Array.isArray(pData.data) ? pData.data : pData);
          if (userProfile && (userProfile._id || userProfile.email)) {
            setCurrentUser(userProfile);
          }
        }

        // 2. Handle Users
        if (usersRes.status === "fulfilled" && usersRes.value?.data) {
          const uData = usersRes.value.data;
          const rawUsers = Array.isArray(uData.data)
            ? uData.data
            : Array.isArray(uData)
            ? uData
            : [];
          setAllUsers(rawUsers);
          const qcTeamMembers = rawUsers.filter((u) => {
            const r = normalizeRole(u.role);
            return r === ROLES.QC_USER || r === ROLES.QC_ADMIN;
          });
          setAgents(qcTeamMembers);
        }

        // 3. Handle Forms (Evaluations / Escalations / Marketing)
        const evalRows =
          evalRes.status === "fulfilled" ? evalRes.value?.data?.data || evalRes.value?.data || [] : [];
        const escRows =
          escRes.status === "fulfilled" ? escRes.value?.data?.data || escRes.value?.data || [] : [];
        const marketingRows =
          marketingRes.status === "fulfilled"
            ? marketingRes.value?.data || marketingRes.value || []
            : [];

        const userIndex = new Map(
          (usersRes.status === "fulfilled" && usersRes.value?.data?.data
            ? usersRes.value.data.data
            : []
          ).map((u) => [String(u.email || "").toLowerCase(), u])
        );

        const normalizeSource = (val) =>
          (val || "").toString().toLowerCase().trim();
        const normalizeStatus = (val) =>
          (val || "").toString().toLowerCase().trim();

        const getSubmitter = (row) => {
          const email =
            (row?.owner?.email ||
              row?.useremail ||
              row?.userEmail ||
              row?.email ||
              "").toString();
          const lower = email.toLowerCase();
          const fromUsers = lower ? userIndex.get(lower) : null;
          return {
            email: email || "-",
            name:
              row?.owner?.name ||
              fromUsers?.name ||
              row?.agentName ||
              "Unknown",
          };
        };

        const getSourceAndStatus = (row) => {
          const submissionSource = normalizeSource(row?.submissionSource);
          const status = normalizeStatus(row?.status);

          const source =
            submissionSource === "bitrix"
              ? "bitrix"
              : submissionSource === "frontend"
              ? "frontend"
              : normalizeSource(row?.source).includes("bitrix") ||
                normalizeSource(row?.leadsource).includes("bitrix")
              ? "bitrix"
              : "frontend";

          return { source, status: "published" };
        };

        const unify = (rows, type) =>
          (Array.isArray(rows) ? rows : []).map((row) => {
            const submitter = getSubmitter(row);
            const { source, status } = getSourceAndStatus(row);
            return {
              _id: row?._id,
              type,
              source,
              status,
              submitterName: submitter.name,
              submitterEmail: submitter.email,
              createdAt: row?.createdAt,
              leadID: row?.leadID,
              agentName: row?.agentName,
              teamleader: row?.teamleader,
              raw: row,
            };
          });

        const combined = [
          ...unify(evalRows, "evaluation"),
          ...unify(escRows, "escalation"),
          ...unify(marketingRows, "marketing"),
        ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setForms(combined);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const tab = location?.state?.tab;
    if (tab === "team") {
      setActiveTab(tab);
    }
    const teamStatus = location?.state?.teamStatus; // 'active' | 'inactive' | 'all'
    if (teamStatus === "active" || teamStatus === "inactive" || teamStatus === "all") {
      setTeamStatusFilter(teamStatus);
      setActiveTab("team");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminClick = (agent) => {
    // Pass email explicitly so AdminDetails knows to fetch data by "useremail" (submitter)
    // rather than by "agentName" (subject).
    const email = (agent?.email || "").toString();
    const name = (agent?.name || "").toString();
    const param = email && email.includes("@") ? encodeURIComponent(email) : encodeURIComponent(name);
    navigate(`/dashboard/qc-team/${param}`, { state: { email } });
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditFormData({ name: "", email: "", role: "" });
  };

  const handleSaveUser = async () => {
    if (!editingUser?._id) return;
    try {
      setSavingUser(true);
      const res = await patchUserApi(editingUser._id, editFormData);
      const updated = res?.data?.data || res?.data || null;
      if (updated) {
        setAgents((prev) =>
          prev.map((u) => (u._id === editingUser._id ? { ...u, ...updated } : u))
        );
      }
      closeEditModal();
    } catch (e) {
      console.error("Failed to update user:", e);
    } finally {
      setSavingUser(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser?._id) return;
    try {
      setDeleting(true);
      await deleteUserApi(deletingUser._id);
      setAgents((prev) => prev.filter((u) => u._id !== deletingUser._id));
      setDeletingUser(null);
    } catch (e) {
      console.error("Failed to delete user:", e);
    } finally {
      setDeleting(false);
    }
  };

  // --- QC TEAM LOGIC ---
  const processedAgents = useMemo(() => {
    let combinedList = [...agents];
    if (currentUser) {
      const existsIndex = combinedList.findIndex(
        (a) =>
          a._id === currentUser._id ||
          (a.email && a.email === currentUser.email)
      );
      if (existsIndex > -1) {
        combinedList[existsIndex] = {
          ...combinedList[existsIndex],
          ...currentUser,
        };
      } else if (
        currentUser.role === "admin" ||
        currentUser.role === "superadmin"
      ) {
        combinedList.unshift(currentUser);
      }
    }
    return combinedList.map((agent) => {
      const isMe =
        currentUser &&
        ((agent._id && agent._id === currentUser._id) ||
          (agent.email && agent.email === currentUser.email));
      if (isMe) {
        return {
          ...agent,
          isOnline: true,
          currentActivity: "Evaluations & Escalation",
          name: currentUser.name || agent.name,
          email: currentUser.email || agent.email,
        };
      }
      return agent;
    });
  }, [agents, currentUser]);

  const filteredAdmins = useMemo(() => {
    return processedAgents
      .filter((admin) => {
        const matchesSearch =
          (admin.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTeamStatus =
          teamStatusFilter === "active"
            ? admin.isOnline
            : teamStatusFilter === "inactive"
            ? !admin.isOnline
            : true;
        const matchesStatus = filterOnline ? admin.isOnline : true;
        return matchesSearch && matchesTeamStatus && matchesStatus;
      })
      .sort((a, b) => {
        const isMeA =
          currentUser &&
          ((a._id && a._id === currentUser._id) ||
            (a.email && a.email === currentUser.email));
        if (isMeA) return -1;
        return a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1;
      });
  }, [processedAgents, searchTerm, filterOnline, teamStatusFilter, currentUser]);

  const publishedRecords = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const match = (v) => (v || "").toString().toLowerCase().includes(term);
    return forms.filter(
      (f) =>
        match(f.submitterName) ||
        match(f.submitterEmail) ||
        match(f.agentName) ||
        match(f.teamleader) ||
        match(f.leadID) ||
        match(f.type)
    );
  }, [forms, searchTerm]);

  const stats = useMemo(() => {
    return {
      totalAgents: processedAgents.length,
      onlineAgents: processedAgents.filter((a) => a.isOnline).length,
      publishedCount: publishedRecords.length,
    };
  }, [processedAgents, publishedRecords]);

  const getActivityIcon = (activity) => {
    if (!activity) return <Clock className="w-3.5 h-3.5" />;
    const act = activity.toLowerCase();
    if (act.includes("escalation"))
      return <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />;
    if (act.includes("evaluat"))
      return <FileSearch className="w-3.5 h-3.5 text-blue-600" />;
    return <UserCheck className="w-3.5 h-3.5 text-green-600" />;
  };

  const renderEmptyState = (title, subtitle) => (
    <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 m-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
        <Search className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-slate-900 font-semibold text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto">{subtitle}</p>
    </div>
  );

  const getTypeBadge = (type) => {
    if (type === "evaluation") return "Evaluation";
    if (type === "escalation") return "Escalation";
    return "Marketing";
  };

  const getTypeColor = (type) => {
    if (type === "evaluation") return "bg-blue-600";
    if (type === "escalation") return "bg-amber-500";
    return "bg-indigo-600";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="font-bold text-slate-800">Edit Member</div>
              <button
                onClick={closeEditModal}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                disabled={savingUser}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Role
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
                  value={editFormData.role}
                  onChange={(e) =>
                    setEditFormData((p) => ({ ...p, role: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
              <button
                onClick={closeEditModal}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                disabled={savingUser}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-60"
                disabled={savingUser}
              >
                {savingUser ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="font-bold text-slate-800">Delete Member</div>
              <button
                onClick={() => setDeletingUser(null)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                disabled={deleting}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600">
                Delete <span className="font-semibold text-slate-800">{deletingUser.name}</span>?
                This cannot be undone.
              </p>
            </div>
            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Details Modal */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${getTypeColor(selectedForm.type)}`}>
                  {getTypeBadge(selectedForm.type)}
                </span>
                <span className="text-sm text-slate-600">
                  Published • {selectedForm.source === "bitrix" ? "Bitrix" : "Frontend"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Submitted By</div>
                  <div className="font-semibold text-slate-800">{selectedForm.submitterName}</div>
                  <div className="text-sm text-slate-500">{selectedForm.submitterEmail}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created</div>
                  <div className="text-sm text-slate-700">
                    {selectedForm.createdAt ? new Date(selectedForm.createdAt).toLocaleString() : "-"}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lead ID</div>
                  <div className="text-sm text-slate-700">{selectedForm.leadID || "-"}</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Agent / Team Lead</div>
                  <div className="text-sm text-slate-700">
                    {selectedForm.agentName || "-"} {selectedForm.teamleader ? `• ${selectedForm.teamleader}` : ""}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">All Fields</div>
                <pre className="text-xs text-slate-700 overflow-auto m-0">
{JSON.stringify(selectedForm.raw, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-900/10">
              <BarChart3 className="text-white w-7 h-7" />
            </div>
            QC Control Center
          </h1>
          <p className="text-slate-500 mt-2 text-base font-medium ml-1">
            Real-time evaluation monitoring and record management system.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Agents
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {stats.onlineAgents}
              </span>
              <span className="text-sm text-slate-400 font-medium">
                / {stats.totalAgents} Online
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Published
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-800">
              {stats.publishedCount}
            </span>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Weekly QC Activity</h3>
        <WeeklyStatsChart />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("team")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all relative ${
              activeTab === "team"
                ? "text-blue-700 bg-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Users
              className={`w-4 h-4 ${
                activeTab === "team" ? "text-blue-600" : "text-slate-400"
              }`}
            />
            QC Team
            {activeTab === "team" && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
              placeholder={
                activeTab === "team"
                  ? "Find agent by name..."
                  : "Search records..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "team" && (
            <button
              onClick={() => setFilterOnline(!filterOnline)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                filterOnline
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              {filterOnline ? "Showing Online Only" : "Filter Status"}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p className="text-sm font-medium text-slate-500">
                Syncing database...
              </p>
            </div>
          ) : (
            <div className="p-4">
              {/* --- TEAM TAB --- */}
              {activeTab === "team" && (
                <div className="grid grid-cols-1 gap-3">
                  {filteredAdmins.length === 0
                    ? renderEmptyState(
                        "No team members found",
                        "Try adjusting your search filters"
                      )
                    : filteredAdmins.map((agent) => {
                        const isCurrentUser =
                          currentUser &&
                          ((agent._id && agent._id === currentUser._id) ||
                            (agent.email && agent.email === currentUser.email));
                        const isOnline = agent.isOnline;
                        return (
                          <div
                            key={agent._id || agent.email || Math.random()}
                            onClick={() => handleAdminClick(agent)}
                            className={`group relative p-4 flex flex-col sm:flex-row sm:items-center gap-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 cursor-pointer ${
                              isCurrentUser
                                ? "ring-2 ring-blue-500/10 bg-blue-50/10"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="relative flex-shrink-0">
                                <div
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm transform group-hover:scale-105 transition-transform duration-200 ${
                                    agent.role === "superadmin"
                                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                      : isCurrentUser
                                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                                      : "bg-gradient-to-br from-slate-400 to-slate-500"
                                  }`}
                                >
                                  {agent.name
                                    ? agent.name.charAt(0).toUpperCase()
                                    : "?"}
                                </div>
                                <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 bg-white rounded-full items-center justify-center">
                                  <span
                                    className={`relative inline-flex rounded-full h-3 w-3 ${
                                      isOnline ? "bg-green-500" : "bg-slate-300"
                                    }`}
                                  >
                                    {isOnline && (
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    )}
                                  </span>
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3
                                    className={`font-bold text-lg truncate ${
                                      isCurrentUser
                                        ? "text-blue-900"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {agent.name || "Unknown User"}
                                  </h3>
                                  {isCurrentUser && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded border border-blue-200">
                                      You
                                    </span>
                                  )}
                                  {agent.role === "superadmin" && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded text-amber-700 border border-amber-100">
                                      <Crown className="w-3 h-3 fill-amber-500" />
                                      <span className="text-[10px] font-bold uppercase">
                                        Owner
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                  <Mail className="w-3.5 h-3.5" />
                                  <span className="truncate">
                                    {agent.email || "No email"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 pl-20 sm:pl-0">
                              <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm transition-colors ${
                                  isOnline
                                    ? "bg-green-50/50 border-green-100 text-green-800"
                                    : "bg-slate-50 border-slate-200 text-slate-500"
                                }`}
                              >
                                {isOnline ? (
                                  <>
                                    <span
                                      className={`flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm`}
                                    >
                                      {getActivityIcon(agent.currentActivity)}
                                    </span>
                                    <span className="font-semibold">
                                      {agent.currentActivity || "Online"}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>
                                      Offline{" "}
                                      {agent.lastActive
                                        ? `• ${agent.lastActive}`
                                        : ""}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-end sm:w-auto pl-20 sm:pl-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1.5">
                              <button
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(agent);
                                }}
                                title="Edit"
                              >
                                <SquarePen className="w-5 h-5" />
                              </button>
                              {!isCurrentUser && (
                                <button
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingUser(agent);
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <ArrowRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QcList;
