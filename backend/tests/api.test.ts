import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { prisma, disconnectPrisma } from "../src/prisma/client.js";
import { ensureRoles, hashPassword } from "../src/services/auth.service.js";
import { env } from "../src/config/env.js";

const suffix = Date.now().toString(36);
const email = `api-test-${suffix}@ocg.test`;
const editorEmail = `editor-test-${suffix}@ocg.test`;
const viewerEmail = `viewer-test-${suffix}@ocg.test`;
const resetEmail = `reset-test-${suffix}@ocg.test`;
const password = "OCG-Test-Password-2026!";
const projectReference = `TEST-${suffix}`;
const projectSlug = `test-project-${suffix}`;
const announcementSlug = `test-announcement-${suffix}`;
const scheduledAnnouncementSlug = `test-scheduled-announcement-${suffix}`;
const newsSlug = `test-news-${suffix}`;
const eventSlug = `test-event-${suffix}`;
let cookie = "";
let csrf = "";
let userId = "";
let editorCookie = "";
let editorCsrf = "";
let viewerCookie = "";
let viewerCsrf = "";
let projectId = "";
let announcementId = "";
let newsId = "";
let eventId = "";
let publicMediaId = "";
let privateMediaId = "";

async function login(emailValue: string, passwordValue = password): Promise<{ cookie: string; csrf: string; body: any }> {
  const response = await request(app).post("/api/v1/auth/login").send({ email: emailValue, password: passwordValue });
  const cookies = response.headers["set-cookie"] || [];
  const cookieValue = cookies.map((value: string) => value.split(";")[0]).join("; ");
  return { cookie: cookieValue, csrf: response.body.data.csrfToken, body: response.body };
}

function authHeaders(token = csrf, cookieValue = cookie): Record<string, string> {
  return { Cookie: cookieValue, "X-CSRF-Token": token, "Content-Type": "application/json" };
}

beforeAll(async () => {
  await ensureRoles();
  const superAdmin = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
  const editorRole = await prisma.role.findUniqueOrThrow({ where: { name: "EDITOR" } });
  const viewerRole = await prisma.role.findUniqueOrThrow({ where: { name: "VIEWER" } });
  const user = await prisma.user.create({
    data: {
      name: "API Test Admin", email, passwordHash: await hashPassword(password), mustChangePassword: false,
      roles: { create: [{ roleId: superAdmin.id }] },
    },
    select: { id: true },
  });
  userId = user.id;
  const editor = await prisma.user.create({
    data: {
      name: "API Test Editor", email: editorEmail, passwordHash: await hashPassword(password), mustChangePassword: false,
      roles: { create: [{ roleId: editorRole.id }] },
    },
  });
  await prisma.user.create({
    data: {
      name: "API Test Reset", email: resetEmail, passwordHash: await hashPassword(password), mustChangePassword: false,
      roles: { create: [{ roleId: superAdmin.id }] },
    },
  });
  await prisma.user.create({
    data: {
      name: "API Test Viewer", email: viewerEmail, passwordHash: await hashPassword(password), mustChangePassword: false,
      roles: { create: [{ roleId: viewerRole.id }] },
    },
  });
  const auth = await login(email);
  cookie = auth.cookie;
  csrf = auth.csrf;
  const editorAuth = await login(editorEmail);
  editorCookie = editorAuth.cookie;
  editorCsrf = editorAuth.csrf;
  const viewerAuth = await login(viewerEmail);
  viewerCookie = viewerAuth.cookie;
  viewerCsrf = viewerAuth.csrf;
});

