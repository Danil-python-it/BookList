import "./styles.css";
import { Book, User, BookInformation, ReviewInformation, Review } from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";



// Техническое задание:
// Доработать приложение App, чтобы в отрисованном списке
// были реальные отзывы, автор книги и автор отзыва.
// Данные об отзывах и пользователях можно получить при помощи асинхронных
// функций getUsers, getReviews

// функция getBooks возвращает Promise<Book[]>
// функция getUsers возвращает Promise<User[]>
// функция getReviews возвращает Promise<Review[]>

// В объектах реализующих интерфейс Book указаны только uuid
// пользователей и обзоров

// // В объектах реализующих интерфейс BookInformation, ReviewInformation
// указана полная информация об пользователе и обзоре.

//if(book.reviewIds.length != 0){
//  getReviews().then((e) => {
//    e.map((i,) => {if(i.id == book.reviewIds[0]){setText(i.text)}})
//  })
//}



const toBookInformation = (book: Book, users: User[], reviews:Review[]): BookInformation => {
  
  const FindUser = (id: string): User => {
    let index:number = 0
    users.map((i, _index) => {if(i.id == id){index = _index}})
    return { name: users[index].name, id: users[index].id};
  }

  const checkReviw = (b:Book): ReviewInformation[] => {
    if(b.reviewIds.length > 0 ){
      var Text:string = ""
      var UserId:string = ""
      reviews.map((i,index) => {if(i.id == book.reviewIds[0]){Text = i.text; UserId = i.userId}})
      return [{ id: b.reviewIds[0], text: Text, user: FindUser(UserId) }]
    } 
    return [];
  }

  return {
    id: book.id,
    name: book.name || "Книга без названия",
    author: FindUser(book.authorId),
    reviews: checkReviw(book),
    description: book.description
  };
};


const App: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      
      const fetchedBooks = await getBooks();
      const fetchedUser = await getUsers();
      const fetchedReviews = await getReviews();

      setBooks(fetchedBooks);
      setUsers(fetchedUser);
      setReviews(fetchedReviews);

      setIsLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading &&
        books.map((b) => <Card key={b.id} book={toBookInformation(b, users, reviews)} />)}
    </div>
  );
};

export default App;
