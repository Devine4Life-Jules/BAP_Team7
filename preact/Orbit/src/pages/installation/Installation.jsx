import { useState } from 'preact/hooks'


import Screen1 from './onboarding/screen1'
import Screen2 from './onboarding/screen2'
import Screen3 from './onboarding/screen3'
import Map from './map'
import Article from './Article'
import Project from './Project'
import ProjectDetails from './ProjectDetails'
import { Router } from 'preact-router';
import '../../app.css'
import mainBg from '../../assets/mainBg.png'

export function Installation() {
  

  return (
    <div id="installation" style={{backgroundImage: `url(${mainBg})`, backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>

      <Router>
        <Screen1 path="/"/>
        <Screen2 path="/screen2"/>
        <Screen3 path="/screen3"/>
        <Map path="/map" />
        <Article path="/article/:id" />
        <Project path="/project/:id" />
        <ProjectDetails path="/project/:id/details" />
      </Router> 

    </div>
  )
}
