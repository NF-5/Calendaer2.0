// Initializing variables
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentView = 'month';
let currentWeekStartDate = new Date(currentYear, currentMonth, 1);

//generates the month view of the calander
function makeCalendar(month, year) 
{
    const dayOne = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Calls the tbody element to store it within the calendarBody var
    const calendarBody = document.querySelector('#calendar tbody');
    calendarBody.innerHTML = '';

    // Determines/displays the year and month to the user
    document.getElementById('monthYear').textContent = `${getMonthName(month)} ${year}`;

    // Initializes a new var
    let row = document.createElement('tr');

    // Creates the empty cells required prior to the first of the month
    for (let i = 0; i < dayOne; i++) {
        row.appendChild(document.createElement('td'));
    }

    // Generates the dates of the months and displays them to the user
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('td');
        cell.textContent = day;
        cell.dataset.day = day; 

        //Allows the modal to be accessed from any cell in the table with a date
        cell.addEventListener('click', () => openEventModal(day));

        //Checks localstorage for an event
        const eventKey = `event-${year}-${month}-${day}`;
        const savedEvent = localStorage.getItem(eventKey);

        if (savedEvent) {
            const eventData = JSON.parse(savedEvent);
            cell.classList.add('event-day'); 
            const eventLabel = document.createElement('div');
            eventLabel.textContent = eventData.title;
            eventLabel.classList.add('event-title', eventData.color); 
            cell.appendChild(eventLabel);
        }

        // Generates a new row in the calendar when it reaches the 7th day in the week, which in this specific calendar is Saturday
        if ((day + dayOne) % 7 === 0) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }
    }

    // Checks if the last day of the month DNE on a Saturday and appends the last row
    if (row.children.length > 0) {
        calendarBody.appendChild(row);
    }
}

