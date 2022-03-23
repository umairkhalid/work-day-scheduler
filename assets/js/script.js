// gets data for the header date
var now = moment();

// test in non-standard hours
var nowHour24 = now.format('H');
var nowHour12 = now.format('h');

$(document).ready(function() {
    
    getDate();
    displaySchedule();
    
});

function displaySchedule(){

    //get the data from local storage
    getStoredData()

    // build calendar by row for fix set of hours
    for (var hour = 9; hour <= 17; hour++) {
        // index for array use offset from hour
        var index = hour - 9;

        var containerEl = $(".container");

        // build row components
        var rowEl = $('<div>');
        rowEl.addClass('row');
        // rowEl.addClass('plannerRow');
        rowEl.attr('hour-index', hour);

        // format hours for display
        let displayHour = 0;
        let ampm = "";
        if (hour > 12) { 
        displayHour = hour - 12;
        ampm = "pm";
        } else {
        displayHour = hour;
        ampm = "am";
        }

        // Start building Time box portion of row
        let timeEl = $('<div>');
        timeEl.addClass('col-1 border text-right hour');
        
        // populate timeBox with time
        timeEl.text(`${displayHour} ${ampm}`);

        // input portion of row
        var textEl = $('<textarea>');

        textEl.attr('id',`input-${index}`);
        textEl.attr('hour-index',index);
        textEl.addClass('user-entry col border description');

        // access index from data array for hour 
        textEl.val( planTextArr[index] );

        // START building save portion of row
        let buttonEl = $('<button>');
        buttonEl.addClass('far fa-save saveBtn');
        buttonEl.attr('id',`saveid-${index}`);
        buttonEl.attr('save-id',index);
        
        //add elements to the planner row
        rowEl.append(timeEl, textEl, buttonEl);

        // set row color based on time
        updateRowColor(textEl, hour);

        // add row to planner container
        containerEl.append(rowEl);    
    };

    // saves to local storage
    // conclick function to listen for user clicks on plan area
    $(document).on('click', 'button', function(event) {
        event.preventDefault();  

        let $index = $(this).attr('save-id');

        let inputId = '#input-'+$index;
        let $value = $(inputId).val();

        planTextArr[$index] = $value;

        storeData()
    });  

}

// function to update row color
function updateRowColor (hourRow, hour) {
        
    if ( hour < nowHour24) {
        hourRow.addClass('past');
    } else if ( hour > nowHour24) {
        hourRow.addClass('future');
    } else {
        hourRow.addClass('present');
    }
};

function getDate() {
    var currentDate = now.format('ddd, MMM Do YYYY');
    $("#currentDay").text(currentDate);
}

function storeData() {
    localStorage.setItem("storedPlans", JSON.stringify(planTextArr));
}

function getStoredData() {
    var storedPlans = localStorage.getItem("storedPlans");

    // If plans were retrieved from localStorage, update the plan array to it
    if (storedPlans) {
        planTextArr = JSON.parse(storedPlans);
    }
}