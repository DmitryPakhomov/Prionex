# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toolshop.spec.ts >> CAT-05 low to high sorts prices across pages
- Location: tests\toolshop.spec.ts:48:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 8
+ Received  + 8

  Array [
-   46.5,
-   48.41,
-   58.48,
-   66.54,
-   73.59,
-   80.19,
-   100.79,
-   119.24,
    125.23,
+   119.24,
+   100.79,
+   80.19,
+   73.59,
+   66.54,
+   58.48,
+   48.41,
+   46.5,
  ]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - text: View the
    - link "Documentation" [ref=e4] [cursor=pointer]:
      - /url: https://testsmith-io.github.io/practice-software-testing/#/
    - text: for this application.
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]: 🐛 Bug Hunting Mode - Find & Report Bugs!
      - button "Bug Hunting Guide" [ref=e9] [cursor=pointer]
    - navigation [ref=e10]:
      - generic [ref=e11]:
        - link "Practice Software Testing - Toolshop" [ref=e12] [cursor=pointer]:
          - /url: /
        - menubar "Main menu" [ref=e15]:
          - menuitem [ref=e16]:
            - link "Home" [ref=e17] [cursor=pointer]:
              - /url: "#/contact"
          - menuitem [ref=e18]:
            - button "Categories" [ref=e19] [cursor=pointer]
          - menuitem [ref=e20]:
            - link "Contakt" [ref=e21] [cursor=pointer]:
              - /url: "#/contact"
          - menuitem [ref=e22]:
            - link "Sign in" [ref=e23] [cursor=pointer]:
              - /url: "#/auth/login"
  - generic [ref=e25]:
    - generic [ref=e26]:
      - paragraph [ref=e27]
      - separator [ref=e29]
    - generic [ref=e30]:
      - generic [ref=e31]:
        - heading " Sorth" [level=4] [ref=e32]:
          - generic [ref=e33]: 
          - text: Sorth
        - separator [ref=e34]
        - combobox [ref=e37]:
          - option
          - option "Name (A - Z)"
          - option "Name (Z - A)"
          - option "Price (High - Low)"
          - option "Price (Low - High)" [selected]
          - option "CO₂ Rating (Best First)"
          - option "CO₂ Rating (Worst First)"
        - heading " Price Range" [level=4] [ref=e38]:
          - generic [ref=e39]: 
          - text: Price Range
        - separator [ref=e40]
        - generic "ngx-slider" [ref=e42]:
          - slider "ngx-slider" [ref=e47] [cursor=pointer]
          - slider "ngx-slider-max" [ref=e48] [cursor=pointer]
          - generic [ref=e49]: "0"
          - generic [ref=e50]: "200"
          - generic [ref=e51]: "1"
          - generic [ref=e52]: "100"
        - heading "Search" [level=4] [ref=e54]
        - separator [ref=e56]
        - generic [ref=e58]:
          - textbox [ref=e59]
          - button "X" [ref=e60] [cursor=pointer]
          - button "Serch" [ref=e61] [cursor=pointer]
        - heading " Filters" [level=4] [ref=e62]:
          - generic [ref=e63]: 
          - text: Filters
        - separator [ref=e64]
        - heading "By category:" [level=4] [ref=e65]
        - generic [ref=e66]:
          - generic [ref=e67]: Hand Tools
          - list [ref=e68]:
            - generic [ref=e70]:
              - checkbox "Hammer" [ref=e71]
              - text: Hammer
            - generic [ref=e73]:
              - checkbox "Hand Saw" [ref=e74]
              - text: Hand Saw
            - generic [ref=e76]:
              - checkbox "Wrench" [ref=e77]
              - text: Wrench
            - generic [ref=e79]:
              - checkbox "Screwdriver" [ref=e80]
              - text: Screwdriver
            - generic [ref=e82]:
              - checkbox "Pliers" [ref=e83]
              - text: Pliers
        - generic [ref=e84]:
          - generic [ref=e85]: Power Tools
          - list [ref=e86]:
            - generic [ref=e88]:
              - checkbox "Grinder" [ref=e89]
              - text: Grinder
            - generic [ref=e91]:
              - checkbox "Sander" [ref=e92]
              - text: Sander
            - generic [ref=e94]:
              - checkbox "Saw" [ref=e95]
              - text: Saw
            - generic [ref=e97]:
              - checkbox "Drill" [ref=e98]
              - text: Drill
        - generic [ref=e100]:
          - checkbox "Other" [ref=e101]
          - text: Other
        - heading "By brand:" [level=4] [ref=e103]
        - generic [ref=e105]:
          - checkbox "Brand name 1" [ref=e106]
          - text: Brand name 1
        - generic [ref=e108]:
          - checkbox "Brand name 2" [ref=e109]
          - text: Brand name 2
        - generic [ref=e111]:
          - checkbox "Brand name 3" [ref=e112]
          - text: Brand name 3
        - generic [ref=e114]:
          - checkbox "Brand name 4" [ref=e115]
          - text: Brand name 4
        - generic [ref=e117]:
          - checkbox "Brand name 5" [ref=e118]
          - text: Brand name 5
        - generic [ref=e120]:
          - checkbox "Brand name 6" [ref=e121]
          - text: Brand name 6
        - generic [ref=e123]:
          - checkbox "Brand name 7" [ref=e124]
          - text: Brand name 7
        - generic [ref=e126]:
          - checkbox "Brand name 8" [ref=e127]
          - text: Brand name 8
        - generic [ref=e129]:
          - checkbox "Brand name 9" [ref=e130]
          - text: Brand name 9
        - generic [ref=e132]:
          - checkbox "Brand name 10" [ref=e133]
          - text: Brand name 10
        - heading "Sustainability:" [level=4] [ref=e135]
        - generic [ref=e137]:
          - checkbox "Show only eco-friendly products" [ref=e138]
          - text: Show only eco-friendly products
      - generic [ref=e139]:
        - text: 
        - generic [ref=e140]:
          - 'link "Cordless Drill 20V CO₂: A B C D E $125.23" [ref=e141] [cursor=pointer]':
            - /url: "#/product/23"
            - generic [ref=e144]:
              - heading "Cordless Drill 20V" [level=5] [ref=e145]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e146]:
                - text: "CO₂:"
                - generic [ref=e147]: A
                - generic [ref=e148]: B
                - generic [ref=e149]: C
                - generic [ref=e150]: D
                - generic [ref=e151]: E
            - generic [ref=e152]: $125.23
          - 'link "Cordless Drill 18V CO₂: A B C D E $119.24" [ref=e154] [cursor=pointer]':
            - /url: "#/product/25"
            - generic [ref=e157]:
              - heading "Cordless Drill 18V" [level=5] [ref=e158]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e159]:
                - text: "CO₂:"
                - generic [ref=e160]: A
                - generic [ref=e161]: B
                - generic [ref=e162]: C
                - generic [ref=e163]: D
                - generic [ref=e164]: E
            - generic [ref=e165]: $119.24
          - 'link "ECO Random Orbit Sander CO₂: A B C D E $100.79" [ref=e167] [cursor=pointer]':
            - /url: "#/product/22"
            - generic [ref=e168]: ECO
            - generic [ref=e171]:
              - heading "Random Orbit Sander" [level=5] [ref=e172]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e173]:
                - text: "CO₂:"
                - generic [ref=e174]: A
                - generic [ref=e175]: B
                - generic [ref=e176]: C
                - generic [ref=e177]: D
                - generic [ref=e178]: E
            - generic [ref=e179]: $100.79
          - 'link "ECO Circular Saw CO₂: A B C D E $80.19" [ref=e181] [cursor=pointer]':
            - /url: "#/product/21"
            - generic [ref=e182]: ECO
            - generic [ref=e185]:
              - heading "Circular Saw" [level=5] [ref=e186]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e187]:
                - text: "CO₂:"
                - generic [ref=e188]: A
                - generic [ref=e189]: B
                - generic [ref=e190]: C
                - generic [ref=e191]: D
                - generic [ref=e192]: E
            - generic [ref=e193]: $80.19
          - 'link "ECO Belt Sander CO₂: A B C D E $73.59" [ref=e195] [cursor=pointer]':
            - /url: "#/product/20"
            - generic [ref=e196]: ECO
            - generic [ref=e198]:
              - heading "Belt Sander" [level=5] [ref=e199]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e200]:
                - text: "CO₂:"
                - generic [ref=e201]: A
                - generic [ref=e202]: B
                - generic [ref=e203]: C
                - generic [ref=e204]: D
                - generic [ref=e205]: E
            - generic [ref=e206]: $73.59
          - 'link "Cordless Drill 24V CO₂: A B C D E $66.54" [ref=e208] [cursor=pointer]':
            - /url: "#/product/24"
            - generic [ref=e211]:
              - heading "Cordless Drill 24V" [level=5] [ref=e212]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e213]:
                - text: "CO₂:"
                - generic [ref=e214]: A
                - generic [ref=e215]: B
                - generic [ref=e216]: C
                - generic [ref=e217]: D
                - generic [ref=e218]: E
            - generic [ref=e219]: $66.54
          - 'link "ECO Sheet Sander CO₂: A B C D E $58.48" [ref=e221] [cursor=pointer]':
            - /url: "#/product/19"
            - generic [ref=e222]: ECO
            - generic [ref=e225]:
              - heading "Sheet Sander" [level=5] [ref=e226]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e227]:
                - text: "CO₂:"
                - generic [ref=e228]: A
                - generic [ref=e229]: B
                - generic [ref=e230]: C
                - generic [ref=e231]: D
                - generic [ref=e232]: E
            - generic [ref=e233]: $58.48
          - 'link "ECO Bolt Cutters CO₂: A B C D E $48.41" [ref=e235] [cursor=pointer]':
            - /url: "#/product/3"
            - generic [ref=e236]: ECO
            - generic [ref=e239]:
              - heading "Bolt Cutters" [level=5] [ref=e240]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e241]:
                - text: "CO₂:"
                - generic [ref=e242]: A
                - generic [ref=e243]: B
                - generic [ref=e244]: C
                - generic [ref=e245]: D
                - generic [ref=e246]: E
            - generic [ref=e247]: $48.41
          - 'link "Cordless Drill 12V CO₂: A B C D E $46.50" [ref=e249] [cursor=pointer]':
            - /url: "#/product/26"
            - generic [ref=e252]:
              - heading "Cordless Drill 12V" [level=5] [ref=e253]
              - generic "Environmental impact rating (A=lowest, E=highest)" [ref=e254]:
                - text: "CO₂:"
                - generic [ref=e255]: A
                - generic [ref=e256]: B
                - generic [ref=e257]: C
                - generic [ref=e258]: D
                - generic [ref=e259]: E
            - generic [ref=e260]: $46.50
        - navigation "Pagination" [ref=e265]:
          - list [ref=e266]:
            - listitem [ref=e267]:
              - text: «
              - generic [ref=e268]:
                - text: Previous
                - generic [ref=e269]: page
            - listitem [ref=e270]:
              - generic [ref=e271]:
                - generic [ref=e272]: You're on page
                - text: "1"
            - listitem [ref=e273]:
              - generic [ref=e274] [cursor=pointer]:
                - generic [ref=e275]: page
                - text: "2"
            - listitem [ref=e276]:
              - generic [ref=e277] [cursor=pointer]:
                - generic [ref=e278]: page
                - text: "3"
            - listitem [ref=e279]:
              - generic [ref=e280] [cursor=pointer]:
                - text: Next
                - generic [ref=e281]: page
                - text: »
  - contentinfo [ref=e283]:
    - paragraph [ref=e285]:
      - text: This is a DEMO application, used for software testing training purpose. | Banner photo by
      - link "Barn Images" [ref=e286] [cursor=pointer]:
        - /url: https://unsplash.com/@barnimages
      - text: "on"
      - link "Unsplash" [ref=e287] [cursor=pointer]:
        - /url: https://unsplash.com/photos/t5YUoHW6zRo
      - text: .
  - button "Open chat" [ref=e289] [cursor=pointer]
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
> 58  |   expect(first).toEqual([...first].sort((a, b) => a - b));
      |                 ^ Error: expect(received).toEqual(expected) // deep equality
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
  81  |   await expect(page.getByTestId('line-price')).toHaveText(total);
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
```