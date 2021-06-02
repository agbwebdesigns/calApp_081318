/*****************
- maybe add a way to select entire columns(ex. all Tuesdays in a month) and rows(ex. a whole week in the month)

- be able to click on and highlight individual days and have a box that pops up that shows you the date on the box and the id of the box (ex. #a10)

- current time that updates every minute

- when clicking the current month button, it does not change the date to the new date if a new day has rolled over
****************/

var months= [["January", 31], ["February", 28, 29], ["March", 31], ["April", 30], ["May", 31], ["June", 30], ["July", 31], ["August", 31], ["September", 30], ["October", 31], ["November", 30], ["December", 31]];
var weekDays= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**************************************************
Date information, the object to get the day, date, month and year and store it as well as a function to check if it is a leap year and a function to see what the day of the week the first of the month falls on.
**************************************************/
var today= new Date();

var monthmonth= today.getMonth();
var date= today.getDate();           //the date
var day= today.getDay();             //the day of the week
var year= today.getFullYear();
var hour= today.getHours();
var minute= today.getMinutes();

/************************************************
************************************************/

var showingMonthCounter= monthmonth;         //This will be a counter that the function clickToNextMonth() will increment or decrement,it is the month that is currently is showing
var showingYearCounter= year;
var checkMonth;
var newStartingDay;            //this stores what the first day of the showing month is

var windowSizeOne = window.matchMedia("(max-width: 1200px) and (min-width: 991px)");
var windowSizeTwo = window.matchMedia("(max-width: 990px) and (min-width: 768px)");
var windowSizeThree = window.matchMedia("(max-width: 767px) and (min-width: 518px)");
var windowSizeFour = window.matchMedia("(max-width: 517px) and (min-width: 492px)");
var windowSizeFive = window.matchMedia("(max-width: 491px) and (min-width: 369px)");
var windowSizeSix = window.matchMedia("(max-width: 368px)");

/********************
This determines if the year is a leap year or not.
********************/
var leapYear;
$(() =>  {
  if (year%4===0 || year%4===0 && year%100===0 && year%400===0)  {
    leapYear=true;
  } else {
    leapYear=false;
  }
});

/***********************
This determines what day of the week the first day of the current month falls on based on the day and date that it is today.
*********************/
function dayCounter(day, date)  {
  var a=day;
  var b=date;
    function counter() {
      if (b===1)  {             //if the date is the first of the month, 
        newStartingDay= a;
        return a;               //then return what day of the week it is
      } else if ((b-7)>7)  {    //else if the date is greater than the 7th
        b-=7;                   //then subtract 7
      } else {
        a-=1;                   //else if the date is less than the 7th, subtract from the day and the day by 1 until b is = to 1.
        b-=1;
        if (a===-1)  {          //else if the day is equal to -1, then add 7 to the a variable making it equal to 6 or saturday.
          a+=7;
        }
      }
      return counter();
    }
  counter();
}
dayCounter(day, date);

/*****************************
Get the first day of the next month.
This should be it's own internal clicker that keeps track of the starting days and the corresponding months.  You should be able to go forward or backward.  There need to be tracker variables that keep track of the current month start day
********************************/

function firstDayOfNextMonthCounter(dayOfWeekOfFirstOfShowingMonth, showingMon)  {     //this function takes the day of the week that the first of the month falls on and the current month that is showing and enters it into 
                                                                           //the function to get the day of the week for the first of next month

  var nextMonth;               //This variable stores what the first day of the next month is going to be after the counter is run
  if (dayOfWeekOfFirstOfShowingMonth===0)  {
    nextMonth= months[showingMon][1];
  } else {
    nextMonth= dayOfWeekOfFirstOfShowingMonth + months[showingMon][1];             //this takes the first day of the month starting at the zero index and adds the number of days of the month to it minus 1 and that is the last day of
                                                                                            //the month
    //console.log(nextMonth);
  }
  function nextMonthFirstDayCounter() {
    if (nextMonth-7>=0)  {                      //this takes the last day of the month and checks to see if the last day of the month minus 7 is greater than or equal to 0
        nextMonth-=7;                           //then if it is greater than 0 it subtracts 7
        //console.log(nextMonth);
        return nextMonthFirstDayCounter();    //and keeps running until nextMonth-7 would be less than 0
    }
    //console.log(nextMonth);
    return nextMonth;
  }
  nextMonthFirstDayCounter();

  if (showingMonthCounter<11)  {                //This if statement is the counter for the showingMonthCounter variable, it keeps track of which month is the month that is showing on the page, not which month is the current month
        showingMonthCounter+=1;
      } else {
        showingMonthCounter-=11;
      }

  var showingMonChecker;                        //This counter advances the month forward

  if (showingMon==11)  {
    showingMonChecker= 0;
  } else {
    showingMonChecker= showingMon+1;
  }

  var monthData= { month: showingMonChecker, startDay: nextMonth};             //This variable will be sent back to ajax as the data to be turned into the new month  
  return monthData;
  //console.log(monthData);
}

