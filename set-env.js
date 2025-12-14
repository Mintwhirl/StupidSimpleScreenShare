import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log('Setting up Pusher environment variables...\n');

  const vars = [
    'VITE_PUSHER_KEY',
    'VITE_PUSHER_CLUSTER',
    'PUSHER_APP_ID',
    'PUSHER_KEY',
    'PUSHER_SECRET',
    'PUSHER_CLUSTER',
  ];

  for (const varName of vars) {
    const value = await question(`Enter ${varName}: `);
    if (value) {
      try {
        execSync(`vercel env add ${varName} production`, { input: `${value}\n` });
        console.log(`✅ Added ${varName}\n`);
      } catch (error) {
        console.error(`❌ Failed to add ${varName}:`, error.message);
      }
    }
  }

  console.log('\nVerifying environment variables:');
  try {
    execSync('vercel env ls', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to list env vars:', error.message);
  }

  rl.close();
}

main().catch(console.error);
