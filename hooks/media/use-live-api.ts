
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GenAILiveClient } from '../../lib/genai-live-client';
import { LiveConnectConfig, Modality, LiveServerToolCall } from '@google/genai';
import { AudioStreamer } from '../../lib/audio-streamer';
import { audioContext } from '../../lib/utils';
import VolMeterWorket from '../../lib/worklets/vol-meter';
import { useLogStore, useSettings } from '@/lib/state';
import { getBooking, findBookingByName, updateBookingDate, searchFlights, createBooking } from '../../lib/mock-db';

export type UseLiveApiResults = {
  client: GenAILiveClient;
  setConfig: (config: LiveConnectConfig) => void;
  config: LiveConnectConfig;

  connect: () => Promise<void>;
  disconnect: () => void;
  connected: boolean;

  volume: number;
};

export function useLiveApi({
  apiKey,
}: {
  apiKey: string;
}): UseLiveApiResults {
  const { model, audioSettings } = useSettings();
  const client = useMemo(() => new GenAILiveClient(apiKey, model), [apiKey, model]);

  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [volume, setVolume] = useState(0);
  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState<LiveConnectConfig>({});

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: 'audio-out' }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>('vumeter-out', VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          })
          .catch(err => {
            console.error('Error adding worklet:', err);
          });
      });
    }
  }, [audioStreamerRef]);

  // Sync audio settings
  useEffect(() => {
    if (audioStreamerRef.current) {
      audioStreamerRef.current.setVolume(audioSettings.volume);
      audioStreamerRef.current.setPitch(audioSettings.pitch);
      audioStreamerRef.current.setRate(audioSettings.rate);
    }
  }, [audioSettings, audioStreamerRef.current]);

  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const stopAudioStreamer = () => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };

    const onAudio = (data: ArrayBuffer) => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      }
    };

    // Bind event listeners
    client.on('open', onOpen);
    client.on('close', onClose);
    client.on('interrupted', stopAudioStreamer);
    client.on('audio', onAudio);

    const onToolCall = (toolCall: LiveServerToolCall) => {
      const functionResponses: any[] = [];

      for (const fc of toolCall.functionCalls) {
        // Log the function call trigger
        const triggerMessage = `Triggering function call: **${
          fc.name
        }**\n\`\`\`json\n${JSON.stringify(fc.args, null, 2)}\n\`\`\``;
        useLogStore.getState().addTurn({
          role: 'system',
          text: triggerMessage,
          isFinal: true,
        });

        // Process the function call locally
        let result: any = { error: 'Function not found' };
        
        if (fc.name === 'get_booking_details') {
          const pnr = (fc.args as any).pnr;
          // Simple validation: must be string and at least 5 chars (to allow for loose variations, but enforce some structure)
          if (!pnr || typeof pnr !== 'string' || pnr.length < 5) {
            result = { error: 'Invalid PNR format. Please ask the user for a valid 6-character booking reference (e.g., THY123).' };
          } else {
            const booking = getBooking(pnr);
            if (booking) {
              result = booking;
            } else {
              result = { error: 'Booking not found for PNR: ' + pnr };
            }
          }
        } else if (fc.name === 'search_bookings') {
          const name = (fc.args as any).passengerName;
          const bookings = findBookingByName(name);
          if (bookings.length > 0) {
            result = { bookings: bookings };
          } else {
            result = { message: 'No bookings found for passenger name: ' + name };
          }
        } else if (fc.name === 'change_flight') {
          const { pnr, newDate } = (fc.args as any);
          const updated = updateBookingDate(pnr, newDate);
          if (updated) {
            result = { success: true, message: 'Flight updated successfully', booking: updated };
          } else {
            result = { error: 'Could not update flight. PNR not found or invalid.' };
          }
        } else if (fc.name === 'search_flights') {
          const { origin, destination } = (fc.args as any);
          const flights = searchFlights(origin, destination);
          if (flights.length > 0) {
            result = { flights: flights };
          } else {
            result = { message: 'No flights found for route ' + origin + ' to ' + destination };
          }
        } else if (fc.name === 'create_booking') {
          const { passengerName, flightNumber, date } = (fc.args as any);
          const booking = createBooking(passengerName, flightNumber, date);
          result = { success: true, message: 'Booking created successfully', booking: booking };
        } else if (fc.name === 'simulate_agent_action') {
          const action = (fc.args as any).action;
          // In a real app, this could trigger a specific sound effect file.
          // For now, we return success to the model, which reinforces the behavior.
          result = { success: true, message: `Action '${action}' performed in environment.` };
        } else if (fc.name === 'start_conversation') {
          result = { success: true, message: 'Conversation started. Please proceed with the introduction.' };
        } else {
          // Default fallback for unknown or disabled tools
          result = { result: 'ok' }; 
        }

        // Prepare the response
        functionResponses.push({
          id: fc.id,
          name: fc.name,
          response: result,
        });
      }

      // Log the function call response
      if (functionResponses.length > 0) {
        const responseMessage = `Function call response:\n\`\`\`json\n${JSON.stringify(
          functionResponses,
          null,
          2,
        )}\n\`\`\``;
        useLogStore.getState().addTurn({
          role: 'system',
          text: responseMessage,
          isFinal: true,
        });
      }

      client.sendToolResponse({ functionResponses: functionResponses });
    };

    client.on('toolcall', onToolCall);

    return () => {
      // Clean up event listeners
      client.off('open', onOpen);
      client.off('close', onClose);
      client.off('interrupted', stopAudioStreamer);
      client.off('audio', onAudio);
      client.off('toolcall', onToolCall);
    };
  }, [client]);

  const connect = useCallback(async () => {
    if (!config) {
      throw new Error('config has not been set');
    }
    client.disconnect();

    // Play ringtone
    const ringAudio = new Audio('https://botsrhere.online/deontic/callerpro/ring.mp3');
    try {
      await ringAudio.play();
      // Wait 9 seconds
      await new Promise(resolve => setTimeout(resolve, 9000));
      ringAudio.pause();
      ringAudio.currentTime = 0;
    } catch (e) {
      console.warn("Ringtone playback failed", e);
    }

    await client.connect(config);
  }, [client, config]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [setConnected, client]);

  return {
    client,
    config,
    setConfig,
    connect,
    connected,
    disconnect,
    volume,
  };
}
