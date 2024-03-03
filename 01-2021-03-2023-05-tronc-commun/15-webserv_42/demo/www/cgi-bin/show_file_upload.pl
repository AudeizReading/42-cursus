#!/usr/bin/perl 

if ($ENV{'REQUEST_METHOD'} eq "POST" && $ENV{'CONTENT_LENGTH'} > 0) 
{
	read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});
	$buffer =~ s/\r\n\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-([a-z0-9]*)\-\-\r\n//g;
	$buffer =~ s/\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-([a-z0-9]*)//g;
	$buffer =~ s/Content-Disposition: ([a-z0-9-\"; .=]+)\r\n//g;
	$buffer =~ s/Content-Type: text\/html\r\n\r\n//g;
	print STDOUT $buffer;
}
