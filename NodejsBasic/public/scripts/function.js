'use script';

function showStars(rating) {
  var innerHtml = '';
  if (rating == '5') {
    innerHtml = `<label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='yellowStar'></label>`;
  } else if (rating == '4') {
    innerHtml = `<label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='greyStar'></label>`;
  } else if (rating == '3') {
    innerHtml = `<label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='greyStar'></label>
                <label class='greyStar'></label>`;
  } else if (rating == '2') {
    innerHtml = `<label class='yellowStar'></label>
                <label class='yellowStar'></label>
                <label class='greyStar'></label>
                <label class='greyStar'></label>
                <label class='greyStar'></label>`;
  } else {
    innerHtml = `<label class='yellowStar'></label>
                <label class='greyStar'></label>
                <label class='greyStar'></label>
                <label class='greyStar'></label>
                <label class='greyStar'></label>`;
  } 
  document.write(`<div class="tutor-rating">${innerHtml}</div>`);
}