/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const crmBookingTools: FunctionCall[] = [
  {
    name: 'get_booking_details',
    description: 'Retrieves detailed information about a flight booking using the unique PNR (Booking Reference).',
    parameters: {
      type: 'OBJECT',
      properties: {
        pnr: {
          type: 'STRING',
          description: 'The 6-character alphanumeric Booking Reference (e.g., THY123).',
        },
      },
      required: ['pnr'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'search_bookings',
    description: 'Searches for bookings by passenger name when the PNR is not available.',
    parameters: {
      type: 'OBJECT',
      properties: {
        passengerName: {
          type: 'STRING',
          description: 'The first or last name of the passenger to search for.',
        },
      },
      required: ['passengerName'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'change_flight',
    description: 'Changes the date of an existing flight booking.',
    parameters: {
      type: 'OBJECT',
      properties: {
        pnr: {
          type: 'STRING',
          description: 'The Booking Reference (PNR) of the flight to change.',
        },
        newDate: {
          type: 'STRING',
          description: 'The new desired date for the flight (YYYY-MM-DD format).',
        },
      },
      required: ['pnr', 'newDate'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'search_flights',
    description: 'Searches for available flights based on origin and destination.',
    parameters: {
      type: 'OBJECT',
      properties: {
        origin: {
          type: 'STRING',
          description: 'The departure city (e.g., London, Istanbul).',
        },
        destination: {
          type: 'STRING',
          description: 'The arrival city (e.g., New York, Paris).',
        },
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'create_booking',
    description: 'Creates a new flight booking for a passenger.',
    parameters: {
      type: 'OBJECT',
      properties: {
        passengerName: {
          type: 'STRING',
          description: 'Full name of the passenger.',
        },
        flightNumber: {
          type: 'STRING',
          description: 'The flight number to book (e.g., TK1982).',
        },
        date: {
          type: 'STRING',
          description: 'Date of the flight (YYYY-MM-DD).',
        },
      },
      required: ['passengerName', 'flightNumber', 'date'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'simulate_agent_action',
    description: 'Performs a non-verbal action (cough, sip tea, type, sigh) to enhance the realism of the agent\'s environment. Use this tool instead of writing actions in brackets.',
    parameters: {
      type: 'OBJECT',
      properties: {
        action: {
          type: 'STRING',
          description:
            'The action to perform. Allowed values: "cough", "sip_tea", "typing", "sigh", "clear_throat", "bow_head", "inhale_through_teeth", "laugh_warmly", "gallic_puff", "sip_espresso", "deep_sigh", "loud_laugh", "sip_builder_tea", "shake_iced_tea", "adjust_microphone".',
        },
      },
      required: ['action'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'cough_tool',
    description:
      'A soft, off-mic cough to signal distance from the microphone while still being audible to the guest.',
    parameters: {
      type: 'OBJECT',
      properties: {
        style: {
          type: 'STRING',
          description: 'Optional cough style (e.g., "soft", "stifled").',
        },
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'fetch_customer_profile',
    description: 'Retrieves stored data about a guest (notes, preferences, loyalty status) using their customer ID or phone number.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerId: {
          type: 'STRING',
          description: 'The internal ID for the guest, if known.',
        },
        phoneNumber: {
          type: 'STRING',
          description: 'The guest\'s phone number, used when the ID is missing.',
        },
      },
      required: [],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'update_customer_notes',
    description: 'Adds or updates notes for a guest to keep their account history accurate.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerId: {
          type: 'STRING',
          description: 'The guest ID whose notes are being updated.',
        },
        notes: {
          type: 'STRING',
          description: 'The short summary of the latest interaction or important detail.',
        },
      },
      required: ['customerId', 'notes'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'log_customer_issue',
    description: 'Records a new customer issue or complaint for follow-up tracking.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerId: {
          type: 'STRING',
          description: 'The guest\'s identifier.',
        },
        issueType: {
          type: 'STRING',
          description: 'Category of the issue (e.g., baggage, delay, refund).',
        },
        description: {
          type: 'STRING',
          description: 'A concise description of the problem.',
        },
      },
      required: ['customerId', 'issueType', 'description'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'escalate_to_specialist',
    description: 'Routes the guest to a specialist team when the issue cannot be resolved on the first line.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerId: {
          type: 'STRING',
          description: 'The guest ID requesting escalation.',
        },
        reason: {
          type: 'STRING',
          description: 'Why the escalation is needed.',
        },
        urgency: {
          type: 'STRING',
          description: 'How urgent the escalation is (low, normal, high).',
        },
      },
      required: ['customerId', 'reason'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'skip_turn',
    description: 'Pauses the agent briefly to let the guest think, gather more information, or breathe without rushing the next sentence.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reason: {
          type: 'STRING',
          description: 'Optional cue for why the pause is needed (silence, checking system, confirming).',
        },
      },
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'start_conversation',
    description: 'Use this function to start the conversation. The function takes no arguments and returns a signal to begin the introductory spiel.',
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  }
];
