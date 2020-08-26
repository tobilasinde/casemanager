"use strict";
// Class definition

var KTDefaultDatatableDemo = function() {
	// Private functions

	// basic demo
	var demo = function() {
		var options = {
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'http://localhost:3000/api/case/cases-list',
					},
				},
				pageSize: 20, // display 20 records per page
				serverPaging: true,
				serverFiltering: true,
				serverSorting: true,
			},

			// layout definition
			layout: {
				scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
				height: 550, // datatable's body's fixed height
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
					width: 30,
					type: 'number',
					selector: {class: 'kt-checkbox--solid'},
					textAlign: 'center',
				},
				{
					field: 'iid',
					title: 'ID',
					width: 30,
					type: 'number',
					textAlign: 'center',
					template: '{{id}}',
				}, {
					field: 'case_number',
					title: 'Case Number',
				}, {
					field: 'subject',
					title: 'Subject',
					sortable: 'asc',
				}, {
					field: 'createdAt',
					title: 'Date Created',
					type: 'date',
					format: 'MM/DD/YYYY',
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
					width: 110,
					overflow: 'visible',
					autoHide: false,
					template: function(row) {
						return `
						<a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit details">
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

		};

		var datatable = $('.kt_datatable').KTDatatable(options);

		// both methods are supported
		// datatable.methodName(args); or $(datatable).KTDatatable(methodName, args);
		// $('#ediCases').on('click', editCase());

		$('#kt_datatable_destroy').on('click', function() {
			// datatable.destroy();
			$('.kt_datatable').KTDatatable('destroy');
		});

		$('#kt_datatable_init').on('click', function() {
			datatable = $('.kt_datatable').KTDatatable(options);
		});

		$('#kt_datatable_reload').on('click', function() {
			// datatable.reload();
			$('.kt_datatable').KTDatatable('reload');
		});

		$('#kt_datatable_sort_asc').on('click', function() {
			datatable.sort('name', 'asc');
		});

		$('#kt_datatable_sort_desc').on('click', function() {
			datatable.sort('name', 'desc');
		});

		// get checked record and get value by column name
		$('#kt_datatable_get').on('click', function() {
			// select active rows
			datatable.rows('.kt-datatable__row--active');
			// check selected nodes
			if (datatable.nodes().length > 0) {
				// get column by field name and get the column nodes
				var value = datatable.columns('name').nodes().text();
				$('#datatable_value').html(value);
			}
		});

		// record selection
		$('#kt_datatable_check').on('click', function() {
			var input = $('#kt_datatable_check_input').val();
			datatable.setActive(input);
		});

		$('#kt_datatable_check_all').on('click', function() {
			// datatable.setActiveAll(true);
			$('.kt_datatable').KTDatatable('setActiveAll', true);
		});

		$('#kt_datatable_uncheck_all').on('click', function() {
			// datatable.setActiveAll(false);
			$('.kt_datatable').KTDatatable('setActiveAll', false);
		});

		$('#kt_datatable_hide_column').on('click', function() {
			datatable.columns('email').visible(false);
		});

		$('#kt_datatable_show_column').on('click', function() {
			datatable.columns('email').visible(true);
		});

		$('#kt_datatable_remove_row').on('click', function() {
			datatable.rows('.kt-datatable__row--active').remove();
		});

		$('#kt_form_status').on('change', function() {
			datatable.search($(this).val().toLowerCase(), 'status');
		});

		$('#kt_form_priority').on('change', function() {
			datatable.search($(this).val(), 'priority');
		});

		$('#kt_form_status,#kt_form_priority').selectpicker();

	};

	return {
		// public functions
		init: function() {
			demo();
		},
	};
}();

jQuery(document).ready(function() {
	KTDefaultDatatableDemo.init();
});
