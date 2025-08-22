import HomePageWrapper from '@/components/HomePageWrapper'
import PacmanAnimation from '@/components/PacmanAnimation'
import SetAnimation from '@/components/Set/SetAnimation'
import Sponsors from '@/components/Sponsors'
import Calendar from '@/components/sections/home/Calendar'
import { ContactUs } from '@/components/sections/home/ContactUs'
import GetInvolved from '@/components/sections/home/GetInvolved'
import { Hero } from '@/components/sections/home/Hero'
import ScheduleSection from '@/components/sections/home/ScheduleSection'
import Speakers from '@/components/sections/home/Speakers'
import Tickets from '@/components/tickets/Tickets'

export default function Home() {
  return (
    <HomePageWrapper>
      <main>
        <div className="container mx-auto px-4">
          <Hero />
          <Calendar />
          <GetInvolved />
          <ScheduleSection />
          <Speakers />
          <Sponsors />
          <div id="set-animation">
            <SetAnimation />
          </div>
          <Tickets />
        </div>
        <PacmanAnimation />
        <div className="container mx-auto px-4">
          <ContactUs />
        </div>
      </main>
    </HomePageWrapper>
  )
}
