process.env.DB_PATH = ':memory:';

export async function createTestApp() {
  const { createApp } = await import('../src/app.js');
  return createApp();
}
