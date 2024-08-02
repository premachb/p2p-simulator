import type { Server } from './common';
import { useState } from 'react';
import { ServerContext, initializeServers } from './common';

// Our Oracle (or Tracker in the Bittorrent world) is the ServerProvider component.
export const ServerProvider = ({ children }: { children: React.ReactNode }) => {
  const [servers, setServers] = useState<Server[]>(initializeServers);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Gets the list of servers who have missing chunks (excluding callerId at index callerId) sorted by the number of missing chunks.
  const getServerList = (callerId: number) => {
    return servers.filter(server => server.id !== callerId && server.missingChunks.size > 0).sort((a, b) => { return b.missingChunks.size - a.missingChunks.size })
  }

  function updateServer(serverId: number, chunkId: number, data: string) {
    setServers(prevServers => {
      const newServers = [...prevServers];
      const server = newServers[serverId];
      server.chunks[chunkId].data = data;
      server.chunks[chunkId].received = true;
      server.missingChunks.delete(chunkId);
      server.receivedChunks.add(chunkId);
      return newServers;
    });
  }

  function appendLog(log: string) {
    setLogs(prevLogs => {
      return [...prevLogs, log]
    });

  }

  return (
    <ServerContext.Provider value={{ servers: servers, setServers: setServers, updateServer: updateServer, getServerList: getServerList, simulationStarted: simulationStarted, setSimulationStarted: setSimulationStarted, logs: logs, setLogs: setLogs, appendLog: appendLog }}>
      {children}
    </ServerContext.Provider>
  )
}
