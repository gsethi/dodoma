# =================================================================================================================
#
# Author:
#    Hector Rovira
#    Institute for Systems Biology, Seattle, WA
#
# Description:
#    This script is a shell that transforms the inputs (HTTP query parameters) from the Addama Script Execution Service
#       into the arguments needed for the DoDoMa search script.
#
# Environment variables set in script execution service:
#    DODOMA_SCRIPT_PATH - path to script (pwm_cross_reference_single_search_web.pl)
#
# =================================================================================================================

#echo "Path to script: " $DODOMA_SCRIPT_PATH

echo "Evaluating Inputs for DoDoMa"
echo "- inputs:" $1

# Parsing Query String
saveIFS=$IFS
IFS='=&'
parm=($1)
IFS=$saveIFS
for ((i=0; i<${#parm[@]}; i+=2))
do
  declare var_${parm[i]}=${parm[i+1]}
done

echo "Parameters"
echo "- uniprot_id:[$var_uniprot_id]"
echo "- percent_identity_threshold:[$var_percent_identity_threshold]"
echo "- percent_length_threshold:[$var_percent_length_threshold]"

echo "Executing Search Script: pwm_cross_reference_single_search_web.pl"
perl $DODOMA_SCRIPT_PATH/pwm_cross_reference_single_search_web.pl $var_uniprot_id $var_percent_identity_threshold $var_percent_length_threshold > ${var_uniprot_id}.out
echo "Completed"
exit 0
