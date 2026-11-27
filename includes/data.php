<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$services = [
    ['title' => 'Building Construction', 'text' => 'Residential, commercial, mixed-use, institutional and public buildings, including finishing works.', 'image' => '12/6.1-8.webp', 'number' => '01'],
    ['title' => 'Infrastructure & Civil Works', 'text' => 'Airports, highways, bridges, dams, power plants, telecommunications and urban infrastructure.', 'image' => '12/photo_2025-12-17_14-55-02-1024x768.webp', 'number' => '02'],
    ['title' => 'Engineering & Consulting', 'text' => 'Feasibility studies, hydrological/geophysical surveys, design, contract administration, supervision and quality assurance.', 'image' => '12/gololicha-2-1024x682.webp', 'number' => '03'],
    ['title' => 'Real Estate Development', 'text' => 'Residential and commercial property, urban planning, land development and investment.', 'image' => '09/wanchi-destination-1024x575.webp', 'number' => '04'],
    ['title' => 'Hospitality & Tourism', 'text' => 'Eco-tourism, resorts, hotels, recreation centres and visitor experiences.', 'image' => '09/wanchi-destination-1024x575.webp', 'number' => '05'],
    ['title' => 'Water & Environmental Projects', 'text' => 'Irrigation, dams, water supply, drilling, sanitation and environmentally responsible development.', 'image' => '12/walmal-1024x576.webp', 'number' => '06'],
];

$subsidiaries = [
    ['name' => 'Oromia Construction Corporation (OCC)', 'short' => 'OCC', 'category' => 'Construction & infrastructure', 'description' => 'Focused on large-scale construction projects across residential, commercial and public infrastructure, with strong emphasis on sustainable practices and innovation. Core focus: water, dams, drilling, roads, buildings.', 'url' => 'https://occ-oro.com/', 'mark' => 'OCC', 'ceo' => 'Eng. Ashenafi Daba'],
    ['name' => 'OBM Construction Share Company', 'short' => 'OBM', 'category' => 'Building & civil works', 'description' => 'Excels in public and private sector projects, employing skilled labor and modern construction techniques for excellence and timely completion. Core focus: buildings, real estate, inputs, rental.', 'url' => 'https://www.obmconstructionsc.com/', 'mark' => 'OBM', 'ceo' => 'Eng. Addisu Berhanu'],
    ['name' => 'Walabu Construction Share Company', 'short' => 'Walabu', 'category' => 'Industrial & civil construction', 'description' => 'Recognized for strong project management capabilities, executing industrial facilities, urban development, roads and infrastructure. Core focus: industrial parks, roads, urban works.', 'url' => 'https://www.walabuconstruction.com/', 'mark' => 'W', 'ceo' => 'Eng. Taddese Diriba'],
    ['name' => 'Engineering Corporation of Oromia (ECO)', 'short' => 'ECO', 'category' => 'Engineering consultancy', 'description' => 'Provides comprehensive engineering solutions in structural, civil and environmental engineering, adhering to international standards. Core focus: design, supervision, ESIA, QC.', 'url' => 'https://ecoet.org/', 'mark' => 'ECO', 'ceo' => 'Eng. Selamawit Seid'],
    ['name' => 'IJA Developers Share Company', 'short' => 'IJA', 'category' => 'Real estate, hotels & tourism', 'description' => 'Specializes in real estate development and hospitality ventures, creating vibrant communities through residential complexes, commercial spaces and tourism projects. Core focus: eco-tourism, resorts, real estate.', 'url' => 'https://ijadevelopers.com/', 'mark' => 'IJA', 'ceo' => 'Mr. Tesfaye Alemayehu'],
];

$projects = [
    ['slug' => 'corridor-development', 'title' => 'Corridor Development in Ethiopia', 'date' => 'December 26, 2025', 'image' => '12/photo_2025-12-17_14-55-02-1024x768.webp', 'category' => 'Urban development', 'excerpt' => 'Urban improvements that bring upgraded roads, public spaces, walking routes, lighting and greener city environments.', 'body' => 'Ethiopia’s corridor development initiatives focus on modern urban infrastructure, including wider roads, pedestrian routes, green spaces, better lighting and improved public areas. OCG’s public updates highlight the wider development effort and its potential to support mobility, economic activity and quality of urban life.'],
    ['slug' => 'waliso-integrated-bus-terminal', 'title' => 'Waliso Integrated Bus Terminal', 'date' => 'December 26, 2025', 'image' => '12/waliso-.webp', 'category' => 'Transport infrastructure', 'excerpt' => 'The integrated bus terminal in Waliso was reported as inaugurated after construction.', 'body' => 'The public update describes the integrated bus terminal in Waliso as a project built at a cost of more than 600 million Birr on a site of approximately 2.5 hectares. The terminal supports an improved public transport experience for the city and surrounding communities.'],
    ['slug' => 'walmal-river-irrigation', 'title' => 'Walmal River Irrigation Project', 'date' => 'December 26, 2025', 'image' => '12/walmal-1024x576.webp', 'category' => 'Water & irrigation', 'excerpt' => 'The Walmal River Irrigation construction project was reported as inaugurated by a national and regional delegation.', 'body' => 'The OCG website reports that the Walmal River Irrigation Project was built by Oromia Construction Corporation (OCC) and inaugurated by a delegation led by the Prime Minister of Ethiopia, together with Oromia Regional State and irrigation-sector representatives. The project illustrates the role of irrigation infrastructure in supporting agricultural productivity and regional development.'],
    ['slug' => 'oromia-supreme-court', 'title' => 'Oromia Supreme Court Building Project', 'date' => 'December 15, 2025', 'image' => '12/6.1-8.webp', 'category' => 'Public buildings', 'excerpt' => 'A proposed 2B+G+13 head-office building for the Supreme Court of Oromia in Finfinnee.', 'body' => 'The project description on the existing OCG website states that the Oromia Supreme Court 2B+G+13 building in Finfinnee has a built-up area of 3,247 m² and a height of 67.50 metres. Planned facilities include courtrooms, public waiting areas, parking, offices, a library, cafeterias and an apartment. The page lists a project value of 2.8 billion Birr.'],
];

$leadership = [
    ['name' => 'Messay Daniel Tullu (Dr. Eng)', 'role' => 'OCG Chief Executive Officer'],
    ['name' => 'Dr. Fekadu Megersa Senbet', 'role' => 'Deputy CEO, Corporate Services'],
    ['name' => 'Eng. Habib Kumbi Gelchu', 'role' => 'Deputy CEO, Engineering Operation'],
    ['name' => 'Eng. Dawit Bekele', 'role' => 'Deputy CEO, Design and Contract Administration'],
];
