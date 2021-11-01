const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.Server({
    port: process.env.PORT || 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);
  await server.start();
  console.log(`server running on ${server.info.uri}`);
};

init();
