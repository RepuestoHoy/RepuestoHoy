// Script para actualizar tipos de productos en Supabase
// Ejecutar con: node scripts/update-product-types.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://knxhboghyxwfsqptghxq.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateProductTypes() {
  console.log('Actualizando tipos de productos...')
  
  // Actualizar economico -> generico
  const { error: error1 } = await supabase
    .from('products')
    .update({ type: 'generico' })
    .eq('type', 'economico')
  
  if (error1) {
    console.error('Error actualizando economico:', error1)
  } else {
    console.log('✅ Económico -> Genérico')
  }
  
  // Actualizar standard -> generico
  const { error: error2 } = await supabase
    .from('products')
    .update({ type: 'generico' })
    .eq('type', 'standard')
  
  if (error2) {
    console.error('Error actualizando standard:', error2)
  } else {
    console.log('✅ Standard -> Genérico')
  }
  
  // Actualizar premium -> original
  const { error: error3 } = await supabase
    .from('products')
    .update({ type: 'original' })
    .eq('type', 'premium')
  
  if (error3) {
    console.error('Error actualizando premium:', error3)
  } else {
    console.log('✅ Premium -> Original')
  }
  
  console.log('Proceso completado.')
}

updateProductTypes()
