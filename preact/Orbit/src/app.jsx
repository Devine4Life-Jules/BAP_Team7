import { useState } from 'preact/hooks'


import Screen1 from './pages/installation/onboarding/screen1'
import Screen2 from './pages/installation/onboarding/screen2'
import Screen3 from './pages/installation/onboarding/screen3'
import Map from './pages/installation/map'
import Article from './pages/installation/Article'
import Project from './pages/installation/Project'
import { Router } from 'preact-router';
import { Installation } from './pages/installation/Installation'
import './app.css'

export function App() {
  

  return (
    <>

      <Router>
        <Installation path="/" default/>

      </Router> 

    </>
  )
}
