import { Home, NotFound, UserDashboard, Recruiter, UploadResume } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
	return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<UserDashboard/>} />
          <Route path="/recruit" element={<Recruiter />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
	);
}

export default App;