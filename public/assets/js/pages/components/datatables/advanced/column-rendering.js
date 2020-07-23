"use strict";
var KTDatatablesAdvancedColumnRendering = function() {

	var initTable1 = function() {
		var table = $('#kt_table_1');

		// begin first table
		table.DataTable({
			responsive: true,
			paging: true,
			columnDefs: [
				{
					targets: 3,
					render: function(data, type, full, meta) {
						var status = {
							New: {'title': 'New', 'class': 'kt-badge--brand'},
							'On Hold': {'title': 'On Hold', 'class': ' kt-badge--metal'},
							Escalated: {'title': 'Escalated', 'class': ' kt-badge--danger'},
							Working: {'title': 'Working', 'class': ' kt-badge--warning'},
							Closed: {'title': 'Closed', 'class': ' kt-badge--success'},
						};
						if (typeof status[data] === 'undefined') {
							return data;
						}
						return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
					},
				},
				{
					targets: 2,
					render: function(data, type, full, meta) {
						var status = {
							High: {'title': 'High', 'state': 'danger'},
							Medium: {'title': 'Medium', 'state': 'warning'},
							Low: {'title': 'Low', 'state': 'accent'},
						};
						if (typeof status[data] === 'undefined') {
							return data;
						}
						return '<span class="kt-badge kt-badge--' + status[data].state + ' kt-badge--dot"></span>&nbsp;' +
							'<span class="kt-font-bold kt-font-' + status[data].state + '">' + status[data].title + '</span>';
					},
				},
			],
		});
	};

	return {

		//main function to initiate the module
		init: function() {
			initTable1();
		}
	};
}();

jQuery(document).ready(function() {
	KTDatatablesAdvancedColumnRendering.init();
});
