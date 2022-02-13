window.addEventListener('DOMContentLoaded', () => {

    const squaresAmount = 16,
          fields = [];
    let matches = 0,
        seconds = 0,
        minutes = 0,
        start = false,
        timer,
        steps = 0;


    // createGameField //
    const colors = {
        0: { name: 'red', color: '#ff0000', used: 0 },
        1: { name: 'blue', color: '#0066ff', used: 0 },
        2: { name: 'pink', color: '#ff33cc', used: 0 },
        3: { name: 'violet', color: '#9900cc', used: 0 },
        4: { name: 'yellow', color: '#e6e600', used: 0 },
        5: { name: 'orange', color: '#ff8000', used: 0 },
        6: { name: 'green', color: '#339933', used: 0 },
        7: { name: 'brown', color: '#996633', used: 0 }
    };

    function generateColor() {
        const colorId = Math.floor(Math.random() * 8);

        if (colors[colorId].used != 2) {
            colors[colorId].used++;

            fields.push(colors[colorId].color);
            return 1;
        } else return 0;
    }

    function createGameField(fields, squares) {
        let counter = 0;

        for (let i = 0; fields.length < squares; i++) {
            const state = generateColor();

            if (state) {
                counter++;
            } else continue;
        }

        if (counter === squares) {
            const fieldWrapper = document.querySelector('.game__field');

            new Promise((resolve, reject) => {
                resolve(
                    fields.forEach(() => {
                        const square = document.createElement('div');
                        square.classList.add('game__field-square', 'closed');
                        fieldWrapper.append(square);
                    })
                );
            })
            .then(() => {
                const squares = document.querySelectorAll('.game__field-square');

                    squares.forEach((item, i) => {
                        item.addEventListener('click', () => clickEvent(item, i));
                    });
            });
        }
    }

    createGameField(fields, squaresAmount);

    function setBestTime() {
        const spanBestMinutes = document.querySelector('.game__panel-best-minutes'),
              spanBestSeconds = document.querySelector('.game__panel-best-seconds'),
              myBestSeconds = localStorage.getItem('bestSeconds'),
              myBestMinutes = localStorage.getItem('bestMinutes');

        if(myBestSeconds) {
            setTime(spanBestSeconds, spanBestMinutes, myBestSeconds, myBestMinutes);
        } else {
            setTime(spanBestSeconds, spanBestMinutes, 0, 0);
        }
    }

    setBestTime();

    // click events //
    const firstClick = {
        element: '',
        color: '',
        clear() {
            this.element = '';
            this.color = '';
        }
    };
    let timeOutClick = false; 

    function clickEvent(element, elementId) {
        if(element.classList.contains('opened') || element === firstClick.element || timeOutClick === true) {
           return; 
        }

        if(!start) {
            start = true;
            startTimer();
        }

        const color = fields[elementId];
        const stepsSpan = document.querySelector('.game__panel-steps-count');

        openSquare(element, color);

        if (firstClick.color.length === 0) {
            firstClick.element = element;
            firstClick.color = color;

        } else if (firstClick.color === color && timeOutClick != true) {
            timeOutClick = true;
            matches++;
            steps++;
            setSteps(stepsSpan, steps);

            if (matches === 8) {
                clearInterval(timer);
                congratulations('show');
            } else {
                setTimeout(() => {
                    winSquare(element);
                    winSquare(firstClick.element);

                    firstClick.clear();
                    timeOutClick = false;
                }, 1000);
            }
        } else {
            steps++;
            setSteps(stepsSpan, steps);

            new Promise((resolve, reject) => {
                resolve(
                    setTimeout(() => {
                        closeSquare(element);
                        closeSquare(firstClick.element);
        
                        firstClick.clear();
                    }, 1000)
                );
            })
            .then(() => {
                timeOutClick = true;
                setTimeout(() => {
                    timeOutClick = false;
                }, 1100);
            });     
        }
    }

    function setSteps(stepsSpan, stepsAmount) {
        stepsSpan.textContent = stepsAmount;
    }

    function openSquare(element, color) {
        element.classList.add('openColor');
        setTimeout(() => {
            element.classList.remove('closed');
            element.style.backgroundColor = color;
            element.classList.remove('openColor');
        }, 200);
    }

    function closeSquare(element) {
        element.classList.add('closed');
        element.removeAttribute('style');   
    }

    function winSquare(element) {
        element.classList.add('opened');
        element.removeAttribute('style');
    }

    // restart btn //
    const restartBtn = document.querySelectorAll('.restart-btn');

    restartBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            location.reload();
            congratulations('hide');
        });
    })

    // congratulations //
    function congratulations(state) {        
        if(state === 'show') {
            document.querySelector('.congratulations-wrapper')
            .classList.remove('hide');
            showStat();
        }

        if(state === 'hide') {
            document.querySelector('.congratulations-wrapper')
            .classList.add('hide');
        }
    }

    function showStat() {
        const congratMinutes  = document.querySelector('.congratulations__score-time-minutes'),
              congratSeconds = document.querySelector('.congratulations__score-time-seconds'),
              bestMinutes = document.querySelector('.congratulations__score-best-minutes'),
              bestSeconds = document.querySelector('.congratulations__score-best-seconds'),
              stepsSpan = document.querySelector('.congratulations__score-steps'),
              actualBestSeconds = localStorage.getItem('bestSeconds'),
              actualBestMinutes = localStorage.getItem('bestMinutes');

        setTime(congratSeconds, congratMinutes, seconds, minutes);
        setSteps(stepsSpan, steps);

        if(actualBestSeconds != null) {
            const oldTime = actualBestMinutes * 60 + actualBestSeconds,
                  newTime = minutes * 60 + seconds;
            if(newTime < oldTime) {
                setTime(bestSeconds, bestMinutes, seconds, minutes);
                localStorage.setItem('bestSeconds', seconds);
                localStorage.setItem('bestMinutes', minutes);
            } else {
                setTime(bestSeconds, bestMinutes, actualBestSeconds, actualBestMinutes);
            }
        } else {
            setTime(bestSeconds, bestMinutes, seconds, minutes);
            localStorage.setItem('bestSeconds', seconds);
            localStorage.setItem('bestMinutes', minutes);
        }
    }

    function setTime(secondsSpan, minutesSpan, secondsSet, minutesSet) {
        if(secondsSet < 10) {
            secondsSpan.textContent = `0${secondsSet}`;
        } else {
            secondsSpan.textContent = secondsSet;
        }

        if(minutesSet < 10) {
            minutesSpan.textContent = `0${minutesSet} `;
        } else {
            minutesSpan.textContent = minutesSet;
        }
    }


    // timer //
    function startTimer() {
        timer = setInterval(timeTic, 1000);
    }

    const minutesSpan  = document.querySelector('.game__panel-time-minutes'),
          secondsSpan = document.querySelector('.game__panel-time-seconds');

    function timeTic() {
        seconds++;

        if(seconds === 60) {
            minutes++;
            seconds = 0;
        }

        setTime(secondsSpan, minutesSpan, seconds, minutes);
    }

});