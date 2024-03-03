/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   minishell.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:49:40 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/19 09:39:45 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MINISHELL_H
# define MINISHELL_H
# include <stdio.h>
# include <stdlib.h>
# include <unistd.h>
# include <string.h>
# include <fcntl.h>
# include <signal.h>
# include <termios.h>
# include <curses.h>
# include <term.h>
# include <sys/ioctl.h>
# include <sys/stat.h>
# include <dirent.h>
# include <readline/readline.h>
# include <readline/history.h>
# include "../libft/libft.h"
# include <sys/_types/_posix_vdisable.h>
# define ENV_FILE "/tmp/.ms_env"

enum	e_type_tok
{
	WORD = 1,
	QUOTE,
	D_QUOTE,
	NLINE,
	WHITE_SPACE,
	GREAT,
	D_GREAT,
	LESS,
	D_LESS,
	PIPE,
	DOLLAR,
	BACKSLASH
};

typedef struct s_tok_type
{
	char	*symb;
	int		type;
	char	*translate_type;
}				t_tok_type;

typedef struct s_tok
{
	struct s_tok	*next;
	int				type;
	int				pos;
	char			*content;
}				t_tok;

typedef struct s_rdata
{
	int				i_type;
	int				o_type;
	int				has_redir;
	char			*heredoc;
	t_tok			*token;
	char			*i_name;
	char			*o_name;
}				t_rdata;

typedef struct s_redir
{
	int				i_type;
	int				o_type;
	int				has_redir;
	char			*heredoc;
	t_tok			*token;
	char			*i_name;
	char			*o_name;
	int				pos;
	struct s_redir	*next;
}				t_redir;

typedef struct s_cmd
{
	int				pos;
	int				nb_cmd;
	int				nb_args;
	char			**args;
	int				pipes[2];
	int				input;
	int				output;
	t_redir			*redir;
	int				status;
	int				exit;
	pid_t			pid;
	struct s_cmd	*next;
	struct s_cmd	*prev;

}				t_cmd;

typedef struct s_builtin
{
	char			*name;
	char			*usage;
	int				(*builtin)(t_cmd *);
}				t_builtin;

typedef struct s_stat
{
	int				value;
	pid_t			pid;
	int				normal_exit;
	struct s_stat	*next;
}				t_stat;

/* builtins/cd.c */
int		ft_chdir(void);
int		ft_go_home(char ***env);
int		ft_go_arg(t_cmd *cmd, char ***env);
void	ft_sub_cd(t_cmd *cmd);
int		ft_cd(t_cmd *cmd);

/* builtins/echo.c */
int		echo_arg(t_cmd *cmd, void (*print)(char *, int), int i, int j);
int		ft_echo(t_cmd *cmd);

/* builtins/env.c */
int		ft_env(t_cmd *cmd);

/* builtins/exit.c */
int		ft_exit(t_cmd *cmd);
t_bool	ft_is_valid_num(char *s);

/* builtins/export.c */
char	*ft_concat2(char *s1, char *s2);
void	ft_qsort_tab(void *arr[], int l, int r, int (*cmp)(char *, char *));
int		ft_export(t_cmd *cmd);

/* builtins/parse_builtins.c */
void	get_builtin_error(t_cmd *cmd, t_builtin *arr, int status);
void	ft_search_builtin(t_cmd *cmd, t_builtin *arr);
int		ft_parse_builtin(t_cmd *cmd);

/* builtins/pwd.c */
char	*ft_getcwd(char **env);
int		ft_pwd(t_cmd *cmd);

/* builtins/unset.c */
void	ft_sub_unset(char ***env, char *arg);
int		ft_unset(t_cmd *cmd);

/* env/get_env.c */
char	*ft_getenv_arr(char *name, char **envp);
char	**ft_get_new_env_content(char *name, char *value);
char	*get_env_var(char *name);
int		get_exitstatus(void);

/* env/path.c */
char	*ft_joinpath(char *paths, char *cmd);
char	**ft_getpaths(char **env, char *name);
char	*ft_getpath(char **env, char *name, int mode, char *cmd);
void	handle_mspath(char *path, char ***env);
char	*get_cmd_path(char *cmd, char ***env);

/* env/read_write_env.c */
int		ft_write_env(char *name, char **env);
char	**ft_read_env(char *name);
int		init_env_file(void);

/* env/set_env.c  */
int		ft_set_new_env_content(char **content, char ***env);
void	ft_free_env_tmp_arrays(char **beg, char **mid, char **end);
int		ft_update_env_content(char *name, char **content, char ***env);
int		ft_setenv_arr(char *name, char *value, char ***env);
void	set_env_var(char *name, char *value);

/* env/status.c  */
void	add_exitstatus(int status, int pid, int exit, t_stat **status_lst);
t_stat	*get_status(void);
t_cmd	*get_last_stat_cmd(t_cmd **cmd, t_stat *status_lst);
char	*get_final_status(t_cmd **cmd);
void	set_status(t_cmd **cmd);

