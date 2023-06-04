/* eslint-disable no-undef */
const http = require("http");
const url = require("url");
const { spawn } = require("child_process");

const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.setHeader("access-control-allow-origin", "*");

  const number1 = parseFloat(queryObject.startX);
  const number2 = parseFloat(queryObject.startY);
  const number3 = parseFloat(queryObject.endX);
  const number4 = parseFloat(queryObject.endY);

  const executablePath = "./astar.exe"; // Path to your C++ executable

  const inputs = [number1, number2, number3, number4]; // Array of double inputs

  const inputString = inputs.join(","); // Convert inputs to a string separated by ,

  let scriptOutput = "";

  const childProcess = spawn(executablePath);
  // Pass input to the spawned process
  childProcess.stdin.write(inputString);
  childProcess.stdin.end();

  childProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    data = data.toString();
    scriptOutput += data;
  });

  childProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  childProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(scriptOutput));
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
