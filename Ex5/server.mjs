import { createServer } from "node:http";

const port = 3000;
const server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<html><body><h1>Esercizio numero 5!</h1></body></html>");
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
