
/* ============================================================
   ANGGE BIRTHDAY EXPERIENCE
   Sistema principal de interacciones
   Versión 2.0
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* ========================================================
       1. CONFIGURACIÓN Y ELEMENTOS
    ======================================================== */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const loadingScreen = $("#loading-screen");
    const loadingPhase = $("#loading-phase");
    const welcomeCard = $("#welcome-card");
    const enterAdventureBtn = $("#enter-adventure-btn");"#loading-screen");

    const sceneIds = [
        "scene-intro",
        "scene-island",
        "scene-mission",
        "scene-memories",
        "scene-gift",
        "scene-letter",
        "scene-finale"
    ];

    const dialogueContainer = $("#dialogue-container");
    const dialogueSpeaker = $("#dialogue-speaker");
    const dialogueText = $("#dialogue-text");
    const nextDialogueButton = $("#next-dialogue");

    const startButton = $("#start-adventure");
    const missionButton = $("#accept-mission");

    const continueMemoriesButton = $("#continue-memories");
    const continueGiftButton = $("#continue-gift");

    const openGiftButton = $("#open-gift");
    const giftReveal = $("#gift-reveal");

    const openLetterButton = $("#open-letter");
    const letterMessage = $("#letter-message");

    const finishLetterButton = $("#finish-letter");
    const restartButton = $("#restart-adventure");

    const photoMessageDisplay = $("#photo-message-display");

    const backgroundMusic = $("#background-music");
    const soundEffects = $("#sound-effects");

    const musicToggle = $("#music-toggle");
    const soundToggle = $("#sound-toggle");

    const notification = $("#notification");


    /* ========================================================
       2. ESTADO DE LA EXPERIENCIA
    ======================================================== */

    let currentScene = "scene-intro";

    let dialogueList = [];
    let dialogueIndex = 0;
    let dialogueCallback = null;

    let musicEnabled = false;
    let soundsEnabled = true;

    let notificationTimer = null;

    let particlesInitialized = false;


    /* ========================================================
       3. PANTALLA DE CARGA
    ======================================================== */

    function hideLoadingScreen() {

        if (!loadingScreen) return;

        loadingScreen.classList.add("hidden");

        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 1000);

    }


    /* ========================================================
       4. CAMBIO DE ESCENARIOS
    ======================================================== */

    function showScene(sceneId) {

        const targetScene = document.getElementById(sceneId);

        if (!targetScene) {
            console.error("No se encontró el escenario:", sceneId);
            return;
        }

        sceneIds.forEach(id => {

            const scene = document.getElementById(id);

            if (scene) {
                scene.classList.remove("active");
            }

        });

        targetScene.classList.add("active");

        currentScene = sceneId;

        hideDialogue();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ========================================================
       5. NOTIFICACIONES
    ======================================================== */

    function showNotification(message) {

        if (!notification) return;

        notification.textContent = message;
        notification.classList.add("show");

        clearTimeout(notificationTimer);

        notificationTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);

    }


    /* ========================================================
       6. SISTEMA DE SONIDOS
    ======================================================== */

    function playSound() {

        if (!soundsEnabled || !soundEffects) return;

        const hasSound =
            soundEffects.currentSrc ||
            soundEffects.getAttribute("src");

        if (!hasSound) return;

        soundEffects.currentTime = 0;

        soundEffects.play().catch(() => {
            // El navegador puede bloquear la reproducción.
        });

    }


    /* ========================================================
       7. SISTEMA DE MÚSICA
    ======================================================== */

    function startMusic() {

        if (!backgroundMusic || !musicEnabled) return;

        const hasMusic =
            backgroundMusic.currentSrc ||
            backgroundMusic.getAttribute("src");

        if (!hasMusic) {
            showNotification("Todavía falta agregar la música.");
            return;
        }

        backgroundMusic.volume = 0.35;

        backgroundMusic.play().catch(() => {
            showNotification("No se pudo iniciar la música.");
        });

    }


    function updateMusicButton() {

        if (!musicToggle) return;

        musicToggle.classList.toggle("enabled", musicEnabled);

        musicToggle.setAttribute(
            "aria-pressed",
            String(musicEnabled)
        );

    }


    function updateSoundButton() {

        if (!soundToggle) return;

        soundToggle.classList.toggle("enabled", soundsEnabled);

        soundToggle.setAttribute(
            "aria-pressed",
            String(soundsEnabled)
        );

    }


    if (musicToggle) {

        musicToggle.addEventListener("click", () => {

            musicEnabled = !musicEnabled;

            updateMusicButton();

            if (musicEnabled) {
                startMusic();
            } else if (backgroundMusic) {
                backgroundMusic.pause();
            }

        });

    }


    if (soundToggle) {

        soundToggle.addEventListener("click", () => {

            soundsEnabled = !soundsEnabled;

            updateSoundButton();

            showNotification(
                soundsEnabled
                    ? "Efectos de sonido activados"
                    : "Efectos de sonido desactivados"
            );

        });

    }


    /* ========================================================
       8. SISTEMA DE DIÁLOGOS
    ======================================================== */

    function showDialogue(dialogues, callback = null) {

        if (!dialogueContainer) return;

        dialogueList = dialogues;
        dialogueIndex = 0;
        dialogueCallback = callback;

        dialogueContainer.classList.add("show");
        dialogueContainer.setAttribute("aria-hidden", "false");

        displayDialogue();

    }


    function displayDialogue() {

        const dialogue = dialogueList[dialogueIndex];

        if (!dialogue) return;

        dialogueSpeaker.textContent = dialogue.speaker;
        dialogueText.textContent = dialogue.text;

        if (nextDialogueButton) {

            nextDialogueButton.textContent =
                dialogueIndex === dialogueList.length - 1
                    ? "Continuar →"
                    : "Siguiente →";

        }

        $$(".character").forEach(character => {
            character.classList.remove("speaking");
        });

        if (dialogue.character) {

            const activeCharacter =
                document.getElementById(dialogue.character);

            if (activeCharacter) {
                activeCharacter.classList.add("speaking");
            }

        }

        playSound();

    }


    function nextDialogue() {

        if (dialogueIndex < dialogueList.length - 1) {

            dialogueIndex++;

            displayDialogue();

            return;

        }

        const callback = dialogueCallback;

        hideDialogue();

        if (typeof callback === "function") {
            callback();
        }

    }


    function hideDialogue() {

        if (!dialogueContainer) return;

        dialogueContainer.classList.remove("show");
        dialogueContainer.setAttribute("aria-hidden", "true");

        $$(".character").forEach(character => {
            character.classList.remove("speaking");
        });

        dialogueList = [];
        dialogueIndex = 0;
        dialogueCallback = null;

    }


    if (nextDialogueButton) {
        nextDialogueButton.addEventListener("click", nextDialogue);
    }

    if (dialogueContainer) {
        dialogueContainer.addEventListener("click", (e) => {
            if (e.target !== nextDialogueButton) {
                nextDialogue();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if ((e.code === "Space" || e.code === "Enter") && dialogueContainer && dialogueContainer.classList.contains("show")) {
            e.preventDefault();
            nextDialogue();
        }
    });


    /* ========================================================
       9. ANIMACIÓN DE PERSONAJES
    ======================================================== */

    function showCharacters() {

        const characters = $$(".character");

        characters.forEach((character, index) => {

            character.classList.remove("visible");

            setTimeout(() => {
                character.classList.add("visible");
            }, 300 + index * 450);

        });

    }


    function hideCharacters() {

        $$(".character").forEach(character => {

            character.classList.remove("visible");
            character.classList.remove("speaking");

        });

    }


    /* ========================================================
       10. DIÁLOGOS DE MIKE, LU Y OG
    ======================================================== */

    const islandDialogues = [

        {
            speaker: "Mike",
            character: "mike",
            text: "¡Eh! ¡Eh! ¡Lu! ¡Og! ¡Alguien acaba de llegar a nuestra isla!"
        },

        {
            speaker: "Lu",
            character: "lu",
            text: "Mike, no tienes que gritar. Ya la vimos llegar."
        },

        {
            speaker: "Og",
            character: "og",
            text: "¡Hola! ¡Bienvenida! ¿Vienes a pasar un día con nosotros?"
        },

        {
            speaker: "Mike",
            character: "mike",
            text: "¡Hoy no es un día cualquiera! Tenemos una misión muy importante."
        },

        {
            speaker: "Lu",
            character: "lu",
            text: "Y antes de que preguntes, sí, hemos preparado algo especial."
        },

        {
            speaker: "Og",
            character: "og",
            text: "¡Porque hoy es el cumpleaños de Angge!"
        },

        {
            speaker: "Mike",
            character: "mike",
            text: "¡Así que prepárate! ¡Esta aventura acaba de comenzar!"
        }

    ];


    /* ========================================================
       11. ESCENA INICIAL
    ======================================================== */

    // Ocultar pantalla de bienvenida al hacer clic en el boton o en la pantalla
    if (enterAdventureBtn) {
        enterAdventureBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playSound();
            startMusic();
            hideLoadingScreen();
        });
    }

    if (loadingScreen) {
        loadingScreen.addEventListener("click", () => {
            hideLoadingScreen();
        });
    }

    if (startButton) {

        startButton.addEventListener("click", () => {

            playSound();

            startMusic();

            showScene("scene-island");

            showCharacters();

            showDialogue(islandDialogues, () => {

                showScene("scene-mission");

            });

        });

    }


    /* ========================================================
       12. ACEPTAR LA MISIÓN
    ======================================================== */

    if (missionButton) {

        missionButton.addEventListener("click", () => {

            playSound();

            showScene("scene-memories");

        });

    }


    /* ========================================================
       13. FOTOGRAFÍAS Y MENSAJES
    ======================================================== */

    const photoButtons = $$(".photo-message");

    photoButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            const message = button.dataset.message;

            if (!message || !photoMessageDisplay) return;

            photoMessageDisplay.textContent = message;

            photoMessageDisplay.classList.remove("show");

            // Reinicia la animación de aparición.
            void photoMessageDisplay.offsetWidth;

            photoMessageDisplay.classList.add("show");

            photoButtons.forEach(photoButton => {
                photoButton.classList.remove("selected");
            });

            button.classList.add("selected");

            playSound();

        });

    });


    if (continueMemoriesButton) {

        continueMemoriesButton.addEventListener("click", () => {

            playSound();

            showScene("scene-gift");

        });

    }


    /* ========================================================
       14. REGALO INTERACTIVO
    ======================================================== */

    function openGift() {

        if (!openGiftButton || !giftReveal) return;

        if (openGiftButton.classList.contains("opened")) return;

        openGiftButton.classList.add("opened");

        openGiftButton.setAttribute("aria-expanded", "true");

        giftReveal.classList.add("show");

        giftReveal.setAttribute("aria-hidden", "false");

        playSound();

    }


    if (openGiftButton) {
        openGiftButton.addEventListener("click", openGift);
    }


    if (continueGiftButton) {

        continueGiftButton.addEventListener("click", () => {

            const giftIsOpen =
                openGiftButton &&
                openGiftButton.classList.contains("opened");

            if (!giftIsOpen) {

                showNotification("¡Primero tienes que abrir el regalo!");

                return;

            }

            playSound();

            showScene("scene-letter");

        });

    }


    /* ========================================================
       15. CARTA INTERACTIVA
    ======================================================== */

    function openLetter() {

        if (!openLetterButton || !letterMessage) return;

        if (openLetterButton.classList.contains("opened")) return;

        openLetterButton.classList.add("opened");

        openLetterButton.setAttribute("aria-expanded", "true");

        letterMessage.classList.add("show");

        letterMessage.setAttribute("aria-hidden", "false");

        playSound();

    }


    if (openLetterButton) {
        openLetterButton.addEventListener("click", openLetter);
    }


    if (finishLetterButton) {

        finishLetterButton.addEventListener("click", () => {

            const letterIsOpen =
                openLetterButton &&
                openLetterButton.classList.contains("opened");

            if (!letterIsOpen) {

                showNotification("Primero abre tu carta.");

                return;

            }

            playSound();

            showScene("scene-finale");

        });

    }


    /* ========================================================
       16. REINICIAR TODA LA AVENTURA
    ======================================================== */

    function resetExperience() {

        hideDialogue();

        hideCharacters();

        // Reiniciar regalo.
        if (openGiftButton) {

            openGiftButton.classList.remove("opened");

            openGiftButton.setAttribute("aria-expanded", "false");

        }

        if (giftReveal) {

            giftReveal.classList.remove("show");

            giftReveal.setAttribute("aria-hidden", "true");

        }

        // Reiniciar carta.
        if (openLetterButton) {

            openLetterButton.classList.remove("opened");

            openLetterButton.setAttribute("aria-expanded", "false");

        }

        if (letterMessage) {

            letterMessage.classList.remove("show");

            letterMessage.setAttribute("aria-hidden", "true");

        }

        // Reiniciar fotografías.
        if (photoMessageDisplay) {

            photoMessageDisplay.textContent = "";

            photoMessageDisplay.classList.remove("show");

        }

        photoButtons.forEach(button => {
            button.classList.remove("selected");
        });

        // Regresar al principio.
        showScene("scene-intro");

    }


    if (restartButton) {

        restartButton.addEventListener("click", () => {

            playSound();

            resetExperience();

        });

    }


    /* ========================================================
       17. PARTÍCULAS DECORATIVAS
    ======================================================== */

    function createParticles(containerId, amount) {

        const container = document.getElementById(containerId);

        if (!container) return;

        // Evita duplicar partículas si se vuelve a inicializar.
        if (container.children.length > 0) return;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < amount; i++) {

            const particle = document.createElement("span");

            particle.className = "particle";

            particle.style.left = `${Math.random() * 100}%`;

            particle.style.top = `${Math.random() * 100}%`;

            particle.style.animationDelay =
                `${Math.random() * 5}s`;

            particle.style.animationDuration =
                `${3 + Math.random() * 5}s`;

            const size = 2 + Math.random() * 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            fragment.appendChild(particle);

        }

        container.appendChild(fragment);

    }


    function initializeParticles() {

        if (particlesInitialized) return;

        createParticles("intro-particles", 25);

        createParticles("island-particles", 35);

        createParticles("finale-particles", 45);

        particlesInitialized = true;

    }


    /* ========================================================
       18. INICIALIZACIÓN GENERAL
    ======================================================== */

    function initializeExperience() {

        showScene("scene-intro");

        hideCharacters();

        hideDialogue();

        updateMusicButton();

        updateSoundButton();

        initializeParticles();

        // La pantalla de carga desaparece al terminar
        // la inicialización.
        setTimeout(() => {
            hideLoadingScreen();
        }, 800);

        console.log("Angge Birthday Experience: inicializada correctamente.");

    }


    initializeExperience();


});
