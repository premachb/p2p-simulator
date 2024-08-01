import { useState } from "react";

interface Chunk {
  id: number;
  data: string;
  received: boolean;
}

function Server({ serverId }: { serverId: number }) {
  const [chunks, setChunks] = useState<Chunk[]>(Array.from({ length: 16 }, (_, i) => ({ id: i, data: '', received: false })));

  return (
    <div className="flex flex-row">
      <span className="font-bold mr-2">Server {serverId}</span>
      <div className="mb-3">
        {[...chunks].map((chunk) =>
          <span className="p-1 border">{chunk.id}</span>
        )}
      </div>
    </div>
  )
}

export default Server;