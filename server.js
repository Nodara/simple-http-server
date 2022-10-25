const http = require('http');
const fs = require('fs');

const store = [
  {
    name: 'apple',
    price: 5
  },
  {
    name: 'orange',
    price: 10,
  }
];


const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (method === 'GET') {
    if (url === '/') {
      res.setHeader('content-type', 'text/html');

      if (store.length) {
        res.write('<ul>');
        store.map((e) => res.write(`<li>${e.name} ${e.price}</li>`))
        res.write('</ul>');
      };

      const addProductForm = fs.readFileSync('./add-product.html');

      res.write(addProductForm);

      return res.end();
    }

  } else if (method === 'POST') {
    if (url === '/add-product') {
      let body = [];

      req.on('data', (chunk) => {
        body.push(chunk);
      });

      req.on('end', () => {
        body = Buffer.concat(body).toString().split('&');
        const name = body[0].split('=')[1];
        const price = body[1].split('=')[1];

        store.push({
          'name': name,
          'price': Number(price)
        });
      });

      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();

    }
  }

});

server.listen(3000)

