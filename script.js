document.addEventListener('DOMContentLoaded', () => {
    // Select all necessary DOM elements
    const startButton = document.getElementById('start-button');
    const submitButton = document.getElementById('submit-button');
    const answerInput = document.getElementById('answer-input');
    const feedbackMessage = document.getElementById('feedback-message');
    const welcomeScreen = document.getElementById('welcome-screen');
    const puzzleScreen = document.getElementById('puzzle-screen');
    const finalScreen = document.getElementById('final-screen');
    const puzzleTitle = document.getElementById('puzzle-title');
    const puzzleContent = document.getElementById('puzzle-content');
    const finalMessageDiv = document.getElementById('final-message');
    const audioElement = document.getElementById('background-music'); // Select audio element

    let currentPuzzleIndex = 0; // Tracks the current puzzle being displayed

    // --- Helper Functions for Puzzles (น้องรหัสใช้ใน Console ได้) ---

    /**
     * Decodes a string using Caesar Cipher.
     * @param {string} str The string to decode.
     * @param {number} key The shift key.
     * @returns {string} The decoded string.
     */
    function caesarDecode(str, key) {
        return str.split('').map(char => {
            const charCode = char.charCodeAt(0);
            if (charCode >= 65 && charCode <= 90) { // Uppercase letters (A-Z)
                return String.fromCharCode(((charCode - 65 - key + 26) % 26) + 65);
            } else if (charCode >= 97 && charCode <= 122) { // Lowercase letters (a-z)
                return String.fromCharCode(((charCode - 97 - key + 26) % 26) + 97);
            }
            return char; // Return non-alphabetic characters as is
        }).join('');
    }

    /**
     * Decodes a Base64 encoded string.
     * @param {string} encodedStr The Base64 string to decode.
     * @returns {string} The decoded string.
     */
    function base64Decode(encodedStr) {
        try {
            // Using browser's built-in atob function
            return atob(encodedStr);
        } catch (e) {
            console.error("Base64 decoding error:", e);
            return "เกิดข้อผิดพลาดในการถอดรหัส Base64 (เช็ค Base64 string หรือไม่)";
        }
    }

    // --- Puzzle Data ---
    const puzzles = [
        {
            id: 1,
            title: "ปริศนาที่ 1: เติมคำที่หายไป",
            question: `
"H_LL_ W_RLD"

**คำใบ้:** เติมตัวอักษรที่หายไปในคำเหล่านี้ให้สมบูรณ์ โดยใช้ตัวอักษรที่พบได้บ่อยมากในภาษาอังกฤษ
`,
            answer: "HELLOWORLD", // คำตอบที่ถูกต้องหลังจากเติมแล้ว
            nextClue: "ตัวเลขสำคัญสำหรับปริศนาถัดไปคือ: 3 (มาจากจำนวนตัวอักษรที่หายไปทั้งหมดในปริศนาแรก)"
        },
        {
            id: 2,
            title: "ปริศนาที่ 2: ถอดรหัสลับ Caesar Cipher",
            question: (previousClue) => `
จากคำใบ้ก่อนหน้า: "${previousClue}"
ข้อความเข้ารหัส: \`Wklv lv d suhsdudwlrq iru wkdw. Brxu Answhu Lv: Dvwhu\`

**คำใบ้:**
* ข้อความนี้ถูกเข้ารหัสแบบ **Caesar Cipher** (การเลื่อนตัวอักษร)
* "Key" (จำนวนที่ใช้เลื่อน) คือตัวเลขจากคำใบ้ก่อนหน้า (ลองใช้ 3 ดูสิ!)
* **วิธีแก้ใน Console (กด F12):** พิมพ์ \`caesarDecode("Wklv lv d suhsdudwlrq iru wkdw. Brxu Answhu Lv: Dvwhu", 3)\` แล้ว Enter
* คำตอบที่ต้องการคือ **คำตอบสุดท้ายที่เป็นภาษาอังกฤษ** จากข้อความที่ถอดรหัสแล้ว
`,
            expectedDecodedText: "This is a preparation for that. Your Answer Is: Aster", // เพื่อใช้ในการแสดงผลให้น้องเห็นเมื่อถอดรหัส (ถ้าแก้ได้)
            answer: "ASTER", // คำตอบที่น้องต้องป้อน
            nextClue: (decodedAnswer) => `คำตอบจากปริศนาที่ 2 คือ: "${decodedAnswer}"`
        },
        {
            id: 3,
            title: "ปริศนาที่ 3: ถอดรหัส Base64 - ตามหาคำสุดท้าย!",
            question: (previousClue) => `
จากคำใบ้ก่อนหน้า: "${previousClue}"

ข้อความเข้ารหัส: \`VGhlIGZpbmFsIGFuc3dlciBpcyBhYm91dCB3aGF0IHdlIGZpbmQgaW4gdGhlIHdvcmxkIGFmdGVyIGFuIGFzdGVyLiBJdCdzIHRoZSBzdGFydCBvZiBldmVyeXRoaW5nLg==\`

**คำใบ้:**
* ข้อความนี้ถูกเข้ารหัสแบบ **Base64 Encoding**
* **วิธีแก้ใน Console (กด F12):** พิมพ์ \`base64Decode("VGhlIGZpbmFsIGFuc3dlciBpcyBhYm91dCB3aGF0IHdlIGZpbmQgaW4gdGhlIHdvcmxkIGFmdGVyIGFuIGFzdGVyLiBJdCdzIHRoZSBzdGFydCBvZiBldmVyeXRoaW5nLg==")\` แล้ว Enter
* เมื่อถอดรหัสแล้ว ให้หา **คำภาษาอังกฤษที่สำคัญ** ที่เป็นจุดเริ่มต้นของทุกสิ่งหลังจาก 'aster'
`,
            expectedDecodedText: "The final answer is about what we find in the world after an aster. It's the start of everything.", // เพื่อใช้ในการแสดงผลให้น้องเห็นเมื่อถอดรหัส
            answer: "STAR", // คำตอบที่น้องต้องป้อน (หลังจาก aster คือ star - ดาว)
            nextClue: (decodedAnswer) => `
คำตอบจากปริศนาที่ 3 คือ: "${decodedAnswer}"

และนี่คือภาพสุดท้ายของคำใบ้:
\`\`\`
    .   * .
  .     .     .
* ${decodedAnswer}   *
  .     .     .
    '   * '
\`\`\`
`
        }
    ];

    // Store the clue from the previous puzzle to pass to the next one
    let previousClue = "";

    // --- Core Functions ---

    /**
     * Controls which screen is currently visible.
     * @param {HTMLElement} screenToShow The DOM element of the screen to make active.
     */
    function showScreen(screenToShow) {
        // Hide all screens
        welcomeScreen.classList.remove('active');
        puzzleScreen.classList.remove('active');
        finalScreen.classList.remove('active');
        // Show the target screen
        screenToShow.classList.add('active');
    }

    /**
     * Loads and displays the current puzzle based on `currentPuzzleIndex`.
     */
    function loadPuzzle() {
        if (currentPuzzleIndex < puzzles.length) {
            const puzzle = puzzles[currentPuzzleIndex];
            puzzleTitle.textContent = puzzle.title;

            // Handle dynamic question generation for puzzles 2 and 3
            if (typeof puzzle.question === 'function') {
                puzzleContent.innerHTML = puzzle.question(previousClue);
            } else {
                puzzleContent.innerHTML = puzzle.question;
            }

            // If it's puzzle 2 or 3, log the decoded text to console for debugging/hint
            if (puzzle.id === 2 || puzzle.id === 3) {
                console.log(`%c[คำใบ้สำหรับน้องรหัส] ถอดรหัสแล้ว:`, 'color: #b0e0e6; font-weight: bold;', puzzle.expectedDecodedText);
            }
            // Also log the helper functions if it's puzzle 2 or 3
            if (puzzle.id === 2) {
                console.log(`%cลองใช้ฟังก์ชันช่วยถอดรหัส Caesar Cipher ใน Console:`, 'color: #e0b0ff; font-weight: bold;');
                console.log(caesarDecode.toString());
            } else if (puzzle.id === 3) {
                console.log(`%cลองใช้ฟังก์ชันช่วยถอดรหัส Base64 ใน Console:`, 'color: #e0b0ff; font-weight: bold;');
                console.log(base64Decode.toString());
            }

            answerInput.value = ''; // Clear previous answer
            feedbackMessage.textContent = ''; // Clear feedback message
            showScreen(puzzleScreen); // Display the puzzle screen
            answerInput.focus(); // Set focus to the input field
        } else {
            // All puzzles solved, show the final screen
            showFinalScreen();
        }
    }

    /**
     * Checks the user's answer against the correct answer for the current puzzle.
     */
    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toUpperCase(); // Clean and standardize user input
        const correctAnswer = puzzles[currentPuzzleIndex].answer.toUpperCase(); // Standardize correct answer

        if (userAnswer === correctAnswer) {
            feedbackMessage.textContent = "ถูกต้อง! เยี่ยมมาก!";
            feedbackMessage.classList.remove('error'); // Ensure no error styling
            
            // Store the clue for the next puzzle
            if (typeof puzzles[currentPuzzleIndex].nextClue === 'function') {
                // If nextClue is a function, call it with the correct answer
                previousClue = puzzles[currentPuzzleIndex].nextClue(puzzles[currentPuzzleIndex].answer);
            } else {
                previousClue = puzzles[currentPuzzleIndex].nextClue;
            }

            // Move to the next puzzle after a short delay
            setTimeout(() => {
                currentPuzzleIndex++;
                loadPuzzle();
            }, 1500); // Wait 1.5 seconds
        } else {
            feedbackMessage.textContent = "ยังไม่ถูกนะ ลองใหม่อีกครั้ง!";
            feedbackMessage.classList.add('error'); // Add error styling
        }
    }

    /**
     * Displays the final congratulations screen with the concluding message.
     * Also handles playing music and redirecting to Instagram.
     */
    function showFinalScreen() {
        // Display the final ASCII art and message, using the last clue generated
        finalMessageDiv.innerHTML = `
            ${previousClue}
            <p><strong>ภารกิจสำเร็จ!</strong></p>
            <p>เธอไขปริศนาได้เก่งมาก! ตอนนี้ไปพบพี่รหัสได้เลย!</p>
        `;
        showScreen(finalScreen);

        // Play background music ONLY when final screen is shown
        // Browsers often require user interaction to play audio.
        // The click to start button usually fulfills this.
        if (audioElement) {
            audioElement.play().catch(e => console.error("Error playing audio:", e));
        }

        // Redirect to Instagram after a short delay
        setTimeout(() => {
            window.location.href = "https://www.instagram.com/aidxnxlys";
        }, 5000); // Redirect after 5 seconds
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', () => {
        loadPuzzle(); // Start the first puzzle
        // No audio play here, music starts on final screen
    });

    submitButton.addEventListener('click', checkAnswer); // Check answer on button click

    // Allow checking answer by pressing Enter key in the input field
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Initial load: Show the welcome screen when the page loads
    showScreen(welcomeScreen);

    // Make helper functions globally accessible (for console use as hints)
    window.caesarDecode = caesarDecode;
    window.base64Decode = base64Decode;
});