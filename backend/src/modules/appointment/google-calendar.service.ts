import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private oauth2Client;
  private calendar;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  async createMeetingEvent(params: {
    summary: string;
    description: string;
    startDateTime: string;  // ISO 8601 UTC
    durationMinutes: number;
    attendeeEmail: string;
    attendeeName: string;
  }) {
    const endDateTime = new Date(
      new Date(params.startDateTime).getTime() + params.durationMinutes * 60000
    ).toISOString();

    const event = {
      summary: params.summary,
      description: params.description,
      start: { dateTime: params.startDateTime, timeZone: 'UTC' },
      end: { dateTime: endDateTime, timeZone: 'UTC' },
      attendees: [
        { email: params.attendeeEmail, displayName: params.attendeeName },
      ],
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        resource: event,
        conferenceDataVersion: 1,  // REQUIRED for Meet link
        sendUpdates: 'all',        // Sends calendar invite to attendee
      });

      const meetLink = response.data.hangoutLink;
      const eventLink = response.data.htmlLink;

      this.logger.log(`Meeting created: ${meetLink}`);
      
      return {
        meetLink,
        eventLink,
        eventId: response.data.id,
      };
    } catch (error) {
      this.logger.error('Failed to create Google Calendar event', error.stack);
      throw error;
    }
  }

  async deleteMeetingEvent(eventId: string) {
    try {
      await this.calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        sendUpdates: 'all',
      });
      this.logger.log(`Meeting deleted: ${eventId}`);
    } catch (error) {
      this.logger.error('Failed to delete Google Calendar event', error.stack);
    }
  }
}
