const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { recieveThrift } = require('../Controllers/ThriftController'); // Adjust this path as needed

// Path to the run count file
const runCountFilePath = path.join(__dirname, 'runCount.json');

// Function to read the run count from the file
const readRunCount = () => {
  if (!fs.existsSync(runCountFilePath)) {
    writeRunCount(0);
  }
  const data = fs.readFileSync(runCountFilePath);
  const { runCount } = JSON.parse(data);
  return runCount;
};

// Function to write the run count to the file
const writeRunCount = (runCount) => {
  const data = JSON.stringify({ runCount });
  fs.writeFileSync(runCountFilePath, data);
};

// Function to execute the task
const executeTask = async () => {
  const now = new Date();
  console.log('Running task:', now);

  // Replace 'your-thrift-id' with the actual thrift ID you want to process
  const thriftId = "668ac3f44fcbfb18f3502154";
  await recieveThrift(thriftId);
};

// Schedule the task to run every 7 days
// const task = cron.schedule('0 0 */7 * *', async () => {
const task = cron.schedule('* * * * * *', async () => {
  let runCount = readRunCount();
  runCount++;

  if (runCount <= 13) {
    await executeTask();
    writeRunCount(runCount);

    if (runCount === 13) {
      task.stop();
      console.log('The thrift is completed');
    }
  }
}, {
  scheduled: true,
  // timezone: "Your/Timezone" 
});

// Function to start the cron job
const startCronJob = async () => {
  task.start();

  // Execute the task immediately for the first run
  if (readRunCount() === 0) {
    await executeTask();
    writeRunCount(1);
  }
};

module.exports = { startCronJob };
