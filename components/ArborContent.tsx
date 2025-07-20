import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Arbor',
  description: 'Learn about the Arbor team - curious about markets, pedagogy, and game design',
};

export default function ArborContent() {
  return (
    <main className="dark:text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-6 text-secondary-200">Arbor</h1>
        </section>

        {/* Projects Section */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="bg-dark-500 p-8 text-xl">
            Arbor is a team of people curious about markets, pedagogy, and game design, run by{' '}
            <a 
              href="https://rickiheicklen.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary-500 hover:text-fuchsia-500 hover:underline transition-colors"
            >
              Ricki Heicklen
            </a>
            .
            <br/>
            <br/>
            Some projects of ours include:
            <ul className="space-y-6 text-gray-300 leading-relaxed mt-6 text-lg">
              <li className="flex items-start">
                <span className="text-secondary-200 mr-3">•</span>
                <span>
                  A{' '}
                  <a 
                    href="https://trading.camp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary-500 hover:text-fuchsia-500 hover:underline transition-colors"
                  >
                    trading bootcamp
                  </a>
                  , where we teach how to think like a trader using a play-money economy and trading games
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-200 mr-3">•</span>
                <span>
                  A{' '}
                  <a 
                    href="https://arborsummer.camp/incubator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary-500 hover:text-fuchsia-500 hover:underline transition-colors"
                  >
                    pedagogy incubator
                  </a>
                  , helping people with good ideas turn those into bootcamps and workshops
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-200 mr-3">•</span>
                <span>
                  A{' '}
                  <Link 
                    href="/?arbor-metagame=true" 
                    className="text-secondary-500 hover:text-fuchsia-500 hover:underline transition-colors"
                  >
                    game design conference
                  </Link>
                  {' '}in Berkeley, CA this September
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact Section - commented out in original
        <section className="text-center mt-16">
          <p className="text-gray-300">
            Interested in working with us?{' '}
            <a 
              href="mailto:hello@arbor.com" 
              className="text-secondary-500 hover:text-fuchsia-500 hover:underline transition-colors"
            >
              Get in touch
            </a>
          </p>
        </section> */}
      </div>
    </main>
  );
} 