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

        <div className="flex flex-col items-center mb-6">
          <div className=" flex items-center gap-3">
            <span className={`text-xl ${paymentMethod === 'usd' ? 'font-semibold text-green-500' : 'opacity-50'}`}>$</span>
            <button
              type="button"
              onClick={togglePaymentMethod}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-700 transition-colors"
              aria-label="Toggle payment method"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ml-1 ${paymentMethod === 'btc' ? 'translate-x-6' : ''}`}
              />
            </button>
            <span className={`text-xl ${paymentMethod === 'btc' ? 'font-semibold text-yellow-500' : 'opacity-50'}`}>₿</span>
          </div>
          {paymentMethod === 'btc' && (
            <span className="">
              <span>*Bitcoin purchases are <span className="font-extrabold underline">non-refundable</span> for logistical reasons.</span>
            </span>
          )}
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


