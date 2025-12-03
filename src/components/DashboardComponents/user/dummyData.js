export const dummySubjects = [
    {
      id: "4035887f-b9b5-4b75-9b6b-10da83803830",
      name: "Biology",
      description: "Study of living organisms",
      category: "PUTME",
      color: "#6A89CC",
      icon: "🌿",
      createdAt: "2025-11-11T15:03:53.584Z",
      module: [
        {
          id: "238bb369-c8ba-476f-b4eb-c35abe0d7cf6",
          name: "Cell Biology"
        },
        {
          id: "e2b6d0d3-4167-49af-b251-f3b491bd3ebf",
          name: "Ecology"
        }
      ],
        question: [
    {
      id: "cb01a91d-7785-4b43-b9db-289723bb27dd",
      text: "Which organelle is responsible for controlling cell activities?",
      options: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi apparatus"],
      difficulty: "EASY",
      year: 2020,
      category: "PUTME",
      topicId: "3b7049ea-5f6e-43fb-9693-7734370399be",     // Cell Components
      moduleId: "238bb369-c8ba-476f-b4eb-c35abe0d7cf6"   // Cell Biology
    },
    {
      id: "5f3d92db-8014-4814-9cd2-5596d76f0dd1",
      text: "Which structure is the site of protein synthesis?",
      options: ["Ribosome", "Nucleus", "Vacuole", "Chloroplast"],
      difficulty: "EASY",
      year: 2021,
      category: "PUTME",
      topicId: "3b7049ea-5f6e-43fb-9693-7734370399be",
      moduleId: "238bb369-c8ba-476f-b4eb-c35abe0d7cf6"
    },
    {
      id: "9b7ef6ae-5244-4188-8782-07be2e760568",
      text: "Which of the following is an example of a biotic factor?",
      options: ["Temperature", "Sunlight", "Bacteria", "Water"],
      difficulty: "MEDIUM",
      year: 2020,
      category: "PUTME",
      topicId: "79b81059-a5fe-4db3-9f62-57c5f1e474fc",     // Ecosystems
      moduleId: "e2b6d0d3-4167-49af-b251-f3b491bd3ebf"    // Ecology
    },
    {
      id: "c1f4dd79-0ad6-4dfd-b17b-9d1f148dc92f",
      text: "Which process adds carbon dioxide to the atmosphere?",
      options: ["Photosynthesis", "Respiration", "Transpiration", "Condensation"],
      difficulty: "EASY",
      year: 2021,
      category: "PUTME",
      topicId: "79b81059-a5fe-4db3-9f62-57c5f1e474fc",
      moduleId: "e2b6d0d3-4167-49af-b251-f3b491bd3ebf"
    }
  ]
    },
    {
        id: "7ac1e2a1-6bf7-4a41-9c02-512944be17f2",
        name: "Chemistry",
        description: "Study of matter, its composition, structure, and reactions.",
        category: "PUTME",
        color: "#FF8A65",
        icon: "⚗️",
        createdAt: "2025-11-11T15:03:53.584Z",
    
        // 🔹 MODULES (Chapters)
        module: [
        {
            id: "92e03f72-f304-4ec5-9f24-1f245bcdcf21",
            name: "Atomic Structure"
        },
        {
            id: "d84b5ce2-d24f-42bd-9b1f-d86c8abcc722",
            name: "Chemical Bonding"
        }
        ],
    
        // 🔥 QUESTIONS (REALISTIC & BACKEND FRIENDLY)
        question: [
        // ---------------- ATOMIC STRUCTURE (2020 & 2021) ----------------
        {
            id: "c20117f8-a5ff-4823-8c15-f0f3c7da22fe",
            text: "Which subatomic particle determines the identity of an element?",
            options: ["Proton", "Electron", "Neutron", "Nucleus"],
            difficulty: "EASY",
            year: 2020,
            category: "PUTME",
            topicId: "5d1b77fc-b7e2-4f87-a6b0-3d10e2b76789", // Atomic Structure → Particles
            moduleId: "92e03f72-f304-4ec5-9f24-1f245bcdcf21"
        },
        {
            id: "fd5c23c1-3df3-4814-9212-248eedb72e82",
            text: "What is the mass number of an atom?",
            options: [
            "Total number of protons and neutrons",
            "Total number of electrons",
            "Number of valence electrons",
            "Neutrons minus electrons"
            ],
            difficulty: "EASY",
            year: 2021,
            category: "PUTME",
            topicId: "5d1b77fc-b7e2-4f87-a6b0-3d10e2b76789",
            moduleId: "92e03f72-f304-4ec5-9f24-1f245bcdcf21"
        },
    
        // ---------------- CHEMICAL BONDING (2020 & 2021) ----------------
        {
            id: "39c7f9a3-4b0b-4dd1-a6fb-99cba09ffd8f",
            text: "Ionic bonding occurs mainly between:",
            options: [
            "Metals and non-metals",
            "Two non-metals",
            "Two metals",
            "Inert gases only"
            ],
            difficulty: "EASY",
            year: 2020,
            category: "PUTME",
            topicId: "1a7c0a74-0150-441d-8f98-51d1732d5191", // Chemical Bonding → Ionic Bond
            moduleId: "d84b5ce2-d24f-42bd-9b1f-d86c8abcc722"
        },
        {
            id: "e82ca34f-47d0-4540-a738-f3f59e6edb7b",
            text: "Which of the following molecules contains a double bond?",
            options: ["O₂", "N₂", "H₂", "Cl₂"],
            difficulty: "MEDIUM",
            year: 2021,
            category: "PUTME",
            topicId: "1a7c0a74-0150-441d-8f98-51d1732d5191", // Chemical Bonding → Covalent Bond
            moduleId: "d84b5ce2-d24f-42bd-9b1f-d86c8abcc722"
        }
        ]
    }
  ];


  export const dummyTopics = [
    {
      id: "3b7049ea-5f6e-43fb-9693-7734370399be",
      name: "Cell Components",
      description: "Organelles and their roles",
      moduleId: "238bb369-c8ba-476f-b4eb-c35abe0d7cf6", // Cell Biology
      createdAt: "2025-11-11T15:03:36.454Z",
      question: [],
      module: {
        id: "238bb369-c8ba-476f-b4eb-c35abe0d7cf6",
        name: "Cell Biology"
      }
    },
  
    {
      id: "79b81059-a5fe-4db3-9f62-57c5f1e474fc",
      name: "Ecosystems",
      description: "Interactions of organisms",
      moduleId: "e2b6d0d3-4167-49af-b251-f3b491bd3ebf", // Ecology
      createdAt: "2025-11-11T15:04:00.101Z",
      question: [],
      module: {
        id: "e2b6d0d3-4167-49af-b251-f3b491bd3ebf",
        name: "Ecology"
      }
    }
  ];
  