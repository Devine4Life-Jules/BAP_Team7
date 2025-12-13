

import Screen1 from './onboarding/screen1'
import Screen2 from './onboarding/screen2'
import Screen3 from './onboarding/screen3'
import Screen4 from './onboarding/screen4'
import Map from './map'
import Project from './Project'
import { Router } from 'preact-router';
import '../../app.css'
import mainBg from '../../assets/mainBg.png'
import InstallationError from './InstallationError'

export function Installation() {

  

  return (
    <div id="installation" style={{backgroundImage: `url(${mainBg})`, backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>

      <Router>
        <Screen1 path="/"/>
        <Screen2 path="/screen2"/>
        <Screen3 path="/screen3"/>
        <Screen4 path="/screen4"/>
        <Map path="/map" />
        <Project path="/project/:id" />
        <InstallationError path="/:rest*" />
      </Router> 

    </div>
  )
}
