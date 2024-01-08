var cards = $(".memory-card");

let hasFlipped = false;
let isFirstCardFlipped = false;
let gameWon = false;
let allCardsFlipped;

let firstCard;
let secondCard;

let lockBoard = false;

let timer = 60;
let interval;
let timerRunning = false;


cards.on("click", function () {
    flipCard.call(this);

    if (!isFirstCardFlipped) {
        isFirstCardFlipped = true;
        startTimer();
    }

    if (!timerRunning && isFirstCardFlipped) {
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

    if (!timerRunning) {
        startTimer();
    }

    checkMatch();
}

function checkMatch() {
    firstCard.data("framework") === secondCard.data("framework") ? disableCards() : unflipCards();

    allCardsFlipped = $(".memory-card:not(.flip)").length === 0;

    if (allCardsFlipped && !gameWon) {
        isFirstCardFlipped = false;
        stopTimer();
        gameWon = true;
        const message = "<div id='messageBox'>" +
            "<div id='message'>Congratulations! You won the game!</div>" +
            "<button id='restartButton'>Restart</button>" +
            "</div>";
        $(".memory-game").append(message);
        $(".memory-card").off("click");
        $("#restartButton").on("click", function () {
            resetGame();
        });
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

function shuffle() {
    cards.each(function () {
        let position = Math.floor(Math.random() * (cards.length));
        $(this).css("order", position);
    })
};

shuffle();

function startTimer() {
    timerRunning = true;
    interval = setInterval(function () {
        timer--;
        displayTimer();
        if (timer <= 0) {
            stopTimer();
            if (!allCardsFlipped) {
                console.log("here");
                gameWon = false;
                const message = "<div id='messageBox'>" +
                    "<div id='message'>Oh no! Time's up...</div>" +
                    "<button id='restartButton'>Restart</button>" +
                    "</div>";
                $(".memory-game").append(message);
                cards.off("click");
                $("#restartButton").on("click", function () {
                    resetGame();
                });
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    timerRunning = false;
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
    shuffle();
    isFirstCardFlipped = false;
    gameWon = false;
    $("#messageBox").hide();
    firstCard = undefined;
    secondCard = undefined;
    $("#restartButton").off("click");
    cards.on("click", function () {
        flipCard.call(this);

        if (!isFirstCardFlipped) {
            isFirstCardFlipped = true;
            startTimer();
        }

        if (!timerRunning && isFirstCardFlipped) {
            startTimer();
        }

        checkMatch();
    });

    stopTimer();
    resetTimer();
}
