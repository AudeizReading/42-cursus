# toml_parser
This is just my small attempt at a very basic TOML parser, to be used in the 42 School "webserv" project. As such, it doesn't nor will support a lot of TOML features, probably stopping around TOML 0.2.0.

It's my first attempt at making an object oriented parser, I mainly inspired myself from RapidJSON, which I used in another project.

This parser aims to be:
- Header-only.
- Easy to get used to, and to navigate your TOML document with.

It is, however, quite limited by C++98, a restriction placed upon us by the elder gods of programming. They are probably blissfully unaware that C++ has changed a metric tonne in two decades, and I suspect they are themselves stuck in the year 2005. So there are hacks. And bad practices. Deal with it.

The parser resides in two classes:
- The Document class:
	- Takes in the path to a TOML file, and parses it.
	- Can access individual `TOML::Values` with an unprotected `operator[]`, or a protected `at()` method.
	- You can chain these calls to access nested Values.
- The Value class:
	- Represents a key/value pair.
	- The type of the value can be an integer, a floating-point, a boolean, a string, or an array (_TODO:_ Dates).
	- A `Value` can also represent a key group, which can contain other key/value pairs. _TODO:_ nested key groups.
	- A key can never be changed, but a value can. A value's type cannot be changed either.
	- The `Value` class implements an `operator<<` overload, for easier debugging and output. It only outputs the value, not the key. You've got a `key()` method for that.

## Got some more questions?
If you've got some more questions, start by reading the headers. They're actually readable, at least when compared to whatever the hell GNU source code is. The actual implementation code is located in `.ipp` files. Hopefully you don't cringe too much at it.

If, for some reason, you're not one of my webserv teammates and you're reading this, or - god forbid - my code, feel free to give me some feedback on what you think I did wrong or right. I'm still a beginner in C++, and it's a vast, vast land to explore.
