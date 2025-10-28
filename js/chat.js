// js/chat.js
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const openChatButton = document.getElementById('open-chat-button');
const closeChatButton = document.getElementById('close-chat-button');
const chatModal = document.getElementById('chat-modal');
const teacherMessagesButton = document.getElementById('teacher-messages-button');
const chatTitle = document.getElementById('chat-title');
const teacherChatView = document.getElementById('teacher-chat-view');
const studentChatView = document.getElementById('student-chat-view');
const studentListPane = document.getElementById('student-list-pane');
const teacherMessagePane = document.getElementById('teacher-message-pane');
const studentSelect = document.getElementById('student-select');

let db, appId, currentStudent, isTeacherView;
let unsubscribeMessages = {};

export function initChatSystem(firebaseServices) {
    db = firebaseServices.db;
    appId = firebaseServices.appId;

    openChatButton.addEventListener('click', () => chatModal.classList.remove('hidden'));
    closeChatButton.addEventListener('click', () => chatModal.classList.add('hidden'));
    teacherMessagesButton.addEventListener('click', () => {
        chatModal.classList.remove('hidden');
        renderTeacherStudentList();
    });
}

export function loadStudentConversation(studentName) {
    currentStudent = studentName;
    isTeacherView = false;
    chatTitle.textContent = `Leave a message for the teacher`;
    teacherChatView.classList.add('hidden');
    studentChatView.classList.remove('hidden');
    studentChatView.innerHTML = createChatInterface(currentStudent, 'student');
    listenForMessages(currentStudent, 'student');
}

function renderTeacherStudentList() {
    isTeacherView = true;
    chatTitle.textContent = "All Messages";
    studentChatView.classList.add('hidden');
    teacherChatView.classList.remove('hidden');
    const studentOptions = Array.from(studentSelect.options).filter(opt => opt.value);
    studentListPane.innerHTML = '';
    studentOptions.forEach(opt => {
        const studentName = opt.value;
        const studentEl = document.createElement('button');
        studentEl.className = 'block w-full text-left p-3 hover:bg-slate-200 focus:bg-blue-100 outline-none';
        studentEl.textContent = studentName;
        studentEl.onclick = () => {
            Array.from(studentListPane.children).forEach(child => child.classList.remove('bg-blue-100'));
            studentEl.classList.add('bg-blue-100');
            loadTeacherConversation(studentName);
        };
        studentListPane.appendChild(studentEl);
    });
    teacherMessagePane.innerHTML = `<div class="p-4 h-full flex items-center justify-center text-center text-slate-500">Select a student to view messages.</div>`;
}

function loadTeacherConversation(studentName) {
    chatTitle.textContent = `Chat with ${studentName}`;
    teacherMessagePane.innerHTML = createChatInterface(studentName, 'teacher');
    listenForMessages(studentName, 'teacher');
}

function createChatInterface(conversationId, userType) {
    const messagesContainerId = `${userType}-messages-${conversationId.replace(/\s+/g, '-')}`;
    const formId = `${userType}-form-${conversationId.replace(/\s+/g, '-')}`;
    const inputId = `${userType}-input-${conversationId.replace(/\s+/g, '-')}`;
    
    return `
        <div id="${messagesContainerId}" class="flex-1 p-4 overflow-y-auto bg-white flex flex-col gap-2"></div>
        <form id="${formId}" class="p-2 border-t">
            <div class="flex gap-2">
                <input id="${inputId}" type="text" class="flex-1 bg-slate-100 border-slate-300 rounded-lg p-2 text-sm" placeholder="Type a message...">
                <button type="submit" class="bg-blue-600 text-white rounded-lg px-4 font-bold text-sm">Send</button>
            </div>
        </form>
    `;
}

async function deleteMessage(studentName, messageId) {
    if (confirm("Are you sure you want to delete this message?")) {
        const messageRef = doc(db, `/artifacts/${appId}/public/data/chats/${studentName}/messages`, messageId);
        await deleteDoc(messageRef);
    }
}

