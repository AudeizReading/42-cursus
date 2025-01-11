#!/bin/bash

# Ce script permet de lire les variables d'environnement d'un fichier .env et de les écrire dans un fichier de configuration frontend.
# Affiche le synopsis du script
synopsis() {
	cat << EOF
Aide à la génération des fichiers de configuration d'environnement frontend d'une application Angular à partir des variables d'environnement d'un fichier .env.

Usage: ${0} [-e <env_file>] [-d] [-p] [-r] [-h]

Options:
	-e <env_file>: Spécifie le chemin vers le fichier .env. Cette option est obligatoire du moment qu'une autre option est utilisée (except -h).
	-d: Génère le fichier de configuration d'environnement de développement
	-p: Génère le fichier de configuration d'environnement de production
	-r: Réinitialise les fichiers de configuration d'environnement de développement et de production, avec des valeurs par défaut vides.
	-h: Affiche ce message d'aide. Ne nécessite pas d'autres options.

Description:
Si aucune option n'est spécifiée, le script demandera à l'utilisateur de saisir les valeurs des variables d'environnement minimales (cf Section Environnement).
L'option -e est obligatoire du moment qu'une autre option est utilisée, sauf pour l'option -h qui s'utilise de façon indépendante. 
L'option -e peut être utilisée seule, sans les options -d, -p ou -r. Dans ce cas, le script générera les fichiers de configuration d'environnement de base, de développement et de production.
Si l'option -e est utilisée sans -d ni -p, le script générera à la fois les fichiers de configuration d'environnement de développement et de production.
Si l'option -r est utilisée, les options -d et -p sont ignorées.

Ces 3 fichiers de configuration sont générés dans le répertoire spécifié par la variable ENV_PATH_FRONT du fichier .env.
Ils peuvent être nécessaires selon le contexte d'exécution de l'application frontend.
Angular se charge de remplacer le fichier d'enfironnement de base avec l'un de ces 2 fichiers, selon le contexte: development ou production. 
Le fichier de base n'a pas pour vocation d'être modifié, il est utilisé comme template pour les fichiers de configuration d'environnement de développement et de production. 
Il peut rester vide de toute variable d'environnement mais il doit exister, sans quoi Angular ne compilera pas le projet. 
Visual Studio Code pourra indiquer que la variable d'environnement n'est pas définie, mais cela n'empêchera pas la compilation du projet. 
Pour ajouter des variables d'environnement, il est recommandé de les ajouter dans le fichier .env et de les générer avec ce script. 
Les fichiers de configuration d'environnement n'ont pas vocation à être modifié à la volée.

Notre CI/CD pipeline utiise à la fois les 2 fichiers de configuration d'environnement de développement et de production:
	- Le fichier de configuration d'environnement de développement est utilisé pour les déploiements lors de la phase de tests unitaires (c'est le serveur de dev qui est utilisé pour les tests par Angular).
	- Le fichier de configuration d'environnement de production est utilisé pour les déploiements sur l'environnement de production lors de la phase de build. Le contexte configuré par défaut au build est production

Environnement:
Les variables d'environnement minimales sont les suivantes 
(seulement quand le script est utilisé en mode interactif):
	- PUBLIC_DOMAIN_BACK: le domaine public du backend
	- PUBLIC_PORT_BACK: le port public du backend
	- ENV_PATH_FRONT: le chemin relatif vers le répertoire des fichiers de configuration frontend

Sécurité:
Il est recommandé de ne pas stocker les fichiers de configuration d'environnement dans un dépôt git. 
Comme ils doivent exister dans le répertoire de travail pour qu'Angular fonctionne, la solution proposée est de remettre à zéro ces fichiers avant tout enregistrement sur le repository. 
Cela permet de ne pas exposer les variables d'environnement sensibles. 
Il faut également ne pas oublier de regénérer ces fichiers dès qu'on sert l'application. 
Le tout, c'est de s'assurer que ces données sensibles ne sont jamais exposées.

Exemples:
${0} -e .env -d -p
${0} -e .env -d
${0} -e .env -p
${0} -e .env -r
${0} -e .env
${0}
EOF
}

