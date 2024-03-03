/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_parse_arguments.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/21 15:54:45 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:24:05 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

t_bool	ft_is_valid_ps_args(char **argv)
{
	char	**p_argv;
	char	*pp_argv;
	t_bool	cond_1;
	t_bool	cond_2;

	p_argv = argv;
	while (*p_argv)
	{
		pp_argv = *p_argv;
		cond_1 = !ft_isdigit(*pp_argv);
		cond_2 = (*pp_argv != 32 && *pp_argv != 43 && *pp_argv != 45);
		while (*pp_argv)
		{
			if (cond_1 && cond_2)
			{
				ft_puterr();
				return (e_false);
			}
			pp_argv++;
		}
		p_argv++;
	}
	return (e_true);
}

t_bool	ft_has_duplicate_chars(char **argv)
{
	t_dup	st;

	st.i = -1;
	st.j = 0;
	while (argv[++st.i] && argv[st.i + 1])
	{
		st.j = st.i;
		st.trim_i = ft_strtrim(argv[st.i], "+");
		while (argv[st.j + 1])
		{
			st.trim_j = ft_strtrim(argv[st.j + 1], "+");
			if (!ft_strcmp(st.trim_i, st.trim_j))
			{
				ft_puterr();
				free(st.trim_j);
				free(st.trim_i);
				return (e_true);
			}
			st.j++;
			free(st.trim_j);
		}
		free(st.trim_i);
	}
	return (e_false);
}

t_bool	ft_check_arg_is_int(char **args)
{
	long	value;

	if (!args)
		return (e_false);
	while (*args)
	{
		if (!ft_has_atol(*args, &value) || !ft_is_int(value))
		{
			ft_puterr();
			return (e_false);
		}
		args++;
	}
	return (e_true);
}

char	**ft_parse_args(int argc, char **argv)
{
	char	**args;
	char	*args_str;
	int		i;

	if (argc < 2)
		return (NULL);
	if (!ft_is_valid_ps_args(argv))
		return (NULL);
	i = 0;
	args_str = NULL;
	while (i < argc)
	{
		args_str = ft_concat(args_str, argv[i++]);
		args_str = ft_concat(args_str, " ");
	}
	args = ft_split(args_str, 32);
	if (!args)
		return (NULL);
	free(args_str);
	if (ft_has_duplicate_chars(args) || !ft_check_arg_is_int(args))
	{
		ft_free_args(args);
		return (NULL);
	}
	return (args);
}

void	ft_free_args(char **args)
{
	int		i;

	if (!args)
		return ;
	i = 0;
	while (args[i])
		free(args[i++]);
	free(args);
}
