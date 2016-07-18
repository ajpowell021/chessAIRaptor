#pragma strict

// The gameManager script 
var manager : gameManager;

// The current square the piece is in
var square : int;

// The color of the piece
// White = 0, Black = 1.
var color : int;

// This is the row, and column the piece is found in
var row : int;
var col : int;

// If the piece began on the bottom of the board
// or the top.  Bottom = 0, Top = 1.
var startSide : int;

// An array of the squares the piece
// can legally move to.
var legalMoves = new Array ();

// This is the square that is getting checked for being empty
var squareCheck : Vector3;

// This is the square the king starts in, and is used for castling checks.
var startSquare : int;

// This lets you know if castle is still a possibility.
var canCastle : int;

// The orignal sprite for the piece
var sprite : Material;

//THIS IS JUST A PLACEHOLDER
var raptor : Material;


function Start () {

    // Linking this script to the gameManager script.
    // This is referenced in order to find the current
    // position of a piece by using the currentPosition()
    manager = GameObject.FindGameObjectWithTag("Manager").GetComponent(gameManager);

    // Initialize the array
    legalMoves.push(64);

    // Calling the function in manager to find the piece's square
    square = manager.findPosition(transform.position.x, transform.position.y);

    // Setting start square, this variable should never change!!!!
    startSquare = square; 

    // Finding the row and col
    row = (square / 8) + 1;
    col = (square % 8) + 1;

    // Finding the starting side by using row
    if(row > 6)
    {
        startSide = 0;
    }
    else
    {
        startSide = 1;
    }

    // This always starts at 1, and changes to 0 when it becomes impossible.
    canCastle = 1;

}

function Update () {

	// PLace Holder!!!!!
	if(gameObject.tag == "Active White Piece" || gameObject.tag == "Active Black Piece")
    {
    	GetComponent.<Renderer>().material = raptor;
    }
    else
    {
    	GetComponent.<Renderer>().material = sprite;
    }

    // These Update Every Frame
    square = manager.findPosition(transform.position.x, transform.position.y);
    row = (square / 8) + 1;
    col = (square % 8) + 1;

    // This checks to see if the king has ever been moved.
    // If the king has ever moved, it cannot castle;
    // The can castle keeps this from running for no reason a bunch
    if(canCastle == 1)
    {
    	if(square != startSquare)
    	{
    		if(color == 0)
    		{
    			manager.whiteCastleLeftOff();
    			manager.whiteCastleRightOff();
    		}
    		else if(color == 1)
    		{
    			manager.blackCastleLeftOff();
    			manager.blackCastleRightOff();
    		}

    		canCastle = 0;
    	}
    }

}

// What happens when the piece is clicked on.
function OnMouseDown()
{	
    if(manager.turn == color)
    {
        if(color == 0 && gameObject.tag == "Inactive White Piece")
        {
            transform.gameObject.tag = "Active White Piece";
            movement();
        }
        else if(color == 0 && gameObject.tag == "Active White Piece")
        {
        	manager.unhighlightAllSquares();
        	transform.gameObject.tag = "Inactive White Piece";
        }
        else if(color == 1 && gameObject.tag == "Inactive Black Piece")
        {
            transform.gameObject.tag = "Active Black Piece";
            movement();
        }
        else if(color == 1 && gameObject.tag == "Active Black Piece")
        {
        	manager.unhighlightAllSquares();
        	transform.gameObject.tag = "Inactive Black Piece";
        }
    }
}

// After everything is finished, this empties the array, and then puts 65 back into it.
function clearArray()
{
    legalMoves.Clear();
    legalMoves.push(64);
}

// This is the functiont that fires when a collision occurs
function OnCollisionEnter (col : Collision)
{
        if(manager.turn != color)
        {	
        	if(col.gameObject.tag == "Active White Piece" || col.gameObject.tag == "Inactive White Piece" || col.gameObject.tag == "Active Black Piece" || col.gameObject.tag == "Inactive Black Piece")
            {
            	Destroy(gameObject);
            }
        }   
}


// Here is the actual movement function
function movement()
{
	// We have to clear the array before we do anything
	clearArray();
	// First we check the square directly above the king.
	checkNorth();
	// Next, we check to the left.
	if(col > 1)
	{
	checkWest();
	}
	// Next we check to the right.
	if(col < 8)
	{
	checkEast();
	}
	// Next we check down from the piece
	checkSouth();
	// Then we check North West
	if(col > 1)
	{
	checkNorthWest();
	}
	// Next we check North East
	if(col < 8)
	{
	checkNorthEast();
	}
	// Next we check South West
	if(col > 1)
	{
	checkSouthWest();
	}
	// Finally we check South East
	if(col < 8)
	{
	checkSouthEast();
	}

	// Check to see if a castle would be a legal move.
	// Quick check to see if king has ever moved, made to try 
	// and save time.
	if(canCastle == 1)
	{
		castleCheck();
	}



	// At the end of the pawns movement calculataions, move all possible moves
    // to the manager script.
    manager.squaresToHighlight(legalMoves);

}

