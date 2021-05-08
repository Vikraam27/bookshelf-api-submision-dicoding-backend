const {
  addBookControllers,
  getAllBooksControllers,
  getDetailsBookControllers,
  editBookControllers,
  deleteBookControllers,
  documentation,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: documentation,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksControllers,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getDetailsBookControllers,
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBookControllers,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookControllers,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookControllers,
  },
];

module.exports = routes;
