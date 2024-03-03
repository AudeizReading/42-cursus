#pragma once

namespace TOML
{

// TODO: Enum of tags (empty structs) for SFINAE ?
enum Type
{
	T_INT,
	T_FLOAT,
	T_BOOL,
	T_STRING,
	T_GROUP,
	T_DATE,
	T_ARRAY,
	T_UNDEF
};

} // namespace TOML
