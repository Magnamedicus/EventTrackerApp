# EventTrackerApp
An app that tracks how much time has passed since an event occurred and sets an alarm to remind the user when an event (i.e. a class assignment) is overdue. Written in vanilla JavaScript, HTML and CSS.

The user can create a dropbox of courses that serve as categories for creating assignments. Each assignment will be stamped with the date in which it was created and a timer will run, notifying the user of how much time has passed since its creation. The user can set an 'alarm', which will let the user know when the assignment is overdue. 

For example, if a professor posts an assignment the user can create that assignment in the tracker under the appropriate course. If the assignment is due in a week but the user wishes to have it done in 4 days, the user can set an alarm for 4 days. After 4 days, the assignment will show as 'Overdue' and be placed in a main overdue-list, which pulls from overdue assignments in every course. 

I originally designed this to keep track of things like scheduling requests at my job as a Clinical Research Coordinator, but eventually refactored it for school assignments. 
