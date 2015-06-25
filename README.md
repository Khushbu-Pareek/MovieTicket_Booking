# MovieTicket_Booking
We want to be able to pick our seats in a cinema hall. 
Given a seating arrangement create a visual seat picker. 
You can hardcode the seat map in your javascript. 
You should define the names of the categories i.e. gold, silver, bronze as well as the number of rows and seats per row in the specific category. 
For example you could create an array that tells you gold has 7 rows with 8 seats each, while silver has 5 rows with 7 seats each, and so on.
On the front end you should include a form that asks the user the number of tickets they are booking. Also, you need to mention booking category (gold, silver etc.). Then allow them to select the specific seats they want to book and split out the seat number and row (you can create a seat number/row scheme).
You should only allow people to book seats that are adjacent to each other (in other words one should not be allowed to book seat 1 and seat 3 without also booking seat 2). 
We should also prevent people from creating single seat silos unless there is no alternative. For example in a row of 4 seats, a user should not be allowed to book seats 2 and 3 because in that case seat 1 would be alone and seat 4 would be alone. He should be forced to book seats 1-2 or seats 3-4.
