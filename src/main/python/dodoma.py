import httplib
import time
import urllib
import sys

try: import json #python 2.6 included simplejson as json
except ImportError: import simplejson as json

HOST = "dodoma.systemsbiology.net"
URI = "/addama/tools/dodoma/jobs"

def getJson(uri):
    print("[json] GET https://" + HOST + uri)

    conn = httplib.HTTPSConnection(HOST)
    conn.request("GET", uri, {}, {})

    resp = conn.getresponse()
    try:
        output = resp.read()
        jsonObj = json.JSONDecoder().decode(output)
        return jsonObj
    except:
        print resp.status, resp.reason
        return None

    finally:
        conn.close()

def downloadFile(outputObj):
    uri = outputObj["uri"]
    name = outputObj["name"]

    print("[download] GET https://" + HOST + uri + " into " + name)

    conn = httplib.HTTPSConnection(HOST)
    conn.request("GET", uri, {}, {})
    resp = conn.getresponse()
    if resp.status == 200:
        fsock = open(name, 'w')
        fsock.write(resp.read())
        fsock.close()
    else:
        print resp.status, resp.reason

    conn.close()

def postJob(paramMap):
    print("[job] POST https://" + HOST + URI)

    params = urllib.urlencode(paramMap)
    print "parameters: [" + params + "]"

    conn = httplib.HTTPSConnection(HOST)
    conn.request("POST", URI, params, {"Content-type": "application/x-www-form-urlencoded" })

    resp = conn.getresponse()

    if resp.status == 200:
        output = resp.read()
        try:
            jsonObj = json.JSONDecoder().decode(output)
            print json.dumps(jsonObj, sort_keys=True, indent=4)
            jobUri = jsonObj["uri"]
        except:
            print output
    else:
        print resp.status, resp.reason

    conn.close()

    if jobUri is not None:
        checkStatus(jobUri)


def checkStatus(uri):
    print("[status] GET https://" + HOST + uri)

    while True:
        job = getJson(uri)
        jobStatus = "pending"
        if job is not None and job["status"] is not None:
            jobStatus = job["status"]
            if jobStatus  == "completed":
                jobOutputs = getJson(uri)
                for outputObj  in jobOutputs["items"]:
                    downloadFile(outputObj)
                break;
            elif jobStatus == "errored":
                print "Errors in Job"
                downloadFile(uri + "/log")
                break;

        print "Job " + jobStatus + "; checking again"
        time.sleep(5)
    print "Job Completed"
    
if __name__ == "__main__":
    numberOfArgs = len(sys.argv)
    if (numberOfArgs < 4):
        print "Usage"
        print "   python dodoma.py UNIPROT_ID PERCENT_IDENTITY_THRESHOLD PERCENT_LENGTH_THRESHOLD"
        print "      UNIPROT_ID -> protein identifier from uniprot"
        print "      PERCENT_IDENTITY_THRESHOLD -> 1-100%"
        print "      PERCENT_LENGTH_THRESHOLD -> 1-100%"
        sys.exit(0)

    paramMap = {}
    paramMap["uniprot_id"] = sys.argv[1]
    paramMap["percent_identity_threshold"] = sys.argv[2]
    paramMap["percent_length_threshold"] = sys.argv[3]

    postJob(paramMap)