import { db } from '../server/db.js';
import { askAiAssistant, generateDoctorVisitSummary } from '../server/aiService.js';
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

async function runTestSuite() {
  console.log('\n=============================================');
  console.log(' CareBridge AI - Automated Verification Suite');
  console.log('=============================================\n');

  console.log('--- 1. Seed Data & Database Engine ---');
  const patient = await db.getUserByEmail('areeba@example.com');
  assert(!!patient, 'Default patient user (areeba@example.com) exists');
  assert(patient?.role === 'patient', 'Areeba has patient role');
  assert(Boolean(patient?.treatmentPlan.regimen.includes('Paclitaxel')), 'Areeba regimen contains Paclitaxel & Carboplatin');

  const caregiver = await db.getUserByEmail('tariq@example.com');
  assert(!!caregiver, 'Default caregiver user (tariq@example.com) exists');
  assert(caregiver?.role === 'caregiver', 'Tariq has caregiver role');

  const doctor = await db.getUserByEmail('saman@example.com');
  assert(!!doctor, 'Default doctor user (saman@example.com) exists');
  assert(doctor?.role === 'doctor', 'Dr. Saman Ali has doctor role');

  console.log('\n--- 2. Authentication & PBKDF2 Password Hashing ---');
  assert(db.verifyPassword(patient!, 'password123'), 'Correct password verifies successfully');
  assert(!db.verifyPassword(patient!, 'wrongpassword'), 'Incorrect password fails verification');

  const testEmail = `test_${Date.now()}@example.com`;
  const newUser = await db.createUser({
    name: 'Test Cancer Patient',
    email: testEmail,
    password: 'securePassword123',
    role: 'patient',
  });
  assert(!!newUser.id, 'User registration successfully generated a new ID');
  assert(newUser.email === testEmail, 'New user email stored in lowercase');

  const session = await db.createSession(newUser.id);
  assert(!!session.token, 'Session token generated successfully');
  const retrievedSession = await db.getSession(session.token);
  assert(retrievedSession?.userId === newUser.id, 'Session correctly retrieves user ID');

  console.log('\n--- 3. Care Planner & Appointments ---');
  const initialApts = await db.getAppointments(patient!.id);
  assert(initialApts.length >= 3, `Patient has initial seeded appointments (count: ${initialApts.length})`);

  const newApt = await db.createAppointment(patient!.id, {
    title: 'Post-Cycle Oncology Blood Panel',
    doctor: 'Dr. Saman Ali',
    specialty: 'Oncology',
    date: '2026-11-20',
    time: '09:30 AM',
    location: 'Lab Services Room 104',
    type: 'blood_test',
    notes: 'Checking complete blood counts and platelets.',
    reminder: true,
  });
  assert(!!newApt.id, 'Appointment created successfully');

  const updatedApt = await db.updateAppointment(patient!.id, newApt.id, {
    notes: 'Checking complete blood counts and liver enzymes.',
  });
  assert(updatedApt.notes.includes('liver enzymes'), 'Appointment notes updated successfully');

  await db.deleteAppointment(patient!.id, newApt.id);
  const afterDeleteApts = await db.getAppointments(patient!.id);
  assert(!afterDeleteApts.some((a) => a.id === newApt.id), 'Appointment deleted successfully');

  console.log('\n--- 4. Symptom Journal & Severity Tracking ---');
  const initialJournal = await db.getJournalEntries(patient!.id);
  assert(initialJournal.length >= 3, `Patient has initial symptom entries (count: ${initialJournal.length})`);

  const newEntry = await db.createJournalEntry(patient!.id, {
    date: '2026-10-28',
    symptoms: ['Mild nausea', 'Low energy / Fatigue'],
    severity: 4,
    mood: 'okay',
    notes: 'Managed with hydration and rest. Antiemetic taken at noon.',
  });
  assert(!!newEntry.id, 'Symptom journal entry created');
  assert(newEntry.severity === 4, 'Symptom severity correctly recorded');

  const updatedEntry = await db.updateJournalEntry(patient!.id, newEntry.id, {
    severity: 3,
  });
  assert(updatedEntry.severity === 3, 'Symptom entry severity updated');

  await db.deleteJournalEntry(patient!.id, newEntry.id);
  const afterDeleteJournal = await db.getJournalEntries(patient!.id);
  assert(!afterDeleteJournal.some((j) => j.id === newEntry.id), 'Symptom entry deleted successfully');

  console.log('\n--- 5. Daily Tasks & Routine Support ---');
  const tasks = await db.getDailyTasks(patient!.id, '2026-10-28');
  assert(tasks.length >= 4, `Tasks available for patient (count: ${tasks.length})`);

  const firstTask = tasks[0];
  const initialCompleted = firstTask.completed;
  const toggledTask = await db.toggleDailyTask(patient!.id, firstTask.id);
  assert(toggledTask.completed === !initialCompleted, 'Daily task toggle flips completed status');
  await db.toggleDailyTask(patient!.id, firstTask.id);

  console.log('\n--- 6. Caregiver Consent & Delegation Permissions ---');
  const perms = await db.getCaregiverPermissions(patient!.id);
  assert(perms.length >= 1, `Caregiver permissions record found for patient (count: ${perms.length})`);

  const sharedPatients = await db.getSharedPatientsForCaregiver('tariq@example.com');
  assert(sharedPatients.length >= 1, 'Caregiver can access authorized patient record');
  assert(sharedPatients[0].patient.email === 'areeba@example.com', 'Authorized patient is Areeba Khan');

  const tempPerm = await db.addCaregiverPermission(patient!.id, {
    caregiverEmail: 'helper@example.com',
    caregiverName: 'Nurse Helper',
    permissions: {
      canViewAppointments: true,
      canEditAppointments: false,
      canViewJournal: false,
      canViewTasks: true,
    },
  });
  assert(tempPerm.status === 'active', 'New caregiver permission granted');

  await db.revokeCaregiverPermission(patient!.id, tempPerm.id);
  const revokedList = await db.getCaregiverPermissions(patient!.id);
  const foundRevoked = revokedList.find((p) => p.id === tempPerm.id);
  assert(foundRevoked?.status === 'revoked', 'Caregiver permission safely revoked');

  console.log('\n--- 7. Doctor Visit Preparation Agenda Synthesis ---');
  const currentApts = await db.getAppointments(patient!.id);
  const journalEntries = await db.getJournalEntries(patient!.id);
  const summary = await generateDoctorVisitSummary({
    appointment: currentApts[0],
    journalEntries,
    medications: ['Paclitaxel (IV chemotherapy)', 'Ondansetron 8mg PRN'],
    patientNotes: 'Feeling anxious about next infusion cycle.',
    customQuestions: ['Can I take magnesium for muscle cramps?'],
  });

  assert(!!summary.chiefConcerns, 'Chief concerns generated');
  assert(summary.symptomsSummary.includes('entries tracked'), 'Symptom trends accurately summarized from entries');
  assert(summary.questionsForDoctor.length >= 3, 'Doctor consultation questions generated');
  assert(summary.questionsForDoctor.includes('Can I take magnesium for muscle cramps?'), 'Custom patient question retained');

  console.log('\n--- 8. AI Assistant Safe Fallback & Source Grounding ---');
  const chemoResponse = await askAiAssistant({
    prompt: 'How can I manage chemotherapy nausea?',
    userName: 'Areeba',
    regimen: 'Paclitaxel & Carboplatin',
  });

  assert(!!chemoResponse.content, 'AI assistant returns content');
  assert(chemoResponse.sources.length >= 2, 'AI assistant provides verified medical citations');
  assert(chemoResponse.sources.some((s) => s.organization === 'American Cancer Society' || s.organization === 'National Cancer Institute'), 'Sources cite authoritative oncology bodies');
  assert(chemoResponse.disclaimer.includes('educational'), 'Clinical educational disclaimer attached');

  const emergencyResponse = await askAiAssistant({
    prompt: 'I have a fever of 101F and chills during chemo',
    userName: 'Areeba',
  });
  assert(emergencyResponse.content.includes('Immediately') || emergencyResponse.content.includes('emergency') || emergencyResponse.content.includes('100.4'), 'Fever prompt triggers urgent triage guidance');

  console.log('\n--- 9. Password Reset Flow ---');
  const resetToken = await db.createPasswordResetToken(patient!.email);
  assert(!!resetToken, 'Password reset token generated');
  const resetSuccess = await db.resetPasswordWithToken(resetToken, 'newPassword2026!');
  assert(resetSuccess, 'Password reset succeeded with token');
  const refreshedPatient = await db.getUserByEmail(patient!.email);
  assert(db.verifyPassword(refreshedPatient!, 'newPassword2026!'), 'New password verifies successfully');
  const restoreToken = await db.createPasswordResetToken(patient!.email);
  await db.resetPasswordWithToken(restoreToken, 'password123');

  console.log('\n--- 10. GDPR Clean Data Purge ---');
  await db.deleteUserData(newUser.id);
  assert(!(await db.getUserById(newUser.id)), 'Test user permanently deleted');
  await db.deleteSession(session.token);
  assert(!(await db.getSession(session.token)), 'Test session invalidated');

  console.log('\n--- 11. Database Connectivity Diagnostics ---');
  const connStatus = await db.checkConnection();
  assert(connStatus.connected, `Database engine responsive (Storage: ${connStatus.storage})`);

  console.log('\n=============================================');
  console.log(` Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
