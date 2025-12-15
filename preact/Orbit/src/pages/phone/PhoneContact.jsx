import { useState } from 'preact/hooks'
import { supabase } from '../../lib/supabase'
import './phone.css'
import PhoneNav from '../../components/PhoneNav'
import { Link } from 'preact-router'
import cloudsTopContact from '../../assets/cloudsTopContact.png'
import mobileContactRocket from '../../assets/mobileContactRocket.png'
import PhoneFooter from '../../components/PhoneFooter'
import logo_howestResearch from '../../assets/logo_howestResearch.png'

export default function PhoneContact(){
    // State for form fields
    const [companyName, setCompanyName] = useState('')
    const [contactName, setContactName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    
    // State for submission status
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
    const [errorMessage, setErrorMessage] = useState('')

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus(null)
        
        try {
            // Insert into Supabase
            const { data, error } = await supabase
                .from('contacts')
                .insert([
                    { 
                        companyName,
                        contactName,
                        email,
                        message
                    }
                ])
            
            if (error) throw error
            
            // Success!
            setSubmitStatus('success')
            // Clear form
            setCompanyName('')
            setContactName('')
            setEmail('')
            setMessage('')
            
        } catch (error) {
            console.error('Error submitting contact:', error)
            setSubmitStatus('error')
            setErrorMessage(error.message || 'Failed to submit. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
        <div className="contactPage" style={{backgroundColor:'#000032', position: 'relative'}}>
            {/* Clouds overlapping from outside */}
            <img src={cloudsTopContact} alt="clouds" style={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                pointerEvents: 'none'
            }}/>
            
            <div class="contactHeader" style={{ position: 'relative', width: '85%', margin: '0 auto', borderRadius: '30px', overflow: 'hidden' }}>
                {/* Gradient background layer */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg, rgba(73, 71, 129, 0.00) 0%, #6462A7 100%)',
                    zIndex: 1
                }}></div>
                
                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2, padding: '7rem 1rem' }}>
                    <div style={{width: '90%', margin: '1rem auto'}}><img src={logo_howestResearch} alt="Howest Research" style={{width: '100%'}} /></div>
                    <p>Onze research is wat jou bedrijf naar de sterren zal brengen. Interesse of vragen aarzel niet en kom in contact</p>
                    <Link href='#contactForm' className="projectCTA" style={{backgroundColor: '#332E84', margin:'1rem auto'}}>Samenwerken</Link>
                    <img src={mobileContactRocket} alt="rocket" style={{width: '60%',  margin: '0 auto'}} />
                </div>
            </div>
            {/* Success message */}
            {submitStatus === 'success' && (
                <div style={{ 
                    padding: '10px', 
                    background: '#4caf50', 
                    color: 'white', 
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    ✓ Message sent successfully!
                </div>
            )}

            {/* Error message */}
            {submitStatus === 'error' && (
                <div style={{ 
                    padding: '10px', 
                    background: '#f44336', 
                    color: 'white', 
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    ✗ {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} id="contactForm" className="contactForm">
                <label style={{display: 'block'}} htmlFor="companyName">Naam Bedrijf:</label>
                <input 
                    placeholder='Howest Research'
                    name="companyName" 
                    id="companyName"
                    style={{display: 'block'}}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />
                
                <label htmlFor="contactName" style={{display: 'block'}}>Naam Contactpersoon:</label>
                <input 
                    name="contactName"
                    id="contactName" 
                    placeholder='John Doe'
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                />
                
                <label htmlFor="email" style={{display: 'block'}}>Email:</label>
                <input 
                    name="email" 
                    style={{display: 'block'}}
                    placeholder='john.doe@howest.be'
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <label htmlFor="message" style={{display: 'block'}}>Message:</label>
                <textarea 
                    name="message"
                    placeholder='Ik ben geïnteresseerd in jullie research diensten...'
                    style={{display: 'block'}}
                    id="message" 
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="projectCTA"
                    style={{
                        display: 'block',
                        opacity: isSubmitting ? 0.6 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
            </form>


            <PhoneNav />
            <PhoneFooter />
        </div>
    )
}