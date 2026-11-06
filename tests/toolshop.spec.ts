import { randomUUID } from 'node:crypto';
import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const api = process.env.TOOLSHOP_API_URL;
const address = { address: '12 Test Street', city: 'Boston', state: 'MA', country: 'US', postcode: '02108' };

async function addProduct(page: Page, request: APIRequestContext) {
  const response = await request.get(`${api}/products`);
  expect(response.ok()).toBeTruthy();
  const { data } = await response.json();
  const product = data.find(item => item.name === 'Combination Pliers' && !item.is_rental && !item.discount_price && item.stock >= 10);
  expect(product, 'Precondition: seed Combination Pliers without discount, stock >= 10').toBeDefined();
  await page.goto('/');
  await expect(page.getByTestId('product-name').first()).toBeVisible();
  await page.getByTestId('search-query').fill(product.name);
  const found = page.waitForResponse(r => new URL(r.url()).pathname === '/products/search' && r.ok());
  await page.locator('button[type=submit][data-test=search-submit]').click();
  await found;
  await page.getByTestId(`product-${product.id}`).click();
  await expect(page.getByTestId('product-name')).toHaveText(product.name);
  await expect(page.getByTestId('unit-price')).toHaveText(Number(product.price).toFixed(2));
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-quantity')).toHaveText('1');
  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('product-title')).toHaveText(product.name);
  return product;
}

test('CAT-01 UI search finds pliers', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('product-name')).toHaveCount(9);
  const search = page.getByTestId('search-query');
  await search.fill('pliers');
  const response = page.waitForResponse(r => r.url().includes('/products/search') && r.ok());
  await page.locator('button[type=submit][data-test=search-submit]').click();
  await response;
  const names = page.getByTestId('product-name');
  await expect(names.first()).toContainText(/pliers/i);
  await expect(names).toHaveText(await names.allTextContents().then(items => items.map(() => /pliers/i)));
});

test('CAT-02 unknown search has no API results', async ({ request }) => {
  const response = await request.get(`${api}/products/search`, { params: { q: 'zzzznonexistent' } });
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ total: 0, data: [] });
});

test('CAT-05 low to high sorts prices across pages', { tag: '@BUG-001' }, async ({ page }) => {
  await page.goto('/');
  const prices = page.getByTestId('product-price');
  await expect(prices.first()).toBeVisible();
  const sort = page.waitForResponse(r => new URL(r.url()).pathname === '/products' && new URL(r.url()).searchParams.has('sort') && r.request().method() === 'GET' && r.ok());
  await page.getByTestId('sort').selectOption({ label: 'Price (Low - High)' });
  const firstPage = (await (await sort).json()).data;
  await expect(page.getByTestId('product-name')).toHaveText(firstPage.map(item => item.name));
  const first = (await prices.allTextContents()).map(price => Number(price.replace(/[^\d.]/g, '')));
  expect(first.length).toBeGreaterThan(1);
  expect(first).toEqual([...first].sort((a, b) => a - b));
  const next = page.waitForResponse(r => new URL(r.url()).pathname === '/products' && new URL(r.url()).searchParams.get('page') === '2' && r.request().method() === 'GET' && r.ok());
  await page.locator('pagination-controls .pagination-next a').click();
  const secondPage = (await (await next).json()).data;
  await expect(page.getByTestId('product-name')).toHaveText(secondPage.map(item => item.name));
  const second = (await prices.allTextContents()).map(price => Number(price.replace(/[^\d.]/g, '')));
  expect(second.length).toBeGreaterThan(0);
  const both = first.concat(second);
  expect(both).toEqual([...both].sort((a, b) => a - b));
});

test('CART-01 adds a product with the displayed price', async ({ page, request }) => {
  const product = await addProduct(page, request);
  await expect(page.getByTestId('product-quantity')).toHaveValue('1');
  await expect(page.getByTestId('product-price')).toHaveText(`$${Number(product.price).toFixed(2)}`);
});

