import { ajax } from 'rxjs/ajax';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of, interval } from 'rxjs';

export default class MailDesk {
  constructor(domElement, server, time) {
    this.domElement = domElement;
    this.server = server;
    this.time = time;

    this.init();
  }

  begin() {
    const data$ = interval(this.time).pipe(
      switchMap(() => ajax(`${this.server}/messages/unread`).pipe(
        map((userResponse) => userResponse.response),
        catchError((error) => of(error)),
      )),
    );
    data$.subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          for (const message of response.messages) {
            this.showMessage(message);
          }
        }
      },
    });
  }

  showMessage(message) {
    const data = this.setFormatData(message);
    const HTML = `
        <span class="mail-from">${data.from}</span>
        <span class="mail-subj">${data.subject}</span>
        <span class="mail-res">${data.received}</span>
    `;
    const div = document.createElement('div');
    div.className = 'mail';
    div.innerHTML = HTML;
    this.mailDesk.prepend(div);
  }

  // eslint-disable-next-line class-methods-use-this
  setFormatData(message) {
    const data = {
      from: message.from,
      subject: message.subject.length > 15 ? `${message.subject.substr(0, 14)}...` : message.subject,
      received: `${new Date(message.received).toLocaleString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(message.received).toLocaleString([], { day: '2-digit', month: '2-digit', year: '2-digit' })}`,
    };
    return data;
  }

  init() {
    this.mailDesk = this.domElement.querySelector('.desk-body');
    this.domElement.querySelector('.del-mail').addEventListener('click', () => {
      this.mailDesk.innerHTML = '';
    });
  }
}
