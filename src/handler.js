const { nanoid } = require('nanoid');
const booksData = require('./book');
const docs = require('./doc.json');

// show documentation
const documentation = (request, h) => {
  const response = h.response(docs);
  response.code(200);
  return response;
};
// adding book controllers with POST method
const addBookControllers = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(6);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished;
  if (readPage === pageCount) {
    finished = true;
  } else {
    finished = false;
  }

  // if the request body doesn't have a name property
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // if the readpage exceeds the total page
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const addBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  booksData.push(addBook);

  const isSuccess = booksData.filter((book) => book.id === id).length > 0;
  // if there is no problem and isSuccess = true
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // if the server can't insert book due to a generic error status
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// getting all books data
const getAllBooksControllers = (request, h) => {
  const { name, reading, finished } = request.query;
  // if url has query parameters name
  if (name) {
    const filter = booksData.filter((q) => q.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: filter.map((q) => ({
          id: q.id,
          name: q.name,
          publisher: q.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  // if url has  query parameter reading
  if (reading) {
    if (reading === '0') {
      const filter = booksData.filter((q) => q.reading === false);
      const response = h.response({
        status: 'success',
        data: {
          books: filter.map((q) => ({
            id: q.id,
            name: q.name,
            publisher: q.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
    if (reading === '1') {
      const filter = booksData.filter((q) => q.reading === true);
      const response = h.response({
        status: 'success',
        data: {
          books: filter.map((q) => ({
            id: q.id,
            name: q.name,
            publisher: q.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }
  // if url has  query parameter finished
  if (finished) {
    if (finished === '0') {
      const filter = booksData.filter((q) => q.finished === false);
      const response = h.response({
        status: 'success',
        data: {
          books: filter.map((q) => ({
            id: q.id,
            name: q.name,
            publisher: q.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
    if (finished === '1') {
      const filter = booksData.filter((q) => q.finished === true);
      const response = h.response({
        status: 'success',
        data: {
          books: filter.map((q) => ({
            id: q.id,
            name: q.name,
            publisher: q.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }
  const response = h.response({
    status: 'success',
    data: {
      books: booksData.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};
// get details book
const getDetailsBookControllers = (request, h) => {
  const { id } = request.params;

  const filterBook = booksData.filter((book) => book.id === id)[0];

  if (filterBook) {
    const response = h.response({
      status: 'success',
      data: {
        book: filterBook,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookControllers = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  // if the request body doesn't have a name property
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // if the readpage exceeds the total page
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = booksData.findIndex((book) => book.id === id);

  if (index !== -1) {
    booksData[index] = {
      ...booksData[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookControllers = (request, h) => {
  const { id } = request.params;

  const index = booksData.findIndex((book) => book.id === id);

  if (index !== -1) {
    booksData.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  documentation,
  addBookControllers,
  getAllBooksControllers,
  getDetailsBookControllers,
  editBookControllers,
  deleteBookControllers,
};
