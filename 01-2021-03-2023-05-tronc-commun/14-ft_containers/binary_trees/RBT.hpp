#ifndef RBT_HPP
# define RBT_HPP

# define NSP ft

# include <iostream>
# include <memory>
# include <iterator_functions.hpp>
# include <type_traits.hpp>
# include <utility.hpp>
# include <algorithm.hpp>
# include <functional.hpp>
# include <reverse_iterator.hpp>

#define PRINT(x) std::cout << std::boolalpha << "\nin " << __FILE__ << ":" << __LINE__ << "\n"<< __func__ << ": " << #x << "\n" << x << std::endl;

namespace ft 
{
	enum COL { RED_COL = false, BLK_COL = true };

	//--- NodeBTImpl -----------------------------------------------------------------------  
	struct NodeBTImpl
	{
		typedef NodeBTImpl*			NodeImplPtr;
		typedef const NodeBTImpl*	const_NodeImplPtr;

		COL				color;
		NodeImplPtr		parent;
		NodeImplPtr		left;
		NodeImplPtr		right;

		// binary_trees/NodeImplPtr.cpp
		static NodeImplPtr get_leftmost_node(NodeImplPtr node);
		static const_NodeImplPtr get_leftmost_node(const_NodeImplPtr node);
		static NodeImplPtr get_rightmost_node(NodeImplPtr node);
		static const_NodeImplPtr get_rightmost_node(const_NodeImplPtr node);
	};
	//--- NodeBTImpl -----------------------------------------------------------------------  

	//--- NodeBT ----------------------------------------------------------------------------  
	template<typename Pair> // Pair = pair<const key_type, mapped_type>
	struct NodeBT : public NodeBTImpl
	{
		typedef NodeBT<Pair>*	NodePtr;
		typedef Pair			value_type;

		Pair data;

		NodeBT(const value_type& value = value_type()) : NodeBTImpl(), data(value) {}
	};

	std::ostream&	operator<<(std::ostream& o, NodeBTImpl node);

	template<typename Pair>
	std::ostream&	operator<<(std::ostream& o, NodeBT<Pair> node)
	{
		typedef NodeBT<Pair>*	NodePtr;
				
		if (node.color == RED_COL)
			o << "\033[41;37m";
		else
			o << "\033[44;37m"; // Made it in blue instead of black for seing it better, but the idea is here
		o	<< "Node: [" << &node << "]\t";
		o	<< "Key: [" << node.data.first << "]\t";
		o	<< "Value: {" << node.data.second << "}\n";
		if (node.parent)
		{
			o	<< "Parent: [" << &node.parent << "]\t";
			o	<< "Key: [" << NodePtr(node.parent)->data.first << "]\t";
		//	o	<< "Value: {" << NodePtr(node.parent)->data.second << "}\n"; // Afficher elt first, aucun souci, segfault sur elt second
		}
		if (node.left)
		{
			o	<< "Left: [" << &node.left << "]\t";
			o	<< "Key: [" << NodePtr(node.left)->data.first << "]\t";
		//	o	<< "Value: {" << static_cast<NodePtr>(node.left)->data.second << "}\n";
		}
		if (node.right)
		{
			o	<< "Right: [" << &node.right << "]\t";
			o	<< "Key: [" << NodePtr(node.right)->data.first << "]\t";
		//	o	<< "Value: {" << static_cast<NodePtr>(node.right)->data.second << "}\n";
		}
		
		o << "\033[0m\n";
		
		return o;
	}
	//--- NodeBT ----------------------------------------------------------------------------  

	//--- red_black_tree_iterator ------------------------------------------------------------------------  
	
	// iterators/RBTIterators.cpp
	NodeBTImpl*			increment_iterator(NodeBTImpl* node);
	const NodeBTImpl*	increment_iterator(const NodeBTImpl* node);
	NodeBTImpl*			red_black_tree_decrement(NodeBTImpl* node);
	const NodeBTImpl*	red_black_tree_decrement(const NodeBTImpl* node);

	template<typename T>
	struct red_black_tree_iterator 
	: public NSP::iterator<NSP::bidirectional_iterator_tag,
							typename NSP::iterator_traits<T*>::value_type,
							typename NSP::iterator_traits<T*>::difference_type,
							typename NSP::iterator_traits<T*>::pointer,
							typename NSP::iterator_traits<T*>::reference
						   >
	{
		typedef NSP::bidirectional_iterator_tag							iterator_category;
		typedef typename NSP::iterator_traits<T*>::value_type			value_type;
		typedef typename NSP::iterator_traits<T*>::difference_type		difference_type;
		typedef typename NSP::iterator_traits<T*>::pointer				pointer;
		typedef typename NSP::iterator_traits<T*>::reference			reference;
		typedef red_black_tree_iterator<T>								iterator_type;
		typedef NodeBTImpl::NodeImplPtr									NodeImplPtr;
		typedef NodeBT<T>*												NodePtr;

		NodeImplPtr node_impl;

		red_black_tree_iterator()				: node_impl()		{}
		red_black_tree_iterator(NodePtr node)	: node_impl(node)	{}

		reference		operator*()			const		{ return (*(this->operator->())); }
		pointer			operator->()		const		{ return pointer(&NodePtr(node_impl)->data); }

		iterator_type&	operator++()
		{
			node_impl = increment_iterator(node_impl);
			return *this;
		}

		iterator_type	operator++(int)
		{
			iterator_type	tmp = *this;

			node_impl = increment_iterator(node_impl);
			return tmp;
		}

		iterator_type&	operator--()
		{
			node_impl = red_black_tree_decrement(node_impl);
			return *this;
		}

		iterator_type	operator--(int)
		{
			iterator_type	tmp = *this;

			node_impl = red_black_tree_decrement(node_impl);
			return tmp;
		}

		bool			operator==(const iterator_type& it) const
		{ return node_impl == it.node_impl; }

		bool			operator!=(const iterator_type& it) const
		{ return node_impl != it.node_impl; }
	};

