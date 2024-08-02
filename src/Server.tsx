import { useEffect } from 'react';
import { useServerContext } from './common';
import type { Chunk } from './common';

const NETWORK_DELAY = 2000;
function Server({ serverId, chunks }: { serverId: number, chunks: Chunk[] }) {
  const { getServerList, updateServer, servers, simulationStarted, appendLog } = useServerContext();

  useEffect(() => {
    setTimeout(() => {
      if (simulationStarted) {
        console.log('loop from server ', serverId)
        const peerList = getServerList(serverId);
        const currentServer = servers[serverId];

        if (peerList.length === 0) {
          return;
        }

        const peerServer = peerList[0];
        const selfReceivedChunks = currentServer.receivedChunks; 
        const peerMissingChunks = peerServer.missingChunks;
        const setIntersection = new Set([...selfReceivedChunks].filter(x => peerMissingChunks.has(x)));

        console.log('self received chunks ', selfReceivedChunks)
        console.log('peer missing chunks ', peerMissingChunks)
        console.log('set intersection ', setIntersection)
        
        if (setIntersection.size === 0) {
          return;
        }

        // Pick a random chunk from the intersection set
        const randomChunkId = [...setIntersection][Math.floor(Math.random() * setIntersection.size)];
        updateServer(peerServer.id, randomChunkId, chunks[randomChunkId].data);
        appendLog('Server ' + serverId + ' sent chunk ' + randomChunkId + ' to Server ' + peerServer.id);

        return () => {
          console.log('cleanup from server ', serverId)
        }
      }
    }, NETWORK_DELAY);
  })

  return (
    <div className="flex flex-row">
      <span className="font-bold mr-2">Server {serverId}</span>
      <div className="mb-3">
        {[...chunks].map((chunk) =>
          chunk.received ? <span className="p-2 border bg-green-300">{chunk.id}</span> :
          <span className="p-2 border bg-red-300">{chunk.id}</span>
        )}
      </div>
    </div>
  )
}

export default Server;
