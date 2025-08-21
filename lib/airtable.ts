import Airtable from "airtable";
import type { AirtableRecord } from "./types";

// Initialize Airtable with Personal Access Token (PAT)
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
  throw new Error("Missing required Airtable environment variables");
}

const base = new Airtable({
  apiKey: AIRTABLE_PAT,
}).base(AIRTABLE_BASE_ID);

export const createTicketRecord = async (recordData: AirtableRecord) => {
  try {
    // console.log('Creating Airtable record with data:', recordData);
    // console.log('Volunteer Roles being sent:', recordData['Volunteer Roles']);
    // console.log('Using table:', AIRTABLE_TABLE_NAME);

    const table = base(AIRTABLE_TABLE_NAME);

    // console.log('Table object created, attempting to create record...');

    const fields: Record<string, AirtableRecord[keyof AirtableRecord]> = {
      Name: recordData.Name,
      Email: recordData.Email,
      "Ticket Type": recordData["Ticket Type"],
      Price: recordData.Price,
      "Stripe Payment ID": recordData["Stripe Payment ID"],
      "Purchase Date": recordData["Purchase Date"],
      Status: recordData.Status,
    };

    // Only add Discord Handle if it's provided
    if (recordData["Discord Handle"]) {
      fields["Discord Handle"] = recordData["Discord Handle"];
    }

    // Only add Stripe Fee if it's provided
    if (recordData["Stripe Fee"] !== undefined) {
      fields["Stripe Fee"] = recordData["Stripe Fee"];
    }

    // Only add Volunteer Roles if it's provided
    if (
      recordData["Volunteer Roles"] &&
      recordData["Volunteer Roles"].length > 0
    ) {
      fields["Volunteer Roles"] = recordData["Volunteer Roles"];
      // console.log('Adding Volunteer Roles to fields:', fields['Volunteer Roles']);
    } else {
      // console.log('No Volunteer Roles to add');
    }

    // console.log('Final fields being sent to Airtable:', fields);

    const record = await table.create([{ fields }]);

    // console.log('Airtable record created successfully:', record[0].id);
    return {
      success: true,
      recordId: record[0].id,
    };
  } catch (error) {
    console.error("Error creating Airtable record:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    });
    throw new Error(
      `Failed to create Airtable record: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const formatAirtableRecord = (
  name: string,
  email: string,
  ticketType: string,
  price: number,
  stripePaymentId: string,
  success: boolean,
  discordHandle?: string,
  stripeFee?: number,
  volunteerRoles?: string[],
): AirtableRecord => {
  // Format date for Airtable (YYYY-MM-DD format)
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Gets YYYY-MM-DD format

  return {
    Name: name,
    Email: email,
    "Discord Handle": discordHandle,
    "Ticket Type": ticketType,
    Price: price,
    "Stripe Payment ID": stripePaymentId,
    "Purchase Date": formattedDate,
    Status: success ? "Success" : "Failed",
    "Stripe Fee": stripeFee,
    "Volunteer Roles": volunteerRoles,
  };
};
