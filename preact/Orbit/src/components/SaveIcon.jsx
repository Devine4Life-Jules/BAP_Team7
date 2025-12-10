
export default function SaveIcon({ isSaved }) {
    return(
        <>
            <svg width="42" height="51" viewBox="0 0 42 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.5 1.5H3.5C2.39543 1.5 1.5 2.39543 1.5 3.5V47.426C1.5 49.0876 3.40863 50.0246 4.7232 49.0084L20.1918 37.0507C20.9252 36.4837 21.9522 36.4951 22.6729 37.0781L37.2421 48.8644C38.5499 49.9224 40.5 48.9916 40.5 47.3095V3.5C40.5 2.39543 39.6046 1.5 38.5 1.5Z" stroke="white" stroke-width="3" fill={isSaved ? 'white' : 'none'}/>
            </svg>
        </>
    )
}