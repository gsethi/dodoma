Ext.onReady(function() {
    Ext.QuickTips.init();

    var latestJob = new LatestJob();

    initJobsForm(latestJob);

    var jobsGrid = new CustomJobsGrid({
        tool: "/addama/tools/dodoma",
        latestJob: latestJob,
        gridPanelConfig: {
            title: "View All Results",
            frame: true,
            border: false,
            autoScroll: true,
            contentEl: "c_jobs_grid",
            height: 400,
            collapsed: true,
            collapsible: true,
            titleCollapse: true,
            padding: "0 0 0 0"
        }
    }).grid;

    new Ext.Viewport({
        layout:'border',
        defaults: {
            border: false,
            margins: "5 5 5 5"
        },
        items:[
            {
                id: "header-panel",
                region: "north",
                height: 100,
                frame: false,
                layout: {
                    type: "hbox",
                    padding: "3",
                    align: "stretchmax"
                },
                items: [
                    { contentEl: "c_banner", flex: 2, border: false },
                    { contentEl: "c_description", flex: 1, border: false }
                ]
            },
            {
                id: "center-panel",
                region: "center",
                frame: true,
                border: false,
                contentEl: "c_main",
                layout: "auto",
                defaults: {
                    frame: false, border:false, padding: "5 0 5 0"
                },
                items: [
                    { contentEl: "c_jobs_form", frame: true },
                    { contentEl: "c_latest_job" },
                    new Ext.Panel({ items: [jobsGrid] })
                ]
            },
            {
                id: "footer-panel",
                region: "south",
                frame: true,
                height: 30,
                contentEl: "c_footer"
            }
        ]
    });
});
