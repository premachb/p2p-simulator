import Server from "./Server";

function App() {
  const numServers = 50;

  return (
    // Render numServers instances of the Server component
    <div className="p-5">
      {[...Array(numServers).keys()].map((serverId) =>
        <Server key={serverId} serverId={serverId} />
      )}
    </div>
  );
}

export default App
