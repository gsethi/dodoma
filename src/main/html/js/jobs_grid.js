CustomJobsGrid = Ext.extend(JobsGridForTool, {

    constructor: function(config) {
        Ext.apply(this, config);

        this.rowExpander = new Ext.ux.grid.RowExpander({});

        CustomJobsGrid.superclass.constructor.call(this);

        this.selectionModel.on("selectionchange", function(sm) {
            var records = sm.selections.items;
            if (records) {
                if (records.length) {
                    var record = records[records.length-1];
                    if (record) {
                        var joblabel = record.data.job;
                        var pos = joblabel.indexOf(" [");
                        var selectedId = joblabel.substring(0, pos).trim();
                        this.latestJob.setCurrent({ jobUri: record.data.uri, selectedId: selectedId });
                    }
                }
            }
        }, this);
    },

    getStoreColumns: function() {
        return [
            {name: 'idx'},
            {name: 'uri'},
            {name: 'lastChangeDay', type: 'date' },
            {name: 'job'},
            {name: 'owner'},
            {name: 'status'},
            {name: 'durationInSeconds', type: 'int'},
            {name: 'lastModified', type: 'date' }
        ];
    },

    getGridColumns: function() {
        return [
            this.selectionModel,
            {
                header: "Date", width: 25, dataIndex: "lastChangeDay", type: "date",
                sortable: true, hidden: true, renderer: Ext.util.Format.dateRenderer()
            },
            { header: "URI", width: 25, dataIndex: 'uri', sortable: false, hidden: true },
            { header: "Job", width: 40, sortable: true, dataIndex: 'job' },
            { header: "Owner", width: 30, hidden: true, dataIndex: 'owner' },
            { header: "Status", width: 20, sortable: true, dataIndex: 'status' },
            { header: "Duration (secs)", width: 20, sortable: true, hidden: true, dataIndex: 'durationInSeconds' },
            { header: "Last Modified", sortable: true, hidden: true, dataIndex: 'lastModified',
                type: "date", renderer: getFormattedDate }
        ];
    },

    addJob: function(job) {
        var jobPointer = this.getJobPointer(job);
        var jobBean = new JobBean(job);
        this.gridData[jobPointer] = [
            jobPointer,
            job.uri,
            job.lastModified,
            jobBean.getLabel(),
            jobBean.getOwner(),
            job.status,
            job.durationInSeconds,
            job.lastModified
        ];            
    }

});

