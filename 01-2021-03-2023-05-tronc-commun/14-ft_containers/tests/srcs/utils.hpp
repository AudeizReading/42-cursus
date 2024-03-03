#pragma once

#include <string>
#include <sstream>
/*template<template<typename K1, typename T1, typename C1, typename A1> class Cont1,
		 template<typename K2, typename T2, typename C2, typename A2> class Cont2,
		 typename K, typename T,  typename C, typename A
		>*/

template<typename T, int row> 
int		get_arr_width(T(&)[row]) {return row;}

template<typename T, int row, int col> 
int		get_arr_width(T(&)[row][col]) {return row;}

template <typename T>
std::string ToString(T tX)
{
    std::ostringstream oStream;
    oStream << tX;
    return oStream.str();
}

template <typename T>
T ToNum(std::string str)
{
    std::istringstream oStream(str);
    T tX = 0;
    oStream >> tX;
    return tX;
}
