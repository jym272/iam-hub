```
           ╔═══════════════════════════════════════════════════╗
           ║                                                   ║
            ██████╗ ███╗   ███╗██████╗ ██████╗ ███████╗██╗   ██╗
           ██╔════╝ ████╗ ████║╚════██╗██╔══██╗██╔════╝██║   ██║
           ██║  ███╗██╔████╔██║ █████╔╝██║  ██║█████╗  ██║   ██║
           ██║   ██║██║╚██╔╝██║██╔═══╝ ██║  ██║██╔══╝  ╚██╗ ██╔╝
           ╚██████╔╝██║ ╚═╝ ██║███████╗██████╔╝███████╗ ╚████╔╝
            ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═════╝ ╚══════╝  ╚═══╝ ║
           ║                                                   ║
           ║  🚀 Budget Control Infrastructure - Pulumi + AWS  ║
           ║                                                   ║
           ╚═══════════════════════════════════════════════════╝
```

`console`: https://309237749333.signin.aws.amazon.com/console

`dep`

- Node.js 23.6.0 or later.
- bun

To install dependencies:

```bash
bun install
# install pulumi
brew install pulumi
# KLAVE -> usar mise.toml -> correcto contexto de aws
brew install mise
```

### Recursos creados a "mano"

_<small>primero la trampa, después el queso</small>_

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

State de pulumi, se usa un bucket

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

# Type check
bun run type-check

# Preview (no passphrase needed with KMS)
pulumi preview
# Deploy
pulumi up
# Get user credentials (access keys and secrets)
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

#### Secrets Provider: AWS KMS

This project uses **AWS KMS** for secrets encryption instead of a passphrase. Benefits:

- ✅ No passphrase to remember or store
- ✅ IAM-based access control
- ✅ Automatic key rotation enabled
- ✅ Better security for production

The KMS key (`alias/pulumi-secrets`) is created automatically by the infrastructure code.

### Password Policy

The infrastructure creates an account password policy with the following requirements:

- Minimum 8 characters
- Must contain uppercase letters
- Must contain lowercase letters
- Must contain numbers
- Special characters are NOT required (user-friendly)
- Users can change their own passwords
- Password expires after 90 days
- Cannot reuse last 3 passwords

When changing from temporary password, use something like: `MyPassword123`
