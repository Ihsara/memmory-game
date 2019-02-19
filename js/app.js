
/*
 * Create a list that holds all of your cards
 */

const cards = ['fa-diamond', 'fa-diamond',
             'fa-paper-plane-o', 'fa-paper-plane-o',
             'fa-anchor', 'fa-anchor',
             'fa-bolt', 'fa-bolt',
             'fa-cube', 'fa-cube',
             'fa-leaf', 'fa-leaf',
             'fa-bicycle', 'fa-bicycle',
             'fa-bomb', 'fa-bomb'];
const moveCounter = document.querySelector('.moves');
const restart = document.querySelector('.restart');
const start3 = document.querySelector('#star3');
const start2 = document.querySelector('#star2');

let moves = 0;
function generateCard(card){
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
function initGame(){ 
    let deck = document.querySelector('.deck');
    let cardHTML = shuffle(cards).map(function(card){
        return generateCard(card); 
    });
    moves=0; 
    moveCounter.innerHTML = moves;

    deck.innerHTML = cardHTML.join('');
    setVisibleStar(star3);
    setVisibleStar(star2);
    console.log("New Game loaded!")
}

function addToOpencards(openCards, card){
    if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match') && openCards.length < 2){
        openCards.push(card);
        changeToOpenShow(card)
    }
    return openCards
}

function changeToOpenShow(card){ 
    card.classList.add('open', 'show');
}

function addMatchToCard(card){
    card.classList.add('open', 'show', 'match');
}

function removeOpenShowFromCard(openCards){ 
    openCards.forEach((card)=>{
        card.classList.remove('open', 'show');
    });
    return [];
}

function addMoveCounter(){
    moves += 1;
    moveCounter.innerText = moves
}

function starRating(sec, moves){
    if (sec < 50 && moves < 25){
        return 3; 
    }else if (sec <60 && moves<30){
        return 2;
    }else{
        return 1; 
    }
}

function setHiddenStar(star){
    star.style.visibility = 'hidden';
}

function setVisibleStar(star){
    star.style.visibility = 'visible';
}

function rating(sec, moves){
    if (starRating(sec, moves) == 2){ 
        setHiddenStar(star3); 
    }else if (starRating(sec, moves) == 1){
        setHiddenStar(star3);
        setHiddenStar(star2); 
    }
}
function ratingStarModal(star1, star2, sec, moves){
    if (starRating(sec, moves) == 2){ 
        setHiddenStar(star2); 
    }else if (starRating(sec, moves) == 1){
        setHiddenStar(star2);
        setHiddenStar(star1); 
    }
}
// Taken from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
let sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }
setInterval( ()=>{
    if (!gameDone && gameStart){
        document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    };
    rating(sec, moves);
}, 1000);
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one) d
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) d
 *  - if the list already has another card, check to see if the two cards match d
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) d
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) d
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

initGame(); 
const allCards = document.querySelectorAll('.card');
let openCards = [];
let match = 0;
let gameDone=false;
let gameStart=false;

allCards.forEach((card)=>{
    card.addEventListener('click', (e)=>{
        gameStart=true; 
        openCards = addToOpencards(openCards, card); 
        if (openCards.length == 2){
            if (openCards[0].dataset.card == openCards[1].dataset.card){
                console.log('Match!');
                addMatchToCard(openCards[0]);
                addMatchToCard(openCards[1]);
                openCards = [];
                if (++match == 8){
                    modalVictory.setContent(`<h1>Victory!</h1><p>Time: ${pad(parseInt(sec/60,10))}:${pad(sec%60)}</p><section class="score-panel">   <ul class="stars">
                    <li><i id="star4" class="fa fa-star"></i></li>
                    <li><i id="star5" class="fa fa-star"></i></li>
                    <li><i id="star6" class="fa fa-star"></i></li>
                    </ul></section>`);
                    const star5 = document.querySelector('#star5');
                    const star6 = document.querySelector('#star6');
                    ratingStarModal(star6,star5,sec , moves); 
                    // open modal
                    modalVictory.open();
                    sec=0;
                    gameDone=true;
                    gameStart=false;
                }
            }else {
                setTimeout(() => {
                    openCards = removeOpenShowFromCard(openCards);
                }, 1000);
            }
            addMoveCounter();             
        }
    });
});

