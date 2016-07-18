///<summary>
///Run AI Class
///Coded By: Patrick Bodell
///Last Update 3/21/2016
///Written for Fall 2016 - Capstone Course
///Team Members : Paul St. Pierre, Dylan Sheppard, Adam Powell, Garry Cardillo
///Instructor : Dr. Farmer
/// </summary>

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using UnityEngine;

    public class RunAI : moveGenerator.MoveGenerator
    {
        public RunAI(){}
        public moveGenerator.MoveGenerator main;

		public void getArray(int[][] gameBoard) // Run all the things
        {
        print("Preparing Launch");
            main = gameObject.AddComponent<moveGenerator.MoveGenerator>();
			formatting (gameBoard);
			
			
        }

		// This is adam's formatting mess, changing ints to doubles
		public void formatting(int[][] gameBoard)
		{
		double[][] newGameBoard =  new double[8][];

		for(int i = 0; i < 8; i++)
		{
			newGameBoard [i] = new double[8];
			for(int j = 0; j < 8; j++)
			{
				double tempNum = gameBoard [7-i] [7-j];

				if(tempNum == 4)
				{
					tempNum = 3.1;
				}

				if (tempNum == -4)
				{
					tempNum = -3.1;
				}


				newGameBoard [i] [j] = tempNum;
			}
		}

		// Print for testing
		// You can un comment this for the ai to print the array it has after the formatting takes place.
		// Only happens when it is the ai's turn.
		//for (int x = 0; x < 8; x++) 
		//{
		//	print (newGameBoard [x] [0] + " " + newGameBoard [x] [1] + " " + newGameBoard [x] [2] + " " + newGameBoard [x] [3] + " " + newGameBoard [x] [4] + " " + newGameBoard [x] [5] + " " + newGameBoard [x] [6] + " " + newGameBoard [x] [7]);
		//}
		main.setBoard (newGameBoard,false,false,false);
        ///<summary>
        ///TODO later this needs to be fixed by adding adams king check, left rook check, right rook check
        ///
        /// This goes in the specified order instead of false,false,false
        /// </summary>
		main.walkBoard();

		}


   	 }
	  
	