(() => {
  const $ = (id) => document.getElementById(id);
  const conversation = $("conversation");
  const talkButton = $("talkButton");
  const talkLabel = $("talkLabel");
  const statusLine = $("statusLine");
  const chatInput = $("chatInput");
  const chatForm = $("chatForm");
  const duckBubble = $("duckBubble");

  let recognition = null;
  let isListening = false;
  let muted = false;
  let stars = 0;
  let currentGame = "vocabulary";
  let quizStep = 0;
  let quizScore = 0;

  const vocab = [
    { word: "Curious", meaning: "Wanting to learn or know more about something.", example: "The curious puppy looked inside the box.", question: "Can you make a sentence using curious?" },
    { word: "Brave", meaning: "Ready to face something that feels scary or difficult.", example: "The brave girl tried riding her bike.", question: "Tell me one thing that makes you feel brave." },
    { word: "Enormous", meaning: "Very, very big!", example: "An enormous whale swam through the ocean.", question: "What enormous thing have you seen?" },
    { word: "Delighted", meaning: "Very happy about something.", example: "I was delighted to see my friend.", question: "What makes you feel delighted?" },
    { word: "Whisper", meaning: "To speak very quietly.", example: "Please whisper in the library.", question: "Can you whisper the word hello?" }
  ];
  let vocabIndex = 0;
  const quiz = [
    { q: "Which word means very happy?", choices: ["Delighted", "Sleepy", "Tiny"], answer: 0, explain: "Delighted means very happy. Hooray!" },
    { q: "Which is the opposite of enormous?", choices: ["Huge", "Tiny", "Giant"], answer: 1, explain: "Tiny is the opposite of enormous." },
    { q: "Which sentence uses 'brave' correctly?", choices: ["The brave child tried again.", "I brave my sandwich.", "The sky is brave."], answer: 0, explain: "That's right! Brave describes someone facing something difficult." }
  ];

  function addMessage(who, text) {
    const row = document.createElement("div");
    row.className = "message " + (who === "You" ? "user-message" : "quacky-message");
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = who === "You" ? "🙂" : "🦆";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const name = document.createElement("strong");
    name.textContent = who === "You" ? "You" : "Quacky";
    const p = document.createElement("p");
    p.textContent = text;
    bubble.append(name, p);
    row.append(avatar, bubble);
    conversation.append(row);
    conversation.scrollTop = conversation.scrollHeight;
  }

  function setStatus(text) { statusLine.textContent = text; }

  function speak(text) {
    if (muted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 1.02;
    utterance.pitch = 1.22;
    const voices = window.speechSynthesis.getVoices();
    const english = voices.filter(v => /^en(-|_)/i.test(v.lang));
    const preferred = english.find(v => /Google UK English Female|Microsoft Sonia|Microsoft Libby|Microsoft Aria|Microsoft Jenny|female/i.test(v.name))
      || english.find(v => /Google.*English/i.test(v.name)) || english[0];
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  function reply(text, options = {}) {
    addMessage("Quacky", text);
    duckBubble.textContent = options.bubble || "Quack! You're doing great!";
    if (!options.noSpeak) speak(text);
    if (options.star) awardStar();
  }

  function awardStar() {
    stars = Math.min(5, stars + 1);
    $("starCount").textContent = `${stars} / 5`;
    $("progressFill").style.width = `${stars * 20}%`;
  }

  function startVocabulary() {
    const item = vocab[vocabIndex % vocab.length];
    reply(`Today's word is ${item.word}! It means: ${item.meaning} Here's an example: ${item.example} ${item.question}`, { bubble: "A new word! Brilliant!", star: true });
    currentGame = "vocabulary";
  }

  function startSpelling() {
    const words = ["because", "friend", "beautiful", "different", "library"];
    const word = words[Math.floor(Math.random() * words.length)];
    window.currentSpelling = word;
    reply(`Spell this word: ${word.split("").join(" ... ")}. Type the letters in the box, or say the word. No peeking at my beak!`, { bubble: "Spell-a-roo!", star: true });
    currentGame = "spelling";
  }

  function startQuiz() {
    quizStep = 0; quizScore = 0; currentGame = "quiz";
    askQuiz();
  }

  function askQuiz() {
    if (quizStep >= quiz.length) {
      reply(`Quiz finished! You got ${quizScore} out of ${quiz.length}. ${quizScore === quiz.length ? "Perfect score! My feathers are impressed!" : "Good effort! Every try helps your brain grow."}`, { bubble: "Quiz champion!", star: true });
      return;
    }
    const item = quiz[quizStep];
    reply(`Question ${quizStep + 1}: ${item.q} Say option 1, 2 or 3, or type the answer. ${item.choices.map((c, i) => `${i + 1}: ${c}`).join(". ")}`, { bubble: "Think carefully!" });
  }

  function startConversation() {
    currentGame = "conversation";
    reply("Chat time! Let's practise everyday English. Tell me what you did today, what you like to play, or what your favourite food is. I'll help you make your sentences even better.", { bubble: "Let's have a natter!" });
  }

  function handleInput(raw) {
    const input = raw.trim();
    if (!input) return;
    addMessage("You", input);
    const lower = input.toLowerCase();

    if (currentGame === "spelling" && window.currentSpelling) {
      const answer = lower.replace(/[^a-z]/g, "");
      if (answer === window.currentSpelling) {
        window.currentSpelling = null;
        reply("You got it! Excellent spelling. I nearly fell off my duck feet!", { bubble: "Super speller!", star: true });
      } else {
        reply("Good try! Have another go. Say or type the letters carefully. You can do it!", { bubble: "Nearly, nearly!" });
      }
      return;
    }

    if (currentGame === "quiz" && quizStep < quiz.length) {
      const item = quiz[quizStep];
      const n = lower.match(/\b(one|two|three|1|2|3|first|second|third)\b/);
      let selected = n ? ({one:1,two:2,three:3,first:1,second:2,third:3}[n[1]] || Number(n[1])) - 1 : item.choices.findIndex(c => lower.includes(c.toLowerCase()));
      if (selected >= 0 && selected <= 2) {
        const correct = selected === item.answer;
        if (correct) quizScore++;
        reply(`${correct ? "Yes! " : "Not quite, but that's okay. "}${item.explain}`, { bubble: correct ? "Nailed it!" : "Keep going!" });
        quizStep++;
        setTimeout(askQuiz, 700);
      } else {
        reply("Choose 1, 2 or 3, or say the answer. Come on, detective!", { bubble: "Pick an answer!" });
      }
      return;
    }

    if (/^(hi|hello|hey|good morning|good afternoon)\b/.test(lower)) {
      reply("Hello, superstar! How are your English skills feeling today? Ready to make them sparkle?", { bubble: "Hello, hello!" }); return;
    }
    if (/\b(your name|who are you|are you (a )?real|official|disney)\b/.test(lower)) {
      reply("I'm Quacky, an original fan-made voice bot inspired by the fun energy of classic cartoon ducks. I'm not an official character and I'm not affiliated with Disney. Now, shall we practise some English?", { bubble: "Quacky, at your service!" }); return;
    }
    if (/\b(help|what can you do|practice|practise)\b/.test(lower)) {
      reply("I can teach you a word, practise spelling, ask a quick quiz, or have an English chat. Pick a mini-game on the right. Go on, choose one!", { bubble: "Four fun choices!" }); return;
    }
    if (/\b(thank you|thanks)\b/.test(lower)) {
      reply("You're very welcome! That's what this duck is here for. Keep practising!", { bubble: "Aw, shucks!" }); return;
    }
    if (/\b(bye|goodbye|see you)\b/.test(lower)) {
      reply("Bye for now! Remember: a little practice every day makes a big difference. Waddle back soon!", { bubble: "See you soon!" }); return;
    }
    if (/\b(favourite|favorite) animal\b/.test(lower) || lower.includes("my favourite animal")) {
      reply("Lovely choice! Can you describe it with three details? Tell me its colour, its size, and one thing it can do.", { bubble: "Tell me more!" }); return;
    }
    if (/\b(i am|i'm|my name is)\b/.test(lower)) {
      reply("Nice to meet you! That's a great start. Can you tell me one thing you enjoy doing? Try starting with: 'I enjoy...'", { bubble: "Pleased to meet you!" }); return;
    }
    if (lower.split(/\s+/).length <= 3 && !/[.!?]/.test(input)) {
      reply(`Good effort! Can you turn "${input}" into a full sentence? Try adding who is doing something and what they are doing.`, { bubble: "Let's grow that sentence!" }); return;
    }
    if (/\b(is this correct|correct my|grammar|check my sentence)\b/.test(lower)) {
      reply("I'd be happy to help! Say or type the sentence you'd like to practise. I'll give you a simple suggestion.", { bubble: "Grammar goggles on!" }); return;
    }
    reply("I like that! Here's a little English challenge: can you say it again as a complete sentence? Remember a capital letter at the start and a full stop at the end. You're doing well!", { bubble: "Sentence sparkle!" , star: true});
  }

  function initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      talkButton.disabled = true;
      talkButton.style.opacity = ".55";
      talkLabel.textContent = "Voice not supported";
      setStatus("Voice recognition is not available in this browser. Please use Chrome or type your message.");
      return;
    }
    recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      isListening = true;
      talkButton.classList.add("recording");
      talkLabel.textContent = "Listening… tap to stop";
      setStatus("I'm listening. Speak clearly, then tap the button again.");
      duckBubble.textContent = "I'm all ears!";
    };
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setStatus(`I heard: “${transcript}”`);
      handleInput(transcript);
    };
    recognition.onerror = event => {
      const messages = {
        "not-allowed": "Microphone permission was blocked. Allow microphone access in your browser settings.",
        "no-speech": "I didn't hear anything. Try again a little closer to the microphone.",
        "network": "Speech recognition needs a network connection in this browser. You can type instead."
      };
      setStatus(messages[event.error] || `Microphone message: ${event.error}. You can type instead.`);
    };
    recognition.onend = () => {
      isListening = false;
      talkButton.classList.remove("recording");
      talkLabel.textContent = "Tap to talk";
    };
  }

  // A quick press toggles recording. Holding for 300ms starts a
  // push-to-talk session that ends as soon as the pointer is released.
  let holdTimer = null;
  let holdActivated = false;
  let suppressNextClick = false;

  function startListening() {
    if (!recognition || isListening) return;
    try { recognition.start(); }
    catch { setStatus("Please wait a moment, then tap the microphone again."); }
  }

  talkButton.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    holdActivated = false;
    suppressNextClick = false;
    holdTimer = window.setTimeout(() => {
      holdActivated = true;
      startListening();
    }, 300);
  });

  function finishPointerTalk() {
    if (holdTimer) {
      window.clearTimeout(holdTimer);
      holdTimer = null;
    }
    if (holdActivated) {
      suppressNextClick = true;
      if (isListening && recognition) recognition.stop();
    }
  }

  talkButton.addEventListener("pointerup", finishPointerTalk);
  talkButton.addEventListener("pointercancel", finishPointerTalk);
  talkButton.addEventListener("pointerleave", finishPointerTalk);

  talkButton.addEventListener("click", () => {
    if (!recognition) return;
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    if (isListening) recognition.stop();
    else startListening();
  });

  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    const value = chatInput.value;
    chatInput.value = "";
    handleInput(value);
  });

  document.querySelectorAll(".game-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".game-button").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const game = button.dataset.game;
      if (game === "vocabulary") startVocabulary();
      if (game === "spelling") startSpelling();
      if (game === "quiz") startQuiz();
      if (game === "conversation") startConversation();
    });
  });

  $("challengeButton").addEventListener("click", () => {
    currentGame = "conversation";
    reply("Challenge time! Describe your favourite animal in three sentences. Tell me its name, what it looks like, and what it likes to do. I'll cheer you on!", { bubble: "Challenge accepted!" });
  });

  $("soundToggle").addEventListener("click", () => {
    muted = !muted;
    $("soundToggle").textContent = muted ? "🔇" : "🔊";
    $("soundToggle").setAttribute("aria-label", muted ? "Turn voice on" : "Mute voice");
    if (muted && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setStatus(muted ? "Voice is muted. You can still read Quacky's replies." : "Voice is on.");
  });

  initRecognition();
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = () => {};
})();