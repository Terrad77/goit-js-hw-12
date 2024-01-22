'use strict';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

// const input = document.querySelector('#input');

const loader = document.querySelector('.loader');
loader.style.display = 'none';

//initialize simpleLightbox
let modal = new simpleLightbox('ul.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

// Pixabay API підтримує пагінацію та надає параметри page і per_page.
let page = 1; // Початкове значення параметра 'page' повинно бути 1
const perPage = 40; // кількість зображень per_page

// ---------------using instance of axis-------------------//
//create instance of axios
const api = axios.create({
  baseURL: 'https://pixabay.com',
  params: {
    key: '41494285-2be0c6d487dc7750955372a82',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  },
});

const searchForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector(
  'button[data-action="load-more-btn"]'
);
// Поки в галерії нема зображень, кнопка повинна бути прихована.
loadMoreBtn.style.display = 'none';

//функція рендерингу карток
function renderImgs(images = []) {
  //створюємо з масиву images деструктурувавши його, розмітку
  const markup = images.reduce(
    (
      html,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      html +
      `<li class="gallery-item">
        <div class="card">
          <a class="gallery-link" href="${largeImageURL}">
           <img class="gallery-image"
           src="${webformatURL}"
           alt="${tags}"
           />
          </a>
          </div>          
          <div class="description">
          <p>Likes:<span>${likes}</span></p>
          <p>Views:<span>${views}</span></p>
          <p>Comments:<span>${comments}</span></p>
          <p>Downloads:<span>${downloads}</span></p>
          </div> 
        </li>`,
    ''
  );
  //додаемо розмітку у DOM
  gallery.insertAdjacentHTML('beforeend', markup);

  scrollToNextGroup(); //виклик ф-ції плавної прокрутки
  modal.refresh();
}

//функція на запит, що стягує картки
const getImgs = async params => {
  try {
    const response = await api.get(`/api/`, { params });
    loader.style.display = 'block';
    return response.data;
  } catch (erorr) {
    if (data.hits.length === 0) {
      throw iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        theme: 'dark',
        backgroundColor: '#EF4040',
        titleColor: 'white',
        position: 'topRight',
      });
    }
    // console.erorr(error);
  } finally {
    loader.style.display = 'none';
  }
};

//функція з Замиканням
//здатність батьківської ф-ції зберігати свій стан за допомогою логики яка ще буде використовуватись всередені ф - ції.
const createGetImgsReguest = q => {
  //тут робимо замикання, збереження стану змінних для використання у дочерній (внутрішней) функції у return
  let page = 1; //початкове значення сторінки
  let isLastPage = false; // як що це остання сторінка - виходимо
  const per_page = 40; //кількість елементів на ever сторінці

  //функція повертає нову функцію, яка працює з тими змінними
  return async () => {
    try {
      //як що це остання сторінка: isLastPage = true
      if (isLastPage)
        return iziToast.show({
          message: "We're sorry, but you've reached the end of search results.",
          theme: 'dark',
          backgroundColor: '#EF4040',
          titleColor: 'white',
          position: 'topRight',
        });

      const { hits, totalHits } = await getImgs({ page, per_page, q });

      if (page >= Math.ceil(totalHits / per_page)) {
        isLastPage = true;
      }
      page += 1;
      return hits;
    } catch (error) {
      console.error(error);
    }
  };
};

// function for update SearchParams
const getSearchParams = () =>
  new URLSearchParams({
    key: apiKey,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });
// стандартні налаштування axios.defaults базова адреса
axios.defaults.baseURL = 'https://pixabay.com';
const url = `/api/`;

// const fetchImgsWithRender = async imgsFetcher => {
//   const images = await imgsFetcher();
//   renderImgs(images);
// };

//create змінну зовні
let doFetch = null;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  //як що змінна doFetch є, тобто вже була створена і було додано loadMoreBtn.addEventListener, видаляємо listener
  if (doFetch != null) {
    loadMoreBtn.removeEventListener('click', doFetch);
    doFetch = null; // про всяк випадок можемо видалити і функцію
  }

  const data = new FormData(event.currentTarget);

  // використовуємо form.elements, щоб отримати колекцію всіх елементів форми. Потім ми перетворюємо цю колекцію в масив (за допомогою Array.from) і фільтруємо лише ті елементи, які мають властивість name. Нарешті, ми використовуємо метод map, щоб створити масив імен полів форми.
  const form = document.querySelector('.form');
  const inputNames = Array.from(form.elements)
    .filter(element => element.name)
    .map(element => element.name);
  console.log(inputNames);

  const query = data.get('query'); //Функція data.get призначена для отримання значень полів форми за їхніми атрібутами name.
  // const query = input.value.trim(); // Get user input

  //очищення всіх попередних елементів у розмітці gallery перед новим пошуком
  gallery.innerHTML = '';

  //робимо load more через функцію із замиканням
  const fetchImgs = createGetImgsReguest(query);

  //в змінну додаємо функцію
  doFetch = async () => {
    const images = await makePromiseWithLoader({
      promise: fetchImgs,
      spinner: loader,
    });
    loader.style.display = 'block'; //show loader

    // //зробити запит на стягування елементів
    // const images = await fetchImgs();
    // loader.style.display = 'none'; //hide loader
    //відрендерити images
    renderImgs(images);
    loader.style.display = 'none'; //hide loader
  };

  await makePromiseWithLoader({
    promise: doFetch,
    spinner: loader,
  });

  loadMoreBtn.style.display = 'none'; // Hide Load more button on new search
  await doFetch();
  loadMoreBtn.style.display = 'block'; // show Load more button

  //після виконання doFetch даємо змогу клікати loadMoreBtn
  loadMoreBtn.addEventListener('click', doFetch);
});