/*
I would need to know the starting day of this month and figure out how many boxes last month would have needed so that I can start counting backwards at the right place.  Then I count backwards until I get to day 1 and which day that falls on and I will have the starting day and the month to be able to run monthBuilder().
*/
function firstDayOfLastMonthCounter()  {
  var daysInPreviousMonth;
  if (showingMonthCounter===0)  {
    daysInPreviousMonth= months[showingMonthCounter+11][1];
  } else {
    daysInPreviousMonth= months[showingMonthCounter-1][1];
  }
  var lastDayOfPreviousMonth;
  if (newStartingDay===0)  {
    lastDayOfPreviousMonth=6;
    console.log(lastDayOfPreviousMonth);
  } else {
    lastDayOfPreviousMonth=newStartingDay-1;
    console.log(lastDayOfPreviousMonth);
  }
  dayCounter(lastDayOfPreviousMonth, daysInPreviousMonth);
  if (showingMonthCounter===0)  {
    showingMonthCounter+=11;
    showingYearCounter-=1;
  } else {
    showingMonthCounter-=1;
  }
  var monthData= { month: showingMonthCounter, startDay: newStartingDay};             //This variable will be sent back to ajax as the data to be turned into the new month
  return monthData;
}

/*************************
This function needs to be named and it needs parameters so that I can enter either the dayCounter() information or the firstDayOfNextMonthCounter() information the that the proper month can be built on the page.
***********************/
function monthBuilder(mon, firstDay)  {
  
  var calDay= months[monthmonth][0] + " " + date + ", " + year;
  var calWidth= $("#calBacc").width();                  
  var tileSize= calWidth/7.43;                         //calWidth and tileSize determine the size of the boxes in the calendar
  
  /******************
  - This determines how many boxes there should be for the current month.
  The first if checks if the month is february and if the month starts on a sunday which will need 28 boxes, the next if checks to see if the current month has 31 days and if the month starts on a friday or if the month starts on a saturday and is not february because february will still only need 5 weeks.  This will create 42 boxes.  If none of these is the case then the box count will default to 35.
  *****************/
  var x;
  if (mon===1 && firstDay===0)  {
      x=28;
  } else if ((months[mon][1]===31 && firstDay===5) || (firstDay===6 && mon!==1))  {
      x=42;  
  } else {
    x=35;
  }
  
  function dayLabels()  {
    var p= 0;
    function moreDayLabels()  {
      var box= "<div class='dayTile nameTile'>" + weekDays[p] + "</div>";
      $("#calBacc").append(box);
      $(".dayTile").width(tileSize).height(20).css({"text-align": "center"});
    }
    function counter()  {
      if (p<weekDays.length)  {
        moreDayLabels();
        p++;
        return counter();
      }

    }
    counter();
  }
  dayLabels();
  /****************
  - This determines the parameters of the box.
  This function, when it is run, creates the box, adds it to the #calBacc box, gives it width based on the size of the containing box and gives each box an id, the first box starting with 0.
  ***************/
  var j=0;
  function boxAdd()  {
    var box= "<div class=\"dayTile\" id=\"a" + j + "\"></div>";
    $("#calBacc").append(box);
    $(".dayTile").width(tileSize);
    if (j<x)  {
      j++;
    }
  }
  
    /*******************
    - This creates all of the boxes.
  This function runs the boxAdd() function to add boxes based on the i counter.
  *****************/
  var i=0;
  function boxMaker()  {
    /***********************************/
    if (i<x)  {
      boxAdd();
      i++ 
      return boxMaker();
    }
  }
  boxMaker();
  
  /****************
  - This adds all of the days to the boxes.
  This adds the day of the month to the boxes starting with the first day of the month as determined by dayCounter().
  ****************/

  function numberAdder(day)  {
    var k=0;
    var l;              //counter for the last days of the previous month on the next months calendar
    var m=0;            //counter for the days before the first day of the month starting with the #a0 box up to the ("#a" + day) box
    var daysInMonth= months[mon][1];
    var daysInPreviousMonth;
    if (mon===0)  {
      daysInPreviousMonth= months[mon+11][1];
    } else {
      daysInPreviousMonth= months[mon-1][1];
    }
    
    if (day!==0)  {     //if the month doesn't start with sunday
        l=daysInPreviousMonth-day;            //then l= how many days in the last month - the start day of the current month ex. 31 days in october, nov. starts on day 3, or wednesday, so l= 28
      }
    function previousMonthDays()  {              //this adds the numbered days of the previous month to the calendar
      if (l<daysInPreviousMonth)  {
        l++;
      }
      var writeDate= "<p>" + l + "</p>";
      if (m!==day)  {
        $("#a" + m).html(writeDate).addClass("oddDays");
        m++;
        return previousMonthDays();
      }
    }
    previousMonthDays();

    function currentMonthDays(day)  {              //this adds the numbered days of the current month to the calendar
      if (k<daysInMonth)  {
        k++;
        var writeDate= "<p>" + k + "</p>";
        $("#a" + day).html(writeDate);
        day++;
        return currentMonthDays(day);
      }
    }
    currentMonthDays(day);

    var n=1;
    var o= day+daysInMonth;
    function nextMonthDays()  {               ////this adds the numbered days of the next month to the calendar
      var writeDate= "<p>" + n + "</p>";
      n++;
      if (o<x) {
        $("#a" + o).html(writeDate).addClass("oddDays");
        o++;
        return nextMonthDays();
      }
    }
    nextMonthDays();
  }
  numberAdder(firstDay);
  
  /*******************************
  This will add the first days of the next month to the end of the calendar month
  ******************************/

  function endOfMonthDays()  {
    if (firstDay+daysInMonth<x)  {

    }
  }

  /***********************
  This figures out what day it is and then highlights that day.
  *************************/
  
  dayHighlight(newStartingDay+date-1);

  /***********************
  This displays the showing month and year.  I might need to check the screen size when this function runs and if less than 517px then the font-size of the h3 tag needs to be reduced here instead of the aboutFunc function
  *************************/
  $(function()  {
    $("#date h3").html("<h3>" + months[showingMonthCounter][0] + "  |  " + showingYearCounter + "</h3>");
  });

}

