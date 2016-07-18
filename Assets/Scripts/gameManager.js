#pragma strict

// This signifies which turn it is.
// 0 is white, 1 is black.
var turn : int = 0;

// This is the chess piece that has been clicked
var activePiece : GameObject;

// This is just used for unhighlighting pieces.
var tempActivePiece : GameObject;

// This is the square it's being moved to.
var destinationSquare : GameObject;

// This is the label that displays the turn.
// It will be replaced later on.
var turnLabel : UI.Text;

// This is an array that holds every square that could possibly 
// be selected that would result in a capture.
var possibleCaptures = new Array ();

// These are the variables that let the game know a castle is available for either side
// 0 = no; 1 = yes
var whiteCastleLeft : int;
var whiteCastleRight : int;
var blackCastleLeft : int;
var blackCastleRight : int;

// A castle is possible this turn.
// 0 = No, 1 = Yes.
var castleDetector : int;

// The move histroy script.
var history : moveHistory;

// The array script
var sendArr : testSendArray;

// Queen Prefabs for promotion
var queenPrefab : GameObject;
var bqueenPrefab : GameObject;

function Start () {

// The castling starts as legal, until something is moved.
whiteCastleLeft = 1;
whiteCastleRight = 1;
blackCastleLeft = 1;
blackCastleRight = 1;

castleDetector = 0;

// Linking the move history script
history = GameObject.FindGameObjectWithTag("history").GetComponent(moveHistory);

// Linking the send array script
sendArr = GameObject.FindGameObjectWithTag("history").GetComponent(testSendArray);

}

function Update () {

    // This updates the turn label, showing which turn
    // it currently is.
    if(turn == 1)
    {
        turnLabel.text = "Current Turn: Black";
    }
    else if(turn == 0)
    {
        turnLabel.text = "Current Turn: White";
    }

}

function setTempActivePiece()
{
	if(turn == 0)
	{
		tempActivePiece = GameObject.FindGameObjectWithTag("Active White Piece");
	}
	else if(turn == 1)
	{
		tempActivePiece = GameObject.FindGameObjectWithTag("Active Black Piece");
	}
}

// This function turns on the castle detector is a castle is a possible move.
function castleDetectorOn()
{
	castleDetector = 1;
}

// This is the function that turns off the castle detector at the end of every turn.
function castleDetectorOff()
{
	castleDetector = 0;
} 

// This function is called when something has happened causeing white to no longer be able to castle to the left.
function whiteCastleLeftOff()
{
	whiteCastleLeft = 0;
}
// This function is called when something has happened causeing white to no longer be able to castle to the right.
function whiteCastleRightOff()
{
	whiteCastleRight = 0;
}
// This function is called when something has happened causeing black to no longer be able to castle to the left.
function blackCastleLeftOff()
{
	blackCastleLeft = 0;
}
// This function is called when something has happened causeing black to no longer be able to castle to the right.
function blackCastleRightOff()
{
	blackCastleRight = 0;
}

// This function finds what piece is active and makes it 
// the inactive piece.
// This currently is not used :/
function resetActivePiece()
{
	if(tempActivePiece == null)
	{

	}
	else
	{
		if(tempActivePiece.tag == "Active White Piece")
		{
			tempActivePiece.tag = "Inactive White Piece";
		} 
		if(tempActivePiece.tag == "Active Black Piece")
		{
			tempActivePiece.tag = "Inactive Black Piece";
		}
	}

}

// This is used by the ai after a piece is moved, so 
// the turn can cycle back to the human players.
function advanceTurn()
{
	if(turn == 0)
	{
		turn = 1;
	}
	else if(turn == 1)
	{
		turn = 0;
	}
}


