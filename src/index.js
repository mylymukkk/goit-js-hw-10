import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const input = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const inputValue = event.target.value.trim();
  if (!inputValue) {
    clearInfo();
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      clearInfo();
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length >= 2 && data.length <= 10) {
        getList(data);
        return;
      }
      if (data.length === 1) {
        getInfo(data);
        return;
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearInfo;
    });
}

function getInfo(data) {
  const markupInfo = `<div class="wrap"><img class="flag" src="${
    data[0].flags.svg
  }" alt="${data[0].name.official}" width="40">
    <h1 class="title">${data[0].name.official}</h1></div>
    <ul>
      <li class="info-list__item"><span class="category">Capital: </span>${
        data[0].capital
      }</li>
      <li class="info-list__item"><span class="category">Population: </span>${
        data[0].population
      }</li>
      <li class="info-list__item"><span class="category">Languages: </span>${Object.values(
        data[0].languages
      )}</li>
    </ul>`;
  countryInfo.innerHTML = markupInfo;
}

function getList(data) {
  const markupList = data
    .map(
      country => `<li class="country-list__item">
        <img class="flag"
          src="${country.flags.svg}"
          alt="${country.name.official}"
          width="40"></img>
        ${country.name.official}
      </li>`
    )
    .join('');
  countryList.innerHTML = markupList;
}

function clearInfo() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
