- Realmente necesitamos identity center management?
- CI/CD -> for sure! -> GH ACTIONS. step para agregar pulumi al runner, o capaz el runner ya
  viene con pulumi
- agregar lint, ts check, etc....
- como manejar secretos del stack en ci/cd?, necesitamos -y para todos los comandos, capaz
- para las actions: https://www.pulumi.com/registry/packages/aws/installation-configuration/#authenticate-with-webidentity-and-openid-connect-oidc
  existe una env var
- migrar todo a un repo de gm2dev
- lint para yaml files!
- TESTEAR, como agregar awereness de los recursos gratuitos de aws?
- Añadir tags a todo

---

CRITICS:

Compartir este repo.

Habilitar Identity Center en la org?
Se necesita habilitar "Budgets", se tiene que tener instrucciones primero

```text
Diagnostics:
  aws:budgets:Budget (budget-maria-gonzalez):
    error:   sdk-v2/provider2.go:572: sdk.helper_schema: creating Budget (budget-maria-gonzalez): operation error Budgets: CreateBudget, https response error StatusCode: 400, RequestID: d0e0226e-b9de-4adf-b564-4df524269dd0, AccessDeniedException: Account 309237749333 is a linked account. To enable budgets for your account, ask the payer account to enable budgets first.: provider=aws@7.7.0
    error: 1 error occurred:
        * creating Budget (budget-maria-gonzalez): operation error Budgets: CreateBudget, https response error StatusCode: 400, RequestID: d0e0226e-b9de-4adf-b564-4df524269dd0, AccessDeniedException: Account 309237749333 is a linked account. To enable budgets for your account, ask the payer account to enable budgets first.

  aws:budgets:Budget (team-total-budget):
    error:   sdk-v2/provider2.go:572: sdk.helper_schema: creating Budget (team-total-budget): operation error Budgets: CreateBudget, https response error StatusCode: 400, RequestID: 88498e8a-e9d9-4343-a466-0d6cac5c810a, AccessDeniedException: Account 309237749333 is a linked account. To enable budgets for your account, ask the payer account to enable budgets first.: provider=aws@7.7.0
    error: 1 error occurred:
        * creating Budget (team-total-budget): operation error Budgets: CreateBudget, https response error StatusCode: 400, RequestID: 88498e8a-e9d9-4343-a466-0d6cac5c810a, AccessDeniedException: Account 309237749333 is a linked account. To enable budgets for your account, ask the payer account to enable budgets first.

```

- Pensar mejor en agrupar los roles, si bien dividir las policies en "servicios", como ec2,
  parece ideal, realmente no lo es, ya que muchos otros servicios usan ec2, el approach de
  módulos que previenen la creacion de instancias grandes por separado parece correcta.
- Se debería respaldarse en aws managed policies, usar estas en grupos para los users, luego
  cada user individual podría tener policies más específicas.
- Allowed regions no funciona, de todas formas por ahora no se necesita eso?.
- Testar EC2 large instances en ecs
- SE CAMBIA EL APPROACH https://claude.ai/chat/6e3902e5-c4b4-48e7-acd0-7e72589030a3
- Admin, todos, restringo instancias grandes y restringo region. el control sería por VPC, se
  solicita incremento de vpc.
- AGREGAR REGION A LOS USERS/MEMBERS, cada user elige sus regiones!
