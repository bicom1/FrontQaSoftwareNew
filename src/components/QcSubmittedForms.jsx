import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Nav, Modal, Row, Spinner, Table } from "react-bootstrap";
import { CalendarClock, Clock } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos, MdSkipNext } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { getQcModuleFormsApi } from "../features/qcAnalytics";
import { isQcAdmin, normalizeRole } from "../utils/roles";
import GradientButton, {
  GRADIENT_HEADER_STYLE,
} from "./common/GradientButton";

const HEADER_STYLE = GRADIENT_HEADER_STYLE;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const PERIOD_OPTIONS = [
  { value: "", label: "All" },
  { value: "yesterday", label: "Yesterday" },
  { value: "weekly", label: "Last 7 days" },
  { value: "monthly", label: "Last 30 days" },
  { value: "custom", label: "Custom" },
];

const SEARCH_FIELD_OPTIONS = [
  { value: "all", label: "All fields" },
  { value: "submitter", label: "Submitted by" },
  { value: "agentName", label: "Agent name" },
  { value: "teamleader", label: "Team lead" },
  { value: "leadID", label: "Lead ID" },
  { value: "mod", label: "MOD" },
  { value: "rating", label: "Rating" },
  { value: "severity", label: "Severity" },
  { value: "issue", label: "Issue" },
  { value: "source", label: "Source" },
  { value: "branch", label: "Branch" },
  { value: "quality", label: "Lead quality" },
];

const toDateInput = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const resolvePeriodDates = (period) => {
  const today = new Date();
  if (period === "yesterday") {
    const start = new Date(today);
    start.setDate(start.getDate() - 1);
    const key = toDateInput(start);
    return { startDate: key, endDate: key };
  }
  if (period === "weekly") {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return { startDate: toDateInput(start), endDate: toDateInput(today) };
  }
  if (period === "monthly") {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    return { startDate: toDateInput(start), endDate: toDateInput(today) };
  }
  if (period === "custom") {
    return { startDate: "", endDate: "" };
  }
  return { startDate: "", endDate: "" };
};

const formatDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const parseDateKey = (key) => {
  if (!key) return null;
  const d = new Date(`${key}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  return cells;
};

const CustomDateCalendar = ({ label, value, onChange, rangeStart, rangeEnd }) => {
  const initial = parseDateKey(value) || new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    const picked = parseDateKey(value);
    if (picked) {
      setViewYear(picked.getFullYear());
      setViewMonth(picked.getMonth());
    }
  }, [value]);

  const shiftMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const days = getCalendarDays(viewYear, viewMonth);
  const todayKey = toDateInput(new Date());

  const isInRange = (day) => {
    if (!day || !rangeStart || !rangeEnd) return false;
    const key = toDateInput(new Date(viewYear, viewMonth, day));
    return key >= rangeStart && key <= rangeEnd;
  };

  return (
    <div className="custom-date-calendar">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
        <span className="fw-semibold calendar-label">
          <CalendarClock size={13} className="me-1 text-primary" />
          {label}
        </span>
        <span className="text-muted calendar-selected">
          <Clock size={12} className="me-1" />
          {value || "—"}
        </span>
      </div>
      <div className="calendar-shell border rounded-2 p-2 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button
            type="button"
            className="btn btn-sm btn-light border py-0 px-2 calendar-nav-btn"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="fw-semibold calendar-month-title">
            {MONTH_NAMES_SHORT[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-light border py-0 px-2 calendar-nav-btn"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <div className="calendar-weekdays">
          {WEEKDAY_LABELS.map((name, i) => (
            <span key={`wd-${i}`} className="calendar-weekday">
              {name}
            </span>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day, idx) => {
            if (!day) {
              return <span key={`empty-${idx}`} className="calendar-day empty" />;
            }
            const dateKey = toDateInput(new Date(viewYear, viewMonth, day));
            const isSelected = value === dateKey;
            const isToday = todayKey === dateKey;
            const inRange = isInRange(day);
            return (
              <button
                key={dateKey}
                type="button"
                className={[
                  "calendar-day",
                  isSelected ? "selected" : "",
                  isToday ? "today" : "",
                  inRange ? "in-range" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onChange(dateKey)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CustomDateRangePanel = ({ startDate, endDate, onStartChange, onEndChange }) => (
  <div className="custom-date-range-panel border rounded p-2 mb-3 bg-light">
    <p className="small text-muted mb-2 d-flex align-items-center gap-1">
      <CalendarClock size={14} className="text-primary" />
      Pick start and end dates
    </p>
    <div className="d-flex flex-wrap gap-3 align-items-start">
      <CustomDateCalendar
        label="From"
        value={startDate}
        onChange={onStartChange}
        rangeStart={startDate}
        rangeEnd={endDate}
      />
      <CustomDateCalendar
        label="To"
        value={endDate}
        onChange={onEndChange}
        rangeStart={startDate}
        rangeEnd={endDate}
      />
    </div>
  </div>
);

const FormDetailModal = ({ show, onHide, record, type }) => {
  if (!record) return null;
  const entries = Object.entries(record).filter(
    ([k]) => !["__v", "owner"].includes(k)
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {type === "evaluation"
            ? "Evaluation"
            : type === "escalation"
            ? "Escalation"
            : "Marketing"}{" "}
          — {record.submitterName || "Unknown"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive bordered size="sm" className="mb-0">
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key}>
                <th style={{ width: "30%" }} className="text-capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </th>
                <td>
                  {value && typeof value === "object" ? (
                    <pre className="mb-0 small">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    String(value ?? "—")
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

/* ─── Inline Toast ──────────────────────────────────────────────────────── */
const InlineToast = ({ message, visible }) => (
  <div
    className={`last-page-toast ${visible ? "lpt-visible" : ""}`}
    role="status"
    aria-live="polite"
  >
    <MdSkipNext size={16} className="me-1 flex-shrink-0" />
    {message}
  </div>
);

/* ─── Main Component ────────────────────────────────────────────────────── */
const QcSubmittedForms = () => {
  const [searchParams] = useSearchParams();
  const urlUserId = searchParams.get("userId") || "";
  const urlUserName = searchParams.get("name") || "";

  const actorRole = normalizeRole(localStorage.getItem("userRole") || "");
  const actorId = localStorage.getItem("userId") || "";
  const isAdmin = isQcAdmin(actorRole);

  const lockedUserId = isAdmin ? urlUserId : actorId;

  const [formsTab, setFormsTab] = useState("evaluations");
  const [formsPage, setFormsPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [formsLoading, setFormsLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [formsMeta, setFormsMeta] = useState({ qcUsers: [] });
  const [period, setPeriod] = useState("");
  const [formFilters, setFormFilters] = useState({
    search: "",
    searchField: "all",
    userId: lockedUserId,
    startDate: "",
    endDate: "",
  });
  const [selectedForm, setSelectedForm] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [lastPageToast, setLastPageToast] = useState(false);
  const toastTimerRef = useRef(null);

  const isCustomPeriod = period === "custom";

  useEffect(() => {
    setFormFilters((f) => ({ ...f, userId: lockedUserId }));
    setFormsPage(1);
  }, [lockedUserId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const load = async () => {
        setFormsLoading(true);
        try {
          const res = await getQcModuleFormsApi({
            type: formsTab,
            page: formsPage,
            limit: pageSize,
            search: formFilters.search.trim(),
            searchField: formFilters.searchField,
            userId: isAdmin ? formFilters.userId : "",
            startDate: formFilters.startDate,
            endDate: formFilters.endDate,
          });
          if (res?.success) {
            setForms(res.data || []);
            setTotalCount(res.total || 0);
            setTotalPages(res.totalPages || 1);
            setFormsMeta({ qcUsers: res.qcUsers || [] });
          }
        } catch (e) {
          console.error("Failed to load forms:", e);
          setForms([]);
          setTotalCount(0);
          setTotalPages(1);
        } finally {
          setFormsLoading(false);
        }
      };
      load();
    }, formFilters.search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [formsTab, formsPage, pageSize, formFilters, isAdmin]);

  const qcUserOptions = formsMeta.qcUsers || [];

  const updateFormFilters = (patch) => {
    setFormFilters((f) => ({ ...f, ...patch }));
    setFormsPage(1);
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
    if (value === "custom") {
      updateFormFilters({ startDate: "", endDate: "" });
      return;
    }
    updateFormFilters(resolvePeriodDates(value));
  };

  const handleCustomDateChange = (field, value) => {
    setPeriod("custom");
    setFormFilters((f) => {
      if (field === "startDate" && f.endDate && value > f.endDate) {
        return { ...f, startDate: value, endDate: "" };
      }
      if (field === "endDate" && f.startDate && value < f.startDate) {
        return { ...f, startDate: value, endDate: f.startDate };
      }
      return { ...f, [field]: value };
    });
    setFormsPage(1);
  };

  const handleStartCalendarSelect = (dateKey) => handleCustomDateChange("startDate", dateKey);
  const handleEndCalendarSelect   = (dateKey) => handleCustomDateChange("endDate",   dateKey);

  const clearFilters = () => {
    setPeriod("");
    setPageSize(10);
    setFormFilters({
      search: "",
      searchField: "all",
      userId: lockedUserId,
      startDate: "",
      endDate: "",
    });
    setFormsPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setFormsPage(1);
  };

  const handleJumpToLastPage = () => {
    setFormsPage(totalPages);
    // Show toast then auto-hide after 3 s
    setLastPageToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setLastPageToast(false), 3000);
  };

  // Clean up timer on unmount
  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  const pageTitle = urlUserName
    ? `${decodeURIComponent(urlUserName)}'s Submitted Forms`
    : isAdmin
    ? "All QC Submitted Forms"
    : "My Submitted Forms";

  const showingFrom = totalCount === 0 ? 0 : (formsPage - 1) * pageSize + 1;
  const showingTo   = Math.min(formsPage * pageSize, totalCount);
  const isLastPageDisabled = formsPage >= totalPages || formsLoading || totalCount === 0;

  return (
    <div className="container-fluid px-4 py-3 analytics-dashboard">
      <div className="mb-4">
        <h1 className="fw-bold h4 mb-1">{pageTitle}</h1>
        <p className="text-muted mb-0 small">
          Search and filter your submitted evaluation, escalation, and marketing forms
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header text-white p-2 rounded-top-4" style={HEADER_STYLE}>
          <p className="mb-0 fw-semibold">Submitted Forms</p>
        </div>
        <div className="card-body">
          <Nav variant="tabs" className="mb-3">
            {[
              { key: "evaluations", label: "Evaluation Forms" },
              { key: "escalations", label: "Escalation Forms" },
              { key: "marketing",   label: "Marketing Forms"  },
            ].map((tab) => (
              <Nav.Item key={tab.key}>
                <Nav.Link
                  active={formsTab === tab.key}
                  onClick={() => { setFormsTab(tab.key); setFormsPage(1); }}
                  style={{ cursor: "pointer" }}
                >
                  {tab.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          {/* ── Filters ── */}
          <div className="border rounded p-3 mb-3 bg-white">
            <Row className="g-2 align-items-end">
              <Col xs={12} md={isAdmin && !lockedUserId ? 2 : 3}>
                <Form.Label className="small mb-1">Period</Form.Label>
                <Form.Select size="sm" value={period} onChange={(e) => handlePeriodChange(e.target.value)}>
                  {PERIOD_OPTIONS.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={2}>
                <Form.Label className="small mb-1">Search in</Form.Label>
                <Form.Select size="sm" value={formFilters.searchField} onChange={(e) => updateFormFilters({ searchField: e.target.value })}>
                  {SEARCH_FIELD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={isAdmin && !lockedUserId ? 4 : 6}>
                <Form.Label className="small mb-1">Search</Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Type to search..."
                  value={formFilters.search}
                  onChange={(e) => updateFormFilters({ search: e.target.value })}
                />
              </Col>

              {isAdmin && !lockedUserId && (
                <Col xs={12} md={3}>
                  <Form.Label className="small mb-1">QC User</Form.Label>
                  <Form.Select size="sm" value={formFilters.userId} onChange={(e) => updateFormFilters({ userId: e.target.value })}>
                    <option value="">All QC users</option>
                    {qcUserOptions.map((u) => (
                      <option key={u.userId} value={u.userId}>{u.name}</option>
                    ))}
                  </Form.Select>
                </Col>
              )}
            </Row>
          </div>

          {isCustomPeriod && (
            <CustomDateRangePanel
              startDate={formFilters.startDate}
              endDate={formFilters.endDate}
              onStartChange={handleStartCalendarSelect}
              onEndChange={handleEndCalendarSelect}
            />
          )}

          {/* ── Table ── */}
          {formsLoading && forms.length === 0 ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <div className="table-responsive" style={{ opacity: formsLoading ? 0.65 : 1, transition: "opacity 0.2s" }}>
              <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                  {formsTab === "evaluations" && (
                    <tr>
                      <th>Submitted By</th><th>Date</th><th>Agent Name</th>
                      <th>Team Lead</th><th>Lead ID</th><th>MOD</th><th>Rating</th><th></th>
                    </tr>
                  )}
                  {formsTab === "escalations" && (
                    <tr>
                      <th>Submitted By</th><th>Date</th><th>Agent Name</th>
                      <th>Team Lead</th><th>Lead ID</th><th>Severity</th><th>Issue</th><th></th>
                    </tr>
                  )}
                  {formsTab === "marketing" && (
                    <tr>
                      <th>Submitted By</th><th>Date</th><th>Team Lead</th>
                      <th>Lead ID</th><th>Source</th><th>Quality</th><th>Branch</th><th></th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {forms.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">No forms found</td>
                    </tr>
                  )}
                  {formsTab === "evaluations" && forms.map((row) => (
                    <tr key={row._id}>
                      <td className="fw-semibold">{row.submitterName}</td>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>{row.agentName   || "—"}</td>
                      <td>{row.teamleader  || "—"}</td>
                      <td>{row.leadID      ?? "—"}</td>
                      <td>{row.mod         || "—"}</td>
                      <td>{row.rating      ?? "—"}</td>
                      <td>
                        <GradientButton size="sm" onClick={() => { setSelectedForm(row); setShowDetail(true); }}>View</GradientButton>
                      </td>
                    </tr>
                  ))}
                  {formsTab === "escalations" && forms.map((row) => (
                    <tr key={row._id}>
                      <td className="fw-semibold">{row.submitterName}</td>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>{row.agentName   || "—"}</td>
                      <td>{row.teamleader  || "—"}</td>
                      <td>{row.leadID      || "—"}</td>
                      <td>{row.escSeverity || "—"}</td>
                      <td>{row.issueIden   || "—"}</td>
                      <td>
                        <GradientButton size="sm" onClick={() => { setSelectedForm(row); setShowDetail(true); }}>View</GradientButton>
                      </td>
                    </tr>
                  ))}
                  {formsTab === "marketing" && forms.map((row) => (
                    <tr key={row._id}>
                      <td className="fw-semibold">{row.submitterName}</td>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>{row.teamleader  || "—"}</td>
                      <td>{row.leadID      ?? "—"}</td>
                      <td>{row.source      || "—"}</td>
                      <td>{row.leadQuality || "—"}</td>
                      <td>{row.branch      || "—"}</td>
                      <td>
                        <GradientButton size="sm" onClick={() => { setSelectedForm(row); setShowDetail(true); }}>View</GradientButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* ── Pagination Footer ── */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3 pt-3 border-top">
            <small className="text-muted">
              {totalCount > 0 ? `Showing ${showingFrom}–${showingTo} of ${totalCount}` : "No results"}
            </small>

            <div className="d-flex flex-wrap align-items-center gap-2">
              {/* Page size */}
              <div className="d-flex align-items-center gap-2">
                <Form.Label className="small mb-0 text-muted">Show</Form.Label>
                <Form.Select
                  size="sm"
                  style={{ width: "auto", minWidth: "72px" }}
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Form.Select>
              </div>

              <GradientButton size="sm" onClick={clearFilters}>Clear</GradientButton>

              {/* Previous */}
              <GradientButton
                size="sm"
                disabled={formsPage <= 1 || formsLoading}
                onClick={() => setFormsPage((p) => Math.max(1, p - 1))}
                title="Previous page"
                className="pagination-icon-btn"
              >
                <MdArrowBackIosNew size={14} />
              </GradientButton>

              {/* Page indicator */}
              <span className="text-muted small px-1">
                Page {formsPage} / {totalPages}
              </span>

              {/* Next */}
              <GradientButton
                size="sm"
                disabled={formsPage >= totalPages || formsLoading || totalCount === 0}
                onClick={() => setFormsPage((p) => Math.min(totalPages, p + 1))}
                title="Next page"
                className="pagination-icon-btn"
              >
                <MdArrowForwardIos size={14} />
              </GradientButton>

              {/* Jump to last page */}
              <div className="position-relative">
                <GradientButton
                  size="sm"
                  disabled={isLastPageDisabled}
                  onClick={handleJumpToLastPage}
                  title={`Jump to last page (page ${totalPages})`}
                  className="pagination-icon-btn"
                >
                  <MdSkipNext size={20} />
                </GradientButton>
                <InlineToast
                  visible={lastPageToast}
                  message={`You're now on the last page (page ${totalPages})`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormDetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        record={selectedForm}
        type={
          formsTab === "escalations" ? "escalation"
          : formsTab === "marketing" ? "marketing"
          : "evaluation"
        }
      />

      <style>{`
        .analytics-dashboard {
          font-family: "Inter", "Segoe UI", sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }
        .custom-date-range-panel {
          background: #f8fafc !important;
        }
        .custom-date-calendar {
          width: 220px;
          max-width: 100%;
        }
        .calendar-label,
        .calendar-selected {
          font-size: 0.7rem;
          display: inline-flex;
          align-items: center;
        }
        .calendar-month-title { font-size: 0.75rem; }
        .calendar-nav-btn {
          font-size: 0.85rem;
          line-height: 1.2;
          min-height: 22px;
        }
        .calendar-weekdays,
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .calendar-weekday {
          font-size: 0.65rem;
          font-weight: 600;
          color: #64748b;
          text-align: center;
          padding: 0.1rem 0;
        }
        .calendar-day {
          border: none;
          background: transparent;
          border-radius: 6px;
          min-height: 26px;
          height: 26px;
          padding: 0;
          font-size: 0.7rem;
          color: #1e293b;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .calendar-day.empty { pointer-events: none; }
        .calendar-day:hover:not(.selected) { background: #e2e8f0; }
        .calendar-day.today { box-shadow: inset 0 0 0 1px #2196f3; }
        .calendar-day.in-range:not(.selected) { background: rgba(33,150,243,0.12); }
        .calendar-day.selected {
          background: linear-gradient(90deg, #4caf50, #2196f3);
          color: #fff;
          font-weight: 600;
        }
        .pagination-icon-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          padding-left: 0.45rem !important;
          padding-right: 0.45rem !important;
          min-width: 32px;
        }

        /* ── Last-page inline toast ── */
        .last-page-toast {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          white-space: nowrap;
          background: #1e293b;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          pointer-events: none;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 999;
        }
        .last-page-toast::after {
          content: "";
          position: absolute;
          top: 100%;
          right: 10px;
          border: 5px solid transparent;
          border-top-color: #1e293b;
        }
        .last-page-toast.lpt-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default QcSubmittedForms;