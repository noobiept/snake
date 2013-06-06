"""
    python3
    
    Creates the template for the server based on the index.html
    
    it searches for all the scripts tags, and adds {{ STATIC_URL }}appName/
"""

import os.path
import argparse
import re

from bs4 import BeautifulSoup



default_indexPath = '../index.html'
default_appName = 'snake'
default_copyToPath = '../../../website/templates/{}/'.format( default_appName )


def createTemplate( indexPath= default_indexPath, appName= default_appName, copyToPath= default_copyToPath, templateName= None ):

    indexPath = os.path.join( os.path.dirname(__file__), indexPath )
    copyToPath = os.path.join( os.path.dirname(__file__), copyToPath )


    with open( indexPath, 'r' ) as f:
        content = f.read()


    soup = BeautifulSoup( content )

        # deal with all the <script>

    allScripts = soup.find_all( 'script' )

    for script in allScripts:

        script['src'] = '{{ STATIC_URL }}' + appName + '/' + script['src']


        # deal with all the <link>

    allLinks = soup.find_all( 'link' )

    for link in allLinks:

        link[ 'href' ] = '{{ STATIC_URL }}' + appName + '/' + link[ 'href' ]


        # add a <script> at the end of the <head>
    newScript = soup.new_tag( 'script' )

    newScript.string = "var TYPE = 'server';\nvar BASE_URL = '{{ STATIC_URL }}%s/';" % appName

    soup.find( 'head' ).append( newScript )


        # create the new file
    if not templateName:
        fileName = os.path.basename( indexPath )
        
    else:
        fileName = templateName
        

    with open( os.path.join( copyToPath, fileName ), 'w' ) as f:

        f.write( soup.prettify() )





if __name__ == '__main__':

    parser = argparse.ArgumentParser( description='Create the server template.' )

    parser.add_argument( 'indexPath', nargs= '?', default= default_indexPath )
    parser.add_argument( 'appName', nargs= '?', default= default_appName )
    parser.add_argument( 'copyToPath', nargs= '?', default= default_copyToPath )

    args = parser.parse_args()

    createTemplate( args.indexPath, args.appName, args.copyToPath )