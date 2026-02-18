import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Email via Gmail SMTP usando fetch a la API de Gmail ───────────────────
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const GMAIL_USER = process.env.GMAIL_USER
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn('Gmail credentials not configured, skipping email')
    return
  }

  // Encoded credentials for Basic Auth in base64
  const auth = Buffer.from(`${GMAIL_USER}:${GMAIL_APP_PASSWORD}`).toString('base64')

  // Build raw email in base64url for Gmail API
  const emailLines = [
    `From: "Repuesto Hoy" <${GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    html,
  ]
  const rawEmail = emailLines.join('\r\n')
  const encodedEmail = Buffer.from(rawEmail)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  // Get access token using Gmail refresh token
  const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN
  const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID
  const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET

  if (!GMAIL_REFRESH_TOKEN || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET) {
    // Fallback: use App Password via SMTP simulation via fetch
    // Since we can't use nodemailer, log and skip
    console.warn('Gmail OAuth not configured. Email not sent to:', to)
    console.log('EMAIL CONTENT:', subject)
    return
  }

  // Exchange refresh token for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })

  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    console.error('Failed to get Gmail access token:', tokenData)
    return
  }

  // Send email via Gmail API
  const sendRes = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedEmail }),
    }
  )

  if (!sendRes.ok) {
    const err = await sendRes.text()
    console.error('Gmail API error:', err)
  } else {
    console.log(`Email sent successfully to ${to}`)
  }
}

// ─── Email templates ───────────────────────────────────────────────────────
function emailVendedor(order: any) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.product.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;color:#E10600;font-weight:bold;">$${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('')

  const paymentMap: Record<string, string> = {
    pago_movil: '📱 Pago Móvil',
    zelle: '🇺🇸 Zelle',
    efectivo: '💵 Efectivo',
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px;">
  <div style="background:#111111;padding:20px;border-radius:12px 12px 0 0;text-align:center;">
    <h1 style="color:white;margin:0;font-size:24px;">🔧 REPUESTO HOY</h1>
    <p style="color:#aaa;margin:5px 0 0;">Nueva orden recibida</p>
  </div>
  <div style="background:white;padding:24px;border-radius:0 0 12px 12px;">
    <div style="background:#fff3cd;border-left:4px solid #E10600;padding:12px 16px;border-radius:4px;margin-bottom:20px;">
      <strong style="color:#E10600;font-size:18px;">🆕 NUEVA ORDEN: ${order.order_number}</strong>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#666;width:140px;">👤 Cliente</td><td style="padding:6px 0;font-weight:bold;">${order.customer_name}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">📱 Teléfono</td><td style="padding:6px 0;"><a href="https://wa.me/58${order.customer_phone.replace(/^0/, '').replace(/-/g, '')}" style="color:#25D366;font-weight:bold;">${order.customer_phone}</a></td></tr>
      ${order.customer_email ? `<tr><td style="padding:6px 0;color:#666;">📧 Email</td><td style="padding:6px 0;">${order.customer_email}</td></tr>` : ''}
      <tr><td style="padding:6px 0;color:#666;">🗺️ Zona</td><td style="padding:6px 0;">${order.delivery_zone}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">📍 Dirección</td><td style="padding:6px 0;">${order.address}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">💳 Pago</td><td style="padding:6px 0;">${paymentMap[order.payment_method] || order.payment_method}</td></tr>
      ${order.notes ? `<tr><td style="padding:6px 0;color:#666;">📝 Notas</td><td style="padding:6px 0;">${order.notes}</td></tr>` : ''}
    </table>

    <h3 style="color:#111;border-bottom:2px solid #eee;padding-bottom:8px;">Productos pedidos</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:8px 12px;text-align:left;font-size:13px;color:#666;">Producto</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;color:#666;">Cant.</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px;color:#666;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-top:20px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#666;">Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#666;">Envío</span><span>${order.delivery_cost === 0 ? 'GRATIS' : '$' + order.delivery_cost.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:bold;color:#E10600;border-top:2px solid #eee;padding-top:10px;margin-top:10px;">
        <span>TOTAL</span><span>$${order.total.toFixed(2)}</span>
      </div>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="https://wa.me/58${order.customer_phone.replace(/^0/, '').replace(/-/g, '')}?text=${encodeURIComponent(`Hola ${order.customer_name}! Recibimos tu orden ${order.order_number}. Estamos procesando tu pedido.`)}"
         style="display:inline-block;background:#25D366;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
        📲 Contactar cliente por WhatsApp
      </a>
    </div>
  </div>
</body>
</html>`
}

