

### Mongodb setup


```
→ docker exec -it loopbackdemo_mongodb_1 bash
root@mongodb:/# mongo
MongoDB shell version v3.6.0
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.0
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
http://docs.mongodb.org/
Questions? Try the support group
http://groups.google.com/group/mongodb-user
Server has startup warnings:
2017-12-26T23:40:15.663+0000 I STORAGE  [initandlisten]
2017-12-26T23:40:15.663+0000 I STORAGE  [initandlisten] ** WARNING: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine
2017-12-26T23:40:15.663+0000 I STORAGE  [initandlisten] **          See http://dochub.mongodb.org/core/prodnotes-filesystem
2017-12-26T23:40:15.879+0000 I CONTROL  [initandlisten]
2017-12-26T23:40:15.879+0000 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2017-12-26T23:40:15.879+0000 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2017-12-26T23:40:15.879+0000 I CONTROL  [initandlisten]
2017-12-26T23:40:20.694+0000 E -        [main] Error loading history file: FileOpenFailed: Unable to fopen() file /root/.dbshell: No such file or directory
> use node
switched to db node
> db.createUser({user:'loopback', pwd:'loopback', roles:[{role:'readWrite', db:'node'}]})
Successfully added user: {
"user" : "loopback",
"roles" : [
  {
    "role" : "readWrite",
    "db" : "node"
  }
]
}
>
```
