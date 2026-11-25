import "dotenv/config";
import { prisma, disconnectPrisma } from "../src/prisma/client.js";
import { ensureRoles } from "../src/services/auth.service.js";
import { seedCorporateContent } from "./corporate-content.js";

const projects = [
  {
    reference: "OCG-LEGACY-001", title: "Corridor Development in Ethiopia", slug: "corridor-development",
    shortDescription: "Urban improvements that bring upgraded roads, public spaces, walking routes, lighting and greener city environments.",
    description: "Ethiopia’s corridor development initiatives focus on modern urban infrastructure, including wider roads, pedestrian routes, green spaces, better lighting and improved public areas. This record preserves the public project update from the existing OCG website.",
    category: "Urban development", constructionSector: "Infrastructure & civil works", location: "Ethiopia", country: "Ethiopia",
    client: "Public sector", contractor: "Oro-Construction Group", consultant: "OCG engineering team",
    status: "ONGOING" as const, published: true, publishedAt: new Date(), progress: 45,
  },
  {
    reference: "OCG-LEGACY-002", title: "Waliso Integrated Bus Terminal", slug: "waliso-integrated-bus-terminal",
    shortDescription: "The integrated bus terminal in Waliso was reported as inaugurated after construction.",
    description: "The public update describes the integrated bus terminal in Waliso as a project built at a cost of more than 600 million Birr on a site of approximately 2.5 hectares. The terminal supports an improved public transport experience for the city and surrounding communities.",
    category: "Transport infrastructure", constructionSector: "Transport", location: "Waliso", region: "Oromia", country: "Ethiopia",
    client: "Public transport authority", contractor: "Oro-Construction Group", status: "COMPLETED" as const,
    published: true, publishedAt: new Date(), progress: 100, actualCompletionDate: new Date("2025-12-26"),
  },
  {
    reference: "OCG-LEGACY-003", title: "Walmal River Irrigation Project", slug: "walmal-river-irrigation",
    shortDescription: "The Walmal River Irrigation construction project was reported as inaugurated by a national and regional delegation.",
    description: "The OCG website reports that the Walmal River Irrigation Project was built by Oromia Construction Corporation (OCC) and inaugurated by a delegation led by the Prime Minister of Ethiopia, together with Oromia Regional State and irrigation-sector representatives. The project illustrates the role of irrigation infrastructure in supporting agricultural productivity and regional development.",
    category: "Water & irrigation", constructionSector: "Water & environmental", location: "Walmal", region: "Oromia", country: "Ethiopia",
    contractor: "Oromia Construction Corporation", status: "COMPLETED" as const, published: true,
    publishedAt: new Date(), progress: 100, actualCompletionDate: new Date("2025-12-26"),
  },
  {
    reference: "OCG-LEGACY-004", title: "Oromia Supreme Court Building Project", slug: "oromia-supreme-court",
    shortDescription: "A proposed 2B+G+13 head-office building for the Supreme Court of Oromia in Finfinnee.",
    description: "The project description on the existing OCG website states that the Oromia Supreme Court 2B+G+13 building in Finfinnee has a built-up area of 3,247 m² and a height of 67.50 metres. Planned facilities include courtrooms, public waiting areas, parking, offices, a library, cafeterias and an apartment. The page lists a project value of 2.8 billion Birr.",
    category: "Public buildings", constructionSector: "Building construction", location: "Finfinnee", region: "Oromia", country: "Ethiopia",
    client: "Supreme Court of Oromia", status: "PROPOSED" as const, published: true, publishedAt: new Date(), progress: 0,
  },
];

