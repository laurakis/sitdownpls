(() => {
  document.addEventListener('DOMContentLoaded', (e) => {

    recordsProcess();
    dottedProcess();

    dottedProcess('.dotted-str p');

    // инициализация бургер-меню
    burgerMenuProcess();
    // инициализация селектов с регионами
    branchesProcess();
    // инициализация селектов с категориями
    categoriesProcess();
    // инициализация свайпера с баннерами
    bannerProcess();
    // инициализация свайпера со спецпредложениями
    offersProcess();
    // инициализация свайпера с полезным
    goodProcess();
    // инициализация блока с заявками
    requestsProcess();
    // инициализация каталога
    catalogProcess();
    // инициализация страницы с продуктом
    productProcess();
    // инициализация модальных окон
    modalsProcess();

  });
})()

function bannerProcess() {
  const banner = new Swiper('.banner', {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    pagination: {
      el: '.banner__pagination',
      type: 'bullets',
      clickable: true,
      bulletClass: 'banner__pagination-bullet',
      bulletActiveClass: 'banner__pagination-bullet--active'
    },
  });
}

function branchesProcess() {
    // регионы
    const branches = document.querySelectorAll('.branches__list');
    branches.forEach(branch => {
      const choices = new Choices(branch, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: true,
        // position: 'down',
        choices: [
          { value: 'Москва', label: 'Москва', selected: true, disabled: false },
          { value: 'Казань', label: 'Казань' },
          { value: 'Уфа', label: 'Уфа' },
          { value: 'Пермь', label: 'Пермь' },
        ],
      });
    });
}

function burgerMenuProcess() {
  const burger = document.getElementById('burger');
  const burgerClose = document.getElementById('burger-close');

  burgerClose.addEventListener('click', (e) => {
    e.preventDefault();
    burgerMenuClose(e);
  })

  burger.addEventListener('click', (e) => {
    e.preventDefault();

    const burgerMenu = document.getElementById('burger-menu');
    burgerMenu.classList.add('absolute-visible');
    burgerMenu.classList.remove('transparent');

    e._burgerMenuOpened = true;
  });
}

function burgerMenuClose(e) {
  e._burgerMenuOpened = false;

  const burgerMenu = document.getElementById('burger-menu');
  burgerMenu.classList.add('transparent');
  setTimeout(() => {
    burgerMenu.classList.remove('absolute-visible');
  }, 200);
}

function catalogProcess() {

  // ------------------------------------------------------------------------------------
  const swiperCatalog = new Swiper('.catalog', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 3,
    slidesPerView: 3,
    autoHeight: false,
    grid: {
      rows: 3,
    },
    breakpoints: {
      320: {
        spaceBetween: 16,
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: {
          rows: 3,
        },
      },
      576: {
        spaceBetween: 32,
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: {
          rows: 3,
        },
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 3,
        },
      },
    },
    navigation: {
      nextEl: ".good__btn-next",
      prevEl: ".good__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
    pagination: {
      el: ".catalog__pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
  });

  // ------------------------------------------------------------------------------------
  // ценовой слайдер
  const sliderPrice = document.getElementById('filter-slider-price');
  if (sliderPrice) {
    noUiSlider.create(sliderPrice, {
      range: {
        'min': 0,
        '5%': 2000,
        '66%': 150000,
        'max': 200000
      },
      start: [2000, 150000], // стартовое и конечное значение ползунков
      connect: true, // окраска диапазона
      step: 1, // шаг переключения
      behaviour: 'tap-drag',
      tooptips: false, // отключить подсказки над ползунками
    });

    // элементы ползунков
    var valuesDivs = [
      document.getElementById('filter-block-input-price-from'),
      document.getElementById('filter-block-input-price-till'),
    ];

    // автоматически изменять значения в инпутах при смене на слайдере
    sliderPrice.noUiSlider.on('update', function (values, handle) {
      valuesDivs[handle].value = parseInt(values[handle]);
    });

    valuesDivs.forEach(input => {
      // автоматически менять значения на слайдере при смене знчений в инпутах
      let timerFrom, timerTill;
      input.addEventListener('input', (e) => {
        const slider = document.getElementById('filter-slider-price');
        const value = parseInt(input.value);

        if (input.id === 'filter-block-input-price-from') {
          clearTimeout(timerFrom);
          timerFrom = setTimeout(() => { slider.noUiSlider.set([value, null]) }, 300);
        } else {
          clearTimeout(timerTill);
          timerTill = setTimeout(() => { slider.noUiSlider.set([null, value]) }, 300);
        }
      });
    });
  }

  // ------------------------------------------------------------------------------------
  // ! !!! селект с чеками
  let filterCategories = [];
  initSelectCheck();
  initSelectInput();

  // ! обслуживание селектов с чеками
  document.addEventListener('click', (e) => {
    const target = e.target;

    // ? проверка для закрытия меню: ----------------------------------------------------------------------------------
    // ?  1. был ли щелчок по кнопке с бургером либо в пределах бургер-меню (проверяем родителей таргетов)
    // ?  2. если щелчок производился не по элементам с такими родителями, то закрыаем меню (в случае если оно открыто)
    console.log(target.dataset.block);
    console.log(target.closest('.header__burger'));
    console.log(target.closest('.header__burger-menu'));
    if (!target.closest('.header__burger') && !target.closest('.header__burger-menu')) burgerMenuClose(e);
    // ? --------------------------------------------------------------------------------------------------------------

    // перебрать все селекты на странице и закрыть их, если щелчок произвелся не на них
    document.querySelectorAll('.select-check').forEach(select => {
      // console.log(select);
      try {
        // если класс элемента, вызвавшего событие, не включает айдишник селекта, то закрыть его
        if (!target.className?.includes(select.id)) {
          select.classList.remove('is-active');
        }
      } catch (e) {
        console.log('Ошибка обработки селекта ' + target + ': ' + e.name, e.message + ': в качестве event получен объект SVGSVGElement (щелчок по иконке на кнопке селекта)');
      }
    });

    // перебрать все селекты на странице и закрыть их, если щелчок произвелся не на них
    document.querySelectorAll('.select-input').forEach(select => {
      // console.log(select);
      try {
        // если класс элемента, вызвавшего событие, не включает айдишник селекта, то закрыть его
        if (!target.className?.includes(select.id)) {
          select.classList.remove('is-active');
        }
      } catch (e) {
        console.log('Ошибка обработки селекта ' + target + ': ' + e.name, e.message + ': в качестве event получен объект SVGSVGElement (щелчок по иконке на кнопке селекта)');
      }
    });
  });
}



// ! инициализация селекта с инпутом
function initSelectInput() {
  const selectsHeader = document.querySelectorAll('.select-input__header');
  const selectsInput = document.querySelectorAll('.select-input__input');

  // открытие/закрытие списка
  if (selectsHeader) {
    selectsHeader.forEach(header => {
      header.addEventListener('click', selectToggle);
    });
  }

  // выбор/снятие вариантов
  if (selectsInput) {
    selectsInput.forEach(item => {
      item.addEventListener('change', selectChange);
    });
  }

  function selectToggle() {
    this.closest('.select-input').classList.toggle('is-active');
  }

  function selectChange() {
    const select = this.closest('.select-input');
    const current = select.querySelector('.select-input__current');
    const inputs = select.querySelectorAll('.select-input__input');

    let from, till;
    inputs.forEach(input => {
      switch (input.dataset.priceType) {
        case 'from':
          from = input.value;
        case 'till':
          till = input.value;
      }
    });

    // если ОТ и ДО пустые, то выводить placeholder
    // если только ОТ пустое, то выводить "< ДО"
    // если только ДО пустое, то выводить "> ОТ"
    // иначе выводить "от ОТ до ДО" или "ОТ ... ДО"

    let values;
    if (!from && !till) {
      values = undefined;
    } else if (from && till) {
      values = `${from} - ${till}`;
    } else if (!from) {
      values = `до ${till}`;
    } else if (!till) {
      values = `от ${from}`;
    }

    if (values) {
      current.innerText = values;
      select.dataset.value = JSON.stringify({ min: parseInt(from), max: parseInt(till) });
      current.classList.add('is-selected');
    } else {
      current.textContent = select.dataset.placeholder;
      select.dataset.value = '';
      current.classList.remove('is-selected');
    }
  }
}

// ! инициализация селекта с чеками
function initSelectCheck() {
  const selectsHeader = document.querySelectorAll('.select-check__header');

  // обработка всех селектов
  if (selectsHeader) {
    selectsHeader.forEach(header => {
      // ? открытие/закрытие списка
      header.addEventListener('click', selectToggle);

      // ? выбор/снятие вариантов
      const selectsInput = header.closest('.select-check').querySelectorAll('.select-check__item .checkbox input');
      if (selectsInput) {
        selectsInput.forEach(item => {
          item.addEventListener('change', selectChange);
        })
      }
    });
  }

  function selectToggle() {
    this.closest('.select-check').classList.toggle('is-active');
  }

  function selectChange() {
    const select = this.closest('.select-check');
    const current = select.querySelector('.select-check__current');
    const checkboxes = select.querySelectorAll('.checkbox');

    let values = []; // массив выбранных вариантов (name + caption)

    checkboxes.forEach(checkbox => {
      const itemLabel = checkbox.querySelector('label');
      const itemName = itemLabel.dataset.name;
      const itemCaption = itemLabel.textContent;
      const itemValue = checkbox.querySelector('input').checked;

      if (itemValue) {
        values.push({ name: itemName, caption: itemCaption });
      }
    });

    // изменение значений и заполнение select.data-value
    if (values.length) {
      current.innerText = values.map(item => item.caption).join(', ');
      select.dataset.value = values.map(item => item.name).join(',');
      current.classList.add('is-selected');
    } else {
      current.textContent = select.dataset.placeholder;
      select.dataset.value = '';
      current.classList.remove('is-selected');
    }
  }
}

function categoriesProcess() {
    // категории
    const categories = document.querySelectorAll('.categories__list');
    categories.forEach(category => {
      const choices = new Choices(category, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: true,
        // position: 'down',
        choices: [
          { value: 'empty', label: 'Категория', selected: true, disabled: true },
          { value: 'Диваны', label: 'Диваны' },
          { value: 'Кресла', label: 'Кресла' },
          { value: 'Пуфы', label: 'Пуфы' },
          { value: 'Кровати', label: 'Кровати' },
          { value: 'Тумбы', label: 'Тумбы' },
          { value: 'Комоды', label: 'Комоды' },
          { value: 'Стулья', label: 'Стулья' },
          { value: 'Столы', label: 'Столы' },
          { value: 'Аксессуары', label: 'Аксессуары' },
        ],
      });
    });
}

