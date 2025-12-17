import { ProjectsProvider } from './contexts/ProjectsContext';
import PhoneProject from './pages/phone/PhoneProject';
import PhoneFavourites from './pages/phone/PhoneFavourites';  
import PhoneContact from './pages/phone/PhoneContact';
import PhoneError from './pages/phone/PhoneError';
import { Router } from 'preact-router';
import { Installation } from './pages/installation/Installation'
import DashboardHome from './pages/Dashboard/DashboardHome';
import DashboardList from './pages/Dashboard/DashboardList';
import DashboardDetail from './pages/Dashboard/DashboardDetail';
import './reset.css'
import './app.css'

export function App() {
  

  return (
    <>

      <ProjectsProvider>
        <Router>
          <PhoneContact path="/phone/contact" />
          <PhoneFavourites path="/phone/favourites" />
          <PhoneProject path="/phone/project/:id" />
          <PhoneError path="/phone/:rest*" />
          <PhoneError path="/phone/project/:rest*" />
          <DashboardHome path="/dashboard" />
          <DashboardList path="/dashboard/list" />
          <DashboardDetail path="/dashboardDetail/:id" />
          <Installation path="/" />
          <Installation path="/:rest*" />
        </Router>
      </ProjectsProvider>

    </>
  )
}