	template<typename Pair>
	std::ostream&	operator<<(std::ostream& o, red_black_tree_iterator<Pair> it)
	{
		if (it.node_impl->color == RED_COL)
			o << "\033[41;37m";
		else
			o << "\033[44;37m"; // Made it in blue instead of black for seing it better, but the idea is here
		o	<< "Key: [" << it->first << "]\t";
		o	<< "Value: {" << it->second << "}\033[0m\n";
		
		return o;
	}

	template<typename Pair>
	std::ostream&	operator<<(std::ostream& o, NSP::reverse_iterator<red_black_tree_iterator<Pair> > rit)
	{
		if ((rit.base()).node_impl->color == RED_COL)
			o << "\033[41;37m";
		else
			o << "\033[44;37m"; // Made it in blue instead of black for seing it better, but the idea is here
		o	<< "Key: [" << rit->first << "]\t";
		o	<< "Value: {" << rit->second << "}\033[0m\n";
		
		return o;
	}

	template<typename T>
	struct red_black_tree_const_iterator 
	: public NSP::iterator<NSP::bidirectional_iterator_tag,
							typename NSP::iterator_traits<T*>::value_type,
							typename NSP::iterator_traits<T*>::difference_type,
							typename NSP::iterator_traits<T*>::pointer,
							typename NSP::iterator_traits<T*>::reference
						  >
	{
		typedef NSP::bidirectional_iterator_tag							iterator_category;
		typedef typename NSP::iterator_traits<T*>::value_type			value_type;
		typedef typename NSP::iterator_traits<T*>::difference_type		difference_type;
		typedef const T& reference;
		typedef const T* pointer;
		typedef red_black_tree_const_iterator<T>						iterator_type;
		typedef red_black_tree_iterator<T>								iterator;
		typedef NodeBTImpl::const_NodeImplPtr							NodeImplPtr;
		typedef const NodeBT<T>*										NodePtr;

		NodeImplPtr node_impl;

		red_black_tree_const_iterator()						: node_impl() { }
		red_black_tree_const_iterator(NodePtr node)			: node_impl(node) { }
		red_black_tree_const_iterator(const iterator& __it) : node_impl(__it.node_impl) { }

		reference		operator*()			const		{ return (*(this->operator->())); }
		pointer			operator->()		const		{ return pointer(&NodePtr(node_impl)->data); }

		iterator_type&	operator++()
		{
			node_impl = increment_iterator(node_impl);
			return *this;
		}

		iterator_type	operator++(int)
		{
			iterator_type tmp = *this;

			node_impl = increment_iterator(node_impl);
			return tmp;
		}

		iterator_type&	operator--()
		{
			node_impl = red_black_tree_decrement(node_impl);
			return *this;
		}

		iterator_type	operator--(int)
		{
			iterator_type tmp = *this;

			node_impl = red_black_tree_decrement(node_impl);
			return tmp;
		}

		bool			operator==(const iterator_type& node) const
		{ return node_impl == node.node_impl; }

		bool			operator!=(const iterator_type& node) const
		{ return node_impl != node.node_impl; }
	};

	template<typename Pair>
	inline bool
	operator==(const red_black_tree_iterator<Pair>& lhs, const red_black_tree_const_iterator<Pair>& rhs)
	{ return lhs.node_impl == rhs.node_impl; }

	template<typename Pair>
	inline bool
	operator!=(const red_black_tree_iterator<Pair>& lhs, const red_black_tree_const_iterator<Pair>& rhs)
	{ return lhs.node_impl != rhs.node_impl; }

	template<typename Pair>
	std::ostream&	operator<<(std::ostream& o, red_black_tree_const_iterator<Pair> it)
	{
		if (it.node_impl->color == RED_COL)
			o << "\033[41;37m";
		else
			o << "\033[44;37m"; // Made it in blue instead of black for seing it better, but the idea is here
		o	<< "Key: [" << it->first << "]\t";
		o	<< "Value: {" << it->second << "}\033[0m\n";
		
		return o;
	}

	template<typename Pair>
	std::ostream&	operator<<(std::ostream& o, NSP::reverse_iterator<red_black_tree_const_iterator<Pair> > rit)
	{
		if ((rit.base()).node_impl->color == RED_COL)
			o << "\033[41;37m";
		else
			o << "\033[44;37m"; // Made it in blue instead of black for seing it better, but the idea is here
		o	<< "Key: [" << rit->first << "]\t";
		o	<< "Value: {" << rit->second << "}\033[0m\n";
		
		return o;
	}

	//--- red_black_tree_iterator ------------------------------------------------------------------------  

