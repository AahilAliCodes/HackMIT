import { styled } from 'styled-components'
import MAP from '../../assets/map.png'
import TITLE from '../../assets/title.png'
import MAG from '../../assets/magnifying.png'

const Container = styled.div`
  width: calc(100% - 300px);
  flex: 1;
  background-color: #e9f2fb;
  background-image: url(${MAP});
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 150px;
`

const Title = styled.img`
  max-width: 30vw;
  margin-top: -140px;
`

const Magnify = styled.img`
  position: absolute;
  width: 43vw;
  top: 50%;
  left: 48vw;
  transform: translateY(-50%);
`

const Subtitle = styled.div`
  margin-top: 30px;
  color: #7B95B7;
  font-size: 24px;
  max-width: 35vw;
`

const Explore = styled.a`
  all: unset;
  margin-top: 20px;
  background-color: #3DA8C9;
  color: white;
  padding: 10px 20px;
  width: max-content;
  border-radius: 20px;
  font-size: 14px;
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`

export default function Home() {
  return <Container>
    <Title src={TITLE}/>
    <Subtitle>Ease your job search and find ideal candidates with our all in one, AI insight analysis model.</Subtitle>
    <Explore href="/upload">EXPLORE JOBS</Explore>
    <Magnify src={MAG} />
  </Container>
};