#pragma strict

// The number of this square, stored as an int.
var squareInt : int;

// The material the square changes to when it is a legal option
// to move to.
var highlightedMat : Material;

// The orignial material
var originalMaterial : Material;

// The game manager script
var manager : gameManager;

// A switch that tells you if the square is highlighted,
// meaning it can be clicked.
// 0 : Not highlighted, 1 : Is highlighted
var ready : int = 0;





function Start () {

    // Linking this script to the gameManager script.
    // This is referenced in order to find the current
    // position of a the square.
    manager = GameObject.FindGameObjectWithTag("Manager").GetComponent(gameManager);


    // Uses the manager script to recieve and assign the square value.
    squareInt = manager.findPosition(transform.position.x, transform.position.y);



}

function Update () {


}

// This function is called when you want to click on an active square 
// so that you don't have to worry about clicking around the piece.
function changeBoxCollider()
{
	var boxCollider = GetComponent(BoxCollider) as BoxCollider;
	boxCollider.size = Vector3(1,1,3.5);	
}

// This function sets the colliders back to normal.
function resetBoxCollider()
{
	var boxCollider = GetComponent(BoxCollider) as BoxCollider;
	boxCollider.size = Vector3(1,1,1);
}


function OnMouseDown()
{
    if(ready == 1)
    {
        manager.unhighlightAllSquares();
        manager.movePiece(squareInt);   
    }
    // This is when squares are highlighted but you click 
    // somewhere else.  Needs to also make the active piece become
    // unactive.
    else if(ready == 0)
    {
    	manager.unhighlightAllSquares();
    	manager.resetBoxForAllSquares();
    	manager.resetActivePiece();

    }
}
// This function is called when a list of legal moves has been made and 
// highlights the squares that can be legally moved to.
function highlight(){

    GetComponent.<Renderer>().material = highlightedMat;
    ready = 1;

}

function unhighlight()
{
    GetComponent.<Renderer>().material = originalMaterial;
    ready = 0;
}