const recordsProcess = function() {
  dottedProcess('.record__delimiter')
};

const dottedProcess = function(stringTag) {
  const tag = stringTag || '.dotted p';
  const dottedStrings = document.querySelectorAll(tag);
  dottedStrings.forEach(str => {
    str.setAttribute('data-content', '.'.repeat(200));
  });
};


function goodProcess() {
  const swiperOffers = new Swiper('.good', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 1,
    slidesPerView: 2,
    autoHeight: false,
    breakpoints: {
      320: { // when window width is >= 320px
        slidesPerView: 1
      },
      576: { // when window width is >= 768px
        slidesPerView: 2
      },
      1024: { // when window width is >= 1024px
        slidesPerView: 3,
      },
      1352: {
        slidesPerView: 2
      }
    },
    navigation: {
      nextEl: ".good__btn-next",
      prevEl: ".good__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
  });
}

function modalsProcess() {
  // ? очистить модальный диалог от лишних доп. стилей
  function resetModalDialogStyles() {
    document.getElementById('modal-dialog').classList.remove('modal-dialog--photo');
  }
  // ? закрытие модалки со сворачиванием всех видов модальных окон внутри
  function closeModal() {
    document.getElementById('modal').classList.remove('scale-1'); // ? скрыть модалку (медленно)
    setTimeout(() => {
      ['modal-buy', 'modal-buy-confirm', 'modal-photo'].forEach(modalKindName => { // ? закрыть каждый вид модального окна внутри модалки
        const modalKind = document.getElementById(modalKindName);
        if (!modalKind.classList.contains('none')) {
          document.getElementById(modalKindName).classList.add('none');
        }
      });
      resetModalDialogStyles();
      document.body.classList.remove('stop-scroll'); // ? включить пролистывание страницы

    }, 300);
  }

  // ! открытие модалки по клику на любой элемент с классом js-modal-open
  document.querySelectorAll('.js-modal-open').forEach(item => {
    const modalKind = document.getElementById(item.dataset.target); // ? в target записывается id вида модального окна для открытия, т.к. видов несколько
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('stop-scroll'); // ? убрать пролистывание страницы
      modalKind.classList.remove('none'); // ? отобразить вид модального окна внутри модалки (они все невидимы по умолчанию)
      document.getElementById('modal').classList.add('scale-1'); // ? показать модалку (медленно)

      changeModalDialogStyles(item.dataset.target); // ? изменить дефолтные настройки модального окна в зависимости от диалога

      // ? если модальное окно с фотками, установить нужную фотографию
      const photoIndex = item.dataset.modalPhotoIndex;
      modalPhotoMainSlider.activeIndex = photoIndex; // ! --------> почему не работает?!
    })
  });

  // изменить дефолтные настройки модального диалога, если требуется
  function changeModalDialogStyles(modalKindName) {
    const modalDialog = document.getElementById('modal-dialog');

    if (modalKindName === 'modal-photo') {
      modalDialog.classList.add('modal-dialog--photo');
    }
  }

  // ! закрытие модалки
  // 1. при клике вне диалога
  document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e._isClickWithinModalDialog) return;
    closeModal();
  })

  // 2. при клике на крестик
  document.getElementById('modal-close')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });

  // ! установка проверки на клик внутри диалога
  document.getElementById('modal-dialog')?.addEventListener('click', (e) => {
    e._isClickWithinModalDialog = true;
  })

  // ------------------------------------------------------------------------------
  // ! работа с модальной формой
  if (document.getElementById('modal-dialog-buy-form')) {
    // ! валидация
    const inputModalFormPhone = document.getElementById('modal-dialog-buy-phone');
    const validationModalBuy = new JustValidate('#modal-dialog-buy-form', {
      focusInvalidField: true,
      validateBeforeSubmitting: true,
      // errorsContainer: document.getElementById('client-error'),
      errorFieldCssClass: 'invalidated',
    })
      .addField('#modal-dialog-buy-fio', [
        {
          rule: 'required',
          errorMessage: 'Введите ФИО',
        }
      ])
      .addField('#modal-dialog-buy-phone', [
        {
          rule: 'required',
          errorMessage: `Введите номер`,
        },
        {
          validator: function (value, context) {
            const numValue = inputModalFormPhone.inputmask.unmaskedvalue();
            return Boolean(Number(numValue) && numValue.length === 10);
          },
          errorMessage: 'Некорректный номер',
        },
      ]);
    // .addField('#request-email', [
    //   {
    //     rule: 'required',
    //     errorMessage: 'Введите e-mail',
    //   },
    //   {
    //     rule: 'email',
    //     errorMessage: 'Неправильный формат',
    //   }
    // ]);

    validationModalBuy.revalidate(); // нужна ревалидация, чтобы при открытии формы и сразу же нажатии "Отправить" не происходила отправка пустых данных

    // ! submit модальной формы
    const form = document.getElementById('modal-dialog-buy-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.querySelector('.invalidated')) {
        document.getElementById('modal-buy').classList.add('none');
        document.getElementById('modal-buy-confirm').classList.remove('none');
      }
    })
  }

  // ------------------------------------------------------------------------------
  // ! работа с модальными слайдерами
  // список маленьких фото
  const modalPhotoListSlider = new Swiper(".modal-dialog__photo-list-swiper", {
    spaceBetween: 78,
    slidesPerView: 4,
    // freeMode: true, // -----> свободное перелистывание без скачков
    watchSlidesProgress: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 39,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 78,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 78,
      },
      1352: {
        slidesPerView: 4,
        spaceBetween: 78,
      }
    },
  });
  // главное большое фото
  const modalPhotoMainSlider = new Swiper(".modal-dialog__photo-main-swiper", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".modal-dialog__photo-button-next",
      prevEl: ".modal-dialog__photo-button-prev",
      disabledClass: 'btn-icon--disabled',
    },
    thumbs: {
      swiper: modalPhotoListSlider,
    },
  });
}

function offersProcess() {
  const swiperOffers = new Swiper('.offers', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 3,
    slidesPerView: 3,
    autoHeight: false,
    breakpoints: {
      320: { // when window width is >= 320px
        slidesPerView: 1,
        slidesPerGroup: 1
      },
      768: { // when window width is >= 768px
        slidesPerView: 2,
        slidesPerGroup: 1
      },
      1024: { // when window width is >= 1024px
        slidesPerView: 3,
        slidesPerGroup: 1
      },
      1352: {
        slidesPerGroup: 3
      }
    },
    navigation: {
      nextEl: ".offers__btn-next",
      prevEl: ".offers__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
  });
}

function productProcess() {

  // ! мини-фотки перелистываются без скролла, на тачскринах, либо при нажатии средней кнопки мыши
  // // основные фотографии
  // const photos = new Swiper(".product-photos-swiper", {
  //   spaceBetween: 1,
  //   slidesPerView: 1,
  //   freeMode: false,
  //   watchSlidesProgress: true,
  //   direction: 'horizontal',
  // });

  // // мини-копии фотографий
  // const photosList = new Swiper(".product-photos-list-swiper", {
  //   spaceBetween: 38,
  //   slidesPerView: 'auto-fil',
  //   freeMode: true,
  //   watchSlidesProgress: true,
  //   direction: 'horizontal',
  //   breakpoints: {
  //     320: {
  //       direction: 'horizontal',
  //     },
  //     576: {
  //       direction: 'vertical',
  //     },
  //     1024: {
  //       direction: 'horizontal',
  //     },
  //   }
  // });

  // замена изображения по щелчку мыши на списки мини-картинок
  const listImgs = document.querySelectorAll('.list-img');
  if (listImgs && listImgs.length) {
    listImgs.forEach(item => {
      item.addEventListener('click', (e) => {
        const bigImgURL = item.dataset.bimage;
        const bigImg = document.getElementById('big-img');
        bigImg.setAttribute('src', bigImgURL);

        // ? сохранить индекс изображения, который будет отображен в модальном окне при щелчке на большое фото
        const imgParent = bigImg.closest('.product-photo-main');
        imgParent.dataset.modalPhotoIndex = 4; // ! -----> сохраняю номер, но в modal.js изменение activeSlide в стр.33 не работает!
      })
    });
  }

  // ! открытие модального окна со слайдерами изображений ====> см. modal.js
  // const prodPhotos = document.getElementById('product-photos');
  // if (prodPhotos) {
  //   prodPhotos.addEventListener('click', (e) => {
  //     alert('здрав буде, боярин!');
  //   });
  // }

  // ! слайдер с похожими товарами
  const swiperSame = new Swiper('.same', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 1,
    slidesPerView: 4,
    autoHeight: false,
    breakpoints: {
      320: { // when window width is >= 320px
        slidesPerView: 2,
        spaceBetween: 16,
      },
      576: { // when window width is >= 768px
        slidesPerView: 2,
        spaceBetween: 32
      },
      1024: { // when window width is >= 1024px
        slidesPerView: 3,
      },
      1352: {
        slidesPerView: 4
      }
    },
    navigation: {
      nextEl: ".same__btn-next",
      prevEl: ".same__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
  });

}

