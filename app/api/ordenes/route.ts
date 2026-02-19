import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// ─── Configuración Resend ──────────────────────────────────────────
const FROM_EMAIL = 'ventas@repuestohoy.com'
const FROM_NAME = 'RepuestoHoy'

let resendInstance: Resend | null = null
function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY no está configurada')
      return null
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

// ─── Función para enviar WhatsApp ─────────────────────────────────────────
async function sendWhatsApp(
  phoneNumber: string,
  customerName: string,
  orderNumber: string,
  paymentMethod: string
) {
  try {
    // Limpiar número de teléfono (quitar + y espacios)
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    
    // Mensaje personalizado
    const message = `Hola ${customerName.split(' ')[0]} 👋\n\n¡Gracias por tu compra en Repuesto Hoy! 🚗\n\nHemos recibido tu pedido #${orderNumber} correctamente ✅\n\nQueremos agradecerte por confiar en nosotros 🙌\n\nPara continuar con el proceso de envío, por favor envíanos:\n\n📄 El comprobante de pago${paymentMethod === 'efectivo' ? ' (si aplica)' : ''}\n📍 Tu ubicación exacta por Google Maps\n\nUna vez recibamos esta información, procederemos con tu despacho lo antes posible 🚚\n\n¿Tienes dudas? Escríbenos aquí mismo.\n\n¡Gracias nuevamente por tu confianza! 💙\n\n_Repuesto Hoy - Caracas_`

    // Usar CallMeBot API (gratuita)
    const apiKey = process.env.CALLMEBOT_API_KEY || '123456' // API key de ejemplo
    const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`
    
    // Hacer la petición
    const response = await fetch(url, { method: 'GET' })
    
    if (response.ok) {
      console.log(`✅ WhatsApp enviado a ${phoneNumber}`)
      return { success: true }
    } else {
      console.error(`❌ Error enviando WhatsApp: ${response.status}`)
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error: any) {
    console.error('Error sending WhatsApp:', error)
    return { success: false, error: error.message }
  }
}

// ─── Función para loguear emails ───────────────────────────────────────────
async function logEmail(
  orderId: string,
  emailType: string,
  recipientEmail: string,
  subject: string,
  status: 'pending' | 'sent' | 'failed',
  errorMessage?: string
) {
  if (!supabaseAdmin) return

  try {
    await supabaseAdmin.from('email_logs').insert([{
      order_id: orderId,
      email_type: emailType,
      recipient: recipientEmail,
      subject,
      status,
      error_message: errorMessage || null,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    }])
  } catch (err) {
    console.error('Error logging email:', err)
  }
}

// ─── Función para enviar email ─────────────────────────────────────────────
async function sendEmail({
  orderId,
  emailType,
  to,
  subject,
  html,
}: {
  orderId: string
  emailType: string
  to: string
  subject: string
  html: string
}) {
  try {
    const resend = getResend()
    if (!resend) {
      const errorMsg = 'Resend no está configurado (falta RESEND_API_KEY)'
      console.error(errorMsg)
      await logEmail(orderId, emailType, to, subject, 'failed', errorMsg)
      return { success: false, error: errorMsg }
    }

    // Log inicial como pending
    await logEmail(orderId, emailType, to, subject, 'pending')

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      await logEmail(orderId, emailType, to, subject, 'failed', error.message)
      return { success: false, error: error.message }
    }

    // Log éxito
    await logEmail(orderId, emailType, to, subject, 'sent')
    console.log(`✅ Email ${emailType} enviado a ${to}:`, data?.id)
    
    return { success: true, messageId: data?.id }
  } catch (error: any) {
    console.error('Error sending email:', error)
    await logEmail(orderId, emailType, to, subject, 'failed', error.message)
    return { success: false, error: error.message }
  }
}

// ─── Plantilla email cliente ───────────────────────────────────────────────
function emailTemplateCliente(order: any) {
  const items = order.items?.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
    </tr>
  `).join('') || ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pedido Confirmado</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #E10600; margin-bottom: 10px;">✅ ¡Pedido Confirmado!</h1>
    <p style="font-size: 18px; color: #666;">Gracias por tu compra</p>
  </div>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #111;">Pedido #${order.order_number}</h2>
    <p><strong>Estado:</strong> <span style="color: #E10600; font-weight: bold;">Pendiente de pago</span></p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-VE')}</p>
  </div>

  <h3 style="color: #111;">Detalle de productos:</h3>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background: #111; color: white;">
        <th style="padding: 10px; text-align: left;">Producto</th>
        <th style="padding: 10px; text-align: center;">Cantidad</th>
        <th style="padding: 10px; text-align: right;">Precio</th>
      </tr>
    </thead>
    <tbody>
      ${items}
    </tbody>
  </table>

  <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${order.subtotal?.toFixed(2)}</p>
    <p style="margin: 5px 0;"><strong>Envío:</strong> $${order.delivery_cost?.toFixed(2) || '0.00'}</p>
    <p style="margin: 5px 0; font-size: 18px; color: #E10600;"><strong>Total:</strong> $${order.total?.toFixed(2)}</p>
  </div>

  <div style="border-left: 4px solid #E10600; padding-left: 15px; margin-bottom: 20px;">
    <h3 style="margin-top: 0;">📍 Datos de entrega:</h3>
    <p><strong>Nombre:</strong> ${order.customer_name}</p>
    <p><strong>Teléfono:</strong> ${order.customer_phone}</p>
    <p><strong>Dirección:</strong> ${order.address}</p>
    <p><strong>Zona:</strong> ${order.delivery_zone}</p>
  </div>

  <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #2e7d32;">💳 Método de pago:</h3>
    <p style="margin: 0;">${order.payment_method === 'pago_movil' ? 'Pago Móvil' : order.payment_method === 'zelle' ? 'Zelle' : 'Efectivo'}</p>
    ${order.comprobante_url ? '<p style="color: #2e7d32; margin: 10px 0 0;">✓ Comprobante recibido</p>' : ''}
  </div>

  <!-- Spam Warning -->
  <div style="background: #fff8e1; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; color: #856404; font-weight: bold; text-align: center;">
      📧 ¿No ves este email en tu bandeja de entrada?
    </p>
    <p style="margin: 10px 0 0 0; color: #856404; text-align: center; font-size: 14px;">
      Revisa tu carpeta de <strong>Spam</strong> o <strong>Promociones</strong>. 
      Añade <em>ventas@repuestohoy.com</em> a tus contactos para recibir nuestros emails sin problemas.
    </p>
  </div>

  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
    <p style="color: #666;">Nos pondremos en contacto contigo para coordinar la entrega.</p>
    <p style="color: #666;">¿Tienes dudas? Escríbenos por WhatsApp: +58 412-2223775</p>
    <a href="https://repuestohoy.com" style="display: inline-block; margin-top: 15px; padding: 12px 30px; background: #E10600; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Visitar tienda</a>
  </div>
</body>
</html>
  `
}

// ─── Plantilla email admin ─────────────────────────────────────────────────
function emailTemplateAdmin(order: any) {
  const items = order.items?.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
    </tr>
  `).join('') || ''

  const comprobanteSection = order.comprobante_url ? `
    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #2e7d32;">📎 Comprobante de pago:</h3>
      <a href="${order.comprobante_url}" style="color: #2e7d32; text-decoration: underline; font-weight: bold;">Ver comprobante</a>
    </div>
  ` : `
    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #e65100;">⚠️ Sin comprobante</h3>
      <p>El cliente no ha subido comprobante de pago todavía.</p>
    </div>
  `

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nueva Orden</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #E10600; margin-bottom: 10px;">🛒 ¡NUEVA ORDEN!</h1>
    <p style="font-size: 18px; color: #666;">Se ha recibido un nuevo pedido</p>
  </div>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #111;">Pedido #${order.order_number}</h2>
    <p><strong>Estado:</strong> <span style="color: #E10600; font-weight: bold;">${order.status}</span></p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-VE')}</p>
  </div>

  <div style="border-left: 4px solid #E10600; padding-left: 15px; margin-bottom: 20px;">
    <h3 style="margin-top: 0;">👤 Cliente:</h3>
    <p><strong>Nombre:</strong> ${order.customer_name}</p>
    <p><strong>Teléfono:</strong> <a href="https://wa.me/${order.customer_phone?.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none;">${order.customer_phone}</a></p>
    <p><strong>Email:</strong> ${order.customer_email || 'No proporcionado'}</p>
  </div>

  <div style="border-left: 4px solid #111; padding-left: 15px; margin-bottom: 20px;">
    <h3 style="margin-top: 0;">📍 Entrega:</h3>
    <p><strong>Dirección:</strong> ${order.address}</p>
    <p><strong>Zona:</strong> ${order.delivery_zone}</p>
  </div>

  <h3 style="color: #111;">🛍️ Productos:</h3>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background: #111; color: white;">
        <th style="padding: 10px; text-align: left;">Producto</th>
        <th style="padding: 10px; text-align: center;">Cantidad</th>
        <th style="padding: 10px; text-align: right;">Precio</th>
      </tr>
    </thead>
    <tbody>
      ${items}
    </tbody>
  </table>

  <div style="background: #111; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${order.subtotal?.toFixed(2)}</p>
    <p style="margin: 5px 0;"><strong>Envío:</strong> $${order.delivery_cost?.toFixed(2) || '0.00'}</p>
    <p style="margin: 5px 0; font-size: 20px;"><strong>TOTAL: $${order.total?.toFixed(2)}</strong></p>
  </div>

  <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top: 0;">💳 Pago:</h3>
    <p style="margin: 0;"><strong>Método:</strong> ${order.payment_method === 'pago_movil' ? 'Pago Móvil' : order.payment_method === 'zelle' ? 'Zelle' : 'Efectivo'}</p>
  </div>

  ${comprobanteSection}

  <div style="text-align: center; margin-top: 30px;">
    <a href="https://repuestohoy.com/admin" style="display: inline-block; padding: 12px 30px; background: #E10600; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver en Admin</a>
  </div>
