'use client'

import React, { useState } from 'react';
import { TicketPurchaseForm } from './TicketPurchaseForm';
import { getTicketType, DAY_PASS_OPTIONS } from '../../config/tickets';
import { Modal } from '../Modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TicketCardProps {
  ticketTypeId: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({ 
  ticketTypeId
}) => {
  const [selectedDayPass, setSelectedDayPass] = useState<typeof DAY_PASS_OPTIONS[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [purchaseEmail, setPurchaseEmail] = useState<string>('');
  const [isPurchaseSuccess, setIsPurchaseSuccess] = useState(false);

  const ticketType = getTicketType(ticketTypeId);
  if (!ticketType) {
    return <div>Invalid ticket type</div>;
  }

  // For day pass tickets, calculate price range and use selected day's details
  const isDayPass = ticketTypeId === 'dayPass';
  const dayPassPrices = DAY_PASS_OPTIONS.map(option => option.price);
  const minPrice = Math.min(...dayPassPrices);
  const maxPrice = Math.max(...dayPassPrices);
  const priceRange = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-$${maxPrice}`;
  
  function getDisplayTicketType(ticketTypeId: string, selectedDayPass: typeof DAY_PASS_OPTIONS[0] | null) {
    const ticketType = getTicketType(ticketTypeId);
    if (!ticketType) return null;
  
    if (ticketTypeId === 'dayPass') {
      const price = selectedDayPass?.price ?? Math.min(...DAY_PASS_OPTIONS.map(o => o.price));
      return {
        ...ticketType,
        price,
        regularPrice: price,
        description: selectedDayPass?.description ?? 'Single day pass - choose a day',
        title: selectedDayPass ? `Day Pass: ${selectedDayPass.title}` : 'Day Pass'
      };
    }
  
    if (ticketTypeId === 'volunteer') {
      return {
        ...ticketType,
        price: '0+',
        regularPrice: null
      };
    }
    if (ticketTypeId === 'financialAid') {
      return {
        ...ticketType,
        price: '0-290',
        regularPrice: null
      };
    }
  
    return ticketType;
  }

  const handleBuyNow = () => {
    // If there's a specific URL for this ticket type, redirect to it
    if (ticketType.ticketUrl) {
      window.open(ticketType.ticketUrl, '_blank');
      return;
    }
    
    // For day pass, require selection before proceeding
    if (isDayPass && !selectedDayPass) {
      return;
    }
    
    // Otherwise, show the purchase modal
    setShowModal(true);
    setIsPurchaseSuccess(false);
    setPurchaseEmail('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsPurchaseSuccess(false);
    setPurchaseEmail('');
  };

  const handlePurchaseSuccess = (email: string) => {
    setIsPurchaseSuccess(true);
    setPurchaseEmail(email);
  };

  const handleDayPassChange = (value: string) => {
    const selected = DAY_PASS_OPTIONS.find(option => option.id === value);
    setSelectedDayPass(selected || null);
  };

  const displayTicketType = getDisplayTicketType(ticketTypeId, selectedDayPass);
  if (!displayTicketType) {
    return <div>Invalid ticket type</div>;
  }
  return (
    <>
    <div className="relative group transition-all duration-300">
      <div className="card rounded-md border-amber-400 border-2 transition-all text-center flex flex-col p-6 h-full">
        {/* Ticket Header */}
        <div className="flex-grow flex flex-col">
          <div>
            <h3 className="uppercase text-5xl md:text-3xl font-black text-primary-300">
              {displayTicketType.title}
            </h3>
            
            {/* Day Pass Dropdown */}
            {isDayPass && (
              <div className="mt-3 mb-3 flex justify-center">
                <Select value={selectedDayPass?.id || ""} onValueChange={handleDayPassChange}>
                  <SelectTrigger className="w-fit max-w-xs">
                    <SelectValue placeholder="Choose a day..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_PASS_OPTIONS.map((option) => (
                      <SelectItem 
                        key={option.id} 
                        value={option.id}
                      >
                        {option.title} - ${option.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <p className="mt-3 mb-3 text-cyan-300 font-bold">
                {displayTicketType.description}
            </p>
            {displayTicketType.finePrint && (
              <ul className="mt-3 mb-3 text-xs text-opacity-80 text-left text-cyan-300 list-disc list-outside pl-4">
                <li>{displayTicketType.finePrint}</li>
              </ul>
            )}
            {/* Features List */}
            {displayTicketType.features && displayTicketType.features.length > 0 && (
              <ul className="my-16 text-lg">
                {displayTicketType.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Price Display - pushed to bottom of flex-grow container */}
          <div className="mt-auto">
            {displayTicketType.regularPrice && displayTicketType.price !== displayTicketType.regularPrice ? (
              <div className="text-4xl text-gray-400 relative">
                ${displayTicketType.regularPrice}
                <div className="absolute left-7 right-0 mx-auto w-[65px] top-5 border-b-2 -rotate-[33deg] border-secondary-300" />
              </div>
            ) : (
              <div className="text-4xl text-gray-400 h-0" />
            )}
            
            <p className="my-4 text-6xl md:text-5xl lg:text-6xl font-black text-secondary-300">
              {isDayPass && !selectedDayPass ? priceRange : `$${displayTicketType.price}`}
            </p>
          </div>
        </div>

          {/* Buy/Apply Button */}
          <div className="mt-auto pt-3">
            <div className={`relative inline-block hover:scale-105 transition-all ${
              ticketType.live ? "opacity-100" : "opacity-50 pointer-events-none"
            }`}>
              <div className="bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500 absolute top-0 left-0 right-0 bottom-0 -z-10 opacity-30 blur-lg transform translate-y-1 rounded-md transition-all duration-300 hover:scale-110 hover:scale-y-150">
              </div>
              <button
                onClick={displayTicketType.live && (!isDayPass || selectedDayPass) ? handleBuyNow : undefined}
                disabled={!displayTicketType.live || (isDayPass && !selectedDayPass)}
                className={`bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500 relative rounded-md p-0.5 font-bold ${
                  displayTicketType.live && (!isDayPass || selectedDayPass)
                    ? "transition-all duration-300 bg-[length:200%_200%] bg-[position:-100%_0] hover:bg-[position:100%_0]"
                    : ""
                }`}
              >
                <div className="bg-dark-500 text-white w-full h-full px-12 rounded-md py-3 uppercase transition-all duration-1000 whitespace-nowrap">
                  {ticketType.applicationBased ? 'Apply' : 'Buy Now'}
                </div>
              </button>
            </div>
          </div>
        </div>
    </div>

      {/* Purchase Modal */}
      {showModal && (
        <Modal onClose={handleCloseModal} className="w-full max-w-2xl">
          <div className="bg-dark-500 border border-gray-700 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <TicketPurchaseForm
              ticketType={ticketType}
              onClose={handleCloseModal}
              onSuccess={(email: string) => handlePurchaseSuccess(email)}
            />
          </div>
        </Modal>
      )}
    </>
  );
}; 