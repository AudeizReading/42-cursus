#!/bin/bash

# Fonction pour convertir un nom de variable en camelCase
convert_to_camelcase() {
  local input="$1"
  # Diviser par les underscores, mettre en minuscules sauf pour la première lettre des mots suivants
  echo "$input" | awk -F'_' '{ 
    for (i=1; i<=NF; i++) {
      if (i == 1) printf tolower($i)
      else printf toupper(substr($i, 1, 1)) tolower(substr($i, 2))
    }
    printf "\n"
  }'
}

# Liste des variables d'environnement à récupérer
env_variables=("FRONTEND_URL")

# Nom du fichier de sortie
output_file="src/environments/environment.production.ts"

# Début du fichier TypeScript
echo "export const environment = {" > "$output_file"

# Boucle sur chaque variable d'environnement
for var_name in "${env_variables[@]}"; do
  # Récupérer la valeur de la variable d'environnement
  value=$(printenv "$var_name")
  if [[ -n "$value" ]]; then
    # Convertir le nom en camelCase
    camel_case_key=$(convert_to_camelcase "$var_name")
    # Ajouter au fichier TypeScript
    echo -e "\t$camel_case_key: '$value'," >> "$output_file"
  else
    echo "⚠️  Variable d'environnement non définie : $var_name"
  fi
done

# Fin du fichier TypeScript
echo "};" >> "$output_file"

echo "✅ Fichier '$output_file' généré avec succès."