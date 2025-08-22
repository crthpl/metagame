import Link from 'next/link'

import { URLS } from '@/utils/urls'

export default function RFPCTA() {
  return (
    <div className="my-8 flex justify-center">
      <Link
        className="flex flex-col items-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500 px-4 py-2 text-2xl font-bold text-black"
        href={URLS.CALL_FOR_SESSIONS}
      >
        <span className="">Session proposals open until Monday, 8/25!</span>
        <span className="text-base">Click here for submission form</span>
      </Link>
    </div>
  )
}
