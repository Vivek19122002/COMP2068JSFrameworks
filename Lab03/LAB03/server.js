const connect = require('connect');
const url = require('url');

const app = connect();

function calculate(method, x, y) //x and y method parameters for query string.
{
  switch (method) 
  {
    case 'add':
      return { operation: `${x} + ${y}`, result: x + y };
    case 'subtract':
      return { operation: `${x} - ${y}`, result: x - y };
    case 'multiply':
      return { operation: `${x} * ${y}`, result: x * y };
    case 'divide':
      return { operation: `${x} / ${y}`, result: x / y };
    default:
      return null;
  }
}

app.use((req, res) => 
 {
  const parsedUrl = url.parse(req.url, true);
  const { method, x, y } = parsedUrl.query; // Destructure the values from parsedUrl.query

  const isValid = method && typeof x === 'string' && !isNaN(Number(x)) && typeof y === 'string' && !isNaN(Number(y));

  if (!isValid) //validation method.
  {
    res.end('Error! Invalid parameters. Please provide method, x, and y in the URL.');
    return;
  }

  const calcResult = calculate(method, Number(x), Number(y));//code to perform math operation.

  if (calcResult === null) 
  {
    res.end(`Invalid method: ${method}. You can only choose methods such as add, subtract, multiply, and divide.`);
    return;
  }

  const output = `${calcResult.operation} = ${calcResult.result}`;
  res.end(output);
});

app.listen(3002, () => //code for the URL
{
  console.log('Server is running on http://localhost:3002');
});
