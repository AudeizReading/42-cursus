#!/usr/bin/perl 

read(STDIN, $buffer, $ENV{'CONTENT_LENGTH'});

print STDOUT $buffer;
