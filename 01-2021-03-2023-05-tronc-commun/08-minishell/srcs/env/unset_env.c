/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   unset_env.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:37:25 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:37:27 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_before_c(char *s, int c)
{
	char	*dst;
	size_t	dst_len;

	dst = NULL;
	if (!s)
		return (NULL);
	if (!ft_strchr(s, c))
		return (s);
	dst_len = ft_strlen(s) - 1;
	dst = malloc(sizeof(*dst) * dst_len + 1);
	if (!dst)
		return (NULL);
	dst[dst_len] = 0;
	while (dst_len--)
		dst[dst_len] = s[dst_len];
	return (dst);
}

int	ft_delete_env_content(char *name, char ***env)
{
	char	**begin;
	char	**end;
	char	*trim_name;

	trim_name = ft_before_c(name, '=');
	begin = ft_arrstrdup_til_name(*env, trim_name);
	end = ft_arrstrdup_since_name(*env, trim_name);
	if ((!begin && !end) || !trim_name)
	{
		if (trim_name)
			free(trim_name);
		return (0);
	}
	free_char_array(*env);
	*env = ft_arrstrjoin(begin, end);
	if (!*env)
	{
		free(trim_name);
		ft_free_env_tmp_arrays(begin, end, NULL);
		return (0);
	}
	free(trim_name);
	ft_free_env_tmp_arrays(begin, end, NULL);
	return (1);
}

int	ft_unsetenv(char *name, char ***env)
{
	while (ft_is_name_env_arr(name, *env))
	{
		if (!ft_delete_env_content(name, env))
			return (1);
	}
	return (0);
}
