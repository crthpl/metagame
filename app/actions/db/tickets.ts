'use server'
import { ticketsService } from "@/lib/db/tickets";
import { usersService } from "@/lib/db/users";

export const signupByTicketCode = async ({email, password, ticketCode}: {email: string, password: string, ticketCode: string}) => {
    const ticket = await ticketsService.getTicketByCode({code: ticketCode});
    if (!ticket) {
        throw new Error("Ticket not found");
    }
    const newUser = await usersService.createUser({email, password});
    await ticketsService.updateTicketOwner({ticketCode, ownerId: newUser.user.id});
    return ticket;
}