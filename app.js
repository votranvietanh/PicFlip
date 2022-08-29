const cards = document.querySelector('.cards')
const flipTime = 0.25
const totalPhotos = 8

// random card
function randomNumbers(totalPhotos) {
    const random = []
    while (random.length < totalPhotos * 2) {
        let randomNumber = Math.floor(Math.random() * totalPhotos + 1)
        // tạo ra 2 số giống nhau
        if (random.filter(number => number === randomNumber).length < 2) {
            random.push(randomNumber)
        }
    }
    return random
}



// render card
function renderCard() {
    cards.innerHTML = ''
    randomNumbers(totalPhotos).forEach(number => {
        cards.insertAdjacentHTML('beforeend', `
            <li style="transition: ${flipTime}s ease-in-out;" class="card rotate0">
                <div id="toggle" onclick="clickFontView(this)" class="view front-view">
                    <i class="icofont-question"></i>
                </div>
                <div class="view back-view">
                    <img src="./img/${number}.jpg" alt="">
                </div>
            </li>
        `)
    })
}

renderCard()

let firstCard = 1
let secondCard = 2
let flips = 0
let timeMax = 30
let time = timeMax
let click = 0
let correct = 0

const spanTime = document.querySelector('.details .time span')
const spanFlips = document.querySelector('.details .flips span')
const achievementTime = document.querySelector('.achievement .time span')
const achievementFlips = document.querySelector('.achievement .flips span')
const achievementDate = document.querySelector('.achievement .date')
spanTime.innerHTML = time + 's'
spanFlips.innerHTML = flips
let countdown = ''

const getAchievement = JSON.parse(localStorage.getItem('achievement'))
if (getAchievement != null) {
    document.querySelector('.achievement').classList.add('show')
    achievementDate.innerHTML = getAchievement.date
    achievementTime.innerHTML = getAchievement.time + 's'
    achievementFlips.innerHTML = getAchievement.flips
}
// bắt đầu điều khiển khi click vào mỗi hình ()
function clickFontView(_this) {
    const card = _this.parentElement

    // card đầu tiên
    if (firstCard === 1) {
        _this.style.pointerEvents = 'none'

        firstCard = card

        firstCard.classList.replace('rotate0', 'rotate180')

        flips++
        spanFlips.innerHTML = flips

    }

    // card thứ 2
    else if (secondCard === 2) {
        _this.style.pointerEvents = 'none'

        secondCard = card
        secondCard.classList.replace('rotate0', 'rotate180')
        flips++
        spanFlips.innerHTML = flips

        // second Card mở ra rồi làm gì thì làm
        setTimeout(() => {
            const firstSrc = firstCard.querySelector('.back-view img').src
            const secondSrc = secondCard.querySelector('.back-view img').src

            // nếu chọn đúng
            if (firstSrc === secondSrc) {
                correct++
                if (correct == totalPhotos) {
                    document.querySelector('.under-img').style.filter = `none`
                    clearInterval(countdown)
                    // lưu thành tích
                    const achievement = JSON.parse(localStorage.getItem('achievement'))

                    if (achievement === null) {
                        localStorage.setItem('achievement', JSON.stringify(
                            { date: new Date().toDateString(), time: time.toFixed(1), flips }
                        ))

                    } else {
                        if (time.toFixed(1) > achievement.time) {
                            localStorage.setItem('achievement', JSON.stringify(
                                { date: new Date().toDateString(), time: time.toFixed(1), flips }
                            ))
                        } else if (time.toFixed(1) == achievement.time) {
                            if (flips < achievement.flips) {
                                localStorage.setItem('achievement', JSON.stringify(
                                    { date: new Date().toDateString(), time: time.toFixed(1), flips }
                                ))
                            }
                        }
                    }

                    const getAchievement = JSON.parse(localStorage.getItem('achievement'))
                    achievementDate.innerHTML = getAchievement.date
                    achievementTime.innerHTML = getAchievement.time + 's'
                    achievementFlips.innerHTML = getAchievement.flips
                    document.querySelector('.achievement').classList.add('show')


                }
                firstCard.classList.add('shake')
                secondCard.classList.add('shake')
                firstCard.classList.add('hidden')
                secondCard.classList.add('hidden')
                firstCard = 1
                secondCard = 2
            }
            // nếu chọn sai
            else {
                firstCard.classList.add('shake')
                secondCard.classList.add('shake')

                // khi hiệu ứng rung kết thúc
                secondCard.onanimationend = function () {

                    firstCard.classList.replace('rotate180', 'rotate0')
                    secondCard.classList.replace('rotate180', 'rotate0')

                    firstCard.classList.remove('shake')
                    secondCard.classList.remove('shake')

                    firstCard.querySelector('.front-view').style.pointerEvents = 'all'
                    secondCard.querySelector('.front-view').style.pointerEvents = 'all'

                    if (time <= 0) {
                        secondCard.classList?.replace('rotate0', 'time-out')
                        secondCard.classList?.replace('rotate180', 'time-out')
                    }

                    secondCard.onanimationend = function () { }

                    firstCard = 1
                    secondCard = 2
                }
            }
        }, flipTime * 1000)
    }

    // đếm giờ
    if (flips === 1) {
        countdown = setInterval(() => {
            time -= 0.1
            spanTime.innerHTML = time.toFixed(1) + 's'

            // hết giờ
            if (time <= 0) {
                clearInterval(countdown)
                spanTime.innerHTML = 0 + '.0s'

                cards.querySelectorAll('.card.rotate0').forEach(card => {
                    card.classList.replace('rotate0', 'time-out')
                })
                firstCard.classList?.replace('rotate180', 'time-out')
                firstCard.classList?.replace('rotate0', 'time-out')
            }

        }, 100)
    }

    return
}

document.querySelector('.refresh').onclick = function () {
    renderCard()
    firstCard = 1
    secondCard = 2
    flips = 0
    time = timeMax
    click = 0
    correct = 0
    spanTime.innerHTML = time + 's'
    spanFlips.innerHTML = flips
    clearInterval(countdown)
    countdown = ''
}
///dark-mode
var checkbox = document.querySelector("input[name=checkbox]");

checkbox.addEventListener('change', function() {
  if (this.checked) {
    document.getElementsByTagName('body')[0].style = `background-color:#504747`
    document.querySelector('.details').classList.add('dark-mode-details')
    document.querySelector('.achievement').classList.add('dark-mode-details')

    const view = document.querySelectorAll("#toggle");
    for (let i=0;i<view.length;++i)
    {
        if (view[i].classList.contains('dark-mode-icon') ) {
            view[i].classList.remove('dark-mode-icon');
            console.log(1)
          } else {
            view[i].classList.add('dark-mode-icon');
            console.log(12)

          }
    }
  } else {
    document.getElementsByTagName('body')[0].style = `background-color:#FFF`

    document.querySelector('.details').classList.remove('dark-mode-details')
    document.querySelector('.achievement').classList.remove('dark-mode-details')

    const view = document.querySelectorAll("#toggle");
    for (let i=0;i<view.length;++i){
    if (view[i].classList.contains('dark-mode-icon') ) {
        view[i].classList.remove('dark-mode-icon');
        console.log(1)
    }
}
  }
});









