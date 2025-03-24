1.-- Insertt Tony Stark recods
INSERT INTO account 
(account_firstname, 
account_lastname, 
account_email, 
account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


2.-- Update account type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_type = 'Client';


3.--Delete Tony Stark from Database
DELETE FROM account
WHERE account_firstname = 'Tony' 
AND account_lastname = 'Stark';

4.--Modify GM Hummer Description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';


5.--INNER JOIN to Find "Sport" Vehicles
SELECT inv_make, inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


6.--Update image path
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
