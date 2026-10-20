/*
 * EDIT THIS FILE ONLY.
 * Change the text inside the quotes; add or remove whole entries in the arrays.
 * Empty fields (email, cv, linkedin, ...) are hidden automatically.
 * In news text, wrap words in **double asterisks** to make them bold.
 */
window.PROFILE = {
  name: "Thinh Nguyen-Cong",
  shortName: "thinh",
  pageTitle: "Thinh Nguyen-Cong",
  description:
    "Thinh Nguyen-Cong is a PhD student in Computer Science at Virginia Commonwealth University working on quantum optimization: quantum annealing, Ising/QUBO formulations and learning-augmented combinatorial optimization.",
  position: "PhD Student in Computer Science · Quantum Optimization",
  affiliation: "Virginia Commonwealth University",
  location: "Richmond, VA",
  timezone: "America/New_York",
  status: "Open to collaborations",
  bio:
    "I work on quantum optimization: how to cast hard combinatorial problems as Ising and QUBO Hamiltonians, and how to solve them well on quantum annealers and on classical hardware at scale. My research spans hardware-aware quantum annealing, spectral and learning-based methods for large-scale Ising optimization, and machine learning on graphs for combinatorial problems. Before my PhD I studied Mathematics and Informatics at Hanoi University of Science and Technology, worked on graph learning at HySonLab, and led the R&D department of a Vietnamese fintech company, building AI systems for finance.",
  photo: "assets/profile.jpg",
  photoLabel: "|thinh⟩.jpg",
  email: "nguyencongt@vcu.edu",
  github: "https://github.com/hydrogen1999",
  orcid: "https://orcid.org/0009-0008-0525-0101",
  linkedin: "https://www.linkedin.com/in/thinhnguyencongphd",
  scholar: "", // Google Scholar URL, optional
  cv: "", // e.g. "assets/cv.pdf" after adding the file to site/assets/

  interests: [
    {
      title: "Quantum annealing",
      text: "Hardware-aware compilation and parameter setting for annealers, from logical Ising models to physical qubits.",
    },
    {
      title: "Ising & QUBO optimization",
      text: "Formulations and scalable solvers for large-scale Ising ground-state and constrained QUBO problems.",
    },
    {
      title: "Learning for optimization",
      text: "Graph neural networks and generative models that guide combinatorial and quantum solvers.",
    },
  ],

  news: [
    {
      date: "2026.09",
      text: "**Differentiable Spectral Normalization for Large-Scale Ising Optimization** published at IJCAI 2026.",
      url: "https://doi.org/10.24963/ijcai.2026/258",
    },
    {
      date: "2026.08",
      text: "Presented DSN at **IJCAI 2026** (talk + poster), supported by a VCU Department of Computer Science travel award.",
    },
    {
      date: "2026.01",
      text: "Started my PhD in Computer Science at Virginia Commonwealth University.",
    },
    {
      date: "2024.09",
      text: "Joined **HySonLab** (University of Alabama at Birmingham) as a remote researcher.",
    },
    {
      date: "2024.06",
      text: "Completed my M.Sc. in Mathematics and Informatics at Hanoi University of Science and Technology.",
    },
    {
      date: "2023.07",
      text: "Seminar talk **Blockchain and Federated Learning** at the Faculty of Mathematics and Informatics, HUST.",
      url: "https://fami.hust.edu.vn/lich-seminar/blockchain-and-federated-learning/",
    },
    {
      date: "2022.05",
      text: "Seminar talk **Consensus Mechanism and the Classification of Blockchain Networks** at the Faculty of Mathematics and Informatics, HUST.",
      url: "https://fami.hust.edu.vn/lich-seminar/consensus-mechanism-and-the-classification-of-blockchain-networks/",
    },
  ],

  publications: [
    {
      authors: [{ name: "T. Nguyen-Cong", self: true }, { name: "T. N. Dinh", url: "https://thang-dinh.github.io/" }],
      title: "Differentiable Spectral Normalization for Large-Scale Ising Optimization",
      venue: "IJCAI 2026 · pp. 2319–2327",
      links: {
        DOI: "https://doi.org/10.24963/ijcai.2026/258",
        Code: "https://github.com/hydrogen1999/dsn-ising",
      },
      bibtex: `@inproceedings{nguyencong2026dsn,
  title     = {Differentiable Spectral Normalization for Large-Scale Ising Optimization},
  author    = {Nguyen-Cong, Thinh and Dinh, Thang N.},
  booktitle = {Proceedings of the Thirty-Fifth International Joint Conference on Artificial Intelligence, {IJCAI-26}},
  publisher = {International Joint Conferences on Artificial Intelligence Organization},
  pages     = {2319--2327},
  year      = {2026},
  doi       = {10.24963/ijcai.2026/258}
}`,
    },
    {
      authors: [
        { name: "T. Nguyen-Cong", self: true },
        { name: "C. N. Le", url: "https://scholar.google.com/citations?user=U7NA72oAAAAJ&hl=en" },
      ],
      title:
        "Utilizing Layer-2 Blockchain and IPFS Innovations for Establishing a Robust System for Secure Document Signing and Management",
      venue: "JST: Smart Systems and Devices, 34(2), 44–53, 2024",
      links: {
        DOI: "https://doi.org/10.51316/jst.174.ssad.2024.34.2.6",
      },
      bibtex: `@article{nguyencong2024layer2,
  title   = {Utilizing Layer-2 Blockchain and IPFS Innovations for Establishing a Robust System for Secure Document Signing and Management},
  author  = {Nguyen-Cong, Thinh and Le, C. Ngoc},
  journal = {JST: Smart Systems and Devices},
  volume  = {34},
  number  = {2},
  pages   = {44--53},
  year    = {2024},
  doi     = {10.51316/jst.174.ssad.2024.34.2.6}
}`,
    },
    {
      authors: [
        { name: "T. Nguyen-Cong", self: true },
        { name: "C. N. Le", url: "https://scholar.google.com/citations?user=U7NA72oAAAAJ&hl=en" },
      ],
      title: "Utilizing Blockchain Technology for Enhancing Food Traceability",
      venue: "Vietnam Trade and Industry Review, vol. 3, pp. 312–318, 2024",
      links: {},
      bibtex: `@article{nguyencong2024traceability,
  title   = {Utilizing Blockchain Technology for Enhancing Food Traceability},
  author  = {Nguyen-Cong, Thinh and Le, C. Ngoc},
  journal = {Vietnam Trade and Industry Review},
  volume  = {3},
  pages   = {312--318},
  month   = feb,
  year    = {2024},
  issn    = {0866-7756}
}`,
    },
  ],

  education: [
    {
      institution: "Virginia Commonwealth University",
      degree: "Ph.D. in Computer Science",
      date: "2026.01 → now",
      detail: "Quantum optimization",
      people: [{ role: "Advisor", name: "Prof. Thang N. Dinh", url: "https://thang-dinh.github.io/" }],
    },
    {
      institution: "Hanoi University of Science and Technology",
      degree: "M.Sc. in Mathematics and Informatics",
      date: "2022.12 → 2024.06",
      detail: "Thesis: Blockchain technology and its applications in some specific problems",
      people: [
        { role: "Advisor", name: "Prof. Le Chi Ngoc", url: "https://scholar.google.com/citations?user=U7NA72oAAAAJ&hl=en" },
      ],
    },
    {
      institution: "Hanoi University of Science and Technology",
      degree: "B.Sc. in Mathematics and Informatics · Talent Program",
      date: "2017.08 → 2022.04",
      detail: "Thesis: Applying blockchain technology in food traceability",
      people: [
        { role: "Advisor", name: "Prof. Le Chi Ngoc", url: "https://scholar.google.com/citations?user=U7NA72oAAAAJ&hl=en" },
      ],
    },
  ],

  experience: [
    {
      title: "Graduate Assistant",
      institution: "Department of Computer Science, Virginia Commonwealth University",
      date: "2026.01 → now",
    },
    {
      title: "Graduate Researcher (remote)",
      institution: "HySonLab, University of Alabama at Birmingham",
      date: "2024.09 → 2026.04",
      people: [
        {
          role: "PI",
          name: "Prof. Truong-Son Hy",
          url: "https://www.uab.edu/cas/computerscience/people/faculty-directory/faculty/truong-son-hy",
        },
      ],
    },
    {
      title: "Head of R&D · AI Researcher",
      institution: "Grooo International JSC., Hanoi",
      date: "2021.03 → 2025.11",
      detail: "AI research intern (2021) → AI researcher (2021–2023) → head of the R&D department (2023–2025)",
    },
    {
      title: "Undergraduate & Graduate Researcher",
      institution: "Faculty of Mathematics and Informatics, Hanoi University of Science and Technology",
      date: "2020.06 → 2024.07",
      people: [
        { role: "Advisor", name: "Prof. Le Chi Ngoc", url: "https://scholar.google.com/citations?user=U7NA72oAAAAJ&hl=en" },
      ],
    },
    {
      title: "AI Research Intern",
      institution: "iCOMM Media & Tech JSC., Hanoi",
      date: "2019.11 → 2020.03",
    },
  ],

  honors: [
    {
      title: "Departmental Travel Award, IJCAI 2026",
      institution: "Department of Computer Science, Virginia Commonwealth University · oral presentation and poster",
      year: "2026.08",
    },
    {
      title: "Study Encouragement Scholarship",
      institution: "Hanoi University of Science and Technology",
      year: "2021 → 2022",
    },
  ],
};
