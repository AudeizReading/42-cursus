#!/bin/bash
#
# Need 3 args:
# $1 = path where setting the ssl elements
# $2 = root name of the ssl elements
# $3 = fqdn qualified name to set. mandatory ssl args
#
# ./.autosigned-cert-ssl.sh path name fqdn
#

SSL_PATH=${1}
NAME=${2}
SSL_KEY=${SSL_PATH}/${NAME}.key
SSL_CSR=${SSL_PATH}/${NAME}.csr
SSL_CRT=${SSL_PATH}/${NAME}.crt
SSL_DER=${SSL_PATH}/${NAME}.der
FQDN=${3}

mkdir -p ${SSL_PATH}
openssl genrsa -out ${SSL_KEY} 4096
openssl req -nodes -new -key ${SSL_KEY} -subj "/CN=${FQDN}/" -out ${SSL_CSR}
openssl x509 -req -days 3650 -in ${SSL_CSR} -signkey ${SSL_KEY} -out ${SSL_CRT}
openssl x509 -in ${SSL_CRT} -out ${SSL_DER} -outform DER
