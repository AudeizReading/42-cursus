/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   char_array_2.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:43:55 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:43:56 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	**ft_arrstrdup(char **arr)
{
	char	**dup;
	size_t	arr_len;

	dup = NULL;
	if (!arr)
		return (NULL);
	arr_len = ft_get_arr_size(arr);
	if (!arr_len)
		return (NULL);
	dup = (char **)malloc(sizeof(char *) * (arr_len + 1));
	if (!dup)
		return (NULL);
	dup[arr_len] = NULL;
	while (arr_len--)
	{
		dup[arr_len] = ft_strdup(arr[arr_len]);
		if (!dup[arr_len])
		{
			free_char_array(dup);
			return (NULL);
		}
	}
	return (dup);
}

char	**ft_arrstrndup(char **arr, size_t n)
{
	char	**dup;

	dup = NULL;
	if (!arr || !n)
		return (NULL);
	dup = (char **)malloc(sizeof(char *) * (n + 1));
	dup[n] = NULL;
	while (n--)
	{
		dup[n] = ft_strdup(arr[n]);
		if (!dup[n])
		{
			free_char_array(dup);
			return (NULL);
		}
	}
	return (dup);
}

char	**ft_arrstrdup_til_name(char **arr, char *name)
{
	char	**dup;
	char	*seek;
	int		offset;

	dup = NULL;
	seek = NULL;
	if (!arr)
		return (NULL);
	offset = 0;
	seek = ft_strjoin(name, "=");
	while (arr[offset])
	{
		if (!ft_strncmp(arr[offset], seek, ft_strlen(seek)))
			break ;
		offset++;
	}
	free(seek);
	if (!offset)
		return (NULL);
	else
		dup = ft_arrstrndup(arr, offset);
	if (!dup)
		return (NULL);
	return (dup);
}

char	**ft_arrstrdup_since_name(char **arr, char *name)
{
	char	**dup;
	char	*seek;
	size_t	offset;

	dup = NULL;
	seek = NULL;
	if (!arr)
		return (NULL);
	offset = ft_get_arr_size(arr);
	seek = ft_strjoin(name, "=");
	while (arr[--offset])
	{
		if (!ft_strncmp(arr[offset], seek, ft_strlen(seek)))
			break ;
	}
	free(seek);
	if (!(ft_get_arr_size(arr) - offset - 1))
		return (NULL);
	else
		dup = ft_arrstrdup(arr + offset + 1);
	if (!dup)
		return (NULL);
	return (dup);
}

char	**ft_arrstrjoin(char **arr1, char **arr2)
{
	char	**dst;
	size_t	arr1_len;
	size_t	dst_len;

	if (!arr1 && !arr2)
		return (NULL);
	arr1_len = ft_get_arr_size(arr1);
	dst_len = ft_get_arr_size(arr2) + arr1_len;
	dst = (char **)malloc(sizeof(char *) * (dst_len + 1));
	if (!dst)
		return (NULL);
	dst[dst_len] = NULL;
	while (dst_len--)
	{
		if (dst_len >= arr1_len)
			dst[dst_len] = ft_strdup(arr2[dst_len - arr1_len]);
		else
			dst[dst_len] = ft_strdup(arr1[dst_len]);
		if (!dst[dst_len])
		{
			free_char_array(dst);
			return (NULL);
		}
	}
	return (dst);
}
