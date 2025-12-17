import filterShape from '../assets/filterShape.svg'

export default function FilterShape({id,bgColor, title}) {
    return(
        <>
            
                <div id={id} style={{width:'100px',height:"100px",borderRadius:"50%",backgroundColor:bgColor, position:"absolute", backgroundImage:`url(${filterShape})`, backgroundSize:'cover', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'10px', boxSizing:'border-box'}}>
                    <h3>{title}</h3>
                </div>
            
        </>
    )
}