import React, {ChangeEvent, useState} from 'react';
import './App.css';
import {Book} from "./models/Book";
import bookService from './services/BookService';
import memberService from './services/MemberService';
import {Member} from "./models/Member";

export const App = (): React.ReactElement => {

  const [books, updateBooks] = useState<Book[]>([]);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [members, updateMembers] = useState<Member[]>([]);
  const [serviceWorking, setServiceWorking] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect((): void => {
    Promise.all([
        bookService.read<Book[]>(),
        memberService.read<Member[]>()
    ])
        .then((values: (Book[] | Member[])[]) => {
          updateMembers(values[1] as Member[]);
          updateBooks(values[0] as Book[]);
          setLoading(false);
        })
        .catch( err => window.alert('unable to load data'))

  }, [])

  const cancelEditBook = (): void => {
    setEditBook(null);
  }

  const deleteBook = (book: Book): void => {
      if (!window.confirm(`Are you sure you want to remove "${book.title}"?`))
          return

      setServiceWorking(true);
      bookService.delete(book.id)
          .then( resp => {
              updateBooks(books.filter((tb: Book) => tb.id !== book.id));
              setServiceWorking(false);
          })
          .catch( err => window.alert(err))
  }

  const saveBook = (): void => {
    setServiceWorking(true);
    if (editBook!.id > -1) {
        bookService.update<Book>({
            title: editBook!.title,
            author: editBook!.author,
            owner: editBook!.owner.id
        }, editBook!.id)
            .then((book: Book) => {
                books.map((tb: Book) => {})
                updateBooks(
                    books.map((tb: Book) =>
                        tb.id === book.id ? book : tb
                    )
                )
                setServiceWorking(false);
                setEditBook(null);
            })
    } else {
        bookService.create<Book>(editBook as Book)
        .then((book: Book) => {
            updateBooks([
                book,
                ...books
            ]);
            setServiceWorking(false);
            setEditBook(null);
        })
        .catch( err => window.alert('unable to add book'))
    }
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
              {(!loading && members.length > 0) &&
                  <div className='col-12 text-right'>
                      {editBook &&
                        <button
                          className='btn btn-sm btn-outline-danger mr-2'
                          onClick={cancelEditBook}
                          disabled={serviceWorking}
                        >cancel</button>
                      }
                      <button
                          className={`btn btn-sm btn-${editBook ? 'success':'outline-info'}`}
                          onClick={() => {
                            editBook ?
                                saveBook()
                                :
                                setEditBook({...new Book(), owner: members[0]})
                          }}
                          disabled={editBook?.title === '' || editBook?.author === '' || serviceWorking}
                      >
                        {
                          editBook ?
                              'save' : 'add book'
                        }
                      </button>
                    </div>
              }
              {(!loading && members.length === 0) &&
                  <div className='col-12 text-center'>
                      <strong>You need members before you can add books</strong>
                  </div>
              }
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
                               disabled={serviceWorking}
                          />
                    </div>
                    <div className='col-6'>
                        <input type='text' placeholder='author' className='form-control'
                               value={editBook.author}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => setEditBook({
                                     ...editBook,
                                     ...{author: e.target.value}
                               })}
                               disabled={serviceWorking}
                          />
                    </div>
                    <div className='col-6 text-right mt-2'>owner:</div>
                    <div className='col-6 mt-2'>
                        {
                            editBook!.id > -1 ?
                                <span>{editBook!.owner.first_name} {editBook!.owner.last_name}</span>
                                :
                                <select className='form-control'
                                        value={editBook.owner.id}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditBook({
                                            ...editBook,
                                            ...{owner: members.filter((tm: Member) => tm.id === parseInt(e.target.value))[0]}
                                        })}
                                >
                                    {
                                        members.map((member: Member) =>
                                            <option value={member.id} key={`mem_${member.id}`}>{member.first_name} {member.last_name}</option>
                                        )
                                    }
                                </select>
                        }

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
                      <th></th>
                  </tr>
                </thead>
                {
                  loading ?
                      <div>loading...</div>
                      :
                      <tbody>
                      {
                        books.map((book: Book) =>
                            <tr key={`book_${book.id}`}>
                              <td>{book.title}</td>
                              <td>{book.author}</td>
                              <td>{(book.owner as Member).first_name} {(book.owner as Member).last_name}</td>
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
                                <td>
                                    <button className='btn btn-sm btn-outline-info mr-2'
                                            onClick={() => setEditBook(book)}
                                            disabled={serviceWorking}
                                            >edit</button>
                                    <button className='btn btn-sm btn-outline-danger'
                                            onClick={() => deleteBook(book)}
                                            disabled={serviceWorking}
                                            >delete</button>
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
