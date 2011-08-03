# =================================================================================================================
#
# Author:
#    Hector Rovira
#    Institute for Systems Biology, Seattle, WA
#
# Description:
#    This script downloads and installs required Javascript library ExtJS.
#    This version of the library is open source, for limited use.
#    Please review the terms of the license before using:  http://www.sencha.com/products/extjs/license/
#       ExtJS Home:  http://sencha.com/extjs
#       Examples:    http://dev.sencha.com/deploy/dev/examples/
#
# =================================================================================================================

CONTENT_ROOT=/local/addama/domains/dodoma.systemsbiology.net/tomcat/webapps/ROOT

mkdir -p $CONTENT_ROOT/js

echo "Downloading ExtJS"
wget http://extjs.cachefly.net/ext-3.3.1.zip

echo "Installing ExtJS"
unzip ext-3.3.1.zip -d $CONTENT_ROOT/js/

echo "Cleanup"
rm ext-3.3.1.zip

echo "Completed"