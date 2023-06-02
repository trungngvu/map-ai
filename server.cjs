const http = require("http");
const url = require("url");
const { spawn } = require("child_process");

const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.setHeader("access-control-allow-origin", "*");

  const number1 = parseFloat(queryObject.number1);
  const number2 = parseFloat(queryObject.number2);
  const number3 = parseFloat(queryObject.number3);
  const number4 = parseFloat(queryObject.number4);

  const executablePath = "./astar.exe"; // Path to your C++ executable

  const inputs = [number1, number2, number3, number4]; // Array of double inputs

  const inputString = inputs.join(","); // Convert inputs to a string separated by newlines

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

  const sum = number1 + number2 + number3 + number4;

  //   res.writeHead(200, { "Content-Type": "text/plain" });
  //   res.end(`The sum of the numbers is: ${sum}`);
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
