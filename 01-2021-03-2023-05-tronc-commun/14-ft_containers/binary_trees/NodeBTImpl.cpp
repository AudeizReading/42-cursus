#include <RBT.hpp>

ft::NodeBTImpl::NodeImplPtr ft::NodeBTImpl::get_leftmost_node(ft::NodeBTImpl::NodeImplPtr node)
{
	while (node->left != 0) 
		node = node->left;
	return node;
}

ft::NodeBTImpl::const_NodeImplPtr ft::NodeBTImpl::get_leftmost_node(ft::NodeBTImpl::const_NodeImplPtr node)
{
	while (node->left != 0) 
		node = node->left;
	return node;
}

ft::NodeBTImpl::NodeImplPtr ft::NodeBTImpl::get_rightmost_node(ft::NodeBTImpl::NodeImplPtr node)
{
	while (node->right != 0) 
		node = node->right;
	return node;
}

ft::NodeBTImpl::const_NodeImplPtr ft::NodeBTImpl::get_rightmost_node(ft::NodeBTImpl::const_NodeImplPtr node)
{
	while (node->right != 0) 
		node = node->right;
	return node;
}
