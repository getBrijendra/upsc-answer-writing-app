import { NextResponse } from "next/server"

// Demo blog posts data
const demoBlogPosts = [
  {
    id: "1",
    slug: "india-foreign-policy-2024",
    title: "India's Foreign Policy in 2024: Key Developments",
    excerpt:
      "An in-depth analysis of India's diplomatic relations and strategic partnerships in the current geopolitical landscape.",
    content: `India's foreign policy in 2024 has been marked by significant developments across multiple fronts. The country has strengthened its strategic partnerships while maintaining its traditional policy of non-alignment.

## Key Highlights

### Strengthening Quad Relations
India has deepened its engagement with the Quadrilateral Security Dialogue (Quad), comprising the US, Japan, and Australia. The focus has been on maritime security, infrastructure development, and technology cooperation.

### Neighborhood First Policy
India continues to prioritize its relations with neighboring countries through various initiatives:
- Enhanced connectivity projects with Bangladesh and Nepal
- Humanitarian assistance to Sri Lanka
- Border infrastructure development with Bhutan

### Global South Leadership
India has emerged as a strong voice for developing nations, advocating for:
- Climate justice and sustainable development
- Reform of multilateral institutions
- Technology transfer and capacity building

### Strategic Autonomy
Despite global pressures, India has maintained its strategic autonomy by:
- Balancing relations between major powers
- Pursuing independent foreign policy decisions
- Focusing on national interests

## Implications for UPSC Aspirants

Understanding these developments is crucial for:
- International Relations questions in Mains
- Current Affairs in Prelims
- Essay topics on diplomacy and geopolitics

Stay updated with official statements from the Ministry of External Affairs and think tanks like ORF and IDSA for comprehensive coverage.`,
    category: "Current Affairs",
    date: "2024-01-15",
    author: "Dr. Rajesh Kumar",
    image: "/india-foreign-policy.png",
    readTime: "8 min read",
  },
  {
    id: "2",
    slug: "climate-change-india-challenges",
    title: "Climate Change: India's Challenges and Opportunities",
    excerpt:
      "Exploring India's climate commitments, renewable energy targets, and the path to sustainable development.",
    content: `Climate change represents both a significant challenge and an opportunity for India's development trajectory. As one of the world's fastest-growing economies, India faces the dual challenge of meeting its development needs while addressing environmental concerns.

## India's Climate Commitments

### Paris Agreement Targets
India has committed to:
- Reduce emissions intensity of GDP by 45% by 2030
- Achieve 50% cumulative electric power installed capacity from non-fossil fuel sources by 2030
- Create additional carbon sink of 2.5-3 billion tonnes of CO2 equivalent

### Net Zero by 2070
India announced its ambitious target to achieve net-zero emissions by 2070, demonstrating long-term commitment to climate action.

## Key Initiatives

### Renewable Energy Expansion
- National Solar Mission targeting 100 GW solar capacity
- Offshore wind energy projects
- Green hydrogen mission for clean energy transition

### Sustainable Mobility
- Electric vehicle adoption and infrastructure development
- Metro rail expansion in major cities
- Promotion of public transportation

### Adaptation Measures
- Climate-resilient agriculture practices
- Water conservation and management
- Disaster risk reduction frameworks

## Challenges

1. **Energy Security**: Balancing renewable transition with energy needs
2. **Financial Resources**: Mobilizing climate finance for adaptation and mitigation
3. **Technology Transfer**: Access to clean technologies
4. **Just Transition**: Ensuring equitable development

## UPSC Relevance

This topic is crucial for:
- Environment and Ecology section
- Economic Development questions
- Essay on sustainable development
- Ethics case studies on intergenerational equity`,
    category: "General Knowledge",
    date: "2024-01-10",
    author: "Prof. Meera Sharma",
    image: "/climate-change-india.jpg",
    readTime: "10 min read",
  },
  {
    id: "3",
    slug: "digital-india-transformation",
    title: "Digital India: Transforming Governance and Society",
    excerpt:
      "How digital initiatives are revolutionizing public service delivery and creating opportunities for inclusive growth.",
    content: `The Digital India initiative has fundamentally transformed how citizens interact with government services and how businesses operate in the country. This comprehensive program has multiple dimensions affecting governance, economy, and society.

## Key Pillars of Digital India

### Digital Infrastructure
- BharatNet for rural connectivity
- Common Service Centers (CSCs)
- Digital payment infrastructure (UPI, BHIM)

### Digital Services
- e-Governance platforms (UMANG, DigiLocker)
- Direct Benefit Transfer (DBT)
- Online education platforms

### Digital Empowerment
- Digital literacy programs
- Skill development initiatives
- Startup ecosystem support

## Major Achievements

### Financial Inclusion
- Jan Dhan accounts reaching 500+ million people
- UPI transactions crossing 10 billion per month
- Digital lending and fintech growth

### Governance Efficiency
- Reduced corruption through transparency
- Faster service delivery
- Better targeting of beneficiaries

### Economic Growth
- Digital economy contribution to GDP
- Job creation in IT sector
- Export of digital services

## Challenges Ahead

1. **Digital Divide**: Urban-rural and socio-economic gaps
2. **Cybersecurity**: Protecting critical infrastructure
3. **Data Privacy**: Balancing innovation with privacy rights
4. **Digital Literacy**: Ensuring inclusive participation

## Future Roadmap

- 5G rollout and applications
- Artificial Intelligence integration
- Blockchain for governance
- Internet of Things (IoT) for smart cities

## UPSC Preparation Tips

Focus on:
- Government schemes and their impact
- Technology and governance intersection
- Social implications of digitalization
- Economic aspects of digital transformation`,
    category: "Current Affairs",
    date: "2024-01-05",
    author: "Amit Verma",
    image: "/digital-india.jpg",
    readTime: "7 min read",
  },
  {
    id: "4",
    slug: "indian-economy-growth-prospects",
    title: "Indian Economy: Growth Prospects and Challenges",
    excerpt:
      "Analyzing India's economic performance, structural reforms, and the path to becoming a developed nation by 2047.",
    content: `India's economy has shown remarkable resilience and growth potential, positioning itself as one of the fastest-growing major economies globally. Understanding the economic landscape is crucial for UPSC aspirants.

## Current Economic Scenario

### Growth Indicators
- GDP growth rate projections
- Inflation trends and management
- Employment generation
- Foreign exchange reserves

### Sectoral Performance
- Agriculture and allied sectors
- Manufacturing and Make in India
- Services sector dominance
- Digital economy expansion

## Structural Reforms

### Goods and Services Tax (GST)
- Simplification of tax structure
- Increased tax compliance
- Interstate trade facilitation

### Insolvency and Bankruptcy Code
- Faster resolution of stressed assets
- Improved ease of doing business
- Creditor rights protection

### Production Linked Incentive (PLI) Schemes
- Manufacturing boost across sectors
- Export competitiveness
- Job creation potential

## Challenges

### Unemployment
- Youth unemployment concerns
- Skill-job mismatch
- Need for quality job creation

### Income Inequality
- Wealth concentration
- Regional disparities
- Need for inclusive growth

### Fiscal Management
- Balancing growth and fiscal prudence
- Subsidy rationalization
- Revenue mobilization

## Opportunities

1. **Demographic Dividend**: Young workforce advantage
2. **Digital Economy**: Technology-led growth
3. **Global Supply Chains**: Manufacturing hub potential
4. **Green Economy**: Sustainable development path

## Policy Priorities

- Infrastructure development
- Human capital formation
- Innovation and R&D
- Financial sector reforms

## UPSC Relevance

Essential for:
- Economic Survey analysis
- Budget understanding
- Mains GS Paper III
- Optional subjects like Economics`,
    category: "General Knowledge",
    date: "2023-12-28",
    author: "Dr. Priya Nair",
    image: "/indian-economy.jpg",
    readTime: "9 min read",
  },
  {
    id: "5",
    slug: "constitutional-amendments-recent",
    title: "Recent Constitutional Amendments: Analysis and Impact",
    excerpt:
      "A comprehensive look at recent amendments to the Indian Constitution and their implications for governance and rights.",
    content: `The Indian Constitution, while being a living document, has undergone numerous amendments to adapt to changing times. Recent amendments have significant implications for governance, rights, and federal structure.

## Understanding Constitutional Amendments

### Amendment Process
- Article 368 provisions
- Types of amendments
- Role of Parliament and State Legislatures
- Presidential assent

## Recent Significant Amendments

### 103rd Amendment (2019)
- 10% reservation for Economically Weaker Sections (EWS)
- Constitutional validity debates
- Implementation challenges

### 104th Amendment (2020)
- Extension of reservation for SCs/STs in Lok Sabha and State Assemblies
- Continuation of Anglo-Indian representation provisions

### 105th Amendment (2021)
- Restoration of states' power to identify OBCs
- Federal implications
- SEBC list maintenance

## Key Constitutional Debates

### Basic Structure Doctrine
- Kesavananda Bharati case legacy
- Limits on amendment power
- Judicial review importance

### Federal Relations
- Centre-State dynamics
- Cooperative federalism
- GST Council model

### Fundamental Rights
- Right to Privacy recognition
- Freedom of speech limitations
- Equality and reservation balance

## Implications for Governance

1. **Social Justice**: Balancing equality and affirmative action
2. **Federalism**: Power distribution between Centre and States
3. **Judicial Review**: Courts' role in constitutional interpretation
4. **Democratic Values**: Protecting fundamental rights

## UPSC Preparation Strategy

Focus on:
- Constitutional provisions and amendments
- Landmark judgments
- Polity and governance intersection
- Current debates and controversies

### Recommended Resources
- Bare Act of Constitution
- Laxmikanth's Indian Polity
- Supreme Court judgments
- Parliamentary debates

## Practice Questions

1. Discuss the significance of the Basic Structure doctrine
2. Analyze the impact of recent amendments on federalism
3. Evaluate the balance between equality and reservation`,
    category: "General Knowledge",
    date: "2023-12-20",
    author: "Advocate Suresh Menon",
    image: "/indian-constitution.jpg",
    readTime: "11 min read",
  },
  {
    id: "6",
    slug: "space-missions-india-achievements",
    title: "India's Space Missions: Recent Achievements and Future Plans",
    excerpt: "Exploring ISRO's remarkable journey, recent successes, and ambitious plans for space exploration.",
    content: `India's space program has achieved remarkable milestones, establishing the country as a major space-faring nation. ISRO's cost-effective and innovative approach has garnered global recognition.

## Recent Achievements

### Chandrayaan-3 Success
- Successful soft landing on Moon's south pole
- Scientific experiments and discoveries
- Global recognition and collaboration opportunities

### Gaganyaan Mission
- India's first human spaceflight program
- Astronaut training and preparation
- Technology development and testing

### Aditya-L1
- First Indian solar mission
- Study of Sun's corona and solar activities
- Space weather prediction capabilities

## ISRO's Capabilities

### Launch Vehicles
- PSLV: Workhorse of Indian space program
- GSLV: Heavy-lift capability
- Small satellite launch vehicles

### Satellite Applications
- Communication satellites
- Earth observation systems
- Navigation (NavIC/IRNSS)
- Weather forecasting

## Commercial Space Activities

### NewSpace India Limited (NSIL)
- Commercial arm of ISRO
- International satellite launches
- Technology transfer

### Private Sector Participation
- Space sector reforms
- Startup ecosystem
- IN-SPACe regulatory framework

## Future Missions

1. **Chandrayaan-4**: Sample return mission
2. **Shukrayaan**: Venus orbiter mission
3. **Mars Orbiter Mission-2**: Enhanced Mars exploration
4. **Space Station**: Indian space station by 2035

## Strategic Importance

### National Security
- Surveillance capabilities
- Communication security
- Strategic autonomy

### Economic Benefits
- Technology spinoffs
- Job creation
- Export potential

### Scientific Advancement
- Research opportunities
- International collaboration
- Innovation ecosystem

## Challenges

- Budget constraints
- Technology gaps
- International competition
- Debris management

## UPSC Relevance

Important for:
- Science and Technology section
- Current Affairs
- Space policy and governance
- International relations

### Key Topics to Study
- ISRO missions and achievements
- Space policy and regulations
- International space cooperation
- Commercial space activities

## Conclusion

India's space program represents the nation's scientific prowess and ambition. Understanding these developments is crucial for comprehensive UPSC preparation, especially for questions on science, technology, and strategic affairs.`,
    category: "News",
    date: "2023-12-15",
    author: "Dr. Kiran Reddy",
    image: "/indian-space-mission.jpg",
    readTime: "10 min read",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const slug = searchParams.get("slug")

    // If slug is provided, return single blog post
    if (slug) {
      const blog = demoBlogPosts.find((post) => post.slug === slug)
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 })
      }
      return NextResponse.json(blog)
    }

    // Filter by category if provided
    let filteredBlogs = demoBlogPosts
    if (category && category !== "All") {
      filteredBlogs = demoBlogPosts.filter((post) => post.category === category)
    }

    return NextResponse.json(filteredBlogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
