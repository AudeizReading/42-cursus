#include <RBT.hpp>

namespace ft
{
	void		rotate_left(NodeBTImpl* const node, NodeBTImpl*& root)
	{
		//					 |
		//				____node____
		//             /			\
		//        node's		right_child
		//        left		   /			\
		//        child  right_child's	right_child's
		//					 left          right
		//						
		//						|
		//						V
		//						
		//					 |
		//				right_child
		//             /			\
		//			node		 right_child
		//		   /    \			right
		//		node's  right
		//      left	_child's	
		//      child	left
		//						
		NodeBTImpl* const right_child = node->right;

		node->right = right_child->left; // get back the left subtree of the node's right child
		if (right_child->left) // if left subtree is not empty
			right_child->left->parent = node; // node becomes the parent of the subtree
		right_child->parent = node->parent; // the node's parent becomes the right child's one

		if (node == root) // if we are dealing with the tree's root
			root = right_child; // the node's right child becomes root
		else if (node == node->parent->left) // if node is a left child
			node->parent->left = right_child; // right_child becomes a left child
		else // otherwise it is a right child
			node->parent->right = right_child; // right_child becomes a right child

		right_child->left = node; // node becomes the right_child's left child
		node->parent = right_child; // the right node's parent is readjusted
	}

	// same as left_rotate
	void		rotate_right(NodeBTImpl* const node, NodeBTImpl*& root)
	{
		NodeBTImpl* const left_child = node->left;

		node->left = left_child->right;
		if (left_child->right)
			left_child->right->parent = node;
		left_child->parent = node->parent;

		if (node == root)
			root = left_child;
		else if (node == node->parent->right)
			node->parent->right = left_child;
		else
			node->parent->left = left_child;
		left_child->right = node;
		node->parent = left_child;
	}

	void		balance_at_insert(NodeBTImpl* node, NodeBTImpl*& root)
	{
		NodeBTImpl*	uncle = 0;

		while (node != root && node->parent->color == RED_COL)
		{
			if (node->parent == node->parent->parent->left) // if the node's parent is a left child
			{
				uncle = node->parent->parent->right;
				if (uncle && uncle->color == RED_COL)
				{
					node->parent->color = BLK_COL;
					uncle->color = BLK_COL;
					node->parent->parent->color = RED_COL;
					node = node->parent->parent;
				}
				else
				{
					if (node == node->parent->right)
					{
						node = node->parent;
						rotate_left(node, root);
					}
					node->parent->color = BLK_COL;
					node->parent->parent->color = RED_COL;
					rotate_right(node->parent->parent, root);
				}
			}
			else // otherwise node's parent is a right child
			{
				uncle = node->parent->parent->left;
				if (uncle && uncle->color == RED_COL)
				{
					node->parent->color = BLK_COL;
					uncle->color = BLK_COL;
					node->parent->parent->color = RED_COL;
					node = node->parent->parent;
				}
				else
				{
					if (node == node->parent->left)
					{
						node = node->parent;
						rotate_right(node, root);
					}
					node->parent->color = BLK_COL;
					node->parent->parent->color = RED_COL;
					rotate_left(node->parent->parent, root);
				}
			}
		}
		root->color = BLK_COL;
	}

	void		insert_rbt_node(const bool is_leftmost_node, NodeBTImpl* node, NodeBTImpl* parent, NodeBTImpl& sentinil)
	{
		NodeBTImpl *& root = sentinil.parent;

		// Initialize fields in new node to insert.
		node->parent = parent;
		node->left = 0;
		node->right = 0;
		node->color = RED_COL;

		// Insert.
		// Make new node child of parent and maintain root, leftmost and
		// rightmost nodes.
		// N.B. First node is always inserted left.
		if (is_leftmost_node)
		{
			parent->left = node; // also makes leftmost = node when parent == &sentinil

			if (parent == &sentinil)
			{
				sentinil.parent = node;
				sentinil.right = node;
			}
			else if (parent == sentinil.left)
				sentinil.left = node; // maintain leftmost pointing to min node
		}
		else
		{
			parent->right = node;

			if (parent == sentinil.right)
				sentinil.right = node; // maintain rightmost pointing to max node
		}
		// Rebalance.
		balance_at_insert(node, root);
	}

	// deleting node red_black_tree's rule
	NodeBTImpl*	get_child_at_delete(NodeBTImpl*& node)
	{
		NodeBTImpl*	child = 0;						

		if (!node->left) // if there is no left child splice the child to the right child, even it is nul
		{
			child = node->right;
		}
		else // there is a left child
		{
			if (!node->right) // but there is not right child, so splice the child to the left child
			{
				child = node->left;
			}
			else // there is a right child (so the node we want to delete has 2 children)
			{
				node = node->get_leftmost_node(node->right); // searching for the minimum in the right subtree
				child = node->right;
			}
		}
		return child;
	}