monthBuilder(monthmonth, newStartingDay);
aboutFunc(windowSizeOne, windowSizeTwo, windowSizeThree, windowSizeFour, windowSizeFive, windowSizeSix);
checkMonth= monthmonth;  //this sets checkMonth to the current month the first time the monthBuilder is run so if the screen is resized on the current month the right month gets built

/***********************
  This takes what day it is and then adds the .today class to todays box on the calendar to highlight that day.
  *************************/
function dayHighlight(dayHigh)  {
  $("#a" + dayHigh).addClass("today");
}

/***********************
  This figures out what day it is and then removes the .today class from todays box on the calendar.
  *************************/
function removeDayHighlight(dayHigh)  {
  $("#a" + dayHigh).removeClass("today");
}

/***********************
This switches to the next month, august at this point since that is fixed in the json file, I need to be able to send the json file the month+1 data and the firstDayOfNextMonthCounter() data so that the next month can be loaded indefinitely.
Then i need the reverse to go to the previous months.

I need to pass in the current month so I can use it in the currentMonth variable
***********************/

$("#nextMonthButton").on('click',async() =>  {
  const {month,startDay}=firstDayOfNextMonthCounter(newStartingDay, showingMonthCounter);
  date= today.getDate();
  $("#calBacc").empty();                       //clears the screen
  monthBuilder(month, startDay);     //runs month builder and builds the new months calendar
  aboutFunc(windowSizeOne, windowSizeTwo, windowSizeThree, windowSizeFour, windowSizeFive, windowSizeSix);  //this function helps display the calendar correctly based on the screen size
  removeDayHighlight(newStartingDay+date-1);     //unhighlights the current day since it is now showing next month
  checkMonth= monthmonth;
  if(checkMonth===0)  {
    showingYearCounter++;                      //increments the showing year if necessary
  }
  if (checkMonth===month)  {
    newStartingDay= startDay;
    dayHighlight(newStartingDay+date-1);
  }
  newStartingDay= startDay;               //this sets what the new starting day for the showing month is when the nextMonthButton is clicked
});

function currentMonthData(mon, startDay)  {
  var currentMonthData= { month: mon, startDay: startDay};             //This variable will be sent back to ajax as the data to be turned into the new month
  return currentMonthData;
}

