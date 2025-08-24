import { createServiceClient } from '@/utils/supabase/service'

import { DbTicketInsert } from '@/types/database/dbTypeAliases'

export const ticketsService = {
  getAllTickets: async () => {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('tickets').select('*')
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
  createTicket: async ({
    ticket,
  }: {
    ticket: Omit<DbTicketInsert, 'ticket_code'>
  }) => {
    const supabase = createServiceClient()
    const generatedTicketCode = Array.from({ length: 8 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
        Math.floor(Math.random() * 36),
      ),
    ).join('')
    console.log(ticket)
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ...ticket,
        owner_id: ticket.owner_id || null,
        ticket_code: generatedTicketCode,
      })
      .select()
      .single()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
  getTicketByCode: async ({ code }: { code: string }) => {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_code', code)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
  getTicketsByPurchaserEmail: async ({ email }: { email: string }) => {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('purchaser_email', email)
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
  updateTicketOwner: async ({
    ticketCode,
    ownerId,
  }: {
    ticketCode: string
    ownerId: string
  }) => {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tickets')
      .update({ owner_id: ownerId })
      .eq('ticket_code', ticketCode)
      .select()
      .single()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
}
