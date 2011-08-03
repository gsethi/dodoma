# =================================================================================================================
#
# Author:
#    Hector Rovira
#    Institute for Systems Biology, Seattle, WA
#
# Description:
#    This script downloads and installs Apache Tomcat 7 web application server.
#       To configure the web server settings (e.g. port, SSL), edit $TOMCAT_HOME/conf/server.xml
#       To startup Tomcat, ./$TOMCAT_HOME/bin/startup.sh
#       Default port 8080, for example: http://localhost:8080/
#
#    For more information on Tomcat:  http://tomcat.apache.org/
#
# =================================================================================================================

INSTALL_DIR=/local/addama/domains/dodoma.systemsbiology.net

echo "Downloading Apache Tomcat"
wget http://www.ecoficial.com/apachemirror/tomcat/tomcat-7/v7.0.11/bin/apache-tomcat-7.0.11.tar.gz

echo "Extracting Apache Tomcat"
mkdir -p $INSTALL_DIR
tar xfz apache-tomcat-7.0.11.tar.gz -C $INSTALL_DIR

echo "Installing Apache Tomcat"
TOMCAT_HOME=$INSTALL_DIR/tomcat
mv $INSTALL_DIR/apache-tomcat-7.0.11 $TOMCAT_HOME

echo "Removing unneeded files"
rm -rf $TOMCAT_HOME/webapps/docs
rm -rf $TOMCAT_HOME/webapps/examples
rm -rf $TOMCAT_HOME/webapps/host-manager
rm -rf $TOMCAT_HOME/webapps/manager

rm $TOMCAT_HOME/webapps/ROOT/*.png
rm $TOMCAT_HOME/webapps/ROOT/*.gif
rm $TOMCAT_HOME/webapps/ROOT/*.xml
rm $TOMCAT_HOME/webapps/ROOT/*.ico
rm $TOMCAT_HOME/webapps/ROOT/*.jsp
rm $TOMCAT_HOME/webapps/ROOT/*.txt
rm $TOMCAT_HOME/webapps/ROOT/*.css
rm $TOMCAT_HOME/webapps/ROOT/*.svg

echo "Cleanup"
rm apache-tomcat-7.0.11.tar.gz

echo "Completed"
