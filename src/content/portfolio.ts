export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const profile = {
  name: 'Alec Daveynis',
  title: 'Software Engineer | AI & Autonomous Systems',
  intro:
    "I'm a Computer Science student at Cornell University building intelligent software, from autonomous driving systems and AI agents to full-stack applications. I enjoy turning ambitious technical ideas into real, working products.",
  email: 'ald242@cornell.edu',
  linkedin: 'https://www.linkedin.com/in/alec-daveynis/',
  github: 'https://www.github.com/alecdaveynis',
  headshot: asset('img/Headshot.jpg'),
}

export const about = {
  intro:
    'Hello, I\'m Alec Daveynis, a Cornell College of Engineering student pursuing a B.S. in Computer Science with a minor in Artificial Intelligence (expected Dec. 2026), and an incoming M.Eng in Computer Science (Spring 2027). I enjoy taking complex, messy problems and turning them into practical, reliable solutions.',
  paragraphs: [
    'My work spans agentic AI systems and data pipelines at Chevron, production full‑stack tools like VBTrain, and perception for autonomous driving. I like being close to both the algorithms and the infrastructure – understanding how models work while also making sure they can be deployed, monitored, and iterated on.',
    "Outside of class and internships, I'm President and Captain of Cornell Men's Volleyball Club. I'm especially excited about projects where AI augments human decision‑making.",
  ],
  facts: [
    ['Education', 'BS CS + AI · M.Eng CS @ Cornell'],
    ['Strengths', 'AI agents, data pipelines, CV'],
    ['Activities', "Cornell Men’s Volleyball captain"],
  ] as const,
}

export type ProjectFilter = 'all' | 'ml' | 'vision' | 'data' | 'product'

export type Project = {
  title: string
  description: string
  href: string
  tags: string[]
  filters: Exclude<ProjectFilter, 'all'>[]
  image?: string
  imageAlt?: string
}

export const projectFilters: { id: ProjectFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'vision', label: 'Computer Vision' },
  { id: 'data', label: 'Data / Backend' },
  { id: 'product', label: 'Product / UX' },
]

