import { interval, BehaviorSubject } from 'rxjs';

import Widget from "./Widget.js";
import Request from "./Request.js";

import mailList from "../template/mailList.html";
import mailItem from "../template/mailItem.html";


export default class Mail {
    constructor(parentNode, updateInterval=1500) {
        this.parentNode = parentNode ?? document.body;
        this.updateInterval = updateInterval;
        this.request = new Request();
        this.messagesSubject$ = new BehaviorSubject([]);
        this.mailListWidget = new Widget('mail-list', mailList);
        this.messages = [];
        
        //init
        this.parentNode.appendChild(this.mailListWidget.element);
        this._init();
    }

    _init() {
        const mailObserver$ = this.request.getRxJsAjax(false, 'GET', '/messages/unread');
        const appInervalObserver$ = interval(this.updateInterval);

        appInervalObserver$.subscribe(() => {
            mailObserver$.subscribe({
                next: value => {
                    let currentArray = this.messagesSubject$.getValue();
                    currentArray =  [...value.response.messages];
                    this.messagesSubject$.next(currentArray);
                },
                error: err => console.error(err.response.message)
            });
        });


        // Подписываемся на изменения в массиве messages
        this.messagesSubject$.subscribe(value => {
            value.forEach(item => {
                this.renderMAilItem(item);


                this.messages.push(item);
            });
        });
    }

    renderMAilItem(value) {
        const {from, subject, received} = value;
        const title = subject.length > 15 ? subject.substring(0, 15) + '...' : subject;
        const formattedDate = new Date(received).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', '');
        const mailItemTemplate = mailItem.replace('{{title}}', title).replace('{{date}}', formattedDate).replace('{{email}}', from);
        
        this.mailListWidget.addElement(mailItemTemplate, 'afterbegin', '.mail-list__list');
    }
}