// FACTORY FUNCTION:    Player
// Description:         The Player object contains properties and methods for 
// instantiation of players for the tic-tac-toe game.
const Player = (name, score, lastMove) => {
    // Setters
    const setName = (input) => {name = input};
    const setScore = (input) => {score = input};
    const setLastMove = (input) => {lastMove = input};

    // Getters
    const getName = () => {return name};
    const getScore = () => {return score};
    const getLastMove = () => {return lastMove};
    const getPlayerDetails = () => {
        return {name, score, lastMove};
    };

    // Returns
    return {
        setName, getName,           // name methods
        setScore, getScore,         // score methods
        setLastMove, getLastMove,   // move methods
        getPlayerDetails            // debug details method
    };
}


// ----------------------------------------------------------------- //


// FACTORY FUNCTION:    BoardSquare
// Description:         The BoardSquare object is a child object of the Board 
// object, and provides child parameters for accessing the individual 
// grid squares during the game.
const BoardSquare = (elementID, row, col, isOccupied, owner) => {
    // Setters
    const setElementID = (input) => {elementID = input};
    const setRow = (input) => {row = input};
    const setCol = (input) => {col = input};
    const setIsOccupied = (input) => {isOccupied = input};
    const setOwner = (input) => {owner = input};


    // Getters
    const getElementID = () => {return elementID};
    const getRow = () => {return row};
    const getCol = () => {return col};
    const getIsOccupied = () => {return isOccupied};
    const getOwner = () => {return owner};


    // Methods


    // Returns
    return {
        setElementID, getElementID,     // elementID methods
        setRow, getRow,                 // row methods
        setCol, getCol,                 // column methods
        setIsOccupied, getIsOccupied,   // isOccupied methods
        setOwner, getOwner              // owner methods
    };
};


// ----------------------------------------------------------------- //


// FACTORY FUNCTION:    Board
// Description:         The Board object contains the logic for "painting" the 
// board with the Xs and Os, triggering "occupation" of BoardSquare 
// elements, and checking for win conditons.
const Board = () => {
    // Private variables
    let boardArray = [];
    const boardQuerySelector= document.querySelector(".gameboard");


    // Setters


    // Getters
    const getBoardArray = () => {return boardArray};
    const getBoardSquareIsOccupied = (elementID) => {
        return boardArray[(elementID - 1)].getIsOccupied();
    };


    // METHODS ---------------------------

    // Private Method:  createBoard
    // Description:     This function handles re-initialization of the 
    // internal board array, and handles instantiation of BoardSquare 
    // child objects.
    const createBoard = () => {
        // Private variables
        let elementIDtoAssign = 1;
        let newBoardSquare;

        // Re-initialize the array if this method is called on an 
        // already-existing array
        if (boardArray.length != 0) {
            boardArray = [];
        };

        // Iterate across each row and column to create the nine grid 
        // squares, instantiating BoardSquare objects.
        for (let rowCount=1;rowCount <=3; rowCount++) {
            for (let colCount=1;colCount<=3;colCount++) {
                newBoardSquare = BoardSquare(elementIDtoAssign,rowCount,colCount, false, "none");
                boardArray.push(newBoardSquare);
                elementIDtoAssign++;
            };
        };
    };


    // Private Method:  occupySquare
    // Description:     This function takes in an elementID and 
    // designated owner, and assigns that BoardSquare object to them.
    // This function also handles "painting" or "drawing" the game
    // board as it's updated.
    const occupySquare = (occupyID, owner) => {
        // Select the correct element of the array by elementID
        let element = boardArray[(occupyID - 1)];
        let symbol;
        let textColor;
        const gridSquareToDraw = document.getElementById(occupyID);

        // If a space is marked as unoccupied, occupy it
        if (!element.getIsOccupied()) {
            element.setIsOccupied(true);
            element.setOwner(owner);
        };

        // Select appropriate symbol based off of owner
        switch (owner) {
            case "player1":
                symbol = "X";
                textColor = "var(--accent-color)";
                break;
            case "player2":
                symbol = "O";
                textColor = "var(--font-alternative-color)";
                break;
        };

        // "Draw" symbol to board
        gridSquareToDraw.textContent = symbol;
        gridSquareToDraw.style.color = textColor;

    };

    // Private Method:  checkForWin
    // Description:     This function takes in a desired owner whose 
    // state of the board we'd like to evaluate, and then checks their 
    // board state against all possible win conditions.
    const checkForWin = (recentMove, checkForOwnershipBy) => {
        // The following sub-arrays are all possible win conditions of 
        // tic-tac-toe. I feel like I could have found a more 
        // efficient way of doing this, but here it is.
        let winConditionArray = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],    // Horizontal wins
            [1, 4, 7], [2, 5, 8], [3, 6, 9],    // Vertical wins
            [1, 5, 9], [3, 5, 7]                // Diagonal wins
        ];

        // Import the current state of the board for one player
        let currentStatusArray = [];
        boardArray.forEach((square) => {
            if (square.getOwner() == checkForOwnershipBy) {
                currentStatusArray.push(square.getElementID());
            };
        });

        // Check current status of board for any matching win conditions
        let matches;

        // This loop verifies that the board's status includes
        for(let conditionCount = 0;conditionCount < winConditionArray.length;conditionCount++) {
            matches = 0;
            for(let elem = 0;elem < currentStatusArray.length; elem++) {
                if (winConditionArray[conditionCount].includes(currentStatusArray[elem])) {
                    matches++;
                };
            };

            // Game over due to player victory
            if (matches == 3) {
                return true;
            };
        };

        return false;
        
    };


    // Returns
    return {
        boardQuerySelector, 
        getBoardArray, getBoardSquareIsOccupied,
        createBoard, occupySquare, checkForWin
    };
};


