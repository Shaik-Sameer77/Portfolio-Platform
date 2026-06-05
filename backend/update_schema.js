const fs = require('fs');
const content = fs.readFileSync('prisma/schema.prisma', 'utf8');
const updated = content.replace('clientCompany   String?', 'clientCompany   String?\n  clientMobile    String?');
fs.writeFileSync('prisma/schema.prisma', updated);
console.log('updated schema.prisma');
