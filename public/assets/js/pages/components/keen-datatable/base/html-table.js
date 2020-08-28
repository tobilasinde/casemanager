"use strict";
// Class definition

var KTDatatableHtmlTableDemo = function() {
    // Private functions

    // demo initializer
    var demo = function() {

        var datatable = $('.kt-datatable').KTDatatable({
            data: {
                saveState: {
                    cookie: false
                },
            },
            layout: {
                scroll: true,
                height: 550,
                footer: false,
            },
            search: {
                input: $('#generalSearch'),
            },
            columns: [
                {
                    field: 'Status',
                    title: 'Status',
                    autoHide: false,
                    // callback function support for column rendering
                    template: function(row) {
						var status = {
							'New': {'title': 'New', 'class': 'kt-badge--brand'},
							'On Hold': {'title': 'On Hold', 'class': ' kt-badge--metal'},
							'Escalated': {'title': 'Escalated', 'class': ' kt-badge--danger'},
							'Working': {'title': 'Working', 'class': ' kt-badge--warning'},
							'Closed': {'title': 'Closed', 'class': ' kt-badge--success'},
						};
						return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
					},
                }, {
                    field: 'Priority',
                    title: 'Priority',
                    autoHide: false,
                    // callback function support for column rendering
                    template: function(row) {
						var status = {
							'High': {'title': 'High', 'state': 'danger'},
							'Medium': {'title': 'Medium', 'state': 'warning'},
							'Low': {'title': 'Low', 'state': 'accent'},
						};
						return '<span class="kt-badge kt-badge--' + status[row.Priority].state + ' kt-badge--dot"></span>&nbsp;<span class="kt-font-bold kt-font-' + status[row.Priority].state + '">' +
							status[row.Priority].title + '</span>';
					},
                },
            ],
        });

        $('.category').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Category');
        });

        $('.priority').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Priority');
        });

        $('.status').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_form_type').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Department');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();
    };

    return {
        // Public functions
        init: function() {
            // init dmeo
            demo();
        }
    };
}();

jQuery(document).ready(function() {
    KTDatatableHtmlTableDemo.init();
});