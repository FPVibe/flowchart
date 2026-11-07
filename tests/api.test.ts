import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestApp } from './helpers.js';

test('GET /api/health returns ok', async () => {
  const app = await createTestApp();
  const res = await app.request('/api/health');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('GET /api/tricks returns seeded tricks', async () => {
  const app = await createTestApp();
  const res = await app.request('/api/tricks');
  assert.equal(res.status, 200);
  const tricks = await res.json();
  assert.ok(Array.isArray(tricks));
  assert.ok(tricks.length > 0);
});

test('POST /api/sessions creates a session', async () => {
  const app = await createTestApp();
  const res = await app.request('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: '2026-07-25', location: 'backyard', platform: '5-inch' })
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.ok(body.id);
});

test('GET /api/sessions/:id round-trips', async () => {
  const app = await createTestApp();
  const created = await app.request('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: '2026-07-26', location: 'backyard', platform: 'Air65' })
  });
  const { id } = await created.json() as { id: number };
  const res = await app.request(`/api/sessions/${id}`);
  assert.equal(res.status, 200);
  const session = await res.json() as any;
  assert.equal(session.id, id);
  assert.equal(session.date, '2026-07-26');
  assert.equal(session.platform, 'Air65');
  assert.ok(Array.isArray(session.packs));
});