// ----------------------------------------------------------------- //


// FACTORY FUNCTION:    Game
// Description:         The Game object houses the main loop and 
// iterative logic, as well as event handling and manipulation of 
// dynamic DOM content.
const Game = () => {
    // Private variables
    let gameWasReset = true;        // Game reset flag
    let currentPlayer = "player1";  // Current player
    let turnCount;
    let gameOver = false;

    const dialogBox = document.getElementById("game-result-dialog");
    const resultText = document.querySelector(".dialog-text");
    const player1Score = document.getElementById("player1-score");
    const player2Score = document.getElementById("player2-score");
    const gameOverText = document.querySelector(".floating-text");
    

    // Consctructors
    const newBoard = Board();
    const newPlayer1 = Player("Player 1 [X]", 0, "none");
    const newPlayer2 = Player("Player 2 [O]", 0, "none");
    

    // METHODS ---------------------------
    // Private Method:  newGame
    // Description:     This function creates a new instance of the 
    // Board object, resets the turn counter, and removes unneeded 
    // dynamic content.
    const newGame = () => {
        // Create new gameboard
        newBoard.createBoard();
        turnCount = 0;
        gameOverText.hidden = true;
    };


    // Private Method:  doMainLoop
    // Description:     This function is the core gameplay loop. All 
    // gameplay is based completely on event listener triggers.
    const doMainLoop = (event) => {
        // Select the current player
        switch (currentPlayer) {
            case "player1":
                // Process move
                newPlayer1.setLastMove(event.target.id);
                newBoard.occupySquare(event.target.id, "player1");
                
                // Swap to next player
                currentPlayer = "player2";
                break;
            case "player2":
                // Process move
                newPlayer2.setLastMove(event.target.id);
                newBoard.occupySquare(event.target.id, "player2");
                
                // Swap to next player
                currentPlayer = "player1";
                break;
        };
        turnCount++;
        
        // Check for result and create dynamic content to reflect result
        if (newBoard.checkForWin(newPlayer1.getLastMove(),"player1")) {
            // Check for win
            resultText.textContent = `${newPlayer1.getName()} wins!\nPlay again?`;
            
            // Update score
            newPlayer1.setScore(newPlayer1.getScore() + 1);
            player1Score.textContent = newPlayer1.getScore();
            
            // Confirm continuation with user
            dialogBox.showModal();
        } else if (newBoard.checkForWin(newPlayer2.getLastMove(),"player2")) {
            // Check for win
            resultText.textContent = `${newPlayer2.getName()} wins!\nPlay again?`;

            // Update score
            newPlayer2.setScore(newPlayer2.getScore() + 1);
            player2Score.textContent = newPlayer2.getScore();

            // Confirm continuation with user
            dialogBox.showModal();
        } else {
            // If no grid squares remain, terminate the round
            if (turnCount == 9) {
                resultText.textContent = `Strange game, Professor.\n
                The only winning move is not to play.\n
                Exercise futility once more?`;
                dialogBox.showModal();
            };
        };
    }


    // EVENT HANDLERS ---------------------------
    // Listener: Clicking BoardSquare objects
    newBoard.boardQuerySelector.addEventListener("click", (event) => {
        if (!gameOver) {
            if (newBoard.getBoardSquareIsOccupied(event.target.id)) {
                console.log("That square is already occupied.");
            } else {
                doMainLoop(event);
            };    
        };

    });

    // Listener: Clicking dialog box objects
    dialogBox.addEventListener("click", (event) => {
        switch (event.target.id) {
            case "quit-button":
                dialogBox.close();
                gameOver = true;
                gameOverText.hidden = false;
                break;
            case "continue-button":
                dialogBox.close();

                // Reset the gameboard
                newBoard.createBoard();
                turnCount = 0;
                currentPlayer = "player1";
                const allSquares = document.querySelectorAll(".grid-square");
                allSquares.forEach((square) => {
                    square.textContent = "";
                });
                break;
        };
    });

    // Returns
    return {gameWasReset, newGame};
};





