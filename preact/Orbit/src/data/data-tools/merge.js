import XLSX from "xlsx";
import fs from "fs";

// ---- Config ----
const INPUT_FILE = "projecten.xlsx";
const OUTPUT_FILE = "projects.json";

// ---- Load Excel ----
const wb = XLSX.readFile(INPUT_FILE);

// Debug: Show all sheet names
console.log("Available sheets:", Object.keys(wb.Sheets));

// Helper function to trim column names
const trimColumns = (data) => {
  return data.map(row => {
    const trimmedRow = {};
    Object.keys(row).forEach(key => {
      trimmedRow[key.trim()] = row[key];
    });
    return trimmedRow;
  });
};

let globaal = XLSX.utils.sheet_to_json(wb.Sheets["Globaal"]);
let transitie = XLSX.utils.sheet_to_json(wb.Sheets["Transitiedomein"]);
let abstracts = XLSX.utils.sheet_to_json(wb.Sheets["Abstract_Outcome..."]);
let keywords = XLSX.utils.sheet_to_json(wb.Sheets["Keywords"]);

// Trim all columns
globaal = trimColumns(globaal);
transitie = trimColumns(transitie);
abstracts = trimColumns(abstracts);
keywords = trimColumns(keywords);

// ---- DEBUG: Check column names ----
console.log("Globaal columns:", Object.keys(globaal[0] || {}));
console.log("First row sample:", globaal[0]);
console.log("\nTransitiedomein columns:", Object.keys(transitie[0] || {}));
console.log("First transitie sample:", transitie[0]);
console.log("Total transitie rows:", transitie.length);
console.log("\nAbstracts columns:", Object.keys(abstracts[0] || {}));
console.log("First abstract sample:", abstracts[0]);
console.log("Total abstract rows:", abstracts.length);



// ---- Convert arrays to lookups ----
const transitieById = {};
transitie.forEach(row => {
  if (!transitieById[row.ProjectID]) transitieById[row.ProjectID] = [];
  transitieById[row.ProjectID].push({
    label: row.KeywordLabel,
    category: row.KeywordCategories
  });
});

const abstractsById = {};
abstracts.forEach(row => {
  abstractsById[row.ID] = {
    abstract: row.Abstract || "",
    teaserAbstract: row.TeaserAbstractForWebsite || "",
    projectManager: row.DossierManagerFullName || "",
    pictureUrl: row.PictureCommunication || ""
  };
});

const keywordsById = {};
keywords.forEach(row => {
  if (!keywordsById[row.ID]) keywordsById[row.ID] = [];
  keywordsById[row.ID].push(row.Keyword);
});

// ---- Merge all into a single JSON array ----
const result = globaal.map(row => {
  const id = row.ID;

  return {
    id,
    projectType: row.ProjectTypeLabel,
    researchGroup: row['ResearchGroup (L3-CDESC)'],
    cluster: row.Cluster,
    ccode: row.CCODE,
    cdesc: row.CDESC,
    analyticalCode: row.AnalyticalCode,
    mainFunding: row.MainFundingLabel,
    startDate: row.StartDate,
    endDate: row.EndDate,
    flowPhase: row.FlowPhaseLabel,
    yearBC: row['Jaar BC'],
    approvedTimestamp: row.ApprovedByManagementTimestamp,
    projectManager: abstractsById[id]?.projectManager || "",
    pictureUrl: abstractsById[id]?.pictureUrl || "",
    // add related tables
    transitiedomeinen: transitieById[id] || [],
    keywords: keywordsById[id] || [],
    abstract: abstractsById[id]?.abstract || "",
    teaserAbstract: abstractsById[id]?.teaserAbstract || ""
  };
});

// ---- Save output ----
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
console.log("Done! JSON saved to", OUTPUT_FILE);
