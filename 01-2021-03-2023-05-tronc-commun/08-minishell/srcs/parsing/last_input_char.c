/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   last_input_char.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:39:12 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:39:14 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	check_last_input_char(t_tok	*token)
{
	t_tok	*tmp;

	if (!token)
		return (0);
	tmp = get_last_token(token);
	if (tmp->type != WORD && tmp->type != QUOTE
		&& tmp->type != D_QUOTE && tmp->type != WHITE_SPACE
		&& tmp->type != DOLLAR && tmp->type != NLINE)
	{
		return (0);
	}
	return (1);
}
