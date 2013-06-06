"""
    Python3
"""


import argparse
import os.path
import shutil
import re
import os
import distutils
import distutils.archive_util

import copy_files
import generate_config
import concatenate_files
import optimize


default_htmlFile = '../index.html'
default_copyFilesConfig = 'copy_files_config.txt'
default_concatenateConfig = 'concatenate_config.txt'


def go( htmlFile= default_htmlFile,
        copyFilesConfig= default_copyFilesConfig,
        concatenateConfig= default_concatenateConfig ):
    """
        Arguments:
          copyFilesConfig (str) : path to the config file with the files to copy
    """

        # to guarantee that the paths are relative to the current file's path (and not the working directory)
    htmlFile = os.path.join( os.path.dirname(__file__), htmlFile )
    copyFilesConfig = os.path.join( os.path.dirname(__file__), copyFilesConfig )
    concatenateConfig = os.path.join( os.path.dirname(__file__), concatenateConfig )
    resultingFolder = os.path.join( os.path.dirname(__file__), 'snake' )



    cleanPreviousRun( resultingFolder )

    os.makedirs( resultingFolder )

    copy_files.copyFiles( copyFilesConfig )

    generate_config.generate( htmlFile, concatenateConfig )
    
    concatenatedFileName = 'minimized.js'
    concatenatedFilePath = os.path.join( resultingFolder, concatenatedFileName )


    concatenate_files.concatenate( concatenateConfig, concatenatedFilePath )
    

    removeStrict( concatenatedFilePath )
    
    
        # run it through closure compiler to optimize (the javascript file)
    optimize.js( concatenatedFilePath )
    
       
    createNewIndex( htmlFile, concatenatedFileName, os.path.join( resultingFolder, "index.html" ) )
    

        # zip the folder
    compressFolder( resultingFolder )
    

    

    
def cleanPreviousRun( resultingFolder ):
    """
        Remove the files created from a previous run of this script (the whole folder, basically)

        Arguments:

            path (str) : path to the folder
    """

        # remove the folder
    if os.path.isdir( resultingFolder ):
        shutil.rmtree( resultingFolder )

    resultingZip = resultingFolder + '.zip'
        
        # and the .zip file
    if os.path.isdir( resultingZip ):
        shutil.rmtree( resultingZip )





def compressFolder( resultingFolder ):

    """
    Creates a compressed folder of the release files
    """

    previousPath = os.getcwd()

    distutils.archive_util.make_archive(resultingFolder, 'zip', os.path.join(previousPath, resultingFolder))
    




def removeStrict( jsFile ):

    """
    Removes the 'use strict'; (but the first one) -- closure complains about it
    """
    
    with open( jsFile, 'r' ) as f:
        
        content = f.read()
    
        
        # replace 'use strict'; or "use strict"; for empty string
    newContent = re.sub( '[\'\"]use strict[\'\"];', '', content )
    
    
        # add just one in the beginning
    newContent = "'use strict';" + newContent
    
    
    with open( jsFile, 'w' ) as f:
        
        f.write( newContent )
    
        
        
        


def createNewIndex( indexPath, concatenatedFile, newIndexName ):

    """
    Removes the part between the flags, and adds a single script with the concatenated file

    Arguments:

        indexPath        (string) : name of the index.html file
        concatenatedFile (string) : path to the concatenated file just created
        newIndexName     (string) : name of the new file that is created
    """

        # get the file's content
    index = open( indexPath, 'r' )
    
    text = index.read()
    
    index.close()
    
    startFlag = "<!-- CONCATENATE_START -->"
    endFlag   = "<!-- CONCATENATE_END -->"
    
        # find the position where the flags are

    start = text.find( startFlag )
    end = text.find( endFlag, start )


        # get the part before the start flag
    textBefore = text[ : start ]
    
        # and after the end flag
    textAfter = text[ end + len(endFlag) : ]
    
    
        # create the new file
    newIndexName = os.path.normpath( newIndexName )

    newIndex = open( newIndexName, 'w' )
    
    newIndex.write( textBefore + '<script type="text/javascript" src="' + concatenatedFile + '"></script>' + textAfter )
    
    newIndex.close()
    
    print( "Created file:", newIndexName )
    
        

if __name__ == '__main__':

    parser = argparse.ArgumentParser( description='Generate the release files of the program.' )

    
    parser.add_argument( 'htmlFile', help='Path to the index.html.', nargs='?', default= default_htmlFile )

    parser.add_argument( 'copyFilesConfig', help='Path to the config file with the files to copy', nargs='?', default= default_copyFilesConfig )

    parser.add_argument( 'concatenateConfig', help='Path to the configuration file to tell which files to concatenate (and the order).', nargs='?', default= default_concatenateConfig )

    args = parser.parse_args()

    go( args.htmlFile, args.copyFilesConfig, args.concatenateConfig )

