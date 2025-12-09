const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('projecten.xlsx');

console.log('📚 Available sheets:', workbook.SheetNames);

// Try Abstract_Outcome with different options
const sheetName = workbook.SheetNames.find(name => name.startsWith('Abstract_Outcome'));
console.log('Using sheet:', sheetName);

const worksheet = workbook.Sheets[sheetName];
if (!worksheet) {
  console.error('❌ Sheet not found!');
  process.exit(1);
}

const data = xlsx.utils.sheet_to_json(worksheet, { defval: null, blankrows: false });

console.log('📊 Found', data.length, 'rows');
if (data.length > 0) {
  console.log('First row keys:', Object.keys(data[0]));
  console.log('First few rows:', data.slice(0, 2));
}

// Get first project's image
const firstProject = data.find(row => row['PictureCommunication']);
if (!firstProject) {
  console.error('❌ No row with PictureCommunication found!');
  process.exit(1);
}
const doubleEncodedData = firstProject['PictureCommunication'];

console.log('📊 Double-encoded data stats:');
console.log('   Length:', doubleEncodedData.length, 'characters');

// First decode (base64 -> data URI string)
const dataUri = Buffer.from(doubleEncodedData, 'base64').toString('utf-8');
console.log('\n🔓 First decode (to data URI):');
console.log('   Length:', dataUri.length, 'characters');
console.log('   Format:', dataUri.substring(0, 50));

// Check if data URI is complete (should end with proper base64 padding or chars)
const lastChars = dataUri.substring(dataUri.length - 20);
console.log('   Last 20 chars:', lastChars);

// Second decode (data URI -> actual image bytes)
if (dataUri.startsWith('data:image/')) {
  const base64Data = dataUri.split(',')[1];
  console.log('\n🖼️ Base64 image data:');
  console.log('   Length:', base64Data.length, 'characters');
  
  // Try to decode to buffer
  try {
    const imageBuffer = Buffer.from(base64Data, 'base64');
    console.log('   Decoded to buffer:', imageBuffer.length, 'bytes');
    
    // Check if it's a valid image (JPEG starts with FFD8, PNG with 89504E47)
    const header = imageBuffer.slice(0, 4).toString('hex');
    console.log('   File header:', header);
    
    if (header.startsWith('ffd8')) {
      console.log('   ✅ Valid JPEG header');
    } else if (header === '89504e47') {
      console.log('   ✅ Valid PNG header');
    } else {
      console.log('   ❌ Invalid image header!');
    }
    
    // Save to file to test if it opens
    fs.writeFileSync('test-image.jpg', imageBuffer);
    console.log('\n💾 Saved to test-image.jpg - try opening it!');
    
  } catch (err) {
    console.error('   ❌ Error decoding:', err.message);
  }
}
