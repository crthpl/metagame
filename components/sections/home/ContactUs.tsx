import React from "react";
import { Card } from "../../Card";
import { Button } from "../../Button";
import { URLS } from "../../../utils/urls";

export const ContactUs: React.FC = () => {
  return (
    <section className="mb-20 flex w-full flex-col" id="Supporters">
      <div className="flex w-full flex-col items-center justify-center">
        <Card className="mt-[80px]">
          <div className="flex h-full flex-col items-center justify-center p-4">
            <h3 className="text-2xl font-bold">
              Sound fun? Want to take part?
            </h3>
            <p className="mt-4 text-center">
              Thinking about sponsoring us, or maybe partnering with us?
              Something else in mind?
            </p>
            <Button
              className="mt-8 uppercase"
              link={URLS.CALL_FOR_SPEAKERS}
              target="_blank"
            >
              GET INVOLVED!
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
