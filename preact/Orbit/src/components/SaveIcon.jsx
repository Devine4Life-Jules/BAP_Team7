
export default function SaveIcon({ isSaved, fillColor, strokeColor }) {
    // Default colors for PhoneProject (white scheme)
    const defaultStroke = strokeColor || 'white';
    const defaultFill = fillColor || (isSaved ? 'white' : 'none');
    
    return(
        <>
            <svg width="30" height="36" viewBox="0 0 42 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.5 1.5H3.5C2.39543 1.5 1.5 2.39543 1.5 3.5V47.426C1.5 49.0876 3.40863 50.0246 4.7232 49.0084L20.1918 37.0507C20.9252 36.4837 21.9522 36.4951 22.6729 37.0781L37.2421 48.8644C38.5499 49.9224 40.5 48.9916 40.5 47.3095V3.5C40.5 2.39543 39.6046 1.5 38.5 1.5Z" stroke={defaultStroke} stroke-width="3" fill={defaultFill}/>
            </svg>
        </>
    )
}