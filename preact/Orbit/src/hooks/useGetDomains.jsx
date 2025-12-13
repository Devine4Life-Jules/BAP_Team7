export default function useGetDomains(project){
    // Return empty array if project is undefined or doesn't have transitiedomeinen
    if (!project || !project.transitiedomeinen) {
        return [];
    }
    
    const transitiedomeinen = project.transitiedomeinen
        .filter(td => td.category === "Transitiedomein");
    return transitiedomeinen;
}