function movePiece(location : int)
{

	//Sending the destination to moveHistory
    if(turn == 0)
    {
    	history.whiteTo(location);
    }
    else if (turn == 1)
    {
    	history.blackTo(location);
    }

    // This is where the piece itself will move, with location
    // Being the spot it will move to.  Still need to find a 
    // way to note which piece is being moved.  
    
    // Another temporay string used in finding the right square
    var tempStringMove : String;
    tempStringMove = location.ToString();

    if(turn == 0)
    {
        activePiece = GameObject.FindGameObjectWithTag("Active White Piece");
    }
    else if (turn == 1)
    {
        activePiece = GameObject.FindGameObjectWithTag("Active Black Piece");
    }

    destinationSquare = GameObject.Find(tempStringMove);

     // This means of all the choices available for the move, at least one of them 
    // is a castle.  We have to weed out to see if a castle move was chosen.
    if(castleDetector == 1)
    {
    	// Need to check to see if the castle did happen.
    	if(activePiece.name == "White King" || activePiece.name == "Black King")
    	{
    		// A king is the active piece, now to see where it moves.

    		// Finding the script that is attached to the king.
    		var kingScript : king;
    		kingScript = activePiece.GetComponent(king);
    		var tempRook : GameObject;

    		// The king is on the bottom, and is castling to the left.
    		if(kingScript.square == 60 && location == 57)
    		{
    			// Finding the correct rook and moving it.
    			tempRook = GameObject.Find("Left Bottom Rook");
    			tempRook.transform.position.x = -1.5;
    			tempRook.transform.position.y = -3.5;
    		}
    		else if(kingScript.square == 60 && location == 62)
    		{
    			// Finding the correct rook and moving it.
    			tempRook = GameObject.Find("Right Bottom Rook");
    			tempRook.transform.position.x = 1.5;
    			tempRook.transform.position.y = -3.5;
    		}
    		else if(kingScript.square == 4 && location == 6)
    		{
    			// Finding the correct rook and moving it.
    			tempRook = GameObject.Find("Right Top Rook");
    			tempRook.transform.position.x = 1.5;
    			tempRook.transform.position.y = 3.5;
    		}
    		else if(kingScript.square == 4 && location == 1)
    		{
    			// Finding the correct rook and moving it.
    			tempRook = GameObject.Find("Left Top Rook");
    			tempRook.transform.position.x = -1.5;
    			tempRook.transform.position.y = 3.5;
    		}



    	}
    }

    // This is called so the box colliders of the squares do not get in
    // the way of the movement of the actual piece.
    resetBoxForAllSquares();

    if(turn == 0)
    {
    	history.whiteFrom(findPosition(activePiece.transform.position.x, activePiece.transform.position.y));
    	sendArr.setEmpty(findPosition(activePiece.transform.position.x, activePiece.transform.position.y));
    }
    else if(turn == 1)
    {
    	history.blackFrom(findPosition(activePiece.transform.position.x, activePiece.transform.position.y));
    	sendArr.setEmpty(findPosition(activePiece.transform.position.x, activePiece.transform.position.y));
    }

    // We move the piece that is active to the place that has been clicked.
    activePiece.transform.position.x = destinationSquare.transform.position.x;
    activePiece.transform.position.y = destinationSquare.transform.position.y;
    
    // After the movement has occured, the turn switches to the other 
    // player.

    yield WaitForSeconds(.25);

    if(turn == 0)
    {
        activePiece.transform.gameObject.tag = "Inactive White Piece";
        
    }
    else if(turn == 1)
    {
        activePiece.transform.gameObject.tag = "Inactive Black Piece";
    }

    activePiece = null;

    // Turn the castle detector back to zero
    castleDetectorOff();

    // Check to see if any pawns are on the back rows.
    checkForPromotionWhite();

    // Update the array
     sendArr.makeArray();

    // For testing, print the array
    //sendArr.printArray();
   	

    // Turn is over, turn is advanced
    if(turn == 0)
    {
        turn = 1;
    }
    else if(turn == 1)
    {
        turn = 0;
    }  

    yield;

    if(turn == 1)
    {
    	// Send array to the ai
    	sendArr.send();
   
   }
}

// This function changes the box collider for every square so they are easier to click on
function changeBoxForAllSquares()
{
	// A variable for the current square game object
    // being used inside of the for loop.
    var currentSquare : square;

    // This is a placeholder string used for finding 
    // a square inside of the for loop.
    var squareString : String;
    

    for(var i = 0; i < 64; i++)
    {
        squareString = i.ToString();
        currentSquare = GameObject.Find(squareString).GetComponent(square);
        currentSquare.changeBoxCollider();
    }
}

