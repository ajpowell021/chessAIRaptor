//This is the script that controls a pawn, as well as stores where on the board
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
    if(row > 6)
    {
        startSide = 0;
    }
    else
    {
        startSide = 1;
    }

}

function Update () {

    // These Update Every Frame
    square = manager.findPosition(transform.position.x, transform.position.y);
    row = (square / 8) + 1;
    col = (square % 8) + 1;

    //PLACE HOLDER!!!!
    if(gameObject.tag == "Active White Piece" || gameObject.tag == "Active Black Piece")
    {
    	GetComponent.<Renderer>().material = raptor;
    }
    else
    {
    	GetComponent.<Renderer>().material = sprite;
    }

    // Check to see if sub is possible
	if(row == 1)
    {
    	// This means the pawn can change pieces at the top of the row.

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
        else
        {
        	print("something weird");
        }


    }
}

// This is the function that determines which moves are legal to make for a pawn.
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function movement()
{
    // We have to clear the array out first
    clearArray();

    // Piece started on bottom
    if(startSide == 0)
    {
        // First, check to see if the position directly in front on the pawn
        // is occupied by either color.  If not, add the square to the array.
        checkOneUp();

        // Next, we check two up, if applicaple. 
        if(row == 7)
        {
            checkTwoUp();
        }

        // Finally, we check diagonal up
        // First to the left
        checkDiagonalLeftUp();
        // Then to the right.
        checkDiagonalRightUp();
    }
    else if (startSide == 1)
    {
        // First we check one under the square.
        checkOneDown();
        // Next we check two under the square, if applicable.
        if(row == 2)
        {
            checkTwoDown();
        }
        // Finally we do both diagonals.
        checkDiagonalLeftDown();
        checkDiagonalRightDown();
    }
   
    // At the end of the pawns movement calculataions, move all possible moves
    // to the manager script.
    manager.squaresToHighlight(legalMoves);
    
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

// This function checks the square above the piece, and adds the square to 
// the array if it is empty.
function checkOneUp()
{

    squareCheck = transform.TransformDirection (Vector3(0,1,0));
    if (Physics.Raycast(transform.position, squareCheck, 1))
    {
        // Something was hit, square is occupied.  Don't add.
    }
    else
    {
        // This square that is located one up from piece
        var squareFront = (square - 8);
        // This is a sanity check.
        if(squareFront < 0 || squareFront > 63)
        {
            squareFront = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push (squareFront);
    }
}

// This function checks the square two above the piece.  The check to see if this
// is applicaple happens before this function is called.
function checkTwoUp()
{

    squareCheck = transform.TransformDirection (Vector3(0,2,0));
    if (Physics.Raycast(transform.position, squareCheck, 2))
    {
        // Something was hit, square is occupied.  Don't add.
    }
    else
    {
        // This square that is located one up from piece
        var squareFront = (square - 16);

        // Sanity check
        if(squareFront < 0 || squareFront > 63)
        {
            squareFront = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push (squareFront);
    }
}

function checkDiagonalLeftUp()
{

    // This variable is the actual hit.
    var hit : RaycastHit;

    squareCheck = transform.TransformDirection (Vector3(-1,1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit, 1))
    {
        // Something was hit, we need to check it's color.

        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
            // This square that is located one up from piece
            var squareDiagonal = (square - 9);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square was empty, so add the square to the array.
            legalMoves.push (squareDiagonal);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
            // This square that is located one up from piece
            squareDiagonal = (square - 9);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square can be moved to.
            legalMoves.push (squareDiagonal);
        }
        else
        {
            // The piece is the same color, so there is no legal move.
        }
    }
    else
    {
        // The diagonal space is empty, so no legal move is possible.
    }

}

function checkDiagonalRightUp()
{

    var hit : RaycastHit;

    squareCheck = transform.TransformDirection (Vector3(1,1,0));
    if(Physics.Raycast(transform.position, squareCheck, hit, 1))
    {
        // Something was hit, we need to check it's color

        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
            var squareDiagonal = (square - 7);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square can be moved to.
            legalMoves.push(squareDiagonal);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
            squareDiagonal = (square - 7);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square can be moved to.
            legalMoves.push(squareDiagonal);
        }
        else
        {
            // Piece is same color, can't be moved
        }
    }
    else
    {
        // Square is empty, and cannot be moved to.
    }
}

function checkOneDown()
{

    squareCheck = transform.TransformDirection (Vector3(0,-1,0));
    if (Physics.Raycast(transform.position, squareCheck, 1))
    {
        // Something was hit, square is occupied.  Don't add.
    }
    else
    {
        // This square that is located one up from piece
        var squareFront = (square + 8);
        // This is a sanity check.
        if(squareFront < 0 || squareFront > 63)
        {
            squareFront = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push (squareFront);
    }
}

function checkTwoDown()
{

    squareCheck = transform.TransformDirection (Vector3(0,-2,0));
    if (Physics.Raycast(transform.position, squareCheck, 2))
    {
        // Something was hit, square is occupied.  Don't add.
    }
    else
    {
        // This square that is located one up from piece
        var squareFront = (square + 16);

        // Sanity check
        if(squareFront < 0 || squareFront > 63)
        {
            squareFront = 64;
        }

        // Square was empty, so add the square to the array.
        legalMoves.push (squareFront);
    }
}

function checkDiagonalLeftDown()
{

    // This variable is the actual hit.
    var hit : RaycastHit;

    squareCheck = transform.TransformDirection (Vector3(-1,-1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit, 1))
    {
        // Something was hit, we need to check it's color.

        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
            // This square that is located one down, one left from piece.
            var squareDiagonal = (square + 7);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square was empty, so add the square to the array.
            legalMoves.push (squareDiagonal);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
            // This square that is located one up from piece
            squareDiagonal = (square + 7);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square can be moved to.
            legalMoves.push (squareDiagonal);
        }
        else
        {
            // The piece is the same color, so there is no legal move.
        }
    }
    else
    {
        // The diagonal space is empty, so no legal move is possible.
    }

}

function checkDiagonalRightDown()
{

    // This variable is the actual hit.
    var hit : RaycastHit;

    squareCheck = transform.TransformDirection (Vector3(1,-1,0));
    if (Physics.Raycast(transform.position, squareCheck, hit, 1))
    {
        // Something was hit, we need to check it's color.

        if(hit.collider.gameObject.tag == "Inactive White Piece" && color == 1)
        {
            // This square that is located one down, one right from piece.
            var squareDiagonal = (square + 9);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square was empty, so add the square to the array.
            legalMoves.push (squareDiagonal);
        }
        else if(hit.collider.gameObject.tag == "Inactive Black Piece" && color == 0)
        {
            // This square that is located one up from piece
            squareDiagonal = (square + 9);

            // Sanity Check
            if(squareDiagonal < 0 || squareDiagonal > 63)
            {
                squareDiagonal = 64;
            }
            

            // Square can be moved to.
            legalMoves.push (squareDiagonal);
        }
        else
        {
            // The piece is the same color, so there is no legal move.
        }
    }
    else
    {
        // The diagonal space is empty, so no legal move is possible.
    }

}


// Return the position
function returnPosition()
{
	return square;
}







  
