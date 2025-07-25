import type { TicketType } from '../lib/types';

export const TICKET_TYPES: Record<string, TicketType> = {
  npc: {
    id: 'npc',
    title: 'NPC',
    price: 0,
    description: 'Volunteer for 1-6 shifts during or leading up to the conference for a free or reduced price ticket. May exclude participation in the megagame.',
    // tooltipText: 'You won\'t get to compete in the megagame, but you will get to help create and run it! Plus other fun stuff like staffing the registration desk and moving monitors from room A to room B and then back to room A again.',
    // features: [
    //   'Volunteer for 6 shifts over the weekend',
    //   'Access to all event activities',
    //   'NPC badge and materials'
    // ]
  },
  player: {
    id: 'player',
    title: 'Player',
    price: 580,
    regularPrice: 580,
    description: 'Full access to the event, including participating in the megagame',
    // features: [
    //   'Full access to all games and activities',
    //   'Event materials and swag',
    //   'Access to exclusive content'
    // ]
  },
  supporter: {
    id: 'supporter',
    title: 'Supporter',
    price: 2048,
    regularPrice: 2048,
    description: 'We will name a game after you',
    // features: [
    //   'All Player benefits',
    //   'We will name a game after you',
    //   'Special recognition at the event',
    //   'VIP access to exclusive areas'
    // ]
  }
};

export const getTicketType = (id: string): TicketType | null => {
  return TICKET_TYPES[id] || null;
};

export const getAllTicketTypes = (): TicketType[] => {
  return Object.values(TICKET_TYPES);
}; 