"use strict";
/* OCG administration client. The server remains the authorization boundary. */
const appRoot = document.getElementById("admin-app");
const API_BASE = (() => {
    const configured = window.OCG_API_URL;
    return configured ? configured.replace(/\/$/, "") : `${location.origin}/api/v1`;
})();
const projectStatuses = [
    ["PROPOSED", "Proposed"], ["PLANNING", "Planning"], ["TENDERING", "Tendering"],
    ["AWARDED", "Awarded"], ["STARTED", "Started"], ["ONGOING", "Ongoing"],
    ["ON_HOLD", "On Hold"], ["COMPLETED", "Completed"], ["CANCELLED", "Cancelled"],
].map(([value, label]) => ({ value, label }));
const announcementCategories = [
    ["JOB_VACANCY", "Job Vacancy"], ["BID_TENDER", "Bid / Tender"],
    ["PROCUREMENT_NOTICE", "Procurement Notice"], ["EXPRESSION_OF_INTEREST", "Expression of Interest"],
    ["CONTRACT_AWARD", "Contract Award"], ["GENERAL_NOTICE", "General Notice"],
    ["TRAINING", "Training Opportunity"], ["OTHER", "Other Announcement"],
].map(([value, label]) => ({ value, label }));
const eventStatuses = [
    ["UPCOMING", "Upcoming"], ["ONGOING", "Ongoing"], ["COMPLETED", "Completed"], ["CANCELLED", "Cancelled"],
].map(([value, label]) => ({ value, label }));
const submissionStatuses = [
    ["NEW", "New"], ["IN_PROGRESS", "In Progress"], ["RESOLVED", "Resolved"], ["ARCHIVED", "Archived"],
].map(([value, label]) => ({ value, label }));
const resources = {
    projects: {
        key: "projects", title: "Projects", singular: "Project",
        mediaField: "coverImageId", fileField: "galleryFiles",
        publicPath: (item) => `/projects.php?slug=${encodeURIComponent(item.slug || "")}`,
        filterLabel: "Status", filterParam: "status", filterOptions: projectStatuses,
        fields: [
            { name: "title", label: "Project title", required: true, full: true },
            { name: "reference", label: "Unique reference (optional)" },
            { name: "slug", label: "URL slug", help: "Leave blank to generate from the title." },
            { name: "shortDescription", label: "Short description", full: true, type: "textarea" },
            { name: "description", label: "Detailed description", full: true, type: "textarea" },
            { name: "category", label: "Project category" },
            { name: "constructionSector", label: "Construction sector" },
            { name: "client", label: "Client" }, { name: "contractor", label: "Contractor" },
            { name: "consultant", label: "Consultant" }, { name: "location", label: "Location" },
            { name: "region", label: "Region" }, { name: "country", label: "Country" },
            { name: "latitude", label: "Latitude", type: "number" }, { name: "longitude", label: "Longitude", type: "number" },
            { name: "contractValue", label: "Contract value", type: "number" }, { name: "currency", label: "Currency (ISO 4217)" },
            { name: "fundingSource", label: "Funding source" }, { name: "contractType", label: "Contract type" },
            { name: "startDate", label: "Start date", type: "date" },
            { name: "plannedCompletionDate", label: "Planned completion", type: "date" },
            { name: "actualCompletionDate", label: "Actual completion", type: "date" },
            { name: "progress", label: "Physical progress (%)", type: "number" },
            { name: "financialProgress", label: "Financial progress (%)", type: "number" },
            { name: "projectManager", label: "Project manager" },
            { name: "coverImageId", label: "Main cover image", type: "media" },
            { name: "status", label: "Status", type: "select", options: projectStatuses },
            { name: "featured", label: "Feature on homepage", type: "checkbox" },
            { name: "published", label: "Published", type: "checkbox", full: true },
            { name: "galleryFiles", label: "Add gallery photos", type: "file", full: true },
            { name: "attachmentFiles", label: "Add supporting documents", type: "file", full: true },
        ],
    },
    announcements: {
        key: "announcements", title: "Announcements", singular: "Announcement",
        mediaField: undefined, fileField: "attachmentFiles",
        publicPath: (item) => `/announcement-detail.php?slug=${encodeURIComponent(item.slug || "")}`,
        filterLabel: "Category", filterParam: "category", filterOptions: announcementCategories,
        fields: [
            { name: "title", label: "Announcement title", required: true, full: true },
            { name: "slug", label: "URL slug" }, { name: "reference", label: "Reference number" },
            { name: "category", label: "Category", type: "select", options: announcementCategories, required: true },
            { name: "summary", label: "Summary", full: true, type: "textarea" },
            { name: "content", label: "Announcement content", full: true, type: "textarea" },
            { name: "applicationInstructions", label: "Application / submission instructions", full: true, type: "textarea" },
            { name: "externalApplicationUrl", label: "External application URL", full: true },
            { name: "deadline", label: "General deadline", type: "datetime-local" },
            { name: "scheduledFor", label: "Scheduled publication", type: "datetime-local" },
            { name: "positionTitle", label: "Position title" }, { name: "department", label: "Department" },
            { name: "vacancyCount", label: "Number of vacancies", type: "number" },
            { name: "requiredQualifications", label: "Required qualifications", full: true, type: "textarea" },
            { name: "experienceRequirements", label: "Experience requirements", full: true, type: "textarea" },
            { name: "employmentType", label: "Employment type" }, { name: "dutyStation", label: "Duty station" },
            { name: "salaryRange", label: "Salary range" },
            { name: "responsibilities", label: "Responsibilities", full: true, type: "textarea" },
            { name: "tenderReference", label: "Tender reference" }, { name: "tenderTitle", label: "Tender title" },
            { name: "procurementCategory", label: "Procurement category" },
            { name: "tenderValue", label: "Tender value", type: "number" },
            { name: "currency", label: "Currency (ISO 4217)" },
            { name: "submissionLocation", label: "Submission location" },
            { name: "openingDate", label: "Bid opening date", type: "datetime-local" },
            { name: "contactPerson", label: "Contact person" },
            { name: "eligibilityRequirements", label: "Eligibility requirements", full: true, type: "textarea" },
            { name: "scopeOfWork", label: "Scope of work", full: true, type: "textarea" },
            { name: "submissionDeadline", label: "Submission deadline", type: "datetime-local" },
            { name: "bidOpeningInformation", label: "Bid opening information", full: true },
            { name: "submissionInstructions", label: "Submission instructions", full: true, type: "textarea" },
            { name: "contactInformation", label: "Contact information" },
            { name: "featured", label: "Featured notice", type: "checkbox" },
            { name: "published", label: "Published", type: "checkbox", full: true },
            { name: "attachmentFiles", label: "Upload tender / vacancy documents", type: "file", full: true },
        ],
    },
    news: {
        key: "news", title: "News", singular: "News Article",
        mediaField: "featuredImageId",
        fileField: "galleryFiles",
        publicPath: (item) => `/news-detail.php?slug=${encodeURIComponent(item.slug || "")}`,
        fields: [
            { name: "title", label: "Article title", required: true, full: true },
            { name: "slug", label: "URL slug" }, { name: "category", label: "Category" },
            { name: "summary", label: "Summary", full: true, type: "textarea" },
            { name: "content", label: "Article content", full: true, type: "textarea" },
            { name: "tags", label: "Tags (comma separated)", type: "tags", full: true },
            { name: "galleryFiles", label: "Add gallery images", type: "file", full: true },
            { name: "featuredImageId", label: "Featured image", type: "media" },
            { name: "socialImageId", label: "Social sharing image", type: "media" },
            { name: "seoTitle", label: "SEO title" }, { name: "seoDescription", label: "SEO description" },
            { name: "authorName", label: "Author name" },
            { name: "scheduledFor", label: "Scheduled publication", type: "datetime-local" },
            { name: "featured", label: "Featured news", type: "checkbox" },
            { name: "published", label: "Published", type: "checkbox", full: true },
        ],
    },
    events: {
        key: "events", title: "Events", singular: "Event",
        mediaField: "eventImageId",
        publicPath: (item) => `/event-detail.php?slug=${encodeURIComponent(item.slug || "")}`,
        filterLabel: "Status", filterParam: "status", filterOptions: eventStatuses,
        fields: [
            { name: "title", label: "Event title", required: true, full: true },
            { name: "slug", label: "URL slug" }, { name: "category", label: "Event category" },
            { name: "description", label: "Description", full: true, type: "textarea" },
            { name: "startsAt", label: "Starts at (optional)", type: "datetime-local" },
            { name: "endsAt", label: "Ends at (optional)", type: "datetime-local" },
            { name: "eventImageId", label: "Event image", type: "media" },
            { name: "location", label: "Physical location" }, { name: "onlineMeetingUrl", label: "Online meeting URL" },
            { name: "registrationUrl", label: "Registration URL" }, { name: "organizer", label: "Organizer" },
            { name: "contactInfo", label: "Contact information" },
            { name: "status", label: "Status", type: "select", options: eventStatuses },
            { name: "featured", label: "Featured event", type: "checkbox" },
            { name: "published", label: "Published", type: "checkbox", full: true },
        ],
    },
};
const state = {
    session: null,
    route: [],
    resource: "dashboard",
    editingId: "",
    editing: null,
    listData: null,
    listTotal: 0,
    page: 1,
    search: "",
    filter: "",
    mediaList: [],
    roleList: [],
    submissionType: "contact",
    formError: "",
    loginMode: "login",
    loginMessage: "",
    resetToken: "",
    forcePasswordChange: false,
    formDirty: false,
    contentPage: "home",
    editingSection: null,
};
function h(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[character] || character);
}
function badge(value, tone = "gray") {
    return `<span class="badge ${tone}"><span class="status-dot"></span>${h(value)}</span>`;
}
function formatDate(value, withTime = false) {
    if (!value)
        return "—";
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime()))
        return "—";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(date);
}
function toLocalInput(value) {
    if (!value)
        return "";
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime()))
        return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function statusLabel(value) {
    return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
}
function can(permission) {
    return Boolean(state.session?.permissions.includes(permission));
}
function apiOrigin() {
    try {
        return new URL(API_BASE).origin;
    }
    catch {
        return location.origin;
    }
}
function mediaUrl(value) {
    if (!value)
        return "";
    return value.startsWith("http") ? value : `${apiOrigin()}${value}`;
}
function navigate(route) {
    const next = `#${route}`;
    if (location.hash === next) {
        state.route = route.split("/").filter(Boolean);
        void render();
    }
    else {
        location.hash = next;
    }
}
function currentRoute() {
    return location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}
