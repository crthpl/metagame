import type { TicketType } from '../lib/types';

export const TICKET_TYPES: Record<string, TicketType> = {
  npc: {
    id: 'npc',
    title: 'NPC',
    price: 0,
    description: 'Volunteer for 1-6 shifts for a free or reduced price ticket. May preclude participation in the megagame.',
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
  },
  student: {
    id: 'student',
    title: 'Student',
    price: 275,
    regularPrice: 275,
    description: 'Student ticket',
  },
  dayPassFriday: {
    id: 'dayPassFriday',
    title: 'Day Pass: Friday',
    price: 150,
    regularPrice: 150,
    description: 'Single day pass for Friday 9/12',
  },
  dayPassSaturday: {
    id: 'dayPassSaturday',
    title: 'Day Pass: Saturday',
    price: 250,
    regularPrice: 250,
    description: 'Single day pass for Saturday 9/13',
  },
  dayPassSunday: {
    id: 'dayPassSunday',
    title: 'Day Pass: Sunday',
    price: 250,
    regularPrice: 250,
    description: 'Single day pass for Sunday 9/14',
  },
  financialAid: {
    id: 'financialAid',
    title: 'Financial Aid',
    price: 0,
    regularPrice: 0,
    description: 'Financial assistance ticket application coming soon',
  }
};

export const getTicketType = (id: string): TicketType | null => {
  return TICKET_TYPES[id] || null;
};

export const getAllTicketTypes = (): TicketType[] => {
  return Object.values(TICKET_TYPES);
}; 