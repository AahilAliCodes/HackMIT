import {styled} from 'styled-components'
import MAP from '../../assets/map.png'
import { useState, useRef } from 'react'
import WaveFooter from '../../components/Wave'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Manrope";
  background-image: url(${MAP});
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: 100px;
  background-color: #e9f2fb;
  flex: 1;
`

const Title = styled.div`
  text-align: center;
  font-size: 64px;
  font-family: "Bricolage Grotesque";
  color: #3DA8C9;
  font-weight: bold;
  margin-bottom: 20px;
`

const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 300px;
  background-color: white;
  border-radius: 30px;
  padding: 20px;
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.1);
  align-items: center;
`

const Upload = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: white;
  border: 2px dashed blue;
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
  }
`

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const selectedFile = files[0];
    if (selectedFile.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10 MB limit.');
      return;
    }
    uploadWithoutForm(selectedFile)
  };

  const uploadWithoutForm = async (selectedFile) => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    // skipping backend upload
    window.location.href = "/dashboard"
    return

    try {
      const response = await fetch('https://BACKEND_HERE_PLEASE!!!', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully!');
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return <Container>
    <Title>
      <div style={{marginBottom: '-25px'}}>Get Started</div>
      <span style={{color: '#353866', fontSize: '32px'}}>Upload your resume</span>
    </Title>
    <UploadBox>
      <Upload onDrop={handleDrop} onClick={onButtonClick}>
          <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} style={{display: 'none'}}/>
          {file ? file.name : 'Drag your file or browse'}
      </Upload>
      
      Only supports .pdf
    </UploadBox>
    <WaveFooter />
  </Container>
}