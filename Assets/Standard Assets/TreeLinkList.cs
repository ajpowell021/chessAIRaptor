///<summary>
///Tree Link List Class
///Coded By: Patrick Bodell
///Last Update 4/15/2016
///Written for Fall 2016 - Capstone Course
///Team Members : Paul St. Pierre, Dylan Sheppard, Adam Powell, Garry Cardillo
///Instructor : Dr. Farmer
/// </summary>

using System;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace moveGenerator
{
    public class TreeLinkList : MonoBehaviour
    {
		
        public int UIFrom;
        public int UITo;
		public Text fromText;
		public Text toText;
		public Text triggerText;
        private Node root; // not a move, but basically is an abstract "You are here"
        private Node current; // node we are working on
        private Node previous = new Node(); // node that we worked on a while ago
        private Node parent = new Node(); // node holding our actual move option this turn
        private MoveGenerator board;
        public class Node // container holding moves
        {
            public int SIZE = 0; // number of moves that could be done after this one
            public int levelID; // what level this node is held in
            public Node Back; // A links this node to its parent node
            public double piece; // what is the piece? Rook, Bishop, etc...
            public int[] startPos = new int[2]; // Where is the piece now?
            public int[] endPos = new int[2]; // Where is the piece going?
            public double weight; // How strong is the move?
            public List<Node> Next = new List<Node>(); // Links this node to all of its children
			public Node() {  } // Default Constructor
            public Node(double piece_in, int[] startPos_in, int[] endPos_in, double weight_in,int lvlID) // constructor for node
            {
                piece = piece_in;
                startPos[0] = startPos_in[0];
                startPos[1] = startPos_in[1];
                endPos[0] = endPos_in[0];
                endPos[1] = endPos_in[1];
                levelID = lvlID;
                weight = weight_in;
            }
        }
        public TreeLinkList() // constructs the start of the tree
        {
            root = new Node(); // make the root a general node
            root.levelID = 0; // root is at level 0
            root.SIZE = 0; // Root starts with size 0
            previous = root; // we can't go back
            parent = root; // we have no other parents yet
            current = root; // we are at root

        }
        public void addNode(double piece_in, int[] startPos_in, int[] endPos_in, double weight_in, int lvlID, MoveGenerator main)
        {
            board = main;
            while (current.levelID != lvlID-1) //Adding in new nodes will need to be set in at the current level
            {
                if (current.levelID < lvlID - 1) // move down to the parent node
                {
                    current = current.Back;
                    current = current.Next[current.SIZE - 1];
                    current = current.Next[current.SIZE - 1];
                }
                if (current.levelID > lvlID - 1) // move up to the parent node
                {
                    current = current.Back;
                }
            }

                Node node = new Node(piece_in, startPos_in, endPos_in, weight_in, lvlID); // create the node
                current.Next.Add(node); // add the node to its parent
                current.SIZE++; // increment the parent's size
                previous = current; // parent is now previous
                current = node; // current is the node we just made
                current.Back = previous; // set the back option of this node to the parent we just left
        }
        public void outputBest() // look at all of the nodes in order parent to leaf, add the weight up, and pick the best node
        {
            double currentWeight = 0; // weight at current sum
            double bestWeight = -500; // best weight is given a very small number to make the first move the best move so that we are 
                                      // guaranteed a move
            Node bestParent = new Node(); // create a container for best move
            Node currentParent = new Node(); // current move we are analyzing

            current = root; // start at "You are here"
            for(int rootSize = root.SIZE-1; rootSize >= 0; rootSize--) // find all parents
            {
                currentParent = root.Next[rootSize]; // choose the next parent
                current = currentParent; // set current as currentParent so that we can walk current to the leaves
                discoverBestWeight(ref bestWeight,ref currentWeight,ref current,ref bestParent,ref currentParent);
                        //send parent to this function to find out if it is better than the previous best
            }
            ///<summary>
            ///NOTE TO OCL WRITER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            ///
            /// 
            /// 
            /// This will soon be a function that sends data to a JS file.
            /// 
            ///  All it is doing is taking the best parent, converting it to an array with start and end positions,
            ///  then sending it off to the JS as a single dimension array Array[2] = {Start, End}
            ///  
            /// name of function will be sendToUI();
            /// 
            /// 
            /// 
            /// </summary>
            print("Move has a weight of");
            print(bestWeight);
            board.updateBoard(bestParent.startPos, bestParent.endPos);
			UIFrom = (7 - bestParent.startPos[0]) * 8 + (7 - bestParent.startPos[1]);
			UITo= (7 - bestParent.endPos[0]) * 8 + (7 - bestParent.endPos[1]);

			// This is where the AI will send the move to the UI
			// - Adam

			print ("FROM: " + UIFrom);
			print ("TO: " + UITo);


			fromText = GameObject.Find ("homeText").GetComponent<Text>();
			toText = GameObject.Find ("awayText").GetComponent<Text> ();
			triggerText = GameObject.Find ("triggerBox").GetComponent<Text>();

			// Whatever you set these to is the move that UI will make for 
			// the ai.
			// - Adam
			fromText.text = UIFrom.ToString();
			toText.text = UITo.ToString();
			triggerText.text = "1";
















        }
        /// <summary>
        /// NOTE TO OCL WRITER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        /// 
        /// This is another function that is subject to change, I havent worked out all of the bugs in this part yet.
        /// 
        /// Simply put, it adds all of the nodes up and picks the best. There should be some more max/min play here
        /// 
        /// </summary>
        /// <param name="bestWeight"></param>
        /// <param name="currentWeight"></param>
        /// <param name="current"></param>
        /// <param name="bestParent"></param>
        /// <param name="currentParent"></param>
        private void discoverBestWeight(ref double bestWeight, ref double currentWeight, ref Node current, ref Node bestParent, ref Node currentParent)
        {
            currentWeight += current.weight; // add the weight of the node
            if (current.SIZE > 0) // does this node have children?
            {
                for (int currentSize = current.SIZE - 1; currentSize >= 0; currentSize--) // check all of the children
                {
                    if (current.SIZE > 0)
                    {
                        current = current.Next[currentSize]; // if it is not a leaf move to next node
                    }
                    discoverBestWeight(ref bestWeight, ref currentWeight, ref current, ref bestParent, ref currentParent);
                    //Run this function for all nodes until we reach a leaf
                }
            }
            if (current.SIZE == 0) // Once we get to a leaf we need to see if it is the best path.
            {
                if (bestWeight < currentWeight) // if the current move is better, use that move
                {
                    bestWeight = currentWeight;
                    bestParent = currentParent;
                }
                if (bestWeight == currentWeight) // prefer moving lesser pieces to gain equal board position.
                {
                    if (current.piece > bestParent.piece)
                    {
                        bestWeight = currentWeight;
                        bestParent = currentParent;
                    }
                }
                currentWeight -= current.weight; // move back one so we can check the next leaf
            }
        }
        
        public void getBoard(ref double[,] gameBoard) // return the gameBoard to MoveGenerator
        {
            int stack = -1; // Start with nothing on the stack
            int[,] move = new int[4,4]; // array giving [stack position, moveInfo]
            Node temp = new Node(); // temp node to move around
            temp = current; // start at current
            while(temp.levelID != 0) // walk back to the root
            {
                
                stack++; // add one to stack counter
                move[stack, 0] = current.startPos[0]; // add moves to the stack
                move[stack, 1] = current.startPos[1];
                move[stack, 2] = current.endPos[0];
                move[stack, 3] = current.endPos[1];
                temp = temp.Back; // move back one
            }
            if (stack > -1) // if there was a move added to the tree at all
            {
                for (int i = 0; i <= stack; i++) // make all of the moves in the stack
                {
                    gameBoard[move[i, 0], move[i, 1]] = gameBoard[move[i, 2], move[i, 3]]; // set the board for each move
                }
            }
        }
        public void setCurrent(Node current_in) // set the current Node from another class
        {
            current = current_in;
        }
        public Node getCurrent() // access the current node in another class
        {
            return current;
        }
        public Node getRoot()
        {
            return root;
        }
    }
    

        
}

