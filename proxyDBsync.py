#!/usr/bin/python3

'''
Completed by Kendall Clinger - 6 April 2020

README
For now, this script is intended to be run manually when a new camera is added
to the EDWIN project database or when a camera is removed from the database.
This script keeps the camera stream proxy server in sync so that new and old
camera streams are added to and removed from the proxy server, respectively.
Further documentation can be found in the EDWIN project wiki.

'''

#libraries for establishing connection to mariadb and interfacing with web APIs
import pymysql,json,requests


def manageStreamTable():

    #open database connection
    db = pymysql.connect("69.162.231.249","smokey","bear","edwin")

    #prepare cursor objects using cursor() method
    cameraCursor = db.cursor()
    streamCursor = db.cursor()
    modifyCursor = db.cursor()

    #SQL statements to get id field from camera and stream tables
    cameraSQL = "SELECT id FROM camera"
    streamSQL = "SELECT camera_id FROM stream"
    newStreamSQL = "INSERT INTO stream (camera_id, url, output_format, createdAt, updatedAt, proxy_id) VALUES (%s, '', NULL, current_timestamp(), current_timestamp(), NULL)"
    deleteStreamSQL = "DELETE FROM stream WHERE id=%s;"

    try:
        #execute SQL statements
        cameraCursor.execute(cameraSQL)
        streamCursor.execute(streamSQL)

        #fetch all rows in SQL results and store in Results variables
        cameraResults = cameraCursor.fetchall()
        streamResults = streamCursor.fetchall()


    except:
        print("SQL Error")


    #if camera table id doesn't have a stream table id match, create new stream object to match
    for camID in cameraResults:
        streamExists = False
        for streamID in streamResults:
            if camID[0] == streamID[0]:
                streamExists = True
    if streamExists == False:
        try:
            modifyCursor.execute(newStreamSQL, (camID[0],))

            #commit changes to the db
            db.commit()

        except:
            print("SQL Error")

    #if stream table id doesn't match an id in camera table, delete stream object
    for streamID in streamResults:
        idExists = False
        for camID in cameraResults:
            if camID[0] == streamID[0]:
                idExists = True
    if idExists == False:
        try:
            modifyCursor.execute(deleteStreamSQL, (camID[0],))

            #commit changes to the db
            db.commit()

        except:
            print("SQL Error")



    #disconnect from server
    db.close()

def removeDeadStreams():

    #set variables required for proxy server API use, specifically for list method
    api_list_url = 'http://69.162.231.249:4040/list'
    api_stop_url = 'http://69.162.231.249:4040/stop'
    headers = {'Content-Type': 'application/json'}

    #send API request to proxy server and save results
    response = requests.get(api_list_url, headers=headers)
    if response.status_code == 200:
            apiResults = json.loads(response.content.decode('utf-8'))
    else:
        apiResults = None

    #open database connection
    db = pymysql.connect("69.162.231.249","smokey","bear","edwin")

    #prepare a cursor object using cursor() method
    cursor = db.cursor()

    #SQL statement to get proxy_id field from stream table
    sql = "SELECT proxy_id FROM stream"

    try:
        #execute SQL statement
        cursor.execute(sql)

        #fetch all rows in SQL results and store in dbresults
        dbresults = cursor.fetchall()

    except:
        print("SQL Error")

    #disconnect from server
    db.close()

    #stop and delete proxy server streams that don't have a corresponding entry in the streams table
    if apiResults is not None:

        #for every proxy stream
        for k in range(0, len(apiResults)):

            #set boolean to keep track of whether or not we match a db proxy_id with a proxy server id
            streamExists = False

            #check if the current proxy server id matches any proxy_ids from the db
            for proxy_id in dbresults:
                if apiResults[k]['id'] == proxy_id[0]:
                    streamExists = True

            #if the proxy stream id doesn't match a db proxy_id (camera has been deleted), delete the proxy stream
            if streamExists == False:
                payload = json.dumps({"id": "{}".format(apiResults[k]['id']), "remove": True, "wait": False})
                stop_response = requests.post(api_stop_url, data=payload)
    else:
        print('[!] Request Failed')

def addNewStreams():

    #set variables required for proxy server API use, specifically for start method
    api_start_url = 'http://69.162.231.249:4040/start'

    #open database connection
    db = pymysql.connect("69.162.231.249","smokey","bear","edwin")

    #prepare a cursor object using cursor() method
    cursor = db.cursor()

    #SQL statement to get applicable camera table contents joined with their respective stream table contents
    sql = "SELECT camera.id, direct_url, proxy_id FROM camera INNER JOIN stream ON camera.id = stream.camera_id"

    try:
        #execute SQL statement
        cursor.execute(sql)

        #fetch all rows in SQL results and store in dbresults
        dbresults = cursor.fetchall()

    except:
        print("SQL Error")


    #check streams for entries that don't already have a value in proxy_id, signaling a new camera installation
    for dbrow in dbresults:

        #check to see if proxy_id is NULL or empty
        if (dbrow[2] == None) or (dbrow[2] == ''):

            #format the API request payload with the RTSP URL
            payload = json.dumps({"uri": "{}".format(dbrow[1])})

            #send API request to proxy server and save results
            start_response = requests.post(api_start_url, data=payload)

            #if successful, format API response for parsing as JSON object
            if start_response.status_code == 200:
                apiResults = json.loads(start_response.content.decode('utf-8'))

                #update streams in stream table with new HLS URI and update format to hls
                sql = "UPDATE stream SET url = '{}', proxy_id = '{}', output_format = 'hls' WHERE id = {}".format(apiResults['uri'], apiResults['id'], dbrow[0])

                try:
                    #execute SQL statement
                    cursor.execute(sql)

                    #commit changes to the db
                    db.commit()

                except:

                    #rollback changes to the db
                    db.rollback()

                    print("SQL Error")

    #disconnect from server
    db.close()

#create new stream table objects for new cameras, remove stream table objects for removed cameras
#remove proxy server streams where cameras have been removed, add proxy server streams where cameras have been added
manageStreamTable()
removeDeadStreams()
addNewStreams()