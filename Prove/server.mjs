import {createServer} from "node:http";

const port = 3000;
const server = createServer((req, res) => {
    console.log("request received")

    res.statusCode = 200;

    res.setHeader("Content-Type", "application/json");

    const jsonResponseBody = JSON.stringify({ location: "Earth"});

    res.end(jsonResponseBody);
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


