
const
    IF   = process.argv[2] || 'localhost',
    PORT = process.argv[3] || 1337,

    g_http = require('http'),
    g_url  = require('url'),
    g_path = require('path'),
    g_fs   = require('fs'),

    log = console.log,

    subPath = function(url) {
        const
            strPath = g_path.normalize(g_path.join(__dirname, url.pathname));

        if (strPath.indexOf(__dirname) === 0)
            return strPath.substring(__dirname.length + 1);
        else
            return null;
    },

    main = function(request, response) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            response.writeHead(405, {'Allow': 'GET, HEAD'});
            response.end();
            return
        }

        const
            url     = g_url.parse(request.url),
            strPath = subPath(url);

        if (strPath !== null && strPath.endsWith('.redirect')) {
            g_fs.readFile(strPath, 'utf8', (err, strLocation) => {
                if (err) {
                    log(err);
                    response.writeHead(404);
                } else {
                    response.writeHead(307, {'Location': strLocation});
                }

                response.end();
            });
        } else {
            response.writeHead(400);
            response.end();
        }
    },

    g_server = g_http.createServer(main);


g_server.listen(PORT, IF);

log('Redirect server with working directory ' + __dirname + ' running at http://' + IF + ':' + PORT + '/');
