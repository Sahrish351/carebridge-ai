import http from 'http';
import { app } from '../server/app.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

async function runE2E() {
  console.log('\n======================================================');
  console.log(' CareBridge AI - End-to-End Live HTTP Protocol Tests');
  console.log('======================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(3099, '127.0.0.1', () => resolve()));
  const baseUrl = 'http://127.0.0.1:3099';

  try {
    console.log('--- 1. Production API Health Check ---');
    const healthRes = await fetch(`${baseUrl}/healthz`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, 'GET /healthz returns HTTP 200');
    assert(healthJson.status === 'ok', 'Health status is ok');
    assert(typeof healthJson.storage === 'string', `Storage reported as: ${healthJson.storage}`);

    console.log('\n--- 2. Production Registration Flow ---');
    const testEmail = `live_patient_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'securePassword123',
        name: 'Fatima Zahra',
        role: 'patient',
      }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201, 'Registration returns HTTP 201 Created');
    assert(regJson.user?.email === testEmail, 'User record created with correct email');
    assert(!!regJson.token, 'Session token returned in registration response');
    assert(!regJson.user?.passwordHash, 'Password hash is NOT exposed in response payload');

    const authToken = regJson.token;
    const cookieHeader = regRes.headers.get('set-cookie');
    assert(!!cookieHeader, 'Set-Cookie header returned with session cookie');

    console.log('\n--- 3. Duplicate Registration Validation ---');
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'anotherPassword',
        name: 'Another Name',
        role: 'patient',
      }),
    });
    const dupJson = await dupRes.json();
    assert(dupRes.status === 400, 'Duplicate registration returns HTTP 400');
    assert(dupJson.error?.includes('already exists'), 'Clear duplicate email error returned');

    console.log('\n--- 4. Session Validation & Dashboard Refresh ---');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200, 'GET /auth/me returns HTTP 200 with Bearer token');
    assert(meJson.user?.name === 'Fatima Zahra', 'User identity preserved across session check');
    assert(meJson.user?.role === 'patient', 'User role correctly verified as patient');

    console.log('\n--- 5. User Data Persistence (Appointments & Tasks) ---');
    const aptRes = await fetch(`${baseUrl}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'Cycle 1 Chemotherapy Infusion',
        doctor: 'Dr. Saman Ali',
        specialty: 'Oncology',
        date: '2026-11-05',
        time: '09:00 AM',
        location: 'Infusion Suite 2B',
        type: 'infusion',
        notes: 'Pre-medications: dexamethasone and ondansetron 30 min prior.',
      }),
    });
    const aptJson = await aptRes.json();
    assert(aptRes.status === 201, 'POST /appointments creates new appointment');
    assert(aptJson.title === 'Cycle 1 Chemotherapy Infusion', 'Appointment title verified');

    const getAptRes = await fetch(`${baseUrl}/api/appointments`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const getAptJson = await getAptRes.json();
    assert(Array.isArray(getAptJson) && getAptJson.length >= 1, 'GET /appointments retrieves persisted appointment');

    console.log('\n--- 6. Session Logout & Token Invalidation ---');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(logoutRes.status === 200, 'POST /auth/logout returns HTTP 200');

    const meAfterLogout = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(meAfterLogout.status === 401, 'GET /auth/me returns HTTP 401 Unauthorized after logout');

    console.log('\n--- 7. Second Login Verification (Account Persistence) ---');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'securePassword123',
      }),
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200, 'Second login returns HTTP 200 OK');
    assert(loginJson.user?.email === testEmail, 'Login verified correct user');
    assert(!!loginJson.token, 'New valid session token issued on second login');

    console.log('\n--- 8. Security: Invalid Password Rejection ---');
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999',
      }),
    });
    const badLoginJson = await badLoginRes.json();
    assert(badLoginRes.status === 401, 'Invalid password rejected with HTTP 401');
    assert(badLoginJson.error?.includes('Invalid email or password'), 'Appropriate security error message');

    console.log('\n--- 9. Pre-Configured Demo Accounts Verification ---');
    const demoPatientRes = await fetch(`${baseUrl}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'patient' }),
    });
    const demoPatientJson = await demoPatientRes.json();
    assert(demoPatientRes.status === 200, 'Patient demo login succeeds (HTTP 200)');
    assert(demoPatientJson.user?.email === 'areeba@example.com', 'Patient demo email is areeba@example.com');
    assert(demoPatientJson.user?.role === 'patient', 'Patient demo role verified');

    const demoCaregiverRes = await fetch(`${baseUrl}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'caregiver' }),
    });
    const demoCaregiverJson = await demoCaregiverRes.json();
    assert(demoCaregiverRes.status === 200, 'Caregiver demo login succeeds (HTTP 200)');
    assert(demoCaregiverJson.user?.email === 'tariq@example.com', 'Caregiver demo email is tariq@example.com');

    const demoDoctorRes = await fetch(`${baseUrl}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'doctor' }),
    });
    const demoDoctorJson = await demoDoctorRes.json();
    assert(demoDoctorRes.status === 200, 'Doctor demo login succeeds (HTTP 200)');
    assert(demoDoctorJson.user?.email === 'saman@example.com', 'Doctor demo email is saman@example.com');

    console.log('\n======================================================');
    console.log(` E2E HTTP Protocol Results: ${passed} Passed, ${failed} Failed`);
    console.log('======================================================\n');
  } finally {
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runE2E().catch((err) => {
  console.error('E2E test suite error:', err);
  process.exit(1);
});

