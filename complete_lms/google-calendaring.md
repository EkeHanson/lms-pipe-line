# Google Calendar Integration Explained

The implementation I provided creates links that allow users to add events to their Google Calendar, but it doesn't actually integrate with the Google Calendar API for direct calendar modifications. Let me explain both approaches:

## Current Implementation (Link-Based)

### How It Works
1. The `generateGoogleCalendarLink` function creates a URL with all event details encoded as URL parameters
2. When clicked, this opens Google Calendar in a new tab with a pre-filled event form
3. The user must manually click "Save" to add it to their calendar

### Pros:
- Simple to implement
- No authentication required
- Works without any backend changes
- No API quotas or limits

### Cons:
- Requires manual user action to save
- Doesn't actually add events automatically
- Limited to basic event fields

## Full Google Calendar API Integration

For true integration where events are automatically added to users' calendars, you'd need to:

### 1. Set up Google API credentials
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a project
- Enable the Calendar API
- Create OAuth 2.0 credentials

### 2. Install Google API client library
```bash
npm install @react-oauth/google @googleapis/calendar
```

### 3. Implement OAuth flow
```jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { google } from 'googleapis';

function GoogleAuthButton() {
  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          // Store the access token
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
}
```

### 4. Create a function to add events
```javascript
async function addToGoogleCalendar(eventDetails, accessToken) {
  const calendar = google.calendar({ version: 'v3', auth: accessToken });
  
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start_time,
          timeZone: 'UTC',
        },
        end: {
          dateTime: eventDetails.end_time,
          timeZone: 'UTC',
        },
        location: eventDetails.location,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding to Google Calendar:', error);
    throw error;
  }
}
```

### 5. Modify your component to use the API
Replace the link-based approach with API calls:

```jsx
// In your schedule component
const handleAddToCalendar = async (schedule) => {
  try {
    const eventDetails = {
      title: schedule.title,
      description: schedule.description,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      location: schedule.location
    };
    
    const result = await addToGoogleCalendar(eventDetails, userAccessToken);
    enqueueSnackbar('Event added to Google Calendar!', { variant: 'success' });
  } catch (error) {
    enqueueSnackbar('Failed to add to calendar', { variant: 'error' });
  }
};

// Use this instead of window.open()
<Button onClick={() => handleAddToCalendar(schedule)}>
  Add to Google Calendar
</Button>
```

## Which Approach to Choose?

### Use Link-Based If:
- You want a simple solution
- You don't need automatic event creation
- You don't want to handle OAuth and API complexity

### Use Full API Integration If:
- You need events added automatically
- You want to manage events programmatically
- You're willing to handle authentication and API quotas

## Hybrid Approach

You could also combine both - start with the link-based approach and later add API integration for users who authenticate:

```jsx
{isAuthenticated ? (
  <Button onClick={() => handleAddToCalendar(schedule)}>
    Sync to Google Calendar
  </Button>
) : (
  <Button 
    onClick={() => window.open(generateGoogleCalendarLink(schedule), '_blank')}
  >
    Add to Google Calendar
  </Button>
)}
```

Would you like me to elaborate on any specific part of the integration process?