test('CART-02 updates line and cart totals', { tag: '@BUG-002' }, async ({ page, request }) => {
  const product = await addProduct(page, request);
  await page.getByTestId('product-quantity').fill('2');
  await page.getByTestId('product-quantity').press('Tab');
  const total = `$${(Number(product.price) * 2).toFixed(2)}`;
  await expect(page.getByTestId('cart-total')).toHaveText(total);
  await expect(page.getByTestId('line-price')).toHaveText(total);
});

async function registerCustomer(request: APIRequestContext) {
  const email = `qa-${randomUUID()}@example.com`;
  const password = `Qa!${randomUUID().slice(0, 20)}`;
  const registration = await request.post(`${api}/users/register`, {
    data: { first_name: 'Taylor', last_name: 'Smith', email, password, dob: '1990-01-01', phone: '6175550123', ...address },
  });
  expect(registration.status(), await registration.text()).toBe(201);
  return { email, password };
}

async function submitCheckoutLogin(page: Page, email: string, password: string) {
  await page.getByTestId('proceed-1').click();
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(password);
  const [response] = await Promise.all([
    page.waitForResponse(r => new URL(r.url()).pathname === '/users/login' && r.request().method() === 'POST'),
    page.getByTestId('login-submit').click(),
  ]);
  return response;
}

test('CART-03 removes the last item', { tag: '@BUG-005' }, async ({ page, request }) => {
  await addProduct(page, request);
  await page.locator('tr').filter({ has: page.getByTestId('product-title') }).locator('a:has(.fa-remove)').click();
  await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();
  await expect(page.getByTestId('product-title')).toHaveCount(0);
  await expect(page.getByTestId('proceed-1')).toBeHidden();
});

test('AUTH-02 invalid password blocks checkout and preserves cart', async ({ page, request }) => {
  const { email, password } = await registerCustomer(request);
  const product = await addProduct(page, request);
  const login = await submitCheckoutLogin(page, email, `${password}x`);
  expect(login.status()).toBe(401);
  await expect(page.getByText('Invalid email or password')).toBeVisible();
  await expect(page.getByTestId('proceed-2')).toBeHidden();
  await expect(page.getByTestId('address')).toBeHidden();
  await page.reload();
  await expect(page.getByTestId('product-title')).toHaveText(product.name);
  await expect(page.getByTestId('product-quantity')).toHaveValue('1');
});

test('ORD-02 missing address blocks payment', async ({ page, request }) => {
  const { email, password } = await registerCustomer(request);
  await addProduct(page, request);
  expect((await submitCheckoutLogin(page, email, password)).ok()).toBeTruthy();
  await page.getByTestId('proceed-2').click();
  for (const [field, value] of Object.entries(address)) {
    await page.getByTestId(field).fill(value);
  }
  await expect(page.getByTestId('proceed-3')).toBeEnabled();
  await page.getByTestId('address').clear();
  await page.getByTestId('address').press('Tab');
  await expect(page.getByTestId('proceed-3')).toBeDisabled();
  await expect(page.getByTestId('payment-method')).toBeHidden();
});

