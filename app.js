// --- Code cho trang Quiz (Trắc nghiệm) ---

const TOTAL_QUESTIONS = 3; // Tổng số câu hỏi
const progressBar = document.getElementById('progress-bar-fill');
const questionCounter = document.getElementById('question-counter');

// MỚI: Cập nhật hàm nextQuestion để nhận (câu_tiếp_theo, câu_hiện_tại, nút_đã_chọn)
function nextQuestion(questionNumber, currentQuestionNumber, selectedButton) {
    let currentQuestion = document.querySelector('.quiz-question.active');
    
    // MỚI: Highlight nút được chọn
    if (currentQuestion) {
        // Bỏ highlight tất cả các nút trong câu hiện tại
        let allButtons = currentQuestion.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Chỉ highlight nút vừa bấm
        selectedButton.classList.add('selected');
    }

    // Cập nhật bộ đếm
    if (questionCounter) {
        questionCounter.textContent = `Câu ${questionNumber} / ${TOTAL_QUESTIONS}`;
    }
    
    // Thêm class để chạy animation "trượt ra"
    if (currentQuestion) {
        currentQuestion.classList.add('fading-out');
        currentQuestion.classList.remove('active');
    }

    let nextQ = document.getElementById('q' + questionNumber);

    // Cập nhật thanh tiến trình
    if (progressBar) {
        let percent = (currentQuestionNumber / TOTAL_QUESTIONS) * 100;
        progressBar.style.width = percent + '%';
    }

    // Dùng setTimeout để đợi animation "trượt ra" hoàn thành
    setTimeout(function() {
        if (currentQuestion) {
            currentQuestion.classList.remove('fading-out'); 
        }
        if (nextQ) {
            nextQ.classList.add('active'); 
        }
    }, 400); 
}

// MỚI: Cập nhật hàm finishQuiz
function finishQuiz(selectedButton) {
    // Highlight nút cuối cùng
    let currentQuestion = document.querySelector('.quiz-question.active');
    if (currentQuestion) {
        let allButtons = currentQuestion.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        selectedButton.classList.add('selected');
    }

    // Cập nhật bộ đếm
    if (questionCounter) {
        questionCounter.textContent = `Câu 3 / 3`;
    }

    // Cập nhật thanh tiến trình lên 100%
    if (progressBar) {
        progressBar.style.width = '100%';
    }

    // Chờ 1 chút rồi chuyển trang
    setTimeout(function() {
        window.location.href = 'results.html';
    }, 500); 
}


// --- Code cho trang Kết quả (Confetti) ---
const confettiCanvas = document.getElementById('confetti-canvas');
if (confettiCanvas) {
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


// --- Code cho Chatbot (Nâng cấp Giai đoạn 4) ---

const sendButton = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const quickRepliesContainer = document.getElementById('quick-replies');

// Chỉ chạy code này nếu các phần tử chatbot tồn tại
if (sendButton && userInput && chatWindow && quickRepliesContainer) {

    sendButton.onclick = function() {
        handleUserMessage();
    };

    userInput.onkeydown = function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); 
            handleUserMessage();
        }
    };

    quickRepliesContainer.onclick = function(event) {
        if (event.target.classList.contains('quick-reply-btn')) {
            const messageText = event.target.textContent;
            userInput.value = messageText; 
            handleUserMessage(); 
        }
    };
}

function handleUserMessage() {
    const messageText = userInput.value;
    if (messageText.trim() === "") {
        return; 
    }

    addMessageToChat(messageText, 'user');
    userInput.value = ""; 

    // MỚI: Làm mờ nút gợi ý thay vì ẩn
    quickRepliesContainer.classList.add('disabled');

    showTypingIndicator();

    setTimeout(function() {
        removeTypingIndicator();

        let botResponse = "Đây là câu trả lời mẫu từ AI. Cảm ơn bạn đã thử nghiệm! Ngành CNTT đang rất hot.";
        addMessageToChat(botResponse, 'bot');

        // MỚI: Hiển thị lại nút gợi ý
        quickRepliesContainer.classList.remove('disabled');

    }, 2000); 
}

// Hàm trợ giúp để thêm tin nhắn vào cửa sổ chat
function addMessageToChat(text, sender) {
    const messageRow = document.createElement('div');
    messageRow.classList.add('message-row', sender);

    let messageHTML = '';

    if (sender === 'bot') {
        // MỚI: Thêm class "bot-avatar"
        messageHTML += '<div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>';
    }
    
    messageHTML += `<div class="chat-message ${sender}">${text}</div>`;

    messageRow.innerHTML = messageHTML;
    chatWindow.appendChild(messageRow);
    
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Hàm hiển thị hiệu ứng "đang gõ"
function showTypingIndicator() {
    const typingRow = document.createElement('div');
    typingRow.classList.add('message-row', 'bot', 'typing'); 
    typingRow.id = 'typing-indicator'; 
    
    typingRow.innerHTML = `
        <div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="chat-message bot">
            AI đang trả lời... <!-- MỚI: Thay đổi text -->
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatWindow.appendChild(typingRow);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Hàm xóa hiệu ứng "đang gõ"
function removeTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
        chatWindow.removeChild(typingEl);
    }
}
