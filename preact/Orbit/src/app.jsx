import { useState } from 'preact/hooks'
import { ProjectsProvider } from './contexts/ProjectsContext';
import PhoneProject from './pages/phone/PhoneProject';
import PhoneFavourites from './pages/phone/PhoneFavourites';  
import PhoneContact from './pages/phone/PhoneContact';
import { Router } from 'preact-router';
import { Installation } from './pages/installation/Installation'
import './reset.css'
import './app.css'

export function App() {
  

  return (
    <>

      <ProjectsProvider>
        <Router>
          <Installation path="/" default/>
          <PhoneContact path="/phone/contact" />
          <PhoneFavourites path="/phone/favourites" />
          <PhoneProject path="/phone/project/:id" />
        </Router>
      </ProjectsProvider>

    </>
  )
}
