# tutorial

## Step 1

```
$> lb

? What's the name of your application? loopback-arango3
? Enter name of the directory to contain the project: loopback-arango3
   create loopback-arango3/
     info change the working directory to loopback-arango3

? Which version of LoopBack would you like to use? 3.x (current)
? What kind of application do you have in mind? notes (A project containing a basic working example, including a memory database)
Generating .yo-rc.json


I'm all done. Running npm install for you to install the required dependencies. If this fails, try running the command yourself.


   create .editorconfig
   create .eslintignore
   create .eslintrc
   create server/boot/root.js
   create server/middleware.development.json
   create server/middleware.json
   create server/server.js
   create common/models/note.js
   create common/models/note.json
   create server/boot/authentication.js
   create .gitignore
   create client/README.md
npm WARN deprecated nodemailer@2.7.2: All versions below 4.0.1 of Nodemailer are deprecated. See https://nodemailer.com/status/
npm notice created a lockfile as package-lock.json. You should commit this file.
added 501 packages in 13.567s


Next steps:

  Change directory to your app
    $ cd loopback-arango3

  Create a model in your app
    $ lb model

  Run the app
    $ node .

The API Connect team at IBM happily continues to develop,
support and maintain LoopBack, which is at the core of
API Connect. When your APIs need robust management and
security options, please check out http://ibm.biz/tryAPIC

```

## Step 2

```
$> lb datasource

? Enter the datasource name: arango
? Select the connector for arango: other
? Enter the connector's module name loopback-connector-arangodb-3
? Install loopback-connector-arangodb-3 Yes
Please manually add config for your custom connector loopback-connector-arangodb-3 in server/datasources.json
+ loopback-connector-arangodb-3@1.0.6
added 29 packages in 88.82s
```

## Step 3

Setup a database and fill datasource details
 ```
 {
   "arango": {
     "name": "arango",
     "host": "localhost",
     "port": 8529,
     "database": "node",
     "user": "node@node",
     "password": "password",
     "connector": "loopback-connector-arangodb-3"
   }
 }


 ```

## Step 4

Change all model to persist in arango:
 ```
 "User": {
   "dataSource": "arango"
 },
 "AccessToken": {
   "dataSource": "arango",
   "public": false
 },
 "ACL": {
   "dataSource": "arango",
   "public": false
 },
 "RoleMapping": {
   "dataSource": "arango",
   "public": false,
   "options": {
     "strictObjectIDCoercion": true
   }
 },
 "Role": {
   "dataSource": "arango",
   "public": false
 },
 "Note": {
   "dataSource": "arango"
 }
 ```

Dead-end : arango connector not working
```
Unhandled error for request GET /api/Notes: ArangoError: AQL: collection not found: ACL (while parsing)
```
