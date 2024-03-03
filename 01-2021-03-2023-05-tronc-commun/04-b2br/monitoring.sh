#!/bin/bash
architecture=$(uname -a)
nb_physical_cpu=$(nproc --all)
nb_logical_cpu=$(lscpu | grep ^Processeur | awk '{print $2}')
#memory_free=$(free -ht | grep Total | awk '{print $4}')
memory_free=$(free -h | awk 'NR == 2{print $NF}')
#memory_total=$(free -ht | grep Total | awk '{print $2}')
memory_total=$(free -h | awk 'NR == 2{print $2}')
#memory_percent=$(free -t | grep Total | awk '{printf("%.2f%%", ($3 * 100) / $2)}')
memory_percent=$(free | awk 'NR == 2{printf("%.2f%%", ($3 * 100) / $2)}')
disk_total=$(df -h --total | grep total | awk '{print $2}')
disk_free=$(df -h --total | grep total | awk '{print $4}')
disk_percent=$(df -h --total | grep total | awk '{print $5}')
last_reboot=$(who -b | cut -f12- -d\ )
lvm_state="no"
if [ `/usr/sbin/lvscan | grep -ci active` -gt 0 ]; then
	lvm_state="yes"
fi
active_connexions=$(ss | grep tcp | grep -c EST*)
nb_users=$(who | wc -l)
cpu_load=$(iostat | awk 'NR == 4 {gsub(",","."); printf("%.2f%%", 100 - $NF)}')
ip=$(hostname -I)
mac=$(ip -f link addr | grep ether | cut -f6 -d\ )
nb_sudo_cmd=$(grep -c COMMAND /var/log/sudo/sudo.log)

echo -e "\t<Architecture>\t\t${architecture}" 2>/dev/null
echo -e "\t<CPU Physical>\t\t${nb_physical_cpu}" 2>/dev/null
echo -e "\t<CPU Logical>\t\t${nb_logical_cpu}" 2>/dev/null
echo -e "\t<Memory Usage>\t\t${memory_free} / ${memory_total} (${memory_percent})" 2>/dev/null
echo -e "\t<Disk Usage>\t\t${disk_free} / ${disk_total} (${disk_percent})" 2>/dev/null
echo -e "\t<CPU load>\t\t${cpu_load}" 2>/dev/null
echo -e "\t<Last boot>\t\t${last_reboot}" 2>/dev/null
echo -e "\t<Lvm use>\t\t${lvm_state} (`/usr/sbin/lvscan | grep -ci active`)" 2>/dev/null
echo -e "\t<Connexions TCP>\t${active_connexions} ESTABLISHED" 2>/dev/null
echo -e "\t<User log>\t\t${nb_users}" 2>/dev/null
echo -e "\t<Network>\t\tIP ${ip} (${mac})" 2>/dev/null
echo -e "\t<Sudo>\t\t\t${nb_sudo_cmd} cmd" 2>/dev/null
