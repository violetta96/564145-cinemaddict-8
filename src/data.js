import moment from 'moment';

const titles = [
  `Dark Star`,
  `Trust`,
  `Memory Box`,
  `Our Stars`,
  `Full Moons`,
  `Sun Don't Shine`,
  `Green`,
  `Dark Horse`,
  `More Than Four Hours`,
  `The Messenger`,
  `Blank Generation`,
  `Become an Artist`,
  `The Box`,
  `Family Business`,
  `Moving`,
];

const genres = new Set([
  `Comedy`,
  `Action`,
  `Crime`,
  `Adventure`,
  `Drama`,
  `Horror`,
  `Sci-fi`,
  `Musical`,
  `Western`,
  `Fantasy`,
  `Historical`,
  `Thriller`,
  `Romance`,
]);

const posters = [
  `accused`,
  `blackmail`,
  `blue-blazes`,
  `fuga-da-new-york`,
  `moonrise`,
  `three-friends`,
];

const countries = [
  `USA`,
  `UK`,
  `Spaine`,
  `Canada`,
  `Germany`,
  `Brazil`,
  `France`,
  `Italy`,
];

const directors = [
  `Samuel L. Jackson`,
  `Catherine Keener`,
  `Sophia Bush`,
  `Brad Bird`,
  `Jack Nicholson`,
  `Ralph Fiennes`,
  `Meryl Streep`,
  `Jodie Foster`,
];

const writers = [
  `Samuel L. Jackson`,
  `Catherine Keener`,
  `Sophia Bush`,
  `Brad Bird`,
  `Jack Nicholson`,
  `Ralph Fiennes`,
  `Meryl Streep`,
  `Jodie Foster`,
];

const actors = [
  `Samuel L. Jackson`,
  `Catherine Keener`,
  `Sophia Bush`,
  `Brad Bird`,
  `Jack Nicholson`,
  `Ralph Fiennes`,
  `Meryl Streep`,
  `Jodie Foster`,
];

const age = [
  `0`,
  `6`,
  `12`,
  `16`,
  `18`,
];

const sentences = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. `,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `,
];

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandomItem = (items) => items[getRandomNumber(0, items.length)];

const getRandomInt = (min, max) => Math.floor(Math.random() * (1 + max - min)) + min;

const getRandomDescription = (items) => {
  items.sort(() => Math.random() - 0.5);
  items = items.slice(0, getRandomInt(1, 3));

  return items;
};

const getRandomRating = () => {
  let ratingOne = getRandomInt(1, 9);
  let ratingTwo = getRandomInt(0, 9);
  let rating = ratingOne + `.` + ratingTwo;
  if (ratingOne === 1 && ratingTwo === 0) {
    rating = ratingOne + `` + ratingTwo;
  }
  return rating;
};

const getRandomItems = (items, num) => {
  let newArray = [...items];
  newArray.sort(() => Math.random() - 0.5);
  newArray = newArray.slice(0, num);

  return newArray;
};

export const card = () => ({
  title: getRandomItem(titles),
  rating: getRandomRating(),
  releaseDate: moment(`${getRandomInt(1, 12)}-${getRandomInt(1, 28)}-${getRandomInt(2000, 2019)}`, `MM-DD-YYYY`).format(`DD MMMM YYYY`),
  duration: getRandomInt(80, 200),
  genre: getRandomItems(genres, 3),
  picture: getRandomItem(posters),
  description: getRandomDescription(sentences),
  director: getRandomItem(directors),
  writer: getRandomItem(writers),
  actors: getRandomItems(actors, 3),
  country: getRandomItem(countries),
  age: getRandomItem(age),
  userRating: null,
  isWatched: false,
  isInWatchlist: false,
  isFavorite: false,
  comments: [
    {
      author: `Max Maxoveev`,
      date: new Date(),
      text: `Boring!`,
      emoji: `😴`,
    },
    {
      author: `Alex Nikiforov`,
      date: new Date(),
      text: `Awesome!`,
      emoji: `😀`,
    },
  ],
});

export const cardsData = (limit) => [...Array(limit).keys()].map(card);
