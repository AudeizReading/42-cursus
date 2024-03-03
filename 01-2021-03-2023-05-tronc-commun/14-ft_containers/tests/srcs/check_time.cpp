#include <check_time.hpp>
std::ifstream timefile(TIMEFILE, std::ios::in);
std::string	ft_nmspc("FT");
std::string	std_nmspc("STD");
std::string	key_map_tested(" - MAP TESTING");
std::string	key_vec_tested(" - VECTOR TESTING");
std::string	key_stk_tested(" - STACK TESTING");
std::string	key_t42_tested(" - MAIN 42 TESTING");
std::string	times_tested(" // TIMES TESTED");
std::string	total(" - TOTAL");
std::string	total_nb_tests("TOTAL_NB_TESTS");
std::string average_str(" - AVERAGE ");
std::string rate_str(" - RATE ");

std::string	key_nmspc[] = {
	ft_nmspc,
	std_nmspc
};

std::string	key_tests[] = {
	key_map_tested,
	(key_map_tested + times_tested),
	key_stk_tested,
	(key_stk_tested + times_tested),
	key_t42_tested,
	(key_t42_tested + times_tested),
	key_vec_tested,
	(key_vec_tested + times_tested),
	total,
	total_nb_tests
};

std::string av_tests[] = {
	(average_str + key_map_tested),
	(average_str + key_stk_tested),
	(average_str + key_t42_tested),
	(average_str + key_vec_tested),
	(average_str + total)
};

void	fill_map_with_file_values(map_km& m, const key_type& key, const mapped_type& value)
{
	key_type copy_key(key);

	m[copy_key] += value;
	copy_key += times_tested;
	++m[copy_key];
	m[total] += value;
	++m[total_nb_tests];
}

void	collect_datas_from_timefile(map_km& ft_values, map_km& std_values)
{
	std::string	nametest;
	std::string	nmspce;
	std::string	nb_clocks;
	std::string	nb_seconds;
	std::string	msg_end;

	double	clks;

	std::cout.precision(10);
	
	do
	{
		std::getline(timefile, nametest);
		std::getline(timefile, nmspce);
		std::getline(timefile, nb_clocks);
		std::getline(timefile, nb_seconds);
		std::getline(timefile, msg_end);

		clks = ToNum<double>(nb_clocks);

		if (!nametest.empty())
		{
			if (nmspce == "FT")
			{
				fill_map_with_file_values(ft_values, nametest, clks);
			}
			else
			{
				fill_map_with_file_values(std_values, nametest, clks);
			}
		}
	} while (!timefile.eof());
}

void	display_datas(const map_km& m_rate, const map_km& m_aver)
{
	std::cout.precision(4);
	const_iterator	it_rate = m_rate.begin();
	const_iterator	it_rate_end = m_rate.end();
	const_iterator	it_std_av;
	const_iterator	it_ft_av;

	for (; it_rate != it_rate_end; ++it_rate)
	{
		std::string key = it_rate->first.substr(0, it_rate->first.find(" is the most performant: +"));
		if (key.find(ft_nmspc) == std::string::npos)
			key = key.substr(key.find(std_nmspc) + std_nmspc.size());
		else
			key = key.substr(key.find(ft_nmspc) + ft_nmspc.size());
		it_std_av = m_aver.find(std_nmspc + key);
		it_ft_av = m_aver.find(ft_nmspc + key);
		std::cout << it_rate->first << "\033[32m"<< it_rate->second << " \033[0m%\n";
		if (it_std_av != m_aver.end())
		{
			std::cout << "\t" << it_std_av->first << " " << convert_clocks_to_seconds(it_std_av->second) << " s\n";
		}
		if (it_ft_av != m_aver.end())
		{
			std::cout << "\t" << it_ft_av->first << " " << convert_clocks_to_seconds(it_ft_av->second) << " s\n";
		}
		std::cout << "================================================================================\n";
	}
}

void	display_datas(const map_km& m)
{
	const_iterator	it = m.begin();
	const_iterator	ite = m.end();

	std::cout.precision(10);
	for (; it != ite; it++)
	{
		std::cout << "\t" << it->first << "\n" << it->second << "\n";
		std::cout << "================================================================================\n";
	}
}

