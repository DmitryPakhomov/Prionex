# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toolshop.spec.ts >> PAY-05 API rejects an unsupported payment method
- Location: tests\toolshop.spec.ts:182:1

# Error details

```
Error: {"message":"Payment was successful"}

expect(received).toContain(expected) // indexOf

Expected value: 200
Received array: [400, 422]
```

# Test source

```ts
  86  |   const password = `Qa!${randomUUID().slice(0, 20)}`;
  87  |   const registration = await request.post(`${api}/users/register`, {
  88  |     data: { first_name: 'Taylor', last_name: 'Smith', email, password, dob: '1990-01-01', phone: '6175550123', ...address },
  89  |   });
  90  |   expect(registration.status(), await registration.text()).toBe(201);
  91  |   return { email, password };
  92  | }
  93  | 
  94  | async function submitCheckoutLogin(page: Page, email: string, password: string) {
  95  |   await page.getByTestId('proceed-1').click();
  96  |   await page.getByTestId('email').fill(email);
  97  |   await page.getByTestId('password').fill(password);
  98  |   const [response] = await Promise.all([
  99  |     page.waitForResponse(r => new URL(r.url()).pathname === '/users/login' && r.request().method() === 'POST'),
  100 |     page.getByTestId('login-submit').click(),
  101 |   ]);
  102 |   return response;
  103 | }
  104 | 
  105 | test('CART-03 removes the last item', { tag: '@BUG-005' }, async ({ page, request }) => {
  106 |   await addProduct(page, request);
  107 |   await page.locator('tr').filter({ has: page.getByTestId('product-title') }).locator('a:has(.fa-remove)').click();
  108 |   await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();
  109 |   await expect(page.getByTestId('product-title')).toHaveCount(0);
  110 |   await expect(page.getByTestId('proceed-1')).toBeHidden();
  111 | });
  112 | 
  113 | test('AUTH-02 invalid password blocks checkout and preserves cart', async ({ page, request }) => {
  114 |   const { email, password } = await registerCustomer(request);
  115 |   const product = await addProduct(page, request);
  116 |   const login = await submitCheckoutLogin(page, email, `${password}x`);
  117 |   expect(login.status()).toBe(401);
  118 |   await expect(page.getByText('Invalid email or password')).toBeVisible();
  119 |   await expect(page.getByTestId('proceed-2')).toBeHidden();
  120 |   await expect(page.getByTestId('address')).toBeHidden();
  121 |   await page.reload();
  122 |   await expect(page.getByTestId('product-title')).toHaveText(product.name);
  123 |   await expect(page.getByTestId('product-quantity')).toHaveValue('1');
  124 | });
  125 | 
  126 | test('ORD-02 missing address blocks payment', async ({ page, request }) => {
  127 |   const { email, password } = await registerCustomer(request);
  128 |   await addProduct(page, request);
  129 |   expect((await submitCheckoutLogin(page, email, password)).ok()).toBeTruthy();
  130 |   await page.getByTestId('proceed-2').click();
  131 |   for (const [field, value] of Object.entries(address)) {
  132 |     await page.getByTestId(field).fill(value);
  133 |   }
  134 |   await expect(page.getByTestId('proceed-3')).toBeEnabled();
  135 |   await page.getByTestId('address').clear();
  136 |   await page.getByTestId('address').press('Tab');
  137 |   await expect(page.getByTestId('proceed-3')).toBeDisabled();
  138 |   await expect(page.getByTestId('payment-method')).toBeHidden();
  139 | });
  140 | 
  141 | test('ORD-01 guest signs in and confirms cash on delivery', { tag: '@BUG-003' }, async ({ page, request }) => {
  142 |   const { email, password } = await registerCustomer(request);
  143 |   const product = await addProduct(page, request);
  144 |   expect((await submitCheckoutLogin(page, email, password)).ok()).toBeTruthy();
  145 |   await page.getByTestId('proceed-2').click();
  146 |   for (const [field, value] of Object.entries(address)) {
  147 |     await page.getByTestId(field).fill(value);
  148 |   }
  149 |   await page.getByTestId('proceed-3').click();
  150 |   await page.getByTestId('payment-method').selectOption({ label: 'Cash on Delivery' });
  151 |   await expect(page.getByTestId('finish')).toBeEnabled();
  152 |   const [response] = await Promise.all([
  153 |     page.waitForResponse(r => new URL(r.url()).pathname === '/invoices' && r.request().method() === 'POST', { timeout: 8000 }),
  154 |     page.getByTestId('finish').click({ timeout: 8000 }),
  155 |   ]);
  156 |   expect(response.ok(), await response.text()).toBeTruthy();
  157 |   const saved = await response.json();
  158 |   expect(saved.invoice_number).toBeTruthy();
  159 |   expect(response.request().postDataJSON().invoice_items).toEqual([
  160 |     expect.objectContaining({ product_id: product.id, quantity: 1, unit_price: Number(product.price) }),
  161 |   ]);
  162 |   expect(Number(saved.total)).toBe(Number(product.price));
  163 |   const auth = await request.post(`${api}/users/login`, { data: { email, password } });
  164 |   expect(auth.ok()).toBeTruthy();
  165 |   const { access_token } = await auth.json();
  166 |   const detail = await request.get(`${api}/invoices/${saved.id}`, { headers: { Authorization: `Bearer ${access_token}` } });
  167 |   expect(detail.status()).toBe(200);
  168 |   const persisted = await detail.json();
  169 |   expect(persisted.invoice_number).toBe(saved.invoice_number);
  170 |   expect(persisted.user_id).toBe(saved.user_id);
  171 |   expect(Number(persisted.total)).toBe(Number(product.price));
  172 |   expect(persisted.invoicelines.map(item => ({ product_id: item.product_id, quantity: Number(item.quantity), unit_price: Number(item.unit_price) }))).toEqual([{ product_id: product.id, quantity: 1, unit_price: Number(product.price) }]);
  173 |   await expect(page.locator('#invoice-number')).toHaveText(String(saved.invoice_number));
  174 |   await page.goto('/#/checkout');
  175 |   await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();
  176 |   await page.reload();
  177 |   await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();
  178 |   await expect(page.getByTestId('proceed-1')).toBeHidden();
  179 |   await expect(page.getByTestId('product-title')).toHaveCount(0);
  180 | });
  181 | 
  182 | test('PAY-05 API rejects an unsupported payment method', { tag: '@BUG-004' }, async ({ request }) => {
  183 |   const response = await request.post(`${api}/payment/check`, {
  184 |     data: { method: 'unsupported-payment-method' },
  185 |   });
> 186 |   expect([400, 422], await response.text()).toContain(response.status());
      |                                             ^ Error: {"message":"Payment was successful"}
  187 | });
  188 | 
  189 | async function paymentStep(page: Page, request: APIRequestContext) {
  190 |   const customer = await registerCustomer(request);
  191 |   await addProduct(page, request);
  192 |   expect((await submitCheckoutLogin(page, customer.email, customer.password)).ok()).toBeTruthy();
  193 |   await page.getByTestId('proceed-2').click();
  194 |   for (const [field, value] of Object.entries(address)) await page.getByTestId(field).fill(value);
  195 |   await page.getByTestId('proceed-3').click();
  196 | }
  197 | 
  198 | test('PAY-03 installment options are 3 6 9 12', { tag: '@BUG-006' }, async ({ page, request }) => {
  199 |   await paymentStep(page, request);
  200 |   await page.getByTestId('payment-method').selectOption({ label: 'Buy Now Pay Later' });
  201 |   await expect(page.getByText('Monthly installments', { exact: false })).toBeVisible();
  202 |   await expect(page.locator('select').filter({ has: page.locator('option', { hasText: /^12$/ }) }).locator('option')).toContainText(['3', '6', '9', '12']);
  203 | });
  204 | 
  205 | test('PAY-04 changing payment clears account fields', { tag: '@BUG-007' }, async ({ page, request }) => {
  206 |   await paymentStep(page, request);
  207 |   await page.getByTestId('payment-method').selectOption({ label: 'Bank Transfer' });
  208 |   await page.getByTestId('account-name').fill('Taylor Smith');
  209 |   await page.getByTestId('account-number').fill('1234567890');
  210 |   await page.getByTestId('payment-method').selectOption({ label: 'Gift Card' });
  211 |   await page.getByTestId('payment-method').selectOption({ label: 'Bank Transfer' });
  212 |   await expect(page.getByTestId('account-name')).toHaveValue('');
  213 |   await expect(page.getByTestId('account-number')).toHaveValue('');
  214 | });
  215 | 
  216 | test('CAT-02 UI unknown search shows empty result', async ({ page }) => {
  217 |   await page.goto('/');
  218 |   await expect(page.getByTestId('product-name')).toHaveCount(9);
  219 |   await page.getByTestId('search-query').fill('zzzznonexistent');
  220 |   await page.locator('button[type=submit][data-test=search-submit]').click();
  221 |   await expect(page.getByTestId('search-result-count')).toContainText('0 products found');
  222 |   await expect(page.getByTestId('product-name')).toHaveCount(0);
  223 | });
  224 | 
```