#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys

BASEPATH = 'app/i18n'
BUILDDIR = 'build/i18n'

# first command line argument overwrites BASEPATH
if len(sys.argv) > 1:
	BASEPATH = sys.argv[1]

# second command line argument overwrites BUILDDIR
if len(sys.argv) > 2:
	BUILDDIR = sys.argv[2]

directories = [item for item in os.listdir(BASEPATH) if os.path.isdir('/'.join((BASEPATH, item)))]

for language in directories:
	buildFile = open('/'.join((BUILDDIR, language)) + '.json', 'w')

	buildFile.write('{\n')

	for readFileName in os.listdir('/'.join((BASEPATH, language))):
		buildFile.write('\'' + readFileName[:-5] + '\':\n')
		readFileHandler = open('/'.join((BASEPATH, language, readFileName)), 'r')
		buildFile.write(readFileHandler.read())
		readFileHandler.close()
		buildFile.write(',\n')

	buildFile.write('}\n')

	buildFile.close()