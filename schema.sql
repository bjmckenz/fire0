CREATE TABLE containers (containerNumber varchar(256), nameOfShip varchar(256), containerSize float, dateContainerShipped date);
INSERT INTO containers VALUES('123','COSCO Star',50,'2024-01-01');
INSERT INTO containers VALUES('456J','MAERSK Rock',25.600000000000000532,'2024-03-08');
INSERT INTO containers VALUES('x1','Betty',34,'2024-05-14');
CREATE TABLE users (userid INTEGER PRIMARY KEY NOT NULL, email_address VARCHAR(256), name VARCHAR(256), firebase_uid varchar(256));