warn() {
	echo "\033[33m${1}\033[0m"
}

# Fonction pour lire la valeur d'une variable d'environnement
read_env_var() {
	local value=""
    read -e -p "Veuillez saisir la valeur de ${1} : " value
    echo "${value}"
}

# Fonction pour demander à l'utilisateur de saisir la valeur d'une variable d'environnement jusqu'à ce qu'elle soit valide
# $1 : nom de la variable
ask_env_var_til_valid() {
	local value=""
	while [ -z "${value}" ]; do
		value=$(read_env_var "$1")
	done
	echo "${value}"
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

# Fonction pour extraire le chemin vers le fichier de configuration frontend depuis le fichier .env
# $1 : nom de la variable
# $2 : chemin vers le fichier .env
extract_or_ask_env_variable() {
	local path=$(extract_value "${1}" "${2}")

	if [ -z "$path" ]; then
		warn "La variable ${1} n'est pas définie dans le fichier ${2}. Elle est est nécessaire pour créer le fichier de configuration frontend."
		echo $(ask_env_var_til_valid "${1}")
	else
		echo "${path}"
	fi
} 

# Fonction pour générer le nom du fichier de configuration frontend
# $1 : development ou production
generate_env_filename() {
	if [ "$1" = "development" ] || [ "$1" = "production" ]; then
		echo "environment.$1.ts"
	else
		echo "environment.ts"
	fi
}

# Fonction pour générer le chemin complet du fichier de configuration frontend
# $1 : chemin vers le fichier de configuration frontend
# $2 : development ou production
generate_env_fully_qualified_path() {
	echo "${1}/$(generate_env_filename $2)"
}

# Fonction pour écrire les variables d'environnement dans le fichier de configuration frontend
# $1 : chemin vers le fichier de configuration frontend
write_minimal_env_file() {
	cat > "${1}" <<EOF
export const environment = {
	frontendUrl: '$PUBLIC_DOMAIN_BACK',
	publicDomainBack: '$PUBLIC_DOMAIN_BACK',
	publicPortBack: '$PUBLIC_PORT_BACK',
};
EOF
}

# Fonction pour reset les variables d'environnement dans le fichier de configuration frontend
# $1 : chemin vers le fichier de configuration frontend
reset_env_file() {
	echo "export const environment = {};" > "${1}"
}

convert_to_camelcase() {
    local key="${1}"
    # Convertir en minuscules
    key=$(echo "$key" | tr '[:upper:]' '[:lower:]')
    # Remplacer les underscores par des espaces
    key=${key//_/ }
    # Capitaliser chaque mot
    key=$(echo "$key" | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
    # Supprimer les espaces
    key=${key// /}
    # Mettre la première lettre en minuscule
    key=$(echo "$key" | awk '{ $0=tolower(substr($0,1,1)) substr($0,2); print }')
    echo "$key"
}

# Fonction pour demander à l'utilisateur de saisir les valeurs des variables d'environnement
ask_minimal_configuration() {
	warn "Aucun fichier .env spécifié. Veuillez saisir les valeurs des variables d'environnement."
	FRONTEND_URL=$(ask_env_var_til_valid "FRONTEND_URL")
	# PUBLIC_DOMAIN_BACK=$(ask_env_var_til_valid "PUBLIC_DOMAIN_BACK")
	# PUBLIC_PORT_BACK=$(ask_env_var_til_valid "PUBLIC_PORT_BACK")
	ENV_PATH_FRONT=$(ask_env_var_til_valid "ENV_PATH_FRONT")
	ENV_FILE_FRONT_DEV=$(generate_env_fully_qualified_path "$ENV_PATH_FRONT" "development")
	ENV_FILE_FRONT_PROD=$(generate_env_fully_qualified_path "$ENV_PATH_FRONT" "production")
	ENV_FILE_FRONT=$(generate_env_fully_qualified_path "$ENV_PATH_FRONT")

	write_minimal_env_file "$ENV_FILE_FRONT_DEV"
	write_minimal_env_file "$ENV_FILE_FRONT_PROD"
	write_minimal_env_file "$ENV_FILE_FRONT"
}

# Fonction pour écrire les variables d'environnement dans le fichier de configuration frontend
# $1 : chemin vers le fichier de configuration frontend
# $2 : chemin vers le fichier .env
write_env_file() {
	# Lire le contenu du fichier "${2}" et supprimer les commentaires
	# local env_file_content=$(grep -v -e '^#' -e "^ENV_PATH_FRONT" -e "^ENV_FILE_FRONT" "${2}")
	local env_file_content=$(grep -e "^FRONTEND_URL" "${2}")
	
	# Générer le contenu du fichier "${1}"
	echo "export const environment = {" > "${1}"
	# Boucler sur chaque ligne du fichier .env pour extraire les variables
	local key value
	while IFS='=' read -r key value || [[ -n "$key" ]]; do
  		if [ -n "$key" ] ; then
			key=$(convert_to_camelcase "$key")
    		echo "	$key: '$value'," >> "${1}"
        fi
	done <<< "${env_file_content}"
	echo "};" >> "${1}"
}

# Fonction pour écrire les variables d'environnement dans le fichier de configuration frontend
# $1 : chemin vers le fichier de configuration frontend
# $2 : chemin vers le fichier .env
write_dev_env_config_file() {
	echo "writing development configuration environment file"
	local dev_path=$(generate_env_fully_qualified_path "${1}" "development")
	write_env_file "$dev_path" "${2}"
}
write_prod_env_config_file() {
	echo "writing production configuration environment file"
	local prod_path=$(generate_env_fully_qualified_path "${1}" "production")
	write_env_file "$prod_path" "${2}"
}
write_env_config_file() {
	echo "writing configuration environment file"
	local path=$(generate_env_fully_qualified_path "${1}")
	write_env_file "$path" "${2}"
}

# Vérification si le chemin vers le fichier .env est fourni
if [ $# -eq 0 ]; then
	ask_minimal_configuration
else
	# Parse command line options
	development=false
	production=false
	reset=false
	while getopts ":e:dhpr" opt; do
		case ${opt} in
			e )
				env_file_path=$OPTARG
				;;
			d )
				development=true
				;;
			h )
				synopsis
				exit 0
				;;
			p )
				production=true
				;;
			r )
				reset=true
				;;
			\? )
				warn "Option invalide: $OPTARG"
				exit 1
				;;
			: )
				warn "Option -$OPTARG requiert un argument."
				exit 1
				;;
		esac
	done
	shift $((OPTIND -1))

	if [ -z "${env_file_path}" ]; then
		warn "Le chemin vers le fichier .env est requis."
		exit 1
	fi
	check_env_file "$env_file_path"

	config_path="frontend/src/environments/"
	# config_path=$(extract_or_ask_env_variable "ENV_PATH_FRONT" "$env_file_path")
	export MATCHA_HOSTNAME=$(extract_value "MATCHA_HOSTNAME" "$env_file_path")
	export BACKEND_PROXY_URL=$(extract_value "BACKEND_PROXY_URL" "$env_file_path")
	export FRONTEND_URL=$(extract_value "FRONTEND_URL" "$env_file_path")
	export PUBLIC_PORT_FRONT=$(extract_value "PUBLIC_PORT_FRONT" "$env_file_path")

	if [ "${reset}" = true ]; then
		reset_env_file "$(generate_env_fully_qualified_path "$config_path" "development")"
		reset_env_file "$(generate_env_fully_qualified_path "$config_path" "production")"
		reset_env_file "$(generate_env_fully_qualified_path "$config_path")"
		exit 0
	fi

	if [ "${development}" = true ]; then
		write_dev_env_config_file "$config_path" "$env_file_path"
	fi

	if [ "${production}" = true ]; then
		write_prod_env_config_file "$config_path" "$env_file_path"
	fi

	if [ "${development}" = false ] && [ "${production}" = false ]; then
		write_dev_env_config_file "$config_path" "$env_file_path"
		write_prod_env_config_file "$config_path" "$env_file_path"
	fi
	reset_env_file "$(generate_env_fully_qualified_path "$config_path")"
fi
