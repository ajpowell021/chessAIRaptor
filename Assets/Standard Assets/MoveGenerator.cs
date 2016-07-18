///<summary>
///Move Generator Class
///Coded By: Patrick Bodell
///Last Update 4/10/2016
///Written for Fall 2016 - Capstone Course
///Team Members : Paul St. Pierre, Dylan Sheppard, Adam Powell, Garry Cardillo
///Instructor : Dr. Farmer
/// </summary>

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using UnityEngine;

namespace moveGenerator
{
    public class MoveGenerator : TreeLinkList
    {
        bool kingMoved;
        bool LeftRookMoved;
        bool RightRookMoved;
        public TreeLinkList decideTree = new TreeLinkList();//Tree Object
        private double[,] gameBoard; //Board that functions interact with
        private double[,] tempBoard = new double[8, 8]; // Board used for Transforming matricies
        private double[,] originalGameBoard = new double[8, 8]; // Stores the imported board from U.I.
        private double[][,] pieceMoveSet = new double[2][,]; // Stores possible moves [0][,],  and weights of each move [1][,]
        private int[] startPos = new int[2]; // Where the piece is
        private int[] endPos = new int[2]; // Where the piece is going
        private int[,] threatArr = new int[8, 8]; // What piece is threatening what space?
        public int depthCounter; // How deep is our tree going? MAX of 4
		public MoveGenerator(){}
		public void setBoard(double[][] gameBoard_in, bool kMove, bool lRookMove, bool rRookMove) //This is going to create all possible moves and give them weights
        {
            kingMoved = kMove;
            LeftRookMoved = lRookMove;
            RightRookMoved = rRookMove;

            {

                pieceMoveSet[0] = new double[8, 8] { { -1, -1, -1, -1, -1, -1, -1, -1 }, { -1, -1, -1, -1, -1, -1, -1, -1 }, { -1, -1, -1, -1, -1, -1, -1, -1 }, { -1, -1, -1, -1, -1, -1, -1, -1 }, { -1, -1, -1, -1, -1, -1, -1, -1 }, { -1, -1, -1, -1, -1, -1, -1, -1 }, { -1, -1, -1, -1, -1, -1, -1, -1 }, { -1, -1, -1, -1, -1, -1, -1, -1 } };
                pieceMoveSet[1] = new double[8, 8];

				gameBoard = new double[8, 8];


                for (int row = 0; row < 8; row++)
                {
                    for (int col = 0; col < 8; col++)
                    {
						//print (row);
						//print (col);
						gameBoard [row,col] = gameBoard_in [row] [col];
                        originalGameBoard[row, col] = gameBoard[row, col]; // set the original Game Board
                    }
                }
            }
        }

        public void walkBoard() //essentially main(), it runs all move possibilities 
                                //and sends them to the tree by using other functions
        {
            depthCounter = 0; //How many moves past the current move
            while (depthCounter < 4) // Asks createDepth it iteratively create each level of the tree
            {
                createDepth(ref depthCounter);
            }
            decideTree.outputBest(); // Ask the tree object what is the best move
        }

