## Installation

To install the project, follow these steps:

1. Clone the repository to your local machine using the command:
    ```
    git clone git@github.com:dlobregon/rec-restaurant-api.git
    ```

2. Navigate to the project directory:
    ```
    cd rec-restaurant-api
    ```

3. Install the required dependencies:
    ```
    npm install
    ```
4. create a `.env` file in the project's folder to storer enviroment variables required fo database connection and run the application.
Example of .env file:
~~~~
NODE_ENV=development
PORT=3000
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=postgres
DB_PORT=postgres
HOST=localhost
~~~~

## Running the Project

To run the project, execute the following command:
```
npm start
```

This will start the server and make it accessible at `http://localhost:3000`.

## Testing

To run the tests for the project, use the following command:
```
npm test
```

This will execute the test suite and display the results in the console.

## Dependencies

### Database
![ER Diagram](/img/er.png "ER Diagram")

The project uses PostgreSQL as its database. It provides a robust and scalable solution for storing and retrieving data.

### SQL-DDL Folder

The SQL-DDL folder contains the SQL Data Definition Language scripts. These scripts define the structure and schema of the database tables used in the project.

## API description
### Endpoint: `/api/reservations/search`
- Description: it returns all available tables for the restaurants that meet users restrictions. 
- request: `GET`
- payload example:
~~~~BASH
curl --location 'http://localhost:3000/api/reservations/search?users=Lucile%2C%20Michael&date=2024-07-07&time=08%3A00%3A00'
~~~~
- response example:
~~~~JSON
{
    "status": "success",
    "data": {
        "tablesByRestaurant": {
            "Panadería Rosetta": [
                {
                    "table_id": 8,
                    "seats": 2
                },
                {
                    "table_id": 9,
                    "seats": 2
                }
            ]
        }
    }
}
~~~~


### Endpoint `/api/reservations/create`

- Description: returns the reservation for the given data.
- request: `POST`
- payload example:
~~~~bash
curl --location 'http://localhost:3000/api/reservations/create' \
--header 'Content-Type: application/json' \
--data '{
    "users": [
        "Michael"
    ],
    "tableId": 8,
    "date": "2024-07-07",
    "time": "08:00:00"
}'
~~~~
- response example:
~~~~JSON
{
    "status": "success",
    "data": {
        "reservation": 12
    }
}
~~~~

### Endpoint: `/api/reservations/cancel`
- description: the endpoint cancels the reservation using the `reservationId` value
- request: `POST`
- payload example:
~~~~bash
curl --location 'http://localhost:3000/api/reservations/cancel' \
--header 'Content-Type: application/json' \
--data '{
    "reservationId": 11
}'
~~~~
- response example:
~~~~JSON
{
    "status": "success",
    "message": "Reservation has been cancelled."
}
~~~~