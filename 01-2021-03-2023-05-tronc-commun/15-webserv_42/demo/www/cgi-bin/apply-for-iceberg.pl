#!/usr/bin/perl 

use POSIX;
# --- OU LES CHOSES SERIEUSES DOIVENT SE PASSER --------------------------------
if ($ENV{'REQUEST_METHOD'} eq "POST" ) 
{
	&cgi_print_html_dtd();
	&cgi_print_html_begin();
	&cgi_print_html_head();
	&cgi_print_html_body_begin();
	%_GET = &cgi_parse_request_string($ENV{'QUERY_STRING'});
	&cgi_print_html_double_elt("header", "<h1>Upload result</h1>");
	if ($ENV{'CONTENT_LENGTH'} > 0 && $ENV{'CONTENT_LENGTH'} < 40000000)
	{
		binmode STDIN;

		$len_read = read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});

		if (defined($ARGV[0])) # Means that a boundary key is passed to the cgi script
		{
			$boundary = $ARGV[0];
			warn $buffer;
			if (($buffer =~ $boundary && $buffer =~ /(Content-Type\:\ image\/png|jpeg|jpg\ \n)/))
			{
				my %upload_files = &cgi_parse_body_upload($boundary, "$buffer");
				&cgi_upload_files(%upload_files);
				@filename = keys %upload_files;
				print STDOUT "\t<ul class=\"gallery\">\r\n";
				foreach $name (@filename)
				{
					&cgi_print_html_double_elt("p", "this file has been upload: $name");
					&cgi_print_html_double_elt("li", "<img class=\"img_gallery\" src=\"/upload/$name\"/>"); 
				}
				print STDOUT "\t</ul>\r\n";
				print "<script type=\"text/javascript\">
				function Redirect()
				{
					window.location=\"/\";
				}
				document.write(\"You will be redirected to a new page in 5 seconds\");
				setTimeout('Redirect()', 5000);
				</script>";
			}
			else
			{
				warn "These datas are not allowed to be hosted on the server.";
				exit 1;
			}
		}
		else
		{
			warn "It misses the boundary keys!";
			exit 1;
		}
	}
	else
	{
		warn "The content-length is not legit.";
		exit 1;
	}
	&cgi_print_html_body_end();
	&cgi_print_html_end();
}
elsif ($ENV{'REQUEST_METHOD'} eq "GET")
{
    $buffer = $ENV{'QUERY_STRING'};
	%_GET = &cgi_parse_request_string($ENV{'QUERY_STRING'});

	&cgi_print_html_dtd();
	&cgi_print_html_begin();
	&cgi_print_html_head();
	&cgi_print_html_body_begin();
	&cgi_print_html_double_elt("header", "<h1>Our icebergs' collection</h1>");

	if (defined($ENV{'PATH_INFO'}) || defined($_GET{'path_info'}))
	{
		$directory = "../".$ENV{'PATH_INFO'};
		if (defined($_GET{'path_info'}))
		{
			$directory = "../".$_GET{'path_info'};
		}
		
		$absolute_path = $ENV{'PATH_TRANSLATED'}."cgi-bin/".$_GET{'path_info'};
		opendir(DIRECTORY_FD, $directory) || die "$directory couldn't be opened: $!";
		@FILES = grep(/\.png|jpe?g$/i, readdir DIRECTORY_FD);

		&cgi_print_html_double_elt("h2", @FILES." are booked. Book yours!");

		if (@FILES > 0)
		{
			if (@FILES > 1)
			{
				&cgi_display_useful_links;
			}	
			&cgi_display_files($_GET{'path_info'}, @FILES);
		}
		else
		{
			&cgi_print_html_double_elt("p", "You have to upload a pic before! <a href=\"../upload.html\">Click Here:</a>");
		}
		closedir(DIRECTORY_FD);
		&cgi_display_useful_links;
	}
	else
	{
		warn "The access to the page is forbidden";
		exit 1;
	}
	&cgi_print_html_body_end();
	&cgi_print_html_end();
}
else # other methods that we do not handle
{
	exit 1;
}
# --- OU LES CHOSES SERIEUSES DOIVENT FINIR DE SE PASSER -----------------------
# parse the body of an upload "POST" request
# cgi_parse_body_upload($boundary, $buffer_stdin);
sub	cgi_parse_body_upload
{
	my ($bound, $raw_datas) = @_;

	my (@body_datas) = split("--$bound", $raw_datas);
	my $body_datas_size = $#body_datas + 1;

	# Les filename + les datas y correspondant sont dans body_datas[1] à body_datas[nb_upload]
	# body_datas[0] ne contiendrait que des \0 (je ne sais pas pq)
	# body_datas[$#body_datas - 1] contient les datas concernant l'input submit
	# body_datas[$#body_datas] contient --
	# taille minimale attendue si ce schema est respecté: 4
	if ($body_datas_size > 3)
	{
		my $nb_upload = $body_datas_size - 3;
		my (%files_data);

		for (my $i = 1; $i <= $nb_upload; ++$i)
		{
			my ($post_form_attributes, $file_datas) = split(/\r\n\r\n/, $body_datas[$i]);
			my (@form_attr) = split(/[=;:"']/, $post_form_attributes);
			$form_attr[8] =~ tr/ /-/;
			$files_data{$form_attr[8]} = $file_datas;
		}
		return %files_data;
	}
	else
	{
		&cgi_print_html_double_elt("p", "There is a pb with the upload arguments");
	}
}

sub cgi_upload_files
{
	my (%upload_files) = @_;

	foreach $filename (keys %upload_files)
	{
		if ($filename =~ "/")
		{
			my (@comps) = split(/\//, $filename);
			$filename=$comps[$#comps];
		}
		open(UPLOAD_FILE, ">:raw", "../upload/$filename") || die "$filename couldn't be opened: $!";
		binmode UPLOAD_FILE;
		print UPLOAD_FILE $upload_files{$filename} || (close UPLOAD_FILE && unlink "../upload/$filename" && die "$filename couldn't be written: $!");
		close UPLOAD_FILE;
	}
}

# split by & and =, put this in a sort of map
# works with GET and also POST and ENV
sub cgi_parse_request_string
{
	my (@pairs, $pair, $name, $value, %form, $arg);

	($arg) = @_;
	@pairs = split(/&/, $arg);

	foreach $pair (@pairs) 
	{
		($name, $value) = split(/=/, $pair);
		$value =~ tr/+/ /;
		$value =~ s/%(..)/pack("C", hex($1))/eg;
		$form{$name} = $value;
	}
	%form;
}

sub cgi_print_html_dtd
{
	print STDOUT "<!DOCTYPE html>\r\n";
}

sub cgi_print_html_begin
{
	print STDOUT "<html lang=\"fr\">\r\n";
}

sub cgi_print_html_head
{
	print STDOUT "<head>\r\n";
	print STDOUT "\t<meta charset=\"UTF-8\">\r\n";
	print STDOUT "\t<title>$ENV{'REQUEST_METHOD'}</title>\r\n";
	print STDOUT "<link href=\"../main-style.css\" rel=\"stylesheet\" type=\"text/css\">"; # maybe the link could vary
	print STDOUT "<link href=\"http://fonts.cdnfonts.com/css/iceberg\" rel=\"stylesheet\">";
	print STDOUT "<script src=\"https://kit.fontawesome.com/dedab4d2ca.js\" crossorigin=\"anonymous\"></script>";
	print STDOUT "</head>\r\n";
}

sub cgi_print_html_body_begin
{
	print STDOUT "<body>\r\n";
}

sub cgi_print_html_end
{
	print STDOUT "</html>\r\n";
}

sub cgi_print_html_body_end
{
	print STDOUT "</body>\r\n";
}

sub cgi_print_html_double_elt
{
	my ($elt, $value) = @_;

	print STDOUT "<".$elt.">".$value."</".$elt.">\r\n";
}

sub cgi_print_html_input_submit
{
	my ($value) = @_;

	print "<p>";
	print "<input type=\"submit\" name=\"submit\" value=\"$value\" />";
	print "</p>";
}

sub cgi_delete_request_javascript
{
	my ($i, $path_info, $file) = @_;

	print "<script>\r\n";
	print "document.getElementById('delete-form$i').addEventListener('submit', function (event) {\r\n";
	print "		fetch(\"$path_info/$file\", { method: 'DELETE' }).then(response => response.text()).then(() => {document.getElementById('output').textContent = \"$file has been deleted\";location.reload();});\r\n";
	print "		event.preventDefault();\r\n";
	print "});\r\n";
	print "</script>\r\n";

}

sub cgi_add_cookie_javascript
{
	my ($i, $path_info, $file) = @_;

	print "<script>\r\n";
	print "document.querySelectorAll('.img_gallery').forEach(function(elem) {\r\n";
	print "		elem.addEventListener('click', function (event) {\r\n";
	print "			let expires = new Date(+new Date() + 30*24*60*60*1000).toUTCString();\r\n";
	print "			document.cookie = `my-iceberg=\${event.target.src}; expires=\${expires}; path=/`;\r\n";
	print "			window.location = '/';\r\n";
	print "			event.preventDefault();\r\n";
	print "		});\r\n";
	print "});\r\n";
	print "</script>\r\n";

}

sub cgi_display_files
{
	my ($path_info, @files) = @_;
	my $i = 0;

	print STDOUT "\t<ul class=\"gallery\">\r\n";
	foreach $file (@files)
	{
		# ici mettre path /upload/$file pour que ca route derriere le cgi
		&cgi_print_html_double_elt("li", "<img class=\"img_gallery clickable\" src=\"$path_info/$file\"/>"); 

		print "<form class=\"delete-form\" id=\"delete-form$i\" method=\"DELETE\" action=\"#\" enctype=\"multipart/form-data\" alt=\"Deletion files(s)\">";
		&cgi_print_html_double_elt("p", "<input type=\"hidden\" name=\"path_info\" filename=\"$path_info/$file\" value=\"/upload\"/>"); 
		&cgi_print_html_input_submit("Delete an Iceberg");

		# where the javascript sinppet displays its output
		print "<pre id=\"output\" style=\"max-height:300px;\">";
		print "</pre>";
		print "</form>";

		&cgi_delete_request_javascript($i, $path_info, $file);
		++$i;
	}

	&cgi_add_cookie_javascript($i, $path_info, $file);

	print STDOUT "\t</ul>\r\n";
}

sub cgi_display_useful_links
{
	print STDOUT "\t<div class=\"form_container\"><ul>\r\n";
	&cgi_print_html_double_elt("li", "Come back at index.html? <a href=\"../index.html\">Click Here:</a>");
	&cgi_print_html_double_elt("li", "Book another iceberg? <a href=\"../upload.html\">Click Here:</a>");
	print STDOUT "\t</ul></div>\r\n";
}
