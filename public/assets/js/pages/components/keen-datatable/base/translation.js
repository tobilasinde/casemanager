"use strict";
// Class definition

var KTDatatableTranslationDemo = function() {
    // Private functions

    // basic demo
    var demo = function() {
		let link = '';
		if(document.location.href == `${Route.root}/case/cases`) link = `${Route.apiRoot}/case/cases-list`
		else if (document.location.href == `${Route.root}/case/user`) link = `${Route.apiRoot}/case/user`
		else if (document.location.href == `${Route.root}/case/user/customer`) link = `${Route.apiRoot}/case/user/customer`
		else if (document.location.href == `${Route.root}/`) link = `${Route.apiRoot}/case/user`

        var datatable = $('.kt_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: link,
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: false,
                serverSorting: true,
            },

            // layout definition
            layout: {
                theme: 'default', // datatable theme
                class: '', // custom wrapper class
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                height: null, // datatable's body's fixed height
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
			columns: [
				{
					field: 'id',
					title: '#',
					sortable: false,
					width: 10,
					type: 'number',
					selector: {class: 'kt-checkbox--solid'},
					textAlign: 'center',
				},{
					field: 'case_number',
					title: 'Case Number',
				}, {
					field: 'subject',
					title: 'Subject',
				}, {
					field: 'createdAt',
                    title: 'Date Created',
					sortable: true,
                    template: function(row) {
                        return moment(row.createdAt).format('ll');;
                    }
				},{
					field: 'Department.department_name',
					title: 'Department',
				}, {
					field: 'status',
					title: 'Status',
					// // callback function support for column rendering
					template: function(row) {
						var status = {
							'New': {'title': 'New', 'class': 'kt-badge--brand'},
							'On Hold': {'title': 'On Hold', 'class': ' kt-badge--metal'},
							'Escalated': {'title': 'Escalated', 'class': ' kt-badge--danger'},
							'Working': {'title': 'Working', 'class': ' kt-badge--warning'},
							'Closed': {'title': 'Closed', 'class': ' kt-badge--success'},
						};
						return '<span class="kt-badge ' + status[row.status].class + ' kt-badge--inline kt-badge--pill">' + status[row.status].title + '</span>';
					},
				}, {
					field: 'priority',
					title: 'Priority',
					autoHide: false,
					// callback function support for column rendering
					template: function(row) {
						var status = {
							'High': {'title': 'High', 'state': 'danger'},
							'Medium': {'title': 'Medium', 'state': 'warning'},
							'Low': {'title': 'Low', 'state': 'accent'},
						};
						return '<span class="kt-badge kt-badge--' + status[row.priority].state + ' kt-badge--dot"></span>&nbsp;<span class="kt-font-bold kt-font-' + status[row.priority].state + '">' +
							status[row.priority].title + '</span>';
					},
				}, {
					field: 'Actions',
					title: 'Actions',
					sortable: false,
					// width: 110,
					overflow: 'visible',
					autoHide: false,
					template: function(row) {
						return `
						<a href="/case/${row.id}/update" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit details">
							<i class="la la-edit"></i>
						</a>
						<a href="/case/${row.id}/details" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View details">
							<i class="la la-eye"></i>
						</a>
						<a href="javascript:;" class="btn btn-clean" title="Change Status">\
							Change Status
						</a>
					`;
					},
				}],

        });

        $('#kt_form_status').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'status');
        });

        $('.priority').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'priority');
        });

        $('#kt_form_status,.priority').selectpicker();

    };

    return {
        // public functions
        init: function() {
            demo();
        }
    };
}();

jQuery(document).ready(function() {
    KTDatatableTranslationDemo.init();
});
