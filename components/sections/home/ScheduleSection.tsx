import ScheduleProvider from "@/app/schedule/ScheduleProvider";
import { Button } from "@/components/Button";
import { CALL_FOR_SESSIONS } from "@/config";

export default function ScheduleSection() {
    return (
        <section className="h-fit w-full max-w-full overflow-hidden flex flex-col justify-center mb-10">
            <h2 className="text-center text-3xl font-bold mb-4">Schedule</h2>
            <p className="text-center text-primary-200 mb-8">
              Times, locations, content, hosts, and the fundamental fabric of reality all subject to change.
            </p>
            <div className="container mx-auto h-[calc(100vh-150px)] flex flex-col border border-secondary-300 rounded-xl overflow-y-auto">
              <ScheduleProvider
              />
            </div>
            <div className="my-8 flex justify-center">
              <Button background="bg-cyan-500" link={CALL_FOR_SESSIONS} target="_blank">
                Submit a session proposal
              </Button>
            </div>
        </section>
    )
}