// This fucntion checks to see if the king can make a legal castle. 
// To save time, this function only fires if it knows that the king has already 
// not moved, aka: canCastle == 1;
function castleCheck()
{
	// The piece is white, and is able to castle left
	if(color == 0 && manager.whiteCastleLeft == 1)
	{
		// checks to see if squares are empty.
		var hit : RaycastHit;
		var squareCheck = transform.TransformDirection (Vector3(-1,0,0));

		if(Physics.Raycast(transform.position, squareCheck, hit, 3))
		{
			// Something was hit, no castle is allowed.
		}
		else
		{
			// Nothing was hit, castle is allowed.
			legalMoves.push(square - 3);

			// Lets the manager script know that the array does contain the 
			// possiblity of a castle.
			manager.castleDetectorOn();
		}
	}

	// The piece is white, and is able to castle right
	if(color == 0 && manager.whiteCastleRight == 1)
	{
		// checks to see if squares are empty.
		squareCheck = transform.TransformDirection (Vector3(1,0,0));

		if(Physics.Raycast(transform.position, squareCheck, hit, 2))
		{
			// Something was hit, no castle is allowed.
		}
		else
		{
			// Nothing was hit, castle is allowed.
			legalMoves.push(square + 2);

			// Lets the manager script know that the array does contain the 
			// possiblity of a castle.
			manager.castleDetectorOn();
		}
	}

	// The piece is black, and is able to castle left
	if(color == 1 && manager.blackCastleLeft == 1)
	{
		// checks to see if squares are empty.
		squareCheck = transform.TransformDirection (Vector3(-1,0,0));

		if(Physics.Raycast(transform.position, squareCheck, hit, 3))
		{
			// Something was hit, no castle is allowed.
		}
		else
		{
			// Nothing was hit, castle is allowed.
			legalMoves.push(square - 3);

			// Lets the manager script know that the array does contain the 
			// possiblity of a castle.
			manager.castleDetectorOn();
		}
	}

	// The piece is black, and is able to castle right
	if(color == 1 && manager.blackCastleRight == 1)
	{
		// checks to see if squares are empty.
		squareCheck = transform.TransformDirection (Vector3(1,0,0));

		if(Physics.Raycast(transform.position, squareCheck, hit, 2))
		{
			// Something was hit, no castle is allowed.

		}
		else
		{
			// Nothing was hit, castle is allowed.
			legalMoves.push(square + 2);

			// Lets the manager script know that the array does contain the 
			// possiblity of a castle.
			manager.castleDetectorOn();
		}
	}

}



// This is the function that checks one square north
function checkNorth()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(0,1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square - 8);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square - 8);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square - 8);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// This is the function that checks one square north
function checkWest()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(-1,0,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square - 1);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square - 1);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square - 1);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// This is the function that checks one square north
function checkEast()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(1,0,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square + 1);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square + 1);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square + 1);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// This is the function that checks one square north
function checkSouth()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(0,-1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square + 8);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square + 8);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square + 8);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// This is the function that checks one square north
function checkNorthWest()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(-1,1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1.45))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square - 9);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square - 9);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square - 9);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// This is the function that checks one square north
function checkNorthEast()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(1,1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1.45))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square - 7);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square - 7);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square - 7);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// This is the function that checks one square north
function checkSouthWest()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(-1,-1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1.45))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square + 7);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square + 7);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square + 7);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// This is the function that checks one square north
function checkSouthEast()
{
	var hit : RaycastHit;
	var destinationSquare : int;
	squareCheck = transform.TransformDirection (Vector3(1,-1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit,  1.45))
    {
        // This means there was a hit.
        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
        	// Piece can be captured
        	destinationSquare = (square + 9);

        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
        	// Piece can be captured
        	destinationSquare = (square + 9);
        	// This is a sanity check.
        	if(destinationSquare < 0 || destinationSquare > 63)
        	{
            	destinationSquare = 64;
        	}

        	// Add the square to the array.
        	legalMoves.push(destinationSquare);
        }
        else
        {
        	// This triggers when a square is blocked by a piece of the same color.
        }	

    }
    else
    {
    	// This means nothing was hit, add to array.
        destinationSquare = (square + 9);

        // This is a sanity check.
        if(destinationSquare < 0 || destinationSquare > 63)
        {
            destinationSquare = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push(destinationSquare);
    }
}

// Return the position
function returnPosition()
{
	return square;
}


