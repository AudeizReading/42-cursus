#!/bin/bash

install_ssl_mkcert() {
	mkdir -p /etc/ssl/certs && cd /etc/ssl/certs && apt update && apt upgrade -y && apt install -y ca-certificates libnss3-tools curl && curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" && chmod +x mkcert-v*-linux-amd64 && ./mkcert-v*-linux-amd64 --install && ./mkcert-v*-linux-amd64 ${MATCHA_HOSTNAME} localhost 127.0.0.1 ::1 && rm -rf ./mkcert-v*-linux-amd64 && apt remove -y ca-certificates libnss3-tools curl && apt autoremove -y
}

install_ssl_mkcert
echo "✅ Certificats SSL générés avec succès."