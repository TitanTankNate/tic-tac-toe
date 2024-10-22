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



// FACTORY FUNCTION: ComputerPlayer
// Description:
const ComputerPlayer = (name, score, lastMove, difficulty) => {
    // Setters
    const setName = (input) => {name = input};
    const setScore = (input) => {score = input};
    const setLastMove = (input) => {lastMove = input};
    const setDifficulty = (input) => {difficulty = input};

    // Getters
    const getName = () => {return name};
    const getScore = () => {return score};
    const getLastMove = () => {return lastMove};
    const getCPUDetails = () => {
        return {name, score, lastMove};
    };
    const getDifficulty = () => {return difficulty};

    // Methods
    const pickMove = (array, lastPlayerMove, gameWasReset) => {
        // Private functions
        // FUNCTION: weightedRandomNum
        // Description:
        // Attribution: https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
        function weightedRandomNum(options) {
            let i;
            let sum=0;
            numberChosen=Math.random();
            for (i in options) {
              sum += options[i];
              if (numberChosen <= sum) return i;
            };
          };
          
        // Variables
        let chosenMoveElementID;

        // If no squares are occupied (game start/reset), pick
        // a random square to start in.
        if (gameWasReset) {
            console.log("CPU will pick a square for the new game.");
            // At lowest difficulty, CPU should select the middle 
            // square, ID: 5.  At highest, it should pick a corner.
            switch(difficulty) {
                // On "easy" difficulty, the CPU is likely to make the
                // mistake of choosing the center square, with all 
                // other squares equally less likely.
                case 0:
                    chosenMoveElementID = weightedRandomNum({
                        1:0.03, 2:0.03, 3:0.03,
                        4:0.03, 5:0.76, 6:0.03, 
                        7:0.03, 8:0.03, 9:0.03
                    });
                    break;
                // On "medium" difficulty, the CPU will truly move 
                // "randomly" for fairness.
                case 1:
                    chosenMoveElementID = Math.ceil(Math.random()*9);
                    break;
                // On "hard" difficulty, the CPU is most likely to 
                // pick the corners, but might still select a side or
                // the center square.
                case 2:
                    chosenMoveElementID = weightedRandomNum({
                        1:0.16, 2:0.08, 3:0.16,
                        4:0.08, 5:0.04, 6:0.08, 
                        7:0.16, 8:0.08, 9:0.16
                    });
                    break;
                // On "impossible" difficulty, the CPU will always
                // unfairly pick a corner square.  The only thing
                // random is the choice of corner.
                case 3:
                    chosenMoveElementID = weightedRandomNum({
                        1:0.25, 2:0.00, 3:0.25,
                        4:0.00, 5:0.00, 6:0.00, 
                        7:0.25, 8:0.00, 9:0.25
                    });
                    break;
            };

            // console.log(chosenMoveElementID);
            return chosenMoveElementID;
        } else {
            console.log("CPU will pick the next square.");
            console.log("Player last moved into square " + lastPlayerMove);
            // Evaluate all adjacent squares for potential win conditions

        };
    };

    // Returns
    return {
        setName, getName,           // 'name' methods
        setScore, getScore,         // 'score' methods
        setLastMove, getLastMove,   // 'move' methods
        getCPUDetails,
        setDifficulty, getDifficulty,
        pickMove
    };
}



// FACTORY FUNCTION: BoardSquare
// Description: 
const BoardSquare = (elementID, row, col, isOccupied) => {
    // Setters
    
    // Getters

    // Methods

    // Returns
    return {
        elementID, row, col, isOccupied
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
        return boardArray[(elementID - 1)].isOccupied;
    };

    // Methods
    const createBoard = () => {
        // Private variables
        let elementIDtoAssign = 1;
        let newBoardSquare;

        for (let rowCount=1;rowCount <=3; rowCount++) {
            for (let colCount=1;colCount<=3;colCount++) {
                newBoardSquare = BoardSquare(elementIDtoAssign,rowCount,colCount, false);
                boardArray.push(newBoardSquare);
                elementIDtoAssign++;
            };
        };
    };

    const occupySquare = (occupyID) => {
        // Select the correct element of the array by elementID
        let element = boardArray[(occupyID - 1)];

        // If a space is marked as unoccupied, occupy it
        if (!element.isOccupied) {
            element.isOccupied = true;
        };
    };

    const checkSurroundingSquares = (elementIDtoCheck) => {

    };

    // Returns
    return {
        boardQuerySelector, 
        getBoardArray, getBoardSquareIsOccupied,
        createBoard, occupySquare, checkSurroundingSquares
    };
};



// FACTORY FUNCTION: Game
// Description:
const Game = () => {
    // Private variables
    let gameWasReset = true;        // Game reset flag
    let currentMove;                // Currently selected grid
    let currentPlayer = "CPU";      // Current player
    
    // Consctructors
    const newBoard = Board();
    const newPlayer = Player("Player", 0, "none");
    const newCPU = ComputerPlayer("CPU", 0, "none", 1);
    
    // Methods
    const newGame = () => {
        // Create new gameboard
        newBoard.createBoard();
        // console.log(newBoard.getBoardArray());
    };

    const doMainLoop = (player) => {
        switch (player) {
            case "Player":
                // Do something with visuals
                break;
            case "CPU":
                console.log(`It's ${newCPU.getName()}'s turn.`);
                if (gameWasReset) {
                    console.log("Game was reset.");
                    currentMove = newCPU.pickMove(newBoard.getBoardArray(), "none", true);
                    gameWasReset = false;
                } else {
                    console.log("Game was not reset.");
                    currentMove = newCPU.pickMove(newBoard.getBoardArray(), newPlayer.getLastMove(), false);
                };

                newCPU.setLastMove(currentMove);
                newBoard.occupySquare(currentMove);
                console.log("Last move: " + newCPU.getLastMove());
                currentPlayer = "Player";
                console.log(`It's ${newPlayer.getName()}'s turn.`);
                break;
        };
    };

    // Event handlers
    newBoard.boardQuerySelector.addEventListener("click", (event) => {
        // If current player is the human, pick a square, otherwise 
        // do nothing.
        if (currentPlayer == "Player") {
            // If selected square is occupied, inform user and do nothing
            if(!newBoard.getBoardSquareIsOccupied(event.target.id)) {
                console.log("Selected square " + event.target.id);
                newPlayer.setLastMove(event.target.id);
                currentPlayer = "CPU";
                newGameInstance.doMainLoop("CPU");
            } else {
                console.log("That square is already occupied.");
                newGameInstance.doMainLoop("Player");
            };    

        } else {
            console.log("Not your turn.");
        }
    });

    // Returns
    return {gameWasReset, newGame, doMainLoop};
};

const newGameInstance = Game();
newGameInstance.newGame();
newGameInstance.doMainLoop("CPU");





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