//generates the week view of the calender
function weekCalendar(year, month, startDate) 
{
    //Adjusts the start date for the week
    const firstOfTheWeek = new Date(year, month, startDate);
    const dayOfWeek = firstOfTheWeek.getDay();
    firstOfTheWeek.setDate(startDate - dayOfWeek); 
    const calendarBody = document.querySelector('#calendar tbody');
    calendarBody.innerHTML = ''; 

    document.getElementById('monthYear').textContent = `${getMonthName(month)} ${year}`;

    let row = document.createElement('tr');

    // Generates the week
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(firstOfTheWeek);
        currentDate.setDate(firstOfTheWeek.getDate() + i); // Adjusts the date for each day of the week

        // Displays the date
        const cell = document.createElement('td');
        cell.textContent = currentDate.getDate(); 

        //Checks localstorage for an event
        const eventKey = `event-${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        const savedEvent = localStorage.getItem(eventKey);
       
        if (savedEvent) {
            const eventData = JSON.parse(savedEvent);
            cell.classList.add('event-day'); 
            const eventLabel = document.createElement('div');
            eventLabel.textContent = eventData.title;
            cell.appendChild(eventLabel);
        }

        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

//Array that maps a number to the name of the month
function getMonthName(month) 
{
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
}

// Displays the current year and corresponding month when the page first loads
makeCalendar(currentYear, currentMonth);

// Navigation buttons, makes the previousMonth button multi functional to either backtrack months or weeks
document.getElementById('previousMonth').onclick = () => {
    if (currentView === 'month') 
    {
        currentMonth--;
        if (currentMonth < 0)
         {
            currentMonth = 11;
            currentYear--;
        }

        // Ensure month view is updated
        makeCalendar(currentMonth, currentYear); 
    }
    else if (currentView === 'week') 
    {
        // Move to the previous week by subtracting 7 days 
        currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7); 

        // Make sure the week view aligns with days
        weekCalendar(currentWeekStartDate.getFullYear(), currentWeekStartDate.getMonth(), currentWeekStartDate.getDate());
    }
};

// Navigation buttons, makes the previousMonth button multi functional to move forward in either months or weeks
document.getElementById('upcomingMonth').onclick = () => {
    if (currentView === 'month') {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        makeCalendar(currentMonth, currentYear); // Update the month view
    } else if (currentView === 'week') {
        // Move to the next week by adding 7 days from the current start date
        currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7); // Move forward by 7 days
        // Make sure the week view aligns
        weekCalendar(currentWeekStartDate.getFullYear(), currentWeekStartDate.getMonth(), currentWeekStartDate.getDate());
    }
};

//rerenders the month view
document.getElementById('month').onclick = () => {
    currentView = 'month';
    makeCalendar(currentMonth, currentYear); 
};

//renders the week view
document.getElementById('week').onclick = () => {
    currentView = 'week'; 
    const firstOfTheMonth = new Date(currentYear, currentMonth, 1);
    const firstSunday = firstOfTheMonth.getDate() - firstOfTheMonth.getDay(); 
    currentWeekStartDate = new Date(currentYear, currentMonth, firstSunday); 
    weekCalendar(currentYear, currentMonth, currentWeekStartDate.getDate()); 
};

// Closes the event modal
function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

//Exits the event modal when the user selects the close button
document.getElementById('closeModal').onclick = closeEventModal;

//Generates the calander again, same as previous function, needed to be repeated or else program only works in week view
function makeCalendar(month, year) 
{
    const dayOne = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const calendarBody = document.querySelector('#calendar tbody');
    calendarBody.innerHTML = '';

    document.getElementById('monthYear').textContent = `${getMonthName(month)} ${year}`;

    let row = document.createElement('tr');

    for (let i = 0; i < dayOne; i++) 
    {
        row.appendChild(document.createElement('td'));
    }

    for (let day = 1; day <= totalDays; day++) 
    {
        const cell = document.createElement('td');
        cell.textContent = day;
        row.appendChild(cell);

        cell.addEventListener('click', () => openEventModal(day));

        const eventKey = `event-${year}-${month}-${day}`;
        const savedEvent = localStorage.getItem(eventKey);
        if (savedEvent) 
        {
            const eventData = JSON.parse(savedEvent);
            cell.classList.add('event-day'); 
            const eventLabel = document.createElement('div');
            eventLabel.textContent = eventData.title;
            cell.appendChild(eventLabel);
        }

        if ((day + dayOne) % 7 === 0)
        {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }
    }

    if (row.children.length > 0) 
    {
        calendarBody.appendChild(row);
    }
}

//generates the modal
function openEventModal(day) 
{
    const modal = document.getElementById('eventModal');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDescriptionInput = document.getElementById('eventDescription');
    const eventColorInput = document.getElementById('eventColor'); // Color picker input
    const deleteButton = document.getElementById('deleteEvent');
    
    //Lets the user select the selected date
    const selectedDate = new Date(currentYear, currentMonth, day);
    const eventKey = `event-${currentYear}-${currentMonth}-${day}`;
    
    //Loads iff there is a previously stored event
    const savedEvent = localStorage.getItem(eventKey);
    if (savedEvent) {
        const eventData = JSON.parse(savedEvent);
        eventTitleInput.value = eventData.title;
        eventDescriptionInput.value = eventData.description;
        eventColorInput.value = eventData.color || 'blue'; 
        
        //displays an delete button on the modal when a event was previously saved
        deleteButton.style.display = 'inline-block';

    } 
    else 
    {
        eventTitleInput.value = '';
        eventDescriptionInput.value = '';
        eventColorInput.value = 'blue'; 
        
        //Does not display an delete button if no event was previously saved
        deleteButton.style.display = 'none';
    }

    //Displays the modal
    modal.style.display = 'flex';

    //Saves event into localStorage 
    document.getElementById('saveEvent').onclick = () => {
        const eventTitle = eventTitleInput.value;
        const eventDescription = eventDescriptionInput.value;
        const eventColor = eventColorInput.value; 

        if (eventTitle) {
            const eventData = {
                title: eventTitle,
                description: eventDescription,
                color: eventColor 
            };
            localStorage.setItem(eventKey, JSON.stringify(eventData));

            // Updates the cell for the selected event
            const calendarBody = document.querySelector('#calendar tbody');
            const eventCell = calendarBody.querySelector(`td[data-day="${day}"]`);
            if (eventCell) {
                eventCell.classList.add('event-day');
                const eventLabel = document.createElement('div');
                eventLabel.textContent = eventTitle;
                eventLabel.classList.add('event-title', eventColor); 
                eventCell.appendChild(eventLabel);
            }

            //Updates the calender to displayi with events
            makeCalendar(currentMonth, currentYear);

            //closes the modal
            closeEventModal();

        } 
        else 
        {
        	//error check
            alert('Please provide an event title.');
        }
    };

    //allows the delete button to be functional, deletes event from local storage
    deleteButton.onclick = () => {
        localStorage.removeItem(eventKey);

        //Rerenders the calander without the event
        makeCalendar(currentMonth, currentYear);
        closeEventModal();
    };
}

/*Changes or edits I plan to make in the future would be to try and figure out a way to condense and make the 
code more efficent. I would like to implement a single day view, that displays the date and all the hours
throughout the day, like on google calander. I would also like to try and figure out a way to write the js 
without having to duplicate functions or rewrite certain parts. I would like to try and make my code more advnaced and 
less succeptiable to errors. Most importantly I would like to figure out why there is an error when my calender first inital loads
and how to rid of said error. Other changes I would like to make would be to include server side storage, rather than
local side storage. There are more changes and advancments I would like to make but ran out of time to implment. */