// This function scans every square and resets their box collider back to
// the defualt.
function resetBoxForAllSquares()
{
	// A variable for the current square game object
    // being used inside of the for loop.
    var currentSquare : square;

    // This is a placeholder string used for finding 
    // a square inside of the for loop.
    var squareString : String;
   
    

    for(var i = 0; i < 64; i++)
    {
        squareString = i.ToString();
        currentSquare = GameObject.Find(squareString).GetComponent(square);
        currentSquare.resetBoxCollider();
    }
}

// THis function finds the squares that are legal moves and highlights them.
function squaresToHighlight(legalMoves : Array)
    {

    // This assigns the variable depending on which piece is active.
    // It is used for unselecting the active piece.
    setTempActivePiece();

    // This changes all of the box collider's for every specific square.
    changeBoxForAllSquares();

    // A variable to keep track of how long the array is.
    var lengthOfArray = legalMoves.length;

    // A variable for the current square game object
    // being used inside of the for loop.
    var currentSquare : square;

    // This is a placeholder string used for finding 
    // a square inside of the for loop.
    var squareString : String;
    

    for(var i = 0; i < (lengthOfArray); i++)
    {
        squareString = legalMoves[i].ToString();
        currentSquare = GameObject.Find(squareString).GetComponent(square);
        currentSquare.highlight();
    }
}

 // This function sends a command to every square on the 
 // board to not be highlighted
function unhighlightAllSquares()
{
    // This is a placeholder for the for loop that detects 
    // every square on the board, one at a time.
    var tempSquare : square;

    // This is a placeholder string, that the name of a 
    // square is stored in, after being converted from 
    // an int.
    var tempString : String;

    for(var i : int = 0; i < 65; i++)
    {	
        tempString = i.ToString();
        tempSquare = GameObject.Find(tempString).GetComponent(square);
        tempSquare.unhighlight();
    }
}


// This function accepts two floats, being the 
// x and y coordinates of a piece, and returns
// the number of the square it is in.
// This is used for pieces as well as the 
// the squares themselves.
function findPosition ( x, y : float ) : int
   {

       var currentSquare : int;

    switch (x)
    {
        case -3.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 0;
                    break;
                case 2.5:
                    currentSquare = 8;
                    break;
                case 1.5:
                    currentSquare = 16;
                    break;
                case 0.5:
                    currentSquare = 24;
                    break;
                case -0.5:
                    currentSquare = 32;
                    break;
                case -1.5:
                    currentSquare = 40;
                    break;
                case -2.5:
                    currentSquare = 48;
                    break;
                case -3.5:
                    currentSquare = 56;
                    break;
            }
            break;

        case -2.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 1;
                    break;
                case 2.5:
                    currentSquare = 9;
                    break;
                case 1.5:
                    currentSquare = 17;
                    break;
                case 0.5:
                    currentSquare = 25;
                    break;
                case -0.5:
                    currentSquare = 33;
                    break;
                case -1.5:
                    currentSquare = 41;
                    break;
                case -2.5:
                    currentSquare = 49;
                    break;
                case -3.5:
                    currentSquare = 57;
                    break;
            }
            break;

        case -1.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 2;
                    break;
                case 2.5:
                    currentSquare = 10;
                    break;
                case 1.5:
                    currentSquare = 18;
                    break;
                case 0.5:
                    currentSquare = 26;
                    break;
                case -0.5:
                    currentSquare = 34;
                    break;
                case -1.5:
                    currentSquare = 42;
                    break;
                case -2.5:
                    currentSquare = 50;
                    break;
                case -3.5:
                    currentSquare = 58;
                    break;
            }
            break;

        case -0.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 3;
                    break;
                case 2.5:
                    currentSquare = 11;
                    break;
                case 1.5:
                    currentSquare = 19;
                    break;
                case 0.5:
                    currentSquare = 27;
                    break;
                case -0.5:
                    currentSquare = 35;
                    break;
                case -1.5:
                    currentSquare = 43;
                    break;
                case -2.5:
                    currentSquare = 51;
                    break;
                case -3.5:
                    currentSquare = 59;
                    break;
            }
            break;

        case 0.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 4;
                    break;
                case 2.5:
                    currentSquare = 12;
                    break;
                case 1.5:
                    currentSquare = 20;
                    break;
                case 0.5:
                    currentSquare = 28;
                    break;
                case -0.5:
                    currentSquare = 36;
                    break;
                case -1.5:
                    currentSquare = 44;
                    break;
                case -2.5:
                    currentSquare = 52;
                    break;
                case -3.5:
                    currentSquare = 60;
                    break;
            }
            break;

        case 1.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 5;
                    break;
                case 2.5:
                    currentSquare = 13;
                    break;
                case 1.5:
                    currentSquare = 21;
                    break;
                case 0.5:
                    currentSquare = 29;
                    break;
                case -0.5:
                    currentSquare = 37;
                    break;
                case -1.5:
                    currentSquare = 45;
                    break;
                case -2.5:
                    currentSquare = 53;
                    break;
                case -3.5:
                    currentSquare = 61;
                    break;
            }
            break;

        case 2.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 6;
                    break;
                case 2.5:
                    currentSquare = 14;
                    break;
                case 1.5:
                    currentSquare = 22;
                    break;
                case 0.5:
                    currentSquare = 30;
                    break;
                case -0.5:
                    currentSquare = 38;
                    break;
                case -1.5:
                    currentSquare = 46;
                    break;
                case -2.5:
                    currentSquare = 54;
                    break;
                case -3.5:
                    currentSquare = 62;
                    break;
            }
            break;
            
        case 3.5:
            switch (y)
            {
                case 3.5:
                    currentSquare = 7;
                    break;
                case 2.5:
                    currentSquare = 15;
                    break;
                case 1.5:
                    currentSquare = 23;
                    break;
                case 0.5:
                    currentSquare = 31;
                    break;
                case -0.5:
                    currentSquare = 39;
                    break;
                case -1.5:
                    currentSquare = 47;
                    break;
                case -2.5:
                    currentSquare = 55;
                    break;
                case -3.5:
                    currentSquare = 63;
                    break;
            }
            break;
            
       }

    return currentSquare;
}


