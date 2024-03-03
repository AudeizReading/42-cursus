/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strings.h                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 13:25:13 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 11:14:32 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FT_STRINGS_H
# define FT_STRINGS_H

void			ft_putchar(char c);
void			ft_putstr(char *str);
void			ft_isspace(char *str);
long long int	ft_atoi(char *str);
int				ft_strcmp(char *s1, char *s2);
void			ft_swap(char *tab[], int i, int j);
void			ft_quicksort(char *tab[], int left, int right);
#endif
