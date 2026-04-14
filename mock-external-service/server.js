const http = require('http');

const PORT = process.env.PORT || 3001;
const GET_ONE_DELAY_MS = 50;
const GET_ALL_DELAY_MS = 1000;

// Generate employees matching V2__insert_stub_data.sql logic
const firstNames = ['Sophia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'Lucas'];
const lastNames = ['Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Robinson'];

const employees = [];
let id = 1;

// 30 departments (10 companies x 3 departments each), IDs 1..30
for (let deptId = 1; deptId <= 30; deptId++) {
  for (let x = 0; x <= 9; x++) {
    const idx = x % 10; // 0-based index into arrays
    const baseName = firstNames[idx];
    const lastName = lastNames[idx];
    const firstName = `${baseName}_${deptId}`;
    const userId = `${baseName[0]}${lastName.substring(0, 5)}${deptId}`;
    const email = `${firstName}.${lastName}@onem.be`;

    employees.push({ id: id++, userId, firstName, lastName, email });
  }
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
    const emp = employeeByUserId[userId];
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
