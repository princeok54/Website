
IF OBJECT_ID('data', 'U') IS NOT NULL
    DROP TABLE data;
GO

CREATE TABLE data(
    
    address VARCHAR(100),
    balance INTEGER,
    
);
GO



DECLARE @data VARCHAR(MAX)

SELECT @data =
   BulkColumn
   FROM OPENROWSET(BULK 'C:\Users\Anuj\Downloads\generated.json', SINGLE_BLOB) JSON
 
IF (ISJSON(@data)= 1)
    BEGIN
	     PRINT 'JSON File is valid';

		 INSERT INTO data
		 SELECT *
		 FROM OPENJSON(@Data, '$.data.items')
		 WITH (
		     
             address VARCHAR(100) '$.address',
             balance INTEGER '$.balance'
             
         )

    END

ELSE
    BEGIN
	     PRINT 'JSON FILE IS INVALID' ;
    END

SELECT * FROM data