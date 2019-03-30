

export default class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`] || ``;
    this.titleOriginal = data[`film_info`][`alternative_title`] || ``;
    this.rating = data[`film_info`][`total_rating`];
    this.releaseDate = data[`film_info`][`release`][`date`];
    this.duration = data[`film_info`][`runtime`] * 60000;
    this.genre = new Set(data[`film_info`][`genre`]);
    this.picture = data[`film_info`][`poster`].slice(15, -4);
    this.description = data[`film_info`][`description`] || ``;
    this.actors = data[`film_info`][`actors`];
    this.director = data[`film_info`][`director`] || ``;
    this.writers = data[`film_info`][`writers`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.age = data[`film_info`][`age_rating`];
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isInWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.userRating = parseFloat(data[`user_details`][`personal_rating`]).toFixed();
    this.comments = data[`comments`] || [];
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

  toRAW() {
    return {
      'id': this.id,
      'user_details': {
        'already_watched': this.isWatched,
        'watchlist': this.isInWatchlist,
        'favorite': this.isFavorite,
        'personal_rating': this.userRating,
      },
      'comments': this.comments,
    };
  }
}
