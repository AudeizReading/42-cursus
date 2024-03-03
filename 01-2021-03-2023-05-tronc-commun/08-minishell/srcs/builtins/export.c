/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   export.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:33:58 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/12 16:22:20 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_concat2(char *s1, char *s2)
{
	char	*dst;
	size_t	len_s1;
	size_t	len_s2;

	len_s1 = ft_strlen(s1);
	len_s2 = ft_strlen(s2);
	dst = (char *)ft_calloc((len_s1 + len_s2 + 1), sizeof(*dst));
	if (dst == NULL)
		return (NULL);
	ft_memcpy(dst, s1, len_s1);
	ft_memcpy((dst + len_s1), s2, len_s2);
	free((void *)s2);
	return (dst);
}

void	ft_qsort_tab(void *arr[], int l, int r, int (*cmp)(char *, char *))
{
	int		i;
	int		last;

	if (l >= r)
		return ;
	ft_swap_tab(arr, l, (l + r) / 2);
	last = l;
	i = l + 1;
	while (i <= r)
	{
		if ((*cmp)(arr[i], arr[l]) < 0)
			ft_swap_tab(arr, ++last, i);
		i++;
	}
	ft_swap_tab(arr, l, last);
	ft_qsort_tab(arr, l, last - 1, cmp);
	ft_qsort_tab(arr, last + 1, r, cmp);
}

int	ft_export(t_cmd *cmd)
{
	int		i;
	char	**env;

	env = ft_read_env(ENV_FILE);
	if (cmd->nb_args < 2)
		if (!ft_display_env(STDOUT_FILENO))
			return (1);
	i = 0;
	while (cmd->args[++i])
	{
		if (!ft_export_var(&env, cmd->args[i]))
			return (1);
	}
	if (cmd->pos == 1 && cmd->nb_cmd == 1)
		ft_write_env(ENV_FILE, env);
	free_char_array(env);
	return (0);
}
