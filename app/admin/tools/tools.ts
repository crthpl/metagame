import { DummyTool } from './DummyTool'
import { IssueTicketForm } from './IssueTicketForm'
import TicketsTable from './TicketsTable'

export type AdminTool = {
  label: string
  menuDescription: string
  longDescription: string
  component: React.ComponentType
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
  'tickets-table': {
    label: 'Tickets Table',
    menuDescription: 'View all tickets',
    longDescription: 'View all tickets',
    component: TicketsTable,
  },
} satisfies Record<string, AdminTool>

export type AdminToolId = keyof typeof ADMIN_TOOLS
