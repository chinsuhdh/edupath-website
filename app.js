document.addEventListener('DOMContentLoaded', () => {
    checkNavLoginStatus();
});

function checkNavLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const profileButtons = document.querySelectorAll('.btn-nav-profile');

    profileButtons.forEach(button => {
        if (loggedInUser) {
            button.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất';
            button.href = '#';
            button.replaceWith(button.cloneNode(true));
            document.querySelector('.btn-nav-profile').addEventListener('click', (e) => {
                 e.preventDefault();
                 logout();
            });

        } else {
            button.innerHTML = '<i class="fa-solid fa-user"></i> Hồ sơ';
            button.href = 'login.html';
        }
    });
}

function logout() {
    localStorage.removeItem('loggedInUser');
    alert('Bạn đã đăng xuất thành công.');
    window.location.href = 'index.html';
}

function checkAuthAndRedirect(pageName) {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) {
        //alert(`Vui lòng đăng nhập để sử dụng chức năng ${pageName}.`);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}


if (document.querySelector('.quiz-container')) {

    if (!checkAuthAndRedirect('Trắc nghiệm')) {

    } else {

        const TOTAL_QUESTIONS = 3;
        const progressBar = document.getElementById('progress-bar-fill');
        const questionCounter = document.getElementById('question-counter');

        window.nextQuestion = function(questionNumber, currentQuestionNumber, selectedButton) {
            let currentQuestion = document.querySelector('.quiz-question.active');

            if (currentQuestion) {
                let allButtons = currentQuestion.querySelectorAll('.answer-btn');
                allButtons.forEach(btn => btn.classList.remove('selected'));
                selectedButton.classList.add('selected');
            }

            if (questionCounter) {
                questionCounter.textContent = `Câu ${questionNumber} / ${TOTAL_QUESTIONS}`;
            }

            if (currentQuestion) {
                currentQuestion.classList.add('fading-out');
                currentQuestion.classList.remove('active');
            }

            let nextQ = document.getElementById('q' + questionNumber);

            if (progressBar) {
                let percent = (currentQuestionNumber / TOTAL_QUESTIONS) * 100;
                progressBar.style.width = percent + '%';
            }

            setTimeout(() => {
                if (currentQuestion) {
                    currentQuestion.classList.remove('fading-out');
                }
                if (nextQ) {
                    nextQ.classList.add('active');
                }
            }, 400);
        }

        window.finishQuiz = function(selectedButton) {
            let currentQuestion = document.querySelector('.quiz-question.active');
            if (currentQuestion) {
                let allButtons = currentQuestion.querySelectorAll('.answer-btn');
                allButtons.forEach(btn => btn.classList.remove('selected'));
                selectedButton.classList.add('selected');
            }
            if (questionCounter) {
                questionCounter.textContent = `Câu 3 / 3`;
            }
            if (progressBar) {
                progressBar.style.width = '100%';
            }
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 500);
        }
    }
}


if (document.querySelector('.results-container')) {

    if (!checkAuthAndRedirect('Kết quả')) {

    } else {

        const confettiCanvas = document.getElementById('confetti-canvas');
        if (confettiCanvas && typeof confetti === 'function') {
            var myConfetti = confetti.create(confettiCanvas, {
                resize: true,
                useWorker: true
            });
            myConfetti({
                particleCount: 150,
                spread: 180,
                origin: { y: 0.6 }
            });
        }
    }
}