afterAll(async () => {
  await prisma.project.deleteMany({ where: { reference: projectReference } });
  await prisma.announcement.deleteMany({ where: { slug: { in: [announcementSlug, scheduledAnnouncementSlug] } } });
  await prisma.newsArticle.deleteMany({ where: { slug: newsSlug } });
  await prisma.event.deleteMany({ where: { slug: eventSlug } });
  await prisma.mediaAsset.deleteMany({ where: { originalName: { in: ["test.png", "private-test.pdf"] } } });
  await prisma.contactSubmission.deleteMany({ where: { email: { contains: suffix } } });
  await prisma.partnershipSubmission.deleteMany({ where: { email: { contains: suffix } } });
  await prisma.surveySubmission.deleteMany({ where: { email: { contains: suffix } } });
  await prisma.auditLog.deleteMany({ where: { userEmail: { in: [email, editorEmail, viewerEmail, resetEmail] } } });
  await prisma.session.deleteMany({ where: { user: { email: { in: [email, editorEmail, viewerEmail, resetEmail] } } } });
  await prisma.passwordResetToken.deleteMany({ where: { user: { email: resetEmail } } });
  await prisma.user.deleteMany({ where: { email: { in: [email, editorEmail, viewerEmail, resetEmail] } } });
  await disconnectPrisma();
});

