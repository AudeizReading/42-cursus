#!/bin/bash

declare -i opt

opt=1

ts="testers"
lg="logs"
ot="others_checks"

ft="full_test"
mt="map_test"
vt="vector_test"
st="stack_test"
tt="main_42_test"

cl="check_leaks"
cm="check_relinking_Makefile"
ct="check_time"
cf="check_functions"
qu="quit"
pu="purge"

trs="binary_tree_stack_test"
trm="binary_tree_map_test"

log_stk="tests/outputs/logs/FT_stk_compare.out"
log_map="tests/outputs/logs/FT_map_compare.out"
log_vec="tests/outputs/logs/FT_vec_compare.out"
log_t42="tests/outputs/logs/FT_t42_compare.out"
time_stk="tests/outputs/logs/FT_stk_time.out"
time_map="tests/outputs/logs/FT_map_time.out"
time_vec="tests/outputs/logs/FT_vec_time.out"
time_t42="tests/outputs/logs/FT_t42_time.out"
tree_stk="tests/outputs/logs/FT_stk_red_black_tree.out"
tree_map="tests/outputs/logs/FT_map_red_black_tree.out"
tmflog="tests/outputs/deepthought/deepthought._tmflog_general_.out"
banner="tests/scripts/banner.txt"
banner_script="tests/scripts/banner.sh"
banner_logs_script="tests/scripts/logs.sh"
banner_tests_script="tests/scripts/tests.sh"
banner_nm_script="tests/scripts/nm.sh"
banner_others_script="tests/scripts/others.sh"

lvl1=("${ts}" "${ot}" "${lg}" "${pu}" "${qu}")
testers=("${ft}" "${tt}" "${st}" "${vt}" "${mt}" "${qu}")
execs_to_check=("${tt}" "${st}" "${vt}" "${mt}" "${qu}")
logs_availables=("${tt}" "${st}" "${vt}" "${mt}" "${trs}" "${trm}" "${qu}")
checkers=("${cl}" "${cm}" "${ct}" "${cf}" "${qu}")

function select_testers
{
	while [[ $opt -ne 11 ]]
	do
		./${banner_tests_script}
		select tst in ${testers[@]}
		do
			case $tst in
				"${ft}")
					echo "${ft}"
					opt=111
					make tester
					break
					;;
				"${mt}")
					echo "${mt}"
					opt=112
					make cmp_map
					break
					;;
				"${vt}")
					echo "${vt}"
					opt=113
					make cmp_vec
					break
					;;
				"${st}")
					echo "${st}"
					opt=114
					make cmp_stk
					break
					;;
				"${tt}")
					echo "${tt}"
					opt=115
					make cmp_t42
					break
					;;
				"${qu}")
					echo "${qu}"
					opt=11
					break 2
					;;
				*)
					echo "Invalid input"
					opt=116
					break
					;;
			esac
		done
	done
	return 0
}

function select_logs
{
	while [[ $opt -ne 22 ]]
	do
		./${banner_logs_script}
		select lga in ${logs_availables[@]}
		do
			case $lga in
				"${mt}")
					echo "${mt}"
					opt=221
					if [[ -f "$log_map" ]]
					then
						tail $log_map
						cat $time_map
					else
						echo "You have to launch the tester for being able to check this file!"
					fi
					break
					;;
				"${vt}")
					echo "${vt}"
					opt=222
					if [[ -f "$log_vec" ]]
					then
						tail -n 162 $log_vec
						cat $time_vec
					else
						echo "You have to launch the tester for being able to check this file!"
					fi
					break
					;;
				"${st}")
					echo "${st}"
					opt=223
					if [[ -f "$log_stk" ]]
					then
						tail -n 20 $log_stk
						cat $time_stk
					else
						echo "You have to launch the tester for being able to check this file!"
					fi
					break
					;;
				"${tt}")
					echo "${tt}"
					opt=224
					if [[ -f "$log_t42" ]]
					then
						tail $log_t42
						cat $time_t42
					else
						echo "You have to launch the tester for being able to check this file!"
					fi
					break
					;;
				"${trs}")
					echo "${trs}"
					opt=225
					if [[ -f "$tree_stk" ]]
					then
						cat $tree_stk
					else
						echo "You have to launch the tester for being able to check this file!"
					fi
					break
					;;
				"${trm}")
					echo "${trm}"
					opt=226
					if [[ -f "$tree_map" ]]
					then
						tail -n 2200 $tree_map
					else
						echo "You have to launch the tester for being able to check this file!"
					fi
					break
					;;
				"${qu}")
					echo "${qu}"
					opt=22
					break 2
					;;
				*)
					echo "Invalid input"
					opt=227
					break
					;;
			esac
		done
	done
	return 0
}

function select_execs
{
	while [[ $opt -ne 44 ]]
	do
		./${banner_nm_script}
		select exc in ${execs_to_check[@]}
		do
			case $exc in
				"${mt}")
					echo "${mt}"
					opt=441
					make map
					nm ./ft_containers
					break
					;;
				"${vt}")
					echo "${vt}"
					opt=442
					make vec
					nm ./ft_containers
					break
					;;
				"${st}")
					echo "${st}"
					opt=443
					make stk
					nm ./ft_containers
					break
					;;
				"${tt}")
					echo "${tt}"
					opt=444
					make t42
					nm ./ft_containers
					break
					;;
				"${qu}")
					echo "${qu}"
					opt=44
					break 2
					;;
				*)
					echo "Invalid input"
					opt=445
					break
					;;
			esac
		done
	done
	return 0;
}

function select_checkers
{
	while [[ $opt -ne 33 ]]
	do
		./${banner_others_script}
		select chk in ${checkers[@]}
		do
			case $chk in
				"${cl}")
					echo "${cl}"
					opt=331
					make valgrind LKS=1
					break
					;;
				"${cm}")
					echo "${cm}"
					opt=332
					make big_fclean
					make
					make
					make
					make
					make
					make
					break
					;;
				"${ct}")
					echo "${ct}"
					opt=333
					if [[ -f "$tmflog" ]]
					then
						make tmf
					else
						echo "You have to launch the tester for being able to check this file!"
					fi
					break
					;;
				"${cf}")
					opt=334
					select_execs
					break
					;;
				"${qu}")
					echo "${qu}"
					opt=33
					break 2
					;;
				*)
					echo "Invalid input"
					opt=335
					break
					;;
			esac
		done
	done
	return 0
}

if [[ ! -d  "./tests/outputs" ]]
then
	mkdir -p ".tests/outputs/{logs,deepthought}"
fi

while [[ $opt -ne 0 ]]
do
./${banner_script}
	select lvl in ${lvl1[@]}
	do
		case $lvl in
			"${ts}")
				opt=1
				echo "${ts}"
				select_testers
				break
				;;
			"${lg}")
				opt=2
				echo "${lg}"
				select_logs
				break
				;;
			"${ot}")
				opt=3
				echo "${ot}"
				select_checkers
				break
				;;
			"${pu}")
				opt=4
				echo "${pu}"
				make prune
				break 
				;;
			"${qu}")
				opt=0
				echo "${qu}"
				break 2
				;;
			*)
				echo "Invalid input"
				break
		esac
	done
done

