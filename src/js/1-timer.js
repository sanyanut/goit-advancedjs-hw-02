import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      refs.startButton.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        backgroundColor: 'red',
        messageColor: 'white',
        position: 'topRight',
      });
    } else {
      refs.startButton.disabled = false;
      userSelectedDate = selectedDates[0];
    }
  },
};

flatpickr(refs.input, options);

refs.startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;

  refs.startButton.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const currTime = new Date();
    const timeDifference = userSelectedDate - currTime;

    if (timeDifference <= 0) {
      clearInterval(timerId);
      updateTimeDisplay(0, 0, 0, 0);
      refs.input.disabled = true;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    updateTimeDisplay(days, hours, minutes, seconds);
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimeDisplay(days, hours, minutes, seconds) {
  refs.dataDays.textContent = addLeadingZero(days);
  refs.dataHours.textContent = addLeadingZero(hours);
  refs.dataMinutes.textContent = addLeadingZero(minutes);
  refs.dataSeconds.textContent = addLeadingZero(seconds);
}
