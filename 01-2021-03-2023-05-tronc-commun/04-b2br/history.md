If you just go there in order to take my history, please consider you have done the wrong choice of cheating.
Do not be foolish and ask your mates some help

```sh
lsblk
apt update
apt upgrade
apt install sudo
apt install vim
apt install ufw
apt install libpam-cracklib
apt install sysstat 
update-alternatives --config editor
addgroup user42
vim /etc/vim/vimrc
cp /etc/vim/vimrc /home/alellouc/.vimrc
vim /etc/bash.bashrc 
cp /etc/bash.bashrc /home/alellouc/.bashrc
vim /home/alellouc/.bashrc 
systemctl reboot
addgroup alellouc sudo
addgroup alellouc user42
vim /etc/adduser.conf 
mkdir -p /var/log/sudo
touch /var/log/sudo/sudo.log
visudo
visudo -c
ufw enable
ufw logging on
ufw allow 4242
ufw status verbose
systemctl status ssh
vim /etc/ssh/sshd_config 
/etc/init.d/ssh restart
vim /etc/pam.d/common-password 
vim /etc/login.defs 
chage -M30 -m2 -W7 alellouc
chage -M30 -m2 -W7 root
vim /home/alellouc/monitoring.sh 
crontab -e

# Bonus Part
apt install lighttpd php7.3 php7.3-fpm php7.3-mysql php7.3-cli php7.3-curl php7.3-xml php-json php-zip php-mbstring php-gd php-intl php-cgi mariadb-server
systemctl enable lighttpd
systemctl status lighttpd
service lighttpd start
ufw allow 80
vim /etc/php/7.3/fpm/pool.d/www.conf 
vim /etc/lighttpd/conf-available/15-fastcgi-php.conf 
vim /etc/php/7.3/fpm/php.ini 
echo -ne "<?php\nphpinfo()\n?>" > /var/www/html/test.php
lighty-enable-mod fastcgi
lighty-enable-mod fastcgi-php
service lighttpd force-reload
systemctl restart lighttpd
systemctl restart php7.3-fpm
mysql_secure_installation 
systemctl status mariadb
systemctl restart mariadb
ufw allow 3306
cd /var/www/html/
wget https://files.phpmyadmin.net/phpMyAdmin/5.1.1/phpMyAdmin-5.1.1-all-languages.tar.gz
tar -xvzf phpMyAdmin-5.1.1-all-languages.tar.gz 
rm -rf phpMyAdmin-5.1.1-all-languages.tar.gz 
mv phpMyAdmin-5.1.1-all-languages/ phpmyadmin
mysql -p
vim /etc/mysql/mariadb.conf.d/50-server.cnf 
systemctl restart mariadb
cd /tmp
wget -c https://fr.wordpress.org/latest-fr_FR.tar.gz
tar -xvzf latest-fr_FR.tar.gz 
mv wordpress /var/www/html/wordpress.b2br
rm -fr latest-fr_FR.tar.gz 
cd /var/www/html/
chown www-data:www-data -R wordpress.b2br/
```
