#pragma strict

// This is going to control the move history which is actually two arrays.
// It is then going to send the move to the manager script so that the movement 
// can actually take place.
// It might only actually do that for the AI and not the player.

// Arrays
var whiteToArray = new Array();
var whiteFromArray = new Array(); 
var blackToArray = new Array();
var blackFromArray = new Array();

// Counters
var whiteToCounter : int = 0;
var whiteFromCounter : int = 0;
var blackToCounter : int = 0;
var blackFromCounter : int = 0;
					


function Start () 
{
	
}

function Update () 
{

}

function whiteFrom(from : int)
{
	
	whiteFromArray.Push(from);
	//print("White From: " + whiteFromArray[whiteFromCounter]);
	whiteFromCounter++;	
}

function whiteTo(to : int)
{
	whiteToArray.Push(to);
	//print("White To: " + whiteToArray[whiteToCounter]);
	whiteToCounter++;
}

function blackFrom(from : int)
{
	blackFromArray.Push(from);
	//print("Black From: " + blackFromArray[blackFromCounter]);
	blackFromCounter++;
}

function blackTo(to : int)
{
	blackToArray.Push(to);
	//print("Black To: " + blackToArray[blackToCounter]);
	blackToCounter++;
}


function formatMove()
{
	
}
