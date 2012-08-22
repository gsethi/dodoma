function initJobsForm(latestJob) {
    var searchHandler = function() {
        Ext.MessageBox.show({
            msg: 'Submitting job...',
            width:300,
            wait:true,
            waitConfig: {
                interval:200
            }
        });

        var uid = Ext.getDom("uniprot_id").value;
        var pit = Ext.getDom("perc_idt").value;
        var plt = Ext.getDom("perc_lt").value;

        Ext.Ajax.request({
            method:"POST",
            url: "/addama/tools/dodoma/jobs",
            params: {
                label: uid + " [id=" + pit + ",len=" + plt + "]",
                uniprot_id: uid,
                percent_identity_threshold: pit,
                percent_length_threshold: plt
            },
            success: function(o) {
                var json = Ext.util.JSON.decode(o.responseText);
                latestJob.setCurrent({ jobUri: json.uri, selectedId: uid });
                setTimeout("Ext.MessageBox.hide();", 1000);
            },
            failure: function(o) {
                Ext.MessageBox.alert('Error Submitting Job', o.statusText);
            }
        });
    };

    var fieldSet = new Ext.form.FieldSet({
        border: false,
        region: "center",
        frame: false,
        collapsible: false,
        width: 150,
        height: 150,
        layout: "hbox",
        items: [
            { id: "uniprot_id", xtype: "textfield", name: "uniprot_id", allowBlank:false, emptyText: "Enter a UniProt ID", width: 200 },
            new Ext.Button({ text: "Search", handler: searchHandler })            
        ]
    });

    var advancedFieldSet = new Ext.form.FieldSet({
        title: "Modify Thresholds",
        region: "east",
        border: true,
        frame: true,
        width: 400,
        height: 100,
        defaults: {
            value: 100, increment: 1, minValue: 0, maxValue: 100, allowBlank:false, anchor: '90%'
        },
        layout: "form",
        items: [
            new Ext.form.SliderField({ id: "perc_idt", fieldLabel: "Identity Threshold Percentage" }),
            new Ext.form.SliderField({ id: "perc_lt", fieldLabel: "Length Threshold Percentage" })
        ]
    });

    new Ext.FormPanel({
        layout: "border",
        border: false,
        frame: false,
        height: 150,
        autoScroll: true,
        applyTo: "c_jobs_form",
        items: [ { contentEl: "c_example_ids", region: "north" }, fieldSet, advancedFieldSet ]
    });

    new Ext.ToolTip({ target: "label_uniprotid", html: 'Protein identifiers from Uniprot' });
    new Ext.ToolTip({ target: "label_pit", html: 'Select the threshold of matching identities to be mapped' });
    new Ext.ToolTip({ target: "label_plt", html: 'Select the threshold of sequence length to be mapped' });
}