import { styled } from 'styled-components'
import MAN from '../assets/circleman.png'
import LOGO from '../assets/insighthire.png'

const Container = styled.div`
  display: flex;
  padding: 10px 60px;
  flex-direction: row;
  font-family: 'Manrope';
  a {
    all: unset;
    margin-right: 60px;
    font-size: 16px;
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
`

const Left = styled.div`

`

const Logo = styled.img`
  height: 50px;
`

const Right = styled.div`
  display: flex;
  justify-content: end;
  flex: 1;
  height: 100%;
  align-items: center;
`

const Login = styled.button`
  all: unset;
  border: 1px #3DA8C9 solid;
  color: #3DA8C9;
  border-radius: 15px;
  padding: 5px 30px;

  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`

const PFP = styled.img`
  display: block;
  max-height: 50px;
`

export default function Navbar() {
  var homepage = <Right>
    <a href="/">Home</a>
    <a href="/">About Us</a>
    <a href="/">Services</a>
    <a href="/upload" style={{margin: 0}}><Login>LOGIN</Login></a>
  </Right>

  var dashboard = <Right>
    <a href="/">Home</a>
    <a href="/">Jobs</a>
    <a href="/">Reports</a>
    <a href="/">Feedback</a>
    <a href="/" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 0}}>
      <PFP src={MAN}></PFP>
      <div style={{marginLeft: '15px', fontWeight: 'bold'}}>
        Alex Johnson
      </div>
    </a>
    
  </Right>

  return <Container>
      <Left>
        <Logo src={LOGO}></Logo>
      </Left>
      {window.location.pathname === "/" ? homepage : dashboard}
  </Container>
}