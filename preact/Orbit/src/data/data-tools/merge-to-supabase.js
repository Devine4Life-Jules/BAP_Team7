import XLSX from "xlsx";
import fs from "fs";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in project root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ---- Supabase Config ----
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY');
  console.error('\n⚠️  Note: For uploading data, you need the SERVICE_ROLE key, not the anon key');
  console.error('Find it in: Supabase Dashboard → Project Settings → API → service_role key');
  process.exit(1);
}

console.log('🔑 Using service role key for upload...');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---- Config ----
const INPUT_FILE = "projecten.xlsx";
const BACKUP_FILE = "projects.json"; // Still create JSON as backup
const BATCH_SIZE = 100; // Upload in batches to avoid timeouts

// ---- Load Excel ----
console.log('📖 Reading Excel file...');
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

console.log(`✅ Loaded ${globaal.length} projects from Excel`);

// ---- Convert arrays to lookups ----
const transitieById = {};
transitie.forEach(row => {
  if (!transitieById[row.ProjectID]) transitieById[row.ProjectID] = [];
  transitieById[row.ProjectID].push({
    label: row.KeywordLabel,
    category: row.KeywordCategories
  });
});

// Function to decode base64-encoded UTF-8 data URI
function decodeBase64DataUri(base64String) {
  if (!base64String || base64String.length === 0) {
    return "";
  }
  
  if (base64String.startsWith('data:')) {
    return base64String; // Already decoded
  }
  
  try {
    const utf8String = Buffer.from(base64String, 'base64').toString('utf-8');
    
    if (utf8String.startsWith('data:image/')) {
      return utf8String;
    } else {
      return "";
    }
  } catch (err) {
    console.error('❌ Error decoding base64:', err.message);
    return "";
  }
}

const abstractsById = {};
abstracts.forEach(row => {
  const pictureData = row.PictureCommunication || "";
  
  abstractsById[row.ID] = {
    abstract: row.Abstract || "",
    teaserAbstract: row.TeaserAbstractForWebsite || "",
    projectManager: row.DossierManagerFullName || "",
    pictureUrl: decodeBase64DataUri(pictureData)
  };
});

const keywordsById = {};
keywords.forEach(row => {
  if (!keywordsById[row.ID]) keywordsById[row.ID] = [];
  keywordsById[row.ID].push(row.Keyword);
});

// ---- Merge all into a single array ----
console.log('🔄 Processing project data...');
const allProjects = globaal.map(row => {
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
    transitiedomeinen: transitieById[id] || [],
    keywords: keywordsById[id] || [],
    abstract: abstractsById[id]?.abstract || "",
    teaserAbstract: abstractsById[id]?.teaserAbstract || ""
  };
});

// ---- Save backup JSON ----
console.log('💾 Saving backup JSON file...');
fs.writeFileSync(BACKUP_FILE, JSON.stringify(allProjects, null, 2));
console.log(`✅ Backup saved to ${BACKUP_FILE}`);

// ---- Prepare data for Supabase (only needed fields) ----
const supabaseProjects = allProjects.map(project => ({
  id: project.id,
  ccode: project.ccode,
  cluster: project.cluster || null,
  teaserAbstract: project.teaserAbstract || null,
  abstract: project.abstract || null,
  pictureUrl: project.pictureUrl || null,
  transitiedomeinen: project.transitiedomeinen
}));

// ---- Upload to Supabase in batches ----
async function uploadToSupabase() {
  console.log('\n🚀 Starting upload to Supabase...');
  
  // First, clear existing data (optional - remove if you want to keep existing data)
  console.log('🗑️  Clearing existing projects...');
  const { error: deleteError } = await supabase
    .from('projects')
    .delete()
    .neq('id', 0); // Delete all rows
  
  if (deleteError) {
    console.warn('⚠️  Warning while clearing data:', deleteError.message);
  }
  
  let uploadedCount = 0;
  let errorCount = 0;
  
  // Upload in batches
  for (let i = 0; i < supabaseProjects.length; i += BATCH_SIZE) {
    const batch = supabaseProjects.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(supabaseProjects.length / BATCH_SIZE);
    
    console.log(`📦 Uploading batch ${batchNumber}/${totalBatches} (${batch.length} projects)...`);
    
    const { data, error } = await supabase
      .from('projects')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error uploading batch ${batchNumber}:`, error.message);
      errorCount += batch.length;
    } else {
      uploadedCount += batch.length;
      console.log(`✅ Batch ${batchNumber} uploaded successfully`);
    }
    
    // Small delay between batches to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successfully uploaded: ${uploadedCount} projects`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} projects`);
  }
  console.log(`💾 Backup JSON available at: ${BACKUP_FILE}`);
}

// Run the upload
uploadToSupabase().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