function emailComprador(order: any) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">${item.product.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:#E10600;font-weight:bold;">$${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('')

  const paymentMap: Record<string, string> = {
    pago_movil: 'Pago Móvil',
    zelle: 'Zelle',
    efectivo: 'Efectivo al recibir',
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px;">
  <div style="background:#111111;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
    <h1 style="color:white;margin:0;font-size:28px;">REPUESTO HOY</h1>
    <p style="color:#aaa;margin:5px 0 0;">Caracas • Entrega el mismo día</p>
  </div>
  <div style="background:white;padding:32px;border-radius:0 0 12px 12px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:60px;height:60px;background:#d4edda;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:12px;">✅</div>
      <h2 style="color:#111;margin:0;font-size:22px;">¡Pedido confirmado!</h2>
      <p style="color:#666;margin:8px 0 0;">Hola <strong>${order.customer_name}</strong>, recibimos tu orden.</p>
    </div>

    <div style="background:#f9f9f9;border-radius:8px;padding:16px;text-align:center;margin-bottom:24px;">
      <p style="color:#666;margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Número de orden</p>
      <p style="color:#111;font-size:24px;font-weight:bold;margin:0;letter-spacing:2px;">${order.order_number}</p>
      <p style="color:#666;font-size:12px;margin:8px 0 0;">Guarda este número para cualquier consulta</p>
    </div>

    <h3 style="color:#111;border-bottom:2px solid #eee;padding-bottom:8px;">Tu pedido</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:8px 12px;text-align:left;font-size:13px;color:#666;">Producto</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;color:#666;">Cant.</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px;color:#666;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-top:16px;margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#666;">Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#666;">Envío</span><span style="color:${order.delivery_cost === 0 ? 'green' : 'inherit'}">${order.delivery_cost === 0 ? 'GRATIS' : '$' + order.delivery_cost.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:bold;color:#E10600;border-top:2px solid #eee;padding-top:10px;margin-top:8px;">
        <span>TOTAL</span><span>$${order.total.toFixed(2)}</span>
      </div>
    </div>

    <div style="background:#fff;border:1px solid #eee;border-radius:8px;padding:16px;margin-bottom:24px;">
      <table style="width:100%;">
        <tr><td style="color:#666;padding:4px 0;width:140px;">📍 Dirección</td><td style="padding:4px 0;">${order.address}</td></tr>
        <tr><td style="color:#666;padding:4px 0;">🗺️ Zona</td><td style="padding:4px 0;">${order.delivery_zone}</td></tr>
        <tr><td style="color:#666;padding:4px 0;">💳 Forma de pago</td><td style="padding:4px 0;">${paymentMap[order.payment_method] || order.payment_method}</td></tr>
      </table>
    </div>

    <div style="background:#e8f5e9;border-left:4px solid #25D366;padding:16px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;color:#111;font-weight:bold;">¿Qué sigue?</p>
      <p style="margin:8px 0 0;color:#444;font-size:14px;">Nuestro equipo revisará tu pedido y te contactará pronto al número <strong>${order.customer_phone}</strong> para coordinar la entrega y confirmar el pago.</p>
    </div>

    <div style="text-align:center;">
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '584122223775'}?text=${encodeURIComponent(`Hola! Tengo una pregunta sobre mi orden ${order.order_number}`)}"
         style="display:inline-block;background:#25D366;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
        📲 Escribirnos por WhatsApp
      </a>
    </div>

    <p style="text-align:center;color:#aaa;font-size:12px;margin-top:28px;">
      Repuesto Hoy • Caracas, Venezuela<br>
      <a href="https://repuestohoy.com" style="color:#E10600;">repuestohoy.com</a>
    </p>
  </div>
</body>
</html>`
}

// ─── POST /api/ordenes ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      subtotal,
      deliveryCost,
      total,
      deliveryZone,
      address,
      paymentMethod,
      notes,
    } = body

    // Validate required fields
    if (!customerName || !customerPhone || !items?.length || !deliveryZone || !address || !paymentMethod) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Generate order number
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    const orderNumber = `RH-${timestamp}-${random}`

    // Save order to Supabase
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        delivery_zone: deliveryZone,
        address,
        items,
        subtotal,
        delivery_cost: deliveryCost,
        total,
        payment_method: paymentMethod,
        status: 'pendiente',
        notes: notes || null,
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Error guardando la orden: ' + dbError.message }, { status: 500 })
    }

    // Send emails in parallel (fire and forget - don't fail order if email fails)
    const SELLER_EMAIL = process.env.SELLER_EMAIL || process.env.GMAIL_USER || ''
    
    const emailPromises = [
      // Email al vendedor siempre
      SELLER_EMAIL
        ? sendEmail({
            to: SELLER_EMAIL,
            subject: `🆕 Nueva orden ${orderNumber} - $${total.toFixed(2)} - ${customerName}`,
            html: emailVendedor(order),
          })
        : Promise.resolve(),
      // Email al comprador solo si tiene email
      customerEmail
        ? sendEmail({
            to: customerEmail,
            subject: `✅ Confirmación de tu pedido ${orderNumber} - Repuesto Hoy`,
            html: emailComprador(order),
          })
        : Promise.resolve(),
    ]

    // Don't await — send emails async so response is fast
    Promise.allSettled(emailPromises).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`Email ${i} failed:`, r.reason)
        }
      })
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        ...order,
      },
    })
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Error interno: ' + err.message }, { status: 500 })
  }
}

// ─── GET /api/ordenes (para admin) ────────────────────────────────────────
export async function GET(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data })
}
