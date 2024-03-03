/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   status_1.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:45:17 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:45:18 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

t_stat	*init_status(int value, int exit, int pid)
//t_stat	*init_status(int value)
{
	t_stat	*status;

	status = malloc(sizeof(*status));
	if (!status)
		return (NULL);
	status->value = value;
	status->normal_exit = exit;
	status->pid = pid;
	status->next = NULL;
	return (status);
}

t_stat	*get_last_status(t_stat *status)
{
	if (!status)
		return (NULL);
	while (status->next)
		status = status->next;
	return (status);
}

int	get_nb_status(t_stat *status)
{
	int		nb_status;

	nb_status = 0;
	while (status)
	{
		nb_status++;
		status = status->next;
	}
	return (nb_status);
}

void	addback_status(t_stat **status, t_stat *new)
{
	t_stat	*last;

	if (!*status)
	{
		*status = new;
		return ;
	}
	last = get_last_status(*status);
	last->next = new;
}

void	clear_status(t_stat **status)
{
	t_stat	*tmp;

	while (*status)
	{
		tmp = (*status)->next;
		free(*status);
		(*status) = tmp;
	}
}
