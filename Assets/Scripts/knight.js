//This is the script that controls a knight, as well as stores where on the board
//it currently is.

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

// This is the function that decides which square are legal for the knight to move to
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function movement()
{
    // We have to clear the array out first
    clearArray();

    // First, the knight checks north of it, meaning up on the board, regardless of startside
    // This checks both left and right
    checkNorth();

    // Next, the knight checks east of it, meaning the left side of the screen, regardless of startside.
    // Again, this checks both up and down.
    checkEast();

    // Next, the knight checks west of it, meaning the right side of the screen, regardless of startside.
    // Again, this checks both up and down
    checkWest();

    // Finally, the knight checks south of it, meaning the squares down from the knight.
    checkSouth();

    // At the end of all the movement calculations, move all possible moves
    // to the manager script.
    manager.squaresToHighlight(legalMoves);
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function checkSouth()
{
    // This variable is the actual hit
    var hit : RaycastHit;


    // This part checks left
    if(col == 1)
    {
        // The knight is on the left side of the board
        // so it will not check this direction.
    }
    else
    {
        squareCheck = transform.TransformDirection (Vector3(-1,0,0));
        if(Physics.Raycast(transform.position + (transform.up * -2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                var squareDestination = (square + 15);

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
                squareDestination = (square + 15);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        
        }
        else
        {
            // Nothing was hit
            squareDestination = (square + 15);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
    }

    // This part checks to the right
    if(col == 8)
    {
        // The knight is on the right side of the board
        // so it will not check this direction.
    }
    else
    {
        squareCheck = transform.TransformDirection (Vector3(1,0,0));
        if(Physics.Raycast(transform.position + (transform.up * -2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                squareDestination = (square + 17);

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
                squareDestination = (square + 17);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        
        }
        else
        {
            // Nothing was hit
            squareDestination = (square + 17);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
    }
}

function checkWest()
{
    var hit : RaycastHit;

    // This part checks to see if check is valid due to board position.
    if(col > 2)
    {
        // This checks up
        squareCheck = transform.TransformDirection (Vector3(0,1,0));
        if(Physics.Raycast(transform.position + (transform.right * -2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                var squareDestination = (square - 10);

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
                squareDestination = (square - 10);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        }
        else
        {
            // Piece can be captured
            squareDestination = (square - 10);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
        // This checks down
        squareCheck = transform.TransformDirection (Vector3(0,-1,0));
        if(Physics.Raycast(transform.position + (transform.right * -2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                squareDestination = (square + 6);

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
                squareDestination = (square + 6);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        }
        else
        {
            // Piece can be captured
            squareDestination = (square + 6);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
    }
    else
    {
        // Don't do checks because the checks would go off the board to the left.
    }
}

 // This function checks the east most squares
function checkEast()
{
    var hit : RaycastHit;

    // This part checks to see if check is valid due to board position.
    if(col < 7)
    {
        // This checks up
        squareCheck = transform.TransformDirection (Vector3(0,1,0));
        if(Physics.Raycast(transform.position + (transform.right * 2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                var squareDestination = (square - 6);

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
                squareDestination = (square - 6);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        }
        else
        {
            // Piece can be captured
            squareDestination = (square - 6);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
        // This checks down
        squareCheck = transform.TransformDirection (Vector3(0,-1,0));
        if(Physics.Raycast(transform.position + (transform.right * 2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                squareDestination = (square + 10);

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
                squareDestination = (square + 10);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        }
        else
        {
            // Piece can be captured
            squareDestination = (square + 10);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
    }
    else
    {
        // Don't do checks because the checks would go off the board to the left.
    }
}

// This function checks the north most squares
function checkNorth()
{
    // This variable is the actual hit
    var hit : RaycastHit;


    // This part checks left
    if(col == 1)
    {
        // The knight is on the left side of the board
        // so it will not check this direction.
    }
    else
    {
        squareCheck = transform.TransformDirection (Vector3(-1,0,0));
        if(Physics.Raycast(transform.position + (transform.up * 2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                var squareDestination = (square - 17);

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
                squareDestination = (square - 17);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        
        }
        else
        {
            // Nothing was hit
            squareDestination = (square - 17);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
    }

    // This part checks to the right
    if(col == 8)
    {
        // The knight is on the right side of the board
        // so it will not check this direction.
    }
    else
    {
        squareCheck = transform.TransformDirection (Vector3(1,0,0));
        if(Physics.Raycast(transform.position + (transform.up * 2.0), squareCheck, hit, 1.0))
        {
            // Something was hit, time to check the color
            if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
            {
                // Piece can be captured
                squareDestination = (square - 15);

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
                squareDestination = (square - 15);

                // Sanity Check
                if(squareDestination < 0 || squareDestination > 63)
                {
                    squareDestination = 64;
                }

                // Add square to array
                legalMoves.push(squareDestination);
            }
        
        }
        else
        {
            // Nothing was hit
            squareDestination = (square - 15);

            // Sanity Check
            if(squareDestination < 0 || squareDestination > 63)
            {
                squareDestination = 64;
            }

            // Add square to array
            legalMoves.push(squareDestination);
        }
    }
}

// returns the current position of the piece 
function returnPosition()
{
	return square;
}

