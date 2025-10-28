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
```

### Pulumi

```shell
# Inicializar proyecto
pulumi login s3://gm2dev-pulumi-state
# Revisar cambios
pulumi preview
# Deployar
pulumi up
# Revisar outputs
# Get user credentials (access keys and secrets), tiene que es
pulumi stack output userCredentials --show-secrets --json
# Get console access (temporary passwords for AWS console login)
pulumi stack output consoleAccess --show-secrets --json
# Get all stack outputs
pulumi stack output --json
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
