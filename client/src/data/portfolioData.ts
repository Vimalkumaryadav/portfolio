export const portfolioData = {
  personal: {
    name: "Vimal Kumar Yadav",
    title: "Software Engineer II & QA Automation Expert",
    email: "yadavvimalk@gmail.com",
    phone: "+91 8688928060",
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
        "Designed and developed automated test cases using the WebDriverIO–Node.js framework",
        "Utilized Perforce for version control, ensuring efficient collaboration and code management",
        "Performed regular maintenance and defect fixes for the regression test suite to ensure stability",
        "Leveraged GitHub Copilot to refactor and optimize existing code for improved readability and performance"
      ]
    },
    {
      title: "Software Engineer",
      company: "Wipro Limited",
      period: "Mar 2022 – May 2023",
      location: "Hyderabad, India",
      description: [
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
  { name: "Java", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/java/java-original.svg" },
  { name: "JavaScript", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/javascript/javascript-original.svg" },
  { name: "Node.js", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/nodejs/nodejs-original.svg" }
    ],
    "Testing Frameworks": [
  { name: "Selenium", icon: "img:https://cdn.simpleicons.org/selenium/43B02A" },
  { name: "WebDriverIO", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/webdriverio/webdriverio-original.svg" },
  { name: "Cucumber BDD", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/cucumber/cucumber-plain.svg" },
  { name: "Rest Assured", icon: "img:https://cdn.simpleicons.org/restassured/00A651" }
    ],
    "Tools & Technologies": [
  { name: "Git", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/git/git-original.svg" },
  { name: "Maven", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/apachemaven/apachemaven-original.svg" },
  { name: "Postman", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/postman/postman-original.svg" },
  { name: "JIRA", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/jira/jira-original.svg" },
  { name: "SQL", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/mysql/mysql-original.svg" },
  { name: "Perforce", icon: "img:https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/perforce/perforce-original.svg" },
  { name: "GitHub Copilot", icon: "img:https://skillicons.dev/icons?i=githubcopilot" }
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