//функція яка приймає проміс та елемент спінера
const makePromiseWithLoader = async ({ promise, spinner }) => {
  loader.style.display = 'block'; //show loader
  const response = await promise();
  loader.style.display = 'none'; //hide loader
  return response;
};

// page = 1; // повернененя початкового значення page, при пошуку за новим ключовим словом

// loadMoreBtn.style.display = 'none'; // Hide Load more button on new search
// query = input.value.trim(); // Get user input

// if (query === '') return; // перевірка на порожній рядок або пробіли

// input.value = ''; //reset user input

// try {
//   const response = await axios.get(url, {
//     params: getSearchParams(),
//   });

//   loader.style.display = 'none';
//   const data = response.data;

//   if (data.hits.length === 0) {
//     throw iziToast.show({
//       message:
//         'Sorry, there are no images matching your search query. Please try again!',
//       theme: 'dark',
//       backgroundColor: '#EF4040',
//       titleColor: 'white',
//       position: 'topRight',
//     });
//   }

// add murkup to DOM
//   gallery.insertAdjacentHTML('beforeend', renderImgs);
//   // Show Load more button if more images available
//   if (data.hits.length >= perPage) {
//     loadMoreBtn.style.display = 'block';
//   }
//   //Після додавання нових елементів до списку зображень на екземплярі SimpleLightbox викликається метод refresh()
//   modal.refresh();
// } catch (error) {
//   loader.style.display = 'none';
//   iziToast.error({
//     message: error.message,
//     color: 'red',
//     position: 'topCenter',
//   });
//   console.error('Error fetching data:', error);
// } finally {
// Елемент loader краще контролювати всередині блоків try-catch, щоб завжди приховувати його після завершення або невдалої завершення виклику API, щоб уникнути проблем з UI.
//     loader.style.display = 'none';
//   }
// });

// Event listener for Load more button
// loadMoreBtn.addEventListener('click', async () => {
//   loader.style.display = 'block';
//   // З кожним наступним запитом page необхідно збільшити на 1
//   page++;

//   try {
//     const response = await axios.get(url, {
//       params: getSearchParams(),
//     });

//     const data = response.data;

//     if (data.totalHits <= perPage * page) {
//       loadMoreBtn.style.display = 'none'; // Hide button if no more images
//       throw iziToast.show({
//         message: "We're sorry, but you've reached the end of search results.",
//         theme: 'dark',
//         backgroundColor: '#EF4040',
//         titleColor: 'white',
//         position: 'topRight',
//       });
//     }

//     const imgs = data.hits.reduce(
//       (
//         html,
//         { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
//       ) =>
//         html +
//         `<li class="gallery-item"><div class="card">
//           <a class="gallery-link" href="${largeImageURL}">
//            <img class="gallery-image"
//            src="${webformatURL}"
//            alt="${tags}"
//            />
//           </a></div>
//           <div class="description">
//             <p>Likes:<span>${likes}</span></p>
//             <p>Views:<span>${views}</span></p>
//             <p>Comments:<span>${comments}</span></p>
//             <p>Downloads:<span>${downloads}</span></p>
//           </div>
//         </li>`,
//       ''
//     );

//     gallery.insertAdjacentHTML('beforeend', renderImgs);

// var.1 виклик scrollToNextGroup() в блоці try, після вставки нових елементів в DOM

// В той час як galleryItemHeight обчислюється правильно за допомогою getBoundingClientRect(), обчислення прокрутки може бути покращено, щоб забезпечити бажану поведінку, яка, як правило, полягає у безшовному відображення нового вмісту.

//Scroll to position -n+' + perPage + '
// Знайдемо перший новий елемент, який був доданий, Вибрати елементи з класом .gallery-item з кінця (з останнього) до елемента, який знаходиться на відстані perPage = 40 від кінця. Тут perPage є змінною, і вираз -n+40 :nth-last-child(-n+40) вибере останні 40 елементів, або іншим чином - кожний сороковий елемент, починаючи з останнього елемента і йдучи до початку контейнера.
//     const firstNewGalleryItem = document.querySelector(
//       '.gallery-item:nth-last-child(-n+' + perPage + ')'
//     );
//     // Scroll до першого new елементу, який був доданий
//     if (firstNewGalleryItem) {
//       firstNewGalleryItem.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   } catch (error) {
//     // ловимо помилку від await, якщо проміс був відхилений.
//     loader.style.display = 'none';
//     iziToast.error({
//       message: error.message,
//       color: 'red',
//       position: 'topCenter',
//     });
//     console.error('Error fetching more data:', error);
//   } finally {
//     loader.style.display = 'none';
//   }
// });

//глобальне оголошення функція плавної прокрутки scrollToNextGroup
const scrollToNextGroup = () => {
  const firstGalleryItem = document.querySelector('.gallery-item');
  //отримай у коді висоту однієї карточки галереї, використовуючи функцію getBoundingClientRect.
  const galleryItemHeight = firstGalleryItem.getBoundingClientRect().height;
  // The method scrolls the document into the window by the specified amount. сінтаксіс: scrollBy(x - coord, y - coord)  або   scrollBy({options});
  window.scrollBy({
    top: galleryItemHeight * 2,
    behavior: 'smooth',
  });
};

//var.2 виклик функції плавної прокрутки поза блоком try, після події DOMContentLoaded – DOM готовий.
// document.addEventListener('DOMContentLoaded', () => {scrollToNextGroup();});

//var.3 виклик функції плавної прокрутки поза блоком try, після подіїа window.onload - сторінка повністю завантажена, включаючи усі вкладені ресурси (зображення, стилі, скрипти і т.д.).
//window.addEventListener('load', () => {scrollToNextGroup();});
