LatestJob = Ext.extend(Object, {

    constructor: function(config) {
        Ext.apply(this, config);

        LatestJob.superclass.constructor.call(this);

        this.renderTask = { run: this.renderLatest, interval: 3000, scope: this };
        
        this.renderPanel({
            title: "Execute a search and view result here, or select an item from results below.",
            collapsed: true
        });

        this.setCurrent({
            jobUri: Ext.util.Cookies.get("x-addama-latest-job"),
            selectedId: Ext.util.Cookies.get("x-addama-latest-search")
        });
    },

    setCurrent: function(jobDetails) {
        this.jobUri = jobDetails.jobUri;
        this.selectedId = jobDetails.selectedId;

        if (this.jobUri && this.selectedId) {
            Ext.util.Cookies.set("x-addama-latest-job", this.jobUri);
            Ext.util.Cookies.set("x-addama-latest-search", this.selectedId);

            Ext.TaskMgr.start(this.renderTask);
        }
    },

    renderLatest: function() {
        Ext.Ajax.request({
            url: this.jobUri,
            method: "GET",
            success: function(o) {
                var json = Ext.util.JSON.decode(o.responseText);

                var items = [];

                var lineitems = [];
                lineitems[lineitems.length] = "<a target='_blank' href='" + json.log + "'>Job Log</a>";
                
                var status = json.status;
                if (status == "completed" || status == "errored") {
                    Ext.TaskMgr.stop(this.renderTask);

                    if (json.items) {
                        Ext.each(json.items, function(item) {
                            lineitems[lineitems.length] = "<a target='_blank' href='" + item.uri + "'>" + item.name + "</a>";
                        });
                    }

                    this.renderPanel({
                        title: "Search for " + json.label + ": " + status,
                        collapsed: false,
                        items: [
                            { html: lineitems.join(", ") }
                        ],
                        buttons: [
                            new Ext.Button({ text: "Show Detailed Results", handler: this.showPwmSummary, scope: this })
                        ]
                    });
                } else {
                    this.renderPanel({
                        title: "Search for " + json.label + ": " + status,
                        collapsed: true,
                        items: [
                            { html: lineitems.join(", ") }                            
                        ]
                    });
                }
            },
            failure: function() {
                Ext.TaskMgr.stop(this.renderTask);
            },
            scope: this
        });
    },

    renderPanel: function(panelConfig) {
        Ext.getDom("c_latest_job").innerHTML = "";
        
        var defaultConfig = {
            title: "Results",
            renderTo: "c_latest_job",
            collapsible: true,
            titleCollapse: true,
            frame: true,
            buttonAlign: "left"
        };
        new Ext.Panel(Ext.apply(defaultConfig, panelConfig));
    },

    showPwmSummary: function() {
        var selectedId = this.selectedId;
        Ext.Ajax.request({
            url: this.jobUri + "/outputs/pwm_summary.txt",
            method: "GET",
            success: function(o) {
                var text = o.responseText;
                var lines = text.split("\n");

                var data = [];
                Ext.each(lines, function(line) {
                    if (line.indexOf("###") < 0 && line.indexOf("Matrices") < 0) {
                        var colonPlace = line.indexOf(":");
                        var startParen = line.indexOf("(");
                        var endParen = line.indexOf(")");

                        var description = line.substring(0, colonPlace).trim();
                        var uniprotid = line.substring(colonPlace + 1, startParen).trim();
                        var species = line.substring(startParen + 1, endParen).trim();
                        var matrix = line.substring(endParen + 1, line.length).trim();

                        if (uniprotid) {
                            data[data.length] = [uniprotid, species, matrix, description];
                        }
                    }
                });

                if (data.length) {
                    var store = new Ext.data.GroupingStore({
                        reader: new Ext.data.ArrayReader({}, [
                            {name: 'uniprot_id'},
                            {name: 'species'},
                            {name: 'matrices'},
                            {name: 'description'}
                        ]),
                        data: data,
                        sortInfo: { field: "description", direction: "DESC" },
                        groupField: "uniprot_id"
                    });

                    var groupingView = new Ext.grid.GroupingView({
                        forceFit:true,
                        startCollapsed: true,
                        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "results" : "result"]})'
                    });

                    var grid = new Ext.grid.GridPanel({
                        store: store,
                        columns: [
                            { header: "UniProtID", width: 60, sortable: true, hidden: true, dataIndex: 'uniprot_id' },
                            { header: "Species", width: 30, sortable: true, dataIndex: 'species' },
                            { header: "Matrix", width: 20, sortable: true, dataIndex: 'matrices' },
                            { header: "Description", width: 50, sortable: true, dataIndex: 'description' }
                        ],
                        view: groupingView,
                        frame: false,
                        animCollapse: false,
                        listeners: {
                            "viewready": function() {
                                if (selectedId) {
                                    var rowId = store.find('uniprot_id', selectedId);
                                    if (rowId) {
                                        groupingView.toggleRowIndex(rowId, true);
                                    }
                                }
                            }
                        },
                        flex: 7
                    });

                    var textContent = "";
                    textContent += "<ul>";
                    textContent += "<li>Matrices beginning with MA, PB, PH, and PL are JASPAR (open-access)</li>";
                    textContent += "<li>Matrices beginning with UP are UniPROBE (open-access)</li>";
                    textContent += "<li>Matrices beginning with M (and not MA) are TRANSFAC (may require license)</li>";
                    textContent += "</ul>";

                    var gridwin = new Ext.Window({
                        title: "Detailed Results",
                        closable:true,
                        width:700,
                        height:450,
                        plain:true,
                        modal:true,
                        layout: {
                            type:'vbox',
                            padding:'8',
                            align:'stretch'
                        },
                        items: [
                            grid,
                            { html: textContent, flex: 1, margins: "5 0 0 0" }
                        ]
                    });
                    gridwin.show(this);
                } else {
                    Ext.MessageBox.alert("Results not available", parseCarriageReturns(text));
                }
            },
            failure: function(o, e) {
                Ext.MessageBox.alert("Results not available", "Please wait for Status to be 'completed'.  Results " + o.statusText);
            }
        });
    }

});

