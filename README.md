# Notes on implmentation

Implement a basic P2P exchange of data between many nodes in the network
Currently hardcoded to 16 chunks but easily configurable
- Essentially we would write a module that would ingest the data and split that data into chunks.
- We would then initialize the server components with that number of chunks and server 0 containing all the chunks (received = n chunks, missing = 0)

We have a React Context that acts as our "oracle" or tracker in the Bittorrent world.

Utilizing an effect in React that will make each component start the process of:
- Finding peer nodes from the oracle (sorted by missing pieces and not including self)
- Picking the first node from this list 
- Sending a chunk to that node via triggering a state update in the oracle

We render logs to show the step by step sequence of how data is flowing through the network.

# Architecture

## Data Structures:

### Server
- id
- chunks -> Chunk[]
- receivedChunks -> Set() of ids
- missingChunks -> Set() of ids

### Chunk
- id (1:1 with index in Server chunks array) -> number
- data -> string
- received -> boolean 

## React Component Structure:

### App 
- Main parent component -> Renders our list of servers using ServerContext 
- Provides toggles to start the simulation of sending data and resetting to initial state
- Render log list which shows the user the flow of how each server is sending data to each other.
- Potential improvements but no time 
 - Add field to specifiy number of servers and network latency (both hardcoded)

### ServerContext
 - Array of Server Objects as state which is initialized on load -> Server 0 is special in that it has all the chunks initially
 - Exposes functions to child components that allows them to 
    - UpdateServer(serverId, chunkId, data) -> Sends a chunk of id with data to a given server and updates the global server state.
    - GetServerList -> Gets a list of servers excluding self and sorted by missing chunks.

### Server
- Renders state of the server
- Contains the main event loop that 
 -> GetServerList() from context
 -> Get the first server from list -> PeerServer
 -> Finds the interesection of chunks that current server has and peer server does not
 -> UpdateServer(peerServerId, chunkId, data)
 -> **NOTE**: This effect stops running once there are no valid peer nodes (all peers have all chunks) and hence cleans itself up

