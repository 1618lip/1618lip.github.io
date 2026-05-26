export const siteConfig = {
  name: "Philip Pincencia",
  title: "Computer Engineering & Mathematics @ UCSD",
  description: "Portfolio website of Philip Pincencia.",
  accentColor: "#bbfae6",
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

  courses: {
    ece: [
      "ECE 35: Introduction to Analog Design",
      "ECE 45: Circuits and Systems",
      "ECE 65: Components and Circuits Laboratory",
      "ECE 101: Linear Systems Fundamentals",
      "ECE 108: Digital Circuits",
      "ECE 109: Engineering Probability and Statistics",
      "ECE 111: Advanced Digital Design",
      "ECE 158B: Data Networks II",
      "ECE 161A: Introduction to Digital Signal Processing",
      "ECE 251A: Digital Signal Processing",
      "ECE 253: Image Processing",
      "ECE 269: Linear Algebra",
      "ECE 273: Convex Optimization",
    ],
    cse: [
      "CSE 30: Computer Organization and Systems Programming",
      "CSE 100: Advanced Data Structures",
      "CSE 101: Design and Analysis of Algorithms",
      "CSE 120: Operating Systems",
      "CSE 140: Digital Design",
      "CSE 141: Computer Architecture",
      "CSE 153: Machine Learning for Music",
      "CSE 167: Computer Graphics",
    ],
    math: [
      "MATH 20E: Vector Calculus",
      "MATH 100AB: Abstract Algebra I/II (Group & Ring Theory)",
      "MATH 120AB: Complex Analysis I/II",
      "MATH 140AB: Foundations of Real Analysis I/II",
      "MATH 181A: Mathematical Statistics",
      "MATH 187A: Cryptography",
      "MATH 188: Algebraic Combinatorics",
      "MATH 194: Mathematics of Finance",
      "MATH 277A: Quantum Complexity Theory",
      "MATH 285: Stochastic Processes",
    ],
  },
};
