const fs = require('fs');
const path = require('path');

const credentialsPath = path.join(__dirname, 'src/config/credentials.json');
const credentials = fs.readFileSync(credentialsPath, 'utf8');
const base64Credentials = Buffer.from(credentials).toString('base64');

console.log(base64Credentials);