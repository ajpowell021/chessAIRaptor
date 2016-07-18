//#pragma strict


// This started as a test script and accidentially became super important to connecting
// the AI and UI.  Unfortunatley, I can't change the name of it now. :(
// - Adam

// The pieces 
var pawnScript : pawn;
var rookScript : rook;
var bishopScript : bishop;
var knightScript : knight;
var queenScript : queen;
var kingScript : king; 


var runner : RunAI;

var testArray = [[0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0]];
				


function Start () {
    print("Sending array to RunAI");
	runner = this.GetComponent("RunAI");

	makeArray();

}

function Update () {

	
}

// Actually sends the array to the ai when it is the ai's turn
function send()
{
	runner.getArray(testArray);
}

// This function creates an 8x8 array based on the board currently.
function makeArray()
{
	// Pawn = 1
	// Knight = 3
	// Bisop = 3.1
	// Rook = 5
	// Queen = 9
	// King = 3000

	yield;

	fillInPawns();
	fillInKnights();
	fillInBishops();
	fillInRooks();
	fillInQueens();
	fillInKings();
	//printArray();

	//print("******************************************************");


}

// This function fills in the array with 1's whenever a pawn appears.
// Will have to change to negative 1 for AI
// For now, black pawns are -1, white pawns are 1.
function fillInPawns()
{
	var listOfPieces = new Array();
	var pawnLocation = new Array();
	var tempPiece : GameObject;
	var tempScript : pawn;

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive White Piece");



	// Makes a list filled with the square number the pawns are on.
	for(var i : int = 0; i < listOfPieces.length; i++)
	{
		tempPiece = listOfPieces[i];
		if(tempPiece.name == "pawn" || tempPiece.name == "pawn (1)" || tempPiece.name == "pawn (2)" || tempPiece.name == "pawn (3)" || tempPiece.name == "pawn (4)" || tempPiece.name == "pawn (5)" || tempPiece.name == "pawn (6)" || tempPiece.name == "pawn (7)")
		{
			tempScript = tempPiece.GetComponent(pawn);
			pawnLocation.push(tempScript.returnPosition());
		}
	}

	// Filling in the array to send to the AI
	for(var j : int = 0; j < pawnLocation.length; j++)
	{
		var tempNumber : int;
		tempNumber = pawnLocation[j];
		var col = tempNumber % 8;
		var row = tempNumber / 8;

		testArray[row][col] = -1;
	}

	// Next, the same thing happens for blackPawns
	var blackPawnLocation = new Array();

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive Black Piece");



	// Makes a list filled with the square number the pawns are on.
	for(var x : int = 0; x < listOfPieces.length; x++)
	{
		tempPiece = listOfPieces[x];
		if(tempPiece.name == "blackPawn" || tempPiece.name == "blackPawn (1)" || tempPiece.name == "blackPawn (2)" || tempPiece.name == "blackPawn (3)" || tempPiece.name == "blackPawn (4)" || tempPiece.name == "blackPawn (5)" || tempPiece.name == "blackPawn (6)" || tempPiece.name == "blackPawn (7)")
		{
			tempScript = tempPiece.GetComponent(pawn);
			blackPawnLocation.push(tempScript.returnPosition());
		}
	}

	// Filling in the array to send to the AI
	for(var y : int = 0; y < blackPawnLocation.length; y++)
	{
		tempNumber = blackPawnLocation[y];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = 1;

	}

}

// This puts 3's into the array whenever a knight appears.
function fillInKnights()
{
	var listOfPieces = new Array();
	var whiteKnightLocation = new Array();
	var tempPiece : GameObject;
	var tempScript : knight;

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive White Piece");

	for(var i : int = 0; i < listOfPieces.length; i++)
	{

		tempPiece = listOfPieces[i];
		if(tempPiece.name == "whiteKnight" || tempPiece.name == "whiteKnight (1)")
		{
			tempScript = tempPiece.GetComponent(knight);
			whiteKnightLocation.push(tempScript.returnPosition());
		}

	}

	for(var j : int = 0; j < whiteKnightLocation.length; j++)
	{
		tempNumber = whiteKnightLocation[j];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = -3;

	}

	var blackKnightLocation = new Array();
	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive Black Piece");
	for(var x : int = 0; x < listOfPieces.length; x++)
	{
		tempPiece = listOfPieces[x];
		if(tempPiece.name == "blackKnight" || tempPiece.name == "blackKnight (1)")
		{
		
			tempScript = tempPiece.GetComponent(knight);
			blackKnightLocation.push(tempScript.returnPosition());
		}
	}

	for(var y : int = 0; y < blackKnightLocation.length; y++)
	{
		tempNumber = blackKnightLocation[y];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = 3;

	}
}


