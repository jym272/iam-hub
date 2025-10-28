### Recursos creados a "mano"

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
aws iam create-login-profile --user-name jorge-clavijo --password "YourPassword123" --password-reset-required
{
    "LoginProfile": {
        "UserName": "jorge-clavijo",
        "CreateDate": "2025-09-25T01:56:29+00:00",
        "PasswordResetRequired": true
    }
}
```

### State de pulumi

Se crea un bucket no público para el state de pulumi.

```shell
# Se revisa que la config de default creé un bucket no público.
aws s3 mb s3://gm2dev-pulumi-state
```

### Pulumi

```shell
# Inicializar proyecto
pulumi login s3://gm2dev-pulumi-state
# Inicializar stack
pulumi stack init dev

# Configure AWS KMS for secrets encryption (no passphrase needed!)
# Note: KMS key is created automatically by the Pulumi code
# After first deployment, switch to KMS with:
# pulumi stack change-secrets-provider "awskms://alias/pulumi-secrets?region=sa-east-1"

# Preview (no passphrase needed with KMS)
pulumi preview
# Deploy
pulumi up
# Get user credentials (access keys and secrets), tiene que es
pulumi stack output userCredentials --show-secrets --json

# Get console access (temporary passwords for AWS console login)
pulumi stack output consoleAccess --show-secrets --json
# Get all stack outputs
pulumi stack output --json
# Destroy
pulumi destroy
# destroy stack
pulumi stack rm dev
```
