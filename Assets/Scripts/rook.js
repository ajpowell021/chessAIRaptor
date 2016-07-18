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

// This is the max that a raycast is allowed to travel
var maxDistance : int;

// This is the square the rook begins in, and is used for castling checks
var startSquare : int;

// This is made for cutting out redundencies
// 0 : has not moved
// 1 : has moved
var hasMoved : int;

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

    // Assigning the starting square, this never changes!!!
    startSquare = square;

    // Finding the row and col
    row = (square / 8) + 1;
    col = (square % 8) + 1;

    // Finding the starting side by using row
    if(row == 8)
    {
        startSide = 0;
    }
    else
    {
        startSide = 1;
    }

    // initialize the variable
    hasMoved = 0;

    // This renames the rook for castling purposes
    renameRook();

}

function Update () {
	
	// PLace Holder!!!!!
	if(gameObject.tag == "Active White Piece" || gameObject.tag == "Active Black Piece")
    {
    	GetComponent.<Renderer>().material = raptor;
    }
    else if(gameObject.tag == "Inactive White Piece" || gameObject.tag == "Inactive Black Piece")
    {
    	GetComponent.<Renderer>().material = sprite;
    }

    

    // These Update Every Frame
    square = manager.findPosition(transform.position.x, transform.position.y);
    row = (square / 8) + 1;
    col = (square % 8) + 1;

    if(hasMoved == 0)
    {
    	// The piece has moved
    	if(square != startSquare)
    	{
    		// The piece is white
    		if(color == 0)
    		{	
    			// The piece started on the left of the board
    			if(startSquare == 56 || startSquare == 0)
    			{
    				manager.whiteCastleLeftOff();
    			}
    			// The piece started on the right of the board
    			else if(startSquare == 7 || startSquare == 63)
    			{
    				manager.whiteCastleRightOff();
    			}
    			else
    			{
    				print("the start square of the rook is wrong?, white");
    			}
    		}
    		// The piece is black
    		else if(color == 1)
    		{
    			// The piece started on the left of the board
    			if(startSquare == 56 || startSquare == 0)
    			{
    				manager.blackCastleLeftOff();
    			}
    			// The piece started on the right of the board
    			else if(startSquare == 7 || startSquare == 63)
    			{
    				manager.blackCastleRightOff();
    			}
    			else
    			{
    				print("the start square of the rook is wrong?, black");
    			}
    		}

    	}
    }

}

