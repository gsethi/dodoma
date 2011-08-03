# =================================================================================================================
#
# Author:
#    Hector Rovira
#    Institute for Systems Biology, Seattle, WA
#
# Description:
#    This script downloads and installs latest version of Addama Javascript components from Source Code Control (SVN).
#
# TODO: Include downloads of services from Addama
# =================================================================================================================

CONTENT_ROOT=/local/addama/domains/dodoma.systemsbiology.net/tomcat/webapps/ROOT
ADDAMA_SVN=http://addama.googlecode.com/svn/branches/2.1/user-interfaces/src/main/html/addama/ui

echo "Checking out Addama Javascript Libraries"
mkdir -p $CONTENT_ROOT/js/addama-2.1
mkdir -p $CONTENT_ROOT/css/addama-2.1

svn export $ADDAMA_SVN/dateFormatting.js $CONTENT_ROOT/js/addama-2.1/dateFormatting.js
svn export $ADDAMA_SVN/console_handling.js $CONTENT_ROOT/js/addama-2.1/console_handling.js
svn export $ADDAMA_SVN/jobs/js/jobs.js $CONTENT_ROOT/js/addama-2.1/jobs.js
svn export $ADDAMA_SVN/jobs/css/jobs.css $CONTENT_ROOT/css/addama-2.1/jobs.css

echo "Completed"
