/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redir.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:39:55 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:39:57 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

t_rdata	raz_rdata(void)
{
	t_rdata	redir_data;

	redir_data.i_type = -1;
	redir_data.o_type = -1;
	redir_data.i_name = NULL;
	redir_data.o_name = NULL;
	return (redir_data);
}

void	add_redir(t_rdata redir_data, t_redir **redir)
{
	t_redir	*elt;

	elt = init_redir(redir_data);
	addback_redir(redir, elt);
}

t_rdata	get_rdata(t_tok *redirs, int *err, t_redir **redir)
{
	int		last_input_pos;
	int		last_output_pos;
	t_rdata	redir_data;

	last_input_pos = get_last_input_pos(redirs);
	last_output_pos = get_last_output_pos(redirs);
	redir_data.has_redir = 1;
	redir_data.i_type = get_last_type(redirs, last_input_pos);
	redir_data.o_type = get_last_type(redirs, last_output_pos);
	redir_data.i_name = get_last_file(redirs, last_input_pos);
	redir_data.o_name = get_last_file(redirs, last_output_pos);
	redir_data.token = get_redirs_tok_v2(redirs, err);
	add_redir(redir_data, redir);
	free(redir_data.i_name);
	free(redir_data.o_name);
	clear_token(&redir_data.token);
	return (redir_data);
}

int	set_redirs(t_tok *token, t_redir **redir)
{
	int		err;
	int		nb_cmd;
	int		i;
	t_tok	**redirs;

	err = 0;
	i = -1;
	redirs = NULL;
	nb_cmd = get_nb_pipes(token) + 1;
	redirs = get_redirs_tok_v3(token, &err);
	if (err)
		return (0);
	while (++i < nb_cmd)
		get_rdata(redirs[i], &err, redir);
	free_tokenss(redirs, nb_cmd);
	return (1);
}

t_redir	*get_redirs(t_tok *token)
{
	t_redir	*redir;
	t_rdata	redir_data;

	redir_data = raz_rdata();
	redir = NULL;
	if (token)
	{
		if (!set_redirs(token, &redir))
			return (NULL);
	}
	else
	{
		redir_data.has_redir = 0;
		redir_data.token = NULL;
		add_redir(redir_data, &redir);
	}
	return (redir);
}
