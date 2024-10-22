// FACTORY FUNCTION: Player
// Description: 
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
        setName, getName,           // 'name' methods
        setScore, getScore,         // 'score' methods
        setLastMove, getLastMove,    // 'move' methods
        getPlayerDetails
    };
}



// FACTORY FUNCTION: BoardSquare
// Description: 
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
        setElementID, getElementID,     // Element ID methods
        setRow, getRow,                 // Row methods
        setCol, getCol,                 // Column methods
        setIsOccupied, getIsOccupied,   // isOccupied methods
        setOwner, getOwner              // Owner methods
    };
};



// FACTORY FUNCTION: Board
// Description: 
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

    // Methods
    const createBoard = () => {
        // Private variables
        let elementIDtoAssign = 1;
        let newBoardSquare;

        for (let rowCount=1;rowCount <=3; rowCount++) {
            for (let colCount=1;colCount<=3;colCount++) {
                newBoardSquare = BoardSquare(elementIDtoAssign,rowCount,colCount, false, "none");
                boardArray.push(newBoardSquare);
                elementIDtoAssign++;
            };
        };
    };

    const occupySquare = (occupyID, owner) => {
        // Select the correct element of the array by elementID
        let element = boardArray[(occupyID - 1)];

        // If a space is marked as unoccupied, occupy it
        if (!element.getIsOccupied()) {
            element.setIsOccupied(true);
            element.setOwner(owner);
            console.log(element.getIsOccupied(), element.getOwner());
        };
    };

    const checkForWin = (recentMove, checkForOwnershipBy) => {
        let elementToCheck;
        let constraints = [elementToCheck < 0, elementToCheck > 9];

        // Check SE
        elementToCheck = parseInt(recentMove) + 4;
        if (constraints.includes(false)) {
            console.log(elementToCheck + " out of bounds.");
        } else {
            console.log("Checking " + elementToCheck);
        }
        console.log(boardArray[elementToCheck].getIsOccupied());
    }

    // Returns
    return {
        boardQuerySelector, 
        getBoardArray, getBoardSquareIsOccupied,
        createBoard, occupySquare, checkForWin
    };
};



// FACTORY FUNCTION: Game
// Description:
const Game = () => {
    // Private variables
    let gameWasReset = true;        // Game reset flag
    let currentMove;                // Currently selected grid
    let currentPlayer = "player1";  // Current player
    
    // Consctructors
    const newBoard = Board();
    const newPlayer1 = Player("player1", 0, "none");
    const newPlayer2 = Player("player2", 0, "none");
    
    // Methods
    const newGame = () => {
        // Create new gameboard
        newBoard.createBoard();
    };

    const doMainLoop = (player) => {
        switch (player) {
            case "player1":
                // Do something with visuals
                console.log("It's player1's turn.");
                break;
            case "player2":
                console.log("It's player2's turn.");
                break;
        };
    };

    // Event handlers
    newBoard.boardQuerySelector.addEventListener("click", (event) => {
        if (newBoard.getBoardSquareIsOccupied(event.target.id)) {
            console.log("That square is already occupied.");
            doMainLoop(currentPlayer);
        } else {
            switch (currentPlayer) {
                case "player1":
                    // Process move
                    newPlayer1.setLastMove(event.target.id);
                    newBoard.occupySquare(event.target.id, "player1");
                    
                    // Check for victory
                    newBoard.checkForWin(newPlayer1.getLastMove(),"player1");
                    
                    // Swap to next player
                    currentPlayer = "player2";
                    break;
                case "player2":
                    // Process move
                    newPlayer2.setLastMove(event.target.id);
                    newBoard.occupySquare(event.target.id, "player2");
                    
                    // Check for victory
                    newBoard.checkForWin(newPlayer2.getLastMove(),"player2");
                    
                    // Swap to next player
                    currentPlayer = "player1";
                    break;
            };
            doMainLoop(currentPlayer);    
        };

    });

    // Returns
    return {gameWasReset, newGame, doMainLoop};
};

const newGameInstance = Game();
newGameInstance.newGame();
newGameInstance.doMainLoop("player1");





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