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

//initialize object of simpleLightbox
let modal = new simpleLightbox('ul.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

// пангінація
// Pixabay API підтримує пагінацію та надає параметри page і per_page.
let page = 1; // Початкове значення параметра 'page' повинно бути 1
const perPage = 40; // кількість зображень per_page
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none'; // Поки в галерії нема зображень, кнопка повинна бути прихована.
let query = ''; // global variable for save user input

// стандартні налаштування axios.defaults
axios.defaults.baseURL = 'https://pixabay.com'; // базова адреса
//Axios автоматично додає заголовок із значенням до кожного запиту
axios.defaults.headers.common['key'] = '41494285-2be0c6d487dc7750955372a82';

form.addEventListener('submit', async event => {
  //скидання завантаження за Default
  event.preventDefault();
  gallery.innerHTML = ''; //очищення розмітки gallery
  page = 1; // повернененя початкового значення page, при пошуку за новим ключовим словом
  loadMoreBtn.style.display = 'none'; // Hide Load more button on new search

  query = input.value.trim(); // Отримати значення input і видалити зайві пробіли
  // Якщо введено порожній рядок або лише пробіли, нічого не відбувається
  if (query === '') {
    return;
  }
  loader.style.display = 'block'; //show loader
  input.value = ''; //reset user input
  try {
    const response = await axios.get('/api/', {
      params: {
        // key: '41494285-2be0c6d487dc7750955372a82',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage, // Set numbers of pictures on page
        page: 1, // Set initial number of page
      },
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

    //оновлення екземпляра SimpleLightbox кожного разу після додавання нових зображень
    modal.refresh();
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      message: error.message,
      color: 'red',
      position: 'topCenter',
    });
    console.error('Error fetching data:', error);
  }
});

// Event listener for Load more button
loadMoreBtn.addEventListener('click', async () => {
  //show loader
  loader.style.display = 'block';
  try {
    const response = await axios.get('/api/', {
      params: {
        key: '41494285-2be0c6d487dc7750955372a82',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: ++page, // Increment page number for next group of images
      },
    });
    //hide loader
    loader.style.display = 'none';
    const data = response.data;

    if (data.totalHits <= perPage * page) {
      loadMoreBtn.style.display = 'none'; // Hide button if no more images
      throw iziToast.show({
        message: "We're sorry, but you've reached the end of search results.",
        theme: 'dark',
        backgroundColor: 'navy',
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

    gallery.insertAdjacentHTML('beforeend', imgs);

    // var.1 виклик scrollToNextGroup() в блоці try, після вставки нових елементів в DOM
    scrollToNextGroup();

    modal.refresh();
  } catch (error) {
    // catch — ловить помилку від await, якщо проміс був відхилений.
    loader.style.display = 'none';
    iziToast.error({
      message: error.message,
      color: 'red',
      position: 'topCenter',
    });
    console.error('Error fetching more data:', error);
  }
});

// // Функція для плавної прокрутк
const scrollToNextGroup = () => {
  //отримай у коді висоту однієї карточки галереї, використовуючи функцію getBoundingClientRect.
  const firstGalleryItem = document.querySelector('.gallery-item');
  const galleryItemHeight = firstGalleryItem.getBoundingClientRect().height;

  // The method scrolls the document into the window by the specified amount. сінтаксіс: scrollBy(x - coord, y - coord)  або   scrollBy({options});
  window.scrollBy({
    top: galleryItemHeight * 2, // scroll на дві висоти galleryItemHeight
    behavior: 'smooth', // Плавна анімація прокрутки
  });
};

//var.2 виклик функції поза блоком try, після події DOMContentLoaded – DOM готовий,
//window.addEventListener('load', () => {scrollToNextGroup();});

//var.3 виклик функції поза блоком try, після подіїа window.onload - сторінка повністю завантажена, включаючи усі вкладені ресурси (зображення, стилі, скрипти і т.д.).
// document.addEventListener('DOMContentLoaded', () => {scrollToNextGroup();});
