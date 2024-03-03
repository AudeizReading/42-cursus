/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token_redir_type.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:41:48 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/17 07:44:31 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	is_redir(int type)
{
	if (type == GREAT || type == D_GREAT || type == LESS || type == D_LESS)
		return (type);
	return (0);
}

int	is_input_redir(int type)
{
	if (type == LESS || type == D_LESS)
		return (1);
	return (0);
}

int	is_output_redir(int type)
{
	if (type == GREAT || type == D_GREAT)
		return (1);
	return (0);
}

int	cmp_pos(int pos1, int pos2)
{
	int	pos;

	pos = -1;
	if (pos1 > pos2)
		pos = pos1;
	else if (pos2 > pos1)
		pos = pos2;
	return (pos);
}