// This function renames the rook depending on where it starts.
// This is only used for castling purposes
function renameRook()
{
	if(square == 56)
	{
		gameObject.name = "Left Bottom Rook";
	}
	else if (square == 63)
	{
		gameObject.name = "Right Bottom Rook";
	}
	else if (square == 0)
	{
		gameObject.name = "Left Top Rook";
	}
	else if (square == 7)
	{
		gameObject.name = "Right Top Rook";
	}
	else
	{
		print("Error: In the rook script, the rook cannot be name properly at start.");
	}

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

// This function contorls what happens when a piece is clicked.
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

    // This function scans for legal moves
    function movement()
    {
        // We have to clear the array out befor we make any calculations.
        clearArray();

        // The piece then checks north in a straight line until it hits something
        checkNorth();

        // The piece then checks south in a straight line until it hits something
        checkSouth();

        // The piece then checks east in a straight line until it hits something
        checkEast();

        // Finally, the piece checks to the west in a straight line until it hits something
        checkWest();
        
        // At the end of all the movement calculations, move all possible moves
        // to the manager script.
        manager.squaresToHighlight(legalMoves);
    }
    //************************************************************************************down
    // This function checks for the nearest collision, west of the piece
    function checkWest()
    {
        var hit : RaycastHit;
        var squareCheck = transform.TransformDirection (Vector3(-1,0,0));
        maxDistance = (col);
        var squareDestination : int;

        for(var i : float = 1.0; i < maxDistance; i++)
        {
            if(Physics.Raycast(transform.position, squareCheck, hit, i))
        {
            
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
            // Piece can be captured
                hit.distance = Mathf.Round(hit.distance);
                squareDestination = (square - (hit.distance));

            // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
        {
                    squareDestination = 64;
        }

    // Add square to array
    legalMoves.push(squareDestination);
}
else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
{
    // Piece can be captured
    hit.distance = Mathf.Round(hit.distance);
    squareDestination = (square - (hit.distance));

    // Sanity Check
    if(squareDestination < 0 || squareDestination > 63)
    {
        squareDestination = 64;
    }

    // Add square to array
    legalMoves.push(squareDestination);
}

break;
}   
else
{
    squareDestination = (square - (i));
    legalMoves.push(squareDestination);
}
}
    }
    //************************************************************************************up

    // This function checks for the nearest collision, east of the piece
    function checkEast()
    {
        var hit : RaycastHit;
        var squareCheck = transform.TransformDirection (Vector3(1,0,0));
        maxDistance = (9 - col);
        var squareDestination : int;

        for(var i : float = 1.0; i < maxDistance; i++)
        {
            if(Physics.Raycast(transform.position, squareCheck, hit, i))
        {
            
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
            // Piece can be captured
                hit.distance = Mathf.Round(hit.distance);
                squareDestination = (square + (hit.distance));

            // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
        {
                    squareDestination = 64;
        }

    // Add square to array
    legalMoves.push(squareDestination);
}
else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
{
    // Piece can be captured
    hit.distance = Mathf.Round(hit.distance);
    squareDestination = (square + (hit.distance));

    // Sanity Check
    if(squareDestination < 0 || squareDestination > 63)
    {
        squareDestination = 64;
    }

    // Add square to array
    legalMoves.push(squareDestination);
}

break;
}   
else
{
    squareDestination = (square + (i));
    legalMoves.push(squareDestination);
}
}
}

    // This function checks for the nearest collision, south of the piece
    function checkSouth()
    {
        var hit : RaycastHit;
        var squareCheck = transform.TransformDirection (Vector3(0,-1,0));
        maxDistance = (9 - row);
        var squareDestination : int;

        for(var i : float = 1.0; i < maxDistance; i++)
        {
            if(Physics.Raycast(transform.position, squareCheck, hit, i))
        {
            
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
            // Piece can be captured
                hit.distance = Mathf.Round(hit.distance);
                squareDestination = (square + (hit.distance * 8));

            // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
        {
                    squareDestination = 64;
        }

    // Add square to array
    legalMoves.push(squareDestination);
}
else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
{
    // Piece can be captured
    hit.distance = Mathf.Round(hit.distance);
    squareDestination = (square + (hit.distance * 8));

    // Sanity Check
    if(squareDestination < 0 || squareDestination > 63)
    {
        squareDestination = 64;
    }

    // Add square to array
    legalMoves.push(squareDestination);
}

break;
}   
else
{
    squareDestination = (square + (i * 8));
    legalMoves.push(squareDestination);
}
}
    }
    // This function checks for the nearest collision, north of the piece
   function checkNorth()
   {
       var hit : RaycastHit;
       var squareCheck = transform.TransformDirection (Vector3(0,1,0));
       maxDistance = row;
       var squareDestination : int;

        for(var i : float = 1.0; i < maxDistance; i++)
        {
            if(Physics.Raycast(transform.position, squareCheck, hit, i))
            {
            
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                hit.distance = Mathf.Round(hit.distance);
                squareDestination = (square - (hit.distance * 8));

                 // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
            else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
            {
                // Piece can be captured
                hit.distance = Mathf.Round(hit.distance);
                squareDestination = (square - (hit.distance * 8));

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }

            break;
            }   
            else
            {
            squareDestination = (square - (i * 8));
            legalMoves.push(squareDestination);
            }
        }
    } 

// Return the position
function returnPosition()
{
	return square;
}