	void		adjust_sentinel_at_erase(NodeBTImpl* original, NodeBTImpl* child, NodeBTImpl& sentinel)
	{
		// readjust sentinel
		NodeBTImpl*&	leftmost = sentinel.left;	// min from sentinel as ref like that we can modify
		NodeBTImpl*&	rightmost = sentinel.right;	// max from sentinel

		if (leftmost == original) // If the node to delete is the leftmost
		{
			if (!original->right) // and if the node has not a right child
			{
				leftmost = original->parent; // then we go back to the parent for finding the next leftmost
			}
			else // else it has a right child, so we need to find the leftmost value inside this subtree
			{
				leftmost = NodeBTImpl::get_leftmost_node(child);
			}
		}

		if (rightmost == original) // the same but if it is the rightmost
		{
			if (!original->left)
			{
				rightmost = original->parent;
			}
			else
			{
				rightmost = NodeBTImpl::get_rightmost_node(child);
			}
		}
	}

	void		balance_at_erase(NodeBTImpl*& node_impl, NodeBTImpl*& node_impl_parent, NodeBTImpl sentinel) 
	{
		NodeBTImpl*		sibling = 0;
		NodeBTImpl*&	root = sentinel.parent;

		while (node_impl != root && (node_impl == 0 || node_impl->color == BLK_COL))
		{ // while node_impl is not root AND is nul or BLACK
			if (node_impl == node_impl_parent->left) // if it is a left child
			{
				sibling = node_impl_parent->right; // sibling is its right brother
				if (sibling->color == RED_COL) // if sibling is red
				{
					sibling->color = BLK_COL; // set it to black
					node_impl_parent->color = RED_COL; // pass the parent red
					rotate_left(node_impl_parent, root); // left rotate the parent
					sibling = node_impl_parent->right; // set sibling as its right brother again
				}
				if ((sibling->left == 0 || sibling->left->color == BLK_COL) &&
						(sibling->right == 0 || sibling->right->color == BLK_COL))
				{ // if children's sibling are both nul or black
					sibling->color = RED_COL; // set sibling to red
					node_impl = node_impl_parent; // go back to the parent
					node_impl_parent = node_impl_parent->parent; // go back to the parent
				}
				else // one children is red
				{
					if (sibling->right == 0 || sibling->right->color == BLK_COL) // if it is not the sibling's right child
					{
						sibling->left->color = BLK_COL; // set its brother to black
						sibling->color = RED_COL; // pass sibling red
						rotate_right(sibling, root); // right rotate sibling
						sibling = node_impl_parent->right; // set sibling as its right brother again
					}
					sibling->color = node_impl_parent->color; // sibling takes the node_impl's parent colors
					node_impl_parent->color = BLK_COL; // this one is passed black
					if (sibling->right)
						sibling->right->color = BLK_COL; // pas the right child black if exists
					rotate_left(node_impl_parent, root); // left rotate the node_impl's parent
					break;
				//	node_impl = root; // node_impl becomes root and breaks the loop
				}
			}
			else // else it is a right child, same but for right child
			{
				sibling = node_impl_parent->left;
				if (sibling->color == RED_COL)
				{
					sibling->color = BLK_COL;
					node_impl_parent->color = RED_COL;
					rotate_right(node_impl_parent, root);
					sibling = node_impl_parent->left;
				}
				if ((sibling->right == 0 || sibling->right->color == BLK_COL) &&
						(sibling->left == 0 || sibling->left->color == BLK_COL))
				{
					sibling->color = RED_COL;
					node_impl = node_impl_parent;
					node_impl_parent = node_impl_parent->parent;
				}
				else
				{
					if (sibling->left == 0 || sibling->left->color == BLK_COL)
					{
						sibling->right->color = BLK_COL;
						sibling->color = RED_COL;
						rotate_left(sibling, root);
						sibling = node_impl_parent->left;
					}
					sibling->color = node_impl_parent->color;
					node_impl_parent->color = BLK_COL;
					if (sibling->left)
						sibling->left->color = BLK_COL;
					rotate_right(node_impl_parent, root);
					break;
				//	node_impl = root;
				}
			}
		}
		if (node_impl) 
			node_impl->color = BLK_COL;
	}

	NodeBTImpl* get_node_to_delete(NodeBTImpl* const original, NodeBTImpl& sentinel)
	{
		typedef NodeBTImpl*		NodeImplPtr;

		NodeImplPtr&	root = sentinel.parent;
		NodeImplPtr		buffer = original; // buffer is the node that will be returned for deleting
		NodeImplPtr		child = get_child_at_delete(buffer); // buffer may have changed if it has 2 children
		NodeImplPtr		node_parent = 0; // need this one specially for rebalancing, it will often be the child's parent (the buffer is the child's parent)

		if (buffer != original) // if buffer has changed since - it may if it has 2 children
		{
			// relink buffer in place of original.  buffer is original's successor
			original->left->parent = buffer; // let's splice them together
			buffer->left = original->left;
			if (buffer != original->right) // if buffer is not the right child of the original node, it must become it
			{
				node_parent = buffer->parent;
				if (child) 
					child->parent = buffer->parent;
				buffer->parent->left = child;   // buffer must be a child of left
				buffer->right = original->right; // the original's right child becomes the buffer's right one
				original->right->parent = buffer; // and the parent's right child becomes the buffer
			}
			else
				node_parent = buffer;

			//
			//				P						P
			//				|						|
			//			  parent				  parent
			//		   L   /:\    R			   L   /:\    R
			//			   \:/					   \:/
			//				P						P
			//				|		   ===>>		|
			//			   node					  child
			//		   L   /:\    R			   L   /:\    R
			//			   \:/					   \:/
			//				P						P
			//				|						|
			//			  child					   node
			//		   L   /:\    R			   L   /:\    R
			//
			// Exchange original and buffer position inside tree
			if (root == original)
				root = buffer;
			else if (original->parent->left == original)
				original->parent->left = buffer;
			else
				original->parent->right = buffer;

			buffer->parent = original->parent;
			NSP::swap(buffer->color, original->color); // swap buffer's color with original's color
			buffer = original; // buffer now points to child to be actually deleted
		}
		else
		{                        // buffer == original
			node_parent = buffer->parent;
			if (child)
				child->parent = buffer->parent;

			if (root == original)
				root = child;
			else if (original->parent->left == original)
				original->parent->left = child;
			else
				original->parent->right = child;

			adjust_sentinel_at_erase(original, child, sentinel); 
		}
		if (buffer->color != RED_COL) // balancing
									  //if (buffer->color == BLK_COL) // balancing
		{
			NodeBTImpl*		sibling = 0;
			// Does not work inside a function (for erasing with range iterator)!!! How the hell?
			while (child != root && (child == 0 || child->color == BLK_COL))
			{ // while child is not root AND is nul or BLACK
				if (child == node_parent->left) // if it is a left child
				{
					sibling = node_parent->right; // sibling is its right brother
					if (sibling->color == RED_COL) // if sibling is red
					{
						sibling->color = BLK_COL; // set it to black
						node_parent->color = RED_COL; // pass the parent red
						rotate_left(node_parent, root); // left rotate the parent
						sibling = node_parent->right; // set sibling as its right brother again
					}
					if ((sibling->left == 0 || sibling->left->color == BLK_COL) &&
							(sibling->right == 0 || sibling->right->color == BLK_COL))
					{ // if children's sibling are both nul or black
						sibling->color = RED_COL; // set sibling to red
						child = node_parent; // go back to the parent
						node_parent = node_parent->parent; // go back to the parent
					}
					else // one children is red
					{
						if (sibling->right == 0 || sibling->right->color == BLK_COL) // if it is not the sibling's right child
						{
							sibling->left->color = BLK_COL; // set its brother to black
							sibling->color = RED_COL; // pass sibling red
							rotate_right(sibling, root); // right rotate sibling
							sibling = node_parent->right; // set sibling as its right brother again
						}
						sibling->color = node_parent->color; // sibling takes the child's parent colors
						node_parent->color = BLK_COL; // this one is passed black
						if (sibling->right)
							sibling->right->color = BLK_COL; // pas the right child black if exists
						rotate_left(node_parent, root); // left rotate the child's parent
														//break;
						child = root; // child becomes root and breaks the loop
					}
				}
				else // else it is a right child, same but for right child
				{
					sibling = node_parent->left;
					if (sibling->color == RED_COL)
					{
						sibling->color = BLK_COL;
						node_parent->color = RED_COL;
						rotate_right(node_parent, root);
						sibling = node_parent->left;
					}
					if ((sibling->right == 0 || sibling->right->color == BLK_COL) &&
							(sibling->left == 0 || sibling->left->color == BLK_COL))
					{
						sibling->color = RED_COL;
						child = node_parent;
						node_parent = node_parent->parent;
					}
					else
					{
						if (sibling->left == 0 || sibling->left->color == BLK_COL)
						{
							sibling->right->color = BLK_COL;
							sibling->color = RED_COL;
							rotate_left(sibling, root);
							sibling = node_parent->left;
						}
						sibling->color = node_parent->color;
						node_parent->color = BLK_COL;
						if (sibling->left)
							sibling->left->color = BLK_COL;
						rotate_right(node_parent, root);
						//	break;
						child = root;
					}
				}
			}
			if (child) 
				child->color = BLK_COL;
		}
		return buffer;
	}
} // end namespace ft
