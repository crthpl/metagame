# Metagame 2025 - Project Context for Cursor

## 1. Overview

A **Next.js 15** site for the Metagame 2025 conference (collaborative gaming & puzzles).  
Features: speaker profiles, sponsors, interactive games, ticket sales.

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **Payment**: Stripe, OpenNode
- **Package Manager**: pnpm
- **Testing**: Playwright

## Project Structure

### Key Directories

- `app/` - Next.js App Router pages and API routes
- `app/actions/db` - Database server functions available on client
- `components/` - React components (reusable UI elements)
- `content/` - Markdown content (speakers, sponsors, FAQ, sessions)
- `lib/` - Utility functions and data fetching and raw databse serverside service functions
- `config/` - Configuration files
- `public/` - Static assets (images, logos, sounds)

## Common Patterns

### Styling

- Tailwind CSS classes for styling
- Use Shadcn components when possible, except when this
- Custom CSS in `app/globals.css` and component-specific files
- Responsive design with mobile-first approach

### Data Fetching

- Server components for content loading where it makes sense
  -Tanstack query for wrapping server action mutations

## Development Guidelines

### Theming

- Tailwind 4 has no tailwind config and all its parameters live in globals.css
- we have some utility classes like colors on bg-primary for consistent theming. Where possible don't overduplicate classes, e.g. text-primary is set at layout.tsx and doesn't need to be repeated on nested divs unless a parent has overwritten it

### Code Style

- Prefer async/await over promises
- Use kebab-case for file names
- Use PascalCase for React components
- use camelCase for most other naming, except variables which are being piped in to database sdk functions, which should be in snake_case to match their database values

### Component Development

- Create reusable components in `components/`
- Subcomponents specific to a particular route context can live in the route folder
- Follow existing patterns for styling and props
- Test components work across different screen sizes

### Common Issues

- Next.js Image components need proper width/height or container sizing
- Rely on implicit typing from the supabase client over writing manual interfaces
- Tailwind classes may need JIT compilation for dynamic classes

## Legacy Caveats

Early code was LLM-generated and inconsistent.  
Agents may suggest refactors when they sees odd or inconsistent patterns — that’s encouraged.

## Database particulars

Private server methods live in /lib/db/{table_name}.ts. Then we have server actions in app/actions/db/... which wrap those functions for export in wrappers that check the current user and use their id, or check admin status before running aribtrary functions. For standardization and not messing up id orders, all db funcs should take object arguments, even if just a single arg is passed like {userId}. For select functions, we have api routes for better parallel fetching and avoiding server actions for queries.

The Supabase SDK is typed, and the types of all of our tables are available in /types/database/supabase.types.ts with basic ones aliased in /types/database/dbTypeAliases.ts. Whenever possible, avoid creating ad hoc types and interfaces at the component/function level that can either be referenced from the types file, or obviated entirely by relying on the typed return values of supabase function calls.

## Misc

You don't need to try to run build or lint scripts after completing changes; the humans will handle that.
