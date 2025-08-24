'use client'

import { useState } from 'react'

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Textarea } from '@/components/ui/textarea'

import { DbProfile, DbTicket } from '@/types/database/dbTypeAliases'

interface ProfileDataCollapsibleProps {
  profile: DbProfile
  tickets: DbTicket[]
}

export function ProfileDataCollapsible({
  profile,
  tickets,
}: ProfileDataCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)

  const combinedData = {
    ...profile,
    tickets,
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border border-gray-300 rounded-md">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-3 text-lef rounded-md">
          <span className="text-sm font-medium">Raw Profile Data</span>
          {isOpen ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3">
          <Textarea
            value={JSON.stringify(combinedData, null, 2)}
            readOnly
            className="min-h-64 font-mono text-xs"
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
