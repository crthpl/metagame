import SetAnimation from "../components/Set/SetAnimation";
import { TicketCard } from "@/components/tickets/TicketCard";
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
          <section className="mt-4 mb-8" id="tickets">
            <div className="container mx-auto flex flex-col items-center">
              <div className="mb-8">
                <h2 className="text-center text-3xl font-bold">
                  Grab a ticket!
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-8 pb-20 md:grid-cols-3">
                <TicketCard ticketTypeId="player" />
                <TicketCard ticketTypeId="dayPass" />
                <TicketCard ticketTypeId="volunteer" />
                <TicketCard ticketTypeId="student" />
                <TicketCard ticketTypeId="financialAid" />
                <TicketCard ticketTypeId="supporter" />
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
