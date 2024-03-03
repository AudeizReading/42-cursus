#!/usr/bin/perl 

# Example: Send a full custom header
print "HTTP/1.1 302 Found\r\n";
if ($ENV{'COOKIE'} =~ m/:[0-9]{2,4}\/upload\/([A-Z0-9_.-]+\.(?:png|jpg|jpeg))(;|$)/i && -s "../upload/$1")
{
	print "Location: /upload/$1\r\n";
}
else
{
	print "Location: /img/issberg.png\r\n";
}
print "\r\n";