describe("OCG API integration", () => {
  it("reports health, public stats and hides protected data", async () => {
    const health = await request(app).get("/api/v1/health");
    expect(health.status).toBe(200);
    expect(health.body.status).toBe("ok");
    const stats = await request(app).get("/api/v1/stats");
    expect(stats.status).toBe(200);
    expect(stats.body.data.projects).toHaveProperty("total");
    expect(stats.body.data.news).toHaveProperty("published");
    const protectedResponse = await request(app).get("/api/v1/admin/projects");
    expect(protectedResponse.status).toBe(401);
    expect(protectedResponse.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("authenticates and returns the current user", async () => {
    const response = await request(app).get("/api/v1/auth/me").set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe(email);
    expect(response.body.data.permissions).toContain("content:write");
  });

  it("rejects invalid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({ email, password: "wrong-password" });
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("enforces CSRF and role permissions", async () => {
    const missingCsrf = await request(app).post("/api/v1/admin/projects").set("Cookie", cookie).send({});
    expect(missingCsrf.status).toBe(403);
    expect(missingCsrf.body.error.code).toBe("CSRF_INVALID");
    const viewer = await request(app).post("/api/v1/admin/projects")
      .set("Cookie", viewerCookie).set("X-CSRF-Token", viewerCsrf)
      .send({
        reference: `FORBIDDEN-${suffix}`, title: "Forbidden project", shortDescription: "No access",
        description: "<p>No access</p>", category: "Buildings", constructionSector: "Buildings",
        location: "Addis Ababa", country: "Ethiopia",
      });
    expect(viewer.status).toBe(403);
    expect(viewer.body.error.code).toBe("FORBIDDEN");
  });

  it("creates, updates, transitions, publishes, and soft-deletes a project", async () => {
    const create = await request(app).post("/api/v1/admin/projects").set(authHeaders()).send({
      reference: projectReference,
      title: "API Test Project",
      slug: projectSlug,
      shortDescription: "Temporary integration-test project",
      description: "<p>Created by API test.</p><script>alert(1)</script>",
      category: "Buildings",
      constructionSector: "Building construction",
      location: "Addis Ababa",
      country: "Ethiopia",
      status: "PROPOSED",
      progress: 10,
      published: false,
    });
    expect(create.status).toBe(201);
    projectId = create.body.data.id;
    expect(create.body.data.slug).toBe(projectSlug);
    expect(create.body.data.description).not.toContain("<script>");

    const hidden = await request(app).get(`/api/v1/projects/${projectSlug}`);
    expect(hidden.status).toBe(404);

    const update = await request(app).put(`/api/v1/admin/projects/${projectId}`).set(authHeaders()).send({
      title: "API Test Project Updated", progress: 25,
    });
    expect(update.status).toBe(200);
    expect(update.body.data.progress).toBe(25);

    const status = await request(app).post(`/api/v1/admin/projects/${projectId}/status`).set(authHeaders()).send({
      status: "ONGOING", note: "Integration test",
    });
    expect(status.status).toBe(200);
    expect(status.body.data.statusHistory[0].previousStatus).toBe("PROPOSED");
    expect(status.body.data.statusHistory[0].newStatus).toBe("ONGOING");

    const publish = await request(app).post(`/api/v1/admin/projects/${projectId}/publish`).set(authHeaders()).send({ published: true });
    expect(publish.status).toBe(200);
    const publicProject = await request(app).get(`/api/v1/projects/${projectSlug}`);
    expect(publicProject.status).toBe(200);
    expect(publicProject.body.data.title).toBe("API Test Project Updated");
    expect(publicProject.body.data.createdById).toBeUndefined();
    expect(publicProject.body.data.statusHistory[0].changedById).toBeUndefined();

    const remove = await request(app).delete(`/api/v1/admin/projects/${projectId}`).set(authHeaders());
    expect(remove.status).toBe(204);
    const deleted = await request(app).get(`/api/v1/projects/${projectSlug}`);
    expect(deleted.status).toBe(404);
  });

  it("accepts minimal drafts and conditional announcement requirements", async () => {
    const project = await request(app).post("/api/v1/admin/projects").set(authHeaders()).send({ title: `Minimal Draft ${suffix}` });
    expect(project.status).toBe(201);
    expect(project.body.data.status).toBe("PROPOSED");
    expect(project.body.data.published).toBe(false);
    expect(project.body.data.progress).toBe(0);
    expect(project.body.data.reference).toMatch(/^OCG-/);
    const update = await request(app).put(`/api/v1/admin/projects/${project.body.data.id}`).set(authHeaders()).send({ shortDescription: "", description: "", contractValue: null, plannedCompletionDate: null });
    expect(update.status).toBe(200);

    const news = await request(app).post("/api/v1/admin/news").set(authHeaders()).send({ title: `Minimal News ${suffix}` });
    expect(news.status).toBe(201);
    expect(news.body.data.published).toBe(false);

    const event = await request(app).post("/api/v1/admin/events").set(authHeaders()).send({ title: `Minimal Event ${suffix}` });
    expect(event.status).toBe(201);
    expect(event.body.data.startsAt).toBeNull();

    const notice = await request(app).post("/api/v1/admin/announcements").set(authHeaders()).send({
      title: `Minimal Notice ${suffix}`, category: "GENERAL_NOTICE",
    });
    expect(notice.status).toBe(201);
    expect(notice.body.data.published).toBe(false);
    const vacancy = await request(app).post("/api/v1/admin/announcements").set(authHeaders()).send({
      title: `Invalid Vacancy ${suffix}`, category: "JOB_VACANCY",
    });
    expect(vacancy.status).toBe(422);
    expect(vacancy.body.error.details.some((item: any) => item.path === "positionTitle")).toBe(true);
    const tender = await request(app).post("/api/v1/admin/announcements").set(authHeaders()).send({
      title: `Invalid Tender ${suffix}`, category: "BID_TENDER",
    });
    expect(tender.status).toBe(422);
    expect(tender.body.error.details.some((item: any) => item.path === "procurementCategory")).toBe(true);

    await request(app).delete(`/api/v1/admin/projects/${project.body.data.id}`).set(authHeaders());
    await request(app).delete(`/api/v1/admin/news/${news.body.data.id}`).set(authHeaders());
    await request(app).delete(`/api/v1/admin/events/${event.body.data.id}`).set(authHeaders());
    await request(app).delete(`/api/v1/admin/announcements/${notice.body.data.id}`).set(authHeaders());
  });

  it("publishes announcements and derives OPEN and CLOSED states", async () => {
    const create = await request(app).post("/api/v1/admin/announcements").set(authHeaders()).send({
      title: "API Test Vacancy", slug: announcementSlug, category: "JOB_VACANCY",
      summary: "Temporary integration-test vacancy", content: "<p>Apply through the published instructions.</p>",
      positionTitle: "Engineer", vacancyCount: 2, deadline: new Date(Date.now() + 86400000).toISOString(),
      published: true,
    });
    expect(create.status).toBe(201);
    announcementId = create.body.data.id;
    const list = await request(app).get(`/api/v1/announcements?kind=vacancy&state=OPEN`);
    expect(list.status).toBe(200);
    const found = list.body.data.items.find((item: any) => item.id === announcementId);
    expect(found.state).toBe("OPEN");

    const close = await request(app).put(`/api/v1/admin/announcements/${announcementId}`).set(authHeaders()).send({
      deadline: new Date(Date.now() - 86400000).toISOString(),
    });
    expect(close.status).toBe(200);
    const closedList = await request(app).get(`/api/v1/announcements?kind=vacancy&state=CLOSED`);
    expect(closedList.body.data.items.some((item: any) => item.id === announcementId)).toBe(true);
  });

  it("keeps scheduled announcements out of public listings until their publication time", async () => {
    const create = await request(app).post("/api/v1/admin/announcements").set(authHeaders()).send({
      title: "Scheduled Test Notice", slug: scheduledAnnouncementSlug, category: "GENERAL_NOTICE",
      summary: "Scheduled publication fixture", content: "<p>Scheduled.</p>", published: true,
      scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    });
    expect(create.status).toBe(201);
    const id = create.body.data.id;
    const publicList = await request(app).get("/api/v1/announcements?limit=100");
    expect(publicList.body.data.items.some((item: any) => item.id === id)).toBe(false);
    const adminList = await request(app).get("/api/v1/admin/announcements?limit=100").set("Cookie", cookie);
    expect(adminList.body.data.items.some((item: any) => item.id === id)).toBe(true);
  });

  it("creates sanitized news and publishes an event", async () => {
    const news = await request(app).post("/api/v1/admin/news").set(authHeaders()).send({
      title: "API Test News", slug: newsSlug, summary: "Temporary integration-test news",
      content: "<p>News body</p><script>window.bad=true</script>", category: "Company", tags: ["test"],
      published: true,
    });
    expect(news.status).toBe(201);
    newsId = news.body.data.id;
    expect(news.body.data.content).not.toContain("<script>");
    const publicNews = await request(app).get(`/api/v1/news/${newsSlug}`);
    expect(publicNews.status).toBe(200);
    expect(publicNews.body.data.tags).toEqual(["test"]);

    const event = await request(app).post("/api/v1/admin/events").set(authHeaders()).send({
      title: "API Test Event", slug: eventSlug, description: "<p>Event body</p>", category: "Corporate",
      startsAt: new Date(Date.now() + 172800000).toISOString(), endsAt: new Date(Date.now() + 180000000).toISOString(),
      published: true, status: "UPCOMING",
    });
    expect(event.status).toBe(201);
    eventId = event.body.data.id;
    const publicEvent = await request(app).get(`/api/v1/events/${eventSlug}`);
    expect(publicEvent.status).toBe(200);
    expect(publicEvent.body.data.status).toBe("UPCOMING");
  });

  it("uploads public and private media with content validation", async () => {
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
    const upload = await request(app).post("/api/v1/admin/media").set(authHeaders())
      .field("visibility", "PUBLIC").attach("file", png, { filename: "test.png", contentType: "image/png" });
    expect(upload.status).toBe(201);
    publicMediaId = upload.body.data.id;
    const file = await request(app).get(`/api/v1/media/${publicMediaId}/file`);
    expect(file.status).toBe(200);
    expect(file.headers["content-type"]).toContain("image/png");

    const privateUpload = await request(app).post("/api/v1/admin/media").set(authHeaders())
      .field("visibility", "PRIVATE").attach("file", Buffer.from("%PDF-1.4\n%test"), { filename: "private-test.pdf", contentType: "application/pdf" });
    expect(privateUpload.status).toBe(201);
    privateMediaId = privateUpload.body.data.id;
    const privateFile = await request(app).get(`/api/v1/media/${privateMediaId}/file`);
    expect(privateFile.status).toBe(404);

    const invalid = await request(app).post("/api/v1/admin/media").set(authHeaders())
      .attach("file", Buffer.from("this is not an image"), { filename: "bad.png", contentType: "image/png" });
    expect(invalid.status).toBe(415);

    const attachmentProject = await request(app).post("/api/v1/admin/projects").set(authHeaders()).send({ title: `Attachment Draft ${suffix}` });
    expect(attachmentProject.status).toBe(201);
    const attached = await request(app).put(`/api/v1/admin/projects/${attachmentProject.body.data.id}/attachments`).set(authHeaders()).send({ mediaIds: [publicMediaId] });
    expect(attached.status).toBe(200);
    expect(attached.body.data.attachments[0].mediaAsset.id).toBe(publicMediaId);
    await request(app).delete(`/api/v1/admin/projects/${attachmentProject.body.data.id}`).set(authHeaders());
  });

  it("attaches a news gallery and exposes only public gallery assets", async () => {
    const update = await request(app).put(`/api/v1/admin/news/${newsId}`).set(authHeaders()).send({
      galleryMediaIds: [publicMediaId],
    });
    expect(update.status).toBe(200);
    expect(update.body.data.images[0].mediaAsset.id).toBe(publicMediaId);
    const publicArticle = await request(app).get(`/api/v1/news/${newsSlug}`);
    expect(publicArticle.status).toBe(200);
    expect(publicArticle.body.data.images[0].mediaAsset.id).toBe(publicMediaId);
    expect(publicArticle.body.data.images[0].mediaAsset.filePath).toBeUndefined();
  });

  it("persists public contact, partnership and survey submissions", async () => {
    const contact = await request(app).post("/api/v1/contact").send({
      firstName: "Test", lastName: "User", email, phone: "123", subject: "Test enquiry",
      message: "Integration test contact", consent: true,
    });
    expect(contact.status).toBe(201);
    const partnership = await request(app).post("/api/v1/partnership")
      .field("firstName", "Test").field("lastName", "Partner")      .field("organization", "Test Org")
      .field("email", email).field("partnerType", "Supplier / vendor")
      .field("organizationWebsite", "")
      .field("notes", "Integration test partnership").field("consent", "1")
      .attach("attachment", Buffer.from("%PDF-1.4\n%test"), { filename: "partnership.pdf", contentType: "application/pdf" });
    expect(partnership.status).toBe(201);
    const survey = await request(app).post("/api/v1/survey").send({
      name: "Test", email, area: "Website information", rating: "Good", feedback: "Integration test survey",
    });
    expect(survey.status).toBe(201);

    const list = await request(app).get("/api/v1/admin/submissions/contact").set("Cookie", cookie);
    expect(list.status).toBe(200);
    expect(list.body.data.items.some((item: any) => item.email === email)).toBe(true);
    const surveyList = await request(app).get("/api/v1/admin/submissions/survey").set("Cookie", cookie);
    expect(surveyList.status).toBe(200);
    expect(surveyList.body.data.items.some((item: any) => item.email === email)).toBe(true);
  });

  it("supports password reset and audit/settings endpoints", async () => {
    const forgot = await request(app).post("/api/v1/auth/forgot-password").send({ email: resetEmail });
    expect(forgot.status).toBe(200);
    expect(forgot.body.data.resetToken).toBeTruthy();
    const newPassword = "A-New-OCG-Password-2026!";
    const reset = await request(app).post("/api/v1/auth/reset-password").send({
      token: forgot.body.data.resetToken, password: newPassword,
    });
    expect(reset.status).toBe(200);
    const oldLogin = await request(app).post("/api/v1/auth/login").send({ email: resetEmail, password });
    expect(oldLogin.status).toBe(401);
    const newLogin = await request(app).post("/api/v1/auth/login").send({ email: resetEmail, password: newPassword });
    expect(newLogin.status).toBe(200);

    const statsReference = `STATS-${suffix}`;
    const statsProject = await prisma.project.create({
      data: {
        reference: statsReference, title: "Stats test project", slug: `stats-${suffix}`,
        shortDescription: "Stats fixture", description: "<p>Stats</p>", category: "Buildings",
        constructionSector: "Buildings", location: "Addis Ababa", country: "Ethiopia", published: true,
      },
    });
    const stats = await request(app).get("/api/v1/admin/stats").set("Cookie", cookie);
    expect(stats.status).toBe(200);
    expect(stats.body.data.projects.total).toBeGreaterThan(0);
    const audit = await request(app).get("/api/v1/admin/audit-logs").set("Cookie", cookie);
    expect(audit.status).toBe(200);
    expect(audit.body.data.items.some((item: any) => item.action.includes("project"))).toBe(true);
    const settings = await request(app).put("/api/v1/admin/settings").set(authHeaders()).send({ key: "test.setting", value: { enabled: true } });
    expect(settings.status).toBe(200);
    await prisma.project.delete({ where: { id: statsProject.id } });
  });
});