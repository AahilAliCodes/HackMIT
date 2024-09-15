import React, { useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { styled } from 'styled-components';
import MAP from '../../assets/map.png'
import EXPLORE from '../../assets/explorejobs.png'
import STAR from '../../assets/Vector.png'

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #e9f2fb;
  flex: 1;
  font-family: 'Manrope';
  background-image: url(${MAP});
  background-repeat: no-repeat;
  background-position: center;
  color: #3B3D6A;
  overflow-y: hidden;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  padding: 80px;
  width: calc(70% - 160px);
  justify-content: center;
  overflow-y: scroll;
`;

const Right = styled.div`
  height: calc(100% - 80px);
  padding: 40px;
  flex: 1;
  background-color: white;
`;

const JobTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AttributesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 1rem;
  column-gap: 30px;

  div {
    border-radius: 5px;
  }
`;

const AttributeTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
`;

const AttributeBar = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const AttributeSquare = styled.div`
  width: 35px;
  height: 20px;
  background-color: ${props => props.filled ? props.color : '#d1d5db'};
`;

const Card = styled.div`
  font-size: 16px;
`;

const GetInsights = styled.button`
  all: unset;
  background-color: #3DA8C9;
  padding: 12px 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  border-radius: 20px;
  width: max-content;
  color: white;

  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`

const Apply = styled.button`
  all: unset;
  border: 1px solid #3DA8C9;
  color: #3DA8C9;
  background-color: white;
  border-radius: 20px;
  padding: 12px 20px;
  margin-right: 20px;

  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #3B3D6A;
  font-family: "Bricolage Grotesque";
`;

const CardContent = styled.p`
  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    font-weight: lighter;
  }
`;

const Detail = styled.span`
  flex: 1;
  text-align: right;
  font-weight: bold;
`

const Divider = styled.div`
  height: 2px;
  background-color: rgba(200,200,200,0.4);
  width: 100%;
  margin: 10px 0px;
`

const InsightItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #9be7d455;
  ${props => props.highlighted && `
    background-color: #e0f2fe;
    border-radius: 0.25rem;
  `}
`;

const ViewButton = styled.button`
  background-color: #3DA8C9;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
`;

const IconHolder = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 100% !important;
  background-color: darkgrey;
  margin-top: -6px;
  margin-right: 5px;
`

// Don't ask why I named it this way I'm tired.
const MiniFridge = styled.div` 
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: none;
`

const JobCard = styled.div`
  display: flex;
  flex-direction: row;

  img {
    width: 50px;
    margin-right: 20px;
  }

  span {
    font-size: 12px;
  }
