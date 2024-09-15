import React, { useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { styled } from 'styled-components';
import MAP from '../../assets/map.png'
import EXPLORE from '../../assets/explorejobs.png'
import WaveFooter from '../../components/Wave';

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
  ${props => props.highlighted && `
    background-color: #e0f2fe;
    border-radius: 0.25rem;
  `}
`;

const ViewButton = styled.button`
  background-color: #3b82f6;
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

const JOB_DATA = {
  "1234": {
    "Company": "FutureTech Solutions is a leading technology company that specializes in developing innovative software solutions. The company is headquartered in San Francisco, California, and has a strong focus on excellence and perfectionism. FutureTech Solutions offers a dynamic work environment and is committed to fostering talent and creativity.",
    "Title": "Senior Software Engineer",
    "Description": "This is a job. Take it or leave it."
  }
}

function UserDashboard() {
  const initial = 1;
  const [percentage, setPercentage] = useState(initial);
  const [jobSelected, setJob] = useState(false)
  const [insights, getInsights] = useState(false)

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
      Alex Johnson is a highly qualified candidate for the Senior Software Engineer position. With 5 years of experience, a Bachelor's degree, and proficiency in Python, Java, Ruby, and SQL, Alex's profile is well-aligned with the job requirements. Alex's high GPA in the Bachelor's degree program has a positive impact on the overall score, demonstrating a commitment to excellence and attention to detail.
    </CardContent>
  </Card>
  <Card>
    <CardTitle>YOUR STRONGEST ATTRIBUTE</CardTitle>
    <CardContent>
      Alex's GPA of 4.0 is a standout attribute that aligns with FutureTech Solutions' preference for perfectionism. While Alex's experience is valuable, the high GPA compensates for any lack of experience, significantly enhancing the overall score.
    </CardContent>
  </Card>
  <Card>
    <CardTitle>INSIGHTS</CardTitle>
    <InsightItem highlight>
      <span>Create more Github content</span>
      <ViewButton>View</ViewButton>
    </InsightItem>
    <InsightItem highlighted>
      <span>Add more skills</span>
      <ViewButton>View</ViewButton>
    </InsightItem>
  </Card>
</Left>

  const leftNoJob = <Left style={{alignItems: 'center', textAlign: 'center', fontFamily: 'Bricolage Grotesque'}}>
    <img src={EXPLORE}/>
    <span style={{color: '#3DA8C9', fontSize: '32px', fontWeight: 'bold', margin:'10px 0px'}}>Explore Jobs</span><br/>
    Select a job on the right panel
    <WaveFooter/>
  </Left>

  const rightYesJob = <Right>
    <Card>
      <CardTitle>FutureTech Solutions</CardTitle>
      <CardContent>
        FutureTech Solutions is a leading technology company that specializes in developing innovative software solutions. The company is headquartered in San Francisco, California, and has a strong focus on excellence and perfectionism. FutureTech Solutions offers a dynamic work environment and is committed to fostering talent and creativity.
      </CardContent>
      <button onClick={()=>{getInsights(true)}}>Get Insights</button>
    </Card>
    <div style={{marginTop: '50px'}}></div>
      <CardTitle>Job Details</CardTitle>
      <CardContent style={{fontSize: '14px'}}>
        <Divider/>
        <div>Location:<Detail>San Francisco, California</Detail></div>
        <Divider/>
        <div>Company Size: <Detail>Medium (501-1000 Employees)</Detail></div>
        <Divider/>
        <div>Type: <Detail>Full-time</Detail></div>
        <Divider/>
        <div>Hourly / Salary: <Detail>$121,000 - $178,000 yearly</Detail></div>
        <Divider/>
        <div>Required Experience: <Detail>5+ years in Software Engineering</Detail></div>
        <Divider/>
      </CardContent>
  </Right>

  const rightNoJob = <Right style={{display: 'flex', flexDirection: 'column', height: 'calc(100% - 80px)'}}>
    <CardTitle>
      Listed Jobs
    </CardTitle>
    <JobList>
      <JobCard>
        <img src={"https://pngimg.com/uploads/microsoft/microsoft_PNG13.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Flutter - Los Angeles, CA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://imgix.datadoghq.com/img/favicons/dd-favicon.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Datadog - Boston, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://static-00.iconduck.com/assets.00/glassdoor-icon-512x512-3olkl9jp.png"}/>
        <JobTextContainer>Software Engineer<br/><span>TotallyReal - Springfield, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://pngimg.com/uploads/microsoft/microsoft_PNG13.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Flutter - Los Angeles, CA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://imgix.datadoghq.com/img/favicons/dd-favicon.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Datadog - Boston, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://static-00.iconduck.com/assets.00/glassdoor-icon-512x512-3olkl9jp.png"}/>
        <JobTextContainer>Software Engineer<br/><span>TotallyReal - Springfield, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://pngimg.com/uploads/microsoft/microsoft_PNG13.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Flutter - Los Angeles, CA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://imgix.datadoghq.com/img/favicons/dd-favicon.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Datadog - Boston, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://static-00.iconduck.com/assets.00/glassdoor-icon-512x512-3olkl9jp.png"}/>
        <JobTextContainer>Software Engineer<br/><span>TotallyReal - Springfield, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://pngimg.com/uploads/microsoft/microsoft_PNG13.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Flutter - Los Angeles, CA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://imgix.datadoghq.com/img/favicons/dd-favicon.png"}/>
        <JobTextContainer>Software Engineer<br/><span>Datadog - Boston, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
      <JobCard>
        <img src={"https://static-00.iconduck.com/assets.00/glassdoor-icon-512x512-3olkl9jp.png"}/>
        <JobTextContainer>Software Engineer<br/><span>TotallyReal - Springfield, MA</span></JobTextContainer>
        <JobViewButton onClick={() => {selectJob('1234')}}>View</JobViewButton>
      </JobCard>
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