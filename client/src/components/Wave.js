import { styled, keyframes } from 'styled-components'

// Keyframes
const waveAnimation = keyframes`
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -1600px;
  }
`;

const swellAnimation = keyframes`
  0%, 100% {
    transform: translate3d(0,-10px,0);
  }
  50% {
    transform: translate3d(0,5px,0);
  }
`;

// Styled components
const OceanContainer = styled.div`
  height: 60px; // Adjust this value to control the height of the wave section
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

// Custom SVG component
const WaveSVG = styled.svg`
  width: 1600px;
  height: 100%;
`;

const WaveBase = styled.div`
  position: absolute;
  width: 6400px;
  height: 90%;
  animation: ${waveAnimation} 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);

  &:nth-of-type(2) {
    animation: ${waveAnimation} 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -.125s infinite, 
                ${swellAnimation} 7s ease -1.25s infinite;
    opacity: 1;
  }
`;

export default function WaveFooter() {
  return <OceanContainer>
  <WaveBase>
    <WaveSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 198" preserveAspectRatio="none">
      <defs>
        <linearGradient id="a" x1="50%" x2="50%" y1="-10.959%" y2="100%">
          <stop stop-color="#3DA8C9" stop-opacity=".25" offset="0%"/>
          <stop stop-color="#3DA8C9" offset="100%"/>
        </linearGradient>
      </defs>
      <path fill="url(#a)" fill-rule="evenodd" d="M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z" transform="matrix(-1 0 0 1 1600 0)"/>
    </WaveSVG>
    <WaveSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 198" preserveAspectRatio="none">
      <defs>
        <linearGradient id="a" x1="50%" x2="50%" y1="-10.959%" y2="100%">
          <stop stopColor="#3DA8C9" stopOpacity=".25" offset="0%"/>
          <stop stopColor="#3DA8C9" offset="100%"/>
        </linearGradient>
      </defs>
      <path fill="url(#a)" fillRule="evenodd" d="M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z" transform="matrix(-1 0 0 1 1600 0)"/>
    </WaveSVG>
  </WaveBase>
  <WaveBase>
    <WaveSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 198" preserveAspectRatio="none">
      <defs>
        <linearGradient id="a" x1="50%" x2="50%" y1="-10.959%" y2="100%">
          <stop stop-color="#3DA8C9" stop-opacity=".25" offset="0%"/>
          <stop stop-color="#3DA8C9" offset="100%"/>
        </linearGradient>
      </defs>
      <path fill="url(#a)" fill-rule="evenodd" d="M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z" transform="matrix(-1 0 0 1 1600 0)"/>
    </WaveSVG>
    <WaveSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 198" preserveAspectRatio="none">
      <defs>
        <linearGradient id="a" x1="50%" x2="50%" y1="-10.959%" y2="100%">
          <stop stopColor="#3DA8C9" stopOpacity=".25" offset="0%"/>
          <stop stopColor="#3DA8C9" offset="100%"/>
        </linearGradient>
      </defs>
      <path fill="url(#a)" fillRule="evenodd" d="M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z" transform="matrix(-1 0 0 1 1600 0)"/>
    </WaveSVG>
  </WaveBase>
</OceanContainer>
}