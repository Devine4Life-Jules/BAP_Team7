import XLSX from "xlsx";

const INPUT_FILE = "projecten.xlsx";

console.log('📖 Reading Excel file...');
const wb = XLSX.readFile(INPUT_FILE);

let abstracts = XLSX.utils.sheet_to_json(wb.Sheets["Abstract_Outcome..."]);

// Check first few projects with images
console.log('\n🔍 Checking image data in Excel:\n');

abstracts.slice(0, 3).forEach((row, index) => {
  const pictureData = row.PictureCommunication || "";
  
  console.log(`Project ${index + 1} (ID: ${row.ID}):`);
  console.log(`  - Has image data: ${pictureData.length > 0 ? 'YES' : 'NO'}`);
  console.log(`  - Data length: ${pictureData.length} characters`);
  
  if (pictureData.length > 0) {
    console.log(`  - First 100 chars: ${pictureData.substring(0, 100)}`);
    console.log(`  - Starts with "data:": ${pictureData.startsWith('data:')}`);
    
    // Try to decode and check if it's valid
    if (pictureData.startsWith('data:image/')) {
      const base64Part = pictureData.split(',')[1];
      console.log(`  - Base64 part length: ${base64Part ? base64Part.length : 0}`);
      console.log(`  - Looks valid: ${base64Part && base64Part.length > 1000 ? 'YES' : 'MAYBE TRUNCATED'}`);
    } else {
      // Might be base64 encoded
      try {
        const decoded = Buffer.from(pictureData, 'base64').toString('utf-8');
        console.log(`  - Decoded starts with: ${decoded.substring(0, 50)}`);
        console.log(`  - Is valid data URI: ${decoded.startsWith('data:image/') ? 'YES' : 'NO'}`);
      } catch (err) {
        console.log(`  - Decode error: ${err.message}`);
      }
    }
  }
  
  console.log('');
});

console.log('\n💡 Image data should be:');
console.log('   - Format: data:image/png;base64,iVBORw0KGg...');
console.log('   - OR: Base64-encoded version of that string');
console.log('   - Length: Usually 10,000+ characters for a real image\n');