`

const JobTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const JobViewButton = styled.button`
  all: unset;
  font-weight: bold;
  flex: 1;
  text-align: right;
  color: #3DA8C9;
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`

const JOB_DATA = [
  {
    "uniqueID": "1234",
    "CompanyName": "Convex",
    "JobTitle": "Software Engineer",
    "JobDescription": "Convex is transforming the way developers build applications. Our mission is to fundamentally change how software is built on the Internet by empowering developers to create fast, reliable, and dynamic apps without the headaches of complex backend engineering or the hassles of database administration. We provide a cutting-edge, full-stack developer platform that seamlessly combines a powerful custom database with an integrated execution environment.",
    "ImgLink": "https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/328383/convex-logo-2048.png",
    "Location": "San Francisco, California",
    "Company Size": "10-50",
    "Type": "Full-time",
    "Salary": "160,000 - 225,000",
    "RequiredExpereince": "Bachelors, Masters, or PhD in Computer Science (or related technical field) with a minimum of 2+ years of relevant experience with backend, systems, product, or full-stack engineering"
  },
  {
    "uniqueID": "5678",
    "CompanyName": "Fetch.AI",
    "JobTitle": "Software Engineer Intern",
    "JobDescription": "Fetch.ai is building an open access, tokenized, decentralized machine learning network to enable smart infrastructure built around a decentralized digital economy. Join us to work on fascinating and promising new technology together with top class software engineers and researchers spanning across multiple fields (multi agent systems, artificial intelligence, machine learning, economics, cryptography and more!). You will collaborate with top academics and corporate partners across the world to further develop our solutions and deploy them in real life scenarios.",
    "ImgLink": "https://cdn.theorg.com/c5c60037-94a4-4a96-b1d2-a7ca88e11503_medium.jpg",
    "Location": "Cambridge, UK",
    "Company Size": "50-100",
    "Type": "Internship",
    "Salary": "160,000 - 225,000",
    "RequiredExpereince": "Bachelor's degree in Computer Science, Engineering, or a related field (or equivalent experience). 3-4 years of experience as a Frontend Developer or similar role. Proficiency in HTML, CSS, and JavaScript. Strong experience with React & Next JS framework. Knowledge of React and common tools used in the wider React ecosystem, such as Node.js, NPM, Babel, Webpack, Frontend Libraries, Tailwind, and Material UI. Knowledge of UI/UX principles and best practices. Understanding of version control systems (Git, SVN, etc.). Strong problem-solving skills and attention to detail. Excellent communication and teamwork skills."
  },
  {
    "uniqueID": "9101",
    "CompanyName": "Tune.hq",
    "JobTitle": "Machine Learning Engineer",
    "JobDescription": "At Tune AI, we're building the generative AI stack for enterprises and developers powered by open source models. Our vision is to become the AI infrastructure of the internet, and those who power the world. We're backed by Accel, Flipkart, Together Fund, Speciale Invest, Techstars, and other top-tier VCs. As part of our work life, we work in office 5 days of the week from 11am to 7pm. We also have frequent team outings to bring everyone a little closer. Our pantry remains stocked up with your favourite snacks and we have an automated coffee machine that makes you brilliant cappuccinos as well as espresso shots when you need the jolt. Our office has dedicated in-house staff that can whip up food instantly for you so you can focus on what you do best. The best part? The beach is 500 meters away from our office so meetings at dusk can happen with sand between your toes.",
    "ImgLink": "https://framerusercontent.com/images/P3ibw3xcMF3puvmNOGPVnc7wL18.png",
    "Location": "Chennai, india",
    "Company Size": "10-50",
    "Type": "Full-Time",
    "Salary": "125,000 - 175,000",
    "RequiredExpereince": "4-6 years of experience in machine learning, data science, or MLOps Strong understanding of large-language models and Retrieval Augmented Generation (RAG) Proficient in Python, FastAPI, SQLAlchemy, Docker, PyTorch, Transformers, and GitHub Good to have: Go, Kubernetes, Cloud (GCP, AWS, Azure) Fluent with Linux"
  },
  {
    "uniqueID": "1121",
    "CompanyName": "Citadel",
    "JobTitle": "Software Engineer 2025 University Graduate (US)",
    "JobDescription": "At Citadel, our engineers work in small teams to turn the best ideas into high-performing and resilient technology. With short development cycles, work rapidly goes into production. As an engineer, you can create systems architectures, develop platforms and build web frameworks. You’ll have access to state-of-the-art tools and apply innovative techniques including distributed computing, natural language processing, machine learning and more.",
    "ImgLink": "https://upload.wikimedia.org/wikipedia/commons/6/66/Citadel_Securities_logo.jpg",
    "Location": "New York, Miami",
    "Company Size": "1000-5000",
    "Type": "Full-Time",
    "Salary": "160,000 - 225,000",
    "RequiredExpereince": "Bachelor's degree in Computer Science, Engineering, or a related field (or equivalent experience). 3-4 years of experience as a Frontend Developer or similar role. Proficiency in HTML, CSS, and JavaScript. Strong experience with React & Next JS framework. Knowledge of React and common tools used in the wider React ecosystem, such as Node.js, NPM, Babel, Webpack, Frontend Libraries, Tailwind, and Material UI. Knowledge of UI/UX principles and best practices. Understanding of version control systems (Git, SVN, etc.). Strong problem-solving skills and attention to detail. Excellent communication and teamwork skills."
  },
  {
    "uniqueID": "3141",
    "CompanyName": "Jane Street",
    "JobTitle": "Software Engineer Internship, May-August",
    "JobDescription": "Our goal is to give you a real sense of what it’s like to work at Jane Street full time. Over the course of your internship, you will explore ways to approach and solve exciting problems within your field of interest through fun and challenging classes, interactive sessions, and group discussions — and then you will have the chance to put those lessons to practical use. As an intern, you are paired with full-time employees who act as mentors, collaborating with you on real-world projects we actually need done. When you’re not working on your project, you will have plenty of time to use our office amenities, physical and virtual educational resources, attend guest speakers and social events, and engage with the parts of our work that excite you the most. If you’ve never thought about a career in finance, you’re in good company. Many of us were in the same position before working here. If you have a curious mind, a collaborative spirit, and a passion for solving interesting problems, we have a feeling you’ll fit right in.",
    "ImgLink": "https://www.careers.cam.ac.uk/sites/www.careers.cam.ac.uk/files/media/jane_street_square.png",
    "Location": "New York, NY",
    "Company Size": "500-1000",
    "Type": "Internship",
    "Salary": "160,000 - 225,000",
    "RequiredExpereince": "Bachelor's degree in Computer Science, Engineering, or a related field (or equivalent experience). 3-4 years of experience as a Frontend Developer or similar role. Proficiency in HTML, CSS, and JavaScript. Strong experience with React & Next JS framework. Knowledge of React and common tools used in the wider React ecosystem, such as Node.js, NPM, Babel, Webpack, Frontend Libraries, Tailwind, and Material UI. Knowledge of UI/UX principles and best practices. Understanding of version control systems (Git, SVN, etc.). Strong problem-solving skills and attention to detail. Excellent communication and teamwork skills."
  },
  {
    "uniqueID": "3221",
    "CompanyName": "Hudson River Trading",
    "JobTitle": "Software Engineering Internship Summer 2025",
    "JobDescription": "HRT is seeking highly motivated full-time students for our software engineering summer internship program. We are looking for smart programmers who love to code, love to learn, and who can thrive in an entrepreneurial environment. At HRT, our engineers create and maintain critical technology and infrastructure that is integral to the success of our trading.",
    "ImgLink": "https://s3-us-west-1.amazonaws.com/upload.comparably.com/130368/companies/130368/logo_1665498580795.jpg",
    "Location": "New York, NY",
    "Company Size": "500-1000",
    "Type": "Internship",
    "Salary": "160,000 - 225,000",
    "RequiredExpereince": "Bachelor's degree in Computer Science, Engineering, or a related field (or equivalent experience). 3-4 years of experience as a Frontend Developer or similar role. Proficiency in HTML, CSS, and JavaScript. Strong experience with React & Next JS framework. Knowledge of React and common tools used in the wider React ecosystem, such as Node.js, NPM, Babel, Webpack, Frontend Libraries, Tailwind, and Material UI. Knowledge of UI/UX principles and best practices. Understanding of version control systems (Git, SVN, etc.). Strong problem-solving skills and attention to detail. Excellent communication and teamwork skills."
  },
  {
    "uniqueID": "4521",
    "CompanyName": "Modal",
    "JobTitle": "Software Engineer - Product (Frontend)",
    "JobDescription": "At Modal, we build foundational technology, including an optimized container runtime, a GPU-aware scheduler, and a distributed file system. We're a small team based out of New York and Stockholm and have raised over $23M. Our team includes creators of popular open-source projects (e.g., Seaborn, Luigi), academic researchers, international olympiad medalists, and experienced engineering.",
    "ImgLink": "https://i.pinimg.com/736x/73/db/87/73db87bedbdaf64f2f820c3ad5430d58.jpg",
    "Location": "San Fransisco, CA",
    "Company Size": "10-50",
    "Type": "Full-Time",
    "Salary": "160,000 - 225,000",
    "RequiredExpereince": "Bachelor's degree in Computer Science, Engineering, or a related field (or equivalent experience). 3-4 years of experience as a Frontend Developer or similar role. Proficiency in HTML, CSS, and JavaScript. Strong experience with React & Next JS framework. Knowledge of React and common tools used in the wider React ecosystem, such as Node.js, NPM, Babel, Webpack, Frontend Libraries, Tailwind, and Material UI. Knowledge of UI/UX principles and best practices. Understanding of version control systems (Git, SVN, etc.). Strong problem-solving skills and attention to detail. Excellent communication and teamwork skills."
  }
];

function UserDashboard() {
  const initial = 1;
  const [percentage, setPercentage] = useState(initial);
  const [jobSelected, setJob] = useState(false);
  const [insights, getInsights] = useState(false);


  function NewJobCard(job) {
    return <JobCard key={job.uniqueID}>
      <img src={job.ImgLink}/>
      <JobTextContainer>{job.JobTitle}<br/><span>{job.CompanyName}</span></JobTextContainer>
      <JobViewButton onClick={() => {selectJob(job.uniqueID)}}>View</JobViewButton>
    </JobCard>
  }

  function GetJobs() {
    const jobs = [];
    
    for (let i = 0; i < JOB_DATA.length; i++) {
      jobs.push(NewJobCard(JOB_DATA[i]));
    }
  
    return jobs;
  }

  function selectJob(job) {
    getInsights(false);
    setJob(job);
  }

  useEffect(() => {
    if (insights) {
      setTimeout(() => {
        setPercentage(90);
      }, 1000);
    }
  }, [insights]);

  const renderAttributeBar = (color, filledCount) => (
    <AttributeBar>
      {[...Array(5)].map((_, i) => (
        <AttributeSquare key={i} filled={i < filledCount} color={color} />
      ))}
    </AttributeBar>
  );


  const leftYesJob = <Left>
  <StatsContainer>
    <div style={{transform: 'rotate(216deg)', width: '250px', height: '250px' }}>
      <CircularProgressbarWithChildren
          strokeWidth={12}
          circleRatio={0.8}
          value={percentage}
          styles={buildStyles({
            textSize: '16px',
            pathColor: `#3DA8C9`, // Customize the color
            textColor: '#3B3D6A', // Customize the text color
            trailColor: '#d6d6d6', // Customize the trail (background) color
          })}
        >
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transform: 'rotate(144deg)'}}>
            <div style={{ fontSize: '18px', marginTop: '-20px' }}>
              Top
            </div>
            
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3DA8C9'}}>
              {`${(percentage !== initial) ? String(100-percentage) + '%' : "?"}`}
            </div>

            <div style={{ fontSize: '18px', marginTop: '1px' }}>
              of Applicants
            </div>
          </div>
      </CircularProgressbarWithChildren>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', marginLeft: '30px'}}>
      <span style={{fontWeight: 400}}>.</span>
      <JobTitle><div style={{marginBottom: '-5px', color: '#3DA8C9'}}>SENIOR SOFTWARE ENGINEER</div><span style={{fontSize: '18px', fontWeight: 500}}>@ FutureTech Solutions</span></JobTitle>
      <AttributesContainer>
        <MiniFridge>
          <IconHolder/>
          <div>
            {renderAttributeBar('#3DA8C9', 5)}
            <AttributeTitle>GPA</AttributeTitle>
          </div>
        </MiniFridge>
        <MiniFridge>
          <IconHolder/>
          <div>
            {renderAttributeBar('#3DA8C9', 3)}
            <AttributeTitle>Experience</AttributeTitle>
          </div>
        </MiniFridge>
        <MiniFridge>
          <IconHolder/>
          <div>
            {renderAttributeBar('#3DA8C9', 4)}
            <AttributeTitle>Open source contributions</AttributeTitle>
          </div>
        </MiniFridge>
        <MiniFridge>
          <IconHolder/>
          <div>
            {renderAttributeBar('#3DA8C9', 2)}
            <AttributeTitle>Coding languages</AttributeTitle>
          </div>
        </MiniFridge>
      </AttributesContainer>
    </div>
  </StatsContainer>
  <Card>
    <CardTitle>PROFILE SUMMARY</CardTitle>
    <CardContent>
      Yasir White is a promising candidate with diverse technical expertise and a solid academic background, aiming to complete an Associate's degree in Computer Science and Engineering by May 2025, with a commendable GPA of 3.82. He brings hands-on experience in software development, especially artificial intelligence, having optimized PyTorch neural network models and excelled in roles such as AI Research Intern at Lehigh University. Additionally, he has advanced skills in Python, Golang, and React, backed by practical experience creating RESTful APIs and full-stack applications. His GitHub score of 5.9 further highlights his proficiency and dedication to collaborative development, making him a standout candidate for Convex.
    </CardContent>
  </Card>
  <Card>
    <CardTitle>YOUR STRONGEST ATTRIBUTE</CardTitle>
    <CardContent>
      Mentored the 2024 USAD National Champions to victory, Guided students to become strong competitors and individuals, Developed a demo for untrained caretakers at HackHarvard, Contributed to the creation of YayaGuide for Dementia/Alzheimer's support
    </CardContent>
  </Card>
  <Card>
    <CardTitle>INSIGHTS</CardTitle>
    <InsightItem highlight>
    <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
        <img src={STAR}/>
        <span>Create more Github content</span>
      </div>
      <ViewButton>View</ViewButton>
    </InsightItem>
    <InsightItem highlighted>
      <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
        <img src={STAR}/>
        <span>Add more skills</span>
      </div>
      <ViewButton>View</ViewButton>
    </InsightItem>
  </Card>
  </Left>

  const leftNoJob = <Left style={{alignItems: 'center', textAlign: 'center', fontFamily: 'Bricolage Grotesque'}}>
    <img src={EXPLORE}/>
    <span style={{color: '#3DA8C9', fontSize: '32px', fontWeight: 'bold', margin:'10px 0px'}}>Explore Jobs</span><br/>
    Select a job on the right panel
  </Left>

  const rightYesJob = jobSelected !== false ? (
  <Right>
    {JOB_DATA.filter(job => job.uniqueID === jobSelected).map(job => (
      <React.Fragment key={job.uniqueID}>
        <Card>
          <CardTitle>{job.CompanyName}</CardTitle>
          <CardContent>
            {job.JobDescription}
          </CardContent>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Apply>APPLY</Apply>
            <GetInsights onClick={() => {getInsights(true)}}><img src={STAR}/>INSIGHTS</GetInsights>
          </div>
        </Card>
        <div style={{marginTop: '50px'}}></div>
        <CardTitle>Job Details</CardTitle>
        <CardContent style={{fontSize: '14px'}}>
          <Divider/>
          <div>Location: <Detail>{job.Location}</Detail></div>
          <Divider/>
          <div>Company Size: <Detail>{job["Company Size"]}</Detail></div>
          <Divider/>
          <div>Type: <Detail>{job.Type}</Detail></div>
          <Divider/>
          <div>Salary: <Detail>{job.Salary}</Detail></div>
          <Divider/>
          <div>Required Experience: <Detail>{job.RequiredExpereince}</Detail></div>
          <Divider/>
        </CardContent>
      </React.Fragment>
    ))}
  </Right>
) : (
  <Right>
    <Card>
      <CardTitle>No Job Selected</CardTitle>
      <CardContent>
        Please select a job to view details.
      </CardContent>
    </Card>
  </Right>
);

const rightNoJob = <Right style={{display: 'flex', flexDirection: 'column', height: 'calc(100% - 80px)'}}>
<CardTitle>
  Listed Jobs
</CardTitle>
<JobList>
  {GetJobs()}
</JobList>
</Right>

  return (
    <MainContainer>
        {insights ? leftYesJob : leftNoJob}
        {jobSelected ? rightYesJob : rightNoJob}
    </MainContainer>
  );
}

export default UserDashboard;