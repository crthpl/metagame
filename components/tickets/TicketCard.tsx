'use client'

import React, { useState } from 'react';
import { TicketPurchaseForm } from './TicketPurchaseForm';
import { getTicketType } from '../../config/tickets';
import {
  TICKET_EARLY_BIRD_URL,
  TICKET_REGULAR_URL,
  TICKET_SUPPORTER_URL,
  TICKET_VOLUNTEER_URL
} from '../../config';

interface TicketCardProps {
  ticketTypeId: string;
  onPurchaseSuccess?: () => void;
}


export const TicketCard: React.FC<TicketCardProps> = ({ 
  ticketTypeId, 
  onPurchaseSuccess 
}) => {
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const ticketType = getTicketType(ticketTypeId);
  if (!ticketType) {
    return <div>Invalid ticket type</div>;
  }

  // Map ticketTypeId to Stripe URL - only for specific ticket types that should redirect
  const ticketUrl =
    ticketTypeId === 'early_bird' ? TICKET_EARLY_BIRD_URL :
    ticketTypeId === 'supporter' ? TICKET_SUPPORTER_URL :
    ticketTypeId === 'regular' ? TICKET_REGULAR_URL :
    ticketTypeId === 'npc' ? TICKET_VOLUNTEER_URL :
    '';

  const handleBuyNow = () => {
    // If there's a specific URL for this ticket type, redirect to it
    if (ticketUrl) {
      window.open(ticketUrl, '_blank');
      return;
    }
    
    // Otherwise, show the purchase form
    setIsExpanded(true);
    setShowPurchaseForm(true);
  };

  const handleClose = () => {
    setShowPurchaseForm(false);
    setIsExpanded(false);
  };

  const handleSuccess = () => {
    setShowPurchaseForm(false);
    setIsExpanded(false);
    onPurchaseSuccess?.();
  };

  // Check if this is a volunteer ticket
  const isVolunteerTicket = ticketTypeId === 'npc';

  return (
    <div className={`relative group transition-all duration-300 ${
      isExpanded ? 'md:col-span-3' : ''
    }`}>
      <div className="card rounded-md border-amber-400 border-2 transition-all text-center flex flex-col p-6 h-full">
        {/* Ticket Header */}
        <div className="flex-grow flex flex-col">
          <div>
            <h3 className="uppercase text-5xl md:text-3xl font-black text-primary-300">
              {ticketType.title}
            </h3>
            
            <p className="mt-3 mb-3 text-cyan-300 font-bold">
                {ticketType.description}
            </p>
            {ticketType.finePrint && (
              <ul className="mt-3 mb-3 text-xs text-opacity-80 text-left text-cyan-300 list-disc list-outside pl-4">
                <li>{ticketType.finePrint}</li>
              </ul>
            )}
            {/* Features List */}
            {ticketType.features && ticketType.features.length > 0 && (
              <ul className="my-16 text-lg">
                {ticketType.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Price Display - pushed to bottom of flex-grow container */}
          <div className="mt-auto">
            {ticketType.regularPrice && ticketType.price !== ticketType.regularPrice ? (
              <div className="text-4xl text-gray-400 relative">
                ${ticketType.regularPrice}
                <div className="absolute left-7 right-0 mx-auto w-[65px] top-5 border-b-2 -rotate-[33deg] border-secondary-300" />
              </div>
            ) : (
              <div className="text-4xl text-gray-400 h-0" />
            )}
            
            <p className="my-4 text-6xl md:text-5xl lg:text-6xl font-black text-secondary-300">
              {`${ticketType.price > 0 ?  "$" + ticketType.price : ""}`}
            </p>
          </div>
        </div>

        {/* Purchase Form or Buy/Apply Button */}
        <div className="mt-auto pt-3">
          {showPurchaseForm ? (
            <div className="border-t border-gray-700 pt-4 mt-4 text-left">
              <TicketPurchaseForm
                ticketType={ticketType}
                onClose={handleClose}
                onSuccess={handleSuccess}
              />
            </div>
          ) : (
            <div className="relative inline-block hover:scale-105 transition-all">
              <div className="bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500 absolute top-0 left-0 right-0 bottom-0 -z-10 opacity-30 blur-lg transform translate-y-1 rounded-md transition-all duration-300 hover:scale-110 hover:scale-y-150">
              </div>
              <button
                onClick={handleBuyNow}
                className="bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500 relative transition-all duration-300 rounded-md p-0.5 font-bold bg-[length:200%_200%] bg-[position:-100%_0] hover:bg-[position:100%_0]"
              >
                <div className="bg-dark-500 text-white w-full h-full px-12 rounded-md py-3 uppercase transition-all duration-1000 whitespace-nowrap">
                  {isVolunteerTicket ? 'Apply' : 'Buy Now'}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 