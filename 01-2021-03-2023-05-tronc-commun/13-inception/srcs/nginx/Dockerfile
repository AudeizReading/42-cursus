# nginx Dockerfile

# As allowed, taking the debian:buster image already existing
# I do not know how to build an OS like this without this option, maybe by
# looking at the Dockerfile of the debian image, but I only doubt that is the
# purpose of the subject
FROM	debian:buster

ARG		FQDN
ARG		MAINTAINER
ARG		SSL_PATH

LABEL	maintainer $MAINTAINER

# Downloading nginx pnd ssl ackages
RUN		apt-get update -yq \
		&& apt-get install -y -q \
			perl \
			ca-certificates \
			nginx-full \
			openssl

# Copying script for generating ssl key. Run the script before
# deleting it (no more need)
COPY	/tools/autosigned-cert-ssl.sh /tmp/autosigned-cert-ssl.sh

RUN		cd /tmp \
		&& ./autosigned-cert-ssl.sh $SSL_PATH inception $FQDN \
		&& rm -rf ./autosigned-cert-ssl.sh
		
# Copying config files needed for the well nginx running
# Intercepts 443 traffic
COPY	/conf/nginx.conf			/etc/nginx/nginx.conf
COPY	/conf/alellouc.42.fr.conf	/etc/nginx/conf.d/alellouc.42.fr.conf

# Launching nginx
ENTRYPOINT	["nginx"]
CMD			["-g", "daemon off;"]
