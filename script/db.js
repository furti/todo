(function(angular) {

    var todo = angular.module('todo');
    var idb, dbName = 'todo',
        savedRequests = [];

    function setupDB() {
        var request = indexedDB.open(dbName, 1);

        request.onerror = function(event) {
            throw "Error opening Database [" + request.errorCode + "]";
        };

        request.onupgradeneeded = function(event) {
            var db = request.result;

            if (!db.objectStoreNames.contains(dbName)) {
                db.createObjectStore(dbName, {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }
        };

        request.onsuccess = function(event) {
            idb = request.result;

            if (savedRequests.length > 0) {
                angular.forEach(savedRequests, function(request) {
                    request.execute();
                });
            }
        };
    }

    function getObjectStore(mode) {
        var tx = idb.transaction([dbName], mode);
        return tx.objectStore(dbName);
    }

    function handleRequest(request, deferred) {
        request.onerror = function(event) {
            deferred.reject('Error interacting with the database [' + request.errorCode + ']');
        };

        request.onsuccess = function(event) {
            deferred.resolve(event.target.result);
        };
    }

    function handleReadRequest(request, deferred) {
        request.onerror = function(event) {
            deferred.reject('Error interacting with the database [' + request.errorCode + ']');
        };

        var data = [];

        request.onsuccess = function(event) {
            if (event.target.result === null) {
                deferred.resolve(data);
            } else {
                data.push(event.target.result.value);
                event.target.result.continue();
            }
        };
    }

    todo.factory('todoDb', ['$q',

        function($q) {

            return {
                initialize: function() {
                    setupDB();
                },
                insetOrUpdate: function(note) {
                    var request = new PutRequest($q, note);

                    if (!idb) {
                        savedRequests.push(request);
                    } else {
                        request.execute();
                    }

                    return request.getPromise();
                },
                remove: function(note) {
                    var request = new RemoveRequest($q, note.id);

                    if (!idb) {
                        savedRequests.push(request);
                    } else {
                        request.execute();
                    }

                    return request.getPromise();
                },
                readAll: function() {
                    var request = new ReadAllRequest($q);

                    if (!idb) {
                        savedRequests.push(request);
                    } else {
                        request.execute();
                    }

                    return request.getPromise();
                }
            };
        }
    ]);

    function ReadAllRequest($q) {
        this.deferred = $q.defer();
    }

    ReadAllRequest.prototype.execute = function() {
        var store = getObjectStore('readonly');
        var range = IDBKeyRange.lowerBound(0);

        handleReadRequest(store.openCursor(range), this.deferred);
    };

    ReadAllRequest.prototype.getPromise = function() {
        return this.deferred.promise;
    };

    function PutRequest($q, note) {
        this.deferred = $q.defer();
        this.note = note;
    }

    PutRequest.prototype.execute = function() {
        var store = getObjectStore('readwrite');

        handleRequest(store.put(this.note), this.deferred);

    };

    PutRequest.prototype.getPromise = function() {
        return this.deferred.promise;
    };

    function RemoveRequest($q, noteId) {
        this.deferred = $q.defer();
        this.noteId = noteId;
    }

    RemoveRequest.prototype.execute = function() {
        var store = getObjectStore('readwrite');

        handleRequest(store.delete(this.noteId), this.deferred);

    };

    RemoveRequest.prototype.getPromise = function() {
        return this.deferred.promise;
    };

})(angular);