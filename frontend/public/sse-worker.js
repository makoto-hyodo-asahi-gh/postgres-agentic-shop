/* eslint-disable func-names */
/// <reference lib="webworker" />

const BASE_URL = 'https://rt-backend.redforest-e71bb2d1.westus.azurecontainerapps.io/';
const TASK_EVENTS_API = (userId) => `api/v1/chat/task-events/?user_id=${userId}`;
let ports = [];
let eventSource = null;
let userId = null;

// eslint-disable-next-line no-restricted-globals
const globalScope = self;

globalScope.onconnect = function (e) {
  const port = e.ports[0];
  ports.push(port);

  port.start();
  // Listen for the init message
  port.onmessage = (msgEvent) => {
    const { data } = msgEvent;
    if (data.type === 'init' && data.userId) {
      userId = data.userId;
      if (!eventSource) {
        eventSource = new EventSource(`${BASE_URL}${TASK_EVENTS_API(userId)}`);

        eventSource.onmessage = (event) => {
          ports.forEach((p) => p.postMessage(event.data));
        };

        eventSource.onerror = (err) => {
          console.error('SSE error:', err);
          eventSource?.close();
          eventSource = null;
        };
      }
    }

    if (data.type === 'disconnect') {
      ports = ports.filter((p) => p !== port);
      if (ports.length === 0 && eventSource) {
        eventSource.close();
        eventSource = null;
      }
    }
  };

  // Clean up ports array when a port (tab) is closed
  port.onclose = function () {
    ports = ports.filter((p) => p !== port);
    if (ports.length === 0 && eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
};
