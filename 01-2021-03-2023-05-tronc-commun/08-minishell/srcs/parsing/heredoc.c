/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   heredoc.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:38:43 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 19:28:48 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*get_heredoc_input(char *keyword)
{
	char		*big_input;
	char		*input;
	static int	ret = 3;
	int			line;

	input = NULL;
	big_input = NULL;
	line = 0;
	rl_event_hook = event_heredoc;
	while (1)
	{
		toggle_signals(0);
		ft_wait_4_sig(SIGINT, ft_receive_sig_heredoc);
		ret = rl_heredoc(&input, &big_input, keyword, &line);
		if (ret == 0)
			return (big_input);
		else if (ret == -1)
			return (NULL);
		else if (ret == 1)
			break ;
		toggle_signals(1);
	}
	free(input);
	return (big_input);
}

void	set_heredoc_token(t_tok **tmptmp_tok, t_tok **new_tok)
{
	t_tok	*elt;

	elt = NULL;
	if ((*tmptmp_tok)->type == DOLLAR)
		transl8_dol_tok(tmptmp_tok, (*tmptmp_tok)->pos, &elt);
	else if ((*tmptmp_tok))
	{
		copy_token((*tmptmp_tok), &elt, (*tmptmp_tok)->pos);
		(*tmptmp_tok) = (*tmptmp_tok)->next;
	}
	addback_token(new_tok, elt);
}

t_tok	*get_heredoc_token(char *big_input)
{
	t_tok	*tmp_tok;
	t_tok	*tmptmp_tok;
	t_tok	*new_tok;

	tmp_tok = lexer(big_input);
	tmptmp_tok = tmp_tok;
	new_tok = NULL;
	while (tmptmp_tok)
		set_heredoc_token(&tmptmp_tok, &new_tok);
	clear_token(&tmp_tok);
	return (new_tok);
}

void	set_heredoc(char *big_input, t_cmd **cmd)
{
	char	*n;
	char	**heredoc;
	int		fd;

	n = ft_itoa((*cmd)->pos);
	(*cmd)->redir->heredoc = ft_strdup(big_input);
	free((*cmd)->redir->i_name);
	(*cmd)->redir->i_name = ft_strjoin("/tmp/.heredoc-", n);
	heredoc = ft_split((*cmd)->redir->heredoc, '\0');
	fd = open((*cmd)->redir->i_name, O_WRONLY | O_CREAT | O_APPEND, 0644);
	ft_print_char_array_fd(heredoc, fd);
	close(fd);
	free(n);
	free_char_array(heredoc);
	(*cmd)->input = open((*cmd)->redir->i_name, O_RDONLY, 0644);
}

void	init_heredoc(t_cmd **cmd, char *kd, int cur_pos, int last_pos)
{
	char	*big_input;
	t_tok	*tmp_tok;

	big_input = get_heredoc_input(kd);
	tmp_tok = get_heredoc_token(big_input);
	free(big_input);
	big_input = NULL;
	big_input = transl8_tok_to_str(tmp_tok);
	if (cur_pos == last_pos)
		set_heredoc(big_input, cmd);
	clear_token(&tmp_tok);
	free(big_input);
}