async function api(path, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers);
    if (options.body && !(options.body instanceof FormData))
        headers.set("Content-Type", "application/json");
    if (method !== "GET" && state.session?.csrfToken)
        headers.set("X-CSRF-Token", state.session.csrfToken);
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
    if (response.status === 204)
        return null;
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401 && !path.startsWith("/auth/")) {
            state.session = null;
            state.forcePasswordChange = false;
        }
        const error = new Error(payload.error?.message || `Request failed (${response.status}).`);
        error.details = payload.error?.details;
        throw error;
    }
    return payload.data;
}
async function refreshSession() {
    try {
        const data = await api("/auth/me");
        state.session = { user: data.user, permissions: data.permissions, csrfToken: data.csrfToken };
        state.forcePasswordChange = Boolean(data.user.mustChangePassword);
        return true;
    }
    catch {
        state.session = null;
        state.forcePasswordChange = false;
        return false;
    }
}
function renderLogin() {
    const isForgot = state.loginMode === "forgot";
    const isReset = state.loginMode === "reset";
    const title = isReset ? "Choose a new password" : isForgot ? "Reset your password" : "Welcome back";
    const subtitle = isReset ? "Enter the reset token from your email and a new password." : isForgot ? "Enter your account email to receive a secure reset link." : "Sign in to manage OCG projects, announcements, news and events.";
    appRoot.innerHTML = `
    <div class="login-stage">
      <div class="login-orb login-orb-one"></div><div class="login-orb login-orb-two"></div>
      <div class="login-card">
        <div class="login-brand"><img src="../assets/img/ocg-logo.svg" alt="OCG"><div><strong>OCG</strong><span>ORO-CONSTRUCTION GROUP</span></div></div>
        <div class="login-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3z"/><path d="M9.5 12l1.7 1.7 3.5-3.5"/></svg></div>
        <h1>${h(title)}</h1><p>${h(subtitle)}</p>
        ${state.loginMessage ? `<div class="form-success">${h(state.loginMessage)}</div>` : ""}
        ${isReset ? `
          <form data-reset-form>
            <div class="form-grid"><div class="form-field"><label>Reset token</label><input name="token" required value="${h(state.resetToken)}" autocomplete="off"></div>
            <div class="form-field"><label>New password</label><input name="password" type="password" required minlength="12" autocomplete="new-password"></div></div>
            <button class="btn login-submit" type="submit">Reset password <span>→</span></button>
          </form>` : isForgot ? `
          <form data-forgot-form>
            <div class="form-field"><label>Email address</label><input name="email" type="email" required autocomplete="username"></div>
            <button class="btn login-submit" type="submit">Send reset link <span>→</span></button>
          </form>
          <div class="login-help"><a href="#" data-action="back-to-login">Back to sign in</a></div>` : `
          <form data-login-form>
            <div class="form-grid"><div class="form-field"><label>Email address</label><input name="email" type="email" required autocomplete="username"></div>
            <div class="form-field"><label>Password</label><input name="password" type="password" required autocomplete="current-password"></div></div>
            <button class="btn login-submit" type="submit">Sign in securely <span>→</span></button>
          </form>
          <div class="login-help"><a href="#" data-action="forgot-password">Forgot password?</a></div>`}
        <div class="login-secure"><span></span> Protected administration · Authorized personnel only</div>
      </div>
    </div>`;
}
function renderMandatoryPassword() {
    const name = state.session?.user.name || "Administrator";
    appRoot.innerHTML = `<div class="login-stage"><div class="login-orb login-orb-one"></div><div class="login-orb login-orb-two"></div>
  <div class="login-card"><div class="login-brand"><img src="../assets/img/ocg-logo.svg" alt="OCG"><div><strong>OCG</strong><span>ORO-CONSTRUCTION GROUP</span></div></div><div class="login-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3z"/><path d="M9.5 12l1.7 1.7 3.5-3.5"/></svg></div>
  <h1>Change your password</h1><p>${h(name)}, choose a new password with at least 12 characters.</p>
  <form data-mandatory-password-form><div class="form-grid"><div class="form-field"><label>Current password</label><input name="currentPassword" type="password" required autocomplete="current-password"></div>
  <div class="form-field"><label>New password</label><input name="newPassword" type="password" required minlength="12" autocomplete="new-password"></div></div>
  <button class="btn login-submit" type="submit">Update password <span>→</span></button></form><div class="login-secure"><span></span> Secure account setup</div></div></div>`;
}
function navItem(route, label, icon, permission = "") {
    if (permission && !can(permission))
        return "";
    const active = state.resource === route;
    return `<a class="nav-item ${active ? "active" : ""}" href="#${route}" data-nav="${route}"><span class="nav-icon">${icon}</span><span>${h(label)}</span></a>`;
}
function renderShell() {
    const session = state.session;
    if (!session)
        return;
    const initials = session.user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    appRoot.innerHTML = `
    <div class="admin-shell">
      <aside class="sidebar" id="sidebar">
        <button class="sidebar-close" data-action="close-sidebar" aria-label="Close navigation">×</button>
        <div class="sidebar-brand"><img src="../assets/img/ocg-logo.svg" alt="OCG"><div><strong>OCG Admin</strong><span>ORO-CONSTRUCTION GROUP</span></div></div>
        <nav class="sidebar-nav">
          <div class="nav-section">Overview</div>
          ${navItem("dashboard", "Dashboard", "▦")}
          ${navItem("content", "Company Content", "◈", "content:read")}
          <div class="nav-section">Content</div>
          ${navItem("projects", "Projects", "◈", "content:read")}
          ${navItem("announcements", "Announcements", "◫", "content:read")}
          ${navItem("news", "News", "▤", "content:read")}
          ${navItem("events", "Events", "◷", "content:read")}
          ${navItem("media", "Media Library", "▧", "content:read")}
          <div class="nav-section">Administration</div>
          ${navItem("submissions", "Submissions", "✉", "submissions:read")}
          ${navItem("users", "Users", "◎", "users:manage")}
          ${navItem("roles", "Roles", "◆", "roles:manage")}
          ${navItem("audit", "Audit Log", "≡", "audit:read")}
          ${navItem("settings", "Site Settings", "⚙", "settings:manage")}
          ${navItem("account", "Account", "●")}
        </nav>
        <div class="sidebar-foot">OCG CMS · Secure administration<br>v1.0 · <a href="../index.php" target="_blank" rel="noopener" style="color:#c7d9ce">View public site ↗</a></div>
      </aside>
      <div class="admin-main">
        <header class="topbar">
          <div class="topbar-left"><button class="menu-toggle" data-action="open-sidebar" aria-label="Open navigation">☰</button><h1>${h(routeTitle())}</h1></div>
          <div class="topbar-right">
            <form class="global-search" data-global-search><span>⌕</span><input name="q" value="${h(state.search)}" placeholder="Search current section" aria-label="Search"></form>
            <button class="icon-button" data-nav="audit" title="Recent activity">♧${session ? '<span class="notification-dot"></span>' : ""}</button>
            <button class="profile-button" data-nav="account"><span class="profile-avatar">${h(initials)}</span><span>${h(session.user.name.split(" ")[0])}</span><span style="color:#8b978e">⌄</span></button>
          </div>
        </header>
        <main class="content" id="view"><div class="panel"><div class="panel-body"><p style="color:#66736b">Loading…</p></div></div></main>
      </div>
    </div>`;
}
function routeTitle() {
    const resource = state.route[0] || "dashboard";
    if (resource === "dashboard")
        return "Dashboard";
    if (resource === "account")
        return "Account settings";
    if (resource === "media")
        return "Media Library";
    if (resource === "submissions")
        return "Submissions";
    if (resource === "users")
        return "Users & permissions";
    if (resource === "roles")
        return "Roles";
    if (resource === "audit")
        return "Audit Log";
    if (resource === "settings")
        return "Site Settings";
    return resources[resource]?.title || "Administration";
}
function pageHeading(title, subtitle, actions = "") {
    return `<div class="page-heading"><div><h2>${h(title)}</h2><p>${h(subtitle)}</p></div><div>${actions}</div></div>`;
}
function emptyState(title, text, action = "") {
    return `<div class="empty-state"><h3>${h(title)}</h3><p>${h(text)}</p>${action}</div>`;
}
function statCard(label, number, note, accent = false) {
    return `<div class="stat-card ${accent ? "accent" : ""}"><div class="stat-label">${h(label)}</div><div class="stat-number">${h(number)}</div><div class="stat-note">${h(note)}</div></div>`;
}
async function renderDashboard() {
    const stats = await api("/admin/stats");
    const p = stats.projects || {};
    const c = stats.content || {};
    const a = stats.announcements || {};
    let recentSubmissions = [];
    if (can("submissions:read")) {
        const [contact, partnership, survey] = await Promise.all([
            api("/admin/submissions/contact?limit=5"),
            api("/admin/submissions/partnership?limit=5"),
            api("/admin/submissions/survey?limit=5"),
        ]);
        recentSubmissions = [
            ...(contact.items || []).map((item) => ({ ...item, kind: "Contact" })),
            ...(partnership.items || []).map((item) => ({ ...item, kind: "Partnership" })),
            ...(survey.items || []).map((item) => ({ ...item, kind: "Feedback" })),
        ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()).slice(0, 5);
    }
    const projectValues = [p.proposed || 0, p.planning || 0, p.tendering || 0, p.awarded || 0, p.started || 0, p.ongoing || 0, p.completed || 0, p.onHold || 0];
    const projectLabels = ["Proposed", "Planning", "Tendering", "Awarded", "Started", "Ongoing", "Completed", "On hold"];
    const max = Math.max(...projectValues, 1);
    const activity = (stats.recentAudit || []).map((item) => `<div class="activity-item"><span class="activity-dot"></span><div class="activity-copy"><strong>${h(statusLabel(item.action))}</strong><span>${h(item.userEmail || "System")} · ${h(formatDate(item.createdAt, true))}</span></div></div>`).join("") || `<p class="form-help">No activity recorded yet.</p>`;
    document.getElementById("view").innerHTML = `
    ${pageHeading("Dashboard", "A live overview of OCG’s public information and editorial workflow.", `<button class="btn" data-nav="projects">Manage projects <span>→</span></button>`)}
    <div class="stats-grid">
      ${statCard("Total projects", p.total || 0, "Across the corporate project register", true)}
      ${statCard("Ongoing projects", p.ongoing || 0, `${p.started || 0} started · ${p.planning || 0} planning`)}
      ${statCard("Active vacancies", a.activeVacancies ?? a.vacancies ?? 0, `${a.openTenders ?? a.tenders ?? 0} open tender notices`)}
      ${statCard("Published news", c.publishedNews || 0, `${c.draftNews || 0} drafts in progress`)}
      ${statCard("Completed projects", p.completed || 0, "Delivery milestones")}
      ${statCard("Upcoming events", c.upcomingEvents || 0, "Published and scheduled")}
      ${statCard("Media assets", c.recentMedia || 0, "Images and documents")}
      ${statCard("Pending submissions", c.pendingSubmissions || 0, "Contact enquiries awaiting review")}
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h3>Project pipeline</h3><p>Live status distribution across the project portfolio</p></div><a class="btn secondary small" href="#projects" data-nav="projects">View all</a></div><div class="panel-body"><div class="chart-list">
        ${projectValues.map((value, index) => `<div class="chart-row"><span>${h(projectLabels[index])}</span><div class="chart-track"><div class="chart-fill ${index === 5 ? "gold" : ""}" style="width:${Math.round((value / max) * 100)}%"></div></div><span class="chart-value">${value}</span></div>`).join("")}
      </div></div></section>
      <section class="panel"><div class="panel-head"><div><h3>Recent activity</h3><p>Administrative actions and audit trail</p></div><a class="btn secondary small" href="#audit" data-nav="audit">Audit log</a></div><div class="panel-body"><div class="activity-list">${activity}</div></div></section>
    </div>
    <div class="dashboard-grid" style="margin-top:18px">
      <section class="panel"><div class="panel-head"><div><h3>Quick actions</h3><p>Common editorial and publication tasks</p></div></div><div class="panel-body"><div class="quick-actions">
        ${can("content:write") ? `<button class="quick-action" data-nav="projects/new"><strong>New project</strong><span>Create a project record</span></button><button class="quick-action" data-nav="announcements/new"><strong>New announcement</strong><span>Vacancy, tender or notice</span></button><button class="quick-action" data-nav="news/new"><strong>New news article</strong><span>Publish a company update</span></button>` : ""}
        ${can("content:publish") ? `<button class="quick-action" data-nav="projects"><strong>Review drafts</strong><span>Open the project register</span></button>` : ""}
        ${can("media:write") ? `<button class="quick-action" data-nav="media"><strong>Upload media</strong><span>Images and documents</span></button>` : ""}
      </div></div></section>
      <section class="panel"><div class="panel-head"><div><h3>Announcement mix</h3><p>Published corporate notices</p></div><a class="btn secondary small" href="#announcements" data-nav="announcements">Manage</a></div><div class="panel-body"><div class="chart-list">
        ${[["Vacancies", a.vacancies || 0], ["Tenders", a.tenders || 0], ["Procurement", a.procurement || 0], ["General notices", a.general || 0], ["Training", a.training || 0]].map(([label, value], index) => `<div class="chart-row"><span>${h(label)}</span><div class="chart-track"><div class="chart-fill ${index % 2 ? "gold" : ""}" style="width:${Math.min(100, Number(value) * 10)}%"></div></div><span class="chart-value">${h(value)}</span></div>`).join("")}
      </div></div></section>
      <section class="panel"><div class="panel-head"><div><h3>Recent submissions</h3><p>Most recent contact, partnership and feedback records</p></div><a class="btn secondary small" href="#submissions" data-nav="submissions">Review</a></div><div class="panel-body"><div class="activity-list">
        ${recentSubmissions.length ? recentSubmissions.map((item) => `<div class="activity-item"><span class="activity-dot"></span><div class="activity-copy"><strong>${h(item.kind)} · ${h(item.firstName ? `${item.firstName} ${item.lastName || ""}` : item.name || item.organization || "Anonymous")}</strong><span>${h(item.email || "No email")} · ${h(formatDate(item.createdAt, true))}</span></div></div>`).join("") : `<p class="form-help">No submissions have been received yet.</p>`}
      </div></div></section>
    </div>`;
}
async function renderResourceList(key) {
    const def = resources[key];
    const params = new URLSearchParams({ limit: "20", page: String(state.page) });
    if (state.search)
        params.set("q", state.search);
    if (state.filter && def.filterParam)
        params.set(def.filterParam, state.filter);
    const data = await api(`/admin/${key}?${params.toString()}`);
    state.listData = data;
    state.listTotal = data.meta?.total || 0;
    const rows = data.items || [];
    const filter = def.filterOptions ? `<div class="filter-bar"><input name="q" value="${h(state.search)}" placeholder="Search ${h(def.title.toLowerCase())}" aria-label="Search" data-list-search><select data-list-filter aria-label="${h(def.filterLabel || "Filter")}"><option value="">${h(def.filterLabel || "All")}</option>${def.filterOptions.map((option) => `<option value="${h(option.value)}" ${state.filter === option.value ? "selected" : ""}>${h(option.label)}</option>`).join("")}</select><button class="btn secondary small" data-action="apply-filters">Apply filters</button></div>` : `<div class="filter-bar"><input name="q" value="${h(state.search)}" placeholder="Search ${h(def.title.toLowerCase())}" aria-label="Search" data-list-search></div>`;
    const action = can("content:write") ? `<a class="btn" href="#${key}/new" data-nav="${key}/new">New ${h(def.singular.toLowerCase())}</a>` : "";
    document.getElementById("view").innerHTML = `
    ${pageHeading(def.title, `Create, review and publish ${def.title.toLowerCase()} for the public website.`, action)}
    <div class="toolbar"><h3>${h(def.title)} <span style="color:#66736b;font-weight:500">(${state.listTotal})</span></h3>${filter}</div>
    <div class="panel"><div class="table-wrap">${rows.length ? renderResourceTable(key, rows) : emptyState("No records found", "Create the first record or adjust your search and filters.", action)}</div>${renderPagination()}</div>`;
}
function renderResourceTable(key, rows) {
    if (key === "projects") {
        return `<table class="data-table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Publication</th><th>Updated</th><th></th></tr></thead><tbody>${rows.map((item) => `<tr>
      <td><span class="cell-title">${h(item.title)}</span><span class="cell-sub">${h(item.reference)} · ${h(item.category)}</span></td>
      <td><select data-project-status="${h(item.id)}" class="badge gray" style="border:1px solid #dce5de;border-radius:99px;padding:4px 6px;font-size:9px">${projectStatuses.map((option) => `<option value="${option.value}" ${item.status === option.value ? "selected" : ""}>${h(option.label)}</option>`).join("")}</select></td>
      <td><strong>${h(item.progress)}%</strong></td><td>${item.published ? badge("Published", "green") : badge("Draft", "gold")}</td><td>${h(formatDate(item.updatedAt))}</td>
      <td>${resourceActions(key, item)}</td></tr>`).join("")}</tbody></table>`;
    }
    if (key === "announcements") {
        return `<table class="data-table"><thead><tr><th>Announcement</th><th>Category</th><th>Deadline</th><th>State</th><th>Publication</th><th></th></tr></thead><tbody>${rows.map((item) => `<tr>
      <td><span class="cell-title">${h(item.title)}</span><span class="cell-sub">${h(item.reference || item.positionTitle || item.tenderReference || "")}</span></td>
      <td>${h(statusLabel(item.category))}</td><td>${h(formatDate(item.submissionDeadline || item.deadline))}</td>
      <td>${badge(item.state || "OPEN", item.state === "CLOSED" ? "red" : item.state === "UPCOMING" ? "gold" : "green")}</td>
      <td>${item.published ? badge("Published", "green") : badge("Draft", "gold")}</td><td>${resourceActions(key, item)}</td></tr>`).join("")}</tbody></table>`;
    }
    if (key === "news") {
        return `<table class="data-table"><thead><tr><th>Article</th><th>Category</th><th>Tags</th><th>Publication</th><th>Updated</th><th></th></tr></thead><tbody>${rows.map((item) => `<tr>
      <td><span class="cell-title">${h(item.title)}</span><span class="cell-sub">${h(item.slug)}</span></td><td>${h(item.category)}</td>
      <td><div class="chip-list">${(item.tags || []).slice(0, 3).map((tag) => `<span class="chip">${h(tag)}</span>`).join("")}</div></td>
      <td>${item.published ? badge("Published", "green") : badge("Draft", "gold")}</td><td>${h(formatDate(item.updatedAt))}</td><td>${resourceActions(key, item)}</td></tr>`).join("")}</tbody></table>`;
    }
    return `<table class="data-table"><thead><tr><th>Event</th><th>When</th><th>Status</th><th>Publication</th><th></th></tr></thead><tbody>${rows.map((item) => `<tr>
    <td><span class="cell-title">${h(item.title)}</span><span class="cell-sub">${h(item.category)} · ${h(item.location || "Online")}</span></td>
    <td>${h(formatDate(item.startsAt, true))}</td><td>${badge(statusLabel(item.status), item.status === "CANCELLED" ? "red" : item.status === "COMPLETED" ? "gray" : "green")}</td>
    <td>${item.published ? badge("Published", "green") : badge("Draft", "gold")}</td><td>${resourceActions(key, item)}</td></tr>`).join("")}</tbody></table>`;
}
function resourceActions(key, item) {
    return `<div class="table-actions">
    <a class="btn secondary small" href="${h(resources[key].publicPath(item))}" target="_blank" rel="noopener" title="Preview public page">Preview</a>
    ${can("content:write") ? `<a class="btn secondary small" href="#${key}/${h(item.id)}" data-nav="${key}/${h(item.id)}">Edit</a>` : ""}
    ${can("content:publish") ? `<button class="btn small ${item.published ? "ghost" : "secondary"}" data-action="toggle-publish" data-resource="${key}" data-id="${h(item.id)}" data-published="${item.published ? "true" : "false"}">${item.published ? "Unpublish" : "Publish"}</button>` : ""}
    ${can("content:delete") ? `<button class="btn danger small" data-action="delete-resource" data-resource="${key}" data-id="${h(item.id)}">Delete</button>` : ""}
  </div>`;
}
function renderPagination() {
    const pages = Math.max(1, state.listData?.meta?.pages || 1);
    return `<div class="pagination"><span>Page ${state.page} of ${pages}</span><button class="btn secondary small" data-action="page-prev" ${state.page <= 1 ? "disabled" : ""}>Previous</button><button class="btn secondary small" data-action="page-next" ${state.page >= pages ? "disabled" : ""}>Next</button></div>`;
}
function fieldValue(item, field) {
    const value = item?.[field.name];
    if (field.type === "datetime-local")
        return toLocalInput(value);
    if (field.type === "date")
        return value ? String(value).slice(0, 10) : "";
    if (field.type === "checkbox")
        return value ? "checked" : "";
    return h(value ?? "");
}
function renderField(field, item, mediaOptions) {
    const required = field.required ? ' required aria-required="true"' : "";
    const help = field.help ? `<span class="form-help">${h(field.help)}</span>` : "";
    const label = `<label for="field-${h(field.name)}">${h(field.label)}${field.required ? ' <span class="required">*</span>' : ""}</label>`;
    let input = "";
    if (field.type === "checkbox") {
        input = `<label class="checkbox-row"><input id="field-${h(field.name)}" name="${h(field.name)}" type="checkbox" ${fieldValue(item, field)}> ${h(field.label)}</label>`;
    }
    else if (field.type === "select") {
        input = `<select id="field-${h(field.name)}" name="${h(field.name)}"${required}${field.name === "category" ? ' data-category-select' : ""}>${(field.options || []).map((option) => `<option value="${h(option.value)}" ${String(item?.[field.name] || "") === option.value ? "selected" : ""}>${h(option.label)}</option>`).join("")}</select>`;
    }
    else if (field.type === "media") {
        input = `<select id="field-${h(field.name)}" name="${h(field.name)}"><option value="">No image selected</option>${mediaOptions.map((asset) => `<option value="${h(asset.id)}" ${String(item?.[field.name] || "") === asset.id ? "selected" : ""}>${h(asset.originalName)}</option>`).join("")}</select>`;
    }
    else if (field.type === "textarea") {
        const rich = ["content", "description"].includes(field.name) ? " rich" : "";
        input = `<textarea id="field-${h(field.name)}" name="${h(field.name)}" class="${rich.trim()}"${required}>${fieldValue(item, field)}</textarea>`;
    }
    else if (field.type === "file") {
        const multiple = field.name.includes("Files") ? " multiple" : "";
        input = `<input id="field-${h(field.name)}" name="${h(field.name)}" type="file" class="file-input"${multiple}><div class="file-previews" data-file-previews="${h(field.name)}"></div>`;
    }
    else {
        const type = field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime-local" ? "datetime-local" : field.type === "tags" ? "text" : "text";
        const step = field.name === "progress" || field.name === "financialProgress" || field.name === "vacancyCount" ? ' step="1" min="0"' : field.name === "latitude" ? ' step="any" min="-90" max="90"' : field.name === "longitude" ? ' step="any" min="-180" max="180"' : field.type === "number" ? ' step="any" min="0"' : "";
        const max = field.name === "progress" || field.name === "financialProgress" ? ' max="100"' : field.name === "vacancyCount" ? ' max="999999"' : "";
        const nonBlank = field.required && type === "text" ? ' pattern=".*\\S.*"' : "";
        input = `<input id="field-${h(field.name)}" name="${h(field.name)}" type="${type}" value="${fieldValue(item, field)}"${required}${step}${max}${nonBlank}>`;
    }
    const conditional = ["positionTitle", "department", "vacancyCount", "employmentType", "dutyStation", "salaryRange", "requiredQualifications", "experienceRequirements", "responsibilities"].includes(field.name)
        ? ' data-conditional="vacancy"'
        : ["tenderReference", "tenderTitle", "procurementCategory", "tenderValue", "eligibilityRequirements", "scopeOfWork", "submissionLocation", "bidOpeningInformation", "submissionInstructions"].includes(field.name)
            ? ' data-conditional="tender"'
            : "";
    return `<div class="form-field ${field.full ? "full" : ""}"${conditional}>${field.type === "checkbox" ? input : label + input}${help}</div>`;
}
function formSections(key) {
    const groups = {
        projects: [
            ["Basic Information", ["title", "reference", "slug", "shortDescription", "description"]],
            ["Project Details", ["category", "constructionSector", "location", "region", "country", "latitude", "longitude"]],
            ["Client and Contractor", ["client", "contractor", "consultant", "projectManager"]],
            ["Financial Information", ["contractValue", "currency", "fundingSource", "contractType", "financialProgress"]],
            ["Timeline and Progress", ["startDate", "plannedCompletionDate", "actualCompletionDate", "progress", "status"]],
            ["Images and Attachments", ["coverImageId", "galleryFiles", "attachmentFiles"]],
            ["Publishing", ["featured", "published"]],
        ],
        announcements: [
            ["Basic Information", ["title", "slug", "reference", "category", "summary", "content"]],
            ["Category Details", ["positionTitle", "department", "vacancyCount", "employmentType", "dutyStation", "salaryRange", "requiredQualifications", "experienceRequirements", "responsibilities", "tenderReference", "tenderTitle", "procurementCategory", "tenderValue", "currency", "eligibilityRequirements", "scopeOfWork", "submissionLocation"]],
            ["Deadlines", ["deadline", "scheduledFor", "submissionDeadline", "openingDate"]],
            ["Documents and Instructions", ["applicationInstructions", "externalApplicationUrl", "submissionInstructions", "bidOpeningInformation", "contactPerson", "contactInformation", "attachmentFiles"]],
            ["Publishing", ["featured", "published"]],
        ],
        news: [
            ["Basic Information", ["title", "slug", "category", "summary", "content", "tags"]],
            ["Images", ["featuredImageId", "socialImageId", "galleryFiles"]],
            ["SEO and Author", ["authorName", "seoTitle", "seoDescription"]],
            ["Publishing", ["scheduledFor", "featured", "published"]],
        ],
        events: [
            ["Basic Information", ["title", "slug", "category", "description"]],
            ["Schedule", ["startsAt", "endsAt", "status"]],
            ["Location and Registration", ["location", "onlineMeetingUrl", "registrationUrl", "eventImageId"]],
            ["Organizer", ["organizer", "contactInfo"]],
            ["Publishing", ["featured", "published"]],
        ],
    };
    const used = new Set();
    const sections = groups[key].map(([title, names]) => {
        names.forEach((name) => used.add(name));
        return { title, fields: defFields(key).filter((field) => names.includes(field.name)) };
    });
    const remaining = defFields(key).filter((field) => !used.has(field.name));
    if (remaining.length)
        sections.push({ title: "Additional Details", fields: remaining });
    return sections;
}
function defFields(key) {
    return resources[key].fields;
}
async function renderResourceForm(key, id) {
    const def = resources[key];
    state.formError = "";
    state.formDirty = false;
    const item = id && id !== "new" ? await api(`/admin/${key}/${id}`) : {};
    state.editing = item;
    state.editingId = id === "new" ? "" : id;
    const media = def.mediaField ? (await api("/admin/media?limit=100")).items || [] : [];
    const action = can("content:write") ? "" : `<div class="error-banner">You have read-only access to this section.</div>`;
    document.getElementById("view").innerHTML = `
    ${pageHeading(id === "new" ? `New ${def.singular.toLowerCase()}` : `Edit ${def.singular.toLowerCase()}`, "Fields marked with an asterisk are required by the API.", `<a class="btn secondary" href="#${key}" data-nav="${key}">Back to ${def.title.toLowerCase()}</a>`)}
    ${action}
    <form class="panel" data-resource-form="${key}" data-id="${h(id === "new" ? "" : id)}"><div class="panel-body">
      <div id="form-error" class="form-error" ${state.formError ? "" : "hidden"}>${h(state.formError)}</div>
      ${formSections(key).map((section) => `<fieldset class="form-section"><legend>${h(section.title)}</legend><div class="form-grid">${section.fields.map((field) => renderField(field, item, media)).join("")}</div></fieldset>`).join("")}
      <div class="form-actions"><span class="left form-help">Only the title is required for a draft. Optional fields can be completed later.</span><a class="btn secondary" href="#${key}" data-nav="${key}">Cancel</a>${can("content:publish") ? `<button class="btn secondary" type="submit" data-save-mode="draft">Save Draft</button><button class="btn" type="submit" data-save-mode="publish">Publish</button>` : ""}<button class="btn" type="submit" data-save-mode="save">Save Changes</button></div>
    </div></form>`;
    const form = document.querySelector("[data-resource-form]");
    if (form) {
        updateConditionalFields(form);
        form.querySelector("[data-category-select]")?.addEventListener("change", () => updateConditionalFields(form));
    }
}
function updateConditionalFields(form) {
    const category = formValue(form, "category");
    form.querySelectorAll('[data-conditional="vacancy"]').forEach((element) => { element.hidden = category !== "JOB_VACANCY"; });
    form.querySelectorAll('[data-conditional="tender"]').forEach((element) => { element.hidden = category !== "BID_TENDER"; });
    const position = form.elements.namedItem("positionTitle");
    const procurement = form.elements.namedItem("procurementCategory");
    if (position)
        position.required = category === "JOB_VACANCY";
    if (procurement)
        procurement.required = category === "BID_TENDER";
}
function formValue(form, name) {
    const element = form.elements.namedItem(name);
    return element && "value" in element ? String(element.value || "") : "";
}
function formChecked(form, name) {
    const element = form.elements.namedItem(name);
    return Boolean(element && "checked" in element && element.checked);
}
function formFiles(form, name) {
    const element = form.elements.namedItem(name);
    return element?.files ? Array.from(element.files) : [];
}
function buildResourceBody(form, key) {
    const body = {};
    for (const field of resources[key].fields) {
        if (field.type === "file")
            continue;
        if (field.type === "checkbox") {
            body[field.name] = formChecked(form, field.name);
            continue;
        }
        if (field.type === "tags") {
            body[field.name] = formValue(form, field.name).split(",").map((tag) => tag.trim()).filter(Boolean);
            continue;
        }
        const raw = formValue(form, field.name).trim();
        if (!raw) {
            body[field.name] = field.required ? "" : undefined;
            continue;
        }
        if (field.type === "number") {
            body[field.name] = Number(raw);
            continue;
        }
        if (field.type === "date" || field.type === "datetime-local") {
            body[field.name] = new Date(raw).toISOString();
            continue;
        }
        body[field.name] = raw;
    }
    return body;
}
async function uploadFiles(files, visibility = "PUBLIC") {
    const assets = [];
    for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("visibility", visibility);
        assets.push(await api("/admin/media", { method: "POST", body: data }));
    }
    return assets;
}
async function saveResource(form, key) {
    const id = form.dataset.id || "";
    const body = buildResourceBody(form, key);
    const result = await api(`/admin/${key}${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST", body: JSON.stringify(body),
    });
    const files = formFiles(form, resources[key].fileField || "");
    const attachmentFiles = key === "projects" ? formFiles(form, "attachmentFiles") : [];
    if (files.length || attachmentFiles.length) {
        const uploaded = await uploadFiles([...files, ...attachmentFiles]);
        if (key === "projects") {
            const ids = (result.images || []).map((image) => image.mediaAsset.id);
            await api(`/admin/projects/${result.id}/gallery`, { method: "PUT", body: JSON.stringify({ mediaIds: ids }) });
            const attachmentIds = (result.attachments || []).map((attachment) => attachment.mediaAsset.id).concat(uploaded.slice(files.length).map((asset) => asset.id));
            await api(`/admin/projects/${result.id}/attachments`, { method: "PUT", body: JSON.stringify({ mediaIds: attachmentIds }) });
        }
        else if (key === "announcements") {
            const ids = (result.attachments || []).map((attachment) => attachment.mediaAsset.id);
            await api(`/admin/announcements/${result.id}/attachments`, { method: "PUT", body: JSON.stringify({ mediaIds: ids }) });
        }
        else if (key === "news") {
            const ids = (result.images || []).map((image) => image.mediaAsset.id);
            await api(`/admin/news/${result.id}/gallery`, { method: "PUT", body: JSON.stringify({ mediaIds: ids }) });
        }
    }
    state.search = "";
    state.formDirty = false;
    navigate(key);
}
async function renderCompanyContent() {
    const params = new URLSearchParams({ page: state.contentPage || "home" });
    const sections = await api(`/admin/page-sections?${params.toString()}`);
    state.editingSection = state.editingSection || null;
    const section = state.editingSection;
    document.getElementById("view").innerHTML = `
    ${pageHeading("Company Content", "Manage the official corporate profile, financial labels, leadership and strategy content by page and section.", `<button class="btn" data-action="new-section">New section</button>`)}
    <div class="toolbar"><div class="filter-bar"><input data-content-page value="${h(state.contentPage)}" placeholder="Page key (home, about, services, subsidiaries, financial)"><button class="btn secondary small" data-action="apply-content-page">Load page</button></div></div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h3>${h(state.contentPage)} sections</h3><p>${sections.length} editable records</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Section</th><th>Title</th><th>Order</th><th>Status</th><th></th></tr></thead><tbody>${sections.map((item) => `<tr><td><span class="cell-title">${h(item.sectionKey)}</span></td><td>${h(item.title)}</td><td>${h(item.sortOrder)}</td><td>${item.published ? badge("Published", "green") : badge("Draft", "gold")}</td><td><div class="table-actions"><button class="btn secondary small" data-action="edit-section" data-id="${h(item.id)}">Edit</button>${can("content:delete") ? `<button class="btn danger small" data-action="delete-section" data-id="${h(item.id)}">Delete</button>` : ""}</div></td></tr>`).join("") || '<tr><td colspan="5">No sections for this page key.</td></tr>'}</tbody></table></div></section>
      <section class="panel"><div class="panel-head"><div><h3>${section ? "Edit section" : "Create section"}</h3><p>Content is sanitized for public rich-text fields by the rendering layer.</p></div></div><div class="panel-body"><form data-company-content-form data-id="${h(section?.id || "")}"><div class="form-grid">
        <div class="form-field"><label>Page key</label><input name="pageKey" value="${h(section?.pageKey || state.contentPage)}" required></div>
        <div class="form-field"><label>Section key</label><input name="sectionKey" value="${h(section?.sectionKey || "")}" required></div>
        <div class="form-field full"><label>Title</label><input name="title" value="${h(section?.title || "")}" required></div>
        <div class="form-field full"><label>Content</label><textarea name="content" class="rich">${h(section?.content || "")}</textarea></div>
        <div class="form-field full"><label>Metadata JSON</label><textarea name="metadata">${h(section ? JSON.stringify(section.metadata, null, 2) : "{}")}</textarea></div>
        <div class="form-field"><label>Sort order</label><input name="sortOrder" type="number" value="${h(section?.sortOrder ?? 0)}"></div>
        <div class="form-field"><label>Image ID (optional)</label><input name="imageId" value="${h(section?.imageId || "")}"></div>
        <div class="form-field full"><label class="checkbox-row"><input name="published" type="checkbox" ${section?.published === false ? "" : "checked"}> Published</label></div>
      </div><div class="form-actions"><button class="btn" type="submit">Save section</button></div></form></div></section>
    </div>`;
}
async function renderMedia() {
    const params = new URLSearchParams({ limit: "100" });
    if (state.search)
        params.set("q", state.search);
    const data = await api(`/admin/media?${params.toString()}`);
    state.mediaList = data.items || [];
    document.getElementById("view").innerHTML = `
    ${pageHeading("Media Library", "Upload approved images and documents, then reuse them across projects, news and announcements.", can("media:write") ? `<button class="btn" data-action="focus-media-upload">Upload media</button>` : "")}
    <div class="toolbar"><div class="filter-bar"><input data-list-search value="${h(state.search)}" placeholder="Search file names, descriptions or alt text" aria-label="Search media"><button class="btn secondary small" data-action="apply-media-search">Search</button></div></div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h3>Upload a file</h3><p>Images, PDF, Word and Excel documents</p></div></div><div class="panel-body">
        ${can("media:write") ? `<form data-media-form><div class="form-grid"><div class="form-field full"><label for="media-file">File</label><input id="media-file" name="file" type="file" class="file-input" required></div><div class="form-field"><label for="media-visibility">Visibility</label><select id="media-visibility" name="visibility"><option value="PUBLIC">Public</option><option value="PRIVATE">Private</option></select></div><div class="form-field"><label for="media-alt">Alt text</label><input id="media-alt" name="altText" placeholder="Describe the image"></div><div class="form-field full"><label for="media-description">Description</label><input id="media-description" name="description" placeholder="Internal note"></div></div><div class="form-actions"><button class="btn" type="submit">Upload file</button></div></form>` : `<p class="form-help">You have read-only access to the media library.</p>`}
      </div></section>
      <section class="panel"><div class="panel-head"><div><h3>Storage rules</h3><p>Applied by the API</p></div></div><div class="panel-body"><div class="activity-list"><div class="activity-item"><span class="activity-dot"></span><div class="activity-copy"><strong>Content-based validation</strong><span>MIME signatures are checked before storage.</span></div></div><div class="activity-item"><span class="activity-dot"></span><div class="activity-copy"><strong>Random filenames</strong><span>Uploads cannot overwrite existing files.</span></div></div><div class="activity-item"><span class="activity-dot"></span><div class="activity-copy"><strong>Private document protection</strong><span>Private files require an authenticated download.</span></div></div></div></div></section>
    </div>
    <section class="panel" style="margin-top:18px"><div class="panel-head"><div><h3>All media <span style="color:#66736b">(${state.mediaList.length})</span></h3><p>Images and documents available for reuse</p></div></div><div class="panel-body"><div class="media-grid">${state.mediaList.length ? state.mediaList.map(renderMediaCard).join("") : emptyState("No media yet", "Upload the first image or document.")}</div></div></section>`;
}
function renderMediaCard(item) {
    const url = item.url ? mediaUrl(item.url) : "";
    const isImage = item.kind === "IMAGE";
    return `<article class="media-card" data-media-card="${h(item.id)}">
    <div class="media-preview">${isImage && url ? `<img src="${h(url)}" alt="${h(item.altText || item.originalName)}" loading="lazy">` : `<span>${h(item.extension.toUpperCase())} document</span>`}</div>
    <div class="media-meta"><strong>${h(item.originalName)}</strong><span>${h(item.mimeType)} · ${h(Math.ceil(item.size / 1024))} KB · ${h(item.visibility)}</span></div>
    <form class="mini-form" data-media-update-form="${h(item.id)}"><input name="altText" value="${h(item.altText || "")}" placeholder="Alt text"><input name="description" value="${h(item.description || "")}" placeholder="Description"><button class="btn secondary small" type="submit">Save details</button></form>
    <div class="media-actions"><a class="btn secondary small" href="${h(url)}${url ? "?download=1" : ""}" target="_blank" rel="noopener">Download</a>${can("content:delete") ? `<button class="btn danger small" data-action="delete-media" data-id="${h(item.id)}">Delete</button>` : ""}</div>
  </article>`;
}
async function renderSubmissions() {
    const type = state.submissionType;
    const data = await api(`/admin/submissions/${type}?limit=50`);
    const rows = data.items || [];
    const tabs = [["contact", "Contact"], ["partnership", "Partnership"], ["survey", "Feedback"]].map(([value, label]) => `<a class="btn ${type === value ? "" : "secondary"} small" href="#submissions" data-submission-tab="${value}">${h(label)}</a>`).join("");
    document.getElementById("view").innerHTML = `
    ${pageHeading("Submissions", "Review enquiries, partnership proposals and website feedback captured by the public forms.", `<div style="display:flex;gap:6px">${tabs}</div>`)}
    <div class="panel"><div class="panel-head"><div><h3>${h(statusLabel(type))} submissions</h3><p>${rows.length} shown · newest first</p></div></div><div class="table-wrap">${rows.length ? `<table class="data-table"><thead><tr><th>From</th><th>Subject / organisation</th><th>Message</th><th>Received</th><th>Status</th></tr></thead><tbody>${rows.map((item) => `<tr>
      <td><span class="cell-title">${h(item.firstName ? `${item.firstName} ${item.lastName || ""}` : item.name || "Anonymous")}</span><span class="cell-sub">${h(item.email || "No email")}</span></td>
      <td><span class="cell-title">${h(item.subject || item.organization || item.area || "—")}</span>${item.attachment ? `<span class="cell-sub"><a href="${h(mediaUrl(`/api/v1/admin/media/${item.attachment.id}/file`))}" target="_blank" rel="noopener">Attachment ↗</a></span>` : ""}</td>
      <td style="max-width:420px"><span class="cell-sub" style="display:block;max-height:44px;overflow:hidden">${h((item.message || item.notes || item.feedback || "").slice(0, 220))}</span></td>
      <td>${h(formatDate(item.createdAt, true))}</td>
      <td><select class="badge gray" style="border:1px solid #dce5de;border-radius:99px;padding:4px 6px;font-size:9px" data-submission-status="${h(item.id)}" data-resource="${h(type)}">${submissionStatuses.map((option) => `<option value="${option.value}" ${item.status === option.value ? "selected" : ""}>${h(option.label)}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table>` : emptyState("No submissions", "Public form submissions will appear here when received.")}</div></div>`;
}
async function renderUsers() {
    const [data, roles] = await Promise.all([api("/admin/users?limit=100"), api("/admin/roles")]);
    state.roleList = roles || [];
    const rows = data.items || [];
    document.getElementById("view").innerHTML = `
    ${pageHeading("Users & permissions", "Create administrator accounts and assign the roles that control CMS access.")}
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h3>User accounts <span style="color:#66736b">(${rows.length})</span></h3><p>Account status and assigned roles</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>User</th><th>Roles</th><th>Status</th><th>Last login</th><th></th></tr></thead><tbody>${rows.map((item) => `<tr>
        <td><span class="cell-title">${h(item.name)}</span><span class="cell-sub">${h(item.email)}</span></td><td>${(item.roles || []).map((entry) => badge(entry.role.name, "blue")).join(" ") || "—"}</td>
        <td>${badge(statusLabel(item.status), item.status === "ACTIVE" ? "green" : "gray")}</td><td>${h(formatDate(item.lastLoginAt, true))}</td>
        <td><div class="table-actions"><button class="btn secondary small" data-action="reset-user-password" data-id="${h(item.id)}">Reset password</button><button class="btn danger small" data-action="delete-user" data-id="${h(item.id)}">Delete</button></div></td></tr>`).join("")}</tbody></table></div></section>
      <section class="panel"><div class="panel-head"><div><h3>Create a user</h3><p>Initial passwords must be changed at first sign-in</p></div></div><div class="panel-body"><form data-user-form><div class="form-grid"><div class="form-field full"><label>Name</label><input name="name" required></div><div class="form-field full"><label>Email</label><input name="email" type="email" required></div><div class="form-field full"><label>Temporary password</label><input name="password" type="password" minlength="12" required></div><div class="form-field full"><label>Roles</label><select name="roleIds" multiple size="${Math.min(5, state.roleList.length || 1)}">${state.roleList.map((role) => `<option value="${h(role.id)}">${h(role.name)}</option>`).join("")}</select><span class="form-help">Select one or more roles.</span></div></div><div class="form-actions"><button class="btn" type="submit">Create user</button></div></form></div></section>
    </div>`;
}
async function renderRoles() {
    const roles = await api("/admin/roles");
    state.roleList = roles || [];
    document.getElementById("view").innerHTML = `
    ${pageHeading("Roles", "Role permissions are enforced on every protected API endpoint.")}
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h3>Defined roles</h3><p>Role assignments control access</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Role</th><th>Description</th><th>Permissions</th><th>Users</th></tr></thead><tbody>${(roles || []).map((role) => `<tr><td><span class="cell-title">${h(role.name)}</span></td><td>${h(role.description)}</td><td><div class="chip-list">${(role.permissions || []).map((permission) => `<span class="chip">${h(permission)}</span>`).join("")}</div></td><td>${h(role._count?.users || 0)}</td></tr>`).join("")}</tbody></table></div></section>
      <section class="panel"><div class="panel-head"><div><h3>Create role</h3><p>Use the API permission names exactly</p></div></div><div class="panel-body"><form data-role-form><div class="form-grid"><div class="form-field full"><label>Role name</label><input name="name" pattern="[A-Z0-9_]+" required placeholder="CUSTOM_EDITOR"></div><div class="form-field full"><label>Description</label><input name="description" required></div><div class="form-field full"><label>Permissions</label><div style="display:grid;gap:6px">${["content:read", "content:write", "content:publish", "content:delete", "submissions:read", "media:write", "users:manage", "roles:manage", "settings:manage", "audit:read"].map((permission) => `<label class="checkbox-row"><input type="checkbox" name="permissions" value="${permission}"> ${permission}</label>`).join("")}</div></div></div><div class="form-actions"><button class="btn" type="submit">Create role</button></div></form></div></section>
    </div>`;
}
async function renderSettings() {
    const settings = await api("/admin/settings");
    document.getElementById("view").innerHTML = `
    ${pageHeading("Site Settings", "Store non-secret site configuration as JSON key/value records.")}
    <div class="settings-grid">
      <section class="panel"><div class="panel-head"><div><h3>Save a setting</h3><p>Keys such as site.name, site.contactEmail and site.social</p></div></div><div class="panel-body"><form data-settings-form><div class="form-grid"><div class="form-field full"><label>Key</label><input name="key" required placeholder="site.name"></div><div class="form-field full"><label>JSON value</label><textarea name="value" required placeholder='{"enabled": true}'></textarea></div></div><div class="form-actions"><button class="btn" type="submit">Save setting</button></div></form></div></section>
      <section class="panel"><div class="panel-head"><div><h3>Current settings</h3><p>${settings.length} records</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Key</th><th>Value</th><th>Updated</th></tr></thead><tbody>${settings.map((setting) => `<tr><td><span class="cell-title">${h(setting.key)}</span></td><td><code style="font-size:9px;word-break:break-word">${h(JSON.stringify(setting.value))}</code></td><td>${h(formatDate(setting.updatedAt))}</td></tr>`).join("") || `<tr><td colspan="3">No settings yet.</td></tr>`}</tbody></table></div></section>
    </div>`;
}
async function renderAudit() {
    const params = new URLSearchParams({ limit: "100" });
    if (state.search)
        params.set("q", state.search);
    const data = await api(`/admin/audit-logs?${params.toString()}`);
    const rows = data.items || [];
    document.getElementById("view").innerHTML = `
    ${pageHeading("Audit Log", "A record of administrative and authentication actions for accountability.")}
    <div class="toolbar"><div class="filter-bar"><input data-list-search value="${h(state.search)}" placeholder="Search actions, users or entities" aria-label="Search audit log"></div></div>
    <div class="panel"><div class="table-wrap">${rows.length ? `<table class="data-table"><thead><tr><th>When</th><th>Action</th><th>User</th><th>Entity</th><th>Metadata</th></tr></thead><tbody>${rows.map((item) => `<tr><td>${h(formatDate(item.createdAt, true))}</td><td><span class="cell-title">${h(item.action)}</span></td><td>${h(item.userEmail || "System")}</td><td>${h(item.entityType)}${item.entityId ? `<span class="cell-sub">${h(item.entityId)}</span>` : ""}</td><td><code style="font-size:9px;word-break:break-word">${h(JSON.stringify(item.metadata))}</code></td></tr>`).join("")}</tbody></table>` : emptyState("No audit records", "Administrative actions will appear here.")}</div></div>`;
}
function renderAccount() {
    const session = state.session;
    if (!session)
        return;
    document.getElementById("view").innerHTML = `
    ${pageHeading("Account Settings", "Manage your profile and password.")}
    ${state.forcePasswordChange ? `<div class="mandatory-banner">Your account still requires a password change. Update your password before continuing to edit content.</div>` : ""}
    <div class="profile-grid">
      <section class="panel"><div class="panel-head"><div><h3>Your profile</h3><p>Signed-in administrator</p></div></div><div class="panel-body"><div style="display:flex;gap:14px;align-items:center"><span class="profile-avatar" style="width:54px;height:54px;font-size:16px">${h(session.user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase())}</span><div><strong>${h(session.user.name)}</strong><div class="form-help">${h(session.user.email)}</div></div></div><div class="chip-list" style="margin-top:18px">${session.user.roles.map((entry) => badge(entry.role.name, "blue")).join("")}</div></div></section>
      <section class="panel"><div class="panel-head"><div><h3>Change password</h3><p>All active sessions are revoked after a change</p></div></div><div class="panel-body"><form data-password-form><div class="form-grid"><div class="form-field full"><label>Current password</label><input name="currentPassword" type="password" required autocomplete="current-password"></div><div class="form-field full"><label>New password</label><input name="newPassword" type="password" minlength="12" required autocomplete="new-password"></div></div><div class="form-actions"><button class="btn" type="submit">Update password</button></div></form></div></section>
    </div>`;
}
async function renderContent() {
    const route = currentRoute();
    state.route = route;
    const resource = route[0] || "dashboard";
    state.resource = resource;
    if (resource && resource in resources) {
        const key = resource;
        if (route[1] === "new" || route[1]) {
            if (!can("content:read")) {
                document.getElementById("view").innerHTML = emptyState("Access restricted", "Your role cannot read this section.");
                return;
            }
            await renderResourceForm(key, route[1]);
        }
        else {
            await renderResourceList(key);
        }
        return;
    }
    if (resource === "dashboard") {
        await renderDashboard();
        return;
    }
    if (resource === "content") {
        await renderCompanyContent();
        return;
    }
    if (resource === "media") {
        await renderMedia();
        return;
    }
    if (resource === "submissions") {
        await renderSubmissions();
        return;
    }
    if (resource === "users") {
        await renderUsers();
        return;
    }
    if (resource === "roles") {
        await renderRoles();
        return;
    }
    if (resource === "settings") {
        await renderSettings();
        return;
    }
    if (resource === "audit") {
        await renderAudit();
        return;
    }
    if (resource === "account") {
        renderAccount();
        return;
    }
    document.getElementById("view").innerHTML = emptyState("Page not found", "The requested administration page does not exist.", `<a class="btn" href="#dashboard" data-nav="dashboard">Return to dashboard</a>`);
}
async function render() {
    if (!state.session) {
        renderLogin();
        return;
    }
    if (state.forcePasswordChange && currentRoute()[0] !== "account") {
        renderMandatoryPassword();
        return;
    }
    renderShell();
    try {
        await renderContent();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "The page could not be loaded.";
        const view = document.getElementById("view");
        if (view)
            view.innerHTML = `<div class="error-banner">${h(message)}</div>${emptyState("Unable to load content", "Check your connection and sign-in status, then try again.", `<button class="btn secondary" data-nav="${h(state.resource)}">Retry</button>`)}`;
    }
}
async function login(email, password) {
    await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    await refreshSession();
    state.loginMode = "login";
    state.loginMessage = "";
    navigate("dashboard");
}
function setFormBusy(form, busy) {
    const button = form.querySelector('button[type="submit"]');
    if (!button)
        return;
    if (busy) {
        button.dataset.original = button.textContent || "";
        button.textContent = "Saving…";
        button.disabled = true;
    }
    else {
        button.textContent = button.dataset.original || "Save";
        button.disabled = false;
    }
}
async function handleResourceSubmit(form, submitter) {
    const key = form.dataset.resourceForm;
    if (!key)
        return;
    try {
        setFormBusy(form, true);
        const mode = submitter?.dataset.saveMode;
        if (mode === "draft")
            form.elements.namedItem("published")?.checked && (form.elements.namedItem("published").checked = false);
        if (mode === "publish") {
            const published = form.elements.namedItem("published");
            if (published)
                published.checked = true;
        }
        await saveResource(form, key);
    }
    catch (error) {
        const element = document.getElementById("form-error");
        if (element) {
            element.hidden = false;
            const details = error.details;
            const detailText = Array.isArray(details)
                ? details.map((item) => {
                    const path = String(item.path || "body");
                    const raw = String(item.message || "invalid");
                    const message = raw.includes("expected string to have <=")
                        ? `${path} is too long`
                        : raw.includes("expected string to have >=")
                            ? `${path} is required`
                            : raw.includes("Invalid input: expected number")
                                ? `${path} must be a valid number`
                                : raw.includes("Invalid date")
                                    ? `${path} must be a valid date`
                                    : raw;
                    const field = document.querySelector(`[name="${path}"]`);
                    if (field) {
                        field.classList.add("is-invalid");
                        let errorNode = field.parentElement?.querySelector(".field-error");
                        if (!errorNode) {
                            errorNode = document.createElement("span");
                            errorNode.className = "field-error";
                            field.insertAdjacentElement("afterend", errorNode);
                        }
                        errorNode.textContent = message;
                    }
                    return `${path}: ${message}`;
                }).join("; ")
                : "";
            element.textContent = `${error instanceof Error ? error.message : "The record could not be saved."}${detailText ? ` (${detailText})` : ""}`;
        }
    }
    finally {
        setFormBusy(form, false);
    }
}
async function handleMediaSubmit(form) {
    try {
        setFormBusy(form, true);
        const file = form.elements.namedItem("file")?.files?.[0];
        if (!file)
            throw new Error("Select a file to upload.");
        const data = new FormData();
        data.append("file", file);
        data.append("visibility", formValue(form, "visibility") || "PUBLIC");
        data.append("altText", formValue(form, "altText"));
        data.append("description", formValue(form, "description"));
        await api("/admin/media", { method: "POST", body: data });
        await renderMedia();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Upload failed.");
    }
    finally {
        setFormBusy(form, false);
    }
}
async function handleMediaUpdate(form) {
    try {
        setFormBusy(form, true);
        await api(`/admin/media/${form.dataset.mediaUpdateForm}`, { method: "PUT", body: JSON.stringify({ altText: formValue(form, "altText"), description: formValue(form, "description") }) });
        await renderMedia();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Media update failed.");
    }
    finally {
        setFormBusy(form, false);
    }
}
async function handleUserSubmit(form) {
    try {
        setFormBusy(form, true);
        const roles = Array.from(form.querySelectorAll('select[name="roleIds"] option:checked')).map((option) => option.value);
        await api("/admin/users", { method: "POST", body: JSON.stringify({ name: formValue(form, "name"), email: formValue(form, "email"), password: formValue(form, "password"), roleIds: roles }) });
        await renderUsers();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "User creation failed.");
    }
    finally {
        setFormBusy(form, false);
    }
}
async function handleRoleSubmit(form) {
    try {
        setFormBusy(form, true);
        const permissions = Array.from(form.querySelectorAll('input[name="permissions"]:checked')).map((input) => input.value);
        await api("/admin/roles", { method: "POST", body: JSON.stringify({ name: formValue(form, "name"), description: formValue(form, "description"), permissions }) });
        await renderRoles();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Role creation failed.");
    }
    finally {
        setFormBusy(form, false);
    }
}
async function handleCompanyContentSubmit(form) {
    try {
        setFormBusy(form, true);
        const id = form.dataset.id || "";
        const body = {
            pageKey: formValue(form, "pageKey"),
            sectionKey: formValue(form, "sectionKey"),
            title: formValue(form, "title"),
            content: formValue(form, "content"),
            metadata: JSON.parse(formValue(form, "metadata") || "{}"),
            sortOrder: Number(formValue(form, "sortOrder") || 0),
            imageId: formValue(form, "imageId") || undefined,
            published: formChecked(form, "published"),
        };
        await api(`/admin/page-sections${id ? `/${id}` : ""}`, { method: id ? "PUT" : "POST", body: JSON.stringify(body) });
        state.editingSection = null;
        await renderCompanyContent();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Company content could not be saved.");
    }
    finally {
        setFormBusy(form, false);
    }
}
async function handleSettingsSubmit(form) {
    try {
        setFormBusy(form, true);
        const value = JSON.parse(formValue(form, "value"));
        await api("/admin/settings", { method: "PUT", body: JSON.stringify({ key: formValue(form, "key"), value }) });
        await renderSettings();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "The value must be valid JSON.");
    }
    finally {
        setFormBusy(form, false);
    }
}
async function handlePasswordSubmit(form, mandatory = false) {
    try {
        setFormBusy(form, true);
        await api("/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword: formValue(form, "currentPassword"), newPassword: formValue(form, "newPassword") }) });
        state.session = null;
        state.forcePasswordChange = false;
        state.loginMode = "login";
        state.loginMessage = "Your password was changed. Please sign in again.";
        renderLogin();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Password change failed.");
    }
    finally {
        if (form.isConnected)
            setFormBusy(form, false);
    }
}
async function togglePublish(resource, id, published) {
    try {
        await api(`/admin/${resource}/${id}/publish`, { method: "POST", body: JSON.stringify({ published: !published }) });
        await render();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Publication update failed.");
    }
}
async function deleteResource(resource, id) {
    if (!window.confirm("Delete this record? It will be removed from the public website."))
        return;
    try {
        await api(`/admin/${resource}/${id}`, { method: "DELETE" });
        navigate(resource);
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Delete failed.");
    }
}
async function deleteMedia(id) {
    if (!window.confirm("Delete this media item? It must not be used by other content."))
        return;
    try {
        await api(`/admin/media/${id}`, { method: "DELETE" });
        await renderMedia();
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Media delete failed.");
    }
}
document.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-nav], [data-action], [data-submission-tab]");
    if (!target)
        return;
    if (target.dataset.nav) {
        event.preventDefault();
        state.filter = "";
        state.page = 1;
        navigate(target.dataset.nav);
        return;
    }
    if (target.dataset.submissionTab) {
        event.preventDefault();
        state.submissionType = target.dataset.submissionTab;
        await renderSubmissions();
        return;
    }
    const action = target.dataset.action;
    if (!action)
        return;
    event.preventDefault();
    if (action === "open-sidebar")
        document.getElementById("sidebar")?.classList.add("is-open");
    if (action === "close-sidebar")
        document.getElementById("sidebar")?.classList.remove("is-open");
    if (action === "logout") {
        try {
            await api("/auth/logout", { method: "POST" });
        }
        catch { /* local sign-out still clears UI */ }
        state.session = null;
        state.forcePasswordChange = false;
        renderLogin();
    }
    if (action === "forgot-password") {
        state.loginMode = "forgot";
        state.loginMessage = "";
        renderLogin();
    }
    if (action === "back-to-login") {
        state.loginMode = "login";
        state.loginMessage = "";
        renderLogin();
    }
    if (action === "focus-media-upload")
        document.getElementById("media-file")?.focus();
    if (action === "remove-file") {
        const name = target.dataset.removeFile || "";
        const form = target.closest("form");
        const input = form?.elements.namedItem(name);
        if (input)
            input.value = "";
        target.closest(".file-preview")?.remove();
        state.formDirty = true;
    }
    if (action === "apply-media-search") {
        const input = document.querySelector('[data-list-search]');
        state.search = input?.value || "";
        await renderMedia();
    }
    if (action === "toggle-publish")
        await togglePublish(target.dataset.resource, target.dataset.id || "", target.dataset.published === "true");
    if (action === "delete-resource")
        await deleteResource(target.dataset.resource, target.dataset.id || "");
    if (action === "delete-media")
        await deleteMedia(target.dataset.id || "");
    if (action === "page-prev") {
        state.page = Math.max(1, state.page - 1);
        await render();
    }
    if (action === "page-next") {
        state.page += 1;
        await render();
    }
    if (action === "apply-filters") {
        const input = document.querySelector('[data-list-search]');
        const filter = document.querySelector('[data-list-filter]');
        state.search = input?.value || "";
        state.filter = filter?.value || "";
        state.page = 1;
        await render();
    }
    if (action === "apply-content-page") {
        const input = document.querySelector('[data-content-page]');
        state.contentPage = input?.value || "home";
        state.editingSection = null;
        await renderCompanyContent();
    }
    if (action === "new-section") {
        state.editingSection = null;
        await renderCompanyContent();
    }
    if (action === "edit-section") {
        state.editingSection = (await api(`/admin/page-sections/${target.dataset.id}`)) || null;
        await renderCompanyContent();
    }
    if (action === "delete-section") {
        if (window.confirm("Delete this company content section?")) {
            try {
                await api(`/admin/page-sections/${target.dataset.id}`, { method: "DELETE" });
                await renderCompanyContent();
            }
            catch (error) {
                window.alert(error instanceof Error ? error.message : "Delete failed.");
            }
        }
    }
    if (action === "reset-user-password") {
        const password = window.prompt("Enter a new temporary password (minimum 12 characters):");
        if (password && password.length >= 12) {
            try {
                await api(`/admin/users/${target.dataset.id}/reset-password`, { method: "POST", body: JSON.stringify({ password }) });
                window.alert("Password reset. The user must change it at next sign-in.");
            }
            catch (error) {
                window.alert(error instanceof Error ? error.message : "Password reset failed.");
            }
        }
    }
    if (action === "delete-user") {
        if (window.confirm("Delete this user account?")) {
            try {
                await api(`/admin/users/${target.dataset.id}`, { method: "DELETE" });
                await renderUsers();
            }
            catch (error) {
                window.alert(error instanceof Error ? error.message : "User delete failed.");
            }
        }
    }
});
document.addEventListener("change", async (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "file") {
        const container = target.parentElement?.querySelector(`[data-file-previews="${target.name}"]`);
        if (container) {
            container.innerHTML = Array.from(target.files || []).map((file) => `<div class="file-preview">${file.type.startsWith("image/") ? `<img src="${URL.createObjectURL(file)}" alt="${h(file.name)}">` : "FILE"}<span>${h(file.name)}</span><button type="button" class="btn ghost small" data-action="remove-file" data-remove-file="${h(target.name)}">Remove</button></div>`).join("");
            state.formDirty = true;
        }
    }
    if (target.matches("[data-category-select]")) {
        const form = target.closest("form");
        if (form)
            updateConditionalFields(form);
    }
    if (target.matches("[data-project-status]")) {
        const select = target;
        try {
            await api(`/admin/projects/${select.dataset.projectStatus}/status`, { method: "POST", body: JSON.stringify({ status: select.value }) });
            await render();
        }
        catch (error) {
            window.alert(error instanceof Error ? error.message : "Status update failed.");
        }
    }
    if (target.matches("[data-submission-status]")) {
        const select = target;
        try {
            await api(`/admin/submissions/${select.dataset.resource}/${select.dataset.submissionStatus}/status`, { method: "PATCH", body: JSON.stringify({ status: select.value }) });
            await renderSubmissions();
        }
        catch (error) {
            window.alert(error instanceof Error ? error.message : "Submission update failed.");
        }
    }
});
document.addEventListener("submit", async (event) => {
    const form = event.target;
    event.preventDefault();
    if (form.matches("[data-login-form]")) {
        try {
            await login(formValue(form, "email"), formValue(form, "password"));
        }
        catch (error) {
            state.loginMessage = error instanceof Error ? error.message : "Sign-in failed.";
            state.loginMode = "login";
            renderLogin();
        }
        return;
    }
    if (form.matches("[data-forgot-form]")) {
        try {
            await api("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: formValue(form, "email") }) });
            state.loginMode = "login";
            state.loginMessage = "If an account exists, a reset link has been prepared.";
            renderLogin();
        }
        catch (error) {
            state.loginMessage = error instanceof Error ? error.message : "Reset request failed.";
            renderLogin();
        }
        return;
    }
    if (form.matches("[data-reset-form]")) {
        try {
            await api("/auth/reset-password", { method: "POST", body: JSON.stringify({ token: formValue(form, "token"), password: formValue(form, "password") }) });
            state.loginMode = "login";
            state.resetToken = "";
            state.loginMessage = "Your password has been reset. Please sign in.";
            renderLogin();
        }
        catch (error) {
            state.loginMessage = error instanceof Error ? error.message : "Password reset failed.";
            renderLogin();
        }
        return;
    }
    if (form.matches("[data-resource-form]")) {
        await handleResourceSubmit(form, event.submitter);
        return;
    }
    if (form.matches("[data-media-form]")) {
        await handleMediaSubmit(form);
        return;
    }
    if (form.matches("[data-media-update-form]")) {
        await handleMediaUpdate(form);
        return;
    }
    if (form.matches("[data-user-form]")) {
        await handleUserSubmit(form);
        return;
    }
    if (form.matches("[data-role-form]")) {
        await handleRoleSubmit(form);
        return;
    }
    if (form.matches("[data-settings-form]")) {
        await handleSettingsSubmit(form);
        return;
    }
    if (form.matches("[data-company-content-form]")) {
        await handleCompanyContentSubmit(form);
        return;
    }
    if (form.matches("[data-password-form]")) {
        await handlePasswordSubmit(form);
        return;
    }
    if (form.matches("[data-mandatory-password-form]")) {
        await handlePasswordSubmit(form, true);
        return;
    }
    if (form.matches("[data-global-search]")) {
        const input = form.querySelector('input[name="q"]');
        state.search = input?.value || "";
        state.page = 1;
        await render();
        return;
    }
});
document.addEventListener("input", (event) => {
    if (event.target.closest("[data-resource-form]"))
        state.formDirty = true;
});
window.addEventListener("beforeunload", (event) => {
    if (state.formDirty) {
        event.preventDefault();
        event.returnValue = "";
    }
});
window.addEventListener("hashchange", () => {
    state.page = 1;
    void render();
});
async function init() {
    if (location.hash.startsWith("#reset-password")) {
        const query = location.hash.split("?")[1] || "";
        state.resetToken = new URLSearchParams(query).get("token") || "";
        state.loginMode = "reset";
    }
    const signedIn = await refreshSession();
    if (signedIn) {
        state.route = currentRoute();
        await render();
    }
    else {
        renderLogin();
    }
}
void init();