export const projects: Project[] = [
  {
    title: 'VBTrain – AI Volleyball Training Platform',
    description:
      'A production full-stack AI volleyball coaching app (Python, Flask, OpenCV, GPT-4o vision) deployed on Azure Container Apps with PostgreSQL. Delivers automated technique evaluation, data-driven lineup optimization, and personalized practice plans — piloted with 50+ collegiate players to extend coaching access through film analysis and natural-language feedback.',
    href: 'https://vb-train.com',
    tags: ['Flask', 'OpenCV', 'Azure', 'GPT-4o'],
    filters: ['ml', 'product'],
    image: asset('img/VBTrain.png'),
    imageAlt: 'VBTrain Screenshot',
  },
  {
    title: 'Autonomous Driving Perception & Collision Avoidance',
    description:
      'Developed an autonomous driving perception pipeline in Python using YOLOv8, OpenCV, and LiDAR-camera sensor fusion for lane detection, object tracking, and distance estimation. Integrated a physics-informed GRU neural network for time-to-collision (TTC) prediction with predictive collision avoidance planning. Evaluated system performance using KITTI driving data and simulated traffic scenarios to assess detection accuracy, collision risk, and safety.',
    href: 'https://github.com/alecdaveynis/AV-Collision-Avoidance',
    tags: ['OpenCV', 'YOLOv8', 'Computer Vision'],
    filters: ['ml', 'vision'],
    image: asset('img/AV.png'),
    imageAlt: 'Autonomous vehicle lane detection and collision avoidance demo',
  },
  {
    title: 'RL Driving Simulator',
    description:
      'Interactive 2D autonomous driving simulator using Double DQN reinforcement learning to train driving policies across diverse traffic scenarios, with safety and performance benchmarking against rule-based controllers.',
    href: 'https://github.com/alecdaveynis/RL-Driving-Simulator',
    tags: ['Python', 'Double DQN', 'Reinforcement Learning'],
    filters: ['ml'],
    image: asset('img/RLDriving.png'),
    imageAlt: 'RL Driving Lab running a Double DQN in mixed traffic',
  },
  {
    title: 'RL Tetris',
    description:
      'Deep reinforcement learning for Tetris, built for Cornell CS 4701. A custom placement-action DQN in PyTorch learns from a heuristic baseline, with an interactive tool that shows how the network scores each legal placement.',
    href: 'https://github.com/alecdaveynis/RL-Tetris',
    tags: ['PyTorch', 'DQN', 'Reinforcement Learning'],
    filters: ['ml'],
    image: asset('img/RLTetris.png'),
    imageAlt: 'Tetris DQN Explorer comparing network and heuristic placements',
  },
  {
    title: 'Forge – Godot AI Development Copilot',
    description:
      'Forge is an AI-powered development copilot I built to help beginners learn and build projects in the Godot Engine without getting stuck on setup or syntax. Built with TypeScript, Fastify, SQLite, and a custom Godot editor plugin, it integrates directly into the game engine to guide users through building features like player movement, scenes, and game logic. Forge analyzes the current project, generates structured plans, previews code and scene changes as diffs, and safely applies them with rollback support, so users can learn by doing without breaking their project.',
    href: 'https://github.com/alecdaveynis/Forge',
    tags: ['TypeScript', 'Fastify', 'SQLite', 'Godot Plugin'],
    filters: ['ml', 'data', 'product'],
    image: asset('img/Forge.png'),
    imageAlt: 'Forge – AI-powered development copilot for Godot',
  },
  {
    title: 'Pricedle – A Cost‑Guessing Game',
    description:
      'Pricedle is a Wordle-inspired game that challenges players to guess the price of a randomly selected Costco food item. Players receive feedback after each guess until landing within 5% of the true price.',
    href: 'https://github.com/alecdaveynis/pricedle',
    tags: ['Game Design', 'Frontend'],
    filters: ['product'],
    image: asset('img/Pricedle.jpg'),
    imageAlt: 'Pricedle Screenshot',
  },
  {
    title: 'LiftHeavy – Strength Progress Tracker',
    description:
      'LiftHeavy is a fitness tracking application for logging lifts, setting personal records, and visualizing strength progress over time. It supports goal-setting, weekly trend analysis, and benchmarking against community performance.',
    href: 'https://github.com/alecdaveynis/LiftHeavy',
    tags: ['Product Design', 'Data Visualization', 'Web App'],
    filters: ['product', 'data'],
    image: asset('img/LiftHeavy.jpg'),
    imageAlt: 'LiftHeavy dashboard UI',
  },
  {
    title: 'Slack Snipe Bot',
    description:
      'A Python-based Slack integration that allows team members to “snipe” teammates with photos, track points, and maintain leaderboards. Built using the Slack API and hosted on AWS, the bot is easily extensible to other team-based engagement games.',
    href: 'https://github.com/alecdaveynis/SlackSnipeBot',
    tags: ['Slack API', 'Python', 'AWS'],
    filters: ['data', 'product'],
    image: asset('img/SlackSnipeBot.png'),
    imageAlt: 'Slack Snipe Bot Screenshot',
  },
]

export type Role = {
  title: string
  meta: string
  points: string[]
  tags: string[]
}

export const experience: Role[] = [
  {
    title: 'AI Engineering Intern – Subsurface/Wells Data & AI + Global Security AI',
    meta: 'Chevron · Houston, TX · May 2026 – Aug. 2026',
    points: [
      'Built an agentic migration system adopted across the enterprise, automating end-to-end Azure Synapse to Databricks pipeline migration and validation — cutting manual engineering effort by 90%.',
      'Engineered the workflow with Python, OpenAI API, and RESTful services, using CIR-based pipeline translation and LLM-driven semantic verification with iterative self-correction.',
      'Led the runtime quality-control framework for a multi-agent security AI system: real-time response validation, confidence scoring, and fallback mechanisms for accuracy and policy compliance at low latency.',
    ],
    tags: ['AI Agents', 'Databricks', 'OpenAI API'],
  },
  {
    title: 'Data Engineering Intern – Enterprise AI',
    meta: 'Chevron · Houston, TX · May 2025 – Aug. 2025',
    points: [
      'Designed and implemented a data model for master chemical records using Databricks Unity Catalog, supporting ML for LPO chemical interactions and accelerating SME analysis by 50%.',
      'Enhanced the pipeline with high-accuracy fuzzy matching (RapidFuzz, pandas) to resolve chemical aliases across vendors, improving ingestion efficiency by 40%.',
      'Leveraged Azure OpenAI to build an AI agent that analyzes ambiguous chemical inputs and generates structured recommendations for SME review or automated resolution.',
    ],
    tags: ['Data Engineering', 'Azure', 'Unity Catalog'],
  },
  {
    title: 'Data Engineering Intern – Global Security',
    meta: 'Chevron · San Ramon, CA · May 2024 – Aug. 2024',
    points: [
      'Enhanced the AI-based GS Watch app for the Global Security Information Center, reducing incident detection time by 75% through real-time risk analysis.',
      'Developed and optimized frontend and backend modules using JavaScript (Node.js), SQL, and ArcGIS developer packages in an agile scrum team.',
    ],
    tags: ['Full‑stack', 'Security', 'ArcGIS'],
  },
]

