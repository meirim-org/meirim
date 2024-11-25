#DOCKER-COMPOSE-NODEJS-EXPRESS-MYSQL
In this sample, we will look at the functionality provided by 'Docker Compose' for defining and running multi-container Docker applications.

We are going to use 'MySQL' like our specialized database and 'Node.js' as our platform for creating highly performant web applications.

#NodeJS v14.17
#MySQL 5.7

<p align="center">
    <img src="Screenshots/docker_nodejs.png" alt="docker_compose" width="50%"/>
</p>

<p align="center">
    <img src="Screenshots/mysql.jpg" alt="docker_compose" width="50%"/>
</p>

### To Build both of images 
'docker-compose build'

### RUN THE PROJECT
`docker-compose up`

### INSPECT YOUR MYSQL CONTAINER(to see your database)
1. docker ps
2. docker exec -it YOUR_MYSQL_CONTAINER_ID bash
3. mysql -u root -p
4. put the password(123)
5. enter 
6. use CHIRINOS;
7. show tables;
8. describe EMPLOYEE;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123';