document.addEventListener('DOMContentLoaded', () => {
    const coursesKey = 'courses';
    const eventsKey = 'events';
    let courses = JSON.parse(localStorage.getItem(coursesKey)) || [];
    let events = JSON.parse(localStorage.getItem(eventsKey)) || [];

    // Ensure patients and events are arrays
    if (!Array.isArray(courses)) {
        courses = [];
    }
    if (!Array.isArray(events)) {
        events = [];
    }

    const courseNameInput = document.getElementById('courseNameInput');
    const addcourseButton = document.getElementById('addcourseButton');
    const courseSelect = document.getElementById('courseSelect');
    const removecourseButton = document.getElementById('removecourseButton');
    const eventNameInput = document.getElementById('eventNameInput');
    const addEventButton = document.getElementById('addEventButton');
    const eventList = document.getElementById('eventList');
    const viewOverdueEventsButton = document.getElementById('viewOverdueEventsButton');
    const overdueEventsPopup = document.getElementById('overdueEventsPopup');
    const overdueEventsContent = document.getElementById('overdueEventsContent');
    const closeOverdueEventsButton = document.getElementById('closeOverdueEventsButton');
    const overdueEventsList = document.getElementById('overdueEventsList');

    const setAlarmPopup = document.getElementById('setAlarmPopup');
    const setAlarmConfirmButton = document.getElementById('setAlarmConfirmButton');
    const cancelAlarmButton = document.getElementById('cancelAlarmButton');
    const weeksInput = document.getElementById('weeksInput');
    const daysInput = document.getElementById('daysInput');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');

    let selectedEventId = null;

    function saveData() {
        localStorage.setItem(coursesKey, JSON.stringify(courses));
        localStorage.setItem(eventsKey, JSON.stringify(events));
    }

    function loadcourses() {
        courseSelect.innerHTML = '<option value="" selected>Select Class</option>';
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseSelect.appendChild(option);
        });
    }

    function loadEvents() {
        updateEventList();
    }

    function updateEventList() {
        eventList.innerHTML = '';
        const selectedcourse = courseSelect.value;

        if (!selectedcourse) return;

        events.filter(event => event.course === selectedcourse).forEach(event => {
            const div = document.createElement('div');
            div.className = 'event-item';
            div.dataset.eventId = event.id;

            const nameDiv = document.createElement('div');
            nameDiv.textContent = `${event.course} - ${event.name}`;

            const creationTimeDiv = document.createElement('div');
            creationTimeDiv.textContent = `Created ${formatTimestamp(event.createdAt)}`;

            const timeDiv = document.createElement('div');
            const alarmDiv = document.createElement('div');
            const countdownDiv = document.createElement('div');
            updateEventTime(event.id, timeDiv, alarmDiv, countdownDiv);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                events = events.filter(e => e.id !== event.id);
                saveData();
                updateEventList();
                updateOverdueEvents();
            });

            const setAlarmButton = document.createElement('button');
            setAlarmButton.textContent = 'Set Alarm';
            setAlarmButton.addEventListener('click', () => {
                selectedEventId = event.id;
                setAlarmPopup.style.display = 'flex';
            });

            div.appendChild(nameDiv);
            div.appendChild(creationTimeDiv);
            div.appendChild(timeDiv);
            div.appendChild(countdownDiv);
            div.appendChild(alarmDiv);
            div.appendChild(setAlarmButton);
            div.appendChild(removeButton);
            eventList.appendChild(div);
        });
    }

    function updateEventTime(eventId, timeDiv, alarmDiv, countdownDiv) {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        const now = Date.now();
        const elapsed = now - event.createdAt;
        const minutes = Math.floor(elapsed / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        const remainingMinutes = minutes % 60;
        const remainingHours = hours % 24;
        const remainingDays = days % 7;

        timeDiv.textContent = `Time Elapsed: ${weeks}w ${remainingDays}d ${remainingHours}h ${remainingMinutes}m`;

        if (event.alarmTime) {
            const overdue = elapsed - event.alarmTime;
            if (overdue > 0) {
                const overdueMinutes = Math.floor(overdue / (1000 * 60));
                const overdueHours = Math.floor(overdueMinutes / 60);
                const overdueDays = Math.floor(overdueHours / 24);
                const overdueWeeks = Math.floor(overdueDays / 7);

                const remainingOverdueMinutes = overdueMinutes % 60;
                const remainingOverdueHours = overdueHours % 24;
                const remainingOverdueDays = overdueDays % 7;

                alarmDiv.textContent = `Overdue: ${overdueWeeks}w ${remainingOverdueDays}d ${remainingOverdueHours}h ${remainingOverdueMinutes}m`;
                alarmDiv.style.color = 'red';
                countdownDiv.textContent = '';
            } else {
                const remainingTime = event.alarmTime - elapsed;
                const countdownMinutes = Math.floor(remainingTime / (1000 * 60));
                const countdownHours = Math.floor(countdownMinutes / 60);
                const countdownDays = Math.floor(countdownHours / 24);
                const countdownWeeks = Math.floor(countdownDays / 7);

                const remainingCountdownMinutes = countdownMinutes % 60;
                const remainingCountdownHours = countdownHours % 24;
                const remainingCountdownDays = countdownDays % 7;

                countdownDiv.textContent = `Time Until Overdue: ${countdownWeeks}w ${remainingCountdownDays}d ${remainingCountdownHours}h ${remainingCountdownMinutes}m`;
                alarmDiv.textContent = '';
            }
        } else {
            alarmDiv.textContent = '';
            countdownDiv.textContent = '';
        }
    }

    function updateOverdueEvents() {
        overdueEventsList.innerHTML = '';
        const now = Date.now();

        events.filter(event => event.alarmTime && (now - event.createdAt) > event.alarmTime)
              .forEach(event => {
            const div = document.createElement('div');
            div.className = 'event-item';
            const nameDiv = document.createElement('div');
            nameDiv.textContent = `${event.course} - ${event.name}`;

            const alarmDiv = document.createElement('div');
            updateEventTime(event.id, alarmDiv, alarmDiv, alarmDiv);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                events = events.filter(e => e.id !== event.id);
                saveData();
                updateOverdueEvents();
                updateEventList();
            });

            div.appendChild(nameDiv);
            div.appendChild(alarmDiv);
            div.appendChild(removeButton);
            overdueEventsList.appendChild(div);
        });
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    addcourseButton.addEventListener('click', () => {
        const name = courseNameInput.value.trim();
        if (name && !courses.includes(name)) {
            courses.push(name);
            saveData();
            loadcourses();
            courseNameInput.value = '';
        }
    });

    removecourseButton.addEventListener('click', () => {
        const selectedcourse = courseSelect.value;
        if (selectedcourse) {
            courses = courses.filter(p => p !== selectedcourse);
            events = events.filter(event => event.course !== selectedcourse);
            saveData();
            loadcourses();
            updateEventList();
            updateOverdueEvents();
        }
    });

    addEventButton.addEventListener('click', () => {
        const name = eventNameInput.value.trim();
        const course = courseSelect.value;
        if (name && course) {
            const id = `${course}-${name}-${Date.now()}`;
            const event = { id, name, course, createdAt: Date.now(), alarmTime: null };
            events.push(event);
            saveData();
            updateEventList();
            eventNameInput.value = '';
        }
    });

    courseSelect.addEventListener('change', updateEventList);

    setInterval(() => {
        const eventItems = document.querySelectorAll('.event-item');
        eventItems.forEach(eventItem => {
            const eventId = eventItem.dataset.eventId;
            const timeDiv = eventItem.querySelector('div:nth-child(3)');
            const alarmDiv = eventItem.querySelector('div:nth-child(4)');
            const countdownDiv = eventItem.querySelector('div:nth-child(5)');
            updateEventTime(eventId, timeDiv, alarmDiv, countdownDiv);
        });
        updateOverdueEvents();
    }, 60000); // Update every minute

    setAlarmConfirmButton.addEventListener('click', () => {
        const weeks = parseInt(weeksInput.value) || 0;
        const days = parseInt(daysInput.value) || 0;
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;

        const totalAlarmTime = (
            (weeks * 7 * 24 * 60 * 60 * 1000) +
            (days * 24 * 60 * 60 * 1000) +
            (hours * 60 * 60 * 1000) +
            (minutes * 60 * 1000)
        );

        if (selectedEventId && totalAlarmTime > 0) {
            const event = events.find(e => e.id === selectedEventId);
            if (event) {
                event.alarmTime = totalAlarmTime;
                saveData();
                updateEventList();
                updateOverdueEvents();
            }
            selectedEventId = null;
            setAlarmPopup.style.display = 'none';
            weeksInput.value = '';
            daysInput.value = '';
            hoursInput.value = '';
            minutesInput.value = '';
        }
    });

    cancelAlarmButton.addEventListener('click', () => {
        selectedEventId = null;
        setAlarmPopup.style.display = 'none';
        weeksInput.value = '';
        daysInput.value = '';
        hoursInput.value = '';
        minutesInput.value = '';
    });

    viewOverdueEventsButton.addEventListener('click', () => {
        updateOverdueEvents();
        overdueEventsPopup.style.display = 'flex';
    });

    closeOverdueEventsButton.addEventListener('click', () => {
        overdueEventsPopup.style.display = 'none';
    });

    // Initial Load
    loadcourses();
    loadEvents();

    // Check for overdue events on page load
    updateOverdueEvents();
});
