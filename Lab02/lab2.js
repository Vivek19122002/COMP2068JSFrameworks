const prompt = require('prompt');

console.log('Welcome to the Rock-Paper-Scissors game!');
console.log('Input any one of your choice Rock , Paper , Scissors')
prompt.start();

prompt.get(['userSelection'], (err, result) => 
{
  if (err) 
  {
    console.error('Error reading user input.'); // Checking error for given input.
    return;
  }

    const userSelection = result.userSelection.toUpperCase(); // convert input into uppercase.

    const validChoice = ['ROCK', 'PAPER', 'SCISSORS'].includes(userSelection); // choice to select the option.

    if (!validChoice) 
    {
    console.log('Error: Invalid choice. Please choose ROCK, PAPER, or SCISSORS .'); // This line will display when the user choose wrong option.
    return;
    }

    const systemSelection = generateComputerSelection(); 

    console.log(`User chose: ${userSelection}`);
    console.log(`Computer chose: ${systemSelection}`);

    const output = determineWinner(userSelection, systemSelection);
    console.log(output);
});

function generateComputerSelection()    
{
  const randomNum = Math.random(); //math function for if else statement.

  if (randomNum <= 0.34) //logic for paper.
  {
    return 'PAPER';
  } 
  else if (randomNum <= 0.67) //logic for scissors
  {
    return 'SCISSORS';
  } 
  else 
  {
    return 'ROCK'; //else go for the rock 
  }
}
function determineWinner(userChoice, computerChoice)
{
  if (userChoice === computerChoice) 
  {
    return "It's a tie!";
  } 
  else if  //Condition to check either user loose or win..!
  (
    (userChoice === 'ROCK' && computerChoice === 'SCISSORS') ||
    (userChoice === 'PAPER' && computerChoice === 'ROCK') ||
    (userChoice === 'SCISSORS' && computerChoice === 'PAPER')
  ) 
  {
    return 'User Wins!';
  } 
  else 
  {
    return 'Computer Wins!';
  }
}
