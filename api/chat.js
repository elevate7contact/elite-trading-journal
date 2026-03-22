import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {

    // Guardar trade manual
    if (req.body.saveTrade) {
      var trade = req.body.saveTrade
      if (trade.id && typeof trade.id === 'number' && trade.id > 1000000000) {
        // ID generado localmente, insertar nuevo
        delete trade.id
        await supabase.from('trades').insert(trade)
      } else if (trade.id) {
        // ID de Supabase, actualizar existente
        var id = trade.id
        delete trade.id
        await supabase.from('trades').update(trade).eq('id', id)
      } else {
        await supabase.from('trades').insert(trade)
      }
      return res.status(200).json({ ok: true })
    }

   // Guardar trade automatico desde MT5 (pendiente)
if (req.body.saveTradeAuto) {
  var trade = req.body.saveTradeAuto
  var existing = await supabase.from('trades')
    .select('id')
    .eq('trader_id', trade.trader_id)
    .eq('trade_date', trade.trade_date)
    .eq('pair', trade.pair)
    .eq('pnl', trade.pnl)
    .eq('status', 'pending')
  if (!existing.data || existing.data.length === 0) {
    await supabase.from('trades').insert(trade)
  }
  return res.status(200).json({ ok: true })

    }

    // Completar trade pendiente
    if (req.body.completeTrade) {
      var data = req.body.completeTrade
      var id = data.id
      delete data.id
      await supabase.from('trades').update(data).eq('id', id)
      return res.status(200).json({ ok: true })
    }

    // Guardar cuenta
    if (req.body.saveAccount) {
      var account = req.body.saveAccount
      var result = await supabase.from('accounts').insert(account).select()
      return res.status(200).json(result.data[0])
    }

    // Guardar perfil del trader
    if (req.body.saveTrader) {
      var trader = req.body.saveTrader
      await supabase.from('traders').upsert(trader)
      return res.status(200).json({ ok: true })
    }

    // Guardar mensaje del chat
    if (req.body.saveMessage) {
      var message = req.body.saveMessage
      await supabase.from('chat_messages').insert(message)
      return res.status(200).json({ ok: true })
    }

    // Cargar datos del trader
    if (req.body.loadData) {
      var traderId = req.body.loadData
      var trader = await supabase.from('traders').select('*').eq('id', traderId).single()
      var accounts = await supabase.from('accounts').select('*').eq('trader_id', traderId)
      var trades = await supabase.from('trades').select('*').eq('trader_id', traderId).order('created_at')
      var messages = await supabase.from('chat_messages').select('*').eq('trader_id', traderId).order('created_at')
      return res.status(200).json({
        trader: trader.data,
        accounts: accounts.data,
        trades: trades.data,
        messages: messages.data
      })
    }

    // Verificar trades pendientes (para polling)
    if (req.body.checkPending) {
      var traderId = req.body.checkPending
      var result = await supabase.from('trades').select('*').eq('trader_id', traderId).eq('status', 'pending').order('created_at')
      return res.status(200).json({ pending: result.data || [] })
    }

    // Llamada a la IA
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    })

    var data = await response.json()
    return res.status(200).json(data)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
