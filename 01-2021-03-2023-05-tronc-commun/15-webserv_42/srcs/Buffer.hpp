#ifndef BUFFER_HPP
# define BUFFER_HPP
# include <iostream>
# include <string>
# include <cstdlib>
# include <map>

class Buffer {
	public:
		typedef std::map<std::string, std::string>			map_ss;

	private:
		const char				*_raw;
		std::string				_obfuscated;
		size_t					_raw_size;

	public:
		Buffer(const char* buffer = 0, const size_t buffer_size = 0);
		Buffer(const Buffer &src);
		~Buffer(void);
		Buffer & operator=(const Buffer &src);

		const char*				get_raw()										const;
		const char*				get_raw(const size_t size)						const;
		unsigned char*			get_body(const size_t content_length)			const;
		std::string				get_body()										const;
		unsigned char*			get_header()									const;
		const std::string		get_obf()										const;
		size_t					get_raw_size()									const;
		size_t					get_obf_size()									const;
		unsigned long			get_header_size()								const;
		unsigned long			get_body_size()									const;

		void					print_raw_to_int(const size_t content_length)	const;
		void					print_raw()										const;
		void					print_raw(const size_t size)					const;
		void					print_obf()										const;
		void					print_header()									const;

		bool					has_post_request(const std::string& method)		const;
		bool					has_upload_request(map_ss& header, const std::string& method) const;
};
#endif
