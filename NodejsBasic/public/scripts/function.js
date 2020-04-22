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

function showEduLevel(eduNum) {
  var eduLevel = "";
  if (eduNum == '0') eduLevel = "Any Level";
  else if (eduNum == '1') eduLevel = "Pre-School";
  else if (eduNum == '2') eduLevel = "Elementary-School";
  else if (eduNum == '3') eduLevel = "Middle-School";
  else if (eduNum == '4') eduLevel = "High-School";
  else if (eduNum == '5') eduLevel = "Bachelor";
  document.write(eduLevel);
}