const news = [
  {
    title: "Corridor Development in Ethiopia", slug: "corridor-development",
    summary: "Urban improvements that bring upgraded roads, public spaces, walking routes, lighting and greener city environments.",
    content: "<p>Ethiopia’s corridor development initiatives focus on modern urban infrastructure, including wider roads, pedestrian routes, green spaces, better lighting and improved public areas. OCG’s public updates highlight the wider development effort and its potential to support mobility, economic activity and quality of urban life.</p>",
    category: "Project update", tags: ["urban development", "infrastructure"], published: true, publishedAt: new Date("2025-12-26"),
  },
  {
    title: "Waliso Integrated Bus Terminal inaugurated", slug: "waliso-integrated-bus-terminal-inaugurated",
    summary: "The integrated bus terminal in Waliso was reported as inaugurated after construction.",
    content: "<p>The public update describes the integrated bus terminal in Waliso as a project built at a cost of more than 600 million Birr on a site of approximately 2.5 hectares. The terminal supports an improved public transport experience for the city and surrounding communities.</p>",
    category: "Project update", tags: ["transport", "Waliso"], published: true, publishedAt: new Date("2025-12-26"),
  },
  {
    title: "Walmal River Irrigation Project inaugurated", slug: "walmal-river-irrigation-inaugurated",
    summary: "The OCG website reports inauguration of the Walmal River Irrigation Project.",
    content: "<p>The OCG website reports that the Walmal River Irrigation Project was built by Oromia Construction Corporation (OCC) and inaugurated by a delegation led by the Prime Minister of Ethiopia. The project illustrates the role of irrigation infrastructure in supporting agricultural productivity and regional development.</p>",
    category: "Project update", tags: ["irrigation", "water"], published: true, publishedAt: new Date("2025-12-26"),
  },
  {
    title: "Oromia Supreme Court project information", slug: "oromia-supreme-court-project-information",
    summary: "A proposed 2B+G+13 head-office building for the Supreme Court of Oromia in Finfinnee.",
    content: "<p>The existing OCG website describes the Oromia Supreme Court 2B+G+13 building in Finfinnee as having a built-up area of 3,247 m² and a height of 67.50 metres. Planned facilities include courtrooms, public waiting areas, parking, offices, a library, cafeterias and an apartment.</p>",
    category: "Project update", tags: ["public buildings", "Finfinnee"], published: true, publishedAt: new Date("2025-12-15"),
  },
];

const events = [
  {
    title: "Inauguration of Gololcha Irrigation", slug: "inauguration-of-gololcha-irrigation",
    description: "The existing OCG events page notes that the Gololcha irrigation project was inaugurated after project works were completed.",
    category: "Project milestone", startsAt: new Date("2025-12-20T09:00:00Z"), endsAt: new Date("2025-12-20T12:00:00Z"),
    status: "COMPLETED" as const, published: true, publishedAt: new Date(),
  },
  {
    title: "Project and infrastructure visits", slug: "project-and-infrastructure-visits",
    description: "Photo updates record visits to infrastructure and urban development work across OCG’s project environment.",
    category: "Project visit", startsAt: new Date("2025-12-18T09:00:00Z"), endsAt: new Date("2025-12-18T12:00:00Z"),
    status: "COMPLETED" as const, published: true, publishedAt: new Date(),
  },
];

async function main(): Promise<void> {
  await ensureRoles();
  for (const project of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
    if (!existing) {
      await prisma.project.create({ data: { ...project, statusHistory: { create: { newStatus: project.status, note: "Imported from the existing public website" } } } });
    }
  }
  for (const article of news) {
    const existing = await prisma.newsArticle.findUnique({ where: { slug: article.slug } });
    if (!existing) await prisma.newsArticle.create({ data: article });
  }
  for (const event of events) {
    const existing = await prisma.event.findUnique({ where: { slug: event.slug } });
    if (!existing) await prisma.event.create({ data: event });
  }
  const settings: Array<[string, unknown]> = [
    ["site.name", "Oro-Construction Group"],
    ["site.contactEmail", "info@ocg.et"],
    ["site.address", "Bole Michael, Addis Ababa, Ethiopia"],
    ["site.tagline", "Building Stronger Communities, Delivering Value-Driven Construction Across Africa"],
  ];
  for (const [key, value] of settings) {
    const existing = await prisma.siteSetting.findUnique({ where: { key } });
    if (!existing) await prisma.siteSetting.create({ data: { key, value: value as any } });
  }
  const createdSections = await seedCorporateContent(
    async (data) => prisma.pageSection.create({ data: data as any }),
    async (pageKey, sectionKey) => Boolean(await prisma.pageSection.findUnique({ where: { pageKey_sectionKey: { pageKey, sectionKey } } })),
  );
  console.info(`Seed complete: roles, settings, existing OCG records and ${createdSections} new corporate content sections are available. No existing records were overwritten.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });