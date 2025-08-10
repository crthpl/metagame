import { TICKET_FINANCIAL_AID_URL, TICKET_VOLUNTEER_URL } from '@/config';
import type { TicketType } from '../lib/types';

// Day pass options for the dropdown
export const DAY_PASS_OPTIONS = [
  {
    id: 'dayPassFriday',
    title: 'Friday 9/12',
    price: 150,
    priceBtc: 0.0011,
    description: 'Single day pass for Friday 9/12'
  },
  {
    id: 'dayPassSaturday', 
    title: 'Saturday 9/13',
    price: 250,
    priceBtc: 0.0018,
    description: 'Single day pass for Saturday 9/13'
  },
  {
    id: 'dayPassSunday', 
    title: 'Sunday 9/14', 
    price: 250,
    priceBtc: 0.0018,
    description: 'Single day pass for Sunday 9/14'
  }
];

export const TICKET_TYPES: Record<string, TicketType> = {
  volunteer: {
    id: 'volunteer',
    title: 'Volunteer',
    price: 0,
    live: true,
    applicationBased: true,
    ticketUrl: TICKET_VOLUNTEER_URL,
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
    priceBtc: .004,
    live: true,
    regularPrice: 580,
    applicationBased: false,
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
    priceBtc: .016,
    regularPrice: 2048,
    applicationBased: false,
    live: true,
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
    priceBtc: .002,
    live: true,
    regularPrice: 275,
    applicationBased: false,
    description: 'Student ticket',
  },
  dayPass: {
    id: 'dayPass',
    title: 'Day Pass',
    price: 150, // Default to Friday price, will be updated based on selection
    priceBtc: .0011,
    live: true,
    regularPrice: 150,
    applicationBased: false,
    description: 'Single day pass - choose your day',
  },
  financialAid: {
    id: 'financialAid',
    title: 'Financial Aid',
    ticketUrl: TICKET_FINANCIAL_AID_URL,
    price: 0,
    live: true,
    regularPrice: 0,
    applicationBased: true,
    description: 'Financial assistance',
  }
};

export const getTicketType = (id: string): TicketType | null => {
  return TICKET_TYPES[id] || null;
};

export const getAllTicketTypes = (): TicketType[] => {
  return Object.values(TICKET_TYPES);
}; 