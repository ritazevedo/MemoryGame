var cards = $(".memory-card");

let hasFlipped = false;
let isFirstCardFlipped = false;

let firstCard;
let secondCard;

let lockBoard = false;

let timer = 60;
let interval;
let timmerRunning = false;

cards.on("click", function() {
    flipCard.call(this);

    if (!isFirstCardFlipped) {
        isFirstCardFlipped = true;
        startTimer();
    }
    
    if (!timmerRunning && isFirstCardFlipped) {
        startTimer();
    }
});

function flipCard() {
    if (lockBoard) {
        return;
    }

    if ($(this) === firstCard) {
        return;
    }

    $(this).addClass('flip');

    if (!hasFlipped) {
        hasFlipped = true;
        firstCard = $(this);
        return;
    }

    secondCard = $(this);

    if (!timmerRunning) {
        startTimer();
    }

    checkMatch();
}

function checkMatch() {
    firstCard.data("framework") === secondCard.data("framework") ? disableCards() : unflipCards();

    let allCardsFlipped = $(".memory-card:not(.flip)").length === 0;

    if (allCardsFlipped) {
        stopTimer();
        resetGame();
    }
}

function disableCards() {
    firstCard.off("click", flipCard);
    secondCard.off("click", flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.removeClass("flip");
        secondCard.removeClass("flip");
        resetBoard();
    }, 500);
}

function resetBoard() {
    [hasFlipped, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.each(function () {
        let position = Math.floor(Math.random() * (cards.length));
        $(this).css("order", position);
    })
})();

function startTimer() {
    timmerRunning = true;
    interval = setInterval(function () {
        timer--;
        displayTimer();
        if (timer <= 0) {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    timmerRunning = false;
}

function resetTimer() {
    stopTimer();
    timer = 60;
    displayTimer();
}

function displayTimer() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;

    let formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    $("#timerDisplay").text(formattedTime);
}

function resetCards() {
    cards.removeClass("flip");
    resetTimer();
}

function resetGame() {
    resetCards();
    isFirstCardFlipped = false;
}
