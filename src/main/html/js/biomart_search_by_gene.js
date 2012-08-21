function selectId(id) {
    Ext.getDom("uniprot_id").value = id;
    return false;
}

Ext.onReady(function() {
    var renderCheckFn = function(val) {
        if (val && val == true) return "&#10003;";
        return "";
    };

    var link =  Ext.get("c_search_biomart");
    link.on("click", function() {
        new BioMartMashupSearch({
            fields: [
                { key: "Accession", name: "accession" },
                { key: "verified", name: "verified" },
                { key: "Organism", name: "organism" },
                { key: "Protein name", name: "protein_name" }
            ],
            columns: [
                { xtype: 'gridcolumn', id: "accession", header: "UniprotID", sortable: true, width: 70 },
                { xtype: 'gridcolumn', id: "verified", header: "Reviewed by Uniprot", renderer:renderCheckFn, sortable: true, width: 120 },
                { xtype: 'gridcolumn', id: "organism", header: "Organism", sortable: true, width: 140 },
                { xtype: 'gridcolumn', id: "protein_name", header: "Description", sortable: true }
            ],
            listeners: {
                "select": function(data) {
                    if (data) {
                        selectId(data.accession);
                    }
                }
            }
        });
    });
});

BioMartMashupSearch = Ext.extend(Ext.util.Observable, {
    constructor: function(config) {
        Ext.apply(this, config);

        this.addEvents({ select: true });

        BioMartMashupSearch.superclass.constructor.call(this);

        this.searchInput = new Ext.form.TextField({ allowBlank: false });

        this.store = new Ext.data.ArrayStore({
            fields: this.fields,
            data: []
        });

        this.rowSelectionModel = new Ext.grid.RowSelectionModel({singleSelect:true});
        this.rowSelectionModel.on("rowselect", function(selModel, rowIndex, record) {
            this.fireEvent("select", record.data);
            this.win.close();
        }, this);

        var searchPanel = new Ext.Panel({
            width:400,
            flex: 1,
            layout: "hbox",
            frame: false,
            border: true,
            title: "Enter a Gene Symbol",
            items: [
                this.searchInput,
                new Ext.Button({
                    text: "Lookup",
                    handler: this.lookupHandler,
                    scope: this
                })
            ]
        });

        var gridPanel = new Ext.grid.GridPanel({
            store: this.store,
            columns: this.columns,
            title: "Select a Uniprot ID",
            sm: this.rowSelectionModel,
            autoScroll: true,
            stripeRows: true,
            columnLines: true,
            frame: false,
            border: true,
            collapsible: false,
            animCollapse: false,
            flex: 5,
            autoExpandColumn: "protein_name"
        });

        this.win = new Ext.Window({
            title: "Lookup Uniprot IDs by Gene Symbol (biomart.org)",
            closable:true,
            width:600,
            height:350,
            plain:true,
            modal:true,
            layout: {
                type:'vbox',
                padding:'8',
                align:'stretch'
            },
            items: [searchPanel, gridPanel]
        });
        this.win.show(this);
    },

    lookupHandler: function() {
        this.searchValue = this.searchInput.getValue();

        var query = "";
        query += '<Query formatter="TSV" header="1">';
        query += '<Dataset name="uniprot">';
        query += '<Filter name="gene_name" value="' + this.searchValue + '"/>';
        query += '<Attribute name="accession"/>';
        query += '<Attribute name="organism"/>';
        query += '<Attribute name="protein_name"/>';
        query += '<Attribute name="entry_type"/>';
        query += '</Dataset>';
        query += '</Query>';

        Ext.Ajax.request({
            url: "/addama/biomart/martservice",
            method: "GET",
            headers: {
                "x-addama-simpleproxy-transform": "tsvToJsonItems"
            },
            params: {
                query: query
            },
            success: this.loadData,
            scope: this
        });
    },

    loadData: function(o) {
        var json = Ext.util.JSON.decode(o.responseText);
        if (json && json.numberOfItems && json.numberOfItems > 0) {
            var data = [];
            var unsorted_data = json.items;
            Ext.each(json.items, function(item) {
                var status = item.Status;
                item["verified"] = (status && status == "Swiss-Prot");
            });

            var sorted_data = unsorted_data.sort(function(a,b) {
                if (a && b) {
                    if (a.verified && !b.verified) return -1;
                    if (!a.verified && b.verified) return 1;

                    var firstSpecies = "homo sapiens";
                    var aOrganism = (a.Organism) ? a.Organism.toLowerCase() : "";
                    var bOrganism = (b.Organism) ? b.Organism.toLowerCase() : "";

                    if (aOrganism == firstSpecies && bOrganism != firstSpecies) return -1;
                    if (aOrganism != firstSpecies && bOrganism == firstSpecies) return 1;
                    return a.Organism > b.Organism;
                }
            });

            Ext.each(sorted_data, function(item) {
                var row = [];
                Ext.each(this.fields, function(field) {
                    row[row.length] = item[field.key];
                });
                data[data.length] = row;
            }, this);

            this.store.loadData(data);
        } else {
            Ext.MessageBox.alert("BioMart.org Search", "No results found for " + this.searchValue + ". Please try again.");
        }
    }
});
