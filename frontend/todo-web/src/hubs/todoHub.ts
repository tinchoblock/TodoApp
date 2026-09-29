import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export const TODO_HUB_URL = 'http://localhost:5000/hubs/todo';

// T07: single shared connection factory with automatic reconnect.
export function createConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(TODO_HUB_URL)
    .withAutomaticReconnect()
    .build();
}