// This runs to see if a pawn has made it to one of the back rows.
function checkForPromotionWhite()
{
	var listOfPieces = new Array();
	var listOfPawns = new Array();
	var tempPiece : GameObject;
	var tempScript : pawn;

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive White Piece");

	for (var i : int = 0; i < listOfPieces.length; i++)
	{
		tempPiece = listOfPieces[i];
		if(tempPiece.name == "pawn" || tempPiece.name == "pawn (1)" || tempPiece.name == "pawn (2)" || tempPiece.name == "pawn (3)" || tempPiece.name == "pawn (4)" || tempPiece.name == "pawn (5)" || tempPiece.name == "pawn (6)" || tempPiece.name == "pawn (7)")
		{
			listOfPawns.Push(tempPiece);
		}
	}

	for (var j : int = 0; j < listOfPawns.length; j++)
	{
		tempPiece = listOfPawns[j];
		tempScript = tempPiece.GetComponent(pawn);
		if(tempScript.returnPosition() / 8 == 0)
		{
			var posX = tempPiece.transform.position.x;
			var posY = tempPiece.transform.position.y;
			Destroy(tempPiece);
			yield;
			Instantiate(queenPrefab, new Vector3(posX, posY, -1), Quaternion.identity);
		}
	}

}

function checkForPromotionBlack()
{
	yield;
	var listOfPieces = new Array();
	var listOfPawns = new Array();
	var tempPiece : GameObject;
	var tempScript : pawn;

	print("bcheck1");

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive Black Piece");

	for (var i : int = 0; i < listOfPieces.length; i++)
	{
		tempPiece = listOfPieces[i];
		if(tempPiece.name == "blackPawn" || tempPiece.name == "blackPawn (1)" || tempPiece.name == "blackPawn (2)" || tempPiece.name == "blackPawn (3)" || tempPiece.name == "blackPawn (4)" || tempPiece.name == "blackPawn (5)" || tempPiece.name == "blackPawn (6)" || tempPiece.name == "blackPawn (7)")
		{
			listOfPawns.Push(tempPiece);
		}
	}

	for (var j : int = 0; j < listOfPawns.length; j++)
	{
		print("bcheck2");
		tempPiece = listOfPawns[j];
		tempScript = tempPiece.GetComponent(pawn);
		if(tempScript.row == 8)
		{
			var posX = tempPiece.transform.position.x;
			var posY = tempPiece.transform.position.y;
			Destroy(tempPiece);
			yield;
			Instantiate(bqueenPrefab, new Vector3(posX, posY, -1), Quaternion.identity);
		}
	}

}