export type SkillGroup = {
  title: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: ['Python', 'Java', 'C/C++', 'JavaScript', 'SQL', 'R'],
  },
  {
    title: 'AI / ML',
    skills: ['OpenAI API', 'Machine Learning', 'Computer Vision', 'OpenCV'],
  },
  {
    title: 'Backend',
    skills: ['Data Engineering', 'PostgreSQL'],
  },
  {
    title: 'Cloud & Infrastructure',
    skills: ['Azure', 'AWS', 'Databricks', 'Docker', 'Git'],
  },
  {
    title: 'Web & Leadership',
    skills: ['HTML', 'CSS', 'Leadership', 'Cybersecurity'],
  },
]

export const skillHints: Record<string, string> = {
  Python: 'Python powers my Chevron AI agents, VBTrain, Slack Snipe Bot, and data engineering pipelines.',
  'C/C++': 'C/C++ underpins systems coursework including operating systems and computer system organization.',
  Java: 'Java appears in systems and backend-focused coursework in my CS degree.',
  R: 'R supports statistical analysis and data exploration in my academic projects.',
  JavaScript: 'JavaScript powers GS Watch modules at Chevron, Pricedle, and this portfolio.',
  SQL: 'SQL supports data models and backends across Chevron internships and PostgreSQL-backed VBTrain.',
  Azure: 'Azure hosts VBTrain on Container Apps and underpins OpenAI and data work across Chevron internships.',
  AWS: 'AWS hosts Slack Snipe Bot and appears alongside GCP and Azure in my cloud toolkit.',
  Databricks: 'Databricks and Unity Catalog powered chemical data models and Synapse-to-Databricks migration at Chevron.',
  Docker: 'Docker supports containerized deployments like VBTrain on Azure Container Apps.',
  PostgreSQL: 'PostgreSQL stores player stats and app data for production VBTrain.',
  Git: 'Git is how I collaborate on Chevron work, open-source projects, and this portfolio.',
  'OpenAI API': 'OpenAI API drives agentic migration, security QC agents, chemical exception handling, and VBTrain feedback.',
  'Machine Learning': 'Machine learning is central to my Chevron AI agent work and VBTrain sports analytics.',
  'Computer Vision': 'Computer vision drives my AV perception pipeline (OpenCV, YOLOv8) and VBTrain film analysis.',
  'Data Engineering': 'Data engineering spans Unity Catalog modeling, fuzzy-matching pipelines, and enterprise migrations at Chevron.',
  OpenCV: 'OpenCV powers lane detection and collision avoidance, plus VBTrain technique evaluation from match footage.',
  HTML: 'HTML, CSS, and JavaScript form the foundation of this portfolio and projects like Pricedle.',
  CSS: 'CSS brings the interactive, responsive UI to life across my web projects.',
  Leadership: "I'm President and Captain of Cornell Men's Volleyball Club and collaborate across Chevron AI teams.",
  Cybersecurity: 'Cybersecurity connects to Chevron Global Security AI — GS Watch and multi-agent QC frameworks.',
}

export const destinations = [
  { id: 'projects', label: 'Projects', blurb: 'Selected engineering work' },
  { id: 'experience', label: 'Experience', blurb: 'Internships and applied work' },
  { id: 'skills', label: 'Skills', blurb: 'Languages, AI, backend, and cloud' },
  { id: 'about', label: 'About', blurb: 'Cornell, interests, and volleyball' },
  { id: 'contact', label: 'Contact', blurb: 'GitHub, LinkedIn, and email' },
] as const

export type DestinationId = (typeof destinations)[number]['id']
