# Metagame 2025 - Project Context for Cursor

## Project Overview
This is a Next.js website for the Metagame 2025 conference - a collaborative gaming and puzzle event. The site features speaker profiles, sponsors, interactive games, and ticket purchasing functionality.

## Tech Stack
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + DaisyUI
- **Database**: Supabase
- **Payment**: Stripe
- **Package Manager**: pnpm
- **Testing**: Playwright
- **Content**: Markdown files with gray-matter

## Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Playwright tests
- `pnpm types:supabase` - Generate Supabase types

## Project Structure

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - React components (reusable UI elements)
- `content/` - Markdown content (speakers, sponsors, FAQ, sessions)
- `lib/` - Utility functions and data fetching
- `config/` - Configuration files
- `public/` - Static assets (images, logos, sounds)

### Important Files
- `lib/content.ts` - Content management functions for speakers, sponsors, FAQ
- `components/PartnerCard.tsx` - Sponsor/partner logo display component
- `components/SpeakerCard.tsx` - Speaker profile cards
- `app/layout.tsx` - Root layout with providers
- `middleware.ts` - Supabase auth middleware

## Content Management
Content is stored in markdown files in the `content/` directory:
- `speakers/` - Speaker profiles with frontmatter metadata
- `sponsors/` - Sponsor information 
- `faq/` - FAQ entries
- `sessions/` - Conference session details

## Common Patterns

### Component Props
- Use TypeScript interfaces for prop definitions
- Components often accept `className` for styling flexibility
- Image components use `imgClass` for sizing control

### Styling
- Tailwind CSS classes for styling
- DaisyUI components available
- Custom CSS in `app/globals.css` and component-specific files
- Responsive design with mobile-first approach

### Data Fetching
- Server components for content loading
- Supabase for database operations
- Airtable integration for some data sources

### Image Handling
- Next.js Image component with proper sizing
- SVG assets in `public/logos/` and `public/images/`
- Logo handling in PartnerCard with `wideLogo` flag support

## Development Guidelines

### Theming
- Tailwind 4 has no tailwind config and all its parameters live in globals.css
- we have some utility classes like colors on bg-primary for consistent theming. Where possible don't overduplicate classes, e.g. text-primary is set at layout.tsx and doesn't need to be repeated unless a parent has overwritten it

### Code Style
- Use TypeScript for type safety
- Prefer async/await over promises
- Use kebab-case for file names
- Use PascalCase for React components

### Component Development
- Create reusable components in `components/`
- Use proper TypeScript interfaces
- Follow existing patterns for styling and props
- Test components work across different screen sizes

### Common Issues
- Next.js Image components need proper width/height or container sizing
- Rely on implicit typing from the supabase client over writing manual interfaces
- Tailwind classes may need JIT compilation for dynamic classes

## Querying
Database interaction is to be handled through React Query and Server functions. Functions are organized roughly by table or dataconcern in app/actions/db/\[table\]/{mutations.ts | queries.ts}. It is important to pay attention to what functions are being exported from this file and whether they have Service Client level privileges. Design may be reworked here in the future to use more non-admin client calls once we make more database-mutating functions that we don't want users to have access to. For now the auth flow is to use getCurrentUser and userIsAdmin to gate the execution of anything sensitive. These server functions will typically be called by using a locally scoped useQuery with queryFn being the imported server function. If we have repeatedly used ones, we will put them in hooks/dbQueries for better centralization of cache keys and query/mutation logic. 

## Storage
Storage of static assets should be done though supabase. Like other database queries, server functions for interacting via the superbase client will live in app/actions/db/storage, and similar mindfulness about security of using a service role client should be adhered to. User profile images will be stored using their uuid as filename.

## Existing/legacy code
Much of this site was haphazardly put together in an inexperienced, ad-hod LLM-guided way. Some things are implemented inconsistently or with odd design considerations that no longer apply. Suggestions to refactor code that seems out of place or bizzare or overwrought are welcome.

## LLM Assistance
When Claude code finishes implementing a feature thread, especially in bypass permission mode, it should place a log in the /claude/reports folder summarizing everything done especially mutating changes to database