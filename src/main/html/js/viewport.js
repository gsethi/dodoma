Ext.onReady(function() {
    Ext.QuickTips.init();

    var latestJob = new LatestJob();

    initJobsForm(latestJob);

    var jobsGrid = new CustomJobsGrid({
        tool: "/addama/tools/dodoma",
        latestJob: latestJob,
        gridPanelConfig: {
            title: "All Results",
            frame: true,
            border: true,
            autoScroll: true,
            contentEl: "c_jobs_grid",
            height: 400,
            collapsible: false,
            padding: "5 5 5 5"
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
                height: 140,
                frame: false,
                layout: {
                    type: "vbox",
                    align: "stretchmax"
                },
                items: [
                    { contentEl: "c_banner", flex: 3, border: false },
                    { contentEl: "c_description", flex: 3, border: false, frame: true }
                ]
            },
            {
                id: "center-panel",
                region: "center",
                frame: true,
                border: false,
                contentEl: "c_main",
                layout: "border",
                defaults: {
                    frame: false, border:false, padding: "5 5 5 5"
                },
                items: [
                    { contentEl: "c_jobs_form", frame: true, region: "north" },
                    { contentEl: "c_latest_job", region: "west"},
                    new Ext.Panel({ items: [jobsGrid], region: "center", frame: true, border: true, autoScroll: true })
                ]
            },
            {
                id: "footer-panel",
                region: "south",
                frame: true,
                height: 55,
                contentEl: "c_footer"
            }
        ]
    });
});
