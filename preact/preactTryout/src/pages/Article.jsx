import articles from '../data/articles.json'

export default function Article({id}){
    const article = articles.find(a => String(a.id) === String(id))
    
    if (!article) {
        return <div>Article not found</div>
    }

    return(
        <div>
            <h2>{article.id} - {article.title}</h2>
            <p>project manager <span style={{fontWeight:'bold'}}>{article.projectManager}</span></p>
            <p>Areas Of Expertise <span style={{fontWeight:'bold'}}>{article.areasOfExpertise}</span></p>
            <p>themes <span style={{fontWeight:'bold'}}>{article.themes}</span></p>
            <p>kernwoorden <span style={{fontWeight:'bold'}}>{article.kernwoorden}</span></p>
            <p>text <span style={{fontWeight:'bold'}}>{article.text}</span></p>


        </div>
    )
}