import React, {ChangeEvent, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Book} from "./models/Book";
import bookService from './services/BookService';
import memberService from './services/MemberService';
import {Member} from "./models/Member";

export const App = (): React.ReactElement => {

  const [books, updateBooks] = useState<Book[] | null>(null);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [members, updateMembers] = useState<Member[]>([])

  React.useEffect((): void => {
    Promise.all([
        bookService.read<Book[]>(),
        memberService.read<Member[]>()
    ])
        .then((values: (Book[] | Member[])[]) => {
          updateMembers(values[1] as Member[]);
          updateBooks(values[0] as Book[]);
        })
        .catch( err => window.alert('unable to load data'))

  }, [])

  const cancelEditBook = (): void => {
    setEditBook(null);
  }

  return (
    <div className="container-fluid">
      <div className='row justify-content-center'>
        <div className='col-12 col-md-8'>
          <div className='row'>
            <div className='col-12'>
              <h1>Book Exchange</h1>
              <hr/>
            </div>
            <div className='col-12 text-right'>
              {editBook &&
                <button
                  className='btn btn-sm btn-outline-danger mr-2'
                  onClick={cancelEditBook}
                >cancel</button>
              }
              <button
                  className={`btn btn-sm btn-${editBook ? 'success':'outline-info'}`}
                  onClick={() => setEditBook(new Book())}
                  disabled={editBook?.title === '' || editBook?.author === ''}
              >
                {
                  editBook ?
                      'save' : 'add book'
                }
              </button>
            </div>
            {editBook &&
              <div className='col-12'>
                <div className='row mt-2'>
                  <div className='col-6'>
                    <input type='text' placeholder='title' className='form-control'
                           value={editBook.title}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setEditBook({
                                 ...editBook,
                                 ...{title: e.target.value}
                           })}
                      />
                  </div>
                  <div className='col-6'>
                    <input type='text' placeholder='author' className='form-control'
                           value={editBook.author}
                           onChange={(e: ChangeEvent<HTMLInputElement>) => setEditBook({
                                 ...editBook,
                                 ...{author: e.target.value}
                           })}
                      />
                  </div>
                </div>
                <hr/>
              </div>
            }
            <div className='col-12'>
              <h3>Books</h3>
              <hr/>
              <table className='table'>
                <thead>
                  <tr>
                    <th>title</th>
                    <th>author</th>
                    <th>owner</th>
                    <th>checked out to</th>
                  </tr>
                </thead>
                {
                  books === null ?
                      <div>loading...</div>
                      :
                      <tbody>
                      {
                        books.map((book: Book) =>
                            <tr>
                              <td>{book.title}</td>
                              <td>{book.author}</td>
                              <td>{book.owner.first_name} {book.owner.last_name}</td>
                              <td>
                                {
                                  book.checked_out_to === null ?
                                      <div>not checked out</div>
                                      :
                                      <span>
                                        {book.checked_out_to.first_name} {book.checked_out_to.last_name}
                                      </span>
                                }
                              </td>
                            </tr>
                        )
                      }
                      </tbody>
                }
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
