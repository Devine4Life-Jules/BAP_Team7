export default function PhoneDomainPills({domains}) {
    return (
        <div className="phoneDomainWrapper">
            {domains.map((td, index) => (
                <span key={index} id={`phonedomain${index}`} className={`phonedomain ${td.label}`}>
                    {td.label}
                </span>
            ))}
        </div>
    )
}