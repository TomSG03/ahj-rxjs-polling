import MailDesk from './maildesk';

const domElmt = document.querySelector('.desk');

const servetPath = 'https://netology-ahj-http-heroku.herokuapp.com';
// const servetPath = 'http://localhost:7070';
const taskName = '/ahj-rxjs';

const mDesk = new MailDesk(domElmt, `${servetPath}${taskName}`, 5000);
mDesk.begin();
