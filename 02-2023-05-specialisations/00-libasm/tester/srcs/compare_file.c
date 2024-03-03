#include "libasm_tester.h"

#ifdef	PHASE_TWO
static void		check_version(int idx_test, char* test_name, char *ft_line, char *reg_line) {
	char **first_line_ft = ft_split(ft_line, ':');
	char **first_line_reg = ft_split(reg_line, ':');

	assert(strcmp(first_line_reg[2], first_line_ft[2]) != 0);
	PRINT_RES(idx_test, test_name, OK, "\t%s%s.\n", first_line_ft[2], RESET);

	ft_free_char_array(first_line_ft);
	ft_free_char_array(first_line_reg);
}

int		compare_files(enum e_functions type_test, ...) {
	va_list		args;

	va_start(args, type_test);

	char	*reg_file = va_arg(args, char *);
	char	*ft_file = va_arg(args, char *);
	int		*idx_test = va_arg(args, int *);
	
	if (!reg_file || !ft_file)
		exit(1);

	char	*reg_content = read_file(reg_file);
	char	*ft_content = read_file(ft_file);
	char	**reg_lines = ft_split(reg_content, '\n');
	char	**ft_lines = ft_split(ft_content, '\n');

	switch (type_test) {
		case TEST_LEAKS: {
				if (strstr(ft_content, "All heap blocks were freed -- no leaks are possible") != NULL) {
					PRINT_RES(*idx_test, "FT - check LEAKS", OK, "\t%s\n", "No Leaks.");
				} else {
					PRINT_RES(*idx_test, "FT - check LEAKS", KO, "\n%s\n", strstr(ft_content, "LEAK SUMMARY") ? strstr(ft_content, "LEAK SUMMARY") : "It should find leaks...");
				}
			}
			break;
		case TEST_STRLEN: {
				check_version(*idx_test, "FT - check version STRLEN", ft_lines[0], reg_lines[0]);

				// __FILE__:__LINE__:idx_test:taille_chaine:valeur_chaine:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					
					(*idx_test)++;
					assert(strcmp(line_reg[2], line_ft[2]) == 0 
							&& strcmp(line_reg[3], line_ft[3]) == 0 
							&& (line_reg[4] && line_ft[4]) 
								? strcmp(line_reg[4], line_ft[4]) == 0 
								: line_reg[4] == NULL && line_ft[4] == NULL
						);
					PRINT_RES(*idx_test, "FT - check size STRLEN", OK, "\tFT: %-5s - REG: %-5s%s\n", line_ft[3], line_reg[3], RESET);

					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
					if (!ft_lines[i + 1])
						printf("\n");
				}
			}
			break;
		case TEST_STRCPY: {
				check_version(*idx_test, "FT - check version STRCPY", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:idx_test:retour_strcpy:chaine_destination:chaine_source:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					
					int fields = 0;
					for (int i = 0; line_ft[i]; i++, fields++);
					(*idx_test)++;
					assert(strcmp(line_reg[2], line_ft[2]) == 0 
							&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
							&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
							&& (fields == 6 && line_reg[3] && line_ft[3]) ? strcmp(line_reg[5], line_ft[5]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
					);
					
					PRINT_RES(*idx_test, "FT - check value STRCPY", OK, "\tFT: [%-15.15s] - REG: [%-15.15s]%s\n", line_ft[3] ?  line_ft[3] : "NULL", line_reg[3] ?  line_reg[3] : "NULL", RESET);

					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
					if (!ft_lines[i + 1])
						printf("\tContent may have been truncated for clarity. But the test is succeed if you can read this.\n\n");
				}
			}
			break;
		case TEST_STRCMP: {
				check_version(*idx_test, "FT - check version STRCMP", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:idx_test:retour_strcmp:chaine_src1:chaine_src2:
				// __FILE__:__LINE__:idx_test:retour_strcmp:chaine_src2:chaine_src1:
				// __FILE__:__LINE__:idx_test:retour_strcmp:&chaine_src1[1]:&chaine_src2[1]:
				// __FILE__:__LINE__:idx_test:retour_strcmp:&chaine_src1[1]:&chaine_src2[2]:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					
					(*idx_test)++;
					int	res_ft = atoi(line_ft[3]);
					int	res_reg = atoi(line_reg[3]);
					// Les res peuvent varier d'une plateforme MacOSX ou Linux
					// MacOSX donne la distance entre les 2 char, Linux indique seulement -1 0 ou 1.
					assert(strcmp(line_reg[2], line_ft[2]) == 0 
							&& ((res_ft < 0 && res_reg < 0) 
								|| (res_ft > 0 && res_reg > 0)
								|| (res_ft == 0 && res_reg == 0)
								)
							);
					PRINT_RES(*idx_test, "FT - check return STRCMP", OK, "\tFT: %-5s - REG: %-5s%s\n", line_ft[3], line_reg[3], RESET);

					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
					if (!ft_lines[i + 1])
						printf("\tResults may vary because of the interpretation of the result value of strcmp by the plateform. The most important is that the result has the same sign or be 0.\n\n");
				}
			}
			break;
		case TEST_STRDUP: {
				check_version(*idx_test, "FT - check version STRDUP", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:idx_test:chaine_destination:chaine_source:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					
					(*idx_test)++;
#ifdef MACOSX
					if (line_ft[3]) {
#endif					
					assert(strcmp(line_reg[2], line_ft[2]) == 0 
							&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
							&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
					);
#ifdef MACOSX
					}
#endif					
					PRINT_RES(*idx_test, "FT - check return STRDUP", OK, "\tFT: [%-15.15s] - REG: [%-15.15s]%s\n", line_ft[3] ?  line_ft[3] : "NULL", line_reg[3] ?  line_reg[3] : "NULL", RESET);

					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
					if (!ft_lines[i + 1])
						printf("\tContent may have been truncated for clarity. But the test is succeed if you can read this.\n\n");
				}
			}
			break;
		case TEST_READ:
		case TEST_WRITE: {
				check_version(*idx_test, "FT - check version READ & WRITE", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:idx_test:errno:chaine_errno:error_read_ou_write:nb_bytes_lus:nb_bytes_ecrits:
				char	*reg_output = read_file(REG_OUTPRW);
				char	*ft_output = read_file(FT_OUTPRW);

				assert(strcmp(reg_output, ft_output) == 0); // assert ce qu'on a envoyé avec write

				free(reg_output);
				free(ft_output);
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					if (ft_lines[i + 1]) {
						(*idx_test)++;
						assert(strcmp(line_reg[2], line_ft[2]) == 0 
								&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
								&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
								&& (line_reg[5] && line_ft[5]) ? strcmp(line_reg[5], line_ft[5]) == 0 : line_reg[5] == NULL && line_ft[5] == NULL
								&& (line_reg[6] && line_ft[6]) ? strcmp(line_reg[6], line_ft[6]) == 0 : line_reg[6] == NULL && line_ft[6] == NULL
								&& (line_reg[7] && line_ft[7]) ? strcmp(line_reg[7], line_ft[7]) == 0 : line_reg[7] == NULL && line_ft[7] == NULL
							  );
					PRINT_RES(*idx_test, "FT - check return READ & WRITE", OK, "\tFT: bytes: %7s, error: %3s - REG: bytes: %7s, error: %3s\n", line_ft[6] ?  line_ft[6] : "NULL", line_ft[3] ?  line_ft[3] : "NULL", line_reg[6] ?  line_reg[6] : "NULL", line_reg[3] ?  line_reg[3] : "NULL");
					}
					if (!ft_lines[i + 1]) {
						printf("\n");
					}
					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
				}
			}
			break;
#ifdef BONUS
		case TEST_ATOI_BASE: {
				check_version(*idx_test, "FT - check version ATOI BASE", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:idx_test:retour_atoi_base:str_to_atoi:base_atoi:valeur_attendue:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					
					(*idx_test)++;
					assert(strcmp(line_reg[2], line_ft[2]) == 0 
							&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
							&& (line_reg[6] && line_ft[6]) ? strcmp(line_reg[3], line_ft[6]) == 0 : line_reg[3] == NULL && line_ft[6] == NULL
					);
					
					PRINT_RES(*idx_test, "FT - check return ATOI BASE", OK, "\tFT: %-15.15s - REG: %-15.15s%s\n", line_ft[3] ?  line_ft[3] : "NULL", line_reg[3] ?  line_reg[3] : "NULL", RESET);

					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
					if (!ft_lines[i + 1])
						printf("\n");
				}
			}
			break;
		case TEST_FT_LIST_PUSH_FRONT: {
				check_version(*idx_test, "FT - check version LIST PUSH FRONT", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:idx_test:valeur_maillon:valeur_a_copier:
				// __FILE__:__LINE__:final_assert:last_index_list:index_check:valeur_dernier_maillon:valeur_premier_maillon:valeur_premier_split:valeur_dernier_split:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');

					(*idx_test)++;
					if (ft_lines[i + 1]) {
						assert(strcmp(line_reg[2], line_ft[2]) == 0 
								&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
								&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
								&& (line_reg[4] && line_ft[4]&& line_reg[3] && line_ft[3]) ? strcmp(line_ft[3], line_ft[4]) == 0 : line_ft[3] == NULL && line_ft[4] == NULL
							  );

						PRINT_RES(*idx_test, "FT - check return LIST PUSH FRONT", OK, "\tFT: %-15.15s - REG: %-15.15s%s\n", line_ft[3] ?  line_ft[3] : "NULL", line_reg[3] ?  line_reg[3] : "NULL", RESET);

					} else { 
						assert(strcmp(line_reg[2], line_ft[2]) == 0 
								&& strcmp(line_reg[3], line_ft[3]) == 0
								&& strcmp(line_reg[4], line_ft[4]) == 0
								&& strcmp(line_ft[3], line_ft[4]) == 0
								&& (line_reg[5] && line_ft[5]) ? strcmp(line_reg[5], line_ft[5]) == 0 : line_reg[5] == NULL && line_ft[5] == NULL
								&& (line_reg[6] && line_ft[6]) ? strcmp(line_reg[6], line_ft[6]) == 0 : line_reg[6] == NULL && line_ft[6] == NULL
								&& (line_reg[7] && line_ft[7]) ? strcmp(line_reg[7], line_ft[7]) == 0 : line_reg[7] == NULL && line_ft[7] == NULL
								&& (line_reg[8] && line_ft[8]) ? strcmp(line_reg[8], line_ft[8]) == 0 : line_reg[8] == NULL && line_ft[8] == NULL
								&& (line_ft[5] && line_ft[7]) ? strcmp(line_ft[5], line_ft[7]) == 0 : line_ft[5] == NULL && line_ft[7] == NULL
								&& (line_ft[6] && line_ft[8]) ? strcmp(line_ft[6], line_ft[8]) == 0 : line_ft[6] == NULL && line_ft[8] == NULL
							  );
						PRINT_RES(*idx_test, "FT - check order nodes LIST PUSH FRONT", OK, "\tFT, first node: %-15.15s - REG, first node: %-15.15s%s\tFT, last node: %-15.15s - REG, last node: %-15.15s%s\n\n", line_ft[6] ?  line_ft[6] : "NULL", line_reg[6] ?  line_reg[6] : "NULL", RESET, line_ft[5] ?  line_ft[5] : "NULL", line_reg[5] ?  line_reg[5] : "NULL", RESET);
					}
					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
				}
			}
			break;
		case TEST_FT_LIST_SIZE: {
				check_version(*idx_test, "FT - check version LIST SIZE", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:final_assert:list_size:size_check:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					
					(*idx_test)++;
					assert(strcmp(line_reg[2], line_ft[2]) == 0 
							&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
							&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
					);
					
					PRINT_RES(*idx_test, "FT - check return LIST SIZE", OK, "\tFT: %-5s - REG: %-5s%s\n", line_ft[3] ?  line_ft[3] : "NULL", line_reg[3] ?  line_reg[3] : "NULL", RESET);

					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
					if (!ft_lines[i + 1])
						printf("\n");
				}
			}
			break;
		case TEST_FT_LIST_SORT: {
				check_version(*idx_test, "FT - check version LIST SORT", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:idx_test:valeur_maillon:valeur_split:resultat_comparaison_ok(doit etre a 1 ici):
				// __FILE__:__LINE__:idx_test:valeur_maillon:valeur_maillon_suivant:resultat_comparaison_liste_triée(doit etre a 1 ici ou -1 si
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');

					int fields = 0;
					for (int i = 0; line_ft[i]; i++, fields++);
					(*idx_test)++;
					if (ft_lines[i + 1]) {
						assert(strcmp(line_reg[2], line_ft[2]) == 0 
								&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
								&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
								&& (line_reg[5] && line_ft[5]) ? strcmp(line_ft[5], "1") == 0 && strcmp(line_reg[5], "1") == 0 : line_reg[5] == NULL && line_ft[5] == NULL
							  );
						PRINT_RES(*idx_test, "FT - check node LIST SORT", OK, "\tFT: [%-15.15s] - REG: [%-15.15s]%s\n", line_ft[3] ?  line_ft[3] : "NULL", line_reg[3] ?  line_reg[3] : "NULL", RESET);
					} else { 
						assert(strcmp(line_reg[2], line_ft[2]) == 0 
								&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
								&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
								&& (line_reg[5] && line_ft[5]) ? strcmp(line_ft[5], "-1") == 0 && strcmp(line_reg[5], "-1") == 0 : line_reg[5] == NULL && line_ft[5] == NULL
							  );
						PRINT_RES(*idx_test, "FT - check node LIST SORT", OK, "\tFT: [%-15.15s] - REG: [%-15.15s]%s\n\n", line_ft[3] ?  line_ft[3] : "NULL", line_reg[3] ?  line_reg[3] : "NULL", RESET);
					}
					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
				}
			}
			break;
		case TEST_FT_LIST_REMOVE_IF: {
				check_version(*idx_test, "FT - check version LIST REMOVE IF", ft_lines[0], reg_lines[0]);
				// __FILE__:__LINE__:start:valeur_premier_maillon:taille_liste:
				// __FILE__:__LINE__:remove_first:valeur_maillon_a_supprimer:taille_liste:
				// __FILE__:__LINE__:idx_test:valeur_maillon_a_supprimer:taille_liste:
				// __FILE__:__LINE__:final:taille_liste:
				for (int i = 1; ft_lines[i] && reg_lines[i]; i++) {
					char **line_ft = ft_split(ft_lines[i], ':');
					char **line_reg = ft_split(reg_lines[i], ':');
					if (ft_lines[i + 1]) {
						(*idx_test)++;
						assert(strcmp(line_reg[2], line_ft[2]) == 0 
								&& (line_reg[3] && line_ft[3]) ? strcmp(line_reg[3], line_ft[3]) == 0 : line_reg[3] == NULL && line_ft[3] == NULL
								&& (line_reg[4] && line_ft[4]) ? strcmp(line_reg[4], line_ft[4]) == 0 : line_reg[4] == NULL && line_ft[4] == NULL
							  );
						PRINT_RES(*idx_test, "FT - check version LIST REMOVE IF", OK, "\tFT: %-15.15s %3.3s - REG: %-15.15s %3.3s%s\n", line_ft[3] ?  line_ft[3] : "NULL", line_ft[4] ?  line_ft[4] : "0", line_reg[3] ?  line_reg[3] : "NULL", line_reg[4] ?  line_reg[4] : "0", RESET);
					}
					if (!ft_lines[i + 1]) {
						printf("\n");
					}
					ft_free_char_array(line_ft);
					ft_free_char_array(line_reg);
				}
			}
			break;
#endif
		default:
			break;
	}
	va_end(args);

	(*idx_test)++;
	free(reg_content);
	free(ft_content);
	ft_free_char_array(reg_lines);
	ft_free_char_array(ft_lines);
	return 0;
}
# endif //PHASE_TWO