// Puts 3.1's into the array wherever bishops appear
function fillInBishops()
{
	var listOfPieces = new Array();
	var whiteBishopLocation = new Array();
	var tempPiece : GameObject;
	var tempScript : bishop;

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive White Piece");

	for(var i : int = 0; i < listOfPieces.length; i++)
	{

		tempPiece = listOfPieces[i];
		if(tempPiece.name == "whiteBishop" || tempPiece.name == "whiteBishop (1)")
		{
			tempScript = tempPiece.GetComponent(bishop);
			whiteBishopLocation.push(tempScript.returnPosition());
		}

	}

	for(var j : int = 0; j < whiteBishopLocation.length; j++)
	{
		tempNumber = whiteBishopLocation[j];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = -4;

	}

	var blackBishopLocation = new Array();
	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive Black Piece");
	for(var x : int = 0; x < listOfPieces.length; x++)
	{
		tempPiece = listOfPieces[x];
		if(tempPiece.name == "black Bishop" || tempPiece.name == "black Bishop (1)")
		{
		
			tempScript = tempPiece.GetComponent(bishop);
			blackBishopLocation.push(tempScript.returnPosition());
		}
	}

	for(var y : int = 0; y < blackBishopLocation.length; y++)
	{
		tempNumber = blackBishopLocation[y];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = 4;

	}
}

// Replaces all of the rooks with 5
function fillInRooks()
{
	var listOfPieces = new Array();
	var topRookLocation = new Array();
	var tempPiece : GameObject;
	var tempScript : rook;

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive Black Piece");

	for(var i : int = 0; i < listOfPieces.length; i++)
	{

		tempPiece = listOfPieces[i];
		if(tempPiece.name == "Left Top Rook" || tempPiece.name == "Right Top Rook")
		{
			tempScript = tempPiece.GetComponent(rook);
			topRookLocation.push(tempScript.returnPosition());
		}

	}

	for(var j : int = 0; j < topRookLocation.length; j++)
	{
		tempNumber = topRookLocation[j];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = 5;

	}

	var botRookLocation = new Array();
	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive White Piece");
	for(var x : int = 0; x < listOfPieces.length; x++)
	{
		tempPiece = listOfPieces[x];
		if(tempPiece.name == "Left Bottom Rook" || tempPiece.name == "Right Bottom Rook")
		{
		
			tempScript = tempPiece.GetComponent(rook);
			botRookLocation.push(tempScript.returnPosition());
		}
	}

	for(var y : int = 0; y < botRookLocation.length; y++)
	{
		tempNumber = botRookLocation[y];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = -5;

	}
}

// This finds the queens and replaces them with 9
function fillInQueens()
{
	var listOfPieces = new Array();
	var topQueen = new Array();
	var tempPiece : GameObject;
	var tempScript : queen;

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive Black Piece");

	for(var i : int = 0; i < listOfPieces.length; i++)
	{

		tempPiece = listOfPieces[i];
		if(tempPiece.name == "blackQueen")
		{
			tempScript = tempPiece.GetComponent(queen);
			topQueen.push(tempScript.returnPosition());
		}

	}

	for(var j : int = 0; j < topQueen.length; j++)
	{
		tempNumber = topQueen[j];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = 9;
	}

	var botQueen = new Array();
	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive White Piece");
	for(var x : int = 0; x < listOfPieces.length; x++)
	{
		tempPiece = listOfPieces[x];
		if(tempPiece.name == "whiteQueen")
		{
		
			tempScript = tempPiece.GetComponent(queen);
			botQueen.push(tempScript.returnPosition());
		}
	}

	for(var y : int = 0; y < botQueen.length; y++)
	{
		tempNumber = botQueen[y];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = -9;
	}

}

// This replaces the king with a 3000
function fillInKings()
{
	var listOfPieces = new Array();
	var topKing = new Array();
	var tempPiece : GameObject;
	var tempScript : king;

	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive Black Piece");

	for(var i : int = 0; i < listOfPieces.length; i++)
	{

		tempPiece = listOfPieces[i];
		if(tempPiece.name == "Black King")
		{
			tempScript = tempPiece.GetComponent(king);
			topKing.push(tempScript.returnPosition());
		}

	}

	for(var j : int = 0; j < topKing.length; j++)
	{
		tempNumber = topKing[j];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = 3000;
	}

	var botKing = new Array();
	listOfPieces = GameObject.FindGameObjectsWithTag("Inactive White Piece");
	for(var x : int = 0; x < listOfPieces.length; x++)
	{
		tempPiece = listOfPieces[x];
		if(tempPiece.name == "White King")
		{
		
			tempScript = tempPiece.GetComponent(king);
			botKing.push(tempScript.returnPosition());
		}
	}

	for(var y : int = 0; y < botKing.length; y++)
	{
		tempNumber = botKing[y];
		col = tempNumber % 8;
		row = tempNumber / 8;

		testArray[row][col] = -3000;
	}
}


// Sets a certain part of the array to 0, used after a piece is moved.
function setEmpty(location : int)
{
	var col : int;
	var row : int;

	col = location % 8;
	row = location / 8;

	testArray[row][col] = 0.0;
}


// This prints the 8x8 array for testing purposes
function printArray()
{
	for(var i : int = 0; i < 8; i++)
	{
		print(testArray[i][0] + " " + testArray[i][1] + " " + testArray[i][2] + " " + testArray[i][3] + " " + testArray[i][4] + " " + testArray[i][5] + " " + testArray[i][6] + " " + testArray[i][7]);
	}
}
