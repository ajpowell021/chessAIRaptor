using UnityEngine;
using System.Collections;
using UnityEngine.UI;




public class toDo : MonoBehaviour {



	public Text home;
	public Text away;



	// Use this for initialization
	void Start () {

		home = GameObject.Find ("homeText").GetComponent<Text> ();
		away = GameObject.Find ("awayText").GetComponent<Text> ();

		setText ();

	}
	
	// Update is called once per frame
	void Update () {
	
	}

	// This function recieves the array from a js file.
	public void getArray(int [][] board)
	{
		print(board [7][7]);
	}

	// This function sets the text inside of the placeholder boxes.
	public void setText()
	{
		home.text = "From Here : Int";
		away.text = "To Here : Int";
	}


}
