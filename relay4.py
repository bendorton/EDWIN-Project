#!/usr/bin/env python3

"""Unpack a MIME message into a directory of files."""

import os
import email
import mimetypes
import smtplib
import sys
import ipaddress
import requests

from email.message import EmailMessage
from email.policy import default, SMTP
from argparse import ArgumentParser
from datetime import datetime


def main():

#   GET EMAIL MESSAGE AS STDIN 
 
    inmsg = ""
    for line in sys.stdin:
        inmsg += line

    msg = email.message_from_string(inmsg)
    camip = msg['from'].split('@')[0]
    if camip.find('<') > 1:
        camip = camip.split('<')[1]
    camdot = camip.replace('-', '.')
   

#   VERIFY SENDER IP ADDRESS

    try:
        ip = ipaddress.ip_address(camdot)
        #print('valid ip')
    except:
        #print('invalid ip')
        sys.exit('invalid incoming email sender')

    #getcamparams = (('ipAddress', camdot))

    getcam = requests.get('http://127.0.0.1:3030/camera/get/ip?ipAddress=' + camdot)
    #print(getcam)
    try:
        camdata = getcam.json()
        #print(camdata)
        cameraId = str(camdata['id'])
       # print(cameraId)
        prevstatus = camdata['status']
        #print(prevstatus)
    except:
        #print('"' + camdot + '"')
        sys.exit('invalid incoming email sender ip')
    

#   CREATE DIRECTORY FOR ATTACHMENTS

    directory =  "/home/edwin/emailscript/alert_history/" + datetime.now().strftime("%m-%d-%Y-%H:%M:%S-") + camip
    try:
        os.mkdir(directory)
    except FileExistsError:
        print('could not create directory for email attachments')
        pass


#   DOWNLOAD MESSAGE ATTACHMENTS

    counter = 1
    for part in msg.walk():
        # multipart/* are just containers
        if part.get_content_maintype() == 'multipart':
            continue
        # Applications should really sanitize the given filename so that an
        # email message can't be used to overwrite important files
        filename = part.get_filename()
        if not filename:
            ext = mimetypes.guess_extension(part.get_content_type())
            if not ext:
                # Use a generic bag-of-bits extension
                ext = '.bin'
            filename = f'part-{counter:03d}{ext}'
        counter += 1
        with open(os.path.join(directory, filename), 'wb') as fp:
            fp.write(part.get_payload(decode=True))
#            os.chown(fp, 1000, 1000)


#   LOG CAMERA ALERT

    snapshot = os.path.join(directory, os.listdir(directory)[1])
    #print('path to snapshot: ' + snapshot)
    eheaders = {'accept': '*/*', 'Content-Type': 'application/json'}
    alertdata = '{"alertType":"High Temperature","cameraId":"'+ cameraId + '","filePath":"' + snapshot + '","message":"High Temperature alert detected","status":"active"}'
    postalert = requests.post('http://127.0.0.1:3030/alert', headers = eheaders, data=alertdata)

#   UPDATE CAMERA STATUS

    putdata = '{"id":' + cameraId + ',"status":"alert"}'
    putcam = requests.put('http://127.0.0.1:3030/camera', headers=eheaders, data=putdata)


#   COMPOSE MESSAGE TO GO OUT

    emsg = EmailMessage()
    emsg['Subject'] = 'Thermal Camera Alert from ' + camdot
    emsg['From'] = 'edwin_relay@edwinproject.local'
    content = "An alert was triggerted on thermal camera " + camdot + ", Please see the attached images and the live feed at fire.edwinproject.org" 
    content += "\ncamera ID: " + cameraId
    content += "\nprevious camera status: " + prevstatus
    emsg.set_content(content)


#   GET 'SEND TO' LIST   

    emaillist = requests.get('http://127.0.0.1:3030/alert/emails/' + cameraId) 
    emailstring = ''
    for mail in emaillist.json():
        emailstring += mail + ', '        
    emsg['To'] = emailstring[:-2]
    

#   ADD ATTACHMENTS TO EMAIL

    for fn in os.listdir(directory)[1:]:
        path = os.path.join(directory, fn)
        if not os.path.isfile(path):
            continue
        ctype, encoding = mimetypes.guess_type(path)
        if ctype is None or encoding is not None:
            ctype = 'application/octet-stream'
        maintype, subtype = ctype.split('/', 1)
        with open(path, 'rb') as fp:
                emsg.add_attachment(fp.read(), maintype=maintype, subtype=subtype, filename=filename)
    

#   CONNECT TO SMTP SERVER AND SEND

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
#        server.ehlo()
        server.login('edwinnotification1@gmail.com', 'smokeybearcapstone')
        server.send_message(emsg)
        server.close()
    except:
        print('Not able to connect to smtp.gmail.com')

    print("Sent!")

if __name__ == '__main__':
    main()
