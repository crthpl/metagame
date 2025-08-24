'use server'

import { adminExportWrapper } from './auth'

import { ticketsService } from '@/lib/db/tickets'
import { usersService } from '@/lib/db/users'

import { createServiceClient } from '@/utils/supabase/service'

export const adminGetAllTickets = adminExportWrapper(
  ticketsService.getAllTickets,
)
export const signupByTicketCode = async ({
  email,
  password,
  ticketCode,
}: {
  email: string
  password: string
  ticketCode: string
}) => {
  const ticket = await ticketsService.getTicketByCode({ code: ticketCode })
  if (!ticket) {
    throw new Error('Ticket not found')
  }
  if (ticket.owner_id) {
    throw new Error('Ticket already has an owner')
  }
  let userId: string
  const supabase = createServiceClient()
  const existingUser = await usersService.getUserProfileByEmail({ email })
  if (existingUser) {
    userId = existingUser.id
  } else {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    })
    if (!user || error) {
      throw new Error('Error signing up new user: ' + error?.message)
    }
    userId = user.id
  }
  await ticketsService.updateTicketOwner({ ticketCode, ownerId: userId })
  return ticket
}
