// Check if a ticket type is eligible for coupons
export const isTicketTypeEligibleForCoupons = (ticketTypeId: string): boolean => {
  // Only player tickets are eligible for coupons
  return ticketTypeId === 'player';
}; 