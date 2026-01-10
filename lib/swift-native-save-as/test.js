/**
 * Native Dialog Test Suite (Swift Version)
 *
 * This script tests the custom NSPanel dialog without Electron.
 * It uses manual event pumping (pollEvents) to keep the macOS GUI responsive.
 *
 * Usage:
 *   cd lib/swift-native-save-as
 *   make
 *   node test.js
 */

const native = require('./build/Release/save-as.node');

// Test cases to run
const testCases = [
  {
    name: 'Basic Save',
    options: {
      title: 'Save Request',
      nameLabel: 'Name:',
      defaultName: 'My Request'
    }
  },
  {
    name: 'Empty Default Name',
    options: {
      title: 'New Request',
      nameLabel: 'Request Name:',
      defaultName: ''
    }
  },
  {
    name: 'Long Title',
    options: {
      title: 'This is a very long dialog title to test overflow behavior',
      nameLabel: 'Name:',
      defaultName: 'Test'
    }
  }
];

let currentTest = 0;
let isRunning = true;

function runNextTest() {
  if (currentTest >= testCases.length) {
    console.log('\n=================================');
    console.log('All tests complete!');
    console.log('=================================\n');
    isRunning = false;
    return;
  }

  const test = testCases[currentTest];
  console.log(`\n--- Test ${currentTest + 1}/${testCases.length}: ${test.name} ---`);
  console.log('Options:', JSON.stringify(test.options, null, 2));
  console.log('\nDialog should appear. Interact with it to continue.\n');

  native.showCustomDialog(test.options, (error, resultJson) => {
    if (error) {
      console.log('ERROR:', error);
    } else {
      // Parse JSON result from Swift
      try {
        const result = JSON.parse(resultJson);
        if (result.cancelled) {
          console.log('Result: CANCELLED');
        } else {
          console.log('Result: SAVED');
          console.log('  Name:', result.name);
        }
      } catch (e) {
        console.log('Parse error:', e.message);
        console.log('Raw result:', resultJson);
      }
    }

    currentTest++;

    // Small delay before next test
    setTimeout(runNextTest, 300);
  });
}

// ============================================================================
// Main
// ============================================================================

console.log('=================================');
console.log('  Native Dialog Test Suite');
console.log('  (Swift Version)');
console.log('=================================');
console.log(`Running ${testCases.length} test(s)...`);
console.log('');
console.log('Instructions:');
console.log('  - A dialog will appear for each test');
console.log('  - Type a name and click Save, or click Cancel');
console.log('  - Press Ctrl+C to abort at any time');
console.log('');

// Start event pump (16ms = ~60 FPS)
const eventLoop = setInterval(() => {
  native.pollEvents();

  if (!isRunning) {
    clearInterval(eventLoop);
    process.exit(0);
  }
}, 16);

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nInterrupted by user. Exiting...');
  isRunning = false;
  clearInterval(eventLoop);
  process.exit(0);
});

// Start the first test
runNextTest();
