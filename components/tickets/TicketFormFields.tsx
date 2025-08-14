import { TicketPurchaseFormData } from '@/lib/schemas/ticket';
import React from 'react';

interface TicketFormFieldsProps {
  formData: TicketPurchaseFormData;
  onFormDataChange: (field: keyof TicketFormFieldsProps['formData'], value: string) => void;
  onApplyCoupon: () => void;
  errors: { name?: string; email?: string; discordHandle?: string; couponCode?: string };
  disabled?: boolean;
  isApplyingCoupon?: boolean;
  couponsEnabled?: boolean;
}



export const TicketFormFields: React.FC<TicketFormFieldsProps> = ({
  formData,
  onFormDataChange,
  onApplyCoupon,
  errors,
  disabled = false,
  isApplyingCoupon = false,
  couponsEnabled = true,
}) => {

  // Ensure couponCode is always a string
  const safeCouponCode = formData.couponCode || '';

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange('name', e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md bg-bg-secondary  border-gray-600 focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-colors ${
            errors.name ? 'border-red-500' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onFormDataChange('email', e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md bg-bg-secondary border-gray-600 focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-colors ${
            errors.email ? 'border-red-500' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>


      {couponsEnabled && (
        <div>
          <label htmlFor="couponCode" className="block text-sm font-medium text-gray-300 mb-2">
            Coupon Code (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="couponCode"
              value={safeCouponCode}
              onChange={(e) => onFormDataChange('couponCode', e.target.value.toUpperCase())}
              disabled={disabled || isApplyingCoupon}
              className={`flex-1 px-3 py-2 border rounded-md bg-gray-800  border-gray-600 focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-colors ${
                errors.couponCode ? 'border-red-500' : ''
              } ${disabled || isApplyingCoupon ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Enter coupon code"
            />
            <button
              type="button"
              onClick={onApplyCoupon}
              disabled={disabled || isApplyingCoupon || !safeCouponCode.trim()}
              className="px-4 py-2 bg-blue-600  rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {errors.couponCode && (
            <p className="mt-1 text-sm text-red-400">{errors.couponCode}</p>
          )}
        </div>
      )}
    </div>
  );
}; 