function requestsProcess() {
  // хинт
  tippy('.request__hint', {
    content: 'Реплицированные с зарубежных источников, исследования формируют глобальную сеть.',
    allowHTML: true,
    interactive: true,
    theme: 'main',
    maxWidth: 157
  });

  const inputFio = document.querySelector('.input-fio');
  const inputsPhone = document.querySelectorAll('.input-phone');
  const inputEmail = document.querySelector('.input-email');

  for (let inputPhone of inputsPhone) {
    // маски ввода
    Inputmask({ mask: '+7 (999) 999-99-99' }).mask(inputPhone);

    // валидация
    if (document.getElementById('request-form')) {
      const validation = new JustValidate('#request-form', {
        focusInvalidField: true,
        validateBeforeSubmitting: true,
        // errorsContainer: document.getElementById('client-error'),
        errorFieldCssClass: 'invalidated',
      })
        .addField('#request-fio', [
          {
            rule: 'required',
            errorMessage: 'Введите ФИО',
          }
        ])
        .addField('#request-phone', [
          {
            rule: 'required',
            errorMessage: `Введите номер`,
          },
          {
            validator: function (value, context) {
              const numValue = inputPhone.inputmask.unmaskedvalue();
              return Boolean(Number(numValue) && numValue.length === 10);
            },
            errorMessage: 'Некорректный номер',
          },
        ])
        .addField('#request-email', [
          {
            rule: 'required',
            errorMessage: 'Введите e-mail',
          },
          {
            rule: 'email',
            errorMessage: 'Неправильный формат',
          }
        ]);

      // validation.revalidate();
    }
  }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJiYW5uZXJFbGVtZW50cy5qcyIsImJyYW5jaGVzRWxlbWVudHMuanMiLCJidXJnZXJNZW51LmpzIiwiY2F0YWxvZ0VsZW1lbnRzLmpzIiwiY2F0ZWdvcmllc0VsZW1lbnRzLmpzIiwiZG90dGVkRWxlbWVudHMuanMiLCJnb29kRWxlbWVudHMuanMiLCJtb2RhbC5qcyIsIm9mZmVyc0VsZW1lbnRzLmpzIiwicHJvZHVjdEVsZW1lbnRzLmpzIiwicmVxdWVzdHNFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKGUpID0+IHtcclxuXHJcbiAgICByZWNvcmRzUHJvY2VzcygpO1xyXG4gICAgZG90dGVkUHJvY2VzcygpO1xyXG5cclxuICAgIGRvdHRlZFByb2Nlc3MoJy5kb3R0ZWQtc3RyIHAnKTtcclxuXHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQsdGD0YDQs9C10YAt0LzQtdC90Y5cclxuICAgIGJ1cmdlck1lbnVQcm9jZXNzKCk7XHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC10LvQtdC60YLQvtCyINGBINGA0LXQs9C40L7QvdCw0LzQuFxyXG4gICAgYnJhbmNoZXNQcm9jZXNzKCk7XHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC10LvQtdC60YLQvtCyINGBINC60LDRgtC10LPQvtGA0LjRj9C80LhcclxuICAgIGNhdGVnb3JpZXNQcm9jZXNzKCk7XHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdCy0LDQudC/0LXRgNCwINGBINCx0LDQvdC90LXRgNCw0LzQuFxyXG4gICAgYmFubmVyUHJvY2VzcygpO1xyXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQstCw0LnQv9C10YDQsCDRgdC+INGB0L/QtdGG0L/RgNC10LTQu9C+0LbQtdC90LjRj9C80LhcclxuICAgIG9mZmVyc1Byb2Nlc3MoKTtcclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0LLQsNC50L/QtdGA0LAg0YEg0L/QvtC70LXQt9C90YvQvFxyXG4gICAgZ29vZFByb2Nlc3MoKTtcclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCx0LvQvtC60LAg0YEg0LfQsNGP0LLQutCw0LzQuFxyXG4gICAgcmVxdWVzdHNQcm9jZXNzKCk7XHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQutCw0YLQsNC70L7Qs9CwXHJcbiAgICBjYXRhbG9nUHJvY2VzcygpO1xyXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHRgtGA0LDQvdC40YbRiyDRgSDQv9GA0L7QtNGD0LrRgtC+0LxcclxuICAgIHByb2R1Y3RQcm9jZXNzKCk7XHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQvNC+0LTQsNC70YzQvdGL0YUg0L7QutC+0L1cclxuICAgIG1vZGFsc1Byb2Nlc3MoKTtcclxuXHJcbiAgfSk7XHJcbn0pKClcclxuIiwiZnVuY3Rpb24gYmFubmVyUHJvY2VzcygpIHtcclxuICBjb25zdCBiYW5uZXIgPSBuZXcgU3dpcGVyKCcuYmFubmVyJywge1xyXG4gICAgbG9vcDogdHJ1ZSxcclxuICAgIHNwYWNlQmV0d2VlbjogMCxcclxuICAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgIGVsOiAnLmJhbm5lcl9fcGFnaW5hdGlvbicsXHJcbiAgICAgIHR5cGU6ICdidWxsZXRzJyxcclxuICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgICBidWxsZXRDbGFzczogJ2Jhbm5lcl9fcGFnaW5hdGlvbi1idWxsZXQnLFxyXG4gICAgICBidWxsZXRBY3RpdmVDbGFzczogJ2Jhbm5lcl9fcGFnaW5hdGlvbi1idWxsZXQtLWFjdGl2ZSdcclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuIiwiZnVuY3Rpb24gYnJhbmNoZXNQcm9jZXNzKCkge1xyXG4gICAgLy8g0YDQtdCz0LjQvtC90YtcclxuICAgIGNvbnN0IGJyYW5jaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJyYW5jaGVzX19saXN0Jyk7XHJcbiAgICBicmFuY2hlcy5mb3JFYWNoKGJyYW5jaCA9PiB7XHJcbiAgICAgIGNvbnN0IGNob2ljZXMgPSBuZXcgQ2hvaWNlcyhicmFuY2gsIHtcclxuICAgICAgICBzZWFyY2hFbmFibGVkOiBmYWxzZSxcclxuICAgICAgICBzaG91bGRTb3J0OiBmYWxzZSxcclxuICAgICAgICBpdGVtU2VsZWN0VGV4dDogJycsXHJcbiAgICAgICAgYWxsb3dIVE1MOiB0cnVlLFxyXG4gICAgICAgIC8vIHBvc2l0aW9uOiAnZG93bicsXHJcbiAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Cc0L7RgdC60LLQsCcsIGxhYmVsOiAn0JzQvtGB0LrQstCwJywgc2VsZWN0ZWQ6IHRydWUsIGRpc2FibGVkOiBmYWxzZSB9LFxyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ca0LDQt9Cw0L3RjCcsIGxhYmVsOiAn0JrQsNC30LDQvdGMJyB9LFxyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Cj0YTQsCcsIGxhYmVsOiAn0KPRhNCwJyB9LFxyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Cf0LXRgNC80YwnLCBsYWJlbDogJ9Cf0LXRgNC80YwnIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG4iLCJmdW5jdGlvbiBidXJnZXJNZW51UHJvY2VzcygpIHtcclxuICBjb25zdCBidXJnZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVyZ2VyJyk7XHJcbiAgY29uc3QgYnVyZ2VyQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVyZ2VyLWNsb3NlJyk7XHJcblxyXG4gIGJ1cmdlckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGJ1cmdlck1lbnVDbG9zZShlKTtcclxuICB9KVxyXG5cclxuICBidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IGJ1cmdlck1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVyZ2VyLW1lbnUnKTtcclxuICAgIGJ1cmdlck1lbnUuY2xhc3NMaXN0LmFkZCgnYWJzb2x1dGUtdmlzaWJsZScpO1xyXG4gICAgYnVyZ2VyTWVudS5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc3BhcmVudCcpO1xyXG5cclxuICAgIGUuX2J1cmdlck1lbnVPcGVuZWQgPSB0cnVlO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidXJnZXJNZW51Q2xvc2UoZSkge1xyXG4gIGUuX2J1cmdlck1lbnVPcGVuZWQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgYnVyZ2VyTWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXJnZXItbWVudScpO1xyXG4gIGJ1cmdlck1lbnUuY2xhc3NMaXN0LmFkZCgndHJhbnNwYXJlbnQnKTtcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGJ1cmdlck1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWJzb2x1dGUtdmlzaWJsZScpO1xyXG4gIH0sIDIwMCk7XHJcbn1cclxuIiwiZnVuY3Rpb24gY2F0YWxvZ1Byb2Nlc3MoKSB7XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIGNvbnN0IHN3aXBlckNhdGFsb2cgPSBuZXcgU3dpcGVyKCcuY2F0YWxvZycsIHtcclxuICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgc3BhY2VCZXR3ZWVuOiAzMixcclxuICAgIHNsaWRlc1Blckdyb3VwOiAzLFxyXG4gICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgIGF1dG9IZWlnaHQ6IGZhbHNlLFxyXG4gICAgZ3JpZDoge1xyXG4gICAgICByb3dzOiAzLFxyXG4gICAgfSxcclxuICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgIDMyMDoge1xyXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMTYsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMixcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICByb3dzOiAzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIDU3Njoge1xyXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMzIsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMixcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICByb3dzOiAzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIDEwMjQ6IHtcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgIHNsaWRlc1Blckdyb3VwOiAzLFxyXG4gICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgIHJvd3M6IDMsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgIG5leHRFbDogXCIuZ29vZF9fYnRuLW5leHRcIixcclxuICAgICAgcHJldkVsOiBcIi5nb29kX19idG4tcHJldlwiLFxyXG4gICAgICBkaXNhYmxlZENsYXNzOiAnYnRuLWljb24tLWRpc2FibGVkJyxcclxuICAgIH0sXHJcbiAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgIGVsOiBcIi5jYXRhbG9nX19wYWdpbmF0aW9uXCIsXHJcbiAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgcmVuZGVyQnVsbGV0OiBmdW5jdGlvbiAoaW5kZXgsIGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgY2xhc3NOYW1lICsgJ1wiPicgKyAoaW5kZXggKyAxKSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgLy8g0YbQtdC90L7QstC+0Lkg0YHQu9Cw0LnQtNC10YBcclxuICBjb25zdCBzbGlkZXJQcmljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItc2xpZGVyLXByaWNlJyk7XHJcbiAgaWYgKHNsaWRlclByaWNlKSB7XHJcbiAgICBub1VpU2xpZGVyLmNyZWF0ZShzbGlkZXJQcmljZSwge1xyXG4gICAgICByYW5nZToge1xyXG4gICAgICAgICdtaW4nOiAwLFxyXG4gICAgICAgICc1JSc6IDIwMDAsXHJcbiAgICAgICAgJzY2JSc6IDE1MDAwMCxcclxuICAgICAgICAnbWF4JzogMjAwMDAwXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0YXJ0OiBbMjAwMCwgMTUwMDAwXSwgLy8g0YHRgtCw0YDRgtC+0LLQvtC1INC4INC60L7QvdC10YfQvdC+0LUg0LfQvdCw0YfQtdC90LjQtSDQv9C+0LvQt9GD0L3QutC+0LJcclxuICAgICAgY29ubmVjdDogdHJ1ZSwgLy8g0L7QutGA0LDRgdC60LAg0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgIHN0ZXA6IDEsIC8vINGI0LDQsyDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y9cclxuICAgICAgYmVoYXZpb3VyOiAndGFwLWRyYWcnLFxyXG4gICAgICB0b29wdGlwczogZmFsc2UsIC8vINC+0YLQutC70Y7Rh9C40YLRjCDQv9C+0LTRgdC60LDQt9C60Lgg0L3QsNC0INC/0L7Qu9C30YPQvdC60LDQvNC4XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRjdC70LXQvNC10L3RgtGLINC/0L7Qu9C30YPQvdC60L7QslxyXG4gICAgdmFyIHZhbHVlc0RpdnMgPSBbXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItYmxvY2staW5wdXQtcHJpY2UtZnJvbScpLFxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVyLWJsb2NrLWlucHV0LXByaWNlLXRpbGwnKSxcclxuICAgIF07XHJcblxyXG4gICAgLy8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0LjQt9C80LXQvdGP0YLRjCDQt9C90LDRh9C10L3QuNGPINCyINC40L3Qv9GD0YLQsNGFINC/0YDQuCDRgdC80LXQvdC1INC90LAg0YHQu9Cw0LnQtNC10YDQtVxyXG4gICAgc2xpZGVyUHJpY2Uubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24gKHZhbHVlcywgaGFuZGxlKSB7XHJcbiAgICAgIHZhbHVlc0RpdnNbaGFuZGxlXS52YWx1ZSA9IHBhcnNlSW50KHZhbHVlc1toYW5kbGVdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhbHVlc0RpdnMuZm9yRWFjaChpbnB1dCA9PiB7XHJcbiAgICAgIC8vINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4INC80LXQvdGP0YLRjCDQt9C90LDRh9C10L3QuNGPINC90LAg0YHQu9Cw0LnQtNC10YDQtSDQv9GA0Lgg0YHQvNC10L3QtSDQt9C90YfQtdC90LjQuSDQsiDQuNC90L/Rg9GC0LDRhVxyXG4gICAgICBsZXQgdGltZXJGcm9tLCB0aW1lclRpbGw7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVyLXNsaWRlci1wcmljZScpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VJbnQoaW5wdXQudmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoaW5wdXQuaWQgPT09ICdmaWx0ZXItYmxvY2staW5wdXQtcHJpY2UtZnJvbScpIHtcclxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lckZyb20pO1xyXG4gICAgICAgICAgdGltZXJGcm9tID0gc2V0VGltZW91dCgoKSA9PiB7IHNsaWRlci5ub1VpU2xpZGVyLnNldChbdmFsdWUsIG51bGxdKSB9LCAzMDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJUaWxsKTtcclxuICAgICAgICAgIHRpbWVyVGlsbCA9IHNldFRpbWVvdXQoKCkgPT4geyBzbGlkZXIubm9VaVNsaWRlci5zZXQoW251bGwsIHZhbHVlXSkgfSwgMzAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyAhICEhISDRgdC10LvQtdC60YIg0YEg0YfQtdC60LDQvNC4XHJcbiAgbGV0IGZpbHRlckNhdGVnb3JpZXMgPSBbXTtcclxuICBpbml0U2VsZWN0Q2hlY2soKTtcclxuICBpbml0U2VsZWN0SW5wdXQoKTtcclxuXHJcbiAgLy8gISDQvtCx0YHQu9GD0LbQuNCy0LDQvdC40LUg0YHQtdC70LXQutGC0L7QsiDRgSDRh9C10LrQsNC80LhcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAvLyA/INC/0YDQvtCy0LXRgNC60LAg0LTQu9GPINC30LDQutGA0YvRgtC40Y8g0LzQtdC90Y46IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vID8gIDEuINCx0YvQuyDQu9C4INGJ0LXQu9GH0L7QuiDQv9C+INC60L3QvtC/0LrQtSDRgSDQsdGD0YDQs9C10YDQvtC8INC70LjQsdC+INCyINC/0YDQtdC00LXQu9Cw0YUg0LHRg9GA0LPQtdGALdC80LXQvdGOICjQv9GA0L7QstC10YDRj9C10Lwg0YDQvtC00LjRgtC10LvQtdC5INGC0LDRgNCz0LXRgtC+0LIpXHJcbiAgICAvLyA/ICAyLiDQtdGB0LvQuCDRidC10LvRh9C+0Log0L/RgNC+0LjQt9Cy0L7QtNC40LvRgdGPINC90LUg0L/QviDRjdC70LXQvNC10L3RgtCw0Lwg0YEg0YLQsNC60LjQvNC4INGA0L7QtNC40YLQtdC70Y/QvNC4LCDRgtC+INC30LDQutGA0YvQsNC10Lwg0LzQtdC90Y4gKNCyINGB0LvRg9GH0LDQtSDQtdGB0LvQuCDQvtC90L4g0L7RgtC60YDRi9GC0L4pXHJcbiAgICBjb25zb2xlLmxvZyh0YXJnZXQuZGF0YXNldC5ibG9jayk7XHJcbiAgICBjb25zb2xlLmxvZyh0YXJnZXQuY2xvc2VzdCgnLmhlYWRlcl9fYnVyZ2VyJykpO1xyXG4gICAgY29uc29sZS5sb2codGFyZ2V0LmNsb3Nlc3QoJy5oZWFkZXJfX2J1cmdlci1tZW51JykpO1xyXG4gICAgaWYgKCF0YXJnZXQuY2xvc2VzdCgnLmhlYWRlcl9fYnVyZ2VyJykgJiYgIXRhcmdldC5jbG9zZXN0KCcuaGVhZGVyX19idXJnZXItbWVudScpKSBidXJnZXJNZW51Q2xvc2UoZSk7XHJcbiAgICAvLyA/IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLy8g0L/QtdGA0LXQsdGA0LDRgtGMINCy0YHQtSDRgdC10LvQtdC60YLRiyDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0Lgg0LfQsNC60YDRi9GC0Ywg0LjRhSwg0LXRgdC70Lgg0YnQtdC70YfQvtC6INC/0YDQvtC40LfQstC10LvRgdGPINC90LUg0L3QsCDQvdC40YVcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtY2hlY2snKS5mb3JFYWNoKHNlbGVjdCA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy8g0LXRgdC70Lgg0LrQu9Cw0YHRgSDRjdC70LXQvNC10L3RgtCwLCDQstGL0LfQstCw0LLRiNC10LPQviDRgdC+0LHRi9GC0LjQtSwg0L3QtSDQstC60LvRjtGH0LDQtdGCINCw0LnQtNC40YjQvdC40Log0YHQtdC70LXQutGC0LAsINGC0L4g0LfQsNC60YDRi9GC0Ywg0LXQs9C+XHJcbiAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NOYW1lPy5pbmNsdWRlcyhzZWxlY3QuaWQpKSB7XHJcbiAgICAgICAgICBzZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Ce0YjQuNCx0LrQsCDQvtCx0YDQsNCx0L7RgtC60Lgg0YHQtdC70LXQutGC0LAgJyArIHRhcmdldCArICc6ICcgKyBlLm5hbWUsIGUubWVzc2FnZSArICc6INCyINC60LDRh9C10YHRgtCy0LUgZXZlbnQg0L/QvtC70YPRh9C10L0g0L7QsdGK0LXQutGCIFNWR1NWR0VsZW1lbnQgKNGJ0LXQu9GH0L7QuiDQv9C+INC40LrQvtC90LrQtSDQvdCwINC60L3QvtC/0LrQtSDRgdC10LvQtdC60YLQsCknKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0L/QtdGA0LXQsdGA0LDRgtGMINCy0YHQtSDRgdC10LvQtdC60YLRiyDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0Lgg0LfQsNC60YDRi9GC0Ywg0LjRhSwg0LXRgdC70Lgg0YnQtdC70YfQvtC6INC/0YDQvtC40LfQstC10LvRgdGPINC90LUg0L3QsCDQvdC40YVcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtaW5wdXQnKS5mb3JFYWNoKHNlbGVjdCA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy8g0LXRgdC70Lgg0LrQu9Cw0YHRgSDRjdC70LXQvNC10L3RgtCwLCDQstGL0LfQstCw0LLRiNC10LPQviDRgdC+0LHRi9GC0LjQtSwg0L3QtSDQstC60LvRjtGH0LDQtdGCINCw0LnQtNC40YjQvdC40Log0YHQtdC70LXQutGC0LAsINGC0L4g0LfQsNC60YDRi9GC0Ywg0LXQs9C+XHJcbiAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NOYW1lPy5pbmNsdWRlcyhzZWxlY3QuaWQpKSB7XHJcbiAgICAgICAgICBzZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Ce0YjQuNCx0LrQsCDQvtCx0YDQsNCx0L7RgtC60Lgg0YHQtdC70LXQutGC0LAgJyArIHRhcmdldCArICc6ICcgKyBlLm5hbWUsIGUubWVzc2FnZSArICc6INCyINC60LDRh9C10YHRgtCy0LUgZXZlbnQg0L/QvtC70YPRh9C10L0g0L7QsdGK0LXQutGCIFNWR1NWR0VsZW1lbnQgKNGJ0LXQu9GH0L7QuiDQv9C+INC40LrQvtC90LrQtSDQvdCwINC60L3QvtC/0LrQtSDRgdC10LvQtdC60YLQsCknKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gISDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC10LvQtdC60YLQsCDRgSDQuNC90L/Rg9GC0L7QvFxyXG5mdW5jdGlvbiBpbml0U2VsZWN0SW5wdXQoKSB7XHJcbiAgY29uc3Qgc2VsZWN0c0hlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtaW5wdXRfX2hlYWRlcicpO1xyXG4gIGNvbnN0IHNlbGVjdHNJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtaW5wdXRfX2lucHV0Jyk7XHJcblxyXG4gIC8vINC+0YLQutGA0YvRgtC40LUv0LfQsNC60YDRi9GC0LjQtSDRgdC/0LjRgdC60LBcclxuICBpZiAoc2VsZWN0c0hlYWRlcikge1xyXG4gICAgc2VsZWN0c0hlYWRlci5mb3JFYWNoKGhlYWRlciA9PiB7XHJcbiAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdFRvZ2dsZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vINCy0YvQsdC+0YAv0YHQvdGP0YLQuNC1INCy0LDRgNC40LDQvdGC0L7QslxyXG4gIGlmIChzZWxlY3RzSW5wdXQpIHtcclxuICAgIHNlbGVjdHNJbnB1dC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNlbGVjdENoYW5nZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNlbGVjdFRvZ2dsZSgpIHtcclxuICAgIHRoaXMuY2xvc2VzdCgnLnNlbGVjdC1pbnB1dCcpLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2VsZWN0Q2hhbmdlKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5jbG9zZXN0KCcuc2VsZWN0LWlucHV0Jyk7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtaW5wdXRfX2N1cnJlbnQnKTtcclxuICAgIGNvbnN0IGlucHV0cyA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0LWlucHV0X19pbnB1dCcpO1xyXG5cclxuICAgIGxldCBmcm9tLCB0aWxsO1xyXG4gICAgaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKGlucHV0LmRhdGFzZXQucHJpY2VUeXBlKSB7XHJcbiAgICAgICAgY2FzZSAnZnJvbSc6XHJcbiAgICAgICAgICBmcm9tID0gaW5wdXQudmFsdWU7XHJcbiAgICAgICAgY2FzZSAndGlsbCc6XHJcbiAgICAgICAgICB0aWxsID0gaW5wdXQudmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC10YHQu9C4INCe0KIg0Lgg0JTQniDQv9GD0YHRgtGL0LUsINGC0L4g0LLRi9Cy0L7QtNC40YLRjCBwbGFjZWhvbGRlclxyXG4gICAgLy8g0LXRgdC70Lgg0YLQvtC70YzQutC+INCe0KIg0L/Rg9GB0YLQvtC1LCDRgtC+INCy0YvQstC+0LTQuNGC0YwgXCI8INCU0J5cIlxyXG4gICAgLy8g0LXRgdC70Lgg0YLQvtC70YzQutC+INCU0J4g0L/Rg9GB0YLQvtC1LCDRgtC+INCy0YvQstC+0LTQuNGC0YwgXCI+INCe0KJcIlxyXG4gICAgLy8g0LjQvdCw0YfQtSDQstGL0LLQvtC00LjRgtGMIFwi0L7RgiDQntCiINC00L4g0JTQnlwiINC40LvQuCBcItCe0KIgLi4uINCU0J5cIlxyXG5cclxuICAgIGxldCB2YWx1ZXM7XHJcbiAgICBpZiAoIWZyb20gJiYgIXRpbGwpIHtcclxuICAgICAgdmFsdWVzID0gdW5kZWZpbmVkO1xyXG4gICAgfSBlbHNlIGlmIChmcm9tICYmIHRpbGwpIHtcclxuICAgICAgdmFsdWVzID0gYCR7ZnJvbX0gLSAke3RpbGx9YDtcclxuICAgIH0gZWxzZSBpZiAoIWZyb20pIHtcclxuICAgICAgdmFsdWVzID0gYNC00L4gJHt0aWxsfWA7XHJcbiAgICB9IGVsc2UgaWYgKCF0aWxsKSB7XHJcbiAgICAgIHZhbHVlcyA9IGDQvtGCICR7ZnJvbX1gO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWx1ZXMpIHtcclxuICAgICAgY3VycmVudC5pbm5lclRleHQgPSB2YWx1ZXM7XHJcbiAgICAgIHNlbGVjdC5kYXRhc2V0LnZhbHVlID0gSlNPTi5zdHJpbmdpZnkoeyBtaW46IHBhcnNlSW50KGZyb20pLCBtYXg6IHBhcnNlSW50KHRpbGwpIH0pO1xyXG4gICAgICBjdXJyZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50LnRleHRDb250ZW50ID0gc2VsZWN0LmRhdGFzZXQucGxhY2Vob2xkZXI7XHJcbiAgICAgIHNlbGVjdC5kYXRhc2V0LnZhbHVlID0gJyc7XHJcbiAgICAgIGN1cnJlbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vICEg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQtdC70LXQutGC0LAg0YEg0YfQtdC60LDQvNC4XHJcbmZ1bmN0aW9uIGluaXRTZWxlY3RDaGVjaygpIHtcclxuICBjb25zdCBzZWxlY3RzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlbGVjdC1jaGVja19faGVhZGVyJyk7XHJcblxyXG4gIC8vINC+0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDRgdC10LvQtdC60YLQvtCyXHJcbiAgaWYgKHNlbGVjdHNIZWFkZXIpIHtcclxuICAgIHNlbGVjdHNIZWFkZXIuZm9yRWFjaChoZWFkZXIgPT4ge1xyXG4gICAgICAvLyA/INC+0YLQutGA0YvRgtC40LUv0LfQsNC60YDRi9GC0LjQtSDRgdC/0LjRgdC60LBcclxuICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZWN0VG9nZ2xlKTtcclxuXHJcbiAgICAgIC8vID8g0LLRi9Cx0L7RgC/RgdC90Y/RgtC40LUg0LLQsNGA0LjQsNC90YLQvtCyXHJcbiAgICAgIGNvbnN0IHNlbGVjdHNJbnB1dCA9IGhlYWRlci5jbG9zZXN0KCcuc2VsZWN0LWNoZWNrJykucXVlcnlTZWxlY3RvckFsbCgnLnNlbGVjdC1jaGVja19faXRlbSAuY2hlY2tib3ggaW5wdXQnKTtcclxuICAgICAgaWYgKHNlbGVjdHNJbnB1dCkge1xyXG4gICAgICAgIHNlbGVjdHNJbnB1dC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzZWxlY3RDaGFuZ2UpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2VsZWN0VG9nZ2xlKCkge1xyXG4gICAgdGhpcy5jbG9zZXN0KCcuc2VsZWN0LWNoZWNrJykuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZWxlY3RDaGFuZ2UoKSB7XHJcbiAgICBjb25zdCBzZWxlY3QgPSB0aGlzLmNsb3Nlc3QoJy5zZWxlY3QtY2hlY2snKTtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSBzZWxlY3QucXVlcnlTZWxlY3RvcignLnNlbGVjdC1jaGVja19fY3VycmVudCcpO1xyXG4gICAgY29uc3QgY2hlY2tib3hlcyA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hlY2tib3gnKTtcclxuXHJcbiAgICBsZXQgdmFsdWVzID0gW107IC8vINC80LDRgdGB0LjQsiDQstGL0LHRgNCw0L3QvdGL0YUg0LLQsNGA0LjQsNC90YLQvtCyIChuYW1lICsgY2FwdGlvbilcclxuXHJcbiAgICBjaGVja2JveGVzLmZvckVhY2goY2hlY2tib3ggPT4ge1xyXG4gICAgICBjb25zdCBpdGVtTGFiZWwgPSBjaGVja2JveC5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xyXG4gICAgICBjb25zdCBpdGVtTmFtZSA9IGl0ZW1MYWJlbC5kYXRhc2V0Lm5hbWU7XHJcbiAgICAgIGNvbnN0IGl0ZW1DYXB0aW9uID0gaXRlbUxhYmVsLnRleHRDb250ZW50O1xyXG4gICAgICBjb25zdCBpdGVtVmFsdWUgPSBjaGVja2JveC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmNoZWNrZWQ7XHJcblxyXG4gICAgICBpZiAoaXRlbVZhbHVlKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2goeyBuYW1lOiBpdGVtTmFtZSwgY2FwdGlvbjogaXRlbUNhcHRpb24gfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC40LfQvNC10L3QtdC90LjQtSDQt9C90LDRh9C10L3QuNC5INC4INC30LDQv9C+0LvQvdC10L3QuNC1IHNlbGVjdC5kYXRhLXZhbHVlXHJcbiAgICBpZiAodmFsdWVzLmxlbmd0aCkge1xyXG4gICAgICBjdXJyZW50LmlubmVyVGV4dCA9IHZhbHVlcy5tYXAoaXRlbSA9PiBpdGVtLmNhcHRpb24pLmpvaW4oJywgJyk7XHJcbiAgICAgIHNlbGVjdC5kYXRhc2V0LnZhbHVlID0gdmFsdWVzLm1hcChpdGVtID0+IGl0ZW0ubmFtZSkuam9pbignLCcpO1xyXG4gICAgICBjdXJyZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50LnRleHRDb250ZW50ID0gc2VsZWN0LmRhdGFzZXQucGxhY2Vob2xkZXI7XHJcbiAgICAgIHNlbGVjdC5kYXRhc2V0LnZhbHVlID0gJyc7XHJcbiAgICAgIGN1cnJlbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZnVuY3Rpb24gY2F0ZWdvcmllc1Byb2Nlc3MoKSB7XHJcbiAgICAvLyDQutCw0YLQtdCz0L7RgNC40LhcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2F0ZWdvcmllc19fbGlzdCcpO1xyXG4gICAgY2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcclxuICAgICAgY29uc3QgY2hvaWNlcyA9IG5ldyBDaG9pY2VzKGNhdGVnb3J5LCB7XHJcbiAgICAgICAgc2VhcmNoRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgc2hvdWxkU29ydDogZmFsc2UsXHJcbiAgICAgICAgaXRlbVNlbGVjdFRleHQ6ICcnLFxyXG4gICAgICAgIGFsbG93SFRNTDogdHJ1ZSxcclxuICAgICAgICAvLyBwb3NpdGlvbjogJ2Rvd24nLFxyXG4gICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgIHsgdmFsdWU6ICdlbXB0eScsIGxhYmVsOiAn0JrQsNGC0LXQs9C+0YDQuNGPJywgc2VsZWN0ZWQ6IHRydWUsIGRpc2FibGVkOiB0cnVlIH0sXHJcbiAgICAgICAgICB7IHZhbHVlOiAn0JTQuNCy0LDQvdGLJywgbGFiZWw6ICfQlNC40LLQsNC90YsnIH0sXHJcbiAgICAgICAgICB7IHZhbHVlOiAn0JrRgNC10YHQu9CwJywgbGFiZWw6ICfQmtGA0LXRgdC70LAnIH0sXHJcbiAgICAgICAgICB7IHZhbHVlOiAn0J/Rg9GE0YsnLCBsYWJlbDogJ9Cf0YPRhNGLJyB9LFxyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ca0YDQvtCy0LDRgtC4JywgbGFiZWw6ICfQmtGA0L7QstCw0YLQuCcgfSxcclxuICAgICAgICAgIHsgdmFsdWU6ICfQotGD0LzQsdGLJywgbGFiZWw6ICfQotGD0LzQsdGLJyB9LFxyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ca0L7QvNC+0LTRiycsIGxhYmVsOiAn0JrQvtC80L7QtNGLJyB9LFxyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ch0YLRg9C70YzRjycsIGxhYmVsOiAn0KHRgtGD0LvRjNGPJyB9LFxyXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ch0YLQvtC70YsnLCBsYWJlbDogJ9Ch0YLQvtC70YsnIH0sXHJcbiAgICAgICAgICB7IHZhbHVlOiAn0JDQutGB0LXRgdGB0YPQsNGA0YsnLCBsYWJlbDogJ9CQ0LrRgdC10YHRgdGD0LDRgNGLJyB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiY29uc3QgcmVjb3Jkc1Byb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuICBkb3R0ZWRQcm9jZXNzKCcucmVjb3JkX19kZWxpbWl0ZXInKVxyXG59O1xyXG5cclxuY29uc3QgZG90dGVkUHJvY2VzcyA9IGZ1bmN0aW9uKHN0cmluZ1RhZykge1xyXG4gIGNvbnN0IHRhZyA9IHN0cmluZ1RhZyB8fCAnLmRvdHRlZCBwJztcclxuICBjb25zdCBkb3R0ZWRTdHJpbmdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YWcpO1xyXG4gIGRvdHRlZFN0cmluZ3MuZm9yRWFjaChzdHIgPT4ge1xyXG4gICAgc3RyLnNldEF0dHJpYnV0ZSgnZGF0YS1jb250ZW50JywgJy4nLnJlcGVhdCgyMDApKTtcclxuICB9KTtcclxufTtcclxuXHJcbiIsImZ1bmN0aW9uIGdvb2RQcm9jZXNzKCkge1xyXG4gIGNvbnN0IHN3aXBlck9mZmVycyA9IG5ldyBTd2lwZXIoJy5nb29kJywge1xyXG4gICAgbG9vcDogZmFsc2UsXHJcbiAgICBzcGFjZUJldHdlZW46IDMyLFxyXG4gICAgc2xpZGVzUGVyR3JvdXA6IDEsXHJcbiAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgYXV0b0hlaWdodDogZmFsc2UsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICAzMjA6IHsgLy8gd2hlbiB3aW5kb3cgd2lkdGggaXMgPj0gMzIwcHhcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIDU3NjogeyAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSA3NjhweFxyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDJcclxuICAgICAgfSxcclxuICAgICAgMTAyNDogeyAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSAxMDI0cHhcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICB9LFxyXG4gICAgICAxMzUyOiB7XHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMlxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICBuZXh0RWw6IFwiLmdvb2RfX2J0bi1uZXh0XCIsXHJcbiAgICAgIHByZXZFbDogXCIuZ29vZF9fYnRuLXByZXZcIixcclxuICAgICAgZGlzYWJsZWRDbGFzczogJ2J0bi1pY29uLS1kaXNhYmxlZCcsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsImZ1bmN0aW9uIG1vZGFsc1Byb2Nlc3MoKSB7XHJcbiAgLy8gPyDQvtGH0LjRgdGC0LjRgtGMINC80L7QtNCw0LvRjNC90YvQuSDQtNC40LDQu9C+0LMg0L7RgiDQu9C40YjQvdC40YUg0LTQvtC/LiDRgdGC0LjQu9C10LlcclxuICBmdW5jdGlvbiByZXNldE1vZGFsRGlhbG9nU3R5bGVzKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWRpYWxvZycpLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWRpYWxvZy0tcGhvdG8nKTtcclxuICB9XHJcbiAgLy8gPyDQt9Cw0LrRgNGL0YLQuNC1INC80L7QtNCw0LvQutC4INGB0L4g0YHQstC+0YDQsNGH0LjQstCw0L3QuNC10Lwg0LLRgdC10YUg0LLQuNC00L7QsiDQvNC+0LTQsNC70YzQvdGL0YUg0L7QutC+0L0g0LLQvdGD0YLRgNC4XHJcbiAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3NjYWxlLTEnKTsgLy8gPyDRgdC60YDRi9GC0Ywg0LzQvtC00LDQu9C60YMgKNC80LXQtNC70LXQvdC90L4pXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgWydtb2RhbC1idXknLCAnbW9kYWwtYnV5LWNvbmZpcm0nLCAnbW9kYWwtcGhvdG8nXS5mb3JFYWNoKG1vZGFsS2luZE5hbWUgPT4geyAvLyA/INC30LDQutGA0YvRgtGMINC60LDQttC00YvQuSDQstC40LQg0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LAg0LLQvdGD0YLRgNC4INC80L7QtNCw0LvQutC4XHJcbiAgICAgICAgY29uc3QgbW9kYWxLaW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobW9kYWxLaW5kTmFtZSk7XHJcbiAgICAgICAgaWYgKCFtb2RhbEtpbmQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub25lJykpIHtcclxuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1vZGFsS2luZE5hbWUpLmNsYXNzTGlzdC5hZGQoJ25vbmUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXNldE1vZGFsRGlhbG9nU3R5bGVzKCk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc3RvcC1zY3JvbGwnKTsgLy8gPyDQstC60LvRjtGH0LjRgtGMINC/0YDQvtC70LjRgdGC0YvQstCw0L3QuNC1INGB0YLRgNCw0L3QuNGG0YtcclxuXHJcbiAgICB9LCAzMDApO1xyXG4gIH1cclxuXHJcbiAgLy8gISDQvtGC0LrRgNGL0YLQuNC1INC80L7QtNCw0LvQutC4INC/0L4g0LrQu9C40LrRgyDQvdCwINC70Y7QsdC+0Lkg0Y3Qu9C10LzQtdC90YIg0YEg0LrQu9Cw0YHRgdC+0LwganMtbW9kYWwtb3BlblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1tb2RhbC1vcGVuJykuZm9yRWFjaChpdGVtID0+IHtcclxuICAgIGNvbnN0IG1vZGFsS2luZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0uZGF0YXNldC50YXJnZXQpOyAvLyA/INCyIHRhcmdldCDQt9Cw0L/QuNGB0YvQstCw0LXRgtGB0Y8gaWQg0LLQuNC00LAg0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LAg0LTQu9GPINC+0YLQutGA0YvRgtC40Y8sINGCLtC6LiDQstC40LTQvtCyINC90LXRgdC60L7Qu9GM0LrQvlxyXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzdG9wLXNjcm9sbCcpOyAvLyA/INGD0LHRgNCw0YLRjCDQv9GA0L7Qu9C40YHRgtGL0LLQsNC90LjQtSDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgIG1vZGFsS2luZC5jbGFzc0xpc3QucmVtb3ZlKCdub25lJyk7IC8vID8g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LLQuNC0INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINCy0L3Rg9GC0YDQuCDQvNC+0LTQsNC70LrQuCAo0L7QvdC4INCy0YHQtSDQvdC10LLQuNC00LjQvNGLINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOKVxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwnKS5jbGFzc0xpc3QuYWRkKCdzY2FsZS0xJyk7IC8vID8g0L/QvtC60LDQt9Cw0YLRjCDQvNC+0LTQsNC70LrRgyAo0LzQtdC00LvQtdC90L3QvilcclxuXHJcbiAgICAgIGNoYW5nZU1vZGFsRGlhbG9nU3R5bGVzKGl0ZW0uZGF0YXNldC50YXJnZXQpOyAvLyA/INC40LfQvNC10L3QuNGC0Ywg0LTQtdGE0L7Qu9GC0L3Ri9C1INC90LDRgdGC0YDQvtC50LrQuCDQvNC+0LTQsNC70YzQvdC+0LPQviDQvtC60L3QsCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0LTQuNCw0LvQvtCz0LBcclxuXHJcbiAgICAgIC8vID8g0LXRgdC70Lgg0LzQvtC00LDQu9GM0L3QvtC1INC+0LrQvdC+INGBINGE0L7RgtC60LDQvNC4LCDRg9GB0YLQsNC90L7QstC40YLRjCDQvdGD0LbQvdGD0Y4g0YTQvtGC0L7Qs9GA0LDRhNC40Y5cclxuICAgICAgY29uc3QgcGhvdG9JbmRleCA9IGl0ZW0uZGF0YXNldC5tb2RhbFBob3RvSW5kZXg7XHJcbiAgICAgIG1vZGFsUGhvdG9NYWluU2xpZGVyLmFjdGl2ZUluZGV4ID0gcGhvdG9JbmRleDsgLy8gISAtLS0tLS0tLT4g0L/QvtGH0LXQvNGDINC90LUg0YDQsNCx0L7RgtCw0LXRgj8hXHJcbiAgICB9KVxyXG4gIH0pO1xyXG5cclxuICAvLyDQuNC30LzQtdC90LjRgtGMINC00LXRhNC+0LvRgtC90YvQtSDQvdCw0YHRgtGA0L7QudC60Lgg0LzQvtC00LDQu9GM0L3QvtCz0L4g0LTQuNCw0LvQvtCz0LAsINC10YHQu9C4INGC0YDQtdCx0YPQtdGC0YHRj1xyXG4gIGZ1bmN0aW9uIGNoYW5nZU1vZGFsRGlhbG9nU3R5bGVzKG1vZGFsS2luZE5hbWUpIHtcclxuICAgIGNvbnN0IG1vZGFsRGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWRpYWxvZycpO1xyXG5cclxuICAgIGlmIChtb2RhbEtpbmROYW1lID09PSAnbW9kYWwtcGhvdG8nKSB7XHJcbiAgICAgIG1vZGFsRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWRpYWxvZy0tcGhvdG8nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICEg0LfQsNC60YDRi9GC0LjQtSDQvNC+0LTQsNC70LrQuFxyXG4gIC8vIDEuINC/0YDQuCDQutC70LjQutC1INCy0L3QtSDQtNC40LDQu9C+0LPQsFxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBpZiAoZS5faXNDbGlja1dpdGhpbk1vZGFsRGlhbG9nKSByZXR1cm47XHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSlcclxuXHJcbiAgLy8gMi4g0L/RgNC4INC60LvQuNC60LUg0L3QsCDQutGA0LXRgdGC0LjQulxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1jbG9zZScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vICEg0YPRgdGC0LDQvdC+0LLQutCwINC/0YDQvtCy0LXRgNC60Lgg0L3QsCDQutC70LjQuiDQstC90YPRgtGA0Lgg0LTQuNCw0LvQvtCz0LBcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtZGlhbG9nJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIGUuX2lzQ2xpY2tXaXRoaW5Nb2RhbERpYWxvZyA9IHRydWU7XHJcbiAgfSlcclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgLy8gISDRgNCw0LHQvtGC0LAg0YEg0LzQvtC00LDQu9GM0L3QvtC5INGE0L7RgNC80L7QuVxyXG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtZGlhbG9nLWJ1eS1mb3JtJykpIHtcclxuICAgIC8vICEg0LLQsNC70LjQtNCw0YbQuNGPXHJcbiAgICBjb25zdCBpbnB1dE1vZGFsRm9ybVBob25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWRpYWxvZy1idXktcGhvbmUnKTtcclxuICAgIGNvbnN0IHZhbGlkYXRpb25Nb2RhbEJ1eSA9IG5ldyBKdXN0VmFsaWRhdGUoJyNtb2RhbC1kaWFsb2ctYnV5LWZvcm0nLCB7XHJcbiAgICAgIGZvY3VzSW52YWxpZEZpZWxkOiB0cnVlLFxyXG4gICAgICB2YWxpZGF0ZUJlZm9yZVN1Ym1pdHRpbmc6IHRydWUsXHJcbiAgICAgIC8vIGVycm9yc0NvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsaWVudC1lcnJvcicpLFxyXG4gICAgICBlcnJvckZpZWxkQ3NzQ2xhc3M6ICdpbnZhbGlkYXRlZCcsXHJcbiAgICB9KVxyXG4gICAgICAuYWRkRmllbGQoJyNtb2RhbC1kaWFsb2ctYnV5LWZpbycsIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBydWxlOiAncmVxdWlyZWQnLFxyXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiAn0JLQstC10LTQuNGC0LUg0KTQmNCeJyxcclxuICAgICAgICB9XHJcbiAgICAgIF0pXHJcbiAgICAgIC5hZGRGaWVsZCgnI21vZGFsLWRpYWxvZy1idXktcGhvbmUnLCBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcnVsZTogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgIGVycm9yTWVzc2FnZTogYNCS0LLQtdC00LjRgtC1INC90L7QvNC10YBgLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsdWUsIGNvbnRleHQpIHtcclxuICAgICAgICAgICAgY29uc3QgbnVtVmFsdWUgPSBpbnB1dE1vZGFsRm9ybVBob25lLmlucHV0bWFzay51bm1hc2tlZHZhbHVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCb29sZWFuKE51bWJlcihudW1WYWx1ZSkgJiYgbnVtVmFsdWUubGVuZ3RoID09PSAxMCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC90L7QvNC10YAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0pO1xyXG4gICAgLy8gLmFkZEZpZWxkKCcjcmVxdWVzdC1lbWFpbCcsIFtcclxuICAgIC8vICAge1xyXG4gICAgLy8gICAgIHJ1bGU6ICdyZXF1aXJlZCcsXHJcbiAgICAvLyAgICAgZXJyb3JNZXNzYWdlOiAn0JLQstC10LTQuNGC0LUgZS1tYWlsJyxcclxuICAgIC8vICAgfSxcclxuICAgIC8vICAge1xyXG4gICAgLy8gICAgIHJ1bGU6ICdlbWFpbCcsXHJcbiAgICAvLyAgICAgZXJyb3JNZXNzYWdlOiAn0J3QtdC/0YDQsNCy0LjQu9GM0L3Ri9C5INGE0L7RgNC80LDRgicsXHJcbiAgICAvLyAgIH1cclxuICAgIC8vIF0pO1xyXG5cclxuICAgIHZhbGlkYXRpb25Nb2RhbEJ1eS5yZXZhbGlkYXRlKCk7IC8vINC90YPQttC90LAg0YDQtdCy0LDQu9C40LTQsNGG0LjRjywg0YfRgtC+0LHRiyDQv9GA0Lgg0L7RgtC60YDRi9GC0LjQuCDRhNC+0YDQvNGLINC4INGB0YDQsNC30YMg0LbQtSDQvdCw0LbQsNGC0LjQuCBcItCe0YLQv9GA0LDQstC40YLRjFwiINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40LvQsCDQvtGC0L/RgNCw0LLQutCwINC/0YPRgdGC0YvRhSDQtNCw0L3QvdGL0YVcclxuXHJcbiAgICAvLyAhIHN1Ym1pdCDQvNC+0LTQsNC70YzQvdC+0Lkg0YTQvtGA0LzRi1xyXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1kaWFsb2ctYnV5LWZvcm0nKTtcclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoIWZvcm0ucXVlcnlTZWxlY3RvcignLmludmFsaWRhdGVkJykpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYnV5JykuY2xhc3NMaXN0LmFkZCgnbm9uZScpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1idXktY29uZmlybScpLmNsYXNzTGlzdC5yZW1vdmUoJ25vbmUnKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vICEg0YDQsNCx0L7RgtCwINGBINC80L7QtNCw0LvRjNC90YvQvNC4INGB0LvQsNC50LTQtdGA0LDQvNC4XHJcbiAgLy8g0YHQv9C40YHQvtC6INC80LDQu9C10L3RjNC60LjRhSDRhNC+0YLQvlxyXG4gIGNvbnN0IG1vZGFsUGhvdG9MaXN0U2xpZGVyID0gbmV3IFN3aXBlcihcIi5tb2RhbC1kaWFsb2dfX3Bob3RvLWxpc3Qtc3dpcGVyXCIsIHtcclxuICAgIHNwYWNlQmV0d2VlbjogNzgsXHJcbiAgICBzbGlkZXNQZXJWaWV3OiA0LFxyXG4gICAgLy8gZnJlZU1vZGU6IHRydWUsIC8vIC0tLS0tPiDRgdCy0L7QsdC+0LTQvdC+0LUg0L/QtdGA0LXQu9C40YHRgtGL0LLQsNC90LjQtSDQsdC10Lcg0YHQutCw0YfQutC+0LJcclxuICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICAzMjA6IHtcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxyXG4gICAgICB9LFxyXG4gICAgICA1NzY6IHtcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMzksXHJcbiAgICAgIH0sXHJcbiAgICAgIDc2ODoge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiA3OCxcclxuICAgICAgfSxcclxuICAgICAgMTAyNDoge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiA3OCxcclxuICAgICAgfSxcclxuICAgICAgMTM1Mjoge1xyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDQsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiA3OCxcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxuICAvLyDQs9C70LDQstC90L7QtSDQsdC+0LvRjNGI0L7QtSDRhNC+0YLQvlxyXG4gIGNvbnN0IG1vZGFsUGhvdG9NYWluU2xpZGVyID0gbmV3IFN3aXBlcihcIi5tb2RhbC1kaWFsb2dfX3Bob3RvLW1haW4tc3dpcGVyXCIsIHtcclxuICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgIG5leHRFbDogXCIubW9kYWwtZGlhbG9nX19waG90by1idXR0b24tbmV4dFwiLFxyXG4gICAgICBwcmV2RWw6IFwiLm1vZGFsLWRpYWxvZ19fcGhvdG8tYnV0dG9uLXByZXZcIixcclxuICAgICAgZGlzYWJsZWRDbGFzczogJ2J0bi1pY29uLS1kaXNhYmxlZCcsXHJcbiAgICB9LFxyXG4gICAgdGh1bWJzOiB7XHJcbiAgICAgIHN3aXBlcjogbW9kYWxQaG90b0xpc3RTbGlkZXIsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsImZ1bmN0aW9uIG9mZmVyc1Byb2Nlc3MoKSB7XHJcbiAgY29uc3Qgc3dpcGVyT2ZmZXJzID0gbmV3IFN3aXBlcignLm9mZmVycycsIHtcclxuICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgc3BhY2VCZXR3ZWVuOiAzMixcclxuICAgIHNsaWRlc1Blckdyb3VwOiAzLFxyXG4gICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgIGF1dG9IZWlnaHQ6IGZhbHNlLFxyXG4gICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgMzIwOiB7IC8vIHdoZW4gd2luZG93IHdpZHRoIGlzID49IDMyMHB4XHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcclxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMVxyXG4gICAgICB9LFxyXG4gICAgICA3Njg6IHsgLy8gd2hlbiB3aW5kb3cgd2lkdGggaXMgPj0gNzY4cHhcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgICAgIHNsaWRlc1Blckdyb3VwOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIDEwMjQ6IHsgLy8gd2hlbiB3aW5kb3cgd2lkdGggaXMgPj0gMTAyNHB4XHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMVxyXG4gICAgICB9LFxyXG4gICAgICAxMzUyOiB7XHJcbiAgICAgICAgc2xpZGVzUGVyR3JvdXA6IDNcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgbmV4dEVsOiBcIi5vZmZlcnNfX2J0bi1uZXh0XCIsXHJcbiAgICAgIHByZXZFbDogXCIub2ZmZXJzX19idG4tcHJldlwiLFxyXG4gICAgICBkaXNhYmxlZENsYXNzOiAnYnRuLWljb24tLWRpc2FibGVkJyxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuIiwiZnVuY3Rpb24gcHJvZHVjdFByb2Nlc3MoKSB7XHJcblxyXG4gIC8vICEg0LzQuNC90Lgt0YTQvtGC0LrQuCDQv9C10YDQtdC70LjRgdGC0YvQstCw0Y7RgtGB0Y8g0LHQtdC3INGB0LrRgNC+0LvQu9CwLCDQvdCwINGC0LDRh9GB0LrRgNC40L3QsNGFLCDQu9C40LHQviDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0YHRgNC10LTQvdC10Lkg0LrQvdC+0L/QutC4INC80YvRiNC4XHJcbiAgLy8gLy8g0L7RgdC90L7QstC90YvQtSDRhNC+0YLQvtCz0YDQsNGE0LjQuFxyXG4gIC8vIGNvbnN0IHBob3RvcyA9IG5ldyBTd2lwZXIoXCIucHJvZHVjdC1waG90b3Mtc3dpcGVyXCIsIHtcclxuICAvLyAgIHNwYWNlQmV0d2VlbjogMSxcclxuICAvLyAgIHNsaWRlc1BlclZpZXc6IDEsXHJcbiAgLy8gICBmcmVlTW9kZTogZmFsc2UsXHJcbiAgLy8gICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxyXG4gIC8vICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXHJcbiAgLy8gfSk7XHJcblxyXG4gIC8vIC8vINC80LjQvdC4LdC60L7Qv9C40Lgg0YTQvtGC0L7Qs9GA0LDRhNC40LlcclxuICAvLyBjb25zdCBwaG90b3NMaXN0ID0gbmV3IFN3aXBlcihcIi5wcm9kdWN0LXBob3Rvcy1saXN0LXN3aXBlclwiLCB7XHJcbiAgLy8gICBzcGFjZUJldHdlZW46IDM4LFxyXG4gIC8vICAgc2xpZGVzUGVyVmlldzogJ2F1dG8tZmlsJyxcclxuICAvLyAgIGZyZWVNb2RlOiB0cnVlLFxyXG4gIC8vICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcclxuICAvLyAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxyXG4gIC8vICAgYnJlYWtwb2ludHM6IHtcclxuICAvLyAgICAgMzIwOiB7XHJcbiAgLy8gICAgICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXHJcbiAgLy8gICAgIH0sXHJcbiAgLy8gICAgIDU3Njoge1xyXG4gIC8vICAgICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAvLyAgICAgfSxcclxuICAvLyAgICAgMTAyNDoge1xyXG4gIC8vICAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxyXG4gIC8vICAgICB9LFxyXG4gIC8vICAgfVxyXG4gIC8vIH0pO1xyXG5cclxuICAvLyDQt9Cw0LzQtdC90LAg0LjQt9C+0LHRgNCw0LbQtdC90LjRjyDQv9C+INGJ0LXQu9GH0LrRgyDQvNGL0YjQuCDQvdCwINGB0L/QuNGB0LrQuCDQvNC40L3QuC3QutCw0YDRgtC40L3QvtC6XHJcbiAgY29uc3QgbGlzdEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1pbWcnKTtcclxuICBpZiAobGlzdEltZ3MgJiYgbGlzdEltZ3MubGVuZ3RoKSB7XHJcbiAgICBsaXN0SW1ncy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBjb25zdCBiaWdJbWdVUkwgPSBpdGVtLmRhdGFzZXQuYmltYWdlO1xyXG4gICAgICAgIGNvbnN0IGJpZ0ltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiaWctaW1nJyk7XHJcbiAgICAgICAgYmlnSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgYmlnSW1nVVJMKTtcclxuXHJcbiAgICAgICAgLy8gPyDRgdC+0YXRgNCw0L3QuNGC0Ywg0LjQvdC00LXQutGBINC40LfQvtCx0YDQsNC20LXQvdC40Y8sINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0L7RgtC+0LHRgNCw0LbQtdC9INCyINC80L7QtNCw0LvRjNC90L7QvCDQvtC60L3QtSDQv9GA0Lgg0YnQtdC70YfQutC1INC90LAg0LHQvtC70YzRiNC+0LUg0YTQvtGC0L5cclxuICAgICAgICBjb25zdCBpbWdQYXJlbnQgPSBiaWdJbWcuY2xvc2VzdCgnLnByb2R1Y3QtcGhvdG8tbWFpbicpO1xyXG4gICAgICAgIGltZ1BhcmVudC5kYXRhc2V0Lm1vZGFsUGhvdG9JbmRleCA9IDQ7IC8vICEgLS0tLS0+INGB0L7RhdGA0LDQvdGP0Y4g0L3QvtC80LXRgCwg0L3QviDQsiBtb2RhbC5qcyDQuNC30LzQtdC90LXQvdC40LUgYWN0aXZlU2xpZGUg0LIg0YHRgtGALjMzINC90LUg0YDQsNCx0L7RgtCw0LXRgiFcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gISDQvtGC0LrRgNGL0YLQuNC1INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINGB0L4g0YHQu9Cw0LnQtNC10YDQsNC80Lgg0LjQt9C+0LHRgNCw0LbQtdC90LjQuSA9PT09PiDRgdC8LiBtb2RhbC5qc1xyXG4gIC8vIGNvbnN0IHByb2RQaG90b3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZHVjdC1waG90b3MnKTtcclxuICAvLyBpZiAocHJvZFBob3Rvcykge1xyXG4gIC8vICAgcHJvZFBob3Rvcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgLy8gICAgIGFsZXJ0KCfQt9C00YDQsNCyINCx0YPQtNC1LCDQsdC+0Y/RgNC40L0hJyk7XHJcbiAgLy8gICB9KTtcclxuICAvLyB9XHJcblxyXG4gIC8vICEg0YHQu9Cw0LnQtNC10YAg0YEg0L/QvtGF0L7QttC40LzQuCDRgtC+0LLQsNGA0LDQvNC4XHJcbiAgY29uc3Qgc3dpcGVyU2FtZSA9IG5ldyBTd2lwZXIoJy5zYW1lJywge1xyXG4gICAgbG9vcDogZmFsc2UsXHJcbiAgICBzcGFjZUJldHdlZW46IDMyLFxyXG4gICAgc2xpZGVzUGVyR3JvdXA6IDEsXHJcbiAgICBzbGlkZXNQZXJWaWV3OiA0LFxyXG4gICAgYXV0b0hlaWdodDogZmFsc2UsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICAzMjA6IHsgLy8gd2hlbiB3aW5kb3cgd2lkdGggaXMgPj0gMzIwcHhcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMTYsXHJcbiAgICAgIH0sXHJcbiAgICAgIDU3NjogeyAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSA3NjhweFxyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAzMlxyXG4gICAgICB9LFxyXG4gICAgICAxMDI0OiB7IC8vIHdoZW4gd2luZG93IHdpZHRoIGlzID49IDEwMjRweFxyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgIH0sXHJcbiAgICAgIDEzNTI6IHtcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiA0XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgIG5leHRFbDogXCIuc2FtZV9fYnRuLW5leHRcIixcclxuICAgICAgcHJldkVsOiBcIi5zYW1lX19idG4tcHJldlwiLFxyXG4gICAgICBkaXNhYmxlZENsYXNzOiAnYnRuLWljb24tLWRpc2FibGVkJyxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG59XHJcbiIsImZ1bmN0aW9uIHJlcXVlc3RzUHJvY2VzcygpIHtcclxuICAvLyDRhdC40L3RglxyXG4gIHRpcHB5KCcucmVxdWVzdF9faGludCcsIHtcclxuICAgIGNvbnRlbnQ6ICfQoNC10L/Qu9C40YbQuNGA0L7QstCw0L3QvdGL0LUg0YEg0LfQsNGA0YPQsdC10LbQvdGL0YUg0LjRgdGC0L7Rh9C90LjQutC+0LIsINC40YHRgdC70LXQtNC+0LLQsNC90LjRjyDRhNC+0YDQvNC40YDRg9GO0YIg0LPQu9C+0LHQsNC70YzQvdGD0Y4g0YHQtdGC0YwuJyxcclxuICAgIGFsbG93SFRNTDogdHJ1ZSxcclxuICAgIGludGVyYWN0aXZlOiB0cnVlLFxyXG4gICAgdGhlbWU6ICdtYWluJyxcclxuICAgIG1heFdpZHRoOiAxNTdcclxuICB9KTtcclxuXHJcbiAgY29uc3QgaW5wdXRGaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtZmlvJyk7XHJcbiAgY29uc3QgaW5wdXRzUGhvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW5wdXQtcGhvbmUnKTtcclxuICBjb25zdCBpbnB1dEVtYWlsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlucHV0LWVtYWlsJyk7XHJcblxyXG4gIGZvciAobGV0IGlucHV0UGhvbmUgb2YgaW5wdXRzUGhvbmUpIHtcclxuICAgIC8vINC80LDRgdC60Lgg0LLQstC+0LTQsFxyXG4gICAgSW5wdXRtYXNrKHsgbWFzazogJys3ICg5OTkpIDk5OS05OS05OScgfSkubWFzayhpbnB1dFBob25lKTtcclxuXHJcbiAgICAvLyDQstCw0LvQuNC00LDRhtC40Y9cclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVxdWVzdC1mb3JtJykpIHtcclxuICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IG5ldyBKdXN0VmFsaWRhdGUoJyNyZXF1ZXN0LWZvcm0nLCB7XHJcbiAgICAgICAgZm9jdXNJbnZhbGlkRmllbGQ6IHRydWUsXHJcbiAgICAgICAgdmFsaWRhdGVCZWZvcmVTdWJtaXR0aW5nOiB0cnVlLFxyXG4gICAgICAgIC8vIGVycm9yc0NvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsaWVudC1lcnJvcicpLFxyXG4gICAgICAgIGVycm9yRmllbGRDc3NDbGFzczogJ2ludmFsaWRhdGVkJyxcclxuICAgICAgfSlcclxuICAgICAgICAuYWRkRmllbGQoJyNyZXF1ZXN0LWZpbycsIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgcnVsZTogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAn0JLQstC10LTQuNGC0LUg0KTQmNCeJyxcclxuICAgICAgICAgIH1cclxuICAgICAgICBdKVxyXG4gICAgICAgIC5hZGRGaWVsZCgnI3JlcXVlc3QtcGhvbmUnLCBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHJ1bGU6ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogYNCS0LLQtdC00LjRgtC1INC90L7QvNC10YBgLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsdWUsIGNvbnRleHQpIHtcclxuICAgICAgICAgICAgICBjb25zdCBudW1WYWx1ZSA9IGlucHV0UGhvbmUuaW5wdXRtYXNrLnVubWFza2VkdmFsdWUoKTtcclxuICAgICAgICAgICAgICByZXR1cm4gQm9vbGVhbihOdW1iZXIobnVtVmFsdWUpICYmIG51bVZhbHVlLmxlbmd0aCA9PT0gMTApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L3QvtC80LXRgCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0pXHJcbiAgICAgICAgLmFkZEZpZWxkKCcjcmVxdWVzdC1lbWFpbCcsIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgcnVsZTogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAn0JLQstC10LTQuNGC0LUgZS1tYWlsJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHJ1bGU6ICdlbWFpbCcsXHJcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogJ9Cd0LXQv9GA0LDQstC40LvRjNC90YvQuSDRhNC+0YDQvNCw0YInLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgLy8gdmFsaWRhdGlvbi5yZXZhbGlkYXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
