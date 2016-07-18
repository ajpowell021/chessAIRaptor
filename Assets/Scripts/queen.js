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

// This variable alters hit.distance due to the added length of a diagonal
var altHitDistance : int;

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

    // This is the function that scans for legal moves.
    function movement()
    {
    	 // We have to clear the array out befor we make any calculations.
        clearArray();

        // First we check north east diagonally
        if(col < 8)
        {
        	checkNorthEast();
        }

        // Second we check north west diagonally
        if (col > 1)
        {
        checkNorthWest();
        }

        // Third, we check south east diagonally
        if(col < 8)
        {
        	checkSouthEast();
        }

        // Fourth, we check south west diagonally
        if(col > 1)
        {
        	checkSouthWest();
        }

        // Fifth, we check straight up, or north.
        checkNorth();

        // Sixth, we check straight down, or south.
        checkSouth();

        // Seventh, we check straight left, or west.
        checkWest();

        // Last, we check right, or east
        checkEast();


      

        // At the end of all the movement calculations, move all possible moves
        // to the manager script.
        manager.squaresToHighlight(legalMoves);
    }

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

    // This function scans the squares to the south west of the active piece and returns legal moves.
    function checkSouthWest()
    {
    	var hit : RaycastHit;
    	var squareCheck = transform.TransformDirection (Vector3(-1,-1,0));
    	maxDistance = col;
    	var squareDestination : int;

    	for (var i : float = 1.0; i < maxDistance; i++)
    	{
    		if(Physics.Raycast(transform.position, squareCheck, hit, (i + (.45 * i))))
    		{
    			// Something was hit, time to check for color.
    			if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
    			{
    				// The piece can be captured
    				altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
    				squareDestination = (square + (altHitDistance * 7));

    				// Sanity Check
    				if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

    				legalMoves.push(squareDestination);
    				break;
    			}
    			else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
    			{
    				// The piece can be captured
    				altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
    				squareDestination = (square + (altHitDistance * 7));

    				// Sanity Check
    				if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

    				legalMoves.push(squareDestination);
    				break;
    			}
    			else
    			{
    				break;
    			}
    		}
    		else
    		{
    			squareDestination = (square + (7 * i));

    			// Sanity Check
    			if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

        		legalMoves.push(squareDestination);
    		}
    	}
    }


    // This function scans the squares to the south east of the active piece and returns legal moves.
    function checkSouthEast()
   	{
   		var hit : RaycastHit;
        var squareCheck = transform.TransformDirection (Vector3(1,-1,0));
        maxDistance = (9 - col);
        var squareDestination : int;

        for (var i : float = 1.0; i < maxDistance; i++)
        {
        	if(Physics.Raycast(transform.position, squareCheck, hit, (i + (.45 * i))))
        	{
        		// Something was hit, time to check for color
        		if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        		{
        			// The piece can be captured.
        			altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
        			squareDestination = (square + (altHitDistance * 9));

        			// Sanity Check
        			if(squareDestination < 0 || squareDestination > 63)
        			{
        				squareDestination = 64;
        			}

        			legalMoves.push(squareDestination);
        			break;
        		}
        		else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        		{
        			// The piece can be captured
        			altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
        			squareDestination = (square + (altHitDistance * 9));

        			// Sanity Check
        			if(squareDestination < 0 || squareDestination > 63)
        			{
        				square = 64;
        			}
        			// Add square to array 
        			legalMoves.push(squareDestination);
        			break;
        		}
        		else
        		{
        			break;
        		}
        	}
        	else
        	{
        		squareDestination = (square + (9 * i));

        		// Sanity Check
    			if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

        		legalMoves.push(squareDestination);
        	}
        }
   	}



    // This function scans the square to the north west of the active piece and returns legal moves.
    function checkNorthWest()
    {
    	var hit : RaycastHit;
    	var squareCheck = transform.TransformDirection (Vector3(-1,1,0));
    	maxDistance = col;
    	var squareDestination : int;

    	for (var i : float = 1.0; i < maxDistance; i++)
    	{
    		if(Physics.Raycast(transform.position, squareCheck, hit, (i + (.45 * i))))
    		{
    			// Something was hit, time to check for color.
    			if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
    			{
    				// The piece can be captured
    				altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
    				squareDestination = (square - (altHitDistance * 9));

    				// Sanity Check
    				if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

    				legalMoves.push(squareDestination);
    				break;
    			}
    			else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
    			{
    				// The piece can be captured
    				altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
    				squareDestination = (square - (altHitDistance * 9));

    				// Sanity Check
    				if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

    				legalMoves.push(squareDestination);
    				break;
    			}
    			else
    			{
    				break;
    			}
    		}
    		else
    		{
    			squareDestination = (square - (9 * i));

    			// Sanity Check
    			if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

        		legalMoves.push(squareDestination);
    		}
    	}
    }

    // This function scans the squares to the north east of the active piece and returns legal moves.
    function checkNorthEast()
    {
    	var hit : RaycastHit;
        var squareCheck = transform.TransformDirection (Vector3(1,1,0));
        maxDistance = (9 - col);
        var squareDestination : int;

        for (var i : float = 1.0; i < maxDistance; i++)
        {
        	if(Physics.Raycast(transform.position, squareCheck, hit, (i + (.45 * i))))
        	{
        		// Something was hit, time to check for color
        		if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        		{
        			// The piece can be captured.
        			altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
        			squareDestination = (square - (altHitDistance * 7));

        			// Sanity Check
        			if(squareDestination < 0 || squareDestination > 63)
        			{
        				squareDestination = 64;
        			}

        			legalMoves.push(squareDestination);
        			break;
        		}
        		else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        		{
        			// The piece can be captured
        			altHitDistance = (hit.distance - (.45 * i)) + 1;
    				altHitDistance = Mathf.Round(altHitDistance);
        			squareDestination = (square - (altHitDistance * 7));

        			// Sanity Check
        			if(squareDestination < 0 || squareDestination > 63)
        			{
        				square = 64;
        			}
        			// Add square to array 
        			legalMoves.push(squareDestination);
        			break;
        		}
        		else
        		{
        			break;
        		}
        	}
        	else
        	{
        		squareDestination = (square - (7 * i));

        		// Sanity Check
    			if(squareDestination < 0 || squareDestination > 63)
    				{
    					squareDestination = 64;
    				}

        		legalMoves.push(squareDestination);
        	}
        }
    }

// Return the position
function returnPosition()
{
	return square;
}