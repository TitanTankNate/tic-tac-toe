console.log("Test");

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
//  8. At this stage, winning is impossibl.  User will select either
//  of the remaining squares.
//  9. CPU will take the last square, triggering a "all squares full"
//  state, and ending the game in a draw.
//
//
// Make reference to WarGames? "What a strange game, professor. The
// only winning move is not to play. How about a nice game of chess?"