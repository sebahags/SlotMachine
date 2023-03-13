const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};


// 1. Depo some money
const deposit = () => {

    // Get the amount to deposit from the user
    while (true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.");
        }
        else{
            return numberDepositAmount
        }
    }
};


// 2. Determine number of lines to bet on
const getNumberOfLines = () => {

    // Get the amount of lines the user wants to bet on
    while (true){
        const lines = prompt("Enter the number of lines you want to play(1-3): ");
        const numberOfLines = parseFloat(lines);

        // Check that given input is number and between 1 and 3
        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.");
        }
        else{
            return numberOfLines
        }
    }
};


// 3. Collect the bet amount
const getBet = (balance, lines) => {
    
    // Get the amount the user wants to bet per line
    while (true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
        
        // Check that the given input is number over 0 and is not over balance
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines){
            console.log("Invalid amount of bet, try again.");
        }
        else{
            return numberBet
        }
    }
};


// 4. Spin the slot
const spin = () => {

    // Spin the slot and draw random set of symbols given in SYMBOLS_COUNT

    // Add all the symbols from SYMBOLS_COUNT to temp list called symbols
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    
    // Generate a list called reels that holds the actual rows of symbols drawn randomly
    const reels = [];
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        //Copy list called symbols into temp list that can be manipulated according to the draw
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    // return the randomly generated list of rows from the symbols in the list SYMBOLS_COUNT
    return reels;
};


// 5. Check if user won
const transpose = (reels) => {

    // The reels are actually lists of columns, so they need to be transposed
    // That means that we wan't to make the first list of 3 symbols to be the first symbols in each sub-list representing the columns
    // Add the new sublists representing the rows to a new list called rows and return it
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([])
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {

    // Print the drawn rows to the user in a understandable way
    for (const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol;
            if (i != row.length -1){
                rowString += " | ";
            }
        }
        
        console.log(rowString);
    }
};


// 6. Payout
const payoutWinnings = (rows, bet, lines) => {

    // Check if the drawn rows has the all 3 same symbols or not
    // In case they are same calculate winnings
    let winnings = 0;

    for (let row = 0; row < lines; row++){
        // Take one row in a time and copy the symbols to list symbols
        const symbols = rows[row];
        let allSame = true;

        // iterate through the list symbols by each symbol and compare with the first one 
        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        // In case all same, calculate winnings, multiply bet per line with the odds given in SYMBOL_VALUES
        if (allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
}


// 7. Play again
const game = () => {

    // The game-loop
    let balance = deposit();
    while (true){
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = payoutWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0){
            console.log("Your balance is zero.")
            break;
        }

        const playAgain = prompt("Do you wanna play again? Input (y/n): ");

        if (playAgain != "y" && playAgain != "Y"){
            break;
        }
    }
}

game();