const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>Hello Model</h1>');
    res.end('<p>Hello Server!</p>');
})
    .listen(8080, () => {
            console.log("Waiting for request on port 8080");
        }
    );
