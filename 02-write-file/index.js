import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fileStream = fs.createWriteStream('./02-write-file/output.txt', { flags: 'a' });

console.log('Welcome! Please enter text (enter "exit" to finish):');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Good bye!');
    rl.close();
    process.exit();
  } else {
    fileStream.write(input + '\n');
    console.log('The text has been written to the file. Please enter the next text:');
  }
});

rl.on('SIGINT', () => {
  console.log('\nGood bye!');
  rl.close();
  process.exit();
});