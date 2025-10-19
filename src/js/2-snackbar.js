import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
};

const toastMessage = delay => {
  return {
    fulffilled: {
      message: `✅ Fulfilled promise in ${delay}ms`,
      backgroundColor: 'green',
      messageColor: 'white',
      position: 'topRight',
    },
    rejected: {
      message: `❌ Rejected promise in ${delay}ms`,
      backgroundColor: 'red',
      messageColor: 'white',
      position: 'topRight',
    },
    notValidated: {
      message: `⚠️ Please enter a valid positive number for delay`,
      backgroundColor: 'orange',
      messageColor: 'white',
      position: 'topRight',
    },
  };
};

function createPromise(isFulfilled = 'fulfilled', delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isFulfilled === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

refs.form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(refs.form);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  if (delay <= 0 || isNaN(delay)) {
    iziToast.show(toastMessage().notValidated);
    return;
  }

  createPromise(state, delay)
    .then(delay => {
      iziToast.show(toastMessage(delay).fulffilled);
    })
    .catch(delay => {
      iziToast.show(toastMessage(delay).rejected);
    });

  refs.form.reset();
});
