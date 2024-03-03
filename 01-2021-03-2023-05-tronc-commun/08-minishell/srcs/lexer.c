/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lexer.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:47:21 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/17 07:42:06 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	get_token_type(char *s)
{
	static t_tok_type	tok[] = {
	{"\t", WHITE_SPACE, "WHITE_SPACE"},
	{" ", WHITE_SPACE, "WHITE_SPACE"},
	{"\n", NLINE, "NLINE"},
	{"|", PIPE, "PIPE"},
	{"\\", BACKSLASH, "BACKSLASH"},
	{"$", DOLLAR, "DOLLAR"},
	{"\'", QUOTE, "QUOTE"},
	{"\"", D_QUOTE, "D_QUOTE"},
	{">", GREAT, "GREAT"},
	{">>", D_GREAT, "D_GREAT"},
	{"<", LESS, "LESS"},
	{"<<", D_LESS, "D_LESS"},
	{NULL, -1, "NULL"}
	};
	int					i;

	i = -1;
	while (tok[++i].type != -1)
	{
		if (!ft_strcmp(s, tok[i].symb))
			return (tok[i].type);
	}
	return (0);
}

int	get_token_size(char *input)
{
	int					size;

	size = 0;
	if (ft_strchr("\t\n |<>$\\\"\'", *input))
	{
		if (!ft_strncmp("<<", input, 2) || !ft_strncmp(">>", input, 2))
			size = 2;
		else
			size = 1;
	}
	else
	{
		while (!ft_strchr("\t\n |<>$\\\"\'", input[size]))
			size++;
	}
	return (size);
}

char	*translate_tok_type(int type)
{
	static t_tok_type	tok[] = {
	{"\t", WHITE_SPACE, "WHITE_SPACE"},
	{" ", WHITE_SPACE, "WHITE_SPACE"},
	{"\n", NLINE, "NLINE"},
	{"|", PIPE, "PIPE"},
	{"\\", BACKSLASH, "BACKSLASH"},
	{"$", DOLLAR, "DOLLAR"},
	{"\'", QUOTE, "QUOTE"},
	{"\"", D_QUOTE, "D_QUOTE"},
	{">", GREAT, "GREAT"},
	{">>", D_GREAT, "D_GREAT"},
	{"<", LESS, "LESS"},
	{"<<", D_LESS, "D_LESS"},
	{NULL, -1, "NULL"}
	};
	int					i;

	i = -1;
	while (tok[++i].type != -1)
	{
		if (type == tok[i].type)
			return (tok[i].translate_type);
	}
	return (NULL);
}

int	set_token(t_tok **tokens, char **input, int *pos)
{
	char				*content;
	int					size;
	int					type;
	t_tok				*elt;

	size = get_token_size(*input);
	content = ft_strndup(*input, size);
	if (!content)
		return (0);
	type = get_token_type(content);
	if (!type && size)
		type = WORD;
	elt = init_token(type, *pos, content);
	addback_token(tokens, elt);
	*input += size;
	free(content);
	(*pos)++;
	return (1);
}

t_tok	*lexer(char *input)
{
	t_tok				*tokens;
	int					pos;

	tokens = NULL;
	pos = 0;
	if (!input)
		return (NULL);
	while (*input)
	{
		if (!set_token(&tokens, &input, &pos))
		{
			clear_token(&tokens);
			return (NULL);
		}
	}
	return (tokens);
}
