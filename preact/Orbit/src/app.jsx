import { useState } from 'preact/hooks'

import PhoneProject from './pages/phone/PhoneProject';
import PhoneFavourites from './pages/phone/PhoneFavourites';  
import PhoneContact from './pages/phone/PhoneContact';
import { Router } from 'preact-router';
import { Installation } from './pages/installation/Installation'
import './app.css'

export function App() {
  

  return (
    <>

      <Router>
        <Installation path="/" default/>
        <PhoneContact path="/PhoneContact"/>
        <PhoneProject path="/PhoneProject"/>
        <PhoneFavourites path="/PhoneFavourites"/>
      </Router>

    </>
  )
}
