import { createServer } from "node:http";

const port = 3000;
const server = createServer((req, res) => {
    const responseBody = JSON.stringify({ location: "Mars" });
    
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(responseBody);
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//curl --verbose http://localhost:3000/     nel terminale, il risultato è corretto:

/*
..
< Keep-Alive: timeout=5
< Content-Length: 19
<
{"location":"Mars"}* Connection #0 to host localhost left intact
*/