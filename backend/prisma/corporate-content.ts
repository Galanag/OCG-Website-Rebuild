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
    content: "<p>Oro-Construction Group (OCG) is a powerhouse in Ethiopia's construction, engineering, and real estate sectors. Operating under the Oromia Sovereign Fund (OSF), OCG unites five specialized subsidiaries under one cohesive vision to deliver world-class infrastructure, sustainable methodologies, and innovative urban development across East Africa.</p>",
    metadata: { tagline: "Building a Shining Future", organization: "ORO-CONSTRUCTION GROUP", parent: "Oromia Sovereign Fund (OSF)", motto: "For Generations | Dhalootaaf | لاتو", buttons: [{ label: "About OCG", href: "about.php" }, { label: "Explore projects", href: "projects.php" }, { label: "Contact", href: "contact.php" }] },
  },
  {
    pageKey: "home", sectionKey: "overview", title: "A connected construction and development group", sortOrder: 1,
    content: "<p>Oro Construction Group (OCG) is a prominent construction and real estate development organization based in Ethiopia, dedicated to significantly enhancing the nation's infrastructure and urban landscape. The group comprises five specialized subsidiaries: Oromia Construction Corporation (OCC), Oromia Engineering Corporation (ECO), Walabu Construction Share Company, OBM Construction Share Company and IJA Developers Share Company. OCG is steadfast in its commitment to delivering unparalleled quality, innovative designs, and sustainable methodologies across all endeavors.</p>",
    metadata: { source: "OCG Profile Nw.pdf; Draft Company Profile v2" },
  },
  {
    pageKey: "home", sectionKey: "statistics", title: "Corporate statistics", sortOrder: 2,
    content: "<p>Figures are presented with their reporting period. Historical performance and forward-looking targets are not interchangeable.</p>",
    metadata: { subsidiaries: 5, workforce: "5,200+", reportedBacklogETB: 77.7, historicalPerformanceLabel: "2018 Actual Performance", targetLabel: "2019 (2026/2027) Strategic Targets", groupRevenueTargetETB: 39.32, groupGrossProfitTargetETB: 7.07, revenue2018ETB: 31.9, assetBase2018ETB: 44.4 },
  },
  {
    pageKey: "home", sectionKey: "strategy", title: "Six strategic pillars", sortOrder: 7,
    content: "<p>OCG's strategic direction combines digital delivery, people, financial sustainability, operational excellence, market expansion and green transformation. Current capabilities and future ambitions are distinct.</p>",
    metadata: { pillars: [
      { title: "Digital Transformation & Innovation", items: ["BIM", "ERP engines", "AI", "Drones", "GPS", "Field-to-office digital nervous system"] },
      { title: "Human Capital & Excellence", items: ["Engineering", "Finance", "Green construction", "Hospitality", "Leadership training", "Safety"] },
      { title: "Financial Growth & Sustainability", items: ["Strengthening cash flow", "Diversifying income", "Tightening claims control", "Public-Private Partnerships (PPPs)"] },
      { title: "Operational Excellence", items: ["Delivery speed", "Cost control", "Upgrading laboratories", "Scaling internal material manufacturing"] },
      { title: "Market Expansion & Partnerships", items: ["Exporting specialized expertise across East Africa", "Winning international bids", "Monetizing real estate assets"] },
      { title: "Sustainable & Green Transformation", items: ["Net-zero icons", "LEED buildings", "Green concrete", "Renewable energy", "ESG compliance"] },
    ] },
  },
  {
    pageKey: "about", sectionKey: "company-overview", title: "About OCG", sortOrder: 0,
    content: "<p>Oro-Construction Group (OCG) is a prominent construction and real estate development organization based in Ethiopia, dedicated to significantly enhancing the nation's infrastructure and urban landscape. The group comprises five specialized subsidiaries, each contributing uniquely to the industry. Oromia Construction Corporation (OCC) is focused on large-scale construction projects, offering high-quality services across residential, commercial, and public infrastructure, with a strong emphasis on sustainable practices and innovation. Oromia Engineering Corporation (ECO) provides comprehensive engineering solutions, delivering expertise in structural, civil, and environmental engineering while adhering to international standards to ensure safety and functionality in all projects. Walabu Construction Share Company is recognized for its strong project management capabilities, executing a diverse range of construction initiatives that include industrial facilities and urban development. OBM Construction Share Company excels in both public and private sector projects, employing skilled labor and modern construction techniques to achieve excellence and timely project completion. IJA Developers Share Company specializes in real estate development and hospitality ventures, focusing on creating vibrant communities through well-planned residential complexes, commercial spaces, and tourism-related projects that enhance living standards. Together, these subsidiaries exemplify OCG's commitment to excellence, integrity, and social responsibility, positioning the group as a key player in shaping Ethiopia's dynamic construction and real estate landscape.</p><p>Oro Construction Group (OCG) is steadfast in its commitment to delivering unparalleled quality, innovative designs, and sustainable methodologies across all endeavors. The organization aspires to weave a positive tapestry within Ethiopia's construction landscape by upholding international standards and prioritizing community well-being. By integrating environmentally friendly practices and engaging with local communities, OCG aims to foster economic growth and social development, ensuring that its projects not only meet current needs but also contribute to the prosperity of future generations. Through this holistic approach, OCG reinforces its role as a leader in the construction and real estate sectors while making a meaningful impact on the society it serves.</p>",
    metadata: { source: "OCG Profile Nw.pdf" },
  },
  {
    pageKey: "about", sectionKey: "vision", title: "Our vision", sortOrder: 1,
    content: "<p>OCG aspires to be East Africa's premier green infrastructure and development group by delivering exceptional value for money, operational reliability, and sustainable market leadership.</p>",
    metadata: { source: "OCG Profile Nw.pdf" },
  },
  {
    pageKey: "about", sectionKey: "mission", title: "Our mission", sortOrder: 2,
    content: "<p>To drive regional prosperity and compete effectively in international markets by delivering affordable, accessible, green, and value-driven infrastructure solutions across construction, real estate, tourism, and hospitality.</p>",
    metadata: { source: "OCG Profile Nw.pdf" },
  },
  {
    pageKey: "about", sectionKey: "values", title: "Ten core values", sortOrder: 3,
    content: "<p>The values below guide OCG's project delivery and corporate conduct.</p>",
    metadata: { values: ["Green Stewardship", "Accountability", "Professionalism", "Ethics and Compliance", "Excellence", "Resilience", "Innovation", "Collaboration", "Leadership", "Value for Money"] },
  },
  {
    pageKey: "about", sectionKey: "board", title: "Board of Directors", sortOrder: 4,
    content: "<p>OCG's dual-tier governance structure combines strategic board oversight with executive leadership. Appointment dates are not stated in the supplied source and require management confirmation before being described as current.</p>",
    metadata: { reportingPeriod: "Reported profile; appointment dates require confirmation", members: [
      { name: "Res. Mr. Neway Megersa", role: "Board Chairman" },
      { name: "Res. Amb. Alemayehu Tegenu", role: "Deputy Board Chairman" },
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
    pageKey: "about", sectionKey: "executives", title: "Executive management", sortOrder: 5,
    content: "<p>OCG's executive management team steers long-term vision, governance, engineering operations, design and contract administration. Functional directors lead Finance, Procurement, HR, Legal Services, Planning &amp; Budget, Business Development, and International Relations. Current-incumbent confirmation is required where appointment dates are not stated.</p>",
    metadata: { reportingPeriod: "Reported profile; appointment dates require confirmation", executives: [
      { name: "Dr. Eng. Mesay Daniel", role: "Group CEO" },
      { name: "Dr. Fekadu Megersa", role: "Deputy CEO, Corporate Services" },
      { name: "Eng. Habib Kumbi", role: "Deputy CEO, Engineering Operations" },
      { name: "Eng. Dawit Bekele", role: "Deputy CEO, Design & Contract Administration" },
    ], functions: ["Finance", "Procurement", "HR", "Legal Services", "Planning & Budget", "Business Development", "International Relations"] },
  },
  {
    pageKey: "about", sectionKey: "ceo-message", title: "CEO's Message: Record 2018 & Ambitious 2019 Plan", sortOrder: 6,
    content: "<p><strong>Dr. Eng. Mesay Daniel — Chief Executive Officer, OCG</strong></p><p>Launched under the banner \"A Year of Greater Success and Victory,\" the 2018 fiscal year marked a historic milestone. Despite global instability, fuel shortages, and delayed client payments, OCG surpassed its 30.6B ETB target to achieve over 31.9 billion ETB in revenue (+40.5% YoY), 5.88 billion ETB in gross profit, and a record 2.85 billion ETB net profit.</p><p>We drove this outperformance by mainstreaming ERP systems, GPS tracking, and drone mapping alongside strict project-level profitability analysis. On the ground, we delivered modern urban corridors in Adama, Bishoftu, Nekemte, Shashemene, and Sheger, rural housing in Halaba, Silxe, and Hadiya, and exceeded foreign currency goals in hospitality.</p><p>Building on this momentum, our 2019 (2026/2027) Strategic Plan targets a combined annual revenue of 39.32 billion ETB and 7.07 billion ETB in gross profit. Led by OCC (19.70B ETB) and OBM (10.24B ETB), we are accelerating our shift into a tech-forward, green regional leader through mega-projects, PPPs, and asset monetization.</p>",
    metadata: { reportingPeriod: "2018 historical performance; 2019 (2026/2027) plan", author: "Dr. Eng. Mesay Daniel" },
  },
  {
    pageKey: "about", sectionKey: "geographic-coverage", title: "Nationwide Footprint & Active Backlog", sortOrder: 7,
    content: "<p>From Finfinne (Addis Ababa) to remote districts, OCG executes federal and regional projects across Oromia, Afar, Benishangul Gumz, Central Ethiopia, South Ethiopia, Sidama, Dire Dawa, and Harari—delivering urban corridors, industrial parks, dams, rural housing, and eco-resorts.</p>",
    metadata: { regions: ["Oromia", "Afar", "Benishangul Gumz", "Central Ethiopia", "South Ethiopia", "Sidama", "Dire Dawa", "Harari", "Finfinne (Addis Ababa)"], backlogETB: 77.7, backlogDistribution: [{ name: "OCC", percent: 79.9, etb: 62.2 }, { name: "Walabu", percent: 10.4, etb: 8.1 }, { name: "OBM", percent: 9.6, etb: 7.5 }] },
  },
  {
    pageKey: "services", sectionKey: "service-lines", title: "Specialized Service Lines", sortOrder: 0,
    content: "<p>OCG's service portfolio covers the built environment from feasibility and design through construction, commissioning and asset management.</p>",
    metadata: { services: ["Airports, highways, bridges, dams, power plants, and telecom infrastructure", "Hydrological and geophysical surveys plus advanced materials testing laboratories", "In-house production and supply of high-grade construction inputs", "Construction of buildings", "Industrial parks", "Roads and bridges", "Dams", "Irrigation systems", "Electricity infrastructure", "Telecommunications", "Drilling and water resources development", "Engineering and design services", "Urban planning and engineering", "Tourism and hospitality developments"] },
  },
  {
    pageKey: "services", sectionKey: "equipment", title: "Heavy Machinery Fleet", sortOrder: 1,
    content: "<p>State-of-the-art fleet of excavators, cranes, bulldozers, and earthmoving units. Proactive maintenance schedules and rigorous site inspections minimize downtime. GPS-enabled fleet tracking maximizes precision and productivity.</p>",
    metadata: { equipment: ["Excavators", "Cranes", "Bulldozers", "Earthmoving units"] },
  },
  {
    pageKey: "services", sectionKey: "properties", title: "Strategic Real Properties", sortOrder: 2,
    content: "<p>Owned offices, warehouses, and hotels in Addis Ababa, Adama, Ambo, Arjo, Metu, Dukem, and Langano. Regional logistics hubs lower transport costs and prevent inventory shortages. Hospitality properties support business travel and stimulate local tourism.</p>",
    metadata: { locations: ["Addis Ababa", "Adama", "Ambo", "Arjo", "Metu", "Dukem", "Langano"] },
  },
  {
    pageKey: "services", sectionKey: "quality", title: "Global Standards & ISO", sortOrder: 3,
    content: "<p>Full adherence to International Financial Reporting Standards (IFRS) and RBMEF. OCG &amp; ECO certified under ISO 9001:2015 (Quality Management Systems). OCC holds triple certification: ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018.</p>",
    metadata: { certifications: [{ entity: "OCG & ECO", standards: ["ISO 9001:2015 (Quality Management Systems)"] }, { entity: "OCC", standards: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018"] }] },
  },
  {
    pageKey: "services", sectionKey: "clients", title: "Key Institutional Clients & Partners", sortOrder: 4,
    content: "<p>OCG works with federal ministries and agencies, Oromia regional bureaus, municipal and industrial bodies across Ethiopia.</p>",
    metadata: { groups: [
      { title: "Federal Ministries & Agencies", items: ["Ethiopian Roads Administration (ERA)", "Ministry of Water & Energy", "Ministry of Irrigation & Lowlands"] },
      { title: "Oromia Regional Bureaus", items: ["Water & Energy", "Health", "Education", "Culture & Tourism", "Irrigation & Pastoralist Development"] },
      { title: "Municipal & Industrial Bodies", items: ["Sheger City Administration", "Adama City Administration", "Oromia Industrial Parks", "Gada Special Economic Zone (GSEZ)"] },
    ] },
  },
  {
    pageKey: "services", sectionKey: "why-choose", title: "Why Partner With OCG", sortOrder: 5,
    content: "<p>OCG combines a proven track record, turnkey integration, uncompromising quality and safety, and deep commitment to social and environmental impact.</p>",
    metadata: { reasons: [
      { title: "Proven Track Record", text: "Hundreds of complex federal and regional infrastructure projects delivered on schedule and within budget." },
      { title: "Turnkey Integration", text: "End-to-end delivery spanning feasibility studies, design, material manufacturing, construction, and asset management." },
      { title: "Uncompromising Quality & Safety", text: "Triple ISO-certified systems backed by modern testing laboratories and rigorous job-site safety protocols." },
      { title: "Social & Environmental Impact", text: "Deep commitment to corporate social responsibility, green construction, and uplifting local communities." },
    ] },
  },
  {
    pageKey: "subsidiaries", sectionKey: "overview", title: "Five specialized subsidiaries", sortOrder: 0,
    content: "<p>OCG unites five specialized subsidiaries under one cohesive vision. Historical 2018 figures and 2019 (2026/2027) targets are shown separately.</p>",
    metadata: {},
  },
  {
    pageKey: "subsidiaries", sectionKey: "occ", title: "Oromia Construction Corporation (OCC)", sortOrder: 1,
    content: "<p>OCC is focused on large-scale construction projects, offering high-quality services across residential, commercial, and public infrastructure, with a strong emphasis on sustainable practices and innovation. Core focus: water, dams, drilling, roads, buildings.</p>",
    metadata: { ceo: "Eng. Ashenafi Daba", coreFocus: "Water, dams, drilling, roads, buildings", historical2018: { revenueETB: 17600000000, grossProfitETB: 3180000000 }, targetsFY202627: { revenueETB: 19700000000, grossProfitETB: 3730000000 } },
  },
  {
    pageKey: "subsidiaries", sectionKey: "obm", title: "OBM Construction Share Company", sortOrder: 2,
    content: "<p>OBM Construction Share Company excels in both public and private sector projects, employing skilled labor and modern construction techniques to achieve excellence and timely project completion. Core focus: buildings, real estate, inputs, rental.</p>",
    metadata: { ceo: "Eng. Addisu Berhanu", coreFocus: "Buildings, real estate, inputs, rental", historical2018: { revenueETB: 8690000000, grossProfitETB: 964500000 }, targetsFY202627: { revenueETB: 10240000000, grossProfitETB: 1330000000 } },
  },
  {
    pageKey: "subsidiaries", sectionKey: "walabu", title: "Walabu Construction Share Company", sortOrder: 3,
    content: "<p>Walabu Construction Share Company is recognized for its strong project management capabilities, executing a diverse range of construction initiatives that include industrial facilities and urban development. Core focus: industrial parks, roads, urban works.</p>",
    metadata: { ceo: "Eng. Taddese Diriba", coreFocus: "Industrial parks, roads, urban works", historical2018: { revenueETB: 3510000000, grossProfitETB: 806940000 }, targetsFY202627: { revenueETB: 6420000000, grossProfitETB: 825870000 } },
  },
  {
    pageKey: "subsidiaries", sectionKey: "eco", title: "Engineering Corporation of Oromia (ECO)", sortOrder: 4,
    content: "<p>Oromia Engineering Corporation (ECO) provides comprehensive engineering solutions, delivering expertise in structural, civil, and environmental engineering while adhering to international standards to ensure safety and functionality in all projects. Core focus: design, supervision, ESIA, QC.</p>",
    metadata: { ceo: "Eng. Selamawit Seid", coreFocus: "Design, supervision, ESIA, QC", historical2018: { revenueETB: 1740000000, grossProfitETB: 702780000 }, targetsFY202627: { revenueETB: 2180000000, grossProfitETB: 822570000 } },
  },
  {
    pageKey: "subsidiaries", sectionKey: "ija", title: "IJA Developers Share Company", sortOrder: 5,
    content: "<p>IJA Developers Share Company specializes in real estate development and hospitality ventures, focusing on creating vibrant communities through well-planned residential complexes, commercial spaces, and tourism-related projects that enhance living standards. Core focus: eco-tourism, resorts, real estate.</p>",
    metadata: { ceo: "Mr. Tesfaye Alemayehu", coreFocus: "Eco-tourism, resorts, real estate", historical2018: { revenueETB: 412124733.47, grossProfitETB: 232880000 }, targetsFY202627: { revenueETB: 792130000, grossProfitETB: 351460000 } },
  },
  {
    pageKey: "financial", sectionKey: "historical", title: "Historical financial performance", sortOrder: 0,
    content: "<p>Historical figures are presented as reported and are not current results.</p>",
    metadata: { revenue: [{ year: "2016", etb: 14.8e9 }, { year: "2017", etb: 23.2e9 }, { year: "2018 Actual", etb: 31.9e9 }], assets: [{ year: "2015", etb: 25.13e9 }, { year: "2016", etb: 29.1e9 }, { year: "2017", etb: 35.9e9 }, { year: "2018 Proj.", etb: 44.4e9 }], grossProfit2018ETB: 5.88e9, netProfit2018ETB: 2.85e9, grossMargin2018: "15.35%" },
  },
  {
    pageKey: "financial", sectionKey: "targets", title: "2019 (2026/2027) Strategic Targets", sortOrder: 1,
    content: "<p>These are forward-looking targets, not achieved revenue.</p>",
    metadata: { groupRevenueETB: 39.32e9, groupGrossProfitETB: 7.07e9, subsidiaries: [
      { name: "OCC", revenueETB: 19.70e9, grossProfitETB: 3.73e9 },
      { name: "OBM", revenueETB: 10.24e9, grossProfitETB: 1.33e9 },
      { name: "Walabu", revenueETB: 6.42e9, grossProfitETB: 825.87e6 },
      { name: "ECO", revenueETB: 2.18e9, grossProfitETB: 822.57e6 },
      { name: "IJA Developers", revenueETB: 792.13e6, grossProfitETB: 351.46e6 },
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
