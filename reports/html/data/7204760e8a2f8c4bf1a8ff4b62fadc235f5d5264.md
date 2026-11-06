# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toolshop.spec.ts >> CART-02 updates line and cart totals
- Location: tests\toolshop.spec.ts:75:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByTestId('line-price')
Expected: "$28.30"
Received: "$00.00"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByTestId('line-price') with timeout 5000ms
  - waiting for getByTestId('line-price')
    14 × locator resolved to <td data-test="line-price" _ngcontent-ng-c1226357352="" class="col-md-2 align-middle">$00.00</td>
       - unexpected value "$00.00"

```

```yaml
- cell "$00.00"
```

# Test source

```ts
  1   | import { randomUUID } from 'node:crypto';
  2   | import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
  3   | 
  4   | const api = process.env.TOOLSHOP_API_URL;
  5   | const address = { address: '12 Test Street', city: 'Boston', state: 'MA', country: 'US', postcode: '02108' };
  6   | 
  7   | async function addProduct(page: Page, request: APIRequestContext) {
  8   |   const response = await request.get(`${api}/products`);
  9   |   expect(response.ok()).toBeTruthy();
  10  |   const { data } = await response.json();
  11  |   const product = data.find(item => item.name === 'Combination Pliers' && !item.is_rental && !item.discount_price && item.stock >= 10);
  12  |   expect(product, 'Precondition: seed Combination Pliers without discount, stock >= 10').toBeDefined();
  13  |   await page.goto('/');
  14  |   await expect(page.getByTestId('product-name').first()).toBeVisible();
  15  |   await page.getByTestId('search-query').fill(product.name);
  16  |   const found = page.waitForResponse(r => new URL(r.url()).pathname === '/products/search' && r.ok());
  17  |   await page.locator('button[type=submit][data-test=search-submit]').click();
  18  |   await found;
  19  |   await page.getByTestId(`product-${product.id}`).click();
  20  |   await expect(page.getByTestId('product-name')).toHaveText(product.name);
  21  |   await expect(page.getByTestId('unit-price')).toHaveText(Number(product.price).toFixed(2));
  22  |   await page.getByTestId('add-to-cart').click();
  23  |   await expect(page.getByTestId('cart-quantity')).toHaveText('1');
  24  |   await page.getByTestId('nav-cart').click();
  25  |   await expect(page.getByTestId('product-title')).toHaveText(product.name);
  26  |   return product;
  27  | }
  28  | 
  29  | test('CAT-01 UI search finds pliers', async ({ page }) => {
  30  |   await page.goto('/');
  31  |   await expect(page.getByTestId('product-name')).toHaveCount(9);
  32  |   const search = page.getByTestId('search-query');
  33  |   await search.fill('pliers');
  34  |   const response = page.waitForResponse(r => r.url().includes('/products/search') && r.ok());
  35  |   await page.locator('button[type=submit][data-test=search-submit]').click();
  36  |   await response;
  37  |   const names = page.getByTestId('product-name');
  38  |   await expect(names.first()).toContainText(/pliers/i);
  39  |   await expect(names).toHaveText(await names.allTextContents().then(items => items.map(() => /pliers/i)));
  40  | });
  41  | 
  42  | test('CAT-02 unknown search has no API results', async ({ request }) => {
  43  |   const response = await request.get(`${api}/products/search`, { params: { q: 'zzzznonexistent' } });
  44  |   expect(response.status()).toBe(200);
  45  |   expect(await response.json()).toMatchObject({ total: 0, data: [] });
  46  | });
  47  | 
  48  | test('CAT-05 low to high sorts prices across pages', { tag: '@BUG-001' }, async ({ page }) => {
  49  |   await page.goto('/');
  50  |   const prices = page.getByTestId('product-price');
  51  |   await expect(prices.first()).toBeVisible();
  52  |   const sort = page.waitForResponse(r => new URL(r.url()).pathname === '/products' && new URL(r.url()).searchParams.has('sort') && r.request().method() === 'GET' && r.ok());
  53  |   await page.getByTestId('sort').selectOption({ label: 'Price (Low - High)' });
  54  |   const firstPage = (await (await sort).json()).data;
  55  |   await expect(page.getByTestId('product-name')).toHaveText(firstPage.map(item => item.name));
  56  |   const first = (await prices.allTextContents()).map(price => Number(price.replace(/[^\d.]/g, '')));
  57  |   expect(first.length).toBeGreaterThan(1);
  58  |   expect(first).toEqual([...first].sort((a, b) => a - b));
  59  |   const next = page.waitForResponse(r => new URL(r.url()).pathname === '/products' && new URL(r.url()).searchParams.get('page') === '2' && r.request().method() === 'GET' && r.ok());
  60  |   await page.locator('pagination-controls .pagination-next a').click();
  61  |   const secondPage = (await (await next).json()).data;
  62  |   await expect(page.getByTestId('product-name')).toHaveText(secondPage.map(item => item.name));
  63  |   const second = (await prices.allTextContents()).map(price => Number(price.replace(/[^\d.]/g, '')));
  64  |   expect(second.length).toBeGreaterThan(0);
  65  |   const both = first.concat(second);
  66  |   expect(both).toEqual([...both].sort((a, b) => a - b));
  67  | });
  68  | 
  69  | test('CART-01 adds a product with the displayed price', async ({ page, request }) => {
  70  |   const product = await addProduct(page, request);
  71  |   await expect(page.getByTestId('product-quantity')).toHaveValue('1');
  72  |   await expect(page.getByTestId('product-price')).toHaveText(`$${Number(product.price).toFixed(2)}`);
  73  | });
  74  | 
  75  | test('CART-02 updates line and cart totals', { tag: '@BUG-002' }, async ({ page, request }) => {
  76  |   const product = await addProduct(page, request);
  77  |   await page.getByTestId('product-quantity').fill('2');
  78  |   await page.getByTestId('product-quantity').press('Tab');
  79  |   const total = `$${(Number(product.price) * 2).toFixed(2)}`;
  80  |   await expect(page.getByTestId('cart-total')).toHaveText(total);
> 81  |   await expect(page.getByTestId('line-price')).toHaveText(total);
      |                                                ^ Error: expect(locator).toHaveText(expected) failed
  82  | });
  83  | 
  84  | async function registerCustomer(request: APIRequestContext) {
  85  |   const email = `qa-${randomUUID()}@example.com`;
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
```