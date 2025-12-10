import { useState } from 'preact/hooks'
import { supabase } from '../../lib/supabase'
import './phone.css'
import PhoneNav from '../../components/PhoneNav'
import { Link } from 'preact-router'
import cloudsTopContact from '../../assets/cloudsTopContact.png'
import mobileContactRocket from '../../assets/mobileContactRocket.png'

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
        <div className="contactPage">

            <div class="contactHeader">
                <img src={cloudsTopContact} alt="" style={{width: '100%', position: 'absolute', top: 0, left: 0}}/>
                <h1 class="mainPhoneTitle" style={{fontSize: "5rem"}}>orbit</h1>
                <p>Onze research is wat jou bedrijf naar de sterren zal brengen. Interesse of vragen aarzel niet en kom in contact</p>
                <Link href='#contactForm' className="projectCTA" style={{backgroundColor: '#332E84'}}>Samenwerken</Link>
                <img src={mobileContactRocket} alt="rocket" style={{width: '60%',  margin: '0 auto', }} />
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
                <label style={{display: 'block'}} htmlFor="companyName">Company Name</label>
                <input 
                    name="companyName" 
                    id="companyName"
                    style={{display: 'block'}}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />
                
                <label htmlFor="contactName" style={{display: 'block'}}>Contact Name</label>
                <input 
                    name="contactName"
                    id="contactName" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                />
                
                <label htmlFor="email" style={{display: 'block'}}>Email</label>
                <input 
                    name="email" 
                    style={{display: 'block'}}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <label htmlFor="message" style={{display: 'block'}}>Message</label>
                <textarea 
                    name="message"
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
        </div>
    )
}