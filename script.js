// Обьявляем переменные
const container = document.querySelector('.container');
const commentContainer = container.querySelector('.comment-container');
const addButton = container.querySelector('.button_action_add');
const textarea = document.querySelector('.textarea');
const userName = document.querySelector('.input__name');
const form = document.querySelector('form');
const dataInput = document.querySelector('.data');



// Валидация формы
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add('button_disabled');
    buttonElement.setAttribute('disabled', true);
  } else {
    buttonElement.classList.remove('button_disabled');
    buttonElement.removeAttribute('disabled');
  }
}

const checkInputValidity = (formElement, inputElement) => {
  if (inputElement.validity.patternMismatch) {

    inputElement.setCustomValidity("Разрешены только буквы.");
  } else {

    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add('input_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('text-input-error');
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove('input_error');
  errorElement.textContent = '';
  errorElement.classList.remove('text-input-error');
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.input'));
  const buttonElement = formElement.querySelector('.button');

  toggleButtonState(inputList, buttonElement);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

setEventListeners(form);


// Генерируем комментарий
function addComment(userNameValue, textareaValue, dataInputValue) {
  const commentTemplate = document.querySelector('#comment-template').content;
  const commentElement = commentTemplate.querySelector('.comment').cloneNode(true);


  commentElement.querySelector('.comment__name').textContent = userNameValue;
  commentElement.querySelector('.comment__time').textContent = showMessageDateTime(dataInputValue);
  commentElement.querySelector('.comment__text').textContent = textareaValue;

  // Удаление карточки
  commentElement.querySelector('.comment__delete').addEventListener('click', (evt) => {
    evt.target.closest('.comment').remove();
  });

  // Ставим/Убираем лайк.
  commentElement.querySelector('.comment__like').addEventListener('click', function (evt) {
    evt.target.classList.toggle('comment__like_active');
  });
  commentContainer.append(commentElement);
}

// Добавляем комментарий, и настраиваем поведение формы
function handleCardsFormSubmit(evt) {
  evt.preventDefault();
  addComment(userName.value, textarea.value, dataInput.value);

  form.reset()

  addButton.classList.add('button_disabled');
  addButton.setAttribute('disabled', true);

  textarea.style.height = '60px'
}

form.addEventListener('submit', handleCardsFormSubmit)


// Автоматическое подстраивание размеров textarea под его содержимое
textarea.addEventListener('keyup', e => {
  textarea.style.height = '60px'
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`
});


// Обнуляюем часы, минуты и секунды даты.
function dropHMS(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0, 0);
}


// Форматируем дату из инпута и возвращаем нужное нам значение.
function showMessageDateTime(dateTime) {

  const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
  ];

  let time = new Date();
  let today = new Date();
  let yesterday = new Date();
  let roomLastMessageDate = new Date(dateTime);
  let minutes = String(time.getMinutes()).padStart(2, '0');

  yesterday.setDate(today.getDate() - 1);

  dropHMS(today);
  dropHMS(yesterday);
  dropHMS(roomLastMessageDate);

  if (today.getTime() === roomLastMessageDate.getTime() || dateTime === '') {
    return 'Сегодня,' + ' ' + time.getHours() + ':' + minutes
  } else if (yesterday.getTime() === roomLastMessageDate.getTime()) {
    return 'Вчера,' + ' ' + time.getHours() + ':' + minutes
  } else {
    return roomLastMessageDate.getDate() + ' ' + monthNames[roomLastMessageDate.getMonth()] + ' ' + roomLastMessageDate.getFullYear() + 'г.'
  }

}

// Создаем комментарий по кнопке enter
function SaveCardKey(evt) {
  if (evt.key === 'Enter') {
    handleCardsFormSubmit(evt);
  }
};


