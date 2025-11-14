import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'

import Screen1 from './pages/onboarding/screen1'
import Screen2 from './pages/onboarding/screen2'
import Screen3 from './pages/onboarding/screen3'
import { Router } from 'preact-router';
import './app.css'

export function App() {
  

  return (
    <>

      <Router>
        <Screen1 path="/"/>
        <Screen2 path="/screen2"/>
        <Screen3 path="/screen3"/>
      </Router> 

    </>
  )
}
