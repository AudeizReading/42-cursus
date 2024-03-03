#!/usr/bin/perl 

print $ENV{'SERVER_PROTOCOL'}." 200 OK\r\n";
print STDOUT "Content-Type: text/plain\r\n";
print STDOUT "\r\n";
print STDOUT "Hello world !";
