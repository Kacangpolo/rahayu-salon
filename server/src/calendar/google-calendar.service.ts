import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleCalendarService {
    private calendar;

    constructor(private config: ConfigService) {
        const clientId = this.config.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.config.get('GOOGLE_CLIENT_SECRET');
        const refreshToken = this.config.get('GOOGLE_REFRESH_TOKEN');

        if (!clientId || !clientSecret || !refreshToken) {
            console.warn('Google Calendar credentials not set. Service will be mocked.');
            this.calendar = null;
            return;
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    }

    async createEvent(payload: any) {
        if (!this.calendar) {
            console.warn('Google Calendar not initialized. Skipping event creation.');
            return { id: 'mocked-event-id', status: 'mocked' };
        }

        const event = {
            summary: payload.title,
            description: `Reservasi Rahayu Salon.\n\nNotes: ${payload.notes || '-'}`,
            start: {
                dateTime: payload.startCtx, // e.g. "2023-10-25T10:00:00+08:00" (Asia/Makassar)
            },
            end: {
                dateTime: payload.endCtx,
            },
            attendees: [
                { email: payload.email },
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 60 },
                ],
            },
        };

        return this.calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
            sendUpdates: 'all',
        });
    }
}
