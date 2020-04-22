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

function showEdu(eduNum) {
  var eduLevel = "";
  if (eduNum == 0) eduLevel = "Any Level";
  else if (eduNum == 1) eduLevel = "Pre-School";
  else if (eduNum == 2) eduLevel = "Elementary-School";
  else if (eduNum == 3) eduLevel = "Middle-School";
  else if (eduNum == 4) eduLevel = "High-School";
  else if (eduNum == 5) eduLevel = "Bachelor";
  return eduLevel;
}

function showDay(dayNum) {
  var dayText = "";
  if (dayNum == 0) dayText = "Sunday";
  else if (dayNum == 1) dayText = "Monday";
  else if (dayNum == 2) dayText = "Tuesday";
  else if (dayNum == 3) dayText = "Wednesday";
  else if (dayNum == 4) dayText = "Thursday";
  else if (dayNum == 5) dayText = "Friday";
  else if (dayNum == 6) dayText = "Saturday";
  return dayText;
}

function showTime(timeNum) {
  var timeText = "";
  if (timeNum == 0) timeText = "Morning";
  else if (timeNum == 1) timeText = "Afternoon";
  else if (timeNum == 2) timeText = "After School";
  else if (timeNum == 3) timeText = "Evening";
  return timeText;
}