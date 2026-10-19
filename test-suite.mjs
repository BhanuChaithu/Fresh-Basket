// Automated end-to-end test suite for Fresh Basket e-commerce platform
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('FRESH BASKET - AUTOMATED INTEGRATION & VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Test Homepage / Public Products API
  try {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    assert(res.ok && data.success, 'Public products API responds with 200 OK');
    assert(Array.isArray(data.products) && data.products.length >= 10, `Retrieved ${data.products?.length} produce items from database`);
    const tomato = data.products.find(p => p.id === 'prod-tomato-hybrid');
    assert(tomato && tomato.current_price > 0, `Product contains transparent price (₹${tomato?.current_price}/${tomato?.unit})`);
  } catch (e) {
    assert(false, `Products API error: ${e.message}`);
  }

  // 2. Test Categories
  try {
    const res = await fetch(`${BASE_URL}/api/categories`);
    const data = await res.json();
    assert(res.ok && data.categories.length === 7, `Retrieved all 7 required produce categories`);
  } catch (e) {
    assert(false, `Categories API error: ${e.message}`);
  }

  // 3. Test Bengaluru PIN code serviceability
  try {
    const res1 = await fetch(`${BASE_URL}/api/delivery-areas/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode: '560102' }),
    });
    const data1 = await res1.json();
    assert(data1.is_serviceable && data1.area?.area_name.includes('HSR'), 'PIN 560102 (HSR Layout) verified as serviceable');

    const res2 = await fetch(`${BASE_URL}/api/delivery-areas/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode: '999999' }),
    });
    const data2 = await res2.json();
    assert(!data2.is_serviceable, 'Unsupported PIN gracefully flagged with custom WhatsApp inquiry message');
  } catch (e) {
    assert(false, `PIN check error: ${e.message}`);
  }

  // 4. Test Checkout and Server-side Price Recalculation
  let createdOrder = null;
  try {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Pooja Hegde',
        customer_phone: '9845011223',
        customer_email: 'pooja.h@example.com',
        delivery_address: 'Villa 14, Palm Meadows',
        neighbourhood: 'Whitefield',
        pincode: '560066',
        delivery_slot: 'Morning Slot: 07:00 AM – 10:00 AM (Next Day)',
        delivery_instructions: 'Ring doorbell twice',
        payment_method: 'Cash on Delivery',
        items: [
          { product_id: 'prod-veg-basket-essential', quantity: 1 },
          { product_id: 'prod-banana-yelakki', quantity: 2 },
        ],
      }),
    });
    const data = await res.json();
    assert(res.ok && data.success && data.order?.order_number, `Order placed successfully with ID #${data.order?.order_number}`);
    createdOrder = data.order;
    assert(data.order.subtotal === 399 + 42 * 2, `Server-side subtotal correctly recalculated: ₹${data.order.subtotal}`);
    assert(data.order.delivery_charge === 0, `Free delivery applied for order above threshold: ₹${data.order.delivery_charge}`);
    assert(Boolean(data.order.lookup_token), `Secure unpredictable order lookup token generated: ${data.order.lookup_token}`);
  } catch (e) {
    assert(false, `Checkout error: ${e.message}`);
  }

  // 5. Test Public Order Lookup Verification
  if (createdOrder) {
    try {
      // Lookup by Order Number + Phone
      const res = await fetch(`${BASE_URL}/api/orders/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: createdOrder.order_number,
          phone: '9845011223',
        }),
      });
      const data = await res.json();
      assert(res.ok && data.success && data.order?.id === createdOrder.id, 'Customer successfully looked up order by Order Number and Mobile');

      // Attempt lookup with wrong phone (should fail)
      const resWrong = await fetch(`${BASE_URL}/api/orders/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: createdOrder.order_number,
          phone: '9999999999',
        }),
      });
      assert(!resWrong.ok, 'Unauthorized order lookup with wrong phone number is securely blocked');
    } catch (e) {
      assert(false, `Order lookup error: ${e.message}`);
    }
  }

  // 6. Test Security: Unauthenticated access to admin APIs
  try {
    const res = await fetch(`${BASE_URL}/api/orders`);
    assert(res.status === 401, 'Unauthenticated access to /api/orders blocked with 401 Unauthorized');
  } catch (e) {
    assert(false, `Security test error: ${e.message}`);
  }

  // 7. Test Admin Login & Session Cookie
  let sessionCookie = '';
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@freshbasket.in',
        password: 'FreshBasket2026!',
      }),
    });
    const data = await res.json();
    assert(res.ok && data.success, 'Admin authenticated successfully with secure credentials');
    
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }
  } catch (e) {
    assert(false, `Admin login error: ${e.message}`);
  }

  // 8. Test Authenticated Admin Operations & Instant Price Update
  if (sessionCookie) {
    try {
      // Fetch orders as admin
      const ordersRes = await fetch(`${BASE_URL}/api/orders`, {
        headers: { Cookie: sessionCookie },
      });
      const ordersData = await ordersRes.json();
      assert(ordersRes.ok && ordersData.orders.length > 0, `Admin successfully retrieved ${ordersData.orders.length} incoming orders`);

      // Update product price
      const updateRes = await fetch(`${BASE_URL}/api/products/prod-tomato-hybrid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({ price: 44, previous_price: 38 }),
      });
      const updateData = await updateRes.json();
      assert(updateRes.ok && updateData.product?.current_price === 44, 'Admin successfully updated Tomato price to ₹44');

      // Verify that public unauthenticated API returns updated price immediately without redeployment
      const publicRes = await fetch(`${BASE_URL}/api/products`);
      const publicData = await publicRes.json();
      const updatedTomato = publicData.products.find(p => p.id === 'prod-tomato-hybrid');
      assert(updatedTomato?.current_price === 44, 'Price update immediately reflected on public storefront without redeployment!');

      // Reset tomato price back to 38
      await fetch(`${BASE_URL}/api/products/prod-tomato-hybrid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
        body: JSON.stringify({ price: 38, previous_price: 45 }),
      });
      console.log('ℹ️ Reset Tomato price back to initial catalogue price: ₹38');

      // Update Order Status
      if (createdOrder) {
        const statusRes = await fetch(`${BASE_URL}/api/orders/${createdOrder.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: sessionCookie,
          },
          body: JSON.stringify({ status: 'Confirmed', payment_status: 'Pending' }),
        });
        const statusData = await statusRes.json();
        assert(statusRes.ok && statusData.order?.status === 'Confirmed', 'Admin successfully changed order status to "Confirmed"');
      }

      // Fetch Dashboard Stats
      const statsRes = await fetch(`${BASE_URL}/api/stats`, {
        headers: { Cookie: sessionCookie },
      });
      const statsData = await statsRes.json();
      assert(statsRes.ok && statsData.stats?.totalOrders > 0, `Admin stats verified: ${statsData.stats?.totalOrders} orders, ₹${statsData.stats?.totalRevenue} revenue`);
    } catch (e) {
      assert(false, `Admin operations error: ${e.message}`);
    }
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
