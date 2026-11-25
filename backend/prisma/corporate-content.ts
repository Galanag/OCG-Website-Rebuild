import type { Prisma } from "../src/generated/prisma/client.js";

type Section = {
  pageKey: string;
  sectionKey: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  sortOrder: number;
};

const sections: Section[] = [
  {
    pageKey: "home", sectionKey: "hero", title: "Building a Shining Future", sortOrder: 0,
    content: "<p>Oro-Construction Group (OCG) is a construction and real estate development group operating under the Oromia Sovereign Fund (OSF). Five specialized subsidiaries work together across construction, engineering, infrastructure, real estate, tourism and hospitality.</p>",
    metadata: { tagline: "Building a Shining Future", organization: "ORO-CONSTRUCTION GROUP", parent: "Oromia Sovereign Fund (OSF)", buttons: [{ label: "About OCG", href: "about.php" }, { label: "Explore projects", href: "projects.php" }, { label: "Contact", href: "contact.php" }] },
  },
  {
    pageKey: "home", sectionKey: "overview", title: "A connected construction and development group", sortOrder: 1,
    content: "<p>OCG brings together specialist capabilities in construction, engineering, infrastructure, real estate, tourism and hospitality. The group’s public profile describes a shared commitment to quality, innovative design, sustainable methods and community well-being.</p>",
    metadata: { source: "OCG Profile Nw.pdf; Draft Company Profile v2" },
  },
  {
    pageKey: "home", sectionKey: "statistics", title: "Corporate statistics", sortOrder: 2,
    content: "<p>Figures are presented with their reporting period. Historical performance and forward-looking targets are not interchangeable.</p>",
    metadata: { subsidiaries: 5, workforce: "5,200+", reportedBacklogETB: 77.7, historicalPerformanceLabel: "2018 Actual Performance", targetLabel: "FY 2026/2027 Strategic Targets", groupRevenueTargetETB: 39.32, groupGrossProfitTargetETB: 7.07 },
  },
  {
    pageKey: "home", sectionKey: "strategy", title: "Six strategic pillars", sortOrder: 7,
    content: "<p>OCG’s strategic direction combines digital delivery, people, financial sustainability, operational excellence, market expansion and green transformation. Current capabilities and future ambitions are distinct.</p>",
    metadata: { pillars: [
      { title: "Digital Transformation and Innovation", items: ["BIM", "ERP", "AI", "Drones", "GPS", "Integrated supply chains"] },
      { title: "Human Capital and Organizational Excellence", items: ["Technical skills", "Leadership training", "Safety", "Professional development"] },
      { title: "Financial Growth and Sustainability", items: ["Cash flow", "Revenue diversification", "Claims management", "PPPs", "Operational efficiency"] },
      { title: "Operational Excellence", items: ["Project delivery", "Time, cost and quality control", "Fleet management", "Laboratories", "Internal manufacturing", "Subsidiary coordination"] },
      { title: "Market Expansion and Strategic Partnerships", items: ["Domestic growth", "East African markets", "International bidding", "Joint ventures", "Real estate monetization"] },
      { title: "Sustainable and Green Transformation", items: ["Green construction", "Renewable energy", "Climate resilience", "ESG", "Green concrete", "LEED ambitions"] },
    ] },
  },
  {
    pageKey: "about", sectionKey: "company-overview", title: "About OCG", sortOrder: 0,
    content: "<p>Oro-Construction Group (OCG) is a prominent construction and real estate development organization based in Ethiopia, dedicated to enhancing the nation’s infrastructure and urban landscape. The group comprises five specialized subsidiaries: Oromia Construction Corporation (OCC), Oromia Engineering Corporation (ECO), Walabu Construction Share Company, OBM Construction Share Company and IJA Developers Share Company.</p><p>OCG’s stated commitment is to quality, innovative design and sustainable methods, with environmentally friendly practices and community engagement contributing to economic growth and social development.</p>",
    metadata: { source: "OCG Profile Nw.pdf", reportingPeriod: "Current company profile" },
  },
  {
    pageKey: "about", sectionKey: "background", title: "Background and history", sortOrder: 1,
    content: "<p>The source documents describe OCG’s development through its subsidiaries and historical performance. The group’s 2018 historical results and subsequent organizational changes are retained as reported. Establishment dates that conflict with historical financial reporting require management confirmation.</p>",
    metadata: { source: "Draft Company Profile v2; OCG Profile Nw.pdf", approvalRequired: ["OCC chronology", "IJA chronology"] },
  },
  {
    pageKey: "about", sectionKey: "purpose", title: "Corporate purpose", sortOrder: 2,
    content: "<p>OCG’s purpose is to deliver high-quality, cost-effective infrastructure and development solutions that strengthen communities, support regional prosperity and create long-term value.</p>",
    metadata: {},
  },
  {
    pageKey: "about", sectionKey: "osf", title: "Under the Oromia Sovereign Fund", sortOrder: 3,
    content: "<p>The corporate profile presents OCG as operating under the Oromia Sovereign Fund (OSF), with five specialized subsidiaries working within one group structure.</p>",
    metadata: { parentOrganization: "Oromia Sovereign Fund (OSF)" },
  },
  {
    pageKey: "about", sectionKey: "structure", title: "Five-subsidiary structure", sortOrder: 4,
    content: "<p>The group’s delivery model combines general construction, engineering consultancy, civil and industrial works, real estate, tourism and hospitality. Each subsidiary retains its specialized mandate while coordinating with group-level functions.</p>",
    metadata: { subsidiaries: ["OCC", "OBM", "Walabu", "ECO", "IJA Developers"] },
  },
  {
    pageKey: "about", sectionKey: "industry-position", title: "Construction and real estate position", sortOrder: 5,
    content: "<p>OCG describes itself as a key player in Ethiopia’s construction and real estate landscape, with capabilities spanning federal and regional infrastructure, industrial facilities, water systems, buildings and hospitality development.</p>",
    metadata: {},
  },
  {
    pageKey: "about", sectionKey: "contribution", title: "Economic and social contribution", sortOrder: 6,
    content: "<p>The profile associates OCG’s work with employment generation, infrastructure access, urban development, agricultural support through irrigation, tourism and long-term community benefit. No additional beneficiary statistics are asserted without an approved source.</p>",
    metadata: {},
  },
  {
    pageKey: "about", sectionKey: "commitments", title: "Corporate commitments", sortOrder: 7,
    content: "<p>OCG’s stated commitments include quality, safety, environmental responsibility, ethical practice, reliable delivery and value for money.</p>",
    metadata: {},
  },
  {
    pageKey: "about", sectionKey: "vision", title: "Our vision", sortOrder: 8,
    content: "<p>OCG aspires to be East Africa’s premier green infrastructure and development group by delivering exceptional value for money, operational reliability, and sustainable market leadership.</p>",
    metadata: { source: "OCG Profile Nw.pdf" },
  },
  {
    pageKey: "about", sectionKey: "mission", title: "Our mission", sortOrder: 9,
    content: "<p>To drive regional prosperity and compete effectively in international markets by delivering affordable, accessible, green, and value-driven infrastructure solutions across construction, real estate, tourism, and hospitality.</p>",
    metadata: { source: "OCG Profile Nw.pdf" },
  },
  {
    pageKey: "about", sectionKey: "values", title: "Ten core values", sortOrder: 10,
    content: "<p>The values below guide OCG’s project delivery and corporate conduct.</p>",
    metadata: { values: ["Green Stewardship", "Accountability", "Professionalism", "Ethics and Compliance", "Excellence", "Resilience", "Innovation", "Collaboration", "Leadership", "Value for Money"] },
  },
  {
    pageKey: "about", sectionKey: "board", title: "Board of Directors", sortOrder: 11,
    content: "<p>Reported board composition. Appointment dates are not stated in the supplied source and require management confirmation before being described as current.</p>",
    metadata: { reportingPeriod: "Reported profile; appointment dates require confirmation", members: [
      { name: "Res. Mr. Neway Megersa", role: "Board Chairman" },
      { name: "Res. Amb. Alemayehu Tegenu", role: "Deputy Chairman" },
      { name: "Res. Amb. Shiferaw Jarso", role: "Board Member" },
      { name: "Res. Dr. Abdulaziz Dawud", role: "Board Member" },
      { name: "Res. Eng. Germa Regasa", role: "Board Member" },
      { name: "Res. Dr. Eng. Wagari Furi", role: "Board Member" },
      { name: "Res. Com. Zerihun Duguma", role: "Board Member" },
      { name: "Res. Dr. Abdi Yuya", role: "Board Member" },
      { name: "Res. Eng. Natnael Getahun", role: "Board Member" },
      { name: "Res. Eng. Geleta Gudeta", role: "Board Member" },
      { name: "Res. Dr. Yeshi Jima", role: "Board Member" },
    ] },
  },
  {
    pageKey: "about", sectionKey: "executives", title: "Executive management", sortOrder: 12,
    content: "<p>Reported executive roles. The documents do not provide a consistent appointment-date register; current-incumbent confirmation is required.</p>",
    metadata: { reportingPeriod: "Reported profile; appointment dates require confirmation", executives: [
      { name: "Dr. Eng. Mesay Daniel", role: "Group CEO" },
      { name: "Dr. Fekadu Megersa", role: "Deputy CEO, Corporate Services" },
      { name: "Eng. Habib Kumbi", role: "Deputy CEO, Engineering Operations" },
      { name: "Eng. Dawit Bekele", role: "Deputy CEO, Design and Contract Administration" },
    ], functions: ["Finance", "Procurement", "Human Resources", "Legal Services", "Planning and Budget", "Business Development", "International Relations"] },
  },
  {
    pageKey: "about", sectionKey: "ceo-message", title: "Historical CEO message — 2018 performance", sortOrder: 13,
    content: "<p><strong>Historical reporting-period message from Dr. Eng. Mesay Daniel, Chief Executive Officer, OCG.</strong></p><p>The 2018 fiscal year was launched under “A Year of Greater Success and Victory.” Despite global instability, fuel shortages and delayed client payments, OCG reported revenue above 31.9 billion ETB, gross profit of 5.88 billion ETB and net profit of 2.85 billion ETB. The message cites ERP implementation, GPS tracking, drone mapping, project-level profitability analysis, urban corridor delivery, rural housing and hospitality foreign-currency performance.</p><p>The same historical message describes the subsequent 2019 (2026/2027) strategic plan and its 39.32 billion ETB revenue and 7.07 billion ETB gross-profit targets. It is not represented as a newly issued 2026 statement.</p>",
    metadata: { reportingPeriod: "2018 historical performance; 2019 (2026/2027) plan", author: "Dr. Eng. Mesay Daniel", approvalRequired: ["Confirm whether a newer approved CEO message exists"] },
  },
  {
    pageKey: "services", sectionKey: "service-lines", title: "Specialized service lines", sortOrder: 0,
    content: "<p>OCG’s reported service portfolio covers the built environment from feasibility and design through construction, commissioning and asset management.</p>",
    metadata: { services: ["Construction of buildings", "Industrial parks", "Roads and bridges", "Dams", "Irrigation systems", "Airports", "Electricity infrastructure", "Telecommunications", "Drilling and water resources development", "Hydrological surveys", "Geophysical surveys", "Construction material production", "Engineering and design services", "Laboratory analysis", "Urban planning and engineering", "Tourism and hospitality developments"] },
  },
  {
    pageKey: "services", sectionKey: "operational-capacity", title: "Operational capacity", sortOrder: 1,
    content: "<p>OCG describes an integrated delivery model supported by internal materials, design and machinery capability, project-level controls and coordinated subsidiary operations.</p>",
    metadata: {},
  },
  {
    pageKey: "services", sectionKey: "equipment", title: "Equipment and machinery", sortOrder: 2,
    content: "<p>The reported fleet includes excavators, cranes, bulldozers, earthmoving equipment and specialized construction machinery, supported by maintenance, inspection and GPS-enabled fleet tracking.</p>",
    metadata: { equipment: ["Excavators", "Cranes", "Bulldozers", "Earthmoving equipment", "Specialized construction machinery"] },
  },
  {
    pageKey: "services", sectionKey: "properties", title: "Real properties", sortOrder: 3,
    content: "<p>The source reports offices, warehouses, office complexes and hotels in Addis Ababa, Adama, Ambo, Arjo, Metu, Dukem and Langano. Exact property titles and site details are not asserted.</p>",
    metadata: { locations: ["Addis Ababa", "Adama", "Ambo", "Arjo", "Metu", "Dukem", "Langano"] },
  },
  {
    pageKey: "services", sectionKey: "operational-excellence", title: "Operational excellence", sortOrder: 4,
    content: "<p>Reported systems include IFRS-aligned financial practice, ERP, the Result-Based Monitoring and Evaluation Framework (RBMEF), project-level controls, modern engineering systems and operational coordination.</p>",
    metadata: { systems: ["IFRS", "ERP", "RBMEF", "Project controls", "Fleet tracking", "Laboratory services"] },
  },
  {
    pageKey: "services", sectionKey: "quality", title: "Quality, health, safety and environment", sortOrder: 5,
    content: "<p>OCG’s profile describes quality management, environmental management, occupational health and safety, laboratory services, site inspection, construction standards and continuous improvement. Certification claims are limited to the subsidiaries named in the source.</p>",
    metadata: { certifications: [{ subsidiary: "OCC", standards: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018"] }, { subsidiary: "ECO", standards: ["ISO 9001:2015"] }] },
  },
  {
    pageKey: "services", sectionKey: "clients", title: "Clients and partners", sortOrder: 6,
    content: "<p>The profile names institutional clients and partners across federal, regional, municipal and industrial bodies. Names are reproduced as reported and do not imply endorsement.</p>",
    metadata: { federal: ["Ethiopian Roads Administration", "Ministry of Water & Energy", "Ministry of Irrigation & Lowlands"], regional: ["Water & Energy", "Health", "Education", "Culture & Tourism", "Irrigation & Pastoralist Development"], municipal: ["Sheger City Administration", "Adama City Administration", "Oromia Industrial Parks", "Gada Special Economic Zone"] },
  },
  {
    pageKey: "services", sectionKey: "why-choose", title: "Why choose OCG", sortOrder: 7,
    content: "<p>OCG’s reported differentiators are an integrated service model, quality assurance, safety, innovation, skilled workforce, comprehensive delivery, timely completion and environmental/social responsibility. No fictional client testimonials are used.</p>",
    metadata: { differentiators: ["Proven Track Record", "Turnkey Integration", "Quality Assurance", "Safety", "Innovation", "Skilled Workforce", "Comprehensive Services", "Timely Delivery", "Environmental and Social Responsibility"] },
  },
  {
    pageKey: "services", sectionKey: "csr", title: "Corporate social responsibility", sortOrder: 8,
    content: "<p>The source associates OCG with sustainable construction, environmental protection, responsible waste management, eco-friendly materials, community well-being, employment generation and long-term economic development. No CSR project names, budgets or beneficiary statistics are invented.</p>",
    metadata: {},
  },
  {
    pageKey: "subsidiaries", sectionKey: "overview", title: "Five specialized subsidiaries", sortOrder: 0,
    content: "<p>OCG’s subsidiaries combine construction, engineering, real estate, tourism and hospitality capabilities. Historical 2018 figures and FY 2026/2027 targets are shown separately.</p>",
    metadata: { reportingPeriods: ["2018 historical performance", "FY 2026/2027 targets"] },
  },
  {
    pageKey: "subsidiaries", sectionKey: "occ", title: "Oromia Construction Corporation (OCC)", sortOrder: 1,
    content: "<p>OCC is described as a public enterprise established in 2020. Its core services include water supply, sewerage, irrigation, dams, drilling, buildings, roads and transport infrastructure. The 2018 financial figures are retained as historical reporting and their chronology against the stated establishment date requires management review.</p>",
    metadata: { ceo: "Eng. Ashenafi Daba", established: "2020 (reported)", services: ["Water supply", "Sewerage systems", "Irrigation", "Dam construction", "Drilling", "Building construction", "Roads", "Transport infrastructure"], historical2018: { revenueETB: 17597738803.96, grossProfitETB: 3175570455.98 }, targetsFY202627: { revenueETB: 19698150901.85, grossProfitETB: 3734769410.99 }, approvalRequired: true },
  },
  {
    pageKey: "subsidiaries", sectionKey: "obm", title: "OBM Construction Share Company", sortOrder: 2,
    content: "<p>OBM was established in 2015 with headquarters in Galaan town. Reported original registered capital is 78,800,000 ETB and paid-up capital is 31,433,800 ETB. Services include general and building construction, real estate, materials production and supply, imports and machinery rental.</p>",
    metadata: { ceo: "Eng. Addisu Berhanu", headquarters: "Galaan town", established: "2015", registeredCapitalETB: 78800000, paidUpCapitalETB: 31433800, services: ["General construction", "Building construction", "Real estate construction", "Construction material production", "Construction material supply", "Importing construction materials", "Machinery rental"], historical2018: { revenueETB: 8693825656.97, grossProfitETB: 964499953.07 }, targetsFY202627: { revenueETB: 10237666158.30, grossProfitETB: 1330896600.58 } },
  },
  {
    pageKey: "subsidiaries", sectionKey: "walabu", title: "Walabu Construction Share Company", sortOrder: 3,
    content: "<p>Walabu was established in 2017 with 12 original shareholders: eight municipalities, three government development corporations and one individual. Authorized capital is reported as 320 million ETB. The source states a transition into a state-owned construction enterprise in January 2025. Its reported asset portfolio is approximately USD 86 million.</p>",
    metadata: { ceo: "Eng. Taddese Diriba", established: "2017", shareholders: 12, authorizedCapitalETB: 320000000, transition: "State-owned enterprise, January 2025 (reported)", assetPortfolioUSD: 86000000, services: ["Roads", "Industrial parks", "Buildings", "Irrigation", "Urban development", "Infrastructure construction"], historical2018: { revenueETB: 3506620949.37, grossProfitETB: 806941948.96 }, targetsFY202627: { revenueETB: 6418186649.70, grossProfitETB: 825865258.65 } },
  },
  {
    pageKey: "subsidiaries", sectionKey: "eco", title: "Engineering Corporation of Oromia (ECO)", sortOrder: 4,
    content: "<p>ECO is described as a consulting and engineering service provider. Services include research, design, contract management, construction supervision, ESIA, urban and industrial park planning, quality control, laboratory services and infrastructure design. The source states original establishment in 2006 and re-establishment under Regulation No. 214/2020 with authorized capital of 1 billion ETB.</p>",
    metadata: { ceo: "Eng. Selamawit Seid", established: "2006; re-established under Regulation No. 214/2020", authorizedCapitalETB: 1000000000, services: ["Research", "Engineering design", "Contract management", "Construction supervision", "Construction control", "Environmental and Social Impact Assessments", "Urban planning", "Industrial park planning", "Quality control", "Laboratory services", "Roads, bridges, dams and water infrastructure design"], historical2018: { revenueETB: 1737071952.31, grossProfitETB: 702784993.84 }, targetsFY202627: { revenueETB: 2177684192.85, grossProfitETB: 822565162.35 } },
  },
  {
    pageKey: "subsidiaries", sectionKey: "ija", title: "IJA Developers Share Company", sortOrder: 5,
    content: "<p>IJA focuses on tourism, hospitality, eco-tourism, resorts, real estate, property management and leisure development. The source states initial establishment under Regulation No. 1243/2020, operations with 4 billion ETB authorized capital, re-establishment in January 2026 under Guideline No. 04/2026, authorized capital of 20 billion ETB and paid-in capital of 5,339,811,423 ETB. The 2018 figures and establishment chronology require management review.</p>",
    metadata: { ceo: "Mr. Tesfaye Alemayehu", regulations: ["Regulation No. 1243/2020", "Guideline No. 04/2026"], reestablished: "January 2026 (reported)", authorizedCapitalETB: 20000000000, paidInCapitalETB: 5339811423, services: ["Tourism", "Hospitality", "Eco-tourism", "Resorts", "Real estate development", "Property management", "Leisure and recreational development"], historical2018: { revenueETB: 412124733.47, grossProfitETB: 232882087.84 }, targetsFY202627: { revenueETB: 792125610.90, grossProfitETB: 351455958.72 }, approvalRequired: true },
  },
  {
    pageKey: "financial", sectionKey: "historical", title: "Historical financial performance", sortOrder: 0,
    content: "<p>Historical figures are presented as reported and are not current results. The 2018 asset figure is a projection in the source.</p>",
    metadata: { revenue: [{ year: "2016", etb: 14.8e9 }, { year: "2017", etb: 23.2e9 }, { year: "2018 actual", etb: 31.9e9 }], assets: [{ year: "2015", etb: 25.13e9 }, { year: "2016", etb: 29.1e9 }, { year: "2017", etb: 35.9e9 }, { year: "2018 projection", etb: 44.4e9 }], grossProfit2018ETB: 5.88e9, netProfit2018ETB: 2.85e9, grossMargin2018: "15.35%" },
  },
  {
    pageKey: "financial", sectionKey: "targets", title: "FY 2026/2027 strategic targets", sortOrder: 1,
    content: "<p>These are forward-looking targets, not achieved revenue.</p>",
    metadata: { groupRevenueETB: 39.32e9, groupGrossProfitETB: 7.07e9, subsidiaries: [
      { name: "OCC", revenueETB: 19698150901.85, grossProfitETB: 3734769410.99 },
      { name: "OBM", revenueETB: 10237666158.30, grossProfitETB: 1330896600.58 },
      { name: "Walabu", revenueETB: 6418186649.70, grossProfitETB: 825865258.65 },
      { name: "ECO", revenueETB: 2177684192.85, grossProfitETB: 822565162.35 },
      { name: "IJA Developers", revenueETB: 792125610.90, grossProfitETB: 351455958.72 },
    ] },
  },
  {
    pageKey: "financial", sectionKey: "outlook", title: "Financial sustainability and outlook", sortOrder: 2,
    content: "<p>The profile associates future sustainability with capital strength, revenue enhancement, cost control, machinery utilization, claims management, diversification, strategic partnerships and Public-Private Partnerships. These are stated priorities, not guarantees.</p>",
    metadata: { reportedBacklogETB: 77.7, backlogDistributionETB: { OCC: 62.2, Walabu: 8.1, OBM: 7.5 } },
  },
  {
    pageKey: "contact", sectionKey: "details", title: "Contact OCG", sortOrder: 0,
    content: "<p>Oro-Construction Group<br>Bole Michael, Next to Airport Cargo<br>Addis Ababa, Ethiopia</p>",
    metadata: { phone: "+251 99 434 4127", email: "OCG2021@gmail.com", website: "www.ocg.et", map: "https://maps.app.goo.gl/nZRbu5GKEneBQrzK7" },
  },
];

export async function seedCorporateContent(create: (data: Prisma.PageSectionUncheckedCreateInput) => Promise<unknown>, exists: (pageKey: string, sectionKey: string) => Promise<boolean>): Promise<number> {
  let created = 0;
  for (const section of sections) {
    if (await exists(section.pageKey, section.sectionKey)) continue;
    await create({
      pageKey: section.pageKey,
      sectionKey: section.sectionKey,
      title: section.title,
      content: section.content,
      metadata: section.metadata,
      sortOrder: section.sortOrder,
      published: true,
    });
    created++;
  }
  return created;
}