	// binary_trees/RBT.cpp
	void		rotate_left(NodeBTImpl* const node, NodeBTImpl*& root);
	void		rotate_right(NodeBTImpl* const node, NodeBTImpl*& root);
	void		balance_at_insert(NodeBTImpl* node, NodeBTImpl*& root);
	void		insert_rbt_node(const bool is_leftmost_node, NodeBTImpl* node, NodeBTImpl* parent, NodeBTImpl& sentinil);
	NodeBTImpl*	get_child_at_delete(NodeBTImpl*& node);
	void		adjust_sentinel_at_erase(NodeBTImpl* original, NodeBTImpl* child, NodeBTImpl& sentinel);
	void		balance_at_erase(NodeBTImpl*& node_impl, NodeBTImpl*& node_impl_parent, NodeBTImpl sentinel) ;
	NodeBTImpl* get_node_to_delete(NodeBTImpl* const original, NodeBTImpl& sentinel);

/* tree classe */
	template<	typename Key, 
				typename Pair, 
				typename FirstPairTypeFunctor, 
				typename KeyCompare, 
				typename Allocator = std::allocator<Pair>
			>
	class red_black_tree
	{
		typedef typename Allocator::template rebind<NodeBT<Pair> >::other	node_alloc;

		protected:
			typedef NodeBTImpl*													NodeImplPtr;
			typedef const NodeBTImpl*											const_NodeImplPtr;
			typedef NodeBT<Pair>												NodeBT;
			typedef red_black_tree< Key,
									Pair, 
									FirstPairTypeFunctor, 
									KeyCompare, 
									Allocator
								>												rbt;

		public:
			typedef Key															key_type;
			typedef Pair														value_type;
			typedef KeyCompare													key_compare;
			typedef typename value_type::second_type							mapped_type;

			typedef			 Allocator											allocator_type;
			typedef typename Allocator::size_type								size_type;
			typedef typename Allocator::difference_type							difference_type;
			typedef typename Allocator::pointer									pointer;
			typedef typename Allocator::const_pointer							const_pointer;	
			typedef typename Allocator::reference								reference;
			typedef typename Allocator::const_reference							const_reference;	

			typedef NodeBT*														NodePtr;
			typedef const NodeBT*												const_NodePtr;
			typedef red_black_tree_iterator<value_type>							iterator;
			typedef red_black_tree_const_iterator<value_type>					const_iterator;

			typedef NSP::reverse_iterator<iterator>								reverse_iterator;
			typedef NSP::reverse_iterator<const_iterator>						const_reverse_iterator;

			template<typename Key1, typename Pair1, typename KeyOfValue1, typename Cmp1, typename Alloc1>
			friend std::ostream&	operator<<(std::ostream& o, red_black_tree<Key1, Pair1, KeyOfValue1, Cmp1, Alloc1> tree);

		protected:
			struct sentinil_impl  // Have no choice to encapsulate the sentinil, segfaults otherwise it is a bit frustrating to not understand why
			{
				NodeBTImpl 	sentinil;

				sentinil_impl()
				{ 
					this->sentinil.color = RED_COL;
					this->sentinil.parent = 0;
					this->sentinil.left = &this->sentinil;
					this->sentinil.right = &this->sentinil;
				}
			};

			node_alloc			mem;
			key_compare			kcmp;
			size_type			size_tree;
			sentinil_impl		base;

		public:

			// Constructors / Destructor
			red_black_tree(const KeyCompare& comp = key_compare(), const allocator_type& a = allocator_type())
			: mem(a), kcmp(comp), size_tree(0), base()
			{}

			red_black_tree(const rbt& tree)
			: mem(tree.get_allocator()), kcmp(tree.key_comp()), size_tree(tree.size()), base()
			{
				if (tree.getRoot() != 0)
				{
					getRoot() = this->copyFrom(tree.getRootPtr(), getSentinil());
					leftmost() = this->get_leftmost_node(getRoot());
					rightmost() = this->get_rightmost_node(getRoot());
				}
			}

			~red_black_tree() { this->eraseFrom(this->getRootPtr()); }

			rbt& operator=(const rbt& tree)
			{
				if (this != &tree)
				{
					this->clear();
					if (this->mem != tree.get_allocator())
						this->mem = tree.get_allocator();
					this->kcmp = tree.key_comp();
					if (tree.getRoot() != 0)
					{
						this->getRoot() = this->copyFrom(tree.getRootPtr(), this->getSentinil());
						this->leftmost() = this->get_leftmost_node(this->getRoot());
						this->rightmost() = this->get_rightmost_node(this->getRoot());
					}
					this->size_tree = tree.size();
				}
				return *this;
			}
			// Constructors / Destructor

			// public accessors
			allocator_type		get_allocator() const		{ return allocator_type(this->mem); }
			key_compare			key_comp()		const		{ return this->kcmp; }

			bool				empty()			const		{ return (this->size() == 0); }
			size_type			size()			const		{ return this->size_tree;	}
			// It makes more sense of defining max_size as the number of max elt(nodes) that size_type may index than the max_size of the whole structure given by Allocator::max_size().
			// -1 because since it is an unsigned type we will get an underflow and obtain the last digits
		//	size_type			max_size()		const		{ return size_type(-1); }
			size_type			max_size()		const		{ return (this->mem).max_size();}	

			iterator			begin()						{ return NodePtr(this->base.sentinil.left); }
			const_iterator		begin()			const		{ return const_NodePtr(this->base.sentinil.left); }
			iterator			end()						{ return NodePtr(&this->base.sentinil); }
			const_iterator		end()			const		{ return const_NodePtr(&this->base.sentinil); }

			reverse_iterator	rbegin()					{ return reverse_iterator(end()); }
			const_reverse_iterator	rbegin()	const		{ return const_reverse_iterator(end()); }
			reverse_iterator	rend()						{ return reverse_iterator(begin()); }
			const_reverse_iterator rend()		const		{ return const_reverse_iterator(begin()); }

