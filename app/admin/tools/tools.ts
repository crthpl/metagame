import { DummyTool } from './DummyTool'
import TicketsInfo from './TicketsInfo'
import { IssueTicketForm } from './issue-tickets/IssueTicketForm'
import UserProfileTool from './user-profile/UserProfileTool'

export type AdminTool = {
  label: string
  menuDescription: string
  longDescription: string
  component: React.ComponentType<{
    searchParams?: Promise<Record<string, string | undefined>>
  }>
}
// Define the admin tools configuration as an object mapping
export const ADMIN_TOOLS = {
  'dummy-tool': {
    label: 'Dummy Tool',
    menuDescription: 'short menu description',
    longDescription:
      'Longer tool card description: this tool does nothing but take a couple of inputs and log them to the console with a toast message to show that the admin tool selector displays tools and performs actions.',
    component: DummyTool,
  },
  'issue-ticket': {
    label: 'Issue Ticket',
    menuDescription: 'Issue a ticket to a user',
    longDescription: 'Issue a ticket to a user',
    component: IssueTicketForm,
  },
  'tickets-info': {
    label: 'Tickets Info',
    menuDescription: 'View all tickets',
    longDescription: 'View all tickets and their stats',
    component: TicketsInfo,
  },
  'user-profile': {
    label: 'User Profile Viewer',
    menuDescription: 'View user profiles',
    longDescription:
      'Select and view detailed information for any user profile in the system',
    component: UserProfileTool,
  },
} satisfies Record<string, AdminTool>

export type AdminToolId = keyof typeof ADMIN_TOOLS
