export default function PhoneDomainPills({domains, pillClassName = "phonedomain"}) {
    return (
        <div className="phoneDomainWrapper">
            {domains.map((td, index) => (
                <span key={index} id={`phonedomain${index}`} className={`${pillClassName} ${td.label}`}>
                    {td.label}
                </span>
            ))}
        </div>
    )
}