			static NodeImplPtr	get_leftmost_node(NodeImplPtr node)
			{ return NodeBTImpl::get_leftmost_node(node); }
			static const_NodeImplPtr
			get_leftmost_node(const_NodeImplPtr node)		 { return NodeBTImpl::get_leftmost_node(node); }

			static NodeImplPtr get_rightmost_node(NodeImplPtr node)
			{ return NodeBTImpl::get_rightmost_node(node); }
			static const_NodeImplPtr
			get_rightmost_node(const_NodeImplPtr node)		 { return NodeBTImpl::get_rightmost_node(node); }
			// End public accessors

			// protected accessors but public for testing do not forget to set the visibility
			void swap(rbt& tree)
			{
				if (this->getRoot() == 0) // if this is empty
				{
					if (tree.getRoot() != 0) // and the other is not
					{
						this->getRoot() = tree.getRoot(); //swap sentinel
						this->leftmost() = tree.leftmost();
						this->rightmost() = tree.rightmost();
						this->getRoot()->parent = this->getSentinil();

						tree.getRoot() = 0;
						tree.leftmost() = tree.getSentinil();
						tree.rightmost() = tree.getSentinil();
					}
				}
				else if (tree.getRoot() == 0) // else if this is the other that is empty
				{
					tree.getRoot() = this->getRoot();
					tree.leftmost() = this->leftmost();
					tree.rightmost() = this->rightmost();
					tree.getRoot()->parent = tree.getSentinil();

					this->getRoot() = 0;
					this->leftmost() = this->getSentinil();
					this->rightmost() = this->getSentinil();
				}
				else // else both are non empty
				{
					NSP::swap(this->getRoot(), tree.getRoot());
					NSP::swap(this->leftmost(), tree.leftmost());
					NSP::swap(this->rightmost(), tree.rightmost());

					this->getRoot()->parent = this->getSentinil();
					tree.getRoot()->parent = tree.getSentinil();
				}
				// No need to swap header's color as it does not change.
				NSP::swap(this->size_tree, tree.size_tree);
				NSP::swap(this->kcmp, tree.kcmp);
				NSP::swap(this->mem, tree.mem);
			}

			// Insert/erase.
			NSP::pair<iterator, bool>	insert(const value_type& data)
			{
				typedef	NSP::pair<iterator, bool>	result_type;

				NodePtr		node	= getRootPtr();
				NodePtr		parent	= getSentinil();
				bool		is_leftmost	= true;

				while (node != 0) // Search the next available node where to insert, search also its parent
				{
					parent = node;
					is_leftmost = this->kcmp(FirstPairTypeFunctor()(data), getKey(node)); // data < node
					node = is_leftmost ? NodePtr(node->left) : NodePtr(node->right);
				}

				iterator pos = iterator(parent);

				if (is_leftmost)
				{
					if (pos == begin())
					{
						// insert before, insert at leftmost position
						return result_type(insertFrom(node, parent, data), true); // return the new node inserted as iterator
					}
					else
					{
						--pos;
					}
				}

				if (this->kcmp(getKey(pos.node_impl), FirstPairTypeFunctor()(data))) 
				{ 
					// node < data (actually node has taken the null value of one of its child, 
					// so it is the "parent datas" that are compared 
					// but indeed it is the data's node
					return result_type(insertFrom(node, parent, data), true); // return the new node inserted as iterator
				}
				return result_type(pos, false); // else no position available was found
			}

			iterator					insert(iterator position, const value_type& data)
			{
				if (position.node_impl == this->leftmost()) // if the position given for clue / hint is the leftmost of the tree
				{
					// if there is also at least one node and data < position, insert before position (data becomes the leftmost)
					if (size() > 0 
							&& this->kcmp(FirstPairTypeFunctor()(data), position->first))
							//&& this->kcmp(FirstPairTypeFunctor()(data), getKey(position.node_impl)))
						return this->insertFrom(position.node_impl, position.node_impl, data);

					else // else, find the best place to insert after the position given
						return this->insert(data).first;
				}
				else if (position.node_impl == getSentinil()) // else if position given is the end of the tree
				{
					// rightmost < data, insert after rightmost
					if (this->kcmp(getKey(rightmost()), FirstPairTypeFunctor()(data)))
						return this->insertFrom(0, rightmost(), data);
					else // else find the best place to insert
						return this->insert(data).first;
				}
				else // otherwise if not begin not end:
				{
					iterator predecessor = position;

					--predecessor;

					// if predecessor < data && data < position
					//if (this->kcmp(getKey(predecessor.node_impl), FirstPairTypeFunctor()(data)) 
					//		&& this->kcmp(FirstPairTypeFunctor()(data), getKey(position.node_impl)))
					if (this->kcmp(predecessor->first, FirstPairTypeFunctor()(data)) 
							&& this->kcmp(FirstPairTypeFunctor()(data), position->first))
					{
						// if there is no right child put it there
						if (predecessor.node_impl->right == 0)
							return this->insertFrom(0, predecessor.node_impl, data);
						else // else insert from position
							return this->insertFrom(position.node_impl, position.node_impl, data);
						// First argument just needs to be non-null.
					}
					else // else find the best place where insert
						return this->insert(data).first;
				}
			}

			template<typename Iter> // insert from first to last
			void						insert(Iter first, Iter last)
			{
				for ( ; first != last; ++first)
					this->insert(*first);
			}

