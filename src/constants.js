// Skills Section Logo's
import htmlLogo from "./assets/tech_logo/html.png";
import cssLogo from "./assets/tech_logo/css.png";
import sassLogo from "./assets/tech_logo/sass.png";
import javascriptLogo from "./assets/tech_logo/javascript.png";
import reactjsLogo from "./assets/tech_logo/reactjs.png";
import angularLogo from "./assets/tech_logo/angular.png";
import reduxLogo from "./assets/tech_logo/redux.png";
import nextjsLogo from "./assets/tech_logo/nextjs.png";
import tailwindcssLogo from "./assets/tech_logo/tailwindcss.png";
import gsapLogo from "./assets/tech_logo/gsap.png";
import materialuiLogo from "./assets/tech_logo/materialui.png";
import bootstrapLogo from "./assets/tech_logo/bootstrap.png";
import springbootLogo from "./assets/tech_logo/springboot.png";
import nodejsLogo from "./assets/tech_logo/nodejs.png";
import expressjsLogo from "./assets/tech_logo/express.png";
import mysqlLogo from "./assets/tech_logo/mysql.png";
import mongodbLogo from "./assets/tech_logo/mongodb.png";
import firebaseLogo from "./assets/tech_logo/firebase.png";
import cLogo from "./assets/tech_logo/c.png";
import cppLogo from "./assets/tech_logo/cpp.png";
import javaLogo from "./assets/tech_logo/java.png";
import pythonLogo from "./assets/tech_logo/python.png";
import typescriptLogo from "./assets/tech_logo/typescript.png";
import gitLogo from "./assets/tech_logo/git.png";
import githubLogo from "./assets/tech_logo/github.png";
import vscodeLogo from "./assets/tech_logo/vscode.png";
import postmanLogo from "./assets/tech_logo/postman.png";
import mcLogo from "./assets/tech_logo/mc.png";
import figmaLogo from "./assets/tech_logo/figma.png";
import netlifyLogo from "./assets/tech_logo/netlify.png";
import vercelLogo from "./assets/tech_logo/vercel.png";
import postgreLogo from "./assets/tech_logo/postgre.png";
import csharpLogo from "./assets/tech_logo/csharp.png";
import dsa from "./assets/tech_logo/dsa.jpg";
import ml from "./assets/tech_logo/image.png";
import docker from "./assets/tech_logo/docker.png";
import ms from "./assets/tech_logo/ms.png";

// Experience Section Logo's
import webverseLogo from "./assets/company_logo/image.png";
import agcLogo from "./assets/company_logo/agc_logo.png";
import newtonschoolLogo from "./assets/company_logo/newtonschool_logo.png";

// Education Section Logo's
import glaLogo from "./assets/education_logo/image.png";
import bsaLogo from "./assets/education_logo/logo.png";
import vpsLogo from "./assets/education_logo/vit.png";

// Project Section Logo's
import githubdetLogo from "./assets/work_logo/FinMate.jpg";
import csprepLogo from "./assets/work_logo/image.png";
import Movie from "./assets/work_logo/movie.png";
import movierecLogo from "./assets/work_logo/movie_rec.png";
import taskremLogo from "./assets/work_logo/task_rem.png";
import npmLogo from "./assets/work_logo/npm.png";
import webverLogo from "./assets/work_logo/web_dig.png";
import cmLogo from "./assets/work_logo/cm.png";
import imagesearchLogo from "./assets/work_logo/image_search.png";
import removebgLogo from "./assets/work_logo/remove_bg.png";
import { MdSafetyDivider } from "react-icons/md";

export const SkillsInfo = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", logo: htmlLogo },
      { name: "CSS", logo: cssLogo },

      { name: "JavaScript", logo: javascriptLogo },
      { name: "React JS", logo: reactjsLogo },
      { name: "Tailwind CSS", logo: tailwindcssLogo },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node JS", logo: nodejsLogo },
      { name: "Express JS", logo: expressjsLogo },
      { name: "MySQL", logo: mysqlLogo },
      { name: "MongoDB", logo: mongodbLogo },
      { name: "SpringBoot", logo: springbootLogo },
    ],
  },
  {
    title: "Languages",
    skills: [
      { name: "C", logo: cLogo },

      { name: "Java", logo: javaLogo },
      { name: "Python", logo: pythonLogo },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", logo: gitLogo },
      { name: "GitHub", logo: githubLogo },
      { name: "VS Code", logo: vscodeLogo },
      { name: "Postman", logo: postmanLogo },
      { name: "docker", logo: docker },
      { name: "Vercel", logo: vercelLogo },
      { name: "Netlify", logo: netlifyLogo },
    ],
  },
  {
    title: "Others",
    skills: [
      { name: "Machine Learning", logo: ml },
      { name: "DSA", logo: dsa },
    ],
  },
];

export const experiences = [
  {
    id: 0,
    img: webverseLogo,
    role: "Frontend Developer",
    company: "GOOGLE developers Club(VIT AP) ",
    date: "April 2024 - 2025",
    desc: "Developed dynamic and scalable web applications using the REACT, handling both frontend development for the club website.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React JS",
      "Node JS",
      "Tailwind CSS",
      "MongoDb",
    ],
  },
];

export const education = [
  {
    id: 2,
    img: vpsLogo,
    school: "VIT-AP, Amaravathi",
    date: "August 2023 - March 2027(onGoing)",
    grade: "9.15",
    desc: "I am currently pursuing my Bachelor of Technology (B.Tech) in Computer Science and Engineering (CSE) from VIT AP. Throughout my studies, I have been actively exploring key areas such as Data Structures and Algorithms (DSA), MERN stack development, and Machine Learning (ML). This ongoing learning journey is helping me build a strong foundation in software development and intelligent systems. I am passionate about applying these skills to real-world projects, enhancing both my technical knowledge and problem-solving abilities.",
    degree: "Batchelor of technology-Computer Science",
  },
  {
    id: 1,
    img: bsaLogo,
    school: "Sasi junior collage,Vishakapatnam",
    date: "June 2021 - May 2023",
    grade: "98%",
    desc: "I completed my class 12 education from Sasi Junior Collage, Vishakapatnam, under the State board, where I studied Physics, Chemistry, and Mathematics (MPC) .",
    degree: "APSCHE",
  },
  {
    id: 0,
    img: glaLogo,
    school: "Suresh High School,Parvathipuram",
    date: "june 2010 - March 2021",
    grade: "598 Marks",
    desc: "I completed my Class 10 education from Suresh School, located in Parvathipuram, under the [Board Name, e.g., State Board/CBSE/ICSE]. My curriculum included core subjects such as Mathematics, Science, Social Studies, English, and a second language",

    degree: "Andhra Pradesh State Board",
  },
];

export const projects = [
  {
    id: 0,
    title: "FinMate(Finance Tracker)",
    description:
      "Built a full-stack(java backend) finance tracker for students to manage income, expenses, and budgets. Features include JWT auth, encrypted passwords, interactive dashboards (Recharts), recurring transactions, and dynamic filtering. Stack: React.js, Tailwind CSS, Express.js, MongoDB Atlas.",
    image: githubdetLogo,
    tags: ["HTML", "CSS", "JavaScript", "React JS", "SpringBoot", "MongoDb"],
    github: "https://github.com/Lokesh-04-code/FinMate_java",
    webapp: "https://studysave.netlify.app/",
  },
  {
    id: 3,
    title: "Microservices Architecture (Spring Boot)",
    description:
      "Developed a microservices-based backend system using Spring Boot and Docker. Implemented three independent services (Company, Job, Review) registered with Eureka Server for service discovery. Each service uses its own PostgreSQL database. Built RESTful APIs with full CRUD operations and containerized the entire system using Docker Compose.",
    image: ms, // add your image import
    tags: [
      "Java",
      "Spring Boot",
      "Microservices",
      "Eureka",
      "Docker",
      "PostgreSQL",
      "REST API",
    ],
    github: "https://github.com/Lokesh-04-code/microservices-project",
    webapp: "", // optional (leave empty if no frontend)
  },
  {
    id: 1,
    title: "Hospital Management",
    description:
      "MERN stack project enabling hospitals to manage doctor-patient appointments efficiently. Prevents slot clashes with real-time validation. Admins can add doctors and manage their availability. Clean UI for patients to book slots and doctors to view schedules.",
    image: csprepLogo,
    tags: [
      "React JS",
      "Node.js",
      "MongoDB",
      "Express",
      "HTML",
      "CSS",
      "JavaScript",
      "tailwind css",
    ],
    github: "https://github.com/Lokesh-04-code/HealtCare_appointment_booking",
    webapp: "https://safeslot.netlify.app/",
  },
  {
    id: 2,
    title: "Movie Recommends",
    description:
      "Note:wait for 2 to 3 minutes after website opens(ml model loading) .The Movie Recommendation Website helps users discover new films similar to the ones they already enjoy. By entering the name of a movie, the system suggests 5 related movies based on the storyline, director, or title. With a clean interface and smart recommendations, it makes finding your next favorite movie quick and easy.(only Hollywood)",
    image: Movie,
    tags: ["machine Learning"],
    github: "https://github.com/Lokesh-04-code/movie_recommendation",
    webapp: "https://finddmovie.netlify.app/",
  },
];
