export interface ISubscription {}

// In client-side JavaScript, connect to your Workers function using WebSockets:
const websocket = new WebSocket(
  "wss://websocket-example.signalnerve.workers.dev"
);

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

websocket.addEventListener("open", (event) => {
  console.log("Connected to server");
});

websocket.addEventListener("message", (event) => {
  console.log(event.data);
});

async function handleRequest(request) {
  const upgradeHeader = request.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
