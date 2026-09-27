const GIS_CLIENT_ID = 'family-nexus-app.apps.googleusercontent.com'
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events'
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file'

let tokenClient = null
let accessToken = null

export function initGoogleAuth() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google auth'))
    document.head.appendChild(script)
  })
}

export async function connectGoogleCalendar() {
  await initGoogleAuth()
  return new Promise((resolve, reject) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GIS_CLIENT_ID,
      scope: CALENDAR_SCOPE,
      callback: (response) => {
        if (response.error) reject(response.error)
        else { accessToken = response.access_token; resolve(response) }
      },
    })
    tokenClient.requestAccessToken({ prompt: 'consent' })
  })
}

export async function connectGoogleDrive() {
  await initGoogleAuth()
  return new Promise((resolve, reject) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GIS_CLIENT_ID,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error) reject(response.error)
        else { accessToken = response.access_token; resolve(response) }
      },
    })
    tokenClient.requestAccessToken({ prompt: 'consent' })
  })
}

export async function syncEventsToCalendar(events) {
  if (!accessToken) throw new Error('Not authenticated')
  const results = []
  for (const event of events) {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: event.title,
        description: `Family Nexus AI - ${event.type}`,
        start: { dateTime: new Date().toISOString() },
        end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
      })
    })
    if (response.ok) results.push(await response.json())
  }
  return results
}

export async function uploadToDrive(memories) {
  if (!accessToken) throw new Error('Not authenticated')
  const results = []
  for (const memory of memories) {
    const metadata = { name: `${memory.title}.json`, mimeType: 'application/json' }
    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', new Blob([JSON.stringify(memory)], { type: 'application/json' }))
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: form,
    })
    if (response.ok) results.push(await response.json())
  }
  return results
}

export function isGoogleConnected() {
  return !!accessToken
}
