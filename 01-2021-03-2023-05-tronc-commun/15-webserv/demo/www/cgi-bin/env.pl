#!/usr/bin/perl

print STDOUT "Content-Type: text/html\r\n";
print STDOUT "\r\n";

print STDOUT "\t\t<span>ENVIRONNEMENT:</span>\r\n";
foreach $env (keys (%ENV))
{
	print STDOUT "\t\t<li><b>$env: </b>".$ENV{$env}."</li>\n";
}
print STDOUT "\t</ul>\r\n";
