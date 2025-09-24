- Realmente necesitamos identity center management?
- CI/CD -> for sure! -> GH ACTIONS. step para agregar pulumi al runner, o capaz el runner ya 
  viene con pulumi
- agregar lint, ts check, etc....
- como manejar secretos del stack en ci/cd?, necesitamos -y para todos los comandos, capaz 
  existe una env var
- migrar todo a un repo de gm2dev
- lint para yaml files!
- TESTEAR, como agregar awereness de los recursos gratuitos de aws?


---

CRITICS:

Se necesita habilitar Budgets
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
