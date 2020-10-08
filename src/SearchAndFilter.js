class SearchAndFilter {
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits) {

    var courses_credit = [];

    for (let i = 0; i < courses.length; i++) {
      if(!minimumCredits || (courses[i].credits >= minimumCredits)) {
        if (!maximumCredits || (courses[i].credits <= maximumCredits)) {
          courses_credit.push(courses[i]);
        }
      }
    }



    var courses_subject = [];

    if (subject !== "All") {
      for (let i = 0; i < courses_credit.length; i++) {
        if (courses_credit[i].subject === subject) {
          courses_subject.push(courses_credit[i]);
          console.log("if");
        }
        else {
          console.log("else ")
        }
      }
    }
    else {
      courses_subject = courses_credit;
    }



    var courses_search = [];

    if (search) {
      for (let i = 0; i < courses_subject.length; i++) {
        for (let j = 0; j < courses_subject[i].keywords.length; j++) {
          if (courses_subject[i].keywords[j].includes(search)) {
            courses_search.push(courses_subject[i]);
            break;
          }
        }
      }
    } 
    else {
      courses_search = courses_subject;
    }

    return courses_search;
  }
}

export default SearchAndFilter;
