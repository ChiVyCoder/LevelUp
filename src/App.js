// src/App.js
import React, { useContext } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; 
import Header from './components/Header/Header.js';
import './base.scss'; 
import Footer from './components/Footer/Footer.js';

// Import các trang của bạn
import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import Register from './pages/Register/Register.js';
import Profile from './pages/Profile/Profile.js';
import Opportunity from './pages/Opportunity/Opportunnity.js';
import IntershipRegister from './pages/IntershipRegister/IntershipRegister.js';
import VolunteerRegister from './pages/VolunteerRegister/VolunteerRegister.js';
import Volunteer from './pages/Volunteer/Volunteer.js';
import Job from './pages/Job/Job.js';
import ProfileEdit from './pages/ProfileEdit/ProfileEdit.js';
import Course from './pages/Course/Course.js';
import Course1 from './pages/Course1/Course1.js';
import Course2 from './pages/Course2/Course2.js';
import Course3 from './pages/Course3/Course3.js';
import Course4 from './pages/Course4/Course4.js';

// Import AuthContext và ProtectedRoute
import { AuthProvider, AuthContext } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header /> 
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            
            {/* CÁC ROUTE ĐƯỢC BẢO VỆ */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile/:id/edit" element={<ProfileEdit />} />
              <Route path='/intership-register/:userId/:jobId' element={<IntershipRegister />} />
              <Route path='/volunteer-register/:userId/:volunteerId' element={<VolunteerRegister />} />
            </Route>

            {/* CÁC ROUTE CÔNG KHAI KHÁC */}
            <Route path='/job' element={<Job />} />
            <Route path='/course' element={<Course />} />
            <Route path='/users/:userId/courses/1' element={<Course1 />} />
            <Route path='/users/:userId/courses/2' element={<Course2 />} />
            <Route path='/users/:userId/courses/3' element={<Course3 />} />
            <Route path='/users/:userId/courses/4' element={<Course4 />} />
            <Route path='/volunteer' element={<Volunteer />} />
            <Route path='/opportunity' element={<Opportunity/>}/>
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

//  một component wrapper nhỏ để lấy Context và truyền props
function HeaderWrapper() {
  const { isAuthenticated, logout } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleLogoutAndRedirect = () => {
    logout();
    navigate('/login');
  };

  const handleProfileOrLoginClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <Header 
      isLoggedIn={isAuthenticated} 
      onLogout={handleLogoutAndRedirect} 
      onProfileClick={handleProfileOrLoginClick} 
    />
  );
}

export default App;