test('ORD-01 guest signs in and confirms cash on delivery', { tag: '@BUG-003' }, async ({ page, request }) => {
  const { email, password } = await registerCustomer(request);
  const product = await addProduct(page, request);
  expect((await submitCheckoutLogin(page, email, password)).ok()).toBeTruthy();
  await page.getByTestId('proceed-2').click();
  for (const [field, value] of Object.entries(address)) {
    await page.getByTestId(field).fill(value);
  }
  await page.getByTestId('proceed-3').click();
  await page.getByTestId('payment-method').selectOption({ label: 'Cash on Delivery' });
  await expect(page.getByTestId('finish')).toBeEnabled();
  const [response] = await Promise.all([
    page.waitForResponse(r => new URL(r.url()).pathname === '/invoices' && r.request().method() === 'POST', { timeout: 8000 }),
    page.getByTestId('finish').click({ timeout: 8000 }),
  ]);
  expect(response.ok(), await response.text()).toBeTruthy();
  const saved = await response.json();
  expect(saved.invoice_number).toBeTruthy();
  expect(response.request().postDataJSON().invoice_items).toEqual([
    expect.objectContaining({ product_id: product.id, quantity: 1, unit_price: Number(product.price) }),
  ]);
  expect(Number(saved.total)).toBe(Number(product.price));
  const auth = await request.post(`${api}/users/login`, { data: { email, password } });
  expect(auth.ok()).toBeTruthy();
  const { access_token } = await auth.json();
  const detail = await request.get(`${api}/invoices/${saved.id}`, { headers: { Authorization: `Bearer ${access_token}` } });
  expect(detail.status()).toBe(200);
  const persisted = await detail.json();
  expect(persisted.invoice_number).toBe(saved.invoice_number);
  expect(persisted.user_id).toBe(saved.user_id);
  expect(Number(persisted.total)).toBe(Number(product.price));
  expect(persisted.invoicelines.map(item => ({ product_id: item.product_id, quantity: Number(item.quantity), unit_price: Number(item.unit_price) }))).toEqual([{ product_id: product.id, quantity: 1, unit_price: Number(product.price) }]);
  await expect(page.locator('#invoice-number')).toHaveText(String(saved.invoice_number));
  await page.goto('/#/checkout');
  await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();
  await expect(page.getByTestId('proceed-1')).toBeHidden();
  await expect(page.getByTestId('product-title')).toHaveCount(0);
});

test('PAY-05 API rejects an unsupported payment method', { tag: '@BUG-004' }, async ({ request }) => {
  const response = await request.post(`${api}/payment/check`, {
    data: { method: 'unsupported-payment-method' },
  });
  expect([400, 422], await response.text()).toContain(response.status());
});

async function paymentStep(page: Page, request: APIRequestContext) {
  const customer = await registerCustomer(request);
  await addProduct(page, request);
  expect((await submitCheckoutLogin(page, customer.email, customer.password)).ok()).toBeTruthy();
  await page.getByTestId('proceed-2').click();
  for (const [field, value] of Object.entries(address)) await page.getByTestId(field).fill(value);
  await page.getByTestId('proceed-3').click();
}

test('PAY-03 installment options are 3 6 9 12', { tag: '@BUG-006' }, async ({ page, request }) => {
  await paymentStep(page, request);
  await page.getByTestId('payment-method').selectOption({ label: 'Buy Now Pay Later' });
  await expect(page.getByText('Monthly installments', { exact: false })).toBeVisible();
  await expect(page.locator('select').filter({ has: page.locator('option', { hasText: /^12$/ }) }).locator('option')).toContainText(['3', '6', '9', '12']);
});

test('PAY-04 changing payment clears account fields', { tag: '@BUG-007' }, async ({ page, request }) => {
  await paymentStep(page, request);
  await page.getByTestId('payment-method').selectOption({ label: 'Bank Transfer' });
  await page.getByTestId('account-name').fill('Taylor Smith');
  await page.getByTestId('account-number').fill('1234567890');
  await page.getByTestId('payment-method').selectOption({ label: 'Gift Card' });
  await page.getByTestId('payment-method').selectOption({ label: 'Bank Transfer' });
  await expect(page.getByTestId('account-name')).toHaveValue('');
  await expect(page.getByTestId('account-number')).toHaveValue('');
});

test('CAT-02 UI unknown search shows empty result', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('product-name')).toHaveCount(9);
  await page.getByTestId('search-query').fill('zzzznonexistent');
  await page.locator('button[type=submit][data-test=search-submit]').click();
  await expect(page.getByTestId('search-result-count')).toContainText('0 products found');
  await expect(page.getByTestId('product-name')).toHaveCount(0);
});
