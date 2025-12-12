import { Icon } from "@iconify/react"




export default function PhoneFooter() {
    return (
        <footer> 
            <section>
                <h3>General Info</h3>
                <ul>
                    <li>Marksesteenweg 58</li>
                    <li>8500 Kortrijk</li>
                    <li>+32 56 24 12 90</li>
                    <li>info@howest.be</li>
                </ul>
            </section>
            <section>
                <h3>Follow Howest</h3>
                <ul style={{display: 'flex', gap: '1rem', padding: 0, listStyle: 'none'}}>
                    <li><a href="/about"><Icon icon="fa-brands:twitter" /></a></li>
                    <li><a href="/services"><Icon icon="fa-brands:facebook" /></a></li>
                    <li><a href="/contact"><Icon icon="fa-brands:instagram" /></a></li>
                    <li><a href="/linkedin"><Icon icon="fa-brands:linkedin" /></a></li>
                </ul>
            </section>
            <section>
                <h3>Shortcuts</h3>
                <ul>
                    <li><a href="#">Media Hub</a></li>
                    <li><a href="#">IT on campus</a></li>
                    <li><a href="#">News</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Find your study programme</a></li>
                    <li><a href="#">Job opportunities</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </section>
            <section>
                <ul>
                    <li>howest research</li>
                    <li>orbit</li>
                </ul>
            </section>
        </footer>
       
    )
}