# =================================================================================================================
#
# Author:
#    Hector Rovira
#    Institute for Systems Biology, Seattle, WA
#
# Description:
#    This script downloads and installs latest version of DoDoMa user interface from Source Code Control (SVN).
#
# =================================================================================================================

CONTENT_ROOT=/local/addama/domains/dodoma.systemsbiology.net/tomcat/webapps/ROOT/
DODOMA_SVN=http://cancerregulome.googlecode.com/svn/trunk/dodoma/src/main/html

mkdir -p $CONTENT_ROOT

echo "Checking out DoDoMa User Interface"
svn export --force $DODOMA_SVN $CONTENT_ROOT

echo "Completed"

