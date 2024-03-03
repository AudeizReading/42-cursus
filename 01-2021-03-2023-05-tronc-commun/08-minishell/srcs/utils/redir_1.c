/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redir_1.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:44:44 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:44:46 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

t_redir	*init_redir(t_rdata redir_data)
{
	t_redir		*redir;
	int			err;

	err = 0;
	redir = malloc(sizeof(*redir));
	if (!redir)
		return (NULL);
	redir->i_type = redir_data.i_type;
	redir->o_type = redir_data.o_type;
	redir->has_redir = redir_data.has_redir;
	redir->i_name = ft_strdup(redir_data.i_name);
	redir->o_name = ft_strdup(redir_data.o_name);
	redir->heredoc = NULL;
	if (redir_data.has_redir)
		redir->token = get_redirs_tok_v2(redir_data.token, &err);
	else
		redir->token = NULL;
	redir->next = NULL;
	return (redir);
}

t_redir	*get_last_redir(t_redir *redir)
{
	if (!redir)
		return (NULL);
	while (redir->next)
		redir = redir->next;
	return (redir);
}

int	get_nb_redir(t_redir *redir)
{
	int	nb_redir;

	nb_redir = 0;
	while (redir)
	{
		nb_redir++;
		redir = redir->next;
	}
	return (nb_redir);
}

void	addback_redir(t_redir **redir, t_redir *new)
{
	t_redir	*last;

	if (!*redir)
	{
		new->pos = 0;
		*redir = new;
		return ;
	}
	last = get_last_redir(*redir);
	new->pos = last->pos + 1;
	last->next = new;
}

void	clear_redir(t_redir **redir)
{
	t_redir	*tmp;

	while (*redir)
	{
		tmp = (*redir)->next;
		free((*redir)->i_name);
		free((*redir)->o_name);
		if ((*redir)->has_redir)
		{
			free((*redir)->heredoc);
			clear_token(&(*redir)->token);
		}
		free(*redir);
		(*redir) = tmp;
	}
}