/* env/unset_env.c  */
char	*ft_before_c(char *s, int c);
int		ft_delete_env_content(char *name, char ***env);
int		ft_unsetenv(char *name, char ***env);

/* env/utils_env.c */
char	*ft_search_env_value(char *var, char *name);
t_bool	ft_is_name_env_arr(char *name, char **env);
void	set_nbcmd_envfile(t_cmd *cmd);
void	increment_shlvl(char ***env);
void	set_exitstatus(int status);

/* errors.c */
int		handle_argv_error(char *argv);
void	ft_print_error(t_cmd *cmd);
void	ft_print_usage(t_cmd *cmd, t_builtin *array);
void	print_cmd_not_found_err(char *cmd, int status);

/* executor.c */
void	execve_minishell(void);
int		exec_cmd(t_cmd *cmd, char **env);
int		child_process(t_cmd *cmd, char **env);
int		launch_cmd(t_cmd *cmd);
int		executor(t_cmd *cmd);

/* fds.c */
int		open_input_redir(t_cmd **cmd, t_tok *tmp, int last_input_pos);
int		open_output_redir(t_cmd **cmd, t_tok *tmp, int last_output_pos);
int		open_fds(t_cmd **cmd, int last_input_pos, int last_output_pos);
int		get_status_open(t_cmd **cmd);

/* lexer.c */
int		get_token_type(char *s);
int		get_token_size(char *input);
int		set_token(t_tok **tokens, char **input, int *pos);
t_tok	*lexer(char *input);
char	*translate_tok_type(int type);

/* parsing/args.c */
void	skip_redir_elt(t_tok **token);
int		get_nb_args(t_tok *token);
char	*get_redir_arg(t_tok **token, int i);
void	set_args(t_tok **token, int nb_args, char ***args);
char	**get_args(t_tok *token);

/* parsing/avoid_kill_ms.c */
char	*char_arr_to_char(char **arr, char *bound);
int		is_minishell_path(char **env);
int		is_destroy_ms_cmd(char *cmd);
int		avoid_kill_minishell(char **args, char **env);

/* parsing/cmd.c */
void	close_fd(t_cmd **cmd);
void	set_cmd_redir(t_cmd **elt, t_redir *redir);
void	set_cmd(t_tok *token, t_cmd **cmd, int pipes);
t_cmd	*get_cmds(t_tok *token);

/* parsing/heredoc.c */
char	*get_heredoc_input(char *keyword);
void	set_heredoc_token(t_tok **tmptmp_tok, t_tok **new_tok);
t_tok	*get_heredoc_token(char *big_input);
void	set_heredoc(char *big_input, t_cmd **cmd);
void	init_heredoc(t_cmd **cmd, char *kd, int cur_pos, int last_pos);

/* parsing/heredoc_2.c */
int		rl_heredoc(char **input, char **big_input, char *keyword, int *line);
int		event_heredoc(void);
void	make_exit_status_sigint_heredoc(void);
int		is_sigint_heredoc(void);

/* parsing/last_input_char.c */
int		check_last_input_char(t_tok	*token);

/* parsing/parser.c */
int		init_tokens(t_tok **tokens, char *input);
int		parse_redirs(t_tok *token);
int		parse_input(char *input, t_cmd **cmd);

/* parsing/quotes_1.c */
t_tok	*check_closing_quote(t_tok *token, char quote, int *count);
int		check_quotes(t_tok *token);
void	transl8_dol_quo(t_tok **tmp, char **translate);
void	set_trad(t_tok **tmp, char **translate, char quote);
char	*translate_quotes(t_tok *token, char quote);

/* parsing/redir.c */
t_rdata	raz_rdata(void);
void	add_redir(t_rdata redir_data, t_redir **redir);
t_rdata	get_rdata(t_tok *redirs, int *err, t_redir **redir);
int		set_redirs(t_tok *token, t_redir **redir);
t_redir	*get_redirs(t_tok *token);

/* parsing/special_chars.c */
void	transl8_dol_tok(t_tok **tmp, int pos, t_tok **elt);
int		transl8_quo_tok(t_tok **tmp, int pos, t_tok **elt);
void	parse_backslash(t_tok **tmp, int pos, t_tok **elt);
void	search_translation(t_tok **tmp, int *pos, t_tok **new_tok);
int		translate_tokens(t_tok **token);

/* parsing/token.c */
void	copy_token(t_tok *src, t_tok **dst, int pos);
char	*transl8_tok_to_str(t_tok *token);
int		check_redir_elts(t_tok *token);

/* parsing/token_pipes.c */
int		get_nb_pipes(t_tok *token);
int		check_pipe_type(t_tok **tmp);
int		parse_pipe_type(t_tok *tok);