			void						erase(iterator pos)
			{
				NodePtr	node = 0;

				node = NodePtr(get_node_to_delete(pos.node_impl, this->base.sentinil));
				this->destroyNode(node);
				--this->size_tree;
			}

			size_type					erase(const key_type& key)
			{
				// search elt with key for erasing properly it
				typedef NSP::pair<iterator, iterator>	double_it;

				double_it	pair_it = this->equal_range(key);
				size_type	nb_erase = NSP::distance(pair_it.first, pair_it.second);

				erase(pair_it.first, pair_it.second);
				return nb_erase; // As it is only have at most one elt with key, return 1 or 0
			}

			void						erase(iterator first, iterator last)
			{
				if (first == this->begin() && last == this->end())
				{
					this->clear();
				}
				else
				{
					while (first != last) 
					{
						this->erase(first++); // Only possible by post-incrementing inside the function call otherwise segfault because the iterator is not available anymore
					}
				}
			}

			void						clear()
			{
				this->eraseFrom(this->getRootPtr());
				this->leftmost() = this->getSentinil();
				this->getRoot() = 0;
				this->rightmost() = this->getSentinil();
				this->size_tree = 0;
			}

			// Set operations.
			iterator					find(const key_type& k)
			{
				NodePtr		node = this->getRootPtr(); // Current node.
				NodePtr		parent = this->getSentinil(); // Last node which is not less than k.

				while (node != 0) // while node is not nul
				{
					//if (!this->kcmp(this->getKey(node), k)) // if node < k
					if (!this->kcmp(iterator(node)->first, k)) // if k < node
					{
						// we move to the left subtree
						parent = node;
						node = NodePtr(node->left);
					}
					else // else k < node
					{
						// moving to the right subtree
						node = NodePtr(node->right);
					}
				}

				iterator result = iterator(parent);

				// if result == nul or k < result (so this is before begin => return end())
				//if (result == this->end() || this->kcmp(k, this->getKey(result.node_impl)))
				if (result == this->end() || this->kcmp(k, result->first))
					return this->end();
				return result;
			}

			const_iterator				find(const key_type& k) const
			{
				const_NodePtr		node = this->getRootPtr(); // Current node.
				const_NodePtr		parent = this->getSentinil(); // Last node which is not less than k.

				while (node != 0) // while node is not nul
				{
				//	if (!this->kcmp(this->getKey(node), k)) // if k < node
					if (!this->kcmp(const_iterator(node)->first, k)) // if k < node
					{
						// we move to the left subtree
						parent = node;
						node = const_NodePtr(node->left);
					}
					else // else node < k
					{
						// moving to the right subtree
						node = const_NodePtr(node->right);
					}
				}

				const_iterator result = const_iterator(parent);

				// if result == nul or k < result (so this is before begin => return end())
				if (result == this->end() || this->kcmp(k, result->first))
				//if (result == this->end() || this->kcmp(k, this->getKey(result.node_impl)))
					return this->end();
				return result;
			}

			size_type					count(const key_type& k) const
			{
				typedef NSP::pair<const_iterator, const_iterator>	double_it;

				double_it			result = this->equal_range(k);
				const size_type		nb_result = NSP::distance(result.first, result.second); // should be 0 or 1

				return nb_result;
			}

			iterator					lower_bound(const key_type& k)
			{
				NodePtr		node = this->getRootPtr(); // Current node.
				NodePtr		parent = this->getSentinil(); // Last node which is not less than k.

				while (node != 0) // while node exists
				{
				//	if (!this->kcmp(this->getKey(node), k)) // if k < node
					if (!this->kcmp(iterator(node)->first, k)) // if k < node
					{
						// move on the left subtree
						parent = node;
						node = NodePtr(node->left);
					}
					else
					{
						node = NodePtr(node->right);
					}
				}

				return iterator(parent);
			}

			const_iterator				lower_bound(const key_type& k) const
			{
				const_NodePtr		node = this->getRootPtr(); // Current node.
				const_NodePtr		parent = this->getSentinil(); // Last node which is not less than k.

				while (node != 0) // while node exists
				{
				//	if (!this->kcmp(this->getKey(node), k)) // if k < node
					if (!this->kcmp(const_iterator(node)->first, k)) // if k < node
					{
						// move on the left subtree
						parent = node;
						node = NodePtr(node->left);
					}
					else
					{
						node = NodePtr(node->right);
					}
				}

				return const_iterator(parent);
			}

			iterator					upper_bound(const key_type& k)
			{
				/*	NodePtr node = getRootPtr(); // Current node.
					NodePtr __y = getSentinil(); // Last node which is greater than k.

					while (node != 0)
				//if (base._M_key_compare(k, getKey(node)))
				if (this->kcmp(k, getKey(node)))
				__y = node, node = getLeftChild(node);
				else
				node = getRightChild(node);

				return iterator(__y);*/

				iterator	it = this->lower_bound(k);

				if (it == this->end())
					return it;
				while (it != this->end() && it->first == k)
					++it;
				return (it);
			}

			const_iterator				upper_bound(const key_type& k) const
			{
				/*	const_NodePtr node = getRootPtr(); // Current node.
					const_NodePtr upper_res = getSentinil(); // Last node which is greater than k.

					while (!node)
					{
				//if (base._M_key_compare(k, getKey(node)))
				if (this->kcmp(k, getKey(node)))
				{
				upper_res = node;
				//node = getLeftChild(node);
				node = node->left;
				}
				else
				//node = getRightChild(node);
				node = node->right;
				}

				return const_iterator(upper_res);*/

				const_iterator	it = this->lower_bound(k);

				if (it == this->end())
					return it;
				while (it != this->end() && it->first == k)
					++it;
				return (it);
			}

			pair<iterator, iterator>	equal_range(const key_type& k)
			{ return NSP::pair<iterator, iterator>(this->lower_bound(k), this->upper_bound(k)); }

			pair<const_iterator, const_iterator> 
				equal_range(const key_type& k) const
				{ return pair<const_iterator, const_iterator>(this->lower_bound(k), this->upper_bound(k)); }

			mapped_type&				operator[](const key_type& k)				
			{
				iterator it = this->lower_bound(k);

				if (it == this->end() || this->kcmp(k, it->first)) // if k < leftmost or rightmost < k, insert
				{
					it = this->insert(it, value_type(k, mapped_type()));
				}
				return (*it).second;
			} 			// Acces non controle
		


		protected:

				// Memory Handling
			NodeBT*					allocateNode()					{ return this->mem.allocate(1); }
			void					deallocateNode(NodeBT* node)	{ this->mem.deallocate(node, 1); }

			NodePtr					makeNode(const value_type& value)
			{
				NodePtr node = this->allocateNode();

				try
				{ 
					this->mem.construct(node, NodeBT(value)); 
				}
				catch (...)
				{
					this->deallocateNode(node);
				}
				return node;
			}

			NodePtr					cloneNode(const_NodePtr node)
			{
				NodePtr clone = this->makeNode(node->data);

				clone->color = node->color;
				clone->left = 0;
				clone->right = 0;
				return clone;
			}

			void					destroyNode(NodePtr node)
			{ 
				this->mem.destroy(node); 
				this->deallocateNode(node);
			}

			iterator				insertFrom(NodeImplPtr pos_to_insert, NodeImplPtr parent, const value_type& value)
			{
				NodePtr new_node = makeNode(value);
				bool	is_leftmost_node = (pos_to_insert != 0) // if begin 
					|| (parent == getSentinil())  // or is the parent is the sentinel
					|| (this->kcmp(FirstPairTypeFunctor()(value), getKey(parent))); // value < parent

				insert_rbt_node(is_leftmost_node, new_node, parent, this->base.sentinil);
				++this->size_tree;
				return iterator(new_node);
			}

			NodePtr					copyFrom(const_NodePtr node, NodePtr parent)
			{
				// Structural recursive copy.  node and parent must be non-null.
				// return the top, copy by the right hand
				if (node == 0 || parent == 0)
					return 0;

				NodePtr		top = cloneNode(node);

				top->parent = parent;

				try
				{
					if (node->right)
					{
						top->right = copyFrom(const_NodePtr(node->right), top);
					}
					parent = top;
					node = const_NodePtr(node->left);

					while (node != 0)
					{
						NodePtr		tmp_node = cloneNode(node);

						parent->left = tmp_node;
						tmp_node->parent = parent;
						if (node->right)
						{
							tmp_node->right = copyFrom(const_NodePtr(node->right), tmp_node);
						}
						parent = tmp_node;
						node = const_NodePtr(node->left);
					}
				}
				catch (...)
				{
					eraseFrom(top);
				}
				return top;
			}

			void					eraseFrom(NodePtr node)
			{
				// Erase without rebalancing.
				while (node != 0)
				{
					eraseFrom(NodePtr(node->right));
					NodePtr		left_child = NodePtr(node->left);
					destroyNode(node);
					node = left_child;
				}
			}
			// End Memory Handling

			// protected accessors
			NodeImplPtr&			getRoot()					{ return this->base.sentinil.parent; }
			const_NodeImplPtr		getRoot()		const		{ return this->base.sentinil.parent; }
			NodeImplPtr&			leftmost()					{ return this->base.sentinil.left; }
			const_NodeImplPtr		leftmost()		const		{ return this->base.sentinil.left; }
			NodeImplPtr&			rightmost()					{ return this->base.sentinil.right; }
			const_NodeImplPtr		rightmost()		const		{ return this->base.sentinil.right; }
			NodePtr					getRootPtr()				{ return NodePtr(this->base.sentinil.parent); }
			const_NodePtr			getRootPtr()	const		{ return const_NodePtr(this->base.sentinil.parent); }
			NodePtr					getSentinil()				{ return NodePtr(&this->base.sentinil); }
			const_NodePtr			getSentinil()	const		{ return const_NodePtr(&this->base.sentinil); }/**/
			static const_reference	getData(const_NodePtr node) 
			{ return node->data; }

			static const_reference	getData(const_NodeImplPtr node)
			{ return const_NodePtr(node)->data; }

			static const Key&		getKey(const_NodeImplPtr node)
			{ 
			/*	static const Key k = const_NodePtr(node)->data.first;
				return k; */
				return const_NodePtr(node)->data.first;
			}

			static const Key&		getKey(const_NodePtr node)
			{ 
				/*static const Key k = node->data.first;
				return k;*/ 
				return node->data.first;;
			}
			// protected accessors

	//displayers 
			std::ostream&					display(NodePtr node, size_type lvl, std::ostream& o)
			{
				if (!node)
					return o;
				size_type	i = 0;

				o << "\033[40;37m";
				if (node == this->getRoot())
					o << "|___";
				else
					o << "    ";
				for (; i != lvl; ++i)
				{
					if (i == lvl - 1)
						o << "  |__";
					else
						o << "  |  ";
				}
				o << " [";
				if (node->color == RED_COL)
					o << "\033[41;37m";
				else
					o << "\033[44;37m";
				o << node->data.first << "\033[40;37m] " << std::endl;
				o << "\033[0m";
				if (node == 0)
					return o;
				if (node->left)
					this->display(static_cast<NodePtr>(node->left), lvl + 1, o);
				if (node->right)
					this->display(static_cast<NodePtr>(node->right), lvl + 1, o);
				return o;
			}

			std::ostream&					display(const_iterator first, const_iterator last, std::ostream& o)
			{

				const_iterator it = first;

				if (first == last && last == this->end())
					return o;
				o << "NORMAL ITERATORS                                             " << std::endl;
				o << "              - FIRST to LAST -              " << std::endl;

				for (;it != last; ++it)
				{
					o << it << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      V                      " << std::endl;
				}
				o << "               - LAST to FIRST -             " << std::endl;
				it = last;
				--it;

				for (;it != first; --it)
				{
					o << it << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      V                      " << std::endl;
				}
				o << it << std::endl;
				return o;
			}

			std::ostream&					display(const_reverse_iterator first, const_reverse_iterator last, std::ostream& o)
			{

				const_reverse_iterator it = first;

				if (first == last && last == this->rend())
					return o;
				o << "REVERSE ITERATORS                                            " << std::endl;
				o << "              - FIRST to LAST -              " << std::endl;
				for (;it != last; ++it)
				{
					o << it << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      V                      " << std::endl;
				}
				o << "               - LAST to FIRST -             " << std::endl;
				it = last;
				--it;
				for (;it != first; --it)
				{
					o << it << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      |                      " << std::endl;
					o << "                      V                      " << std::endl;
				}
				o << it << std::endl;
				return o;
			}

		}; // end rbt

/* operateurs relationnels */
	template<typename Key, typename Pair, typename FirstPairTypeFunctor, typename KeyCompare, typename Allocator>
	inline bool
	operator==(const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& lhs,
			const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& rhs)
	{
		if (lhs.size() == rhs.size())
		{
			typedef typename ft::red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>::const_iterator	fci;
			fci	first1	= lhs.begin();
			fci	first2	= rhs.begin();
			fci last1	= lhs.end();
			for (; first1 != last1; ++first1, ++first2)
			{
				if (first1->first != first2->first || first1->second != first2->second)
					return false;
			}
			return true;
		}
		return false;
	}

	template<typename Key, typename Pair, typename FirstPairTypeFunctor, typename KeyCompare, typename Allocator>
	inline bool
	operator<(const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& lhs,
			const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& rhs)
	{
		typedef typename red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>::const_iterator	fci;
		fci	first1	= lhs.begin();
		fci	first2	= rhs.begin();
		fci last1	= lhs.end();
		fci last2	= rhs.end();
		for (; first1 != last1; ++first1, ++first2)
		{
			if (first2 == last2 || first2->first < first1->first || first2->second < first1->second)
				return false;
			else if (first1->first < first2->first  || first1->second < first2->second)
				return true;
		}
		return (first2 != last2);
	}

	template<typename Key, typename Pair, typename FirstPairTypeFunctor, typename KeyCompare, typename Allocator>
	inline bool
	operator!=(const red_black_tree<Key,Pair,FirstPairTypeFunctor,KeyCompare,Allocator>& lhs,
			const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& rhs)
	{ return !(lhs == rhs); }

	template<typename Key, typename Pair, typename FirstPairTypeFunctor, typename KeyCompare, typename Allocator>
	inline bool
	operator>(const red_black_tree<Key,Pair,FirstPairTypeFunctor,KeyCompare,Allocator>& lhs,
			const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& rhs)
	{ return rhs < lhs; }

	template<typename Key, typename Pair, typename FirstPairTypeFunctor, typename KeyCompare, typename Allocator>
	inline bool
	operator<=(const red_black_tree<Key,Pair,FirstPairTypeFunctor,KeyCompare,Allocator>& lhs,
			const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& rhs)
	{ return !(rhs < lhs); }

	template<typename Key, typename Pair, typename FirstPairTypeFunctor, typename KeyCompare, typename Allocator>
	inline bool
	operator>=(const red_black_tree<Key,Pair,FirstPairTypeFunctor,KeyCompare,Allocator>& lhs,
			const red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& rhs)
	{ return !(lhs < rhs); }

	template<typename Key, typename Pair, typename FirstPairTypeFunctor, typename KeyCompare, typename Allocator>
	inline void
	swap(red_black_tree<Key,Pair,FirstPairTypeFunctor,KeyCompare,Allocator>& lhs,
			red_black_tree<Key, Pair, FirstPairTypeFunctor, KeyCompare, Allocator>& rhs)
	{ lhs.swap(rhs); }

