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

const genres = [
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
];

const posters = [
  `accused`,
  `blackmail`,
  `blue-blazes`,
  `fuga-da-new-york`,
  `moonrise`,
  `three-friends`,
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
  let newArray = items;
  newArray.sort(() => Math.random() - 0.5);
  newArray = newArray.slice(0, getRandomInt(1, 3));

  return newArray;
};

const getRandomRating = () => {
  let ratingOne = getRandomInt(1, 9);
  let ratingTwo = getRandomInt(0, 9);
  let newArray = ratingOne + `.` + ratingTwo;
  if (ratingOne === 1 && ratingTwo === 0) {
    newArray = ratingOne + `` + ratingTwo;
  }
  return newArray;
};

export default () => ({
  title: getRandomItem(titles),
  rating: getRandomRating(),
  year: getRandomInt(2000, 2019),
  duration: {
    'hour': getRandomInt(1, 3),
    'min': getRandomInt(0, 60),
  },
  genre: getRandomItem(genres),
  picture: {
    'src': `./images/posters/` + getRandomItem(posters) + `.jpg`,
    'alt': getRandomItem(posters),
  },
  description: getRandomDescription(sentences),
  comments: getRandomInt(0, 100),
});
