export default function useGetKeywords(project){
        const keywords = project.transitiedomeinen
        .filter(td => td.category === "Thema")
        .slice(0, 3);
        return keywords;
}