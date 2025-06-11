// googleCalendar.js
import { gapi } from 'gapi-script';

const CLIENT_ID = '794849302258-lc8mo8jvq1kmfa8t5be26nrk5i87hj9r.apps.googleusercontent.com';
const API_KEY = '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';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export const initGoogleAPI = () => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      scope: SCOPES,
    });
  });
};

export const createCalendarEvent = async (event) => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    const eventObj = {
      summary: event.title,
      location: event.location,
      description: `Scheduled ${event.type}`,
      start: {
        dateTime: event.date.toISOString(),
        timeZone: 'Africa/Lagos',
      },
      end: {
        dateTime: event.endDate.toISOString(),
        timeZone: 'Africa/Lagos',
      },
    };

    const request = gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: eventObj,
    });

    await request.execute();
    alert('Event successfully added to Google Calendar!');
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    alert('Failed to add event. Check console for details.');
  }
};
