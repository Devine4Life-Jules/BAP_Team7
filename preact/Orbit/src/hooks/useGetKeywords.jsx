export default function useGetKeywords(project){
    // Return empty array if project is undefined or doesn't have transitiedomeinen
    if (!project || !project.transitiedomeinen) {
        return [];
    }
    
    const keywords = project.transitiedomeinen
        .filter(td => td.category === "Thema")
        .slice(0, 3);
    return keywords;
}