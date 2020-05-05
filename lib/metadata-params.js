/*
    Configure new metadata types you want to report on here. The options are:

    queryStringByType: This is the fields that are pulled for the metadata type. You need to include
                        all fields here that are then referenced in any of the other objects.

    selectorColumnHeadersByType: What columns do you want to appear in the initial selector table. 

    selectorRowByType: Paired with the above. Maps the fields for a record to the columns.

    reportColumnHeadersByType: What columns do you want to appear in the report table. 

    reportRowByType: Paired with the above. Maps the fields for a record to the columns.
*/

const metadataTypes = ['PermissionSet', 'Profile', 'CustomObject', 'RecordType'];

const queryStringByType = {
    PermissionSet : 'SELECT Id, Name, Label, Description, IsCustom FROM PermissionSet WHERE IsOwnedByProfile = FALSE ORDER BY Label',
    Profile : 'SELECT Id, Name, Description FROM Profile ORDER BY Name',
    CustomObject: 'SELECT Id, DeveloperName, Description, SharingModel FROM CustomObject ORDER BY DeveloperName',
    RecordType: 'SELECT Id, Description, Name, SobjectType FROM RecordType WHERE IsActive = TRUE ORDER BY SObjectType, Name'
}

const selectorColumnHeadersByType = {
    PermissionSet : [
        'Label',
        'Api Name' 
    ],
    Profile : [
        'Name'
    ],
    CustomObject : [
        'Name',
        'Description'
    ],
    RecordType : [
        'Name',
        'Description',
        'Object'
    ]
}

const selectorRowByType = {
    PermissionSet : (record, selected) => {
        return {
            defaultSelected : selected,
            id : record.Id,
            cells : [
                { 
                    key: 'label',
                    value: record.Label, 
                },
                {
                    key: 'name',
                    value: record.Name
                }
            ]
        }
    },
    Profile : (record, selected) => {
        return {
            defaultSelected : selected,
            id : record.Id,
            cells : [
                {
                    key: 'name',
                    value: record.Name
                }
            ]
        }
    },
    CustomObject : (record, selected) => {
        return {
            defaultSelected : selected,
            id : record.Id,
            cells : [
                {
                    key: 'name',
                    value: record.DeveloperName
                }
            ]
        }
    },
    RecordType : (record, selected) => {
        return {
            defaultSelected : selected,
            id : record.Id,
            cells : [
                {
                    key: 'name',
                    value: record.Name
                },
                {
                    key: 'description',
                    value: record.Description
                },
                {
                    key: 'object',
                    value: record.SobjectType
                }
            ]
        }
    }
}

const reportColumnHeadersByType = {
    PermissionSet : [
        'Label',
        'API Name',
        'Description' 
    ],
    Profile : [
        'Name',
        'Description'
    ],
    CustomObject : [
        'Name',
        'Description'
    ],
    RecordType : [
        'Name',
        'Description',
        'Object'
    ],
}

const reportRowByType = {
    PermissionSet : (record) => {
        return {
            id : record.Id,
            cells : [
                { 
                    key: 'label',
                    value: record.Label, 
                },
                {
                    key: 'name',
                    value: record.Name
                },
                {
                    key: 'description',
                    value: record.Description
                }
            ]
        }
    },
    Profile : (record) => {
        return {
            id : record.Id,
            cells : [
                {
                    key: 'name',
                    value: record.Name
                },
                {
                    key: 'description',
                    value: record.Description
                }
            ]
        }
    },
    CustomObject : (record) => {
        return {
            id : record.Id,
            cells : [
                {
                    key: 'name',
                    value: record.DeveloperName
                },
                {
                    key: 'description',
                    value: record.Description
                }
            ]
        }
    },
    RecordType : (record) => {
        return {
            id : record.Id,
            cells : [
                {
                    key: 'name',
                    value: record.Name
                },
                {
                    key: 'description',
                    value: record.Description
                },
                {
                    key: 'object',
                    value: record.SobjectType
                }
            ]
        }
    }
}

function getRecordIsSelected(selectedRecords, record) {
    if (selectedRecords && selectedRecords.length > 0) {
        let selectedRecord = selectedRecords.find(item => item.Id == record.Id);
        if (selectedRecord) {
            this.previouslySelectedIds[selectedRecord.Id] = true;
            return true;
        }
    }

    return false;

}

const buildSelectorRowForType = function(record, selectedRecordsForType) {
    return selectorRowByType[this.type](record, getRecordIsSelected.call(this, selectedRecordsForType, record));
}

const buildReportRowForType = function(type, record) {
    return reportRowByType[type](record);
}

export { metadataTypes, queryStringByType, selectorColumnHeadersByType, buildSelectorRowForType, buildReportRowForType, reportColumnHeadersByType };