// GLOBAL LOOP
const newGameInstance = Game();
newGameInstance.newGame();





// O R I G I N A L   W R I T E   U P
// This is going to be a lot more complex than I thought.
//
// So the overall game process seems pretty straightforward:
//
// GAME FLOW:
// - Select a random player (user or the CPU) to go first
// - That player selects a square.  CPU should weight its decisions
// to optimize its chances of "winning".
// - CPU turns should evaluate the board and make decisions
// - - CPU should always be defensive first, choosing to "block" 
// potential player winning moves.
// - - If there are no defensive moves to be made, CPU should select
// squares that increase the chances of completing a line (the win 
// condition).
// - The game concludes when a line is drawn (victory/defeat) or when
// there are no more spaces to move (draw).
// - Scores should be updated to reflect the result.
//
// CPU TURN FLOW:
// - Starting turn: CPU should select a corner, the strongest possible
// starting move.
// - After user:
// - - User move check: CPU should check user's move against a 
// potential win condition.  If the square the user chose is isolated,
// the CPU should instead priotize finding its own squares and 
// completing lines.  If the user's move threatens to complete a line,
// the CPU should block that move by occupying the logical remaining
// square.
//
// EXAMPLE FLOW:
//  1. CPU moves into 3.
//  2. USER moves into 5.
//  3a. CPU should realize that 3-5-7 is not a winning line anymore
//  and avoid occupying square 7.
//  3b. CPU moves into 2.
//  4. User ideally blocks 1-2-3 by occupying 1.
//  5. CPU should realize it was blocked and that 1-5-9 is now a
//  threatening win condition.  CPU occupies 9.
//  6. User ideally blocks 3-6-9 by occupying 6.
//  7. CPU should realize it was blocked and that 4-5-6 is now a
//  threatening win condition.  CPU occupies 4.
//  8. At this stage, winning is impossible.  User will select either
//  of the remaining squares.
//  9. CPU will take the last square, triggering a "all squares full"
//  state, and ending the game in a draw.
//
//
// Make reference to WarGames? "What a strange game, professor. The
// only winning move is not to play. How about a nice game of chess?"