import Server from "./Server";
import { ServerProvider } from "./ServerProvider";
import { initializeServers, useServerContext } from "./common";

function ServerList() {
  const { servers } = useServerContext();
  const { simulationStarted, setSimulationStarted, setServers, logs, setLogs } = useServerContext();
  
  function resetSimulation() {
    setServers(initializeServers());
    setLogs([]);
  }

  return (
    <div className="p-5 flex flex-col">
      <div>
        <button onClick={() => setSimulationStarted(!simulationStarted)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5 mr-2">Toggle Simulation (Start or Stop)</button> 
        <button onClick={() => resetSimulation() } className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5">Reset Simulation</button>
      </div>
      <div className="flex flex-row">
        <div>
          {servers.map((server) =>
            <Server key={server.id} serverId={server.id} chunks={server.chunks} />
          )}
        </div>
        <h1>Logs:</h1>
        <div className="border p-10 overflow-scroll overflow-y-scroll max-h-80">
          {
            logs.map((log, index) => (
              <div key={index} className="bg-gray-200 p-2 mt-2">
                {log}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    // Render numServers instances of the Server component
    // Blue button to start the simulation
    <ServerProvider>
      <ServerList />
    </ServerProvider>
  );
}

export default App
