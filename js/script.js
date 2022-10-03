document.addEventListener('click', () => {

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

    function range(rangeInput_, rangeTrack_, rangeNum_, resultField, periodOrSum, reverse = false) {
        const rangeInput = document.querySelector(rangeInput_),
              rangeTrack = document.querySelector(rangeTrack_),
              rangeNum = document.querySelector(rangeNum_),
              result = document.querySelector(resultField);

        
        let min = +rangeInput.getAttribute('min'),
            max = +rangeInput.getAttribute('max'),
            step = +rangeInput.getAttribute('step'),
            val_ = +rangeInput.value;

        rangeInput.addEventListener('input', function() {
            const periodOrSum_ = document.querySelector(periodOrSum).value
            let val = +rangeInput.value,
                position = 100 / (max - step) * (val - step);

            rangeTrack.style.width = `${position}%`;
            rangeNum.value = prettify(val);
            reverse ? result.textContent = getPayment(periodOrSum_, val, 4) + ' ₽' : result.textContent = getPayment(val, periodOrSum_, 4) + ' ₽'
        });

        rangeNum.addEventListener('input', function () {
            const periodOrSum_ = document.querySelector(periodOrSum).value
            this.value = prettify(this.value.replace(/\D/g, ''))
            if (this.value.replace(/\D/g, '') > max) {
                this.value = prettify(max)
            }
            if(this.value.replace(/\D/g, '') < min) {
                return
            }
            if (this.value.replace(/\D/g, '') >= min && this.value.replace(/\D/g, '') <= max)  {
                rangeTrack.style.width = `${100 / (max - step) * (this.value.replace(/\D/g, '') - step)}%`;
                val_ = this.value.replace(/\D/g, '') 
            }
            reverse ? result.textContent = getPayment(periodOrSum_, this.value.replace(/\D/g, ''), 4)  + ' ₽' : result.textContent = getPayment(this.value.replace(/\D/g, '') + ' ₽', periodOrSum_, 4)
        })
    }

    range(".calc__range__input--1", ".calc__range__track--1", ".calc__field--1", '.calc__footer__title--res', ".calc__range__input--2")
    range(".calc__range__input--2", ".calc__range__track--2", ".calc__field--2", '.calc__footer__title--res', ".calc__range__input--1", true)

})