if (document.querySelector('.chatbot-container')) {

     if (!checkAuthAndRedirect('Chatbot')) {

    } else {

        const sendButton = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');
        const chatWindow = document.getElementById('chat-window');
        const quickRepliesContainer = document.getElementById('quick-replies');

        if (sendButton && userInput && chatWindow && quickRepliesContainer) {
            sendButton.onclick = handleUserMessage;
            userInput.onkeydown = (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    handleUserMessage();
                }
            };
            quickRepliesContainer.onclick = (event) => {
                if (event.target.classList.contains('quick-reply-btn')) {
                    userInput.value = event.target.textContent;
                    handleUserMessage();
                }
            };
        }

        function handleUserMessage() {
            const messageText = userInput.value;
            if (messageText.trim() === "") return;

            addMessageToChat(messageText, 'user');
            userInput.value = "";
            quickRepliesContainer.classList.add('disabled');
            showTypingIndicator();

            setTimeout(() => {
                removeTypingIndicator();
                let botResponse = "Đây là câu trả lời mẫu từ AI. Cảm ơn bạn đã thử nghiệm! Ngành CNTT đang rất hot.";
                addMessageToChat(botResponse, 'bot');
                quickRepliesContainer.classList.remove('disabled');
            }, 1500);
        }

        function addMessageToChat(text, sender) {
            const messageRow = document.createElement('div');
            messageRow.classList.add('message-row', sender);
            let messageHTML = '';
            if (sender === 'bot') {
                messageHTML += '<div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>';
            }
            messageHTML += `<div class="chat-message ${sender}">${text}</div>`;
            messageRow.innerHTML = messageHTML;
            chatWindow.appendChild(messageRow);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        function showTypingIndicator() {
            const typingRow = document.createElement('div');
            typingRow.classList.add('message-row', 'bot', 'typing');
            typingRow.id = 'typing-indicator';
            typingRow.innerHTML = `
                <div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="chat-message bot">
                    AI đang trả lời...
                    <div class="typing-dots"><span></span><span></span><span></span></div>
                </div>
            `;
            chatWindow.appendChild(typingRow);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        function removeTypingIndicator() {
            const typingEl = document.getElementById('typing-indicator');
            if (typingEl) chatWindow.removeChild(typingEl);
        }
    }
}


if (document.querySelector('.auth-container')) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    const tabs = document.querySelectorAll('.auth-tab');
    const panels = document.querySelectorAll('.auth-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(tab.dataset.tab + '-panel').classList.add('active');
        });
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.textContent = '';
        const email = document.getElementById('register-email').value;
        const pass = document.getElementById('register-password').value;
        const confirmPass = document.getElementById('register-confirm-password').value;

        if (pass !== confirmPass) {
            registerError.textContent = 'Mật khẩu xác nhận không khớp!'; return;
        }
        const users = JSON.parse(localStorage.getItem('edupath_users')) || {};
        if (users[email]) {
            registerError.textContent = 'Email này đã được sử dụng!'; return;
        }
        users[email] = { password: pass, profile: { name: '', level: '12', dream: '' } };
        localStorage.setItem('edupath_users', JSON.stringify(users));
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        document.querySelector('.auth-tab[data-tab="login"]').click();
        registerForm.reset();
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('edupath_users')) || {};

        if (!users[email]) {
            loginError.textContent = 'Email không tồn tại!'; return;
        }
        if (users[email].password !== pass) {
            loginError.textContent = 'Sai mật khẩu!'; return;
        }
        localStorage.setItem('loggedInUser', email);
        window.location.href = 'profile.html';
    });
}


if (document.getElementById('profile-form')) {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) {
        alert('Vui lòng đăng nhập để xem trang này.');
        window.location.href = 'login.html';
    } else {
        loadProfileData();
    }

    const profileForm = document.getElementById('profile-form');
    const logoutButton = document.getElementById('logout-button');
    const profileSuccess = document.getElementById('profile-success');

    function loadProfileData() {
        const users = JSON.parse(localStorage.getItem('edupath_users'));
        const userData = users ? users[loggedInUserEmail] : null;

        if (userData && userData.profile) {
             document.getElementById('profile-welcome').textContent = `Chào mừng, ${loggedInUserEmail}! Cập nhật hồ sơ của bạn dưới đây.`;
             document.getElementById('full-name').value = userData.profile.name || '';
             document.getElementById('school-level').value = userData.profile.level || '12';
             document.getElementById('dream-industry').value = userData.profile.dream || '';
        } else if (userData) {
             document.getElementById('profile-welcome').textContent = `Chào mừng, ${loggedInUserEmail}! Vui lòng cập nhật hồ sơ lần đầu.`;
             if (!userData.profile) {
                 const usersDB = JSON.parse(localStorage.getItem('edupath_users'));
                 usersDB[loggedInUserEmail].profile = { name: '', level: '12', dream: '' };
                 localStorage.setItem('edupath_users', JSON.stringify(usersDB));
             }
        }
    }

    if(profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            profileSuccess.textContent = '';
            const name = document.getElementById('full-name').value;
            const level = document.getElementById('school-level').value;
            const dream = document.getElementById('dream-industry').value;
            const users = JSON.parse(localStorage.getItem('edupath_users'));
            if(users && users[loggedInUserEmail]) {
                users[loggedInUserEmail].profile = { name, level, dream };
                localStorage.setItem('edupath_users', JSON.stringify(users));
                profileSuccess.textContent = 'Đã lưu hồ sơ thành công!';
                setTimeout(() => { profileSuccess.textContent = ''; }, 3000);
            } else {
                alert("Đã có lỗi xảy ra khi lưu hồ sơ.");
            }
        });
    }

    if(logoutButton) {
       logoutButton.addEventListener('click', logout);
    }
}