        public void createDepth(ref int depthCounter) // iteratively generate levels of the tree
        {
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    gameBoard[i, j] = originalGameBoard[i, j]; // reset the game board each time to the original board
                }
            }
            decideTree.getBoard(ref gameBoard); //find out where we are in the tree as far as moves go
            if (depthCounter % 2 == 1) // If we are predicting the Users move we need to spin the board arround
            {
                for (int i = 0; i < 8; i++)
                {
                    for (int j = 0; j < 8; j++)
                    {
                        tempBoard[i, j] = gameBoard[7 - i, 7 - j] * -1; // spin it in the temp array
                    }
                }
                for (int i = 0; i < 8; i++)
                {
                    for (int j = 0; j < 8; j++)
                    {
                        gameBoard[i, j] = tempBoard[i, j]; // set it back as game board to work on the user side
                    }
                }
            }
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (gameBoard[i, j] > 0) // Search for a piece to move
                    {
                        setMoveSet(i, j); // Ask function to set available moves
                        checkForCheck(i,j);
                        decideBestMoves(i,j); // set the weight of each move
                        for (int h = 0; h < 8; h++)
                        {
                            for (int k = 0; k < 8; k++)
                            {
                                if (pieceMoveSet[0][h, k] == 1 || pieceMoveSet[0][h, k] == 0)
                                {
                                    //For every possible move find a start position, and end position, and create a node in the tree
                                    if (depthCounter % 2 == 0)
                                    {
                                        startPos[0] = i;
                                        startPos[1] = j;
                                        endPos[0] = h;
                                        endPos[1] = k;
                                    }
                                    if (depthCounter % 2 == 1)
                                    {
                                        startPos[0] = 7 - i;
                                        startPos[1] = 7 - j;
                                        endPos[0] = 7 - h;
                                        endPos[1] = 7 - k;
                                    }
                                    /*
                                    Node branch = new Node();
                                    branch = decideTree.getCurrent();
                                    bool isRepeat = false;
                                    while (branch.levelID != 0)
                                    {

                                        if (startPos[0] == branch.startPos[0] && startPos[1] == branch.startPos[1] &&
                                            endPos[0] == branch.endPos[0] && endPos[1] == branch.endPos[1])
                                        {
                                            isRepeat = true;
                                        }
                                        branch = branch.Back;
                                    }
                                    if(isRepeat)
                                    {
                                        branch.weight = -5000;
                                    }
                                    */
                                    //Create a node with (piece, start, end, weight, depth in tree, our Move Generator Object);
                                    decideTree.addNode(gameBoard[i, j], startPos, endPos, pieceMoveSet[1][h, k], depthCounter + 1 , this);
                                    pieceMoveSet[0][h, k] = -1; // clear available move
                                    pieceMoveSet[1][h, k] = 0; // clear move in weight as well
                                }
                            }
                        }
                    }
                }
            }
            if (depthCounter > 0) //Have we finished filling in the tree?
            {
                int previousSize = decideTree.getCurrent().Back.Back.SIZE - 1; // find how many nodes we need to fill
                decideTree.setCurrent(decideTree.getCurrent().Back); // move back one node to layer of fillable nodes
                while (decideTree.getCurrent().SIZE > 0 && previousSize >= 0) // while nodes are filled and there are still nodes left
                {
                    decideTree.setCurrent(decideTree.getCurrent().Back.Next[previousSize]); // look at new node in this layer
                    previousSize--; // move back one here as well
                }
                if(previousSize >= 0) // if there is still a node that needs to be filled, stay in this layer
                {
                    depthCounter--;
                }
            }
            depthCounter++; // increment depth Counter to either (stay in this layer if depthCounter was decremented) or (move down a layer if this layer is filled)
        }

        public void setMoveSet(int i, int j) // this is just looking at the move logic of each piece and setting all available moves.
        {
            if (gameBoard[i, j] == 1)
            {
                //Pawn
                if (i == 6) // if in starting row
                {
                    if (gameBoard[i - 2, j] == 0 && gameBoard[i - 1, j] == 0)
                    {
                        pieceMoveSet[0][i - 2, j] = 0;
                    }
                }
                if (i > 0 && gameBoard[i - 1, j] == 0) // if space ahead is free
                {
                    pieceMoveSet[0][i - 1, j] = 0;
                }
                if (i > 0) // if space up and to the right is takeable.
                {
                    if (j > 0 && gameBoard[i - 1, j - 1] < 0)
                    {
                        pieceMoveSet[0][i - 1, j - 1] = 1;
                    }
                    if (j < 7 && gameBoard[i - 1, j + 1] < 0)
                    {
                        pieceMoveSet[0][i - 1, j + 1] = 1;
                    }
                }
            }
            if (gameBoard[i, j] == 3)
            {
                //Knight
                if (j > 1) // if the knight is at least two rows from the users side
                {
                    if (i > 0)//move knight down 2 to the left 1
                    {
                        if (gameBoard[i - 1, j - 2] == 0)
                        {
                            pieceMoveSet[0][i - 1, j - 2] = 0;
                        }
                        if (gameBoard[i - 1, j - 2] < 0)
                        {
                            pieceMoveSet[0][i - 1, j - 2] = 1;
                        }
                    }
                }
                if (j > 1) // if the knight is at least two rows from the users side
                {
                    if (i < 7)//move knight down 2 to the right 1
                    {
                        if (gameBoard[i + 1, j - 2] == 0)
                        {
                            pieceMoveSet[0][i + 1, j - 2] = 1;
                        }
                        if (gameBoard[i + 1, j - 2] < 0)
                        {
                            pieceMoveSet[0][i + 1, j - 2] = 1;
                        }
                    }
                }
                if (j < 6) // if the knight is at least two rows from the A.I.'s side
                {
                    if (i > 0)//move knight down 2 to the left 1
                    {
                        if (gameBoard[i - 1, j + 2] == 0)
                        {
                            pieceMoveSet[0][i - 1, j + 2] = 0;
                        }
                        if (gameBoard[i - 1, j + 2] < 0)
                        {
                            pieceMoveSet[0][i - 1, j + 2] = 1;
                        }
                    }
                }
                if (j < 6) // if the knight is at least two rows from the A.I.'s side
                {
                    if (i < 7)//move knight down 2 to the right 1
                    {
                        if (gameBoard[i + 1, j + 2] == 0)
                        {
                            pieceMoveSet[0][i + 1, j + 2] = 0;
                        }
                        if (gameBoard[i + 1, j + 2] < 0)
                        {
                            pieceMoveSet[0][i + 1, j + 2] = 1;
                        }
                    }
                }
                if (i < 6) // Move 2 to the right
                {
                    if (j < 7) // the knight is at least one away from the A.I. side
                    {
                        if (gameBoard[i + 2, j + 1] == 0)
                        {
                            pieceMoveSet[0][i + 2, j + 1] = 0;
                        }
                        if (gameBoard[i + 2, j + 1] < 0)
                        {
                            pieceMoveSet[0][i + 2, j + 1] = 1;
                        }
                    }
                }
                if (i < 6) // Move 2 to the right
                {
                    if (j > 0) // the knight is at least one away from the user side
                    {
                        if (gameBoard[i + 2, j - 1] == 0)
                        {
                            pieceMoveSet[0][i + 2, j - 1] = 0;
                        }
                        if (gameBoard[i + 2, j - 1] < 0)
                        {
                            pieceMoveSet[0][i + 2, j - 1] = 1;
                        }
                    }
                }
                if (i > 1) // Move 2 to the left
                {
                    if (j < 7) // the knight is at least one away from the A.I. side
                    {
                        if (gameBoard[i - 2, j + 1] == 0)
                        {
                            pieceMoveSet[0][i - 2, j + 1] = 0;
                        }
                        if (gameBoard[i - 2, j + 1] < 0)
                        {
                            pieceMoveSet[0][i - 2, j + 1] = 1;
                        }
                    }
                }
                if (i > 1) // Move 2 to the left
                {
                    if (j > 0) // the knight is at least one away from the A.I. side
                    {
                        if (gameBoard[i - 2, j - 1] == 0)
                        {
                            pieceMoveSet[0][i - 2, j - 1] = 0;
                        }
                        if (gameBoard[i - 2, j - 1] < 0)
                        {
                            pieceMoveSet[0][i - 2, j - 1] = 1;
                        }
                    }
                }
            }
            if (gameBoard[i, j] == 3.1)
            {
                //Bishop
                int row = i;
                int col = j;
                while(row - 1 > 0 && col - 1 > 0 && gameBoard[row - 1, col - 1] <=0)
                {
                    row--;
                    col--;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
                row = i;
                col = j;
                while(row + 1 < 8 && col - 1 > 0 && gameBoard[row + 1, col - 1] <= 0)
                {
                    row++;
                    col--;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
                row = i;
                col = j;
                while (row + 1 < 8 && col + 1 < 8 && gameBoard[row + 1, col + 1] <= 0)
                {
                    row++;
                    col++;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
                row = i;
                col = j;
                while (row - 1 > 0 && col + 1 < 8 && gameBoard[row - 1, col + 1] <= 0)
                {
                    row--;
                    col++;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
            }
            if (gameBoard[i, j] == 5)
            {
                //Rook
                int row = i;
                int col = j;
                while (j > 0 && gameBoard[i, j - 1] <= 0) // moving down
                {
                    j--;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
                while (j < 7 && gameBoard[i, j + 1] <= 0) // moving up
                {
                    j++;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
                while (i > 0 && gameBoard[i - 1, j] <= 0) // moving left
                {
                    i--;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
                while (i < 7 && gameBoard[i + 1, j] <= 0) // moving right
                {
                    i++;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
            }
            if (gameBoard[i, j] == 9)
            {
                //Queen
                int row = i;
                int col = j;
                while (j > 0 && gameBoard[i, j - 1] <= 0) // moving down
                {
                    j--;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
                while (j < 7 && gameBoard[i, j + 1] <= 0) // moving up
                {
                    j++;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
                while (i > 0 && gameBoard[i - 1, j] <= 0) // moving left
                {
                    i--;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
                while (i < 7 && gameBoard[i + 1, j] <= 0) // moving right
                {
                    i++;
                    if (gameBoard[i, j] == 0)
                    {
                        pieceMoveSet[0][i, j] = 0;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        pieceMoveSet[0][i, j] = 1;
                        break;
                    }
                }
                i = row;
                j = col;
                while (row - 1 > 0 && col - 1 > 0 && gameBoard[row - 1, col - 1] <= 0)
                {
                    row--;
                    col--;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
                row = i;
                col = j;
                while (row + 1 < 8 && col - 1 > 0 && gameBoard[row + 1, col - 1] <= 0)
                {
                    row++;
                    col--;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
                row = i;
                col = j;
                while (row + 1 < 8 && col + 1 < 8 && gameBoard[row + 1, col + 1] <= 0)
                {
                    row++;
                    col++;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
                row = i;
                col = j;
                while (row - 1 > 0 && col + 1 < 8 && gameBoard[row - 1, col + 1] <= 0)
                {
                    row--;
                    col++;
                    pieceMoveSet[0][row, col] = 0;
                    if (gameBoard[i, j] < 0) break;
                }
            }
            if (gameBoard[i, j] == 3000)
            {
                //King
                if (i < 7 && gameBoard[i + 1, j] == 0) // move right
                {
                    pieceMoveSet[0][i + 1, j] = 0;
                }
                if (i < 7 && gameBoard[i + 1, j] < 0)
                {
                    pieceMoveSet[0][i + 1, j] = 1;
                }

                if (i > 0 && gameBoard[i - 1, j] == 0)
                {
                    pieceMoveSet[0][i - 1, j] = 0;
                }
                if (i > 0 && gameBoard[i - 1, j] < 0)
                {
                    pieceMoveSet[0][i - 1, j] = 1;
                }

                if (j < 7 && gameBoard[i, j + 1] == 0) // move up
                {
                    pieceMoveSet[0][i, j + 1] = 0;
                }
                if (j < 7 && gameBoard[i, j + 1] < 0)
                {
                    pieceMoveSet[0][i, j + 1] = 1;
                }

                if (j > 0 && gameBoard[i, j - 1] == 0) // move down
                {
                    pieceMoveSet[0][i, j - 1] = 0;
                }
                if (j > 0 && gameBoard[i, j - 1] < 0)
                {
                    pieceMoveSet[0][i, j - 1] = 1;
                }
            }
        }

        /// <summary>
        /// NOTE TO OCL PERSON!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        /// 
        /// decideBestMoves() is probably going to change a lot over the next few months so try to not go
        /// too much indepth on this portion of the code. This is meat of the A.I. and it is where all of
        /// work will be done for the rest of the semester.
        /// 
        /// Basically for OCL, pre-condition would be that we have the possible moves, and the post condition is we add a 
        /// weight to all of the moves.
        /// 
        /// 
        /// </summary>

        public void decideBestMoves(int row, int col)
        {
            if(depthCounter % 2 == 1)
            {
                for(int f = 0; f < 8; f++)
                {
                    for (int g = 0; g < 8; g++)
                    {
                        gameBoard[f, g] = originalGameBoard[7 - f, 7 - g];
                    }
                }
            }
            generateThreat();
            if (depthCounter % 2 == 1)
            {
                for (int f = 0; f < 8; f++)
                {
                    for (int g = 0; g < 8; g++)
                    {
                        gameBoard[f, g] = originalGameBoard[f, g];
                    }
                }
            }
            for (int i = 0; i < 7; i++)
            {
                for (int j = 0; j < 7; j++)
                {
                    if(row > j)
                    {
                       // pieceMoveSet[1][i, j] += (8 - row - i) + gameBoard[row,col];
                    }
                    if(i <= 4)
                    {
                        //pieceMoveSet[1][i, j] += 3 * i;
                    }
                    if (i > 4)
                    {
                       // pieceMoveSet[1][i, j] += 3 * (4 - i % 4);
                    }
                    if (pieceMoveSet[0][i, j] == 1) //This is basically saying if there is an attackable piece here...
                    {
                        pieceMoveSet[1][i, j] += gameBoard[i, j] * pow(-1, depthCounter + 1);
                    }
                    if (pieceMoveSet[0][i, j] == 0)//And if there is not an attackable piece...
                    {
                        if (threatArr[i, j] >= 0)
                        {
                            pieceMoveSet[1][i, j] += threatArr[i, j];//...Then make this change...
                        }
                        if (threatArr[i, j] < 0)
                        {
                            pieceMoveSet[1][i, j] += -10;//...Or this change.
                            print("You know it's dumb, so why u do this?");
                        }
                        pieceMoveSet[1][i,j] += gameBoard[row, col];
                        
                    }
                }
                for (int h = 0; h < 8; h++)
                {
                    for(int k = 0; k < 8; k++)
                    {
                        threatArr[h, k] = 0;
                    }
                }
            }
        } // this is comparing all of the moves to the threat array and giving each move weight


        public void generateThreat()//Uses move logic to find out all available moves for every piece and store those moves as possible attack positions. 
        {
            for (int i = 0; i < 7; i++)
            {
                for (int j = 0; j < 7; j++)
                {
                    if (gameBoard[i, j] > 0)
                    {
                        if (gameBoard[i, j] == 1)
                        {
                            //Pawn
                            if (i > 0) // if space up ahead is takeable.
                            {
                                if (j > 0) threatArr[i + 1, j - 1] += 1;
                                if (j < 7) threatArr[i + 1, j + 1] += 1;
                            }
                        }
                        if (gameBoard[i, j] == 3)
                        {
                            //Knight
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j > 0)//move knight down 2 to the left 1
                                {
                                    threatArr[i + 2, j - 1] += 1;
                                }
                            }
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j < 7)//move knight down 2 to the right 1
                                {
                                    threatArr[i + 2, j + 1] += 1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the A.I.'s side
                            {
                                if (j > 0)//move knight up 2 to the left 1
                                {
                                    threatArr[i - 2, j - 1] += 1;
                                }
                            }
                            if (i > 1)
                            {
                                if (j < 7)
                                {
                                    threatArr[i - 2, j + 1] += 1;
                                }
                            }
                            if (j < 6) // Move 2 to the right
                            {
                                if (i > 0) // the knight is at least one away from the user side
                                {
                                    threatArr[i - 1, j + 2] += 1;
                                }
                            }

                            if (j < 6) // Move 2 to the right
                            {
                                if (i < 7) // the knight is at least one away from the A.I.'s side
                                {
                                    threatArr[i + 1, j + 2] += 1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i > 0) // the knight is at least one away from the A.I. side
                                {
                                    threatArr[i - 1, j - 2] += 1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i < 7) // the knight is at least one away from the user side
                                {
                                    threatArr[i + 1, j - 2] += 1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == 3.1)
                        {
                            //Bishop
                            int row = i;
                            int col = j;
                            while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] <= 0) // move down to left
                            {
                                i--;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] <= 0) // move down to right
                            {
                                i++;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;

                            }
                            i = row;
                            j = col;
                            while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] <= 0) // down to left
                            {
                                i--;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] <= 0) //up to right
                            {
                                i++;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                        }
                        if (gameBoard[i, j] == 5)
                        {
                            //Rook
                            int row = i;
                            int col = j;
                            while (j > 0 && gameBoard[i, j - 1] <= 0)// moving down
                            {
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (j < 7 && gameBoard[i, j + 1] <= 0) // moving up
                            {
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i > 0 && gameBoard[i - 1, j] <= 0) // moving left
                            {
                                i--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i < 7 && gameBoard[i + 1, j] <= 0) // moving right
                            {
                                i++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                        }
                        if (gameBoard[i, j] == 9)
                        {
                            //Queen
                            int row = i;
                            int col = j;
                            while (j > 0 && gameBoard[i, j - 1] <= 0)// moving down
                            {
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (j < 7 && gameBoard[i, j + 1] <= 0) // moving up
                            {
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i > 0 && gameBoard[i - 1, j] <= 0) // moving left
                            {
                                i--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i < 7 && gameBoard[i + 1, j] <= 0) // moving right
                            {
                                i++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] <= 0) // move down to left
                            {
                                i--;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] <= 0) // move down to right
                            {
                                i++;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;

                            }
                            i = row;
                            j = col;
                            while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] <= 0) // down to left
                            {
                                i--;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] <= 0) //up to right
                            {
                                i++;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;

                        }
                        if (gameBoard[i, j] == 3000)
                        {
                            //King
                            if (i < 7)
                            {
                                threatArr[i + 1, j] += 1;
                                if (j > 0) threatArr[i + 1, j - 1] += 1;
                                if (j < 7) threatArr[i + 1, j + 1] += 1;
                            }
                            if (i > 0)
                            {
                                threatArr[i - 1, j] += 1;
                                if (j < 7) threatArr[i - 1, j + 1] += 1;
                                if (j > 0) threatArr[i - 1, j - 1] += 1;
                            }
                            if (j < 7)
                                threatArr[i, j + 1] += 1;
                            if (j > 0)
                                threatArr[i, j - 1] += 1;
                        }
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        if (gameBoard[i, j] == -1)
                        {
                            //Pawn
                            if (i < 7) // if space up and to the right is takeable.
                            {
                                if (j > 0 && gameBoard[i + 1, j - 1] >= 0)
                                {
                                    threatArr[i + 1, j - 1] += -1;
                                }
                                if (j < 7 && threatArr[i + 1, j + 1] >= 0)
                                {
                                    threatArr[i + 1, j + 1] += -1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == -3)
                        {
                            //Knight
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j > 0)//move knight down 2 to the left 1
                                {
                                    threatArr[i + 2, j - 1] += -1;
                                }
                            }
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j < 7)//move knight down 2 to the right 1
                                {
                                    threatArr[i + 2, j + 1] += -1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the A.I.'s side
                            {
                                if (j > 0)//move knight up 2 to the left 1
                                {
                                    threatArr[i - 2, j - 1] += -1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the users's side
                            {
                                if (j < 7)//move knight up 2 to the right 1
                                {
                                    threatArr[i - 2, j + 1] += -1;
                                }
                            }
                            if (j < 6) // Move 2 to the right
                            {
                                if (i > 0) // the knight is at least one away from the user side
                                {
                                    threatArr[i - 1, j + 2] += -1;
                                }
                            }

                            if (j < 6) // Move 2 to the right
                            {
                                if (i < 7) // the knight is at least one away from the A.I.'s side
                                {
                                    threatArr[i + 1, j + 2] += -1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i > 0) // the knight is at least one away from the A.I. side
                                {
                                    threatArr[i - 1, j - 2] += -1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i < 7) // the knight is at least one away from the user side
                                {
                                    threatArr[i + 1, j - 2] += -1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == -3.1)
                        {
                            //Bishop
                            {
                                //Bishop
                                int row = i;
                                int col = j;
                                while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] >= 0) // move down to left
                                {
                                    i--;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] >= 0) // move down to right
                                {
                                    i++;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;

                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] >= 0) // down to left
                                {
                                    i--;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] >= 0) //up to right
                                {
                                    i++;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -5)
                            {
                                //Rook
                                int row = i;
                                int col = j;
                                while (j - 1 > 0 && gameBoard[i, j - 1] >= 0) // moving down
                                {
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (j + 1 < 8 && gameBoard[i, j + 1] >= 0) // moving up
                                {
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && gameBoard[i - 1, j] >= 0) // moving left
                                {
                                    i--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && gameBoard[i + 1, j] >= 0) // moving right
                                {
                                    i++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -9)
                            {
                                //Queen
                                int row = i;
                                int col = j;
                                while (j - 1 > 0 && gameBoard[i, j - 1] >= 0) // moving down
                                {
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (j + 1 < 8 && gameBoard[i, j + 1] >= 0) // moving up
                                {
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && gameBoard[i - 1, j] >= 0) // moving left
                                {
                                    i--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && gameBoard[i + 1, j] >= 0) // moving right
                                {
                                    i++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] >= 0) // move down to left
                                {
                                    i--;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] >= 0) // move down to right
                                {
                                    i++;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;

                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] >= 0) // down to left
                                {
                                    i--;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] >= 0) //up to right
                                {
                                    i++;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -3000)
                            {
                                //King
                                if (i < 7)
                                {
                                    threatArr[i + 1, j] += -1;
                                    if (j < 7) threatArr[i + 1, j + 1] += -1;
                                    if (j > 0) threatArr[i + 1, j - 1] += -1;
                                }
                                if (i > 0)
                                {
                                    threatArr[i - 1, j] += -1;
                                    if (j > 0) threatArr[i - 1, j - 1] += -1;
                                    if (j < 7) threatArr[i - 1, j + 1] += -1;
                                }
                                if (j < 7) threatArr[i, j + 1] += -1;
                                if (j > 0) threatArr[i, j - 1] += -1;
                            }
                        }
                    }
                }
            }
        }

        public bool kingSafe()
        {
            double[,] boardTemp = new double[8, 8];
            int[] kingPos = new int[2];
            for(int h = 0; h < 8; h++)
            {
                for(int k = 0; k < 8; k++)
                {
                    threatArr[k, h] = 0;
                }
            }
            for(int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (gameBoard[i,j] == 3000)
                    {
                        kingPos[0] = i;
                        kingPos[1] = j;
                    }
                    if (gameBoard[i, j] < 0)
                    {
                        if (gameBoard[i, j] == -1)
                        {
                            //Pawn
                            if (i < 7) // if space up and to the right is takeable.
                            {
                                if (j > 0 && gameBoard[i + 1, j - 1] >= 0)
                                {
                                    threatArr[i + 1, j - 1] += -1;
                                }
                                if (j < 7 && threatArr[i + 1, j + 1] >= 0)
                                {
                                    threatArr[i + 1, j + 1] += -1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == -3)
                        {
                            //Knight
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j > 0)//move knight down 2 to the left 1
                                {
                                    threatArr[i + 2, j - 1] += -1;
                                }
                            }
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j < 7)//move knight down 2 to the right 1
                                {
                                    threatArr[i + 2, j + 1] += -1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the A.I.'s side
                            {
                                if (j > 0)//move knight up 2 to the left 1
                                {
                                    threatArr[i - 2, j - 1] += -1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the users's side
                            {
                                if (j < 7)//move knight up 2 to the right 1
                                {
                                    threatArr[i - 2, j + 1] += -1;
                                }
                            }
                            if (j < 6) // Move 2 to the right
                            {
                                if (i > 0) // the knight is at least one away from the user side
                                {
                                    threatArr[i - 1, j + 2] += -1;
                                }
                            }

                            if (j < 6) // Move 2 to the right
                            {
                                if (i < 7) // the knight is at least one away from the A.I.'s side
                                {
                                    threatArr[i + 1, j + 2] += -1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i > 0) // the knight is at least one away from the A.I. side
                                {
                                    threatArr[i - 1, j - 2] += -1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i < 7) // the knight is at least one away from the user side
                                {
                                    threatArr[i + 1, j - 2] += -1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == -3.1)
                        {
                            //Bishop
                            {
                                //Bishop
                                int row = i;
                                int col = j;
                                while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] >= 0) // move down to left
                                {
                                    i--;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] >= 0) // move down to right
                                {
                                    i++;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;

                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] >= 0) // down to left
                                {
                                    i--;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] >= 0) //up to right
                                {
                                    i++;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -5)
                            {
                                //Rook
                                int row = i;
                                int col = j;
                                while (j - 1 > 0 && gameBoard[i, j - 1] >= 0) // moving down
                                {
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (j + 1 < 8 && gameBoard[i, j + 1] >= 0) // moving up
                                {
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && gameBoard[i - 1, j] >= 0) // moving left
                                {
                                    i--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && gameBoard[i + 1, j] >= 0) // moving right
                                {
                                    i++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -9)
                            {
                                //Queen
                                int row = i;
                                int col = j;
                                while (j - 1 > 0 && gameBoard[i, j - 1] >= 0) // moving down
                                {
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (j + 1 < 8 && gameBoard[i, j + 1] >= 0) // moving up
                                {
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && gameBoard[i - 1, j] >= 0) // moving left
                                {
                                    i--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && gameBoard[i + 1, j] >= 0) // moving right
                                {
                                    i++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] >= 0) // move down to left
                                {
                                    i--;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] >= 0) // move down to right
                                {
                                    i++;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;

                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] >= 0) // down to left
                                {
                                    i--;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] >= 0) //up to right
                                {
                                    i++;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -3000)
                            {
                                //King
                                if (i < 7)
                                {
                                    threatArr[i + 1, j] += -1;
                                    if (j < 7) threatArr[i + 1, j + 1] += -1;
                                    if (j > 0) threatArr[i + 1, j - 1] += -1;
                                }
                                if (i > 0)
                                {
                                    threatArr[i - 1, j] += -1;
                                    if (j > 0) threatArr[i - 1, j - 1] += -1;
                                    if (j < 7) threatArr[i - 1, j + 1] += -1;
                                }
                                if (j < 7) threatArr[i, j + 1] += -1;
                                if (j > 0) threatArr[i, j - 1] += -1;
                            }
                        }
                    }
                }
            }

            if (threatArr[kingPos[0], kingPos[1]] == 0) return true;
            else
            {
                return false;
            }
        }

        public bool kingSafe(int kingPosition)
        {
            bool safe;
            double[,] boardTemp = new double[8, 8];
            int[] kingPos = new int[2];
            kingPos[0] = kingPosition / 8;
            kingPos[1] = kingPosition % 8;
            for (int h = 0; h < 8; h++)
            {
                for (int k = 0; k < 8; k++)
                {
                    threatArr[k, h] = 0;
                }
            }
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (gameBoard[i, j] < 0)
                    {
                        if (gameBoard[i, j] == -1)
                        {
                            //Pawn
                            if (i < 7) // if space up and to the right is takeable.
                            {
                                if (j > 0 && gameBoard[i + 1, j - 1] >= 0)
                                {
                                    threatArr[i + 1, j - 1] += -1;
                                }
                                if (j < 7 && threatArr[i + 1, j + 1] >= 0)
                                {
                                    threatArr[i + 1, j + 1] += -1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == -3)
                        {
                            //Knight
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j > 0)//move knight down 2 to the left 1
                                {
                                    threatArr[i + 2, j - 1] += -1;
                                }
                            }
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j < 7)//move knight down 2 to the right 1
                                {
                                    threatArr[i + 2, j + 1] += -1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the A.I.'s side
                            {
                                if (j > 0)//move knight up 2 to the left 1
                                {
                                    threatArr[i - 2, j - 1] += -1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the users's side
                            {
                                if (j < 7)//move knight up 2 to the right 1
                                {
                                    threatArr[i - 2, j + 1] += -1;
                                }
                            }
                            if (j < 6) // Move 2 to the right
                            {
                                if (i > 0) // the knight is at least one away from the user side
                                {
                                    threatArr[i - 1, j + 2] += -1;
                                }
                            }

                            if (j < 6) // Move 2 to the right
                            {
                                if (i < 7) // the knight is at least one away from the A.I.'s side
                                {
                                    threatArr[i + 1, j + 2] += -1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i > 0) // the knight is at least one away from the A.I. side
                                {
                                    threatArr[i - 1, j - 2] += -1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i < 7) // the knight is at least one away from the user side
                                {
                                    threatArr[i + 1, j - 2] += -1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == -3.1)
                        {
                            //Bishop
                            {
                                //Bishop
                                int row = i;
                                int col = j;
                                while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] >= 0) // move down to left
                                {
                                    i--;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] >= 0) // move down to right
                                {
                                    i++;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;

                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] >= 0) // down to left
                                {
                                    i--;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] >= 0) //up to right
                                {
                                    i++;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -5)
                            {
                                //Rook
                                int row = i;
                                int col = j;
                                while (j - 1 > 0 && gameBoard[i, j - 1] >= 0) // moving down
                                {
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (j + 1 < 8 && gameBoard[i, j + 1] >= 0) // moving up
                                {
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && gameBoard[i - 1, j] >= 0) // moving left
                                {
                                    i--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && gameBoard[i + 1, j] >= 0) // moving right
                                {
                                    i++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -9)
                            {
                                //Queen
                                int row = i;
                                int col = j;
                                while (j - 1 > 0 && gameBoard[i, j - 1] >= 0) // moving down
                                {
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (j + 1 < 8 && gameBoard[i, j + 1] >= 0) // moving up
                                {
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && gameBoard[i - 1, j] >= 0) // moving left
                                {
                                    i--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && gameBoard[i + 1, j] >= 0) // moving right
                                {
                                    i++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] >= 0) // move down to left
                                {
                                    i--;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] >= 0) // move down to right
                                {
                                    i++;
                                    j--;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;

                                }
                                i = row;
                                j = col;
                                while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] >= 0) // down to left
                                {
                                    i--;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                                while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] >= 0) //up to right
                                {
                                    i++;
                                    j++;
                                    threatArr[i, j] += -1;
                                    if (gameBoard[i, j] > 0) break;
                                }
                                i = row;
                                j = col;
                            }
                            if (gameBoard[i, j] == -3000)
                            {
                                //King
                                if (i < 7)
                                {
                                    threatArr[i + 1, j] += -1;
                                    if (j < 7) threatArr[i + 1, j + 1] += -1;
                                    if (j > 0) threatArr[i + 1, j - 1] += -1;
                                }
                                if (i > 0)
                                {
                                    threatArr[i - 1, j] += -1;
                                    if (j > 0) threatArr[i - 1, j - 1] += -1;
                                    if (j < 7) threatArr[i - 1, j + 1] += -1;
                                }
                                if (j < 7) threatArr[i, j + 1] += -1;
                                if (j > 0) threatArr[i, j - 1] += -1;
                            }
                        }
                    }
                }
            }

            if (threatArr[kingPos[0], kingPos[1]] == 0) safe = true;
            else safe = false;
            return safe;
        }

        public bool adamIsABitch(int checkedPosition)
        {
            bool bitchness = false;
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (gameBoard[i, j] > 0)
                    {
                        if (gameBoard[i, j] == 1)
                        {
                            //Pawn
                            if (i > 0) // if space up ahead is takeable.
                            {
                                if (j > 0) threatArr[i + 1, j - 1] += 1;
                                if (j < 7) threatArr[i + 1, j + 1] += 1;
                            }
                        }
                        if (gameBoard[i, j] == 3)
                        {
                            //Knight
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j > 0)//move knight down 2 to the left 1
                                {
                                    threatArr[i + 2, j - 1] += 1;
                                }
                            }
                            if (i < 6) // if the knight is at least two rows from the users side
                            {
                                if (j < 7)//move knight down 2 to the right 1
                                {
                                    threatArr[i + 2, j + 1] += 1;
                                }
                            }
                            if (i > 1) // if the knight is at least two rows from the A.I.'s side
                            {
                                if (j > 0)//move knight up 2 to the left 1
                                {
                                    threatArr[i - 2, j - 1] += 1;
                                }
                            }
                            if (i > 1)
                            {
                                if (j < 7)
                                {
                                    threatArr[i - 2, j + 1] += 1;
                                }
                            }
                            if (j < 6) // Move 2 to the right
                            {
                                if (i > 0) // the knight is at least one away from the user side
                                {
                                    threatArr[i - 1, j + 2] += 1;
                                }
                            }

                            if (j < 6) // Move 2 to the right
                            {
                                if (i < 7) // the knight is at least one away from the A.I.'s side
                                {
                                    threatArr[i + 1, j + 2] += 1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i > 0) // the knight is at least one away from the A.I. side
                                {
                                    threatArr[i - 1, j - 2] += 1;
                                }
                            }
                            if (j > 1) // Move 2 to the left
                            {
                                if (i < 7) // the knight is at least one away from the user side
                                {
                                    threatArr[i + 1, j - 2] += 1;
                                }
                            }
                        }
                        if (gameBoard[i, j] == 3.1)
                        {
                            //Bishop
                            int row = i;
                            int col = j;
                            while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] <= 0) // move down to left
                            {
                                i--;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] <= 0) // move down to right
                            {
                                i++;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;

                            }
                            i = row;
                            j = col;
                            while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] <= 0) // down to left
                            {
                                i--;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] <= 0) //up to right
                            {
                                i++;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                        }
                        if (gameBoard[i, j] == 5)
                        {
                            //Rook
                            int row = i;
                            int col = j;
                            while (j > 0 && gameBoard[i, j - 1] <= 0)// moving down
                            {
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (j < 7 && gameBoard[i, j + 1] <= 0) // moving up
                            {
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i > 0 && gameBoard[i - 1, j] <= 0) // moving left
                            {
                                i--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i < 7 && gameBoard[i + 1, j] <= 0) // moving right
                            {
                                i++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                        }
                        if (gameBoard[i, j] == 9)
                        {
                            //Queen
                            int row = i;
                            int col = j;
                            while (j > 0 && gameBoard[i, j - 1] <= 0)// moving down
                            {
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (j < 7 && gameBoard[i, j + 1] <= 0) // moving up
                            {
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i > 0 && gameBoard[i - 1, j] <= 0) // moving left
                            {
                                i--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i < 7 && gameBoard[i + 1, j] <= 0) // moving right
                            {
                                i++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            row = i;
                            col = j;
                            while (i - 1 > 0 && j - 1 > 0 && gameBoard[i - 1, j - 1] <= 0) // move down to left
                            {
                                i--;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j - 1 > 0 && gameBoard[i + 1, j - 1] <= 0) // move down to right
                            {
                                i++;
                                j--;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;

                            }
                            i = row;
                            j = col;
                            while (i - 1 > 0 && j + 1 < 8 && gameBoard[i - 1, j + 1] <= 0) // down to left
                            {
                                i--;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;
                            while (i + 1 < 8 && j + 1 < 8 && gameBoard[i + 1, j + 1] <= 0) //up to right
                            {
                                i++;
                                j++;
                                threatArr[i, j] += 1;
                                if (gameBoard[i, j] < 0) break;
                            }
                            i = row;
                            j = col;

                        }
                        if (gameBoard[i, j] == 3000)
                        {
                            //King
                            if (i < 7)
                            {
                                threatArr[i + 1, j] += 1;
                                if (j > 0) threatArr[i + 1, j - 1] += 1;
                                if (j < 7) threatArr[i + 1, j + 1] += 1;
                            }
                            if (i > 0)
                            {
                                threatArr[i - 1, j] += 1;
                                if (j < 7) threatArr[i - 1, j + 1] += 1;
                                if (j > 0) threatArr[i - 1, j - 1] += 1;
                            }
                            if (j < 7)
                                threatArr[i, j + 1] += 1;
                            if (j > 0)
                                threatArr[i, j - 1] += 1;
                        }
                    }
                }
            }
                if (threatArr[checkedPosition/8, checkedPosition % 8] != 0) bitchness = true;
                return bitchness;
        }

        private void checkForCheck(int i, int j)
        {
            double piece = gameBoard[i, j];
            double oldVal; //Stores what the space used to be
            gameBoard[i, j] = 0;
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    if (pieceMoveSet[0][row,col] != -1)
                    {
                        oldVal = gameBoard[row, col];
                        gameBoard[row, col] = piece;
                        if(!kingSafe())
                        {
                            pieceMoveSet[0][row, col] = -1;
                            pieceMoveSet[1][row, col] = 0;
                        }
                        gameBoard[row, col] = oldVal;
                    }
                }
            }
            gameBoard[i, j] = piece;
        }
        public void updateBoard(int[] startPos, int[] endPos)
        {
            double piece;
            piece = gameBoard[startPos[0], startPos[1]];
            gameBoard[startPos[0], startPos[1]] = 0;
            gameBoard[endPos[0], endPos[1]] = piece;
        }
        private int pow(int A, int B)
        {
            int retVal = 1;
            for (int b = 0; b < B; b++)
            {
                retVal = retVal * A;
            }
            return retVal;
        } // finds A^B exponent.

    }
}