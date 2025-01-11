#! /bin/bash

synopsis() {
	cat << EOF
Usage: ${0} env_file

This script is used to generate the proxy.conf.json file for the frontend, based on the environment variables PUBLIC_DOMAIN_BACK and PUBLIC_PORT_BACK.
EOF
}

# Fonction pour vérifier si le fichier existe
# $1 : chemin vers le fichier
check_env_file() {
	if [ ! -f "${1}" ]; then
		warn "Le fichier ${1} n'existe pas."
		exit 1
	fi
}

# Fonction pour extraire la valeur d'une variable d'environnement
# $1 : nom de la variable
# $2 : chemin vers le fichier .env
extract_value() {
	echo $(grep "^${1}" "${2}" | cut -d '=' -f 2)
}

# Fonction pour générer le nom du fichier de configuration frontend
generate_proxy_config_filename() {
	echo "proxy.conf.mjs"
}

# Fonction pour générer le chemin complet du fichier de configuration frontend
# $1 : chemin vers le fichier de configuration frontend
generate_env_fully_qualified_path() {
	echo "${1}/$(generate_proxy_config_filename)"
}

# Fonction pour écrire le fichier de configuration proxy.conf.json
# $1 : chemin vers le fichier .env
write_proxy_config_file() {
	check_env_file "${1}"
	local filename=$(generate_env_fully_qualified_path "src/")
	cat > "${filename}" <<EOF
export default [
	{
		context: ['/socket.io'],
		target: 'ws://localhost:3000',
		ws: true,
		loglevel: 'debug',
		secure: false,
	},
	{
		context: ['/api'],
		target: 'http://localhost:3000',
		secure: false,
		loglevel: 'debug',
	},
];
EOF
}

write_ssl_cert_file() {
	./setup_ssl_with_mkcert.sh
}

if [ "$#" -ne 1 ]; then
	synopsis
	exit 1
fi

write_proxy_config_file "${1}"
write_ssl_cert_file