</body>
</html>
  `
}

// ─── POST - Crear orden ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
      comprobanteUrl,
    } = body
    
    // Mapear camelCase a snake_case para la base de datos
    const comprobante_url = comprobanteUrl

    // Validaciones
    if (!customerName || !customerPhone || !address || !deliveryZone || !paymentMethod) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar comprobante para Pago Móvil/Zelle
    if ((paymentMethod === 'pago_movil' || paymentMethod === 'zelle') && !comprobante_url) {
      return NextResponse.json(
        { error: 'El comprobante de pago es obligatorio para Pago Móvil y Zelle' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Generar número de orden
    const orderNumber = `RH-${Date.now().toString(36).toUpperCase()}`

    // Crear orden en la base de datos
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        items,
        subtotal,
        delivery_cost: deliveryCost,
        total,
        delivery_zone: deliveryZone,
        address,
        payment_method: paymentMethod,
        notes,
        status: comprobante_url ? 'confirmado' : 'pendiente',
        comprobante_url,
        comprobante_subido_at: comprobante_url ? new Date().toISOString() : null,
      }])
      .select()
      .single()

    if (dbError || !order) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Error al crear la orden' },
        { status: 500 }
      )
    }

    // Enviar emails
    const emailResults = []

    // Email al cliente
    if (customerEmail) {
      console.log(`📧 Enviando email al cliente: ${customerEmail}`)
      const clienteResult = await sendEmail({
        orderId: order.id,
        emailType: 'cliente',
        to: customerEmail,
        subject: `✅ Pedido confirmado #${orderNumber}`,
        html: emailTemplateCliente(order),
      })
      emailResults.push({ type: 'cliente', result: clienteResult })
      
      if (!clienteResult.success) {
        console.error('❌ Error enviando email al cliente:', clienteResult.error)
      } else {
        console.log('✅ Email al cliente enviado correctamente')
      }
    } else {
      console.log('⚠️ No hay email de cliente, no se envía confirmación')
    }

    // Email a ventas
    console.log('📧 Enviando email a ventas@repuestohoy.com')
    const adminResult = await sendEmail({
      orderId: order.id,
      emailType: 'admin',
      to: 'ventas@repuestohoy.com',
      subject: `🛒 Nueva orden #${orderNumber}`,
      html: emailTemplateAdmin(order),
    })
    emailResults.push({ type: 'admin', result: adminResult })
    
    if (!adminResult.success) {
      console.error('❌ Error enviando email a ventas:', adminResult.error)
    } else {
      console.log('✅ Email a ventas enviado correctamente')
    }

    // Enviar WhatsApp al cliente
    if (customerPhone) {
      console.log(`📱 Enviando WhatsApp a: ${customerPhone}`)
      const whatsappResult = await sendWhatsApp(
        customerPhone,
        customerName,
        orderNumber,
        paymentMethod
      )
      
      if (!whatsappResult.success) {
        console.error('❌ Error enviando WhatsApp:', whatsappResult.error)
      } else {
        console.log('✅ WhatsApp enviado correctamente')
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: orderNumber,
        status: order.status,
      },
    })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ─── PATCH - Actualizar comprobante ────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, comprobanteUrl } = body

    if (!orderId || !comprobanteUrl) {
      return NextResponse.json(
        { error: 'Faltan orderId o comprobanteUrl' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Actualizar orden
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .update({
        comprobante_url: comprobanteUrl,
        comprobante_subido_at: new Date().toISOString(),
        status: 'confirmado',
      })
      .eq('id', orderId)
      .select()
      .single()

    if (dbError || !order) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Error al actualizar la orden' },
        { status: 500 }
      )
    }

    // Reenviar email admin con comprobante
    await sendEmail({
      orderId: order.id,
      emailType: 'admin_update',
      to: 'ventas@repuestohoy.com',
      subject: `📎 Comprobante recibido #${order.order_number}`,
      html: emailTemplateAdmin(order),
    })

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error: any) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
