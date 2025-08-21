import { URLS } from '@/utils/urls';
import Link from 'next/link';

export default function RFPCTA() {
  return (
    <div className="flex justify-center my-8">
      <Link className="flex flex-col items-center bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500 text-black rounded-xl px-4 py-2 text-2xl font-bold" href={URLS.CALL_FOR_SESSIONS}>
        <span className="">Session proposals open until Monday, 8/25!</span>
        <span className="text-base">Click here for submission form</span>
      </Link>
    </div>
  );
}
