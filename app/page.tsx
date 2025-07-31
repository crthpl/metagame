import SetAnimation from "../components/Set/SetAnimation";
import { TicketCard } from "@/components/tickets/TicketCard";
import Sponsors from "@/components/Sponsors";
import { Hero } from "@/components/sections/home/Hero";
import Calendar from "@/components/sections/home/Calendar";
import GetInvolved from "@/components/sections/home/GetInvolved";
import SpeakersWrapper from "@/components/sections/home/SpeakersWrapper";
import { ContactUs } from "@/components/sections/home/ContactUs";
import HomePageWrapper from "@/components/HomePageWrapper";
import PacmanAnimation from "@/components/PacmanAnimation";
// import Schedule from "./schedule/Schedule";

export default function Home() {
  return (
    <HomePageWrapper>
      <main className="dark:text-white">
        <div className="container mx-auto px-4 flex flex-col items-center gap-8">
          <Hero />
          <Calendar />
          <GetInvolved />
          <SpeakersWrapper />
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
          <section className="mb-8 bg-dark-500 mt-4" id="tickets">
            <div className="container mx-auto flex flex-col items-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-center">
                  Grab a ticket!
                </h2>
                <span className="text-lg text-gray-500 text-center ">Info coming soon about scholarships and discount ticket availability!</span>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 pb-20">
                <TicketCard ticketTypeId="npc"/>
                <TicketCard ticketTypeId="player"/>
                <TicketCard ticketTypeId="supporter"/>
              </div>
            </div>
          </section>
        </div>
        <PacmanAnimation />
        <div className="container mx-auto px-4">
          <ContactUs />
        </div>
      </main>
    </HomePageWrapper>
  );
}