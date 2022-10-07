document.addEventListener('DOMContentLoaded', () => {

    // анимация плавного появление
    function fadeIn (elem) {
        let startAnimation = null;
        const step = timestamp => {
            if (!startAnimation) startAnimation = timestamp;
            let progress = timestamp - startAnimation;
            elem.style.opacity = progress/500;
            if (progress < 500) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    // удаление класса у элементов массива
    function clearActiveClass(arr, activeClass) {
        arr.forEach(item => {
          item.classList.remove(activeClass);
        });
    }

    // burger
    const burger = document.querySelector('.header__burger')
    const menu = document.querySelector('.menu')
    const menuClose = document.querySelectorAll('[data-menuClose]')

    burger.addEventListener('click', () => {
        menu.classList.add('menu--active')
        document.body.style.overflow = 'hidden';
    })
    menuClose.forEach(item => {
        item.addEventListener('click', () => {
            menu.classList.remove('menu--active')
            document.body.style.overflow = '';
        })
    })
    menu.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu')) {
            menu.classList.remove('menu--active')
            document.body.style.overflow = '';
        }
    })

    // range, calc

    // маска
    function prettify(num) {
        var n = num.toString();
        return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    // вычисление платежа
    function getPayment(sum, period, rate) {
        // *
        // * sum - сумма кредита
        // * period - срок в годах
        // * rate - годовая ставка в процентах
        // * 
        let i,
            koef,
            payment;

        // ставка в месяц
        i = (rate / 12) / 100;

        // коэффициент аннуитета
        koef = (i * (Math.pow(1 + i, period * 12))) / (Math.pow(1 + i, period * 12) - 1);

        // итог
        payment = (sum * koef).toFixed();
        return prettify(payment);
    };

    function correctWordYear(val) {
        switch (val) {
            case 1:
                return 'год'
            case 2:
                return 'года'
            case 3:
                return 'года'
            case 4:
                return 'года'
            default:
                return 'лет'
        }
    }

    function range(rangeInputSum_, rangeTrackSum_, rangeInputTerm_, rangeTrackTerm_, inputSum_, inputTerm_, resultField, textYear_) {
        const rangeInputSum = document.querySelector(rangeInputSum_),
              rangeTrackSum = document.querySelector(rangeTrackSum_),
              rangeInputTerm = document.querySelector(rangeInputTerm_),
              rangeTrackTerm = document.querySelector(rangeTrackTerm_),
              inputSum = document.querySelector(inputSum_),
              inputTerm = document.querySelector(inputTerm_),
              result = document.querySelector(resultField),
              textYear = document.querySelector(textYear_);

        
        let minSum = +rangeInputSum.getAttribute('min'),
            maxSum = +rangeInputSum.getAttribute('max'),
            stepSum = +rangeInputSum.getAttribute('step'),
            minTerm = +rangeInputTerm.getAttribute('min'),
            maxTerm = +rangeInputTerm.getAttribute('max'),
            stepTerm = +rangeInputTerm.getAttribute('step');

        rangeInputSum.addEventListener('input', function() {
            let position = 100 / (maxSum - stepSum) * (this.value - stepSum);

            rangeTrackSum.style.width = `${position}%`;
            inputSum.value = prettify(this.value);

            if (inputTerm.value < minTerm) {
                result.textContent = '-'
                return
            }

            result.textContent = getPayment(this.value, rangeInputTerm.value, 4) + ' ₽'
        });

        rangeInputTerm.addEventListener('input', function() {
            let position = 100 / (maxTerm - stepTerm) * (this.value - stepTerm);

            rangeTrackTerm.style.width = `${position}%`;
            inputTerm.value = this.value;
            textYear.textContent = correctWordYear(+this.value)

            if (inputSum.value.replace(/\D/g, '') < minSum) {
                result.textContent = '-'
                return
            }

            result.textContent = getPayment(rangeInputSum.value, this.value, 4) + ' ₽'
        });

        inputSum.addEventListener('input', function () {
            this.value = prettify(this.value.replace(/\D/g, ''))
            if (this.value.replace(/\D/g, '') > maxSum) {
                this.value = prettify(maxSum)
            }
            if(this.value.replace(/\D/g, '') < minSum) {
                rangeInputSum.value = 0
                result.textContent = '-'
                rangeTrackSum.style.width = 0 + '%'
                return
            }
            if (this.value.replace(/\D/g, '') >= minSum && this.value.replace(/\D/g, '') <= maxSum)  {
                rangeTrackSum.style.width = `${100 / (maxSum - stepSum) * (this.value.replace(/\D/g, '') - stepSum)}%`;
                rangeInputSum.value = this.value.replace(/\D/g, '')
            }
            if (inputTerm.value < minTerm) {
                result.textContent = '-'
                return
            }
            result.textContent = getPayment(rangeInputSum.value, rangeInputTerm.value, 4)  + ' ₽'
        })

        inputTerm.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '')
            if (this.value > maxTerm) {
                this.value = maxTerm
            }
            if(this.value < minTerm) {
                rangeInputTerm.value = 0
                result.textContent = '-'
                rangeTrackTerm.style.width = 0 + '%'
                return
            }
            if (this.value >= minTerm && this.value <= maxTerm)  {
                rangeTrackTerm.style.width = `${100 / (maxTerm - stepTerm) * (this.value - stepTerm)}%`;
                rangeInputTerm.value = this.value
                rangeInputTerm.value = this.value
                textYear.textContent = correctWordYear(+this.value)
            }
            if (inputSum.value.replace(/\D/g, '') < minSum) {
                result.textContent = '-'
                return
            }
            result.textContent = getPayment(rangeInputSum.value, rangeInputTerm.value, 4)  + ' ₽'
        })
    }

    range(".calc__range__input--1", ".calc__range__track--1", ".calc__range__input--2", ".calc__range__track--2", ".calc__field--1", ".calc__field--2", '.calc__footer__title--res', ".calc__field__text--year")

    // tabs (profit)
    const profitData = [
        {
            img: 'img/profit/img1.webp',
            imgM: 'img/profit/img1M.webp',
            ul: [
                'На новый автомобиль',
                'На б\у автомобиль',
                'Автомобиль в лизинг'
            ]
        },
        {
            img: 'img/profit/img2.webp',
            imgM: 'img/profit/img2M.webp',
            ul: [
                'На новую квартиру',
                'На вторичный рынок'
            ]
        },
        {
            img: 'img/profit/img3.webp',
            imgM: 'img/profit/img3M.webp',
            ul: [
                'С просроченными кредитами',
                'С ипотеками',
                'С залогами',
                'С автокредитами'
            ]
        },
        {
            img: 'img/profit/img4.webp',
            imgM: 'img/profit/img4M.webp',
            ul: [
                'На открытие бизнеса',
                'На развитие бизнеса'
            ]
        },
        {
            img: 'img/profit/img5.webp',
            imgM: 'img/profit/img5M.webp',
            ul: [
                'На любые цели наличными'
            ]
        },
        {
            img: 'img/profit/img6.webp',
            imgM: 'img/profit/img6M.webp',
            ul: [
                'На строительство дома',
                'На строительство дачи',
                'На строительство коттеджа',
            ]
        }
    ]

    const profitButtons = document.querySelectorAll('.profit__box__item'),
          profitUl = document.querySelector('.profit__ul'),
          profitImg = document.querySelector('.profit__img'),
          profitRow = document.querySelector('.profit__row');

    
    profitButtons.forEach((button, buttonIndex) => {
        button.addEventListener('click', () => {
            clearActiveClass(profitButtons, 'profit__box__item--active')
            button.classList.add('profit__box__item--active')

            // плавное появление
            fadeIn(profitRow)

            // меняем картинки
            profitImg.lastElementChild.setAttribute('src', profitData[buttonIndex].img)
            profitImg.firstElementChild.setAttribute('srcset', profitData[buttonIndex].imgM)

            // рендер <li>
            profitUl.textContent = ''
            profitData[buttonIndex].ul.forEach(str => {
                const li = `<li class="profit__li">${str}</li>`
                profitUl.innerHTML += li
            })
        })
    })

    //faq
    const tabs = document.querySelectorAll('.faq__item')
    const tabsTriggers = document.querySelectorAll('.faq__item__header')
    const tabsContents = document.querySelectorAll('.faq__item__text')

    tabsTriggers.forEach((trigger, triggerIndex) => {
        trigger.addEventListener('click', () => {
            tabs[triggerIndex].classList.toggle('faq__item--active')
            if (tabs[triggerIndex].classList.contains('faq__item--active')) {
                tabsContents[triggerIndex].style.height= tabsContents[triggerIndex].scrollHeight + 'px'
            } else {
                tabsContents[triggerIndex].style = ''
            }
        })
    })

    //video
    function video(triggers, _video, _modalVideo, _modalVideoClose) {
        const play = document.querySelectorAll(triggers),
            video = document.querySelector(_video),
            modalVideo = document.querySelector(_modalVideo),
            modalVideoClose = document.querySelector(_modalVideoClose);

        play.forEach(item => {
            item.addEventListener('click', (e) => {
                const path = e.currentTarget.getAttribute('data-video');
                modalVideo.classList.add('modal--active');
                document.body.style.overflow = 'hidden';
                video.setAttribute('src', path);
                video.play();
            });
        });

        modalVideo.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__container')) {
                modalVideo.classList.remove('modal--active');
                video.pause();
                document.body.style.overflow = '';
            }
        });
        modalVideoClose.addEventListener('click', () => {
            modalVideo.classList.remove('modal--active');
            video.pause();
            document.body.style.overflow = '';
        })
    }

    video('.reviews__play', '#video', '.modal-video', '.modal-video__close');

    // text hide
    const button = document.querySelector('.terms__link'),
          text = document.querySelector('.terms__hide');

    let textHide = false;

    button.addEventListener('click', () => {
        if(!textHide) {
            text.style.height = text.scrollHeight + 'px'
            button.innerHTML = 'Скрыть'
            textHide = true;
        } else {
            text.style = ''
            button.innerHTML = 'Читать далее <span>&#8250;</span>'
            textHide = false;
        }
    })


    // функция для модалки

    function calcScroll() {
        let div = document.createElement('div');
        
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';
        
        document.body.appendChild(div);
        let scarollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        
        return scarollWidth;
    }

    let scrollWidth = calcScroll();

    function modal(modal, modalActiveClass, triggers, modalClose) {
        const triggers_ = document.querySelectorAll(triggers),
                modal_ = document.querySelector(modal),
                modalClose_ = document.querySelector(modalClose);

        if (triggers_.length > 0) {
            triggers_.forEach(item => {
                item.addEventListener('click', () => {
                    modal_.classList.add(modalActiveClass);
                    document.body.style.overflow = 'hidden';
                    document.body.style.marginRight = `${scrollWidth}px`;
                });
            });

            modalClose_.addEventListener('click', () => {
                modal_.classList.remove(modalActiveClass);
                document.body.style.overflow = '';
                document.body.style.marginRight = '0px';
            });

            modal_.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__container')) {
                    modal_.classList.remove(modalActiveClass);
                    document.body.style.overflow = '';
                    document.body.style.marginRight = '0px';
                }
            });
        }
    }

    modal('.modal-main', 'modal--active', '[data-modal]', '.modal-main__close');
    

})