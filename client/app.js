const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', (event) => addMessage('ChatBot', `${event.user} has joined the conversation!`));
socket.on('removeUser', (event) => addMessage('ChatBot', `${event.user} has left the conversation... :(`));

const loginForm = document.querySelector('#welcome-form');
const messagesSection =document.querySelector('#messages-section');
const messagesList = messagesSection.querySelector('#messages-list');
const addMessageForm = messagesSection.querySelector('#add-messages-form');
const userNameInput = loginForm.querySelector('#username');
const messageContentInput = addMessageForm.querySelector('#message-content');
let userName = '';
const login = (e) => {
    e.preventDefault();
    if(userNameInput.value === userName){
        alert('Please enter Your login');
    } else {
        userName = userNameInput.value;
        let id = socket.id;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join', { user: userName, id: id });
    }

}
loginForm.addEventListener('submit', login);

function addMessage(author, content) {
    const message = document.createElement('li');
    if(author === 'ChatBot'){
        message.setAttribute('class', 'message message--chatBot')
    } else if (author === userName){
        message.setAttribute('class', 'message message--self')
    } else {
        message.setAttribute('class', 'message message--recieved')
    };
    message.innerHTML = 
        `<h3 class="message__author">${userName === author ? 'You' : author }</h3>
        <div class="message__content">
            ${content}
        </div>`;
    messagesList.appendChild(message);
  }
const sendMessage = (e) => {
    e.preventDefault();
    if(messageContentInput.value === ''){
        alert('Please type Your message');
    } else{
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { author: userName, content: messageContentInput.value })
        messageContentInput.value = '';
    } 
}
addMessageForm.addEventListener('submit', sendMessage);