void	display_datas(const map_km& m, const std::string& nmsp_key, const std::string& test_key, const std::string& cmp_key)
{
	std::string	concat;
	if (!nmsp_key.empty())
		concat += nmsp_key;
	concat += test_key;

	const_iterator	ite = m.end();
	const_iterator	it_find = m.find(concat);

	if (it_find != ite)
		print_associative_iter(it_find);
	if (!cmp_key.empty())
	{
		concat += cmp_key;
		it_find = m.find(concat);
		if (it_find != ite)
			print_associative_iter(it_find);
	}
}

map_km	get_average(map_km& m, const std::string& key_nmsp, const std::string& key_test, const std::string& key_times)
{
	const_iterator	ite = m.end();
	const_iterator	it_find;

	if (key_test == total)
		it_find = m.find(key_test); 
	else
		it_find = m.find(key_nmsp + key_test);

	double average = 0;
	double test_val = 0;
	double times = 0;

	if (it_find != ite) 
	{
		test_val = it_find->second;
	}
	if (key_test != total)
	{
		it_find = m.find(key_nmsp + key_test + key_times);
	}
	else
	{
		it_find = m.find(key_times);
	}
	if (it_find != ite) 
	{
		times = it_find->second;
	}
	average = test_val / times;

	if (!isnan(average))
	{
		std::string	average_key;

		average_key = (key_nmsp + average_str + key_test);
		m[average_key] = average;
	}
	return m;
}

void	set_average(map_km& m, const std::string& key_nmspc)
{
	for (int j = 0; j < get_arr_width(key_tests); ++j)
	{
		if (key_tests[j].find(times_tested) == std::string::npos)
		{
			if (key_tests[j] == total)
				get_average(m, key_nmspc, key_tests[j], key_tests[j + 1]);
			else
				get_average(m, key_nmspc, key_tests[j], times_tested);
		}
	}
}

double	get_rate(double ref_value, double value_to_rate)
{
	return value_to_rate * 100 / ref_value;
}

double	get_percent_evolving(double value)
{
	return value - 100;
}

map_km	send_average(map_km& ft_values, map_km& std_values)
{
	map_km	m_average;
	for (int i = 0; i < get_arr_width(av_tests); ++i)
	{
		iterator	ft_av = ft_values.find((ft_nmspc + av_tests[i]));
		iterator	std_av = std_values.find((std_nmspc + av_tests[i]));

		m_average[ft_av->first] = ft_av->second;
		m_average[std_av->first] = std_av->second;
	}
	return m_average;
}

map_km	set_rate(map_km& ft_values, map_km& std_values)
{
	map_km	m;
	for (int i = 0; i < get_arr_width(av_tests); ++i)
	{
		iterator	ft_av = ft_values.find((ft_nmspc + av_tests[i]));
		iterator	std_av = std_values.find((std_nmspc + av_tests[i]));

		double		ref = 0;
		double		val = 0;
		std::string	key;

		if (ft_av != ft_values.end() && std_av != std_values.end())
		{
			if (ft_av->second > std_av->second)
			{
				ref = std_av->second;
				val = ft_av->second;
				key += std_nmspc;
			}
			else
			{
				ref = ft_av->second;
				val = std_av->second;
				key += ft_nmspc;
			}
			key += av_tests[i];
			key += " is the most performant: +";
		}
		m[key] = get_percent_evolving(get_rate(ref, val));
	}
	return m;
}

double	convert_clocks_to_seconds(const double& clocks)
{
	double	cps = static_cast<double>(CLOCKS_PER_SEC);

	return clocks / cps;
}

int main(void)
{
	if (!timefile.is_open())
	{
		std::cerr << "A problem occurs while opening the general time log file...\n";
		exit(1);
	}

	map_km	ft_values;
	map_km	std_values;
	
	std::cout.precision(10);

	collect_datas_from_timefile(ft_values, std_values);

	set_average(ft_values, ft_nmspc);
	set_average(std_values, std_nmspc);

	map_km m_aver = send_average(ft_values, std_values);
	map_km m_rate = set_rate(ft_values, std_values);

//	display_datas(m_aver);
//	display_datas(m_rate);
	display_datas(ft_values);
	display_datas(std_values);

	display_datas(m_rate, m_aver);
	timefile.close();
	return 0;
}