  template<typename Key, typename Pair, typename KeyOfValue, typename Cmp, typename Alloc>
	std::ostream&	operator<<(std::ostream& o, red_black_tree<Key, Pair, KeyOfValue, Cmp, Alloc> tree)
	{
		typedef			 red_black_tree<Key, Pair, KeyOfValue, Cmp, Alloc>		rbt;
		typedef typename rbt::iterator						iterator;
		typedef typename iterator::iterator_category		iterator_category;
		typedef typename iterator::value_type				value_type;
		typedef typename iterator::difference_type			difference_type;
		typedef typename iterator::pointer					pointer;
		typedef typename iterator::reference				reference;

		typedef typename rbt::const_iterator				const_iterator;
		typedef typename const_iterator::iterator_category	const_iterator_category;
		typedef typename const_iterator::value_type			const_value_type;
		typedef typename const_iterator::difference_type	const_difference_type;
		typedef typename const_iterator::pointer			const_pointer;
		typedef typename const_iterator::reference			const_reference;

		typedef typename rbt::reverse_iterator						reverse_iterator;
		typedef typename reverse_iterator::iterator_category		reverse_iterator_category;
		typedef typename reverse_iterator::value_type				ri_value_type;
		typedef typename reverse_iterator::difference_type			ri_difference_type;
		typedef typename reverse_iterator::pointer					ri_pointer;
		typedef typename reverse_iterator::reference				ri_reference;

		typedef typename rbt::const_reverse_iterator				const_reverse_iterator;
		typedef typename const_reverse_iterator::iterator_category	const_reverse_iterator_category;
		typedef typename const_reverse_iterator::value_type			ri_const_value_type;
		typedef typename const_reverse_iterator::difference_type	ri_const_difference_type;
		typedef typename const_reverse_iterator::pointer			ri_const_pointer;
		typedef typename const_reverse_iterator::reference			ri_const_reference;

		o << "=== CONTAINER STATISTICS =======================================================" << std::endl;
		o << std::endl;
		o << "   container type: " << typeid(rbt).name() << std::endl;
		o << "         key type: " << typeid(Key).name() << std::endl;
		o << "      mapped type: " << typeid(typename rbt::value_type::second_type).name() << std::endl;
		o << "       value type: " << typeid(typename rbt::value_type).name() << std::endl;
		o << "     compare type: " << typeid(tree.key_comp()).name() << std::endl;
		o << "   allocator type: " << typeid(tree.get_allocator()).name() << std::endl;
		o << "        size type: " << typeid(typename rbt::size_type).name() << std::endl;
		o << "  difference type: " << typeid(typename rbt::difference_type).name() << std::endl;
		o << std::endl;
		o << "         max_size: " << tree.max_size() << std::endl;
		o << "             size: " << tree.size() << std::endl;
		o << "         is empty: " << std::boolalpha << tree.empty() << std::endl;
		o << std::endl;
		if (tree.size() > 0)
		{
			o << "             root: " << tree.getRootPtr() << std::endl;
			o << "              min: " << tree.leftmost() << std::endl;
			o << "              max: " << tree.rightmost() << std::endl;
		}
		o << std::endl;
		o << "=== BEGIN ITERATOR_TRAITS ======================================================" << std::endl;
		o << std::endl;
		o << "         iterator: " << typeid(iterator).name() << std::endl;
		o << "iterator_category: " << typeid(iterator_category).name() << std::endl;
		o << "       value_type: " << typeid(value_type).name() << std::endl;
		o << "  difference_type: " << typeid(difference_type).name() << std::endl;
		o << "          pointer: " << typeid(pointer).name() << std::endl;
		o << "        reference: " << typeid(reference).name() << std::endl;
		o << "--------------------------------------------------------------------------------" << std::endl;
		o << std::endl;
		o << "   const_iterator: " << typeid(const_iterator).name() << std::endl;
		o << "iterator_category: " << typeid(const_iterator_category).name() << std::endl;
		o << "       value_type: " << typeid(const_value_type).name() << std::endl;
		o << "  difference_type: " << typeid(const_difference_type).name() << std::endl;
		o << "          pointer: " << typeid(const_pointer).name() << std::endl;
		o << "        reference: " << typeid(const_reference).name() << std::endl;
		o << std::endl;
		o << "===== END ITERATOR_TRAITS ======================================================" << std::endl;
		o << std::endl;
		if (tree.size() > 0)
		{
			const_iterator it_beg = tree.begin();
			const_iterator it_end = tree.end();
			tree.display(it_beg, it_end, o);
		}
//		it_beg = "chocolat";
		o << std::endl;
		o << "=== BEGIN REVERSE_ITERATOR_TRAITS ==============================================" << std::endl;
		o << std::endl;
		o << "         iterator: " << typeid(reverse_iterator).name() << std::endl;
		o << "iterator_category: " << typeid(reverse_iterator_category).name() << std::endl;
		o << "       value_type: " << typeid(ri_value_type).name() << std::endl;
		o << "  difference_type: " << typeid(ri_difference_type).name() << std::endl;
		o << "          pointer: " << typeid(ri_pointer).name() << std::endl;
		o << "        reference: " << typeid(ri_reference).name() << std::endl;
		o << "--------------------------------------------------------------------------------" << std::endl;
		o << std::endl;
		o << "   const_iterator: " << typeid(const_reverse_iterator).name() << std::endl;
		o << "iterator_category: " << typeid(const_reverse_iterator_category).name() << std::endl;
		o << "       value_type: " << typeid(ri_const_value_type).name() << std::endl;
		o << "  difference_type: " << typeid(ri_const_difference_type).name() << std::endl;
		o << "          pointer: " << typeid(ri_const_pointer).name() << std::endl;
		o << "        reference: " << typeid(ri_const_reference).name() << std::endl;
		o << std::endl;
		o << "===== END REVERSE_ITERATOR_TRAITS ==============================================" << std::endl;
		o << std::endl;
		if (tree.size() > 0)
		{
			const_reverse_iterator rit_beg = tree.rbegin();
			const_reverse_iterator rit_end = tree.rend();
			tree.display(rit_beg, rit_end, o);
		}
		o << std::endl;
		if (tree.size() > 0)
		{
			tree.display(tree.getRootPtr(), 0, o);
		}
		o << std::endl;
		return o;
	}
} // end namespace ft
#endif
