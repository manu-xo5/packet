/**
 * Quick Single Dialog Test (Swift Version)
 *
 * A simple script to test a single dialog instance.
 *
 * Usage:
 *   cd lib/swift-native-save-as
 *   make
 *   node test-quick.js
 */

const native = require('./build/Release/save-as.node');

console.log('Opening dialog...\n');

let done = false;

native.showCustomDialog({
  title: 'Save Request',
  nameLabel: 'Request Name:',
  defaultName: 'Untitled'
}, (error, resultJson) => {
  console.log('--- Result ---');

  if (error) {
    console.log('Error:', error);
  } else {
    // Parse JSON result from Swift
    try {
      const result = JSON.parse(resultJson);
      if (result.cancelled) {
        console.log('Status: Cancelled');
      } else {
        console.log('Status: Saved');
        console.log('Name:', result.name);
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Raw result:', resultJson);
    }
  }

  console.log('');
  done = true;
});

// Event pump - keeps macOS GUI responsive
const pump = setInterval(() => {
  native.pollEvents();

  if (done) {
    clearInterval(pump);
    console.log('Test complete.');
    process.exit(0);
  }
}, 16);

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nInterrupted.');
  clearInterval(pump);
  process.exit(0);
});
