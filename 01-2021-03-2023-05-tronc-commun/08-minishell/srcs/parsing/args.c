/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   args.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:37:59 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 20:20:34 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	skip_redir_elt(t_tok **token)
{
	if (is_redir((*token)->type))
	{
		(*token) = (*token)->next;
		while ((*token) && (*token)->type == WHITE_SPACE)
			(*token) = (*token)->next;
		if ((*token)->type == WORD)
			(*token) = (*token)->next;
	}
}

int	get_nb_args(t_tok *token)
{
	int		nb;

	nb = 0;
	while (token && token->type != PIPE)
	{
		if (check_redir_elts(token))
		{
			if (nb == 0)
			{
				while (token && token->type == WHITE_SPACE)
					token = token->next;
				if (token && is_redir(token->type))
					return (++nb);
			}
		}
		skip_redir_elt(&token);
		if (token && token->type == WORD)
			nb++;
		if (token)
			token = token->next;
	}
	return (nb);
}

char	*get_redir_arg(t_tok **token, int i)
{
	char	*args;

	args = NULL;
	if (i == 0)
	{
		while ((*token) && (*token)->type == WHITE_SPACE)
			(*token) = (*token)->next;
		if ((*token) && is_redir((*token)->type))
		{
			args = ft_strdup((*token)->content);
			return (args);
		}
	}
	return (NULL);
}

void	set_args(t_tok **token, int nb_args, char ***args)
{
	int	i;

	i = 0;
	while ((*token) && (*token)->type != PIPE && i < nb_args)
	{
		if (check_redir_elts(*token))
		{
			(*args)[i] = get_redir_arg(token, i);
			if ((*args)[i])
				return ;
		}
		skip_redir_elt(token);
		if ((*token) && (*token)->type == WORD)
		{
			(*args)[i] = ft_strdup((*token)->content);
			if (!(*args)[i])
			{
				free_char_array((*args));
				return ;
			}
			i++;
		}
		(*token) = (*token)->next;
	}
}

char	**get_args(t_tok *token)
{
	char	**args;
	int		nb_args;
	int		i;

	i = 0;
	check_redir_elts(token);
	nb_args = get_nb_args(token);
	args = malloc(sizeof(*args) * (nb_args + 1));
	if (!args)
		return (NULL);
	args[nb_args] = NULL;
	set_args(&token, nb_args, &args);
	return (args);
}
