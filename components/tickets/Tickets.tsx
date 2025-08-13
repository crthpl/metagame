'use client'

import React, { useState } from 'react';
import { TicketCard } from './TicketCard';

export type PaymentCurrency = 'usd' | 'btc';

export const Tickets: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentCurrency>('usd');

  const togglePaymentMethod = () => {
    setPaymentMethod(prev => (prev === 'usd' ? 'btc' : 'usd'));
  };

  return (
    <section className="mt-4 mb-8" id="tickets">
      <div className="container mx-auto flex flex-col items-center">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-center text-3xl font-bold">Grab a ticket!</h2>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className={`text-sm ${paymentMethod === 'usd' ? 'font-semibold' : 'opacity-70'}`}>USD</span>
          <button
            type="button"
            onClick={togglePaymentMethod}
            className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-700 transition-colors"
            aria-label="Toggle payment method"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ml-1 ${paymentMethod === 'btc' ? 'translate-x-8' : ''}`}
            />
          </button>
          <span className={`text-sm ${paymentMethod === 'btc' ? 'font-semibold' : 'opacity-70'}`}>BTC</span>
        </div>

        <div className="grid grid-cols-1 gap-8 pb-20 md:grid-cols-3">
          <TicketCard ticketTypeId="player" paymentMethod={paymentMethod} />
          <TicketCard ticketTypeId="dayPass" paymentMethod={paymentMethod} />
          <TicketCard ticketTypeId="volunteer" paymentMethod={paymentMethod} />
          <TicketCard ticketTypeId="student" paymentMethod={paymentMethod} />
          <TicketCard ticketTypeId="financialAid" paymentMethod={paymentMethod} />
          <TicketCard ticketTypeId="supporter" paymentMethod={paymentMethod} />
        </div>
      </div>
    </section>
  );
};

export default Tickets;


