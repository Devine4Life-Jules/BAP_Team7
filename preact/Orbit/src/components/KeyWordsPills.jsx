export default function KeyWordPills({keywords = [], pillClassName, wrapperClassName}){
    return (
        <>
            {keywords.length > 0 && (
                <div className={wrapperClassName} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', marginBottom: '20px'  }}>
                    {keywords.map((keyword, index) => (
                        <span key={index} className={pillClassName}>
                            {keyword.label}
                        </span>
                    ))}
                </div>
            )}
        </>
    )
}