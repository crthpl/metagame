import SetAnimation from "../components/Set/SetAnimation";
import Tickets from "@/components/tickets/Tickets";
import Sponsors from "@/components/Sponsors";
import { Hero } from "@/components/sections/home/Hero";
import Calendar from "@/components/sections/home/Calendar";
import GetInvolved from "@/components/sections/home/GetInvolved";
import Speakers from "@/components/sections/home/Speakers";
import { ContactUs } from "@/components/sections/home/ContactUs";
import HomePageWrapper from "@/components/HomePageWrapper";
import PacmanAnimation from "@/components/PacmanAnimation";
// import Schedule from "./schedule/Schedule";

export default function Home() {
  return (
    <HomePageWrapper>
      <main>
        <div className="container mx-auto px-4">
          <Hero />
          <Calendar />
          <GetInvolved />
          <Speakers />
          {/* <div className="h-[calc(100vh-150px)] w-fit max-w-full overflow-hidden">
            <div className="container mx-auto max-w-7xl h-full flex flex-col border border-secondary-300 rounded-xl overflow-y-auto">
              <Schedule
              />
            </div>
          </div> */}
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
