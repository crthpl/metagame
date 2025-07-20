import React from 'react';

interface TicketFormFieldsProps {
  name: string;
  email: string;
  discordHandle: string;
  couponCode: string;
  volunteerRoles: string[];
  isNpcTicket: boolean;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onDiscordHandleChange: (discordHandle: string) => void;
  onCouponChange: (coupon: string) => void;
  onVolunteerRolesChange: (roles: string[]) => void;
  onApplyCoupon: () => void;
  errors: { name?: string; email?: string; discordHandle?: string; couponCode?: string; volunteerRoles?: string };
  disabled?: boolean;
  isApplyingCoupon?: boolean;
}

// Updated volunteer role options to be shorter
const VOLUNTEER_ROLE_OPTIONS = [
  'Standard conference labor',
  'Game development',
  'Tech support',
  'Physical labor',
  'Childcare',
  'Pre-conference quests',
  'Indifferent'
];

// Descriptions for each role
const VOLUNTEER_ROLE_DESCRIPTIONS: Record<string, string> = {
  'Standard conference labor': 'Registration desk staffing, room setup, general event support',
  'Game development': 'Judging contests, litigating disputes, transferring points between teams',
  'Tech support': 'Helping with technical issues, equipment setup, and troubleshooting',
  'Physical labor': 'Moving equipment, setting up rooms, general physical tasks',
  'Childcare': 'Supervising and entertaining children during the event',
  'Pre-conference quests': 'Helping with pre-event activities and coordination',
  'Indifferent': 'Slot me in anywhere, coach!'
};

export const TicketFormFields: React.FC<TicketFormFieldsProps> = ({
  name,
  email,
  discordHandle,
  couponCode,
  volunteerRoles,
  isNpcTicket,
  onNameChange,
  onEmailChange,
  onDiscordHandleChange,
  onCouponChange,
  onVolunteerRolesChange,
  onApplyCoupon,
  errors,
  disabled = false,
  isApplyingCoupon = false,
}) => {
  const handleVolunteerRoleToggle = (role: string) => {
    const newRoles = volunteerRoles.includes(role)
      ? volunteerRoles.filter(r => r !== role)
      : [...volunteerRoles, role];
    onVolunteerRolesChange(newRoles);
  };

  // Ensure couponCode is always a string
  const safeCouponCode = couponCode || '';

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-600 focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-colors ${
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
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-600 focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-colors ${
            errors.email ? 'border-red-500' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="discordHandle" className="block text-sm font-medium text-gray-300 mb-2">
          Discord Handle (Optional)
        </label>
        <input
          type="text"
          id="discordHandle"
          value={discordHandle}
          onChange={(e) => onDiscordHandleChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-600 focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-colors ${
            errors.discordHandle ? 'border-red-500' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="Enter your Discord handle"
        />
        {errors.discordHandle && (
          <p className="mt-1 text-sm text-red-400">{errors.discordHandle}</p>
        )}
      </div>

      {isNpcTicket && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Volunteer Role Preferences
          </label>
          <p className="text-sm text-gray-400 mb-3">
            We can't guarantee you'll be assigned to the role(s) of your choice, but we'll do our best to accommodate preferences
          </p>
          <div className="space-y-2">
            {VOLUNTEER_ROLE_OPTIONS.map((role) => (
              <label key={role} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={volunteerRoles.includes(role)}
                  onChange={() => handleVolunteerRoleToggle(role)}
                  disabled={disabled}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-gray-800 disabled:opacity-50"
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-300 font-medium">{role}</span>
                  {VOLUNTEER_ROLE_DESCRIPTIONS[role] && (
                    <span className="text-xs text-gray-500 ml-2">
                      {VOLUNTEER_ROLE_DESCRIPTIONS[role]}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
          {errors.volunteerRoles && (
            <p className="mt-1 text-sm text-red-400">{errors.volunteerRoles}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="couponCode" className="block text-sm font-medium text-gray-300 mb-2">
          Coupon Code (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="couponCode"
            value={safeCouponCode}
            onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
            disabled={disabled || isApplyingCoupon}
            className={`flex-1 px-3 py-2 border rounded-md bg-gray-800 text-white border-gray-600 focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none transition-colors ${
              errors.couponCode ? 'border-red-500' : ''
            } ${disabled || isApplyingCoupon ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter coupon code"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            disabled={disabled || isApplyingCoupon || !safeCouponCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isApplyingCoupon ? 'Applying...' : 'Apply'}
          </button>
        </div>
        {errors.couponCode && (
          <p className="mt-1 text-sm text-red-400">{errors.couponCode}</p>
        )}
      </div>
    </div>
  );
}; 