/* parsing/token_redir.c */
int		set_redirs_tok_v2(t_tok **tokens, t_tok **redirs, int *err);
t_tok	*get_redirs_tok_v2(t_tok *tokens, int *err);
void	free_tokenss(t_tok **tokens, int nb_cmd);
int		set_redirs_tok_v3(t_tok *tokens, t_tok **redirs, int *cnt, int *err);
t_tok	**get_redirs_tok_v3(t_tok *tokens, int *err);

/* parsing/token_redir_last_pos.c */
int		*get_last_symbol_pos(t_tok *redir, int symbol);
int		get_last_input_pos(t_tok *token);
int		get_last_output_pos(t_tok *token);
char	*get_last_file(t_tok *token, int last_pos);
int		get_last_type(t_tok *token, int last_pos);

/* parsing/token_redir_type.c */
int		is_redir(int type);
int		is_input_redir(int type);
int		is_output_redir(int type);
int		cmp_pos(int pos1, int pos2);

/* parsing/word.c */
void	concat_word_tokens(t_tok **tmp, int pos, t_tok **elt);
void	search_concat_word(t_tok **tmp, int *pos, t_tok **new_tok);
int		parse_word_type(t_tok **token);

/* prompt.c */
int		get_input(void);
void	clean_minishell(int status);
int		prompt(void);

/* redir.c */
void	handle_redir_cmd(t_cmd *cmd);
int		open_pipes(t_cmd *cmd);
void	handle_pipes(t_cmd *cmd);
void	close_pipes(t_cmd *cmd);

/* signals.c */
void	handling_sigquit(int signal);
void	handling_sigint(int signal, siginfo_t *info, void *ctx);
void	ft_receive_sig(int signal, siginfo_t *info, void *ctx);
void	toggle_signals(int toggle);
void	ft_receive_sig_heredoc(int signal, siginfo_t *info, void *ctx);

/* terminal.c */
void	ft_reset_term(struct termios *terminal);
void	ft_init_terminal(int state);

/* utils/cd_1.c */
int		ft_get_nb_dir(char **paths);
char	*ft_init_search_path(char *arg_path);
int		ft_split_paths(char ***paths, int *nb_dir, char *arg_path);
int		ft_check_path_flags(char *path, int *is_symlnk);
int		ft_bind_paths(char **path, char *component);

/* utils/cd_2.c */
int		ft_is_dirname(char *dirname, char *cmp);
void	ft_handle_dot_dot(char **transl8_path, char *dirname);
void	ft_hdle_linkname(char **tl8_path, char *dirname, char *path);
int		ft_bind_dirs(char *path, char **search, char **link);
int		ft_parse_paths(char **search, char **link, char *arg_path);

/* utils/cd_3.c */
char	*ft_get_new_cwd(char *arg_path);
int		ft_set_new_cwd(char ***env, char *old_pwd, char *cwd);
char	*ft_get_abs_path(int *is_symlnk, char *search, char *link);

/* utils/char_array_1.c */
size_t	ft_get_arr_size(char **array);
void	ft_print_char_array_fd(char **array, int fd);
void	ft_print_char_array(char **array);
int		ft_read_char_array_fd(char ***array, int fd);
void	free_char_array(char **array);

/* utils/char_array_2.c */
char	**ft_arrstrdup(char **arr);
char	**ft_arrstrndup(char **arr, size_t n);
char	**ft_arrstrdup_til_name(char **arr, char *name);
char	**ft_arrstrdup_since_name(char **arr, char *name);
char	**ft_arrstrjoin(char **arr1, char **arr2);

/* utils/cmd_1.c */
t_cmd	*init_cmd(void);
t_cmd	*get_last_cmd(t_cmd *cmd);
int		get_nb_cmd(t_cmd *cmd);
void	addback_cmd(t_cmd **cmd, t_cmd *new);
void	clear_cmd(t_cmd **cmd);

/* utils/export.c */
int		ft_display_export(char *name, char *value, int fd);
char	*ft_get_name(char *env_val);
int		ft_set_display(char **env, int fd);
int		ft_display_env(int fd);
int		ft_export_var(char ***env, char *arg);

/* utils/redir_1.c */
t_redir	*init_redir(t_rdata redir_data);
t_redir	*get_last_redir(t_redir *redir);
int		get_nb_redir(t_redir *redir);
void	addback_redir(t_redir **redir, t_redir *new);
void	clear_redir(t_redir **redir);

/* utils/signals.c */
void	ft_wait_4_sig(int sig, void (*handler)(int, siginfo_t *, void *));
void	ft_ignore_signal(int signal);

/* utils/status_1.c */
t_stat	*init_status(int value, int exit, int pid);
t_stat	*get_last_status(t_stat *status);
int		get_nb_status(t_stat *status);
void	addback_status(t_stat **status, t_stat *new);
void	clear_status(t_stat **status);

/* utils/token_1.c */
t_tok	*init_token(int type, int pos, char *content);
t_tok	*get_last_token(t_tok *tok);
int		get_nb_token(t_tok *tok);
void	addback_token(t_tok **tok, t_tok *new);
void	clear_token(t_tok **tok);
#endif