$("#currentMonthButton").on('click',async() =>  {
  dayCounter(day, date);         //this runs dayCounter() again to change the newStartingDay variable back to the starting day for the current month
  const {month,startDay}=currentMonthData(monthmonth, newStartingDay);
  console.log(newStartingDay);
  date= today.getDate();
  $("#calBacc").empty();
  monthBuilder(month, startDay);
  aboutFunc(windowSizeOne, windowSizeTwo, windowSizeThree, windowSizeFour, windowSizeFive, windowSizeSix);
  checkMonth= month;
  newStartingDay= startDay;
  showingMonthCounter= month;                      //resets the showingMonthCounter to the current month
  showingYearCounter= year;                        //resets the showingYearCounter to the current year
});

$("#previousMonthButton").on('click',async() =>  {
  const {month,startDay}=firstDayOfLastMonthCounter();
  date= today.getDate();
  $("#calBacc").empty();
  monthBuilder(month,startDay);
  aboutFunc(windowSizeOne, windowSizeTwo, windowSizeThree, windowSizeFour, windowSizeFive, windowSizeSix);
  checkMonth= month;
  if (checkMonth===monthmonth)  {
    newStartingDay= startDay;
    dayHighlight(newStartingDay+date-1)
  } else {
    newStartingDay= startDay;
    removeDayHighlight(newStartingDay+date-1);     //unhighlights the current day since it is now showing next month
  }
});

/***************************
css changes for the screen resize function
******************************/

function aboutFunc(windowSizeOne, windowSizeTwo, windowSizeThree, windowSizeFour, windowSizeFive) {  //this function checks the size of the screen and changes some css accordingly
console.log("aboutFunc running");
    if (windowSizeOne.matches) { // If media query matches against y
      console.log("windowSizeOne test");
      $(".head").removeClass("fontsize767");
      $(".head").addClass("fontsizeabove767");
      $(".dayTile").height(125);
      $(".nameTile").height(20);
    } else if (windowSizeTwo.matches)  {
      console.log("windowSizeTwo test");
      $(".head").removeClass("fontsize767");
      $(".head").addClass("fontsizeabove767");
      $(".dayTile").height(100);
      $(".nameTile").height(20);
    } else if (windowSizeThree.matches)  {
      console.log("windowSizeThree test");
      $(".head").addClass("fontsize767");
      $(".dayTile").height(75);
      $(".nameTile").height(20);
    } else if (windowSizeFour.matches)  {
      console.log("windowSizeFour test");
      $(".head").addClass("fontsize767");
      $(".head h3").css({"font-size": "1em"});
      //$(".head h3").addClass("newheadh3");
      $(".dayTile").height(75);
      $(".nameTile").height(20);
    } else if (windowSizeFive.matches)  {
      console.log("windowSizeFive test");
      //$(".head").addClass("fontsize767");
      //$(".head h3").removeClass("fontsize767");
      $(".head h3").css({"font-size": ".75em"});
      $(".dayTile").height(60).css({"font-size": ".75em"});
      $(".nameTile").height(20);
    } else if (windowSizeSix.matches)  {
      console.log("windowSizeSix test");
      $(".head h3").css({"font-size": ".75em"});
      $(".dayTile").height(45).css({"font-size": ".75em"});
      $(".nameTile").height(20);
    }
}

/************************
showingMonthData runs when the window resize function is run to redisplay the current showing month
**************************/

function showingMonthData(mon, startDay)  {
  console.log("here ------------>" + mon + "," + startDay);
  var showingMonthData= { month: mon, startDay: startDay};             //This variable will be sent back to ajax as the data to be turned into the new month
  return showingMonthData;
}

/*************************
the window resize function runs and rebuilds the window to display correctly for the new screen size
****************************/

$( window ).on('resize',async() => {
  const {month,startDay}=showingMonthData(checkMonth, newStartingDay);
  date= today.getDate();
  $("#calBacc").empty();  //erase the screen
  monthBuilder(month, startDay);  //rebuild the month
  aboutFunc(windowSizeOne, windowSizeTwo, windowSizeThree, windowSizeFour, windowSizeFive, windowSizeSix);  //run aboutFunc to display at the correct screen size
  console.log("before" + " " + checkMonth);
  checkMonth= monthmonth;  //sets checkMonth to the showing month
  console.log("after" + " " + checkMonth);
  console.log("before" + " " + newStartingDay);
  newStartingDay= startDay;  //sets newStartingDay to the showing month starting day
  console.log("after" + " " + newStartingDay);
  showingMonthCounter= checkMonth;                      //resets the showingMonthCounter to the current month
  showingYearCounter= year;                        //resets the showingYearCounter to the current year
  if (checkMonth !== month)  {
    removeDayHighlight(newStartingDay+date-1);     //unhighlights the current day if it is not the current month
  }
});