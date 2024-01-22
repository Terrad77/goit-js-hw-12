'use strict';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.form');
const input = document.querySelector('#input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
loader.style.display = 'none';

//initialize simpleLightbox
let modal = new simpleLightbox('ul.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

// особистий ключ доступу
const apiKey = '41494285-2be0c6d487dc7750955372a82';
// global variable for save user input
let query = '';

// Pixabay API підтримує пагінацію та надає параметри page і per_page.
let page = 1; // Початкове значення параметра 'page' повинно бути 1
const perPage = 40; // кількість зображень per_page
// Поки в галерії нема зображень, кнопка повинна бути прихована.
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

// object of URLSearchParams - iterator
// const searchParams = new URLSearchParams({
//   key: `${apiKey}`,
//   q: query,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
// page: `${page}`,
// per_page: `${perPage}`,
// });

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

form.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1; // повернененя початкового значення page, при пошуку за новим ключовим словом
  gallery.innerHTML = ''; //очищення розмітки gallery
  loadMoreBtn.style.display = 'none'; // Hide Load more button on new search
  query = input.value.trim(); // Get user input

  if (query === '') return; // перевірка на порожній рядок або пробіли
  loader.style.display = 'block'; //show loader
  input.value = ''; //reset user input

  try {
    const response = await axios.get(url, {
      params: getSearchParams(),
    });

    loader.style.display = 'none';
    const data = response.data;

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
    const imgs = data.hits.reduce(
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

    // add murkup to DOM
    gallery.insertAdjacentHTML('beforeend', imgs);
    // Show Load more button if more images available
    if (data.hits.length >= perPage) {
      loadMoreBtn.style.display = 'block';
    }
    //Після додавання нових елементів до списку зображень на екземплярі SimpleLightbox викликається метод refresh()
    modal.refresh();
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      message: error.message,
      color: 'red',
      position: 'topCenter',
    });
    console.error('Error fetching data:', error);
  } finally {
    // Елемент loader краще контролювати всередині блоків try-catch, щоб завжди приховувати його після завершення або невдалої завершення виклику API, щоб уникнути проблем з UI.
    loader.style.display = 'none';
  }
});

// Event listener for Load more button
loadMoreBtn.addEventListener('click', async () => {
  loader.style.display = 'block';
  // З кожним наступним запитом page необхідно збільшити на 1
  page++;

  try {
    const response = await axios.get(url, {
      params: getSearchParams(),
    });

    const data = response.data;

    if (data.totalHits <= perPage * page) {
      loadMoreBtn.style.display = 'none'; // Hide button if no more images
      throw iziToast.show({
        message: "We're sorry, but you've reached the end of search results.",
        theme: 'dark',
        backgroundColor: '#EF4040',
        titleColor: 'white',
        position: 'topRight',
      });
    }
    //var.1 using reduce()
    const imgs = data.hits.reduce(
      (
        html,
        { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
      ) =>
        html +
        `<li class="gallery-item"><div class="card">
          <a class="gallery-link" href="${largeImageURL}">
           <img class="gallery-image"
           src="${webformatURL}"
           alt="${tags}"
           />
          </a></div>         
          <div class="description">
            <p>Likes:<span>${likes}</span></p>
            <p>Views:<span>${views}</span></p>
            <p>Comments:<span>${comments}</span></p>
            <p>Downloads:<span>${downloads}</span></p>
          </div> 
        </li>`,
      ''
    );
    //var.2 using map().join()
    // const imgs = data.hits
    //   .map(
    //     ({
    //       webformatURL,
    //       largeImageURL,
    //       tags,
    //       likes,
    //       views,
    //       comments,
    //       downloads,
    //     }) =>
    //       `<li class="gallery-item">
    //   <div class="card">
    //     <a class="gallery-link" href="${largeImageURL}">
    //       <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
    //     </a>
    //   </div>
    //   <div class="description">
    //     <p>Likes:<span>${likes}</span></p>
    //     <p>Views:<span>${views}</span></p>
    //     <p>Comments:<span>${comments}</span></p>
    //     <p>Downloads:<span>${downloads}</span></p>
    //   </div>
    // </li>`
    //   )
    //   .join('');

    gallery.insertAdjacentHTML('beforeend', imgs);

    // var.1 виклик scrollToNextGroup() в блоці try, після вставки нових елементів в DOM
    scrollToNextGroup();
    modal.refresh();
    // В той час як galleryItemHeight обчислюється правильно за допомогою getBoundingClientRect(), обчислення прокрутки може бути покращено, щоб забезпечити бажану поведінку, яка, як правило, полягає у безшовному відображення нового вмісту.
    // Знайдемо перший новий елемент, який був доданий
    const firstNewGalleryItem = document.querySelector(
      '.gallery-item:nth-last-child(-n+' + perPage + ')'
    );
    // Прокрутимо до першого нового елементу, який був доданий
    if (firstNewGalleryItem) {
      firstNewGalleryItem.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  } catch (error) {
    // ловимо помилку від await, якщо проміс був відхилений.
    loader.style.display = 'none';
    iziToast.error({
      message: error.message,
      color: 'red',
      position: 'topCenter',
    });
    console.error('Error fetching more data:', error);
  } finally {
    loader.style.display = 'none';
  }
});

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
