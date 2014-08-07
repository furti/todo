(function(angular) {
    var todo = angular.module('todo');

    todo.controller('ExportController', ['$scope', 'groups', 'todoDb', 'todoUtils',
        function($scope, groups, todoDb, todoUtils) {
            $scope.groups = groups;
            $scope.data = {};

            $scope.generateExport = function() {
                var allNotes = [];

                angular.forEach($scope.groups, function(group) {
                    allNotes = allNotes.concat(group.notes);
                });

                $scope.data.jsonData = angular.toJson(allNotes);
            };

            $scope.importData = function() {
                if (!angular.isString($scope.data.jsonData)) {
                    return;
                }

                var toImport = angular.fromJson($scope.data.jsonData);

                angular.forEach($scope.groups, function(group) {
                    angular.forEach(group.notes, function(noteToDel) {
                        todoDb.remove(noteToDel).then(function() {
                            //Nothing to do here
                        }, function(error) {
                            alert(error);
                        });
                    });

                    group.notes.length = 0;
                });

                angular.forEach(toImport, function(importNote) {
                    delete importNote.id;

                    todoDb.insetOrUpdate(importNote).then(function(noteId) {
                        importNote.id = noteId;

                        todoUtils.findGroupById($scope.groups, importNote.group).notes.push(importNote);
                    }, function(error) {
                        alert(error);
                    });

                });
            };
        }
    ]);
})(angular);