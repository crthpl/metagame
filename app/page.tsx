import SetAnimation from "@/components/Set/SetAnimation";
import Tickets from "@/components/tickets/Tickets";
import Sponsors from "@/components/Sponsors";
import { Hero } from "@/components/sections/home/Hero";
import Calendar from "@/components/sections/home/Calendar";
import GetInvolved from "@/components/sections/home/GetInvolved";
import Speakers from "@/components/sections/home/Speakers";
import { ContactUs } from "@/components/sections/home/ContactUs";
import HomePageWrapper from "@/components/HomePageWrapper";
import PacmanAnimation from "@/components/PacmanAnimation";
import ScheduleSection from "@/components/sections/home/ScheduleSection";

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
  );
}
