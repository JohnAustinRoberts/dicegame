//declare variables
let players = [{"name": " ", "score":0, "id":1}, {"name": " ", "score":0, "id":2}];
let currentRoller = 0;
let currentNonRoller = 1;
let currentRoll = 1;
let currentRollResults = [];
let diceResult = 0;
let currentWinStatus = false;

//hide non-title html elements to only show title
$('#gameMenu').hide();
$('#playScreen').hide();
$('#creditsScreen').hide();

//hide title screen and show menu to add player names
function loadGameMenu() {
    $('#titleScreen').hide();
    $('#gameMenu').show();
}

//grab input from player names and set the objects in the players array to the input values
function setNames() {
    players[0].name = $('#player1NameInput').val();
    players[1].name = $('#player2NameInput').val();
    players[0].score = $("#startingMoneyInput").val();
    players[1].score = $("#startingMoneyInput").val();
    console.log(players); 
    //load the actual game screen
    loadGame();
}
//load the main game screen
function loadGame(){
    $('#gameMenu').hide();
    $('#player1Name').html(players[0].name);
    $('#player2Name').html(players[1].name);
    $('#player1Score').html('$'+players[0].score);
    $('#player2Score').html('$'+players[1].score);
    $('#playScreen').show();
}


//update point tracker with current diceresult after first roll
function updatePointTracker(){
    console.log('updating point tracker');
    let pointTrackerNumber = currentRollResults.length;
    let idBuilder = '#pointTracker' + pointTrackerNumber;
    $(idBuilder).html(diceResult);
}

function showRecap() {
    $('#recapScreen').show();
    //disable roll button
}

function resetGameBoard () {
    $('#recapScreen').hide();
    $("#pointTracker1").html(" ");
    $("#pointTracker2").html(" ");
    $("#pointTracker3").html(" ");
    $("#pointTracker4").html(" ");
    $("#pointTracker5").html(" ");
    $("#pointTracker6").html(" "); 
    $("#pointTracker7").html(" ");
    currentRollResults = [];
    currentRoll = 1;
    //re-enable roll button 
    
}

function updateScoreboard() {
    let playerID = currentRoller+1;
    let opponentID = currentNonRoller+1;
    let playerScoreUpdateID = '#player'+playerID+'Score';
    let opponentScoreUpdateID = '#player'+opponentID+'Score';
    $(playerScoreUpdateID).html('$'+players[currentRoller].score);
    $(opponentScoreUpdateID).html('$'+players[currentNonRoller].score);
}

//game logic
//dice roll logic
function diceRoll () {
    //generate 2 random nums between 1 and 6
    let die1 = Math.floor(Math.random() * 6) + 1;
    console.log('die1: ' + die1);
    let die2 = Math.floor(Math.random() * 6) + 1;
    console.log('die2: ' + die2);
    //return diceResult
    diceResult = die1 + die2;
    console.log(diceResult);
    //currentRollResults.push(diceResult)
    checkDice();
}
//check the dice!
function checkDice() {
    console.log('Checking Dice...');
    //console.log(currentRollResults[1]);
    //check for auto-wins or auto-losses
    if(currentRoll == 1 && diceResult === 7 || currentRoll == 1 && diceResult === 11) {
        //Win 1 dollar to score and set currentRoll back to first Roll
        console.log('Winner!')
        players[currentRoller].score++;
        players[currentNonRoller].score--;
        console.log(players[currentRoller])
        console.log("Let's clear the board and you get to roll again!");
        $('#recapScreen').html("<h1>Winner!!</h1><br><p>You've rolled a 7 or 11 on your first roll! Try to roll it again!</p><button onclick='resetGameBoard()'>Next Roll</button>");
        showRecap();
        //resetGameBoard();
        updateScoreboard();
    } else if (currentRoll == 1 && diceResult === 2 || currentRoll == 1 && diceResult === 3 || currentRoll == 1 && diceResult === 12) {
        //Lose 1 dollar to score and set currentRoll back to first Roll
        console.log("Oh no! You've busted! Next Roller!");
        players[currentRoller].score--;
        players[currentNonRoller].score++;
        console.log('current player score: '+ players[currentRoller].score);
        updateScoreboard();
        //Iterate currentRoller by 1 as long as it doesn't go past end of players array, otherwise reset to 0
        changeTurns();
        //resetGameBoard();
        $('#recapScreen').html("<h1>Oh No!! You've Busted!</h1><br><p>You've rolled a 2, 3, or 12 on your first roll! Try to roll it again!</p><button onclick='resetGameBoard()'>Next Roll</button>");
        showRecap();
    } else if(typeof(currentRollResults[0]) == "undefined" && diceResult != 2 && diceResult != 3 && diceResult != 7 && diceResult != 11 && diceResult != 12) {
        console.log('first roll!');
        console.log('Current Dice Result: ' + diceResult);
        console.log('The point has been set at ' + diceResult + '.');
        $("#pointTracker1").html(diceResult);
        currentRollResults.push(diceResult);
        currentRoll++;
    //If it's not the first roll, the point is set, so let's compare to currentRollResultsArray[0] (the point) against our current diceRoll to check for win
    } else if (diceResult === currentRollResults[0]){
        //Win 1 dollar to score and set currentRoll back to first Roll
        console.log('Winner!')
        players[currentRoller].score++;
        players[currentNonRoller].score--;
        updateScoreboard()
        console.log(players[currentRoller])
        console.log("Let's clear the board and Roll again!");
        //resetGameBoard();
        $('#recapScreen').html("<h1>Winner!!</h1><br><p>You've rolled the Point! Let's rack 'em up and do it again!</p><button onclick='resetGameBoard()'>Next Roll</button>");
        showRecap();
    } else {
        let match = false;
        for(i=1;i<currentRollResults.length;i++){
            console.log('checking index ' + i + ':' + currentRollResults[i]);
            if(currentRollResults[i]===diceResult){
            console.log("Oh no! you've rolled the same number twice before rolling the point. Better luck next time.");
            match = true;
            }
        }
        if(match == true) {
            players[currentRoller].score--;
            players[currentNonRoller].score++;
            updateScoreboard();
            //resetGameBoard();
            $('#recapScreen').html("<h1>Oh no!</h1><br><p>You've rolled the same number twice before rolling the point. Better luck next time.</p><br><button onclick='resetGameBoard()'>Next Roll</button>");
            showRecap();
            changeTurns();
        } else {
            currentRollResults.push(diceResult);
            updatePointTracker()
            currentRoll++;
        }
    }
    //     //if it matches, it's a win, add a dollar, and we reset the currentRoll to 1, and clear resultsArray
    //     //if not a match, add result to currentRollResultsArray
    //     //iterate CurrentRoll
}
    // }

function changeTurns () {  
    if(players.length == currentRoller+1){
        currentRoller = 0;
        currentNonRoller = 1;
        $('#player1CurrentRollerToggle').html('<image src="diceRollerIcon.png" alt="roller icon" width="15" height="15"/>');
        $('#player2CurrentRollerToggle').html(' ');
    } else {
        currentRoller++;
        currentNonRoller = 0;
        $('#player1CurrentRollerToggle').html(' ');
        $('#player2CurrentRollerToggle').html('<image src="diceRollerIcon.png" alt="roller icon" width="15" height="15"/>');
    }
    
}

//diceRoll();