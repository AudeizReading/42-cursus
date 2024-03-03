/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:40:25 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 20:29:19 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	copy_token(t_tok *src, t_tok **dst, int pos)
{
	t_tok	*elt;

	elt = init_token(src->type, pos, src->content);
	addback_token(dst, elt);
}

char	*transl8_tok_to_str(t_tok *token)
{
	char	*str;

	str = NULL;
	while (token)
	{
		str = ft_concat(str, token->content);
		token = token->next;
	}
	return (str);
}

int	check_redir_elts(t_tok *token)
{
	while (token)
	{
		skip_redir_elt(&token);
		if (token && token->type == WORD)
			return (0);
		else
		{
			while (token && token->type == WHITE_SPACE)
				token = token->next;
			if (token && token->type == WORD)
				return (0);
			if (token && token->type == PIPE)
				return (1);
		}
	}
	return (1);
}
