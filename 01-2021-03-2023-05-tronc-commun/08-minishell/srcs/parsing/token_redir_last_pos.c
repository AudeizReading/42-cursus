/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token_redir_last_pos.c                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:41:34 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:41:35 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	*get_last_symbol_pos(t_tok *redir, int symbol)
{
	int		*pos;
	int		i;
	int		nb_pipes;

	i = 0;
	nb_pipes = get_nb_pipes(redir);
	pos = malloc(sizeof(int) * (nb_pipes + 2));
	if (!pos)
		return (NULL);
	while (redir)
	{
		pos[i] = -1;
		while (redir && redir->type != PIPE)
		{
			if (redir->type == symbol)
				pos[i] = redir->pos;
			redir = redir->next;
		}
		if (redir && redir->type == PIPE)
		{
			redir = redir->next;
			i++;
		}
	}
	return (pos);
}

int	get_last_input_pos(t_tok *token)
{
	int		*pos_less;
	int		*pos_dless;
	int		pos_l;
	int		pos_d;
	int		last_pos;

	pos_less = get_last_symbol_pos(token, LESS);
	pos_dless = get_last_symbol_pos(token, D_LESS);
	pos_l = -1;
	pos_d = -1;
	if (!pos_less)
		pos_l = -1;
	else
		pos_l = *pos_less;
	if (!pos_dless)
		pos_d = -1;
	else
		pos_d = *pos_dless;
	last_pos = cmp_pos(pos_l, pos_d);
	free(pos_less);
	free(pos_dless);
	return (last_pos);
}

int	get_last_output_pos(t_tok *token)
{
	int		*pos_great;
	int		*pos_dgreat;
	int		pos_g;
	int		pos_d;
	int		last_pos;

	pos_great = get_last_symbol_pos(token, GREAT);
	pos_dgreat = get_last_symbol_pos(token, D_GREAT);
	pos_g = -1;
	pos_d = -1;
	if (!pos_great)
		pos_g = -1;
	else
		pos_g = *pos_great;
	if (!pos_dgreat)
		pos_d = -1;
	else
		pos_d = *pos_dgreat;
	last_pos = cmp_pos(pos_g, pos_d);
	free(pos_great);
	free(pos_dgreat);
	return (last_pos);
}

char	*get_last_file(t_tok *token, int last_pos)
{
	char	*last_file;

	last_file = NULL;
	if (!token || last_pos == -1)
		return (NULL);
	while (token)
	{
		if (token->pos == last_pos)
		{
			last_file = ft_strdup(token->next->content);
			return (last_file);
		}
		token = token->next;
	}
	return (last_file);
}

int	get_last_type(t_tok *token, int last_pos)
{
	int	type;

	type = -1;
	if (!token || last_pos == -1)
		return (-1);
	while (token)
	{
		if (token->pos == last_pos)
			return (token->type);
		token = token->next;
	}
	return (type);
}
