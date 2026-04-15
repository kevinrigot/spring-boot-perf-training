const http = require('http');

const PORT = process.env.PORT || 3001;
const GET_ONE_DELAY_MS = 50;
const GET_ALL_DELAY_MS = 1000;

// Generate employees matching R__insert_stub_data.sql logic
const firstNames = ['Sophia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'Lucas', 'Mia',
  'James',
  'Charlotte',
  'Oliver',
  'Amelia',
  'Elijah',
  'Harper',
  'Benjamin',
  'Evelyn',
  'Alexander'];
const lastNames = ['Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Robinson','Clark',
  'Rodriguez',
  'Lewis',
  'Leeee',
  'Walker',
  'Halle',
  'Young',
  'Hernandez',
  'Allen',
  'Kinge'];

const employees = [];
let id = 1;

for (let x = 0; x < 20; x++) {
  const idx = x % 20; // 0-based index into arrays
  const firstName = firstNames[idx];
  const lastName = lastNames[idx];
  const userId = `${firstName[0]}${lastName.substring(0, 5)}`;
  const email = `${firstName}.${lastName}@onem.be`;

  employees.push({ id: id++, userId, firstName, lastName, email });
}


// Index by userId for O(1) lookup
const employeeByUserId = {};
for (const emp of employees) {
  employeeByUserId[emp.userId] = emp;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendJson(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(json) });
  res.end(json);
}

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  // GET /employees
  if (url === '/employees') {
    console.log('GET employees');
    await sleep(GET_ALL_DELAY_MS);
    sendJson(res, 200, employees);
    return;
  }

  // GET /employees/:userId
  const match = url.match(/^\/employees\/([^/]+)$/);
  if (match) {
    const userId = decodeURIComponent(match[1]);
    console.log(`GET employee ${userId}`);
    await sleep(GET_ONE_DELAY_MS);
    const emp = employeeByUserId[userId.substring(0, 6)];
    if (!emp) {
      sendJson(res, 404, { error: 'Employee not found', userId });
      return;
    }
    sendJson(res, 200, emp);
    return;
  }

  sendJson(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`Mock external employee service running on http://localhost:${PORT}`);
  console.log(`  GET /employees          (${GET_ALL_DELAY_MS}ms delay, ${employees.length} employees)`);
  console.log(`  GET /employees/:userId  (${GET_ONE_DELAY_MS}ms delay)`);
});
