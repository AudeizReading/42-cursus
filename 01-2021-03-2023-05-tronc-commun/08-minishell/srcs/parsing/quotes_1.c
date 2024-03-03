/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   quotes_1.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:39:40 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:39:42 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

/*
** check if there is a closing quote
** return the token next to the closing quote
*/
t_tok	*check_closing_quote(t_tok *token, char quote, int *count)
{
	t_tok	*tmp;

	tmp = token;
	*count = 0;
	while (tmp)
	{
		if (*tmp->content == quote)
		{
			(*count)++;
			if (*count == 2)
				return (tmp->next);
		}
		tmp = tmp->next;
	}
	return (NULL);
}

int	check_quotes(t_tok *token)
{
	t_tok	*tmp;
	int		check;

	tmp = token;
	check = 0;
	while (tmp)
	{
		if (tmp->type == QUOTE || tmp->type == D_QUOTE)
		{
			tmp = check_closing_quote(tmp, *tmp->content, &check);
			if (!tmp && check % 2)
				return (0);
		}
		else
		{
			tmp = tmp->next;
		}
	}
	return (1);
}

void	transl8_dol_quo(t_tok **tmp, char **translate)
{
	char	*value;

	(*tmp) = (*tmp)->next;
	value = get_env_var((*tmp)->content);
	*translate = ft_concat(*translate, value);
	free(value);
	(*tmp) = (*tmp)->next;
}

void	set_trad(t_tok **tmp, char **translate, char quote)
{
	while ((*tmp) && (*(*tmp)->content) != quote)
	{
		if (quote == '\"' && (*tmp)->type == DOLLAR)
			transl8_dol_quo(tmp, translate);
		else
		{
			(*translate) = ft_concat((*translate), (*tmp)->content);
			(*tmp) = (*tmp)->next;
		}
	}
}

char	*translate_quotes(t_tok *token, char quote)
{
	char	*translate;
	t_tok	*tmp;
	int		count;

	translate = NULL;
	tmp = token;
	count = 0;
	while (tmp)
	{
		if (*tmp->content == quote)
		{
			count++;
			tmp = tmp->next;
			if (count == 2)
				return (translate);
			set_trad(&tmp, &translate, quote);
		}
		else
			tmp = tmp->next;
	}
	return (translate);
}
