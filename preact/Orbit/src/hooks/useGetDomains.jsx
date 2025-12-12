export default function useGetDomains(project){
        const transitiedomeinen = project.transitiedomeinen
    .filter(td => td.category === "Transitiedomein");
    return transitiedomeinen;}