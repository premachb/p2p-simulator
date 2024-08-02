import { createContext, useContext } from 'react';

export interface Chunk {
  id: number;
  data: string;
  received: boolean;
}

export interface Server {
  id: number;
  chunks: Chunk[];
  missingChunks: Set<number>;
  receivedChunks: Set<number>;
}

export interface ServerContext {
  servers: Server[];
  setServers: (servers: Server[]) => void;
  updateServer: (serverId: number, chunkId: number, data: string) => void;
  getServerList: (callerId: number) => Server[];
  simulationStarted: boolean;
  setSimulationStarted: (simulationStarted: boolean) => void;
  logs: string[];
  setLogs: (logs: string[]) => void;
  appendLog: (log: string) => void;
}

export const ServerContext = createContext<ServerContext>({
  servers: [],
  setServers: () => {},
  updateServer: () => {},
  getServerList: (callerId: number) => [],
  simulationStarted: false,
  setSimulationStarted: () => {},
  logs: [],
  setLogs: () => {},
  appendLog: () => {}
});

export const useServerContext = () => useContext(ServerContext);

export function initializeServers(): Server[] {
    const numServers = 100; // HARD CODED but in reality server come in and out of the network dynamically.
    const numChunks = 16; // HARD CODED but would be dervied from the data file
    const servers = Array.from({ length: numServers }, (_, i) => ({
      id: i,
      chunks: Array.from({ length: numChunks }, (_, i) => ({ id: i, data: '', received: false })),
      missingChunks: new Set<number>(Array.from({ length: numChunks }, (_, i) => i)),
      receivedChunks: new Set<number>()
    }));

    // Special case - Server 0 has all the chunks to start
    servers[0].chunks.forEach(chunk => chunk.received = true);
    servers[0].missingChunks.clear();
    servers[0].receivedChunks = new Set(Array.from({ length: numChunks }, (_, i) => (i)));

    return servers
  }