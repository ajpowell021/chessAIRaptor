#pragma strict

// This keeps checking the trigger box.  If the box is changed from 0 to 1,
// it makes the move for the ai, and then changes it back to 0;

// Box that lets the ui know that the ai has made a move
var triggerBox : UI.Text;

// Where the move comes from
var fromBox : UI.Text;

// Where the move goes to
var toBox : UI.Text;

// Linking the manager script
var manager : gameManager;

// Linking the send array script
var sender : testSendArray;


function Start () {

	manager = GameObject.FindGameObjectWithTag("Manager").GetComponent(gameManager);
	sender = GameObject.FindGameObjectWithTag("history").GetComponent(testSendArray);

}

function Update () {

	if(triggerBox.text == "1")
	{
		makeMove();
	}

}

// This fires when a 1 is sensed in the trigger box.
function makeMove()
{
	var from : int;
	var to : int;

	// Assigning varibles
	from = int.Parse(fromBox.text);
	to = int.Parse(toBox.text);

	// Using square that piece is currently in to get the piece for movement.
	var squareFrom : GameObject = GameObject.Find(fromBox.text);
	var squareTo : GameObject = GameObject.Find(toBox.text);
	var hit: RaycastHit;

	var check = transform.TransformDirection (Vector3(0,0,-1));
	if(Physics.Raycast(squareFrom.transform.position, check, hit, 1))
	{
		var activePiece = hit.collider.gameObject;
		activePiece.transform.position.x = squareTo.transform.position.x;
    	activePiece.transform.position.y = squareTo.transform.position.y;
    	manager.checkForPromotionBlack();
    	sender.setEmpty(from);
    	sender.makeArray();
    	yield WaitForSeconds (.1);
    	manager.advanceTurn();
	}
	else
	{
		print("error: no piece in this square.");
	}

	// Reset box
	triggerBox.text = "0";


}