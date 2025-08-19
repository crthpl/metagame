import { Button } from './Button';

interface FAQ {
  id: number;
  question: string;
  contentHtml: React.ReactNode;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "Who is organizing this event?",
    contentHtml:
      <p>Ricki Heicklen and the <a href="/arbor">Arbor</a> team, as well as many, many others. More information coming soon!</p>,
  },
  {
    id: 2,
    question: "Where will it be?",
    contentHtml:
     <>
      <p><a href="https://lighthaven.space" target="_blank">Lighthaven Campus</a>, Berkeley, CA</p>
      <p>Address: 2740 Telegraph Ave, Berkeley, CA 94705</p>
     </>,
  },
  {
    id: 3,
    question: "Do you have day passes?",
    contentHtml:
      <p>Not right now, but we might add them. If you are interested in day passes, please <a href="https://bit.ly/metagame-interest" target="_blank">let us know</a>!</p>,
  },
  {
    id: 4,
    question: "Do you offer any discounts?",
    contentHtml: 
      <>
      <p>Yes, we offer several discount options:</p>
      <ul>
        <li><strong>Early Bird</strong>: We have tiered pricing that increases over time. I once tried to do <a href="https://bayesshammai.substack.com/i/147141321/weird-experimental-pricing-scheme" target="_blank"> an exponential pricing system</a> based on what number ticket you purchased and it was a huge mess. So this one just has date cutoffs.</li>
        <li><strong>NPC (Volunteer ticket)</strong>: Volunteers work 6 shifts over the weekend in exchange for a substantially reduced ticket price. They help staff the front desk, run the Megagame, make sure sessions are going smoothly, and do various other tasks that need to be done.</li>
        <li><strong>Hidden discounts</strong>: There are plenty of easter eggs throughout the site that will unlock discounts. Each discount code will only be available a limited number of times.</li>
        <li><strong>Community Partner Discount</strong>{`: If you want to be a major sponsor, we'll give you a free ticket, for a confusing notion of "free".`}</li>
      </ul>
    </>,
  },
  {
    id: 5,
    question: "Are children welcome at Metagame?",
    contentHtml:
      <>
        <p>Yes! We&apos;d love to see more children around, and kids under 13 attend Metagame for free. If you&apos;re bringing children, please register them by <strong>September 1st</strong>.</p>  
        <p>In addition, childcare and children&apos;s programming for kids ages 5-12 will be available free of charge during the following hours:</p>
        <ul>
          <li><strong>Friday:</strong> 3pm-7pm (flexible dropoff & pickup)</li>
          <li><strong>Saturday:</strong> 9:45am-3pm (dropoff 9:45am-10am, pickup 2:45pm-3pm)</li>
          <li><strong>Saturday:</strong> 5pm-7:30pm (dropoff 5pm-5:15pm, pickup 7:15pm-7:30pm)</li>
          <li><strong>Sunday:</strong> 9:45am-3pm (dropoff 9:45am-10am, pickup 2:45pm-3pm)</li>
          <li><strong>Sunday:</strong> 5pm-7:30pm (dropoff 5pm-5:15pm, pickup 7:15pm-7:30pm)</li>
        </ul>
        <p>See the <a href="/schedule" target="_blank">schedule</a> for more details.</p>
        <div className="mt-4 text-center">
          <Button 
            link="https://airtable.com/appTvPARUssZp4qiB/pagZ9WbXLji0eBqDU/form"
            target="_blank"
            className="inline-block"
          >
            Register Your Children
          </Button>
        </div>
      </>,
  },
  {
    id: 6,
    question: "I have another question",
    contentHtml:
      <p>Let us know <a href="https://bit.ly/metagame-interest" target="_blank">here</a>!</p>,
  },
];

export default function FAQ() {
  return (
    <div className="max-w-prose py-20 flex flex-col gap-5">
      <h1 className="text-secondary-300 text-2xl font-black text-center pb-8">
        Frequently Asked Questions
      </h1>
      {faqs.map((faq) => (
        <div key={faq.id} className="collapse collapse-plus bg-base-200">
          <input type="checkbox" name={`accordion-${faq.id}`} />
          <div className="collapse-title text-xl font-medium">
            {faq.question}
          </div>
          <div className="collapse-content prose prose-xl">
            <article 
              className="prose">
                {faq.contentHtml}
              </article>
          </div>
        </div>
      ))}
    </div>
  );
} 