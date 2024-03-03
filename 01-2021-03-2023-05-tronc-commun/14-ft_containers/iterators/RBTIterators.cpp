#include <RBT.hpp>

namespace ft
{
	NodeBTImpl*			increment_iterator(NodeBTImpl* node)
	{
		if (node->right != 0)
		{
			node = node->right;
			while (node->left != 0)
				node = node->left;
		}
		else
		{
			NodeBTImpl* next = node->parent;
			while (node == next->right)
			{
				node = next;
				next = next->parent;
			}
			if (node->right != next)
				node = next;
		}
		return node;
	}

	const NodeBTImpl*	increment_iterator(const NodeBTImpl* node) 
	{ return increment_iterator(const_cast<NodeBTImpl*>(node)); }

	NodeBTImpl*			red_black_tree_decrement(NodeBTImpl* node)
	{
		if (node->color == RED_COL
				&& node->parent->parent == node)
			node = node->right;
		else if (node->left != 0)
		{
			NodeBTImpl* next = node->left;
			while (next->right != 0)
				next = next->right;
			node = next;
		}
		else
		{
			NodeBTImpl* next = node->parent;
			while (node == next->left)
			{
				node = next;
				next = next->parent;
			}
			node = next;
		}
		return node;
	}

	const NodeBTImpl*	red_black_tree_decrement(const NodeBTImpl* node)
	{ return red_black_tree_decrement(const_cast<NodeBTImpl*>(node)); }

} //end namespace ft
