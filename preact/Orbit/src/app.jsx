import { useState } from 'preact/hooks'


import Screen1 from './pages/onboarding/screen1'
import Screen2 from './pages/onboarding/screen2'
import Screen3 from './pages/onboarding/screen3'
import Map from './pages/map'
import Article from './pages/Article'
import Project from './pages/Project'
import { Router } from 'preact-router';
import { Installation } from './pages/installation'
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
