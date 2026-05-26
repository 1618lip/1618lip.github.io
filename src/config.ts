export const siteConfig = {
  name: "Philip Pincencia",
  title: "Computer Engineering & Mathematics @ UCSD",
  description: "Portfolio website of Philip Pincencia.",
  accentColor: "#1d4ed8",
  social: {
    email: "ppincencia@ucsd.edu",
    linkedin: "https://linkedin.com/in/1618lip",
    twitter: "https://x.com/ppincencia",
    github: "https://github.com/1618lip",
  },
  aboutMe:
    "I am a Computer Engineering & Math student at UC San Diego interested in DSP, systems programming, embedded software, optimization, and machine learning. I enjoy building projects that connect math with computing.",
  skills: [
    "C",
    "C++",
    "Python",
    "MATLAB",
    "PyTorch",
    "SystemVerilog",
    "React",
    "Next.js",
    "Linux",
    "Docker",
    "Vivado",
    "Git",
  ],
  projects: [
    {
      name: "Embedded IIR Sensor Filtering System",
      description:
        "Implemented a real-time IIR filtering pipeline on Arduino using MPU6050 sensor data, reducing noise through exponential moving average filtering and validating results with MATLAB analysis.",
      link: "https://github.com/ppincencia",
      skills: ["C", "MATLAB", "Arduino", "I2C", "Signal Processing"],
    },
    {
      name: "Audio Classification Pipeline",
      description:
        "Developed an audio ML pipeline using spectrograms, MFCCs, mel features, and CNN-based models to classify music/audio samples with high test accuracy.",
      link: "https://github.com/ppincencia",
      skills: ["Python", "PyTorch", "Librosa", "DSP", "Machine Learning"],
    },
    {
      name: "Multithreaded Networking Simulator",
      description:
        "Built a C++ client-server messaging simulator with non-blocking communication, destination routing, logging, and support for indefinite interactive client-to-client messaging.",
      link: "https://github.com/ppincencia",
      skills: ["C++", "Networking", "Multithreading", "TCP/IP"],
    },
  ],
  experience: [
    {
      company: "Qualcomm",
      title: "Incoming PCIe Intern",
      dateRange: "June 2026 - Sep 2026",
      bullets: [
        "Working on PCIe Endpoints using QEMU & OS knowledge."
      ],
    },
    {
      company: "Ansys, part of Synopsys",
      title: "Software Developer Intern",
      dateRange: "Sep 2025 - Dec 2025",
      bullets: [
        "Optimized and debugged C# tooling workflows to improve engineering productivity and reduce CI/debug iteration time.",
        "Built automation-focused improvements across development and testing processes using IDE, debugger, profiler, and Unix-based tooling.",
        "Collaborated with engineering teams to improve software reliability, maintainability, and developer feedback loops.",
      ],
    },
    {
      company: "huMannity Medtec",
      title: "Software Engineer Intern",
      dateRange: "Jun 2025 - Aug 2025",
      bullets: [
        "Built a modular biosignal processing pipeline with structured configuration and validation using Python and Pydantic.",
        "Performed feature engineering and parameter optimization on patient biosignals, improving robustness and accuracy by roughly 10%.",
        "Integrated prompt orchestration, JSON-structured outputs, and detailed logging for reproducible biomedical data workflows.",
      ],
    },
    {
      company: "UC San Diego Jacobs School of Engineering",
      title: "Undergraduate Researcher",
      dateRange: "Jun 2024 - Aug 2024",
      bullets: [
        "Implemented a Variable Order Markov Model using a multiway trie in Python to analyze melodic complexity in music.",
        "Processed chord changes using C++ and Regex to improve analysis efficiency across symbolic music datasets.",
        "Presented research at the Summer Research Conference after receiving TRELS Scholarship funding.",
      ],
    },
  ],
  education: [
    {
      school: "University of California, San Diego",
      degree: "B.S. Computer Engineering, B.S. Mathematics",
      dateRange: "Expected 2026",
    },
  ],
    education: [
    {
      school: "University of California, San Diego",
      degree: "B.S. Computer Engineering, B.S. Mathematics",
      dateRange: "Expected 2026",
      achievements: [
        "Coursework in signal processing, operating systems, digital design, algorithms, probability, and abstract algebra.",
        "IEEE Signal Processing Chair.",
        "Ben Sumner Memorial Scholarship recipient.",
      ],
    },
  ],

  courses: {
    ece: [
      "ECE 35: Introduction to Analog Design",
      "ECE 45: Circuits and Systems",
      "ECE 65: Components and Circuits Laboratory",
      "ECE 101: Linear Systems Fundamentals",
      "ECE 109: Engineering Probability and Statistics",
      "ECE 111: Advanced Digital Design",
      "ECE 161A: Introduction to Digital Signal Processing",
    ],
    cse: [
      "CSE 8A: Introduction to Programming",
      "CSE 11: Introduction to Programming and Computational Problem Solving",
      "CSE 12: Basic Data Structures and Object-Oriented Design",
      "CSE 30: Computer Organization and Systems Programming",
      "CSE 100: Advanced Data Structures",
      "CSE 101: Design and Analysis of Algorithms",
      "CSE 120: Principles of Computer Operating Systems",
    ],
    math: [
      "MATH 18: Linear Algebra",
      "MATH 20B: Calculus for Science and Engineering II",
      "MATH 20C: Calculus and Analytic Geometry",
      "MATH 20D: Introduction to Differential Equations",
      "MATH 20E: Vector Calculus",
      "MATH 100A: Abstract Algebra I",
      "MATH 100B: Abstract Algebra II",
      "MATH 140A: Foundations of Real Analysis I",
      "MATH 140B: Foundations of Real Analysis II",
    ],
  },
};