async function markMessagesAsRead(studentName, snapshot) {
    const batch = writeBatch(db);
    let hasUnread = false;
    snapshot.forEach(doc => {
        const msg = doc.data();
        if (msg.sender === 'teacher' && !msg.isRead) {
            batch.update(doc.ref, { isRead: true });
            hasUnread = true;
        }
    });
    if (hasUnread) {
        await batch.commit();
    }
}

function listenForMessages(studentName, userType) {
    const conversationId = studentName;
    const containerId = `${userType}-messages-${conversationId.replace(/\s+/g, '-')}`;
    const messagesContainer = document.getElementById(containerId);
    
    if (unsubscribeMessages[conversationId]) unsubscribeMessages[conversationId]();

    const messagesRef = collection(db, `/artifacts/${appId}/public/data/chats/${conversationId}/messages`);
    const q = query(messagesRef, orderBy("timestamp"));
    
    unsubscribeMessages[conversationId] = onSnapshot(q, (snapshot) => {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = '';
        
        if (!isTeacherView) {
            markMessagesAsRead(studentName, snapshot);
        }

        snapshot.forEach(doc => {
            const msg = doc.data();
            const msgId = doc.id;
            const isSender = (isTeacherView && msg.sender === 'teacher') || (!isTeacherView && msg.sender === 'student');
            
            const msgWrapper = document.createElement('div');
            msgWrapper.className = `flex items-end gap-2 group ${isSender ? 'flex-row-reverse' : ''}`;

            const msgBubble = document.createElement('div');
            msgBubble.className = `p-2 my-1 rounded-lg max-w-xs text-sm ${isSender ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`;
            msgBubble.textContent = msg.text;

            let readStatus = '';
            if (isSender && msg.sender === 'teacher') {
                const status = msg.isRead ? 'Seen ✔' : 'Sent';
                readStatus = `<div class="text-xs text-slate-400 mt-1">${status}</div>`;
            }

            // Add delete button on ALL messages, but only for the teacher
            if (isTeacherView) {
                const deleteBtn = document.createElement('button');
                // Place button on the opposite side of the bubble for easier clicking
                deleteBtn.className = `text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ${isSender ? 'mr-auto' : 'ml-auto'}`;
                deleteBtn.innerHTML = `&times;`;
                deleteBtn.onclick = () => deleteMessage(studentName, msgId);

                if (isSender) {
                    msgWrapper.insertBefore(deleteBtn, msgWrapper.firstChild);
                } else {
                    msgWrapper.appendChild(deleteBtn);
                }
            }

            msgWrapper.appendChild(msgBubble);
            messagesContainer.appendChild(msgWrapper);

            if(readStatus) {
                const statusEl = document.createElement('div');
                statusEl.className = `w-full flex ${isSender ? 'justify-end' : ''}`;
                statusEl.innerHTML = readStatus;
                messagesContainer.appendChild(statusEl);
            }
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    const formId = `${userType}-form-${conversationId.replace(/\s+/g, '-')}`;
    const messageForm = document.getElementById(formId);
    if (messageForm) {
        messageForm.onsubmit = (e) => {
            e.preventDefault();
            const inputId = `${userType}-input-${conversationId.replace(/\s+/g, '-')}`;
            const messageInput = document.getElementById(inputId);
            const text = messageInput.value.trim();
            if(text) {
                sendMessage(studentName, text);
                messageInput.value = '';
            }
        };
    }
}

async function sendMessage(studentName, text) {
    const sender = isTeacherView ? 'teacher' : 'student';
    const messagesRef = collection(db, `/artifacts/${appId}/public/data/chats/${studentName}/messages`);
    
    const messagePayload = {
        text,
        sender,
        timestamp: serverTimestamp()
    };

    if (sender === 'teacher') {
        messagePayload.isRead = false;
    }

    await addDoc(messagesRef, messagePayload);
}