var http = require('http');
var fs = require('fs');
var url = require('url');
var template = require('./lib/template.js');
var path = require('path');


var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;
    var qs = require('querystring');

    if (pathname === '/') {
        if (title === undefined) {
            fs.readdir('./data', function(error, filelist) {
                title = "Welcome";
                description = "Hello, Node.js"

                var list = template.list(filelist);
                var html = template.html(title, list,
                    `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('./data', function(error, filelist) {
                var filteredId = path.parse(`${title}`).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                    var list = template.list(filelist);
                    var html = template.html(title, list, `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a><a href="/update?id=${title}">update</a>
                         <form action="delete_process" method="post"> 
                            <input type="hidden" name ="id" value="${title}">
                            <input type ="submit" value="delete">
                         </form>`);

                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', function(error, filelist) {
            console.log(filelist)
            title = "WEB = create";

            var list = template.list(filelist);
            var html = template.html(title, list,
                `<form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name ="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
              </form>
              `, "");
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var title = post.title;
            var filteredId = path.parse(`${title}`).base;
            var description = post.description;
            fs.writeFile(`data/${filteredId}`, description, 'utf8', function(err) {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            })
        });
    } else if (pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            var filteredId = path.parse(`${title}`).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                var list = template.list(filelist);
                var html = template.html(title, list,
                    `
                <form action="/update_process" method="post">
                <input type="hidden" name ="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name ="description" placeholder="description" >${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `,
                    `<a href="/create">create</a><a href="/update?id=${title}">update</a>`);

                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            console.log(post);
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                })
            });
        });
    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(error) {
                response.writeHead(302, { Location: `/` });
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not 404');
    }


});
app.listen(3000);