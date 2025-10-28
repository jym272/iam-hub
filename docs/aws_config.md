# `aws-config`

Se recomienda copiar esta función en `.bashrc` o `.zshrc`, facilita el cambio de contexto de aws.

```shell
aws-ctx() {
  local filter="${1:-}"
  local contexts=$(aws configure list-profiles)
  local matches
  if [ -n "$filter" ]; then
    matches=$(echo "$contexts" | grep -i "$filter" || true)
    if [ -z "$matches" ]; then
      CONTEXT=$(echo "$contexts" | fzf)
    elif [ $(echo "$matches" | wc -l) -eq 1 ]; then
      CONTEXT=$matches
    else
      CONTEXT=$(echo "$matches" | fzf)
    fi
  else
    CONTEXT=$(echo "$contexts" | fzf)
  fi
  if [ -n "$CONTEXT" ]; then
    export AWS_PROFILE="$CONTEXT"
    echo -e "\e[32mSwitched to profile \e[34m$AWS_PROFILE\e[0m"
  else
    echo -e "\e[33mNo context selected, current context: \e[32m$AWS_PROFILE\e[0m"
    return 1
  fi
}
```

```shell
# Usage: se abrirá un "fzf" para seleccionar el contexto que se encuentre en la lista de `aws configure list-profiles`
aws-ctx
```

### Configuración de `~/.aws/config`

Agregar la siguiente config al archivo de aws, luego en el terminal usar `aws-ctx` para cambiar de
contexto dentro de este proyecto.

```ini
[profile sandbox-gm2dev]
aws_access_key_id = AKIA**************
aws_secret_access_key = ztJb**************************
region = sa-east-1
```

`sandbox-gm2dev` es un nombre sugerido, puede ser cambiado por cualquier otro. La región es importante, la infra por defecto de este
proyecto se encuentra en `sa-east-1`.
