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
import Schedule from "./schedule/Schedule";
import { Button } from "@/components/Button";
import { CALL_FOR_SESSIONS } from "@/config";

export default function Home() {
  return (
    <HomePageWrapper>
      <main>
        <div className="container mx-auto px-4">
          <Hero />
          <Calendar />
          <GetInvolved />
          <section className="h-[calc(100vh-150px)] w-full max-w-full overflow-hidden flex flex-col justify-center mb-10">
            <h2 className="text-center text-3xl font-bold mb-4">Schedule</h2>
            <p className="text-center text-primary-200 mb-8">
              Times, locations, content, hosts, and the fundamental fabric of reality all subject to change.
            </p>
            <div className="container mx-auto h-full flex flex-col border border-secondary-300 rounded-xl overflow-y-auto">
              <Schedule
              />
            </div>
            <div className="my-8 flex justify-center">
              <Button background="bg-cyan-500" link={CALL_FOR_SESSIONS} target="_blank">
                Submit a session proposal
              </Button>
            </div>
          </section>
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
