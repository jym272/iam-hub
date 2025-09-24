# infra

To install dependencies:

```bash
bun install
# install pulumi
brew install pulumi
# usar mise.toml -> correcto contexto de aws
brew install mise
```


### Recursos creados a "mano"
*<small>primero la trampa, después el queso</small>*

- La activación de identity center en la región de us-east-2

- Cuenta **admin** para `jorge.clavijo@gm2dev.com`:

```shell
aws iam create-user --user-name jorge-clavijo

{
    "User": {
        "Path": "/",
        "UserName": "jorge-clavijo",
        "UserId": "AIDAUQAABSZKQJRJ2YOCD",
        "Arn": "arn:aws:iam::309237749333:user/jorge-clavijo",
        "CreateDate": "2025-09-23T23:16:42+00:00"
    }
}


aws iam attach-user-policy --user-name jorge-clavijo --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
{
    "AccessKey": {
        "UserName": "jorge-clavijo",
        "AccessKeyId": "AKIAXXXXXXXXXXXXXXXX",
        "Status": "Active",
        "SecretAccessKey": "ztJbToXXXXXXXXXXXXXXXXX",
        "CreateDate": "2025-09-23T23:21:36+00:00"
    }
}
```

State de pulumi 

```shell
# Se revisa que la config de default creé un bucket no público.
aws s3 mb s3://gm2dev-pulumi-state
```

### Pulumi

```shell
# Inicializar proyecto
pulumi login s3://gm2dev-pulumi-state
# Inicializar stack, se usa passphrase "gm2dev" -> TODO: mejorar esto, es secreto de secretos!
pulumi stack init dev
# Deploy
pulumi up
``` 
