(function(angular) {
    var todo = angular.module('todo', ['ui.bootstrap']);

    todo.run(['todoDb',
        function(todoDb) {
            todoDb.initialize();
        }
    ]);

    function setupGroups(groups, notes) {
        var groupsById = {};

        angular.forEach(groups, function(group) {
            groupsById[group.id] = group;
        });

        angular.forEach(notes, function(node) {
            groupsById[node.group].notes.push(node);
        });
    }

    todo.controller('TodoController', ['$modal', 'todoUtils', 'todoDb',

        function($modal, todoUtils, todoDb) {
            var ctrl = this;

            this.groups = [{
                label: 'Open',
                id: 'open',
                notes: []
            }, {
                label: 'In Progress',
                id: 'progress',
                notes: []
            }, {
                label: 'Closed',
                id: 'closed',
                notes: []
            }];

            todoDb.readAll().then(function(notes) {
                setupGroups(ctrl.groups, notes);
            }, function(error) {
                alert(error);
            });

            this.addNote = function(groupId) {
                var modal = $modal.open({
                    templateUrl: './templates/NewNote.html',
                    controller: 'NewNoteController as newNote'
                });

                modal.result.then(function(newNote) {
                    newNote.group = groupId;

                    todoDb.insetOrUpdate(newNote).then(function(noteId) {
                        newNote.id = noteId;


                        var group = todoUtils.findGroupById(ctrl.groups, groupId);

                        group.notes.push(newNote);
                    }, function(errorCode) {
                        alert(errorCode);
                    });
                });
            };

            this.removeNote = function(note) {
                todoDb.remove(note).then(function() {
                    var group = todoUtils.findGroupById(ctrl.groups, note.group);
                    todoUtils.removeNoteFromGroup(group, note);
                }, function(error) {
                    alert(error);
                });
            };

            this.moveNote = function(note, oldGroupId, newGroupId) {
                if (oldGroupId === newGroupId) {
                    return;
                }

                note.group = newGroupId;

                todoDb.insetOrUpdate(note).then(function(noteId) {
                    var oldGroup = todoUtils.findGroupById(ctrl.groups, oldGroupId);
                    var newGroup = todoUtils.findGroupById(ctrl.groups, newGroupId);

                    if (!oldGroup || !newGroup) {
                        return;
                    }

                    todoUtils.removeNoteFromGroup(oldGroup, note);
                    newGroup.notes.push(note);
                }, function(error) {
                    alert(error);
                });
            };
        }
    ]);

    todo.controller('NewNoteController', function() {
        this.note = {
            title: null,
            text: null
        };
    });

    todo.factory('todoUtils', function() {
        var utils = {};

        utils.findGroupById = function(groups, groupId) {
            if (!groups) {
                return null;
            }

            for (var i in groups) {
                var group = groups[i];

                if (group.id === groupId) {
                    return group;
                }
            }
        };

        utils.removeNoteFromGroup = function(group, note) {
            var i;
            if (!group || !group.notes) {
                return;
            }

            for (i in group.notes) {
                var checkNote = group.notes[i];

                if (note.id === checkNote.id) {
                    break;
                }
            }

            group.notes.splice(i, 1);
        };

        return utils;
    });

})(angular);