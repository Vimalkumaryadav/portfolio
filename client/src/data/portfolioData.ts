export const portfolioData = {
  personal: {
    name: "Vimal Kumar Yadav",
    title: "Software Engineer II & QA Automation Expert",
    email: "yadavvimalk@gmail.com",
    phone: "+91 9398462973",
    location: "Hyderabad, India",
    linkedin: "https://www.linkedin.com/in/yadavvk/",
    github: "https://github.com/Vimalkumaryadav",
    birthDate: "30 Jan 1996",
    photo: "/portfolio/assets/yadavvimalk.jpg"
  },
  
  about: "QA Automation Engineer with 6+ years of experience in web and API testing using Selenium (Java), WebDriverIO, Cucumber BDD, Postman, and SQL for data validation. Proficient in Maven, Git, Perforce, JIRA, and reporting tools, with a strong record of delivering quality software in Agile/Scrum environments.",
  
  experience: [
    {
      title: "Software Engineer II",
      company: "Electronic Arts",
      period: "Nov 2023 – Present",
      location: "",
      description: [
        "Design and implementation of a robust WebDriverIO + Mocha automation framework, which improved our regression testing efficiency by 50%",
        "Utilized Perforce for version control, ensuring efficient collaboration and code management",
        "Maintained a high-reliability regression suite with zero missed high-priority bugs across 3 consecutive releases",
        "Leveraged GitHub Copilot to refactor and optimize existing code for improved readability and performance"
      ]
    },
    {
      title: "Software Engineer",
      company: "Wipro Limited",
      period: "Mar 2022 – May 2023",
      location: "Hyderabad, India",
      description: [
        "Automated 20+ critical API scenarios using Java, Selenium, and Rest Assured, significantly reducing manual effort",
        "Performed manual API testing using Postman to validate the quality, reliability, and functionality of RESTful APIs",
        "Developed Early Integration Testing (EIT) scripts to validate API functionality in the early stages of development",
        "Created and executed System Integration Testing (SIT) scripts to verify end-to-end API functionality",
        "Uploaded test results and documentation to PractiTest, ensuring stakeholders had timely access to testing progress"
      ]
    },
    {
      title: "QA Engineer",
      company: "Tecra System Pvt Ltd",
      period: "Oct 2018 – Jan 2022",
      location: "Hyderabad, India",
      description: [
        "Designed, developed, and maintained Web UI automation scripts using Selenium (Java), Cucumber BDD, Maven, and Git",
        "Performed browser compatibility testing and result analysis with Extent Reports",
        "Ensured timely resolution of critical/high-priority defects before UAT and maintained clear reporting through JIRA",
        "Collaborated closely with the client's Scrum team, actively participating in sprint ceremonies"
      ]
    }
  ],
  
  skills: {
    "Programming Languages": [
  { name: "Java", icon: "img:https://unpkg.com/devicon@2.15.1/icons/java/java-original.svg" },
  { name: "JavaScript", icon: "img:https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" },
  { name: "Node.js", icon: "img:https://unpkg.com/devicon@2.15.1/icons/nodejs/nodejs-original.svg" }
    ],
    "Testing Frameworks": [
  { name: "Selenium", icon: "img:https://cdn.simpleicons.org/selenium/43B02A" },
  { name: "WebDriverIO", icon: "img:https://webdriver.io/assets/images/robot-3677788dd63849c56aa5cb3f332b12d5.svg" },
  { name: "Cucumber BDD", icon: "img:https://unpkg.com/devicon@2.15.1/icons/cucumber/cucumber-plain.svg" },
  { name: "Rest Assured", icon: "img:https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9p86tphgBGlkJRaX3koyuQ.jpeg" }
    ],
    "Tools & Technologies": [
  { name: "Git", icon: "img:https://unpkg.com/devicon@2.15.1/icons/git/git-original.svg" },
  { name: "Maven", icon: "img:https://icons-for-free.com/iff/png/256/vscode+icons+type+maven-1324451386617447973.png" },
  { name: "Postman", icon: "img:https://w7.pngwing.com/pngs/28/245/png-transparent-postman-hd-logo-thumbnail.png" },
  { name: "JIRA", icon: "img:https://unpkg.com/devicon@2.15.1/icons/jira/jira-original.svg" },
  { name: "SQL", icon: "img:https://unpkg.com/devicon@2.15.1/icons/mysql/mysql-original.svg" },
  { name: "Perforce", icon: "img:https://cdn.brandfetch.io/idGOeHdms6/theme/dark/logo.svg" },
  { name: "GitHub Copilot", icon: "img:https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-copilot-icon.png" }
    ]
  },
  
  education: {
    degree: "Bachelor of Technology",
    field: "Electronics and Communication Engineering (ECE)",
    institution: "H.I.T.A.M, Hyderabad, India",
    period: "June 2014 – August 2018"
  },
  
  languages: ["Hindi", "English", "Telugu"]
  ,
  // LinkedIn recommendations shown on the site. These are optionally
  // augmented at runtime from /portfolio/assets/recommendations.json.
  // Each item shape:
  // {
  //   name: string,
  //   role: string,            // e.g., "Manager at Company"
  //   relationship: string,    // e.g., "Managed me directly"
  //   text: string,            // the recommendation text
  //   date: string,            // e.g., "Aug 2024"
  //   linkedinUrl: string,     // direct link to the recommendation or profile
  //   avatar?: string          // optional image URL
  // }
  recommendations: [
    // Add any existing recommendation entries here. You can also manage them
    // via client/public/assets/recommendations.json without rebuilding.
  ]
};
