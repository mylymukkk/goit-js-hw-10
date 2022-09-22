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
  const markupInfo = `<img src="${data[0].flags.svg}" alt="${
    data[0].name.official
  }" width="30">
    <h1>${data[0].name.official}</h1>
    <ul>
      <li>Capital: ${data[0].capital}</li>
      <li>Population: ${data[0].population}</li>
      <li>Languages: ${Object.values(data[0].languages)}</li>
    </ul>`;
  countryInfo.innerHTML = markupInfo;
}

function getList(data) {
  const markupList = data
    .map(
      country => `<li>
        <img
          src="${country.flags.svg}"
          alt="${country.name.official}"
          width="30"></img>
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