restart.addEventListener('click', ()=>{
    initGame(); 
    const allCards = document.querySelectorAll('.card');
    openCards = [];
    match=0;
    gameDone=false;
    gameStart=false;
    sec=0;

    allCards.forEach((card)=>{    
        card.addEventListener('click', (e)=>{
            gameStart=true; 
            openCards = addToOpencards(openCards, card); 
            if (openCards.length == 2){
                if (openCards[0].dataset.card == openCards[1].dataset.card){
                    console.log('Match!');
                    addMatchToCard(openCards[0]);
                    addMatchToCard(openCards[1]);
                    openCards = [];
                    if (++match == 8){
                        modalVictory.setContent(`<h1>Victory!</h1><p>Time: ${pad(parseInt(sec/60,10))}:${pad(sec%60)}</p><section class="score-panel">   <ul class="stars">
                        <li><i id="star4" class="fa fa-star"></i></li>
                        <li><i id="star5" class="fa fa-star"></i></li>
                        <li><i id="star6" class="fa fa-star"></i></li>
                        </ul></section>`);
                        const star5 = document.querySelector('#star5');
                        const star6 = document.querySelector('#star6');
                        ratingStarModal(star6,star5, sec, moves);                         
                        // open modal
                        modalVictory.open();
                        sec=0;
                        gameDone=true;
                        gameStart=false;
                    }                    
                }else {
                    setTimeout(() => {
                        openCards = removeOpenShowFromCard(openCards);
                    }, 1000);
                }
                addMoveCounter(); 
            }
        });
    });    
});

// instanciate new modal
var modalVictory = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function() {
        console.log('modal open');
    },
    onClose: function() {
        console.log('modal closed');
    },
    beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
    }
});

// add a button
modalVictory.addFooterBtn('Okay', 'tingle-btn tingle-btn--primary', ()=> {
    // here goes some logic
    modalVictory.close();
});

// add another button
modalVictory.addFooterBtn('Replay!', 'tingle-btn tingle-btn--danger',() =>{
    // here goes some logic
    modalVictory.close();
});

const replay = document.querySelector('.tingle-btn--danger');

replay.addEventListener('click', ()=>{
    initGame(); 
    const allCards = document.querySelectorAll('.card');
    openCards = [];
    match=0;
    gameDone=false;
    gameStart=false;
    sec=0;

    allCards.forEach((card)=>{    
        card.addEventListener('click', (e)=>{
            gameStart=true; 
            openCards = addToOpencards(openCards, card); 
            if (openCards.length == 2){
                if (openCards[0].dataset.card == openCards[1].dataset.card){
                    console.log('Match!');
                    addMatchToCard(openCards[0]);
                    addMatchToCard(openCards[1]);
                    openCards = [];
                    if (++match == 8){
                        modalVictory.setContent(`<h1>Victory!</h1><p>Time: ${pad(parseInt(sec/60,10))}:${pad(sec%60)}</p><section class="score-panel">   <ul class="stars">
                        <li><i id="star4" class="fa fa-star"></i></li>
                        <li><i id="star5" class="fa fa-star"></i></li>
                        <li><i id="star6" class="fa fa-star"></i></li>
                        </ul></section>`);
                        const star5 = document.querySelector('#star5');
                        const star6 = document.querySelector('#star6');
                        ratingStarModal(star6,star5, sec, moves);                         
                        // open modal
                        modalVictory.open();
                        sec=0;
                        gameDone=true;
                        gameStart=false;
                    }                    
                }else {
                    setTimeout(() => {
                        openCards = removeOpenShowFromCard(openCards);
                    }, 1000);
                }
                addMoveCounter(); 
            }
        });
    });    
});