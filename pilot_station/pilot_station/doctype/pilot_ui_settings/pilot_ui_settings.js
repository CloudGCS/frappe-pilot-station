// Copyright (c) 2024, CloudGCS and contributors
// For license information, please see license.txt

frappe.ui.form.on("Pilot UI Settings", {
	refresh(frm) {
		frappe.db.get_list('Service Extension Version', {
		        filters: { 'extension_type': 'PS' },
		        fields: ['name', 'title', 'library_name', 'service_provider', 'major', 'minor', 'file']
		    }).then(plugins => build_table(frm,plugins));
	},
});

function build_table(frm,plugins) {
        // Convert array string to dictionary
        let json = frm.doc.ui_template;
        let arr = json? JSON.parse(json) : [];
        let dict = {};
        arr.forEach(a=>dict[a]=1);

        // Build table header
        let htmlContent = `
		<script>
		function handleSelect(plugin,selected)
		{
        		let json = cur_frm.doc.ui_template;
		        let arr = json? JSON.parse(json) : [];
        		if (selected) arr.push(plugin); 
		        else arr = arr.filter(a=>a!=plugin);
	        	json = JSON.stringify(arr);
		        cur_frm.set_value("ui_template", json);
		}
		</script>
		<div class="form-grid-container">
		<div class="form-grid">
			<div class="grid-heading-row">
				<div class="grid-row">
					<div class="data-row row">
						<div class="col grid-static-col col-xs-1" title="Select">Select</div>
						<div class="col grid-static-col col-xs-6" title="Name">Name</div>
						<div class="col grid-static-col col-xs-4" title="Title">Title</div>
						<div class="col grid-static-col col-xs-1" title="Version">Version</div>
					</div>
				</div>
			</div>
			<div class="grid-body">`;

        // Build table body
	if (plugins.length > 0) {
		plugins.forEach((doc, index) => {
			htmlContent += `<div class="grid-row" data-name="${doc.name}" data-idx="${index + 1}">
				<div class="data-row row">
					<div class="col grid-static-col col-xs-1"><input type="checkbox" ${dict[doc.name] ? "checked" : ""} onclick="handleSelect('${doc.name}',event.target.checked)"/></div>
					<div class="col grid-static-col col-xs-6">${doc.name}</div>
					<div class="col grid-static-col col-xs-4">${doc.title}</div>
					<div class="col grid-static-col col-xs-1">${doc.major}.${doc.minor}</div>
				</div>
			</div>`;
		});
	} else {
		htmlContent += `<div class="grid-empty text-center">
		<img src="/assets/frappe/images/ui-states/grid-empty-state.svg" alt="Grid Empty State" class="grid-empty-illustration">
			No Data
		</div>`;
		
	}

	htmlContent += `</div></div></div>`;
        frm.set_df_property('ui_designer', 'options', htmlContent);
	frm.refresh_field('ui_designer');
}

function handleSelect(plugin,selected)
{
	let json = cur_frm.doc.ui_template;
	let arr = json? JSON.parse(cur_frm.doc.ui_template) : [];
	if (selected) arr.push(plugin);
	else arr = arr.filter(a=>a!=plugin);
	json = JSON.stringify(arr);
	cur